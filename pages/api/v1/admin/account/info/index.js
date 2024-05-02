import account from "models/account";

export default async function Information(req, res) {
  try {
    const result = await account.getInfo(req.body.cpf);

    if (Object.prototype.toString.call(result) == "[object Object]") {
      res.status(200).json({ result });
    } else {
      res
        .writeHead(302, {
          Location: `/admin/account?message=${encodeURIComponent("error " + result)}`,
        })
        .end();
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
