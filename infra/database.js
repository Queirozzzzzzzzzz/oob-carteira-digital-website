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
    console.log(err);
    throw err;
  } finally {
    await connection.end();
  }
  return rows;
}

module.exports = Object.freeze({
  query,
});
