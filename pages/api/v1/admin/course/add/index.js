import { addCourse } from "models/course";

export default async function Add(req, res) {
  try {
    const result = await addCourse(req.body);

    const message =
      result == "Curso adicionado com sucesso!" ? "success " : "error ";
    res
      .writeHead(302, {
        Location: `/admin/courses/add?message=${encodeURIComponent(message + result)}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
