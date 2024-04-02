const mysql = require("mysql2/promise");

const configurations = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

async function query(queryString) {
  const connection = await mysql.createConnection(configurations);
  try {
    const rows = await connection.execute(queryString);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
}

async function getVersion() {
  const result = await query("SELECT VERSION() AS version;");
  return result[0][0].version;
}

async function getOpenedConnections() {
  const result = await query(`SHOW STATUS LIKE 'Threads_connected';`);
  return result[0][0].Value;
}

async function getMaxConnections() {
  const result = await query("SHOW VARIABLES LIKE 'max_connections';");
  return result[0][0].Value;
}

module.exports = Object.freeze({
  query,
  getVersion,
  getMaxConnections,
  getOpenedConnections,
});
