import { query } from "infra/database";

async function getVersion() {
  const result = await query("SELECT VERSION() AS version;");
  return result[0].version;
}

async function getOpenedConnections() {
  const result = await query(`SHOW STATUS LIKE 'Threads_connected';`);
  return result[0].Value;
}

async function getMaxConnections() {
  const result = await query("SHOW VARIABLES LIKE 'max_connections';");
  return result[0].Value;
}

module.exports = { getVersion, getOpenedConnections, getMaxConnections };
