import { createTransport } from "nodemailer";
import { getAccountByEmail } from "models/account";
import { SignJWT } from "jose";
const { createSecretKey } = require("crypto");

const transporter = createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error("E-mail error: " + err.message);
    }
  });
}

async function getPasswordToken(email) {
  const account = await getAccountByEmail(email);
  const token = await getToken(account);

  return token;
}

async function getToken(account) {
  const secretKey = createSecretKey(process.env.JWT_SECRET, "utf-8");
  const token = await new SignJWT({
    id: process.env.JWT_ID,
    cpf: account.cpf,
    is_admin: account.is_admin,
    is_student: account.is_student,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(process.env.HOST)
    .setAudience(process.env.HOST)
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME)
    .sign(secretKey);

  const url = process.env.HOST + "/api/v1/password/forgot/login?token=" + token;
  const text = `Clique neste link para redefinir sua senha: ${url}`;

  return text;
}

module.exports = {
  sendEmail,
  getPasswordToken,
};
