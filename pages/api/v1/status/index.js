import database from "/infra/database";

export default async function Status(req, res) {
  try {
    const updatedAt = new Date().toISOString();
    const mysqlVersionValue = await database.getVersion();
    const maxConnectionsValue = await database.getMaxConnections();
    const openedConnectionsValue = await database.getOpenedConnections();

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          mysql_version: mysqlVersionValue,
          max_connections: parseInt(maxConnectionsValue),
          opened_connections: parseInt(openedConnectionsValue),
        },
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while processing your request." });
  }
}
