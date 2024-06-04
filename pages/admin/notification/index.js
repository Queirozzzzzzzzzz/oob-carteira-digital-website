import { useEffect, useState } from "react";

export default function Notification(req, res) {
  const [userRecipients, setUserRecipients] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [courseRecipients, setCourseRecipients] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [coursesIds, setCoursesIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersIds, setUsersIds] = useState([]);

  class Course {
    constructor(id, course, c_class) {
      this.id = id;
      this.course = course;
      this.class = c_class;
    }
  }

  class User {
    constructor(id, full_name, cpf, course, c_class, courses) {
      this.id = id;
      this.full_name = full_name;
      this.cpf = cpf;
      this.course = course;
      this.class = c_class;
      this.courses = courses;
    }
  }

  async function getCourseRecipients() {
    const resCourses = await fetch("/api/v1/admin/course/all", {
      method: "GET",
    });

    if (resCourses.status === 200) {
      const data = await resCourses.json();
      const courses = data.result.map(
        (course) => new Course(course.id, course.course, course.class)
      );
      return courses;
    }

    throw new Error("Failed to fetch courses");
  }

  async function getUserRecipients() {
    const resUsers = await fetch("/api/v1/admin/account/accounts", {
      method: "GET",
    });

    if (resUsers.status === 200) {
      const data = await resUsers.json();
      const users = [];

      for (const user of data.info) {
        const c = await getUserCourse(user.courses);
        users.push(
          new User(
            user.id,
            user.full_name,
            user.cpf,
            c.course,
            c.c_class,
            user.courses
          )
        );
      }

      return users;
    }

    throw new Error("Failed to fetch users");
  }

  async function setRecipients() {
    try {
      const courses = await getCourseRecipients();
      const users = await getUserRecipients();

      setCourseRecipients(courses);
      setUserRecipients(users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getUserCourse(ids) {
    let course = "";
    let c_class = "";

    if (ids) {
      try {
        const courseInfo = {
          id: ids.charAt(0),
        };

        const response = await fetch("/api/v1/admin/course/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseInfo),
        });

        if (!response.ok) {
          alert(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();
        const cc = data.result;

        course = cc.course;
        c_class = cc.class;
      } catch (error) {
        console.error(error.message);
      }
    }

    const result = { course: course, c_class: c_class };
    return result;
  }

  const addCourse = () => {
    if (selectedCourse) {
      const selectedCourseParts = selectedCourse.split(",");
      const id = parseInt(selectedCourseParts[0], 10);
      const course = selectedCourseParts[1];
      const c_class = selectedCourseParts[2];
      setSelectedCourse("");

      const newCourse = new Course(id, course, c_class);
      setSelectedCourses([...selectedCourses, newCourse]);
      setCoursesIds([...coursesIds, id]);

      let ids = [];
      for (const user of userRecipients) {
        if (user.courses) {
          const courses = user.courses.split(",");
          for (const c of courses) {
            if (c == id) {
              ids.push(user.id);
            }
          }
        }
      }
      const combinedIds = [...usersIds, ...ids];
      setUsersIds([...new Set(combinedIds)]);
    }
  };

  const removeCourse = (course) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== course));
    setCoursesIds(coursesIds.filter((c) => c !== course.id));
  };

  const addUser = () => {
    if (selectedUser) {
      const selectedUserParts = selectedUser.split(",");
      const id = selectedUserParts[0];
      const full_name = selectedUserParts[1];
      const cpf = selectedUserParts[2];
      const course = selectedUserParts[3];
      const c_class = selectedUserParts[4];
      setSelectedUser("");

      const newUser = new User(id, full_name, cpf, course, c_class);
      setSelectedUsers([...selectedUsers, newUser]);

      const combinedIds = [...usersIds, id];

      setUsersIds([...new Set(combinedIds)]);
    }
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((c) => c !== user));
    setUsersIds(usersIds.filter((c) => c !== user.id));
  };

  useEffect(() => {
    setRecipients();
  }, []);
  return (
    <>
      <h1>Enviar Notificações</h1>
      <form
        method="POST"
        action="/api/v1/admin/notification/send"
        className="notify"
      >
        <label htmlFor="title">Título:</label>
        <input
          type="text"
          id="title"
          name="title"
          autoComplete="off"
          required
        />
        <label htmlFor="message">Mensagem:</label>
        <textarea
          id="message"
          name="message"
          autoComplete="off"
          required
        ></textarea>
        <h2>Destinatários: </h2>
        <div id="label-subtitle">
          <label htmlFor="">Classes:</label>
        </div>
        <datalist id="coursesList">
          {courseRecipients.map((course) => (
            <option
              key={course.id}
              value={`${course.id}, ${course.course}, ${course.class}`}
            >
              {course.class} ( {course.course} )
            </option>
          ))}
        </datalist>
        <input
          type="list"
          id="courses"
          list="coursesList"
          value={selectedCourse}
          autoComplete="off"
          onChange={(e) => setSelectedCourse(e.target.value)}
        ></input>
        <h3 type="button" onClick={addCourse}>
          Adicionar Curso
        </h3>
        <input
          type="hidden"
          name="usersIds"
          id="usersIds"
          value={usersIds}
          autoComplete="off"
        />
        <div id="label-subtitle">
          <label htmlFor="">Usuários:</label>{" "}
          <p>( Nome (CPF) Curso (Classe) )</p>
        </div>
        <datalist id="usersList">
          {userRecipients.map((user) => {
            const courseClass =
              user.course.length > 0 ? `${user.course} (${user.class})` : "";
            return (
              <option
                key={user.id}
                value={`${user.id}, ${user.full_name}, ${user.cpf}, ${user.course}, ${user.class}`}
              >
                {`${user.full_name} (${user.cpf}) ${courseClass}`}
              </option>
            );
          })}
        </datalist>
        <input
          type="list"
          id="users"
          list="usersList"
          value={selectedUser}
          autoComplete="off"
          onChange={(e) => setSelectedUser(e.target.value)}
        ></input>
        <h3 type="button" onClick={addUser}>
          Adicionar Usuário
        </h3>
        {(selectedCourses.length > 0 || selectedUsers.length > 0) && (
          <>
            <h2>----------------------------------</h2>
            <ul>
              <h4>Classes:</h4>
              {selectedCourses.map((course) => (
                <li key={course.id}>
                  <p>
                    {course.id} {course.course} {course.class}
                  </p>
                  <h3 onClick={() => removeCourse(course)}>Remover</h3>
                </li>
              ))}
              <h4>Usuários:</h4>
              {selectedUsers.map((user) => (
                <li key={user.id}>
                  <p>
                    {user.id} {user.full_name}
                  </p>
                  <h3 onClick={() => removeUser(user)}>Remover</h3>
                </li>
              ))}
            </ul>
          </>
        )}

        <button type="submit">Enviar</button>
      </form>
    </>
  );
}
