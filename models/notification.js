import { query } from "infra/database";
import { getCoursesIds } from "models/account";
import { addAbortListener } from "nodemailer/lib/xoauth2";

const INSERT_NOTIFICATION_QUERY =
  "INSERT INTO notification ( users_receivers_ids, title, content) VALUES (?, ?, ?);";
const INSERT_ACCOUNT_NOTIFICATION_QUERY =
  "INSERT INTO account_notification (notification_id, account_id) VALUES (?, ?);";
const SELECT_ALL_NOTIFICATIONS = "SELECT * FROM notification;";
const SELECT_NOTIFICATIONS_FROM_USER_ID_QUERY = `
  SELECT n.*
  FROM notification AS n
  JOIN account_notification AS an ON n.id = an.notification_id
  WHERE an.account_id = ?
  AND an.sent = false;
`;
const UPDATE_ACCOUNT_NOTIFICATION_SENT_QUERY =
  "UPDATE account_notification SET sent = true WHERE account_id = ?;";

async function sendNotification(title, content, usersIds) {
  if (usersIds == "") {
    return "Adicione ao menos um destinatário!";
  }

  const ids = [...new Set(usersIds.split(","))];
  usersIds = ids.join(",");

  try {
    const result = await query(INSERT_NOTIFICATION_QUERY, [
      usersIds,
      title,
      content,
    ]);
    const notificationId = result.insertId;

    for (const i of ids) {
      await query(INSERT_ACCOUNT_NOTIFICATION_QUERY, [notificationId, i]);
    }

    return "Notificação enviada com sucesso!";
  } catch (err) {
    console.error(err.message);
    return "Falha ao enviar notificação!";
  }
}

async function getAllNotifications() {
  const result = await query(SELECT_ALL_NOTIFICATIONS);

  return result;
}

async function getAccountNotifications(id) {
  try {
    const notifications = await query(SELECT_NOTIFICATIONS_FROM_USER_ID_QUERY, [
      id,
    ]);

    await query(UPDATE_ACCOUNT_NOTIFICATION_SENT_QUERY, [id]);

    notifications.forEach((row) => {
      delete row.users_receivers_ids;
    });

    return notifications;
  } catch (err) {
    console.error(err.message);
    return "";
  }
}

module.exports = {
  sendNotification,
  getAllNotifications,
  getAccountNotifications,
};
