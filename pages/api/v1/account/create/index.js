import account from "models/account";

export default async function Add(req, res) {
  try {
    const result = await account.addAccount(req.body);

    const message =
      result == "Conta criada com sucesso!" ? "success " : "error ";
    res
      .writeHead(302, {
        Location: `/account/signup?message=${encodeURIComponent(message + result)}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
