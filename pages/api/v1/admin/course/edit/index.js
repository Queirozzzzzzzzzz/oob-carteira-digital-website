import { editCourse } from "models/course";

export default async function Edit(req, res) {
  try {
    const result = await editCourse(req.body);

    const message =
      result == "Curso editado com sucesso!" ? "success " : "error ";
    res
      .writeHead(302, {
        Location: `/admin/courses/edit?message=${encodeURIComponent(message + result)}`,
      })
      .end();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
