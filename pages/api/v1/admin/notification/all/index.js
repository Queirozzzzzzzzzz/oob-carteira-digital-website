import { getAllNotifications } from "models/notification";

export default async function getAll(req, res) {
  const result = await getAllNotifications();

  res.status(200).json(result);
}
