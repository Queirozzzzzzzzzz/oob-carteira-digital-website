import account from "models/account";

export default async function Information(req, res) {
  try {
    const info = await account.getStudentsInfo();
    res.status(200).json({ info });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
