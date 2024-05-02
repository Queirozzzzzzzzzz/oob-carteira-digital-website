import account from "models/account";
import auth from "models/auth";

export default async function Update(req, res) {
  try {
    const payload = await auth.getUserPayload(req.cookies.token);
    const result = await account.updateAccount(req.body, payload);
    const success = result == "Conta atualizada com sucesso!" ? 200 : 400;

    res.status(success).json(result);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
