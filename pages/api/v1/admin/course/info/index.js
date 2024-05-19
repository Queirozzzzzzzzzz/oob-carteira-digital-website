import { getInfo } from "models/course";

export default async function Information(req, res) {
  try {
    const result = await getInfo(req.body.id);

    if (typeof result == "object") {
      res.status(200).json({ result });
    } else {
      res.status(500).json({ result });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
