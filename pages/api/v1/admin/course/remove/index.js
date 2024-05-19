import { removeCourse } from "models/course";

export default async function Remove(req, res) {
  try {
    const result = await removeCourse(req.body.id);

    const message =
      result == "Curso removido com sucesso!" ? "success " : "error ";
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
