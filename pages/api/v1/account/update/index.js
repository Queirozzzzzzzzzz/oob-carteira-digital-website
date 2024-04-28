import account from "models/account";

export default async function Update(req, res) {
  try {
    const result = await account.updateAccount(req.body);

    const message =
      result == "Conta atualizada com sucesso!" ? "success " : "error ";
    res
      .writeHead(302, {
        Location: `/account/update?message=${encodeURIComponent(message + result)}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
