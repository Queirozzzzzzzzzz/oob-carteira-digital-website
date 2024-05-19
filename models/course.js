import database from "infra/database";

const SELECT_INFO_BY_ID_QUERY = "SELECT * FROM course WHERE id = ?";
const INSERT_COURSE_QUERY =
  "INSERT INTO course ( course, class ) VALUES ( ?, ? );";
const UPDATE_COURSE_QUERY =
  "UPDATE course SET course = ?, class = ? WHERE id = ?";
const REMOVE_COURSE_QUERY = "DELETE FROM course WHERE id = ?;";

async function getAllCourses() {
  const courses = await database.query("SELECT * FROM course;");
  return courses;
}

async function getInfo(id) {
  const info = await database.query(SELECT_INFO_BY_ID_QUERY, [id]);

  if (info.length === 0) {
    return "Este curso não foi encontrado.";
  }

  return info[0];
}

async function addCourse(courseDetails) {
  const { course, c_class } = courseDetails;

  try {
    await database.query(INSERT_COURSE_QUERY, [course, c_class]);
    return "Curso adicionado com sucesso!";
  } catch (err) {
    return "Curso não pôde ser criado!";
  }
}

async function editCourse(courseDetails) {
  const { id, course, c_class } = courseDetails;

  try {
    await database.query(UPDATE_COURSE_QUERY, [course, c_class, id]);
    return "Curso editado com sucesso!";
  } catch (err) {
    return "Curso não pôde ser editado!";
  }
}

async function removeCourse(id) {
  try {
    await database.query(REMOVE_COURSE_QUERY, [id]);
    return "Curso removido com sucesso!";
  } catch (err) {
    return "Curso não pôde ser removido!";
  }
}

module.exports = {
  getAllCourses,
  addCourse,
  editCourse,
  removeCourse,
  getInfo,
};
