import course from "models/course";

export default async function Update(req, res) {
  try {
    const result = await course.getAllCourses();

    if (Object.prototype.toString.call(result) == "[object Array]") {
      res.status(200).json({ result });
    } else {
      res.status(500).json({ result });
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
