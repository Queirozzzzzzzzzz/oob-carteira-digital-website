import database from "infra/database";
import bcrypt from "bcrypt";
const passwordSaltRounds = 10;

// QUERY STRINGS
const SELECT_ACCOUNT_FROM_CPF_QUERY = "SELECT * FROM account WHERE cpf = ?;";
const SELECT_ACCOUNTS_INFO_QUERY =
  "SELECT student.*, account.* FROM account LEFT JOIN student ON account.id = student.account_id;";
const SELECT_STUDENTS_INFO_QUERY =
  "SELECT student.*, account.* FROM student LEFT JOIN account ON account_id = account.id;";
const SELECT_INFO_BY_CPF_QUERY = `
 SELECT student.*, account.*
 FROM account
 LEFT JOIN student ON account.id = student.account_id
 WHERE account.cpf = ?;
`;
const INSERT_ACCOUNT_QUERY =
  "INSERT INTO account ( is_admin, is_student, full_name, email, password, birth_date, cpf, institution, status ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? );";
const INSERT_STUDENT_QUERY =
  "INSERT INTO student (account_id, end_date, registration, level, course, `class`) VALUES (?, ?, ?, ?, ?, ?);";
const DELETE_STUDENT_QUERY = "DELETE FROM student WHERE account_id = ?;";
const SELECT_ACCOUNT_ID_QUERY = "SELECT id FROM account WHERE cpf = ?";
const UPDATE_ACCOUNT_QUERY =
  "UPDATE account SET is_admin = ?, is_student = ?, full_name = ?, email = ?, birth_date = ?, institution = ?, status = ? WHERE cpf = ?;";
const UPDATE_STUDENT_QUERY = `
 UPDATE student
 SET end_date = ?, registration = ?, level = ?, course = ?, class = ?
 WHERE account_id = ?;
`;
const UPDATE_ACCOUNT_NON_ADMIN_QUERY =
  "UPDATE account SET email = ?, picture = ? WHERE cpf = ?;";
const UPDATE_PASSWORD_QUERY = "UPDATE account SET password = ? WHERE cpf = ?;";
const UPDATE_LAST_LOGIN_QUERY =
  "UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE cpf = ?;";
const DELETE_ACCOUNT_FROM_ACCOUNT_ID_QUERY =
  "DELETE FROM account WHERE account_id = ?;";
const SELECT_STUDENT_FROM_ACCOUNT_ID_QUERY =
  "SELECT * FROM student WHERE account_id = ?";

// FUNCTIONS
async function getAccountsInfo() {
  const info = await database.query(SELECT_ACCOUNTS_INFO_QUERY);

  info.forEach((row) => {
    if (row.account_id == null) {
      delete row.end_date;
      delete row.registration;
      delete row.level;
      delete row.course;
      delete row.class;
    }
    delete row.account_id;
    delete row.password;
  });

  return info;
}

async function getStudentsInfo() {
  const info = await database.query(SELECT_STUDENTS_INFO_QUERY);

  info.forEach((row) => {
    delete row.account_id;
    delete row.password;
  });

  return info;
}

async function getInfo(cpf) {
  const info = await database.query(SELECT_INFO_BY_CPF_QUERY, [cpf]);

  if (info.length === 0) {
    return "Esta conta não foi encontrada.";
  }

  info.forEach((row) => {
    delete row.account_id;
  });

  return info[0];
}

async function addAccount(accountDetails) {
  const {
    is_admin,
    is_student,
    full_name,
    email,
    password,
    birth_date,
    cpf,
    institution,
    status,
    end_date,
    registration,
    level,
    course,
    class: classValue,
  } = accountDetails;

  if (Object.prototype.toString.call(await getInfo(cpf)) == "[object Object]")
    return "Este CPF já está cadastrado!";

  const isAdmin = is_admin == "on" ? "1" : "0";
  const isStudent = is_student == "on" ? "1" : "0";

  const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);

  const result = await database.query(INSERT_ACCOUNT_QUERY, [
    isAdmin,
    isStudent,
    full_name,
    email,
    hashedPassword,
    birth_date,
    cpf,
    institution,
    status,
  ]);

  if (isStudent) {
    if (!registration || !level || !course || !classValue) {
      return "Todos os campos devem estar preenchidos.";
    }

    try {
      await database.query(INSERT_STUDENT_QUERY, [
        result.insertId,
        end_date,
        registration,
        level,
        course,
        classValue,
      ]);
    } catch (err) {
      await database.query(DELETE_ACCOUNT_FROM_ACCOUNT_ID_QUERY, [
        result.insertId,
      ]);
      throw err;
    }
  }

  return "Conta criada com sucesso!";
}

async function adminUpdateAccount(accountDetails) {
  const {
    is_admin,
    is_student,
    full_name,
    email,
    password,
    birth_date,
    cpf,
    institution,
    status,
    end_date,
    registration,
    level,
    course,
    class: classValue,
  } = accountDetails;

  const isAdmin = is_admin == "on" ? "1" : "0";
  const isStudent = is_student == "on" ? "1" : "0";

  let accountId;
  try {
    const result = await database.query(SELECT_ACCOUNT_ID_QUERY, [cpf]);
    if (result.length > 0) {
      accountId = result[0].id;
    } else {
      throw new Error("Account not found");
    }
  } catch (error) {
    console.error("Failed to fetch account_id:", error);
    return "Conta não pôde ser atualizada!";
  }

  const queries = [];

  if (password) {
    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    queries.push({
      queryString: UPDATE_PASSWORD_QUERY,
      params: [hashedPassword, cpf],
    });
  }

  queries.push({
    queryString: UPDATE_ACCOUNT_QUERY,
    params: [
      isAdmin,
      isStudent,
      full_name,
      email,
      birth_date,
      institution,
      status,
      cpf,
    ],
  });

  if (isStudent == 1) {
    const studentExists = await database.query(
      SELECT_STUDENT_FROM_ACCOUNT_ID_QUERY,
      [accountId]
    );

    if (studentExists.length > 0) {
      queries.push({
        queryString: UPDATE_STUDENT_QUERY,
        params: [end_date, registration, level, course, classValue, accountId],
      });
    } else {
      queries.push({
        queryString: INSERT_STUDENT_QUERY,
        params: [accountId, end_date, registration, level, course, classValue],
      });
    }
  } else {
    queries.push({
      queryString: DELETE_STUDENT_QUERY,
      params: [accountId],
    });
  }

  try {
    await database.transaction(queries);
  } catch (err) {
    console.error("Transaction failed:", err);
    if (
      err.code === "ER_DUP_ENTRY" ||
      err.message.includes("Duplicate entry")
    ) {
      return "Número de matrícula duplicado, não foi possível adicionar informações de estudante!";
    }
    return "Houve um erro ao atualizar a conta!";
  }

  return "Conta atualizada com sucesso!";
}

async function updateAccount(accountDetails, payload) {
  const { email, password, picture } = accountDetails;

  const queries = [];

  if (password) {
    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    queries.push({
      queryString: UPDATE_PASSWORD_QUERY,
      params: [hashedPassword, payload.cpf],
    });
  }

  queries.push({
    queryString: UPDATE_ACCOUNT_NON_ADMIN_QUERY,
    params: [email, picture, payload.cpf],
  });

  try {
    await database.transaction(queries);
  } catch (err) {
    console.error("Transaction failed:", err);
    if (
      err.code === "ER_DUP_ENTRY" ||
      err.message.includes("Duplicate entry")
    ) {
      return "Número de matrícula duplicado, não foi possível adicionar informações de estudante!";
    }
    return "Houve um erro ao atualizar a conta!";
  }

  return "Conta atualizada com sucesso!";
}

async function signin(cpf, password) {
  let account = await database.query(SELECT_ACCOUNT_FROM_CPF_QUERY, [cpf]);

  if (account.length === 0) return "Esta conta não está cadastrada.";

  if (!(await bcrypt.compare(password, account[0].password.toString())))
    return "Senha inválida.";

  if (account[0].status == "suspended" || account[0].status == "inactive")
    return "Esta conta está suspensa ou inativa.";

  await database.query(UPDATE_LAST_LOGIN_QUERY, [cpf]);
  account = await database.query(SELECT_ACCOUNT_FROM_CPF_QUERY, [cpf]);
  return account[0];
}

module.exports = {
  getAccountsInfo,
  getStudentsInfo,
  getInfo,
  addAccount,
  adminUpdateAccount,
  updateAccount,
  signin,
};
