import { query } from "infra/database";

const SELECT_INFO_BY_ID_QUERY = "SELECT * FROM course WHERE id = ?";
const INSERT_COURSE_QUERY =
  "INSERT INTO course ( course, class, enter_time, leave_time, end_date, days ) VALUES ( ?, ?, ?, ?, ?, ? );";
const UPDATE_COURSE_QUERY =
  "UPDATE course SET course = ?, class = ?, enter_time = ?, leave_time = ?, end_date = ?, days = ? WHERE id = ?";
const REMOVE_COURSE_QUERY = "DELETE FROM course WHERE id = ?;";

async function getAllCourses() {
  const courses = await query("SELECT * FROM course;");
  return courses;
}

async function getInfo(id) {
  const info = await query(SELECT_INFO_BY_ID_QUERY, [id]);

  if (info.length === 0) {
    return "Este curso não foi encontrado.";
  }

  return info[0];
}

async function addCourse(courseDetails) {
  const { course, c_class, enter_time, leave_time, end_date, days } =
    courseDetails;

  if (!days) {
    return "Marque ao menos um dia da semana.";
  }

  var formattedDays;
  if (!typeof days == "string") {
    formattedDays = days.join(",");
  } else {
    formattedDays = days;
  }

  try {
    await query(INSERT_COURSE_QUERY, [
      course,
      c_class,
      enter_time,
      leave_time,
      end_date,
      formattedDays,
    ]);
    return "Curso adicionado com sucesso!";
  } catch (err) {
    return "Curso não pôde ser criado!";
  }
}

async function editCourse(courseDetails) {
  const { id, course, c_class, enter_time, leave_time, end_date, days } =
    courseDetails;

  if (!days) {
    return "Marque ao menos um dia da semana.";
  }

  var formattedDays;
  if (typeof days == "object") {
    formattedDays = days.join(",");
  } else {
    formattedDays = days;
  }

  try {
    await query(UPDATE_COURSE_QUERY, [
      course,
      c_class,
      enter_time,
      leave_time,
      end_date,
      formattedDays,
      id,
    ]);
    return "Curso editado com sucesso!";
  } catch (err) {
    return "Curso não pôde ser editado!";
  }
}

async function removeCourse(id) {
  try {
    await query(REMOVE_COURSE_QUERY, [id]);
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
