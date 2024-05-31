import { sendNotification } from "models/notification";

export default async function Add(req, res) {
  try {
    const result = await sendNotification(
      req.body.title,
      req.body.message,
      req.body.usersIds
    );

    const message =
      result == "Notificação enviada com sucesso!" ? "success " : "error ";
    res
      .writeHead(302, {
        Location: `/admin/notification?message=${encodeURIComponent(message + result)}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
