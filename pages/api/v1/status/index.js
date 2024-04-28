import status from "models/status";

export default async function Status(req, res) {
  try {
    const updatedAt = new Date().toISOString();
    const mysqlVersionValue = await status.getVersion();
    const maxConnectionsValue = await status.getMaxConnections();
    const openedConnectionsValue = await status.getOpenedConnections();

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
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Um erro ocorreu ao processar seu pedido." });
  }
}
