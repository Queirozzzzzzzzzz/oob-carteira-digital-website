import { getAccountNotifications } from "models/notification";

export default async function Get(req, res) {
  const result = await getAccountNotifications(req.body.id);

  return res.status(200).json(result);
}
