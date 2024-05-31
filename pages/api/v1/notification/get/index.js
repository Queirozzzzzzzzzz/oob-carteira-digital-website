import { getAccountNotifications } from "models/notification";

export default async function Get(req, res) {
  const result = await getAccountNotifications(req.body.id);
  if (typeof result === "object") {
    return res.status(200).json(result);
  } else {
    return res.status(500).json("Erro interno no servidor.");
  }
}
