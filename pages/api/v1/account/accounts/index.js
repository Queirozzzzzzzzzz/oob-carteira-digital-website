import account from "models/account";

export default async function Information(req, res) {
  try {
    const info = await account.getAccountsInfo();
    res.status(200).json({ info });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Ocorreu um erro ao processar seu pedido" });
  }
}
