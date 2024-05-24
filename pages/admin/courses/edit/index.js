import { useEffect, useState } from "react";

export default function Edit() {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseInfo, setCourseInfo] = useState({});

  const handleClearForm = () => {
    setCourseInfo({});
    setSelectedCourse("");
    document.getElementById("course-info-form").reset();
    document.getElementById("edit-form").reset();
    const form = document.querySelector(".course-search");
    form.classList.remove("hidden");
  };

  function hideAccountInfoForm() {
    const form = document.querySelector(".course-search");
    form.classList.add("hidden");
  }

  async function onSubmitCourseInfo(e) {
    e.preventDefault();

    const selectedCourseParts = selectedCourse.split(",");
    const id = parseInt(selectedCourseParts[0], 10);
    const response = await fetch("/api/v1/admin/course/info", {
      method: "POST",
      body: new URLSearchParams({ id }),
    });

    try {
      const data = await response.json();

      setCourseInfo(data["result"]);

      hideAccountInfoForm();
    } catch (err) {
      alert("O curso não pôde ser encontrado.");
      return;
    }
  }

  class Course {
    constructor(id, course, classStr) {
      this.id = id;
      this.course = course;
      this.class = classStr;
    }
  }

  async function getRegisteredCourses() {
    const response = await fetch("/api/v1/admin/course/all", { method: "GET" });
    if (response.status === 200) {
      const data = await response.json();
      const courses = data.result.map(
        (course) => new Course(course.id, course.course, course.class)
      );
      setRegisteredCourses(courses);
    }
  }

  useEffect(() => {
    getRegisteredCourses();
  }, []);

  return (
    <>
      {registeredCourses.length > 0 && (
        <>
          <h1>Encontrar Curso</h1>
          <button onClick={handleClearForm}>Limpar Formulário</button>
          <datalist id="courses">
            {registeredCourses.map((course) => (
              <option
                key={course.id}
                value={`${course.id}, ${course.course}, ${course.class}`}
              >
                {course.id} {course.course} ({course.class})
              </option>
            ))}
          </datalist>
          <form
            onSubmit={onSubmitCourseInfo}
            className="course-search"
            id="course-info-form"
          >
            <label htmlFor="cpf">ID, Curso ou Classe</label>
            <input
              type="text"
              id="course"
              name="course"
              value={selectedCourse}
              autoComplete="off"
              onChange={(e) => setSelectedCourse(e.target.value)}
              list="courses"
              required
            />
            <button type="submit">Buscar</button>
          </form>

          <h1>Editar curso</h1>
          <form method="POST" action="/api/v1/admin/course/edit" id="edit-form">
            <label htmlFor="course">Curso</label>
            <input
              type="hidden"
              id="id"
              name="id"
              value={courseInfo.id}
              autoComplete="off"
            ></input>
            <input
              type="text"
              id="course"
              name="course"
              defaultValue={courseInfo.course}
              autoComplete="off"
            ></input>

            <label htmlFor="course">Classe</label>
            <input
              type="text"
              id="c_class"
              name="c_class"
              defaultValue={courseInfo.class}
              autoComplete="off"
            ></input>

            <button type="submit">Salvar</button>
          </form>
          <form method="POST" action="/api/v1/admin/course/remove">
            <input
              type="hidden"
              id="id"
              name="id"
              value={courseInfo.id}
              autoComplete="off"
            ></input>
            <button type="submit">Excluir</button>
          </form>
        </>
      )}
    </>
  );
}
