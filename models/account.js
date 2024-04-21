import database from "infra/database";

async function getAccountsInfo() {
  const info = await database.query(
    "SELECT student.*, account.* FROM account LEFT JOIN student ON account.id = student.account_id;"
  );

  info.forEach((row) => {
    if (row.account_id == null) {
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

  if (!info) {
    throw new Error("Account not found");
  }

  info.forEach((row) => {
    delete row.account_id;
    delete row.password;
  });

  return info[0];
}

async function addAccount(accountDetails) {
  const {
    full_name,
    email,
    password,
    birth_date,
    cpf,
    institution,
    status,
    isStudent,
    registration,
    level,
    course,
    class: classValue,
  } = accountDetails;

  const result = await database.query(
    "INSERT INTO account ( full_name, email, password, birth_date, cpf, institution, status ) VALUES ( ?, ?, ?, ?, ?, ?, ? );",
    [full_name, email, password, birth_date, cpf, institution, status]
  );

  if (isStudent == "on") {
    try {
      await database.query(
        "INSERT INTO student ( account_id, registration, level, course, class ) VALUES ( ?, ?, ?, ?, ? );",
        [result.insertId, registration, level, course, classValue]
      );
    } catch (error) {
      await database.query("DELETE FROM account WHERE id = ?", [
        result.insertId,
      ]);
      return "Ocorreu um erro ao processar seu pedido";
    }
  }
}

async function removeAccount() {
  console.log("remove account");
}

async function signin(cpf, password) {
  const account = await database.query("SELECT * FROM account WHERE cpf = ?;", [
    cpf,
  ]);

  if (account.length === 0) {
    return "Esta conta não está cadastrada.";
  }

  if (account[0].password.toString() !== password) {
    return "Senha inválida.";
  }

  return account[0];
}

module.exports = {
  getAccountsInfo,
  getStudentsInfo,
  getInfo,
  addAccount,
  removeAccount,
  signin,
};
