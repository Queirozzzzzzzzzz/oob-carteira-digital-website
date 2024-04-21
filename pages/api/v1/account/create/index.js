import account from "models/account";

export default async function Add(req, res) {
  try {
    const result = await account.addAccount(req.body);

    res.status(200).json({ message: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Ocorreu um erro ao processar seu pedido" });
  }
}
