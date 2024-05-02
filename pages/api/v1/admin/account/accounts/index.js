import account from "models/account";

export default async function Information(req, res) {
  try {
    const info = await account.getAccountsInfo();
    res.status(200).json({ info });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
