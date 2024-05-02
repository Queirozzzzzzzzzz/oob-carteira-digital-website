const mysql = require("mysql2/promise");

const configurations = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

async function query(queryString, params) {
  const connection = await mysql.createConnection(configurations);
  let rows;
  try {
    [rows] = await connection.execute(queryString, params);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await connection.end();
  }
  return rows;
}

async function transaction(queries) {
  const connection = await mysql.createConnection(configurations);
  try {
    await connection.query("START TRANSACTION");
    for (const query of queries) {
      await connection.execute(query.queryString, query.params);
    }
    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = Object.freeze({
  query,
  transaction,
});
