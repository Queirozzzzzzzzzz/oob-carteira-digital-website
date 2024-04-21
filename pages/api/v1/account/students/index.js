import account from "models/account";

export default async function Information(req, res) {
  try {
    const info = await account.getStudentsInfo();
    res.status(200).json({ info });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Um erro ocorreu ao processar seu pedido." });
  }
}
