import React, { useState, useEffect } from "react";

export default function Signup() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [coursesIds, setCoursesIds] = useState([]);

  class Course {
    constructor(id, course, classStr) {
      this.id = id;
      this.course = course;
      this.class = classStr;
    }
  }

  const handleIsAdminChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  const handleIsStudentChange = (e) => {
    setIsStudent(e.target.checked);
  };

  const addCourse = () => {
    const selectedCourseParts = selectedCourse.split(",");
    const id = parseInt(selectedCourseParts[0], 10);
    const course = selectedCourseParts[1];
    const c_class = selectedCourseParts[2];
    setSelectedCourse("");

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
      <h1>Cadastrar Usuário</h1>
      <form
        method="POST"
        action="/api/v1/admin/account/create"
        className="user-signup"
      >
        <label htmlFor="is_admin">ADMIN</label>
        <input
          type="checkbox"
          id="is_admin"
          name="is_admin"
          autoComplete="off"
          onChange={handleIsAdminChange}
        ></input>

        <label htmlFor="is_student">Estudante</label>
        <input
          type="checkbox"
          id="is_student"
          name="is_student"
          checked={isStudent}
          autoComplete="off"
          onChange={handleIsStudentChange}
        ></input>

        <label htmlFor="full_name">Nome</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          autoComplete="off"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="off"
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="off"
          required
        />

        <label htmlFor="birth_date">Data de Nascimento</label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          autoComplete="off"
          required
        />

        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          pattern="\d{11}"
          autoComplete="off"
          required
        />

        <label htmlFor="registration">Matrícula</label>
        <input
          type="text"
          id="registration"
          name="registration"
          autoComplete="off"
          pattern="\d{8}"
          required
        />

        <label htmlFor="institution">Instituição</label>
        <input
          type="text"
          id="institution"
          name="institution"
          autoComplete="off"
          defaultValue={"Escola Senai 'Hermenegildo Campos de Almeida'"}
          required
        />

        <label htmlFor="status">Status</label>
        <select id="status" name="status">
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="suspended">Suspenso</option>
        </select>

        {isStudent && (
          <>
            <label htmlFor="end_date">Validade da Conta</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              autoComplete="off"
              required
            />
            <datalist id="levelList">
              <option
                key={1}
                value={"Itinerário de Formação Técnica e Profissional"}
              >
                Itinerário de Formação Técnica e Profissional
              </option>
            </datalist>
            <label htmlFor="level">Nível</label>
            <input
              type="list"
              id="level"
              name="level"
              list="levelList"
              autoComplete="off"
              required
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

        <button type="submit">Salvar Usuário</button>
      </form>
    </>
  );
}
