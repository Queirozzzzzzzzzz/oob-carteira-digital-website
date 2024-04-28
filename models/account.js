import database from "infra/database";
import bcrypt from "bcrypt";
const passwordSaltRounds = 10;

async function getAccountsInfo() {
  const info = await database.query(
    "SELECT student.*, account.* FROM account LEFT JOIN student ON account.id = student.account_id;"
  );

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
  const info = await database.query(
    "SELECT student.*, account.* FROM student LEFT JOIN account ON account_id = account.id;"
  );

  info.forEach((row) => {
    delete row.account_id;
    delete row.password;
  });

  return info;
}

async function getInfo(cpf) {
  const info = await database.query(
    `
    SELECT student.*, account.*
    FROM account
    LEFT JOIN student ON account.id = student.account_id
    WHERE account.cpf = ?;
  `,
    [cpf]
  );

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

  const hashedPassword = await bcrypt.hash(password, passwordSaltRounds);

  const result = await database.query(
    "INSERT INTO account ( is_admin, full_name, email, password, birth_date, cpf, institution, status ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ? );",
    [
      isAdmin,
      full_name,
      email,
      hashedPassword,
      birth_date,
      cpf,
      institution,
      status,
    ]
  );

  if (is_student === "on") {
    if (!registration || !level || !course || !classValue) {
      return "Todos os campos devem estar preenchidos.";
    }

    try {
      await database.query(
        "INSERT INTO student (account_id, end_date, registration, level, course, `class`) VALUES (?, ?, ?, ?, ?, ?);",
        [result.insertId, end_date, registration, level, course, classValue]
      );
    } catch (err) {
      await database.query("DELETE FROM account WHERE account_id = ?;", [
        result.insertId,
      ]);
      throw err;
    }
  }

  return "Conta criada com sucesso!";
}

async function updateAccount(accountDetails) {
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

  let accountId;
  try {
    const result = await database.query(
      "SELECT id FROM account WHERE cpf = ?",
      [cpf]
    );
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
      queryString: "UPDATE account SET password = ? WHERE cpf = ?;",
      params: [hashedPassword, cpf],
    });
  }

  queries.push({
    queryString:
      "UPDATE account SET is_admin = ?, full_name = ?, email = ?, birth_date = ?, institution = ?, status = ? WHERE cpf = ?;",
    params: [isAdmin, full_name, email, birth_date, institution, status, cpf],
  });

  if (is_student == "on") {
    const studentExists = await database.query(
      "SELECT * FROM student WHERE account_id = ?",
      [accountId]
    );
    console.log(studentExists);

    if (studentExists.length > 0) {
      queries.push({
        queryString: `
           UPDATE student
           SET end_date = ?, registration = ?, level = ?, course = ?, class = ?
           WHERE account_id = ?;
         `,
        params: [end_date, registration, level, course, classValue, accountId],
      });
    } else {
      queries.push({
        queryString:
          "INSERT INTO student (account_id, end_date, registration, level, course, `class`) VALUES (?, ?, ?, ?, ?, ?);",
        params: [accountId, end_date, registration, level, course, classValue],
      });
    }
  } else {
    queries.push({
      queryString: "DELETE FROM student WHERE account_id = ?;",
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
    return "Conta não pôde ser atualizada!";
  }

  return "Conta atualizada com sucesso!";
}

async function signin(cpf, password) {
  let account = await database.query("SELECT * FROM account WHERE cpf = ?;", [
    cpf,
  ]);

  if (account.length === 0) {
    return "Esta conta não está cadastrada.";
  }

  if (!(await bcrypt.compare(password, account[0].password.toString()))) {
    return "Senha inválida.";
  }

  if (account[0].status == "suspended" || account[0].status == "inactive") {
    return "Esta conta está suspensa ou inativa.";
  }

  await database.query(
    "UPDATE account SET last_login = CURRENT_TIMESTAMP WHERE cpf = ?;",
    [cpf]
  );

  account = await database.query("SELECT * FROM account WHERE cpf = ?;", [cpf]);

  return account[0];
}

module.exports = {
  getAccountsInfo,
  getStudentsInfo,
  getInfo,
  addAccount,
  updateAccount,
  signin,
};
