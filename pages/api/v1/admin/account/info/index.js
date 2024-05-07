import account from "models/account";

export default async function Information(req, res) {
  try {
    const result = await account.getInfo(req.body.cpf);

    if (Object.prototype.toString.call(result) == "[object Object]") {
      res.status(200).json({ result });
    } else {
      res.status(500).json({result})
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
