import { query, transaction } from "infra/database";
import course from "models/course";
import bcrypt from "bcrypt";
const passwordSaltRounds = 10;

// QUERY STRINGS
const SELECT_ACCOUNT_FROM_CPF_QUERY = "SELECT * FROM account WHERE cpf = ?;";
const SELECT_ACCOUNTS_INFO_QUERY =
  "SELECT student.*, account.* FROM account LEFT JOIN student ON account.id = student.account_id;";
const SELECT_ACCOUNT_BY_EMAIL_QUERY = "SELECT * FROM account WHERE email = ?;";
const SELECT_STUDENTS_INFO_QUERY =
  "SELECT student.*, account.* FROM student LEFT JOIN account ON account_id = account.id;";
const SELECT_INFO_BY_CPF_QUERY = `
 SELECT student.*, account.*
 FROM account
 LEFT JOIN student ON account.id = student.account_id
 WHERE account.cpf = ?;
`;
const INSERT_ACCOUNT_QUERY =
  "INSERT INTO account ( is_admin, is_student, full_name, email, password, birth_date, cpf, registration, institution, status ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );";
const INSERT_STUDENT_QUERY =
  "INSERT INTO student (account_id, level, courses) VALUES (?, ?, ?);";
const DELETE_STUDENT_QUERY = "DELETE FROM student WHERE account_id = ?;";
const SELECT_ACCOUNT_ID_QUERY = "SELECT id FROM account WHERE cpf = ?";
const UPDATE_ACCOUNT_QUERY =
  "UPDATE account SET is_admin = ?, is_student = ?, full_name = ?, email = ?, birth_date = ?, institution = ?, status = ? WHERE cpf = ?;";
const UPDATE_STUDENT_QUERY = `
 UPDATE student
 SET level = ?, courses = ?
 WHERE account_id = ?;
`;
const UPDATE_ACCOUNT_NON_ADMIN_QUERY =
  "UPDATE account SET email = ?, picture = ? WHERE cpf = ?;";
const UPDATE_PASSWORD_QUERY = "UPDATE account SET password = ? WHERE cpf = ?;";
const UPDATE_LAST_LOGIN_QUERY =
  "UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE cpf = ?;";
const DELETE_ACCOUNT_FROM_ACCOUNT_ID_QUERY =
  "DELETE FROM account WHERE id = ?;";
const SELECT_STUDENT_FROM_ACCOUNT_ID_QUERY =
  "SELECT * FROM student WHERE account_id = ?";
const SELECT_STUDENT_COURSES_IDS_BY_ACCOUNT_ID_QUERY =
  "SELECT courses FROM student WHERE account_id = ?;";

// FUNCTIONS
async function getAccountsInfo() {
  const info = await query(SELECT_ACCOUNTS_INFO_QUERY);

  info.forEach((row) => {
    if (row.account_id == null) {
      delete row.level;
      delete row.course;
      delete row.class;
    }
    delete row.account_id;
    delete row.password;
  });

  return info;
}

async function getAccountByEmail(email) {
  const account = await query(SELECT_ACCOUNT_BY_EMAIL_QUERY, [email]);
  return account[0];
}

async function getStudentsInfo() {
  const info = await query(SELECT_STUDENTS_INFO_QUERY);

  info.forEach((row) => {
    delete row.account_id;
    delete row.password;
  });

  return info;
}

async function getInfo(cpf) {
  const info = await query(SELECT_INFO_BY_CPF_QUERY, [cpf]);

  if (info.length === 0) {
    return "Esta conta não foi encontrada.";
  }

  let coursesIds = [];
  info.forEach((row) => {
    if (row.courses) {
      row.courses = row.courses.replace(",", "");
      coursesIds = row.courses;
    }
    delete row.account_id;
    delete row.password;
  });

  info[0].courses = await getDatabaseCourses(coursesIds);

  return info[0];
}

async function getCoursesIds(id) {
  const result = await query(SELECT_STUDENT_COURSES_IDS_BY_ACCOUNT_ID_QUERY, [
    id,
  ]);

  return result[0].courses.split(",");
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
    registration,
    level,
    coursesIds,
  } = accountDetails;

  if (Object.prototype.toString.call(await getInfo(cpf)) == "[object Object]")
    return "Este CPF já está cadastrado!";

  const isAdmin = is_admin == "on" ? "1" : "0";
  const isStudent = is_student == "on" ? "1" : "0";

  let courses = "";
  if (isStudent == "1") {
    if (!level) {
      return "Todos os campos devem estar preenchidos.";
    }
    if (coursesIds) {
      courses = getCourses(coursesIds);
    }
  }

  const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);

  const result = await query(INSERT_ACCOUNT_QUERY, [
    isAdmin,
    isStudent,
    full_name,
    email,
    hashedPassword,
    birth_date,
    cpf,
    registration,
    institution,
    status,
  ]);

  if (isStudent == "1") {
    try {
      await query(INSERT_STUDENT_QUERY, [result.insertId, level, courses]);
    } catch (err) {
      await query(DELETE_ACCOUNT_FROM_ACCOUNT_ID_QUERY, [result.insertId]);
      console.error(err);
      return "Não foi possível criar a conta de estudante.";
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
    level,
    coursesIds,
  } = accountDetails;
  const isAdmin = is_admin == "on" ? "1" : "0";
  const isStudent = is_student == "on" ? "1" : "0";

  let accountId;
  try {
    const result = await query(SELECT_ACCOUNT_ID_QUERY, [cpf]);
    if (result.length > 0) {
      accountId = result[0].id;
    } else {
      return "Conta não foi encontrada";
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

  if (isStudent == "1") {
    let courses = "";

    if (coursesIds) {
      courses = getCourses(coursesIds);
    }

    const studentExists = await query(SELECT_STUDENT_FROM_ACCOUNT_ID_QUERY, [
      accountId,
    ]);

    if (studentExists.length > 0) {
      queries.push({
        queryString: UPDATE_STUDENT_QUERY,
        params: [level, courses, accountId],
      });
    } else {
      queries.push({
        queryString: INSERT_STUDENT_QUERY,
        params: [accountId, level, courses],
      });
    }
  } else {
    queries.push({
      queryString: DELETE_STUDENT_QUERY,
      params: [accountId],
    });
  }

  try {
    await transaction(queries);
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
  const { email, picture } = accountDetails;

  const queries = [];

  queries.push({
    queryString: UPDATE_ACCOUNT_NON_ADMIN_QUERY,
    params: [email, picture, payload.cpf],
  });

  try {
    await transaction(queries);
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

async function updatePassword(password, cpf) {
  try {
    const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);
    const result = await query(UPDATE_PASSWORD_QUERY, [hashedPassword, cpf]);
    return result;
  } catch (err) {
    console.err(err.message);
    throw err;
  }
}

async function signin(cpf, password) {
  let account = await query(SELECT_ACCOUNT_FROM_CPF_QUERY, [cpf]);

  if (account.length === 0) return "Esta conta não está cadastrada.";

  if (!(await bcrypt.compare(password, account[0].password.toString()))) {
    if (account[0].is_admin == 1) return "admin Senha inválida.";
    return "Senha inválida.";
  }

  if (account[0].status == "suspended" || account[0].status == "inactive")
    return "Esta conta está suspensa ou inativa.";

  await query(UPDATE_LAST_LOGIN_QUERY, [cpf]);
  return account[0];
}

// Private functions

function getCourses(coursesIds) {
  let courses = "";
  let temporaryCourses = [];
  const ids = coursesIds.split(",");

  for (let i = 0; i < ids.length; i++) {
    const currentId = ids[i].trim();

    if (!temporaryCourses.includes(currentId)) {
      temporaryCourses.push(currentId);

      courses += currentId;
      if (i < ids.length - 1) {
        courses += ",";
      }
    }
  }
  return courses;
}

async function getDatabaseCourses(coursesIds) {
  let courses = [];
  for (const id of coursesIds) {
    const c = await course.getInfo(id);
    courses.push({
      id: c.id,
      course: c.course,
      class: c.class,
      enter_time: c.enter_time,
      leave_time: c.leave_time,
      end_date: c.end_date,
      days: c.days,
    });
  }

  return JSON.stringify(courses);
}

module.exports = {
  getAccountsInfo,
  getAccountByEmail,
  getStudentsInfo,
  getInfo,
  getCoursesIds,
  addAccount,
  adminUpdateAccount,
  updateAccount,
  updatePassword,
  signin,
};
