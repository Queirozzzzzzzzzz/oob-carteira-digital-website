import { sendEmail, getPasswordToken } from "models/email";

export default async function Forgot(req, res) {
  try {
    const to = req.body.email;
    const subject = "Carteira Digital - Redefinição de Senha";
    const text = await getPasswordToken(req.body.email);
    var success = 400;
    var result = "E-mail inválido!";

    if (text) {
      success = 200;
      result = "E-mail enviado!";
    }

    sendEmail(to, subject, text);

    res.status(success).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json("500");
  }
}
