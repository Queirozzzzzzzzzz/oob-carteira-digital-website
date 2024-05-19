import { addAccount } from "models/account";

export default async function Add(req, res) {
  try {
    const result = await addAccount(req.body);

    const message =
      result == "Conta criada com sucesso!" ? "success " : "error ";
    res
      .writeHead(302, {
        Location: `/admin/accounts/signup?message=${encodeURIComponent(message + result)}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
