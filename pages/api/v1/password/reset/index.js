import { getUserPayload } from "models/auth";
import { updatePassword } from "models/account";

export default async function Reset(req, res) {
  try {
    if (req.body.new_password != req.body.confirm_new_password) {
      res
        .writeHead(302, {
          Location: `/password/reset?message=${encodeURIComponent("error Senhas não coincidem.")}`,
        })
        .end();
    }

    const payload = await getUserPayload(req.cookies.token);
    await updatePassword(req.body.new_password, payload.cpf);

    res
      .writeHead(302, {
        Location: `/password/reset?message=${encodeURIComponent("success Senha atualizada com sucesso!")}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    res
      .writeHead(302, {
        Location: `/password/reset?message=${encodeURIComponent("error Não foi possível atualizar a senha!")}`,
      })
      .end();
  }
}
