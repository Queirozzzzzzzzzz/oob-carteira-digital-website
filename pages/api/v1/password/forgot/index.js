import { sendEmail, getPasswordToken } from "models/email";

export default async function Forgot(req, res) {
  try {
    const to = req.body.email;
    const subject = "Carteira Digital - Redefinição de Senha";
    const text = await getPasswordToken(req.body.email);
    var success = 400;
    var result = "E-mail inválido!";

    const email = sendEmail(to, subject, text);

    if (email) {
      success = 200;
      result = "E-mail enviado!";
    }

    res.status(success).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json("500");
  }
}
