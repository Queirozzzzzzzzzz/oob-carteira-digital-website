import React, { useState, useEffect } from "react";

export default function Update() {
  const [userInfo, setUserInfo] = useState({});
  const [isStudent, setIsStudent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState(userInfo.status);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [coursesIds, setCoursesIds] = useState([]);

  const handleClearForm = () => {
    setUserInfo({});
    setIsStudent(false);
    setIsAdmin(false);
    setStatus("");
    setSelectedCourses([]);
    setCoursesIds([]);
    setSelectedCourse("");
    document.getElementById("account-info-form").reset();
    document.getElementById("update-form").reset();
    const form = document.querySelector(".user-search");
    form.classList.remove("hidden");
  };

  async function onSubmitAccountInfo(event) {
    event.preventDefault();

    const cpf = event.target.cpf.value;
    const response = await fetch("/api/v1/admin/account/info", {
      method: "POST",
      body: new URLSearchParams({ cpf }),
    });

    try {
      const data = await response.json();
      const result = data["result"];
      if (result.is_student == 1) {
        let courses;
        if (!typeof result.courses == "object") {
          courses = JSON.parse(result.courses);
        } else {
          courses = result.courses;
        }
        getStudentCourses(courses);
      }

      setUserInfo(result);
      setIsStudent(!!result.registration);
      setIsAdmin(!!result.is_admin);
      hideAccountInfoForm();
    } catch (err) {
      alert("A conta não pôde ser encontrada.");
      return;
    }
  }

  function hideAccountInfoForm() {
    const form = document.querySelector(".user-search");
    form.classList.add("hidden");
  }

  const convertDateFormat = (dateString) => dateString?.split("T")[0];

  const handleClick = (e) => {
    const { name, checked } = e.target;
    setIsAdmin(name === "is_admin" ? checked : !isAdmin);
    setIsStudent(name === "is_student" ? checked : !isStudent);
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
  };

  useEffect(() => {
    setStatus(userInfo.status);
  }, [userInfo]);

  class Course {
    constructor(id, course, classStr) {
      this.id = id;
      this.course = course;
      this.class = classStr;
    }
  }

  const getStudentCourses = (coursesIdsRaw) => {
    const coursesIds = JSON.parse(coursesIdsRaw);

    const filteredCourses = registeredCourses.filter((course) =>
      coursesIds.some((obj) => obj.id === course.id)
    );

    const courses = filteredCourses.map((course) => ({
      id: course.id,
      course: course.course,
      class: course.class,
    }));

    addCurrentCouses(courses);
  };

  const addCurrentCouses = (courses) => {
    let newCourses = [];
    let newIds = [];
    for (const courseObj of courses) {
      const courseStr = `${courseObj.id}, ${courseObj.course}, ${courseObj.class}`;
      const selectedCourseParts = courseStr.split(",");
      const id = selectedCourseParts[0];
      const course = selectedCourseParts[1];
      const c_class = selectedCourseParts[2];

      const newCourse = new Course(id, course, c_class);
      newCourses = [...newCourses, newCourse];
      newIds = [...newIds, id];
    }

    setSelectedCourses([...selectedCourses, ...newCourses]);
    setCoursesIds([...coursesIds, ...newIds]);

    addCourse();
  };

  const addCourse = () => {
    const selectedCourseParts = selectedCourse.split(",");
    const id = selectedCourseParts[0];
    const course = selectedCourseParts[1];
    const c_class = selectedCourseParts[2];
    setSelectedCourse("");

    if (!id) return null;

    const newCourse = new Course(id, course, c_class);
    setSelectedCourses([...selectedCourses, newCourse]);
    setCoursesIds([...coursesIds, id]);
  };

  const removeCourse = (course) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== course));
    setCoursesIds(coursesIds.filter((c) => c !== course.id));
  };

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
      <h1>Encontrar Usuário</h1>
      <button onClick={handleClearForm}>Limpar Formulário</button>
      <form
        onSubmit={onSubmitAccountInfo}
        className="user-search"
        id="account-info-form"
      >
        <label htmlFor="cpf">CPF do Usuário</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          pattern="\d{11}"
          autoComplete="off"
          required
        />
        <button type="submit">Buscar</button>
      </form>

      <h1>Atualizar Informações de Usuário</h1>
      <form
        method="POST"
        action="/api/v1/admin/account/update"
        className="user-signup"
        id="update-form"
      >
        <label htmlFor="is_admin">ADMIN</label>
        <input
          type="checkbox"
          id="is_admin"
          name="is_admin"
          defaultChecked={isAdmin}
          autoComplete="off"
          onClick={handleClick}
        ></input>

        <label htmlFor="is_student">Estudante</label>
        <input
          type="checkbox"
          id="is_student"
          name="is_student"
          defaultChecked={isStudent}
          autoComplete="off"
          onClick={handleClick}
        ></input>

        <label htmlFor="full_name">Nome</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={userInfo.full_name || ""}
          autoComplete="off"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={userInfo.email || ""}
          autoComplete="off"
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="off"
        />

        <label htmlFor="birth_date">Data de Nascimento</label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          defaultValue={convertDateFormat(userInfo.birth_date) || ""}
          autoComplete="off"
          required
        />

        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={userInfo.cpf || ""}
          autoComplete="off"
          required
          readOnly
        />

        <label htmlFor="registration">Matrícula</label>
        <input
          type="text"
          id="registration"
          name="registration"
          defaultValue={userInfo.registration || ""}
          autoComplete="off"
          pattern="\d{8}"
          readOnly
          required
        />

        <label htmlFor="institution">Instituição</label>
        <input
          type="text"
          id="institution"
          name="institution"
          defaultValue={userInfo.institution || ""}
          autoComplete="off"
          required
        />

        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="suspended">Suspenso</option>
        </select>

        {isStudent && (
          <>
            <label htmlFor="level">Nível</label>
            <input
              type="text"
              id="level"
              name="level"
              defaultValue={userInfo.level || ""}
              autoComplete="off"
              required={isStudent}
            />
            {registeredCourses.length > 0 && (
              <>
                <label htmlFor="course">Curso</label>
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
                <input
                  type="list"
                  id="course"
                  name="course"
                  list="courses"
                  value={selectedCourse}
                  autoComplete="off"
                  onChange={(e) => setSelectedCourse(e.target.value)}
                />
                <h3 type="button" onClick={addCourse}>
                  Adicionar Curso
                </h3>

                <h2>Cursos Selecionados</h2>
                <input
                  type="hidden"
                  name="coursesIds"
                  id="coursesIds"
                  value={coursesIds}
                  autoComplete="off"
                />
                <ul>
                  {selectedCourses.map((course) => (
                    <li key={course.id}>
                      <p>
                        {course.id} {course.course} {course.class}
                      </p>
                      <h3 onClick={() => removeCourse(course)}>Remover</h3>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}

        <button type="submit">Salvar</button>
      </form>
    </>
  );
}
