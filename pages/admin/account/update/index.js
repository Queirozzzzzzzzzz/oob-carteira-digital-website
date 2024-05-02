import React, { useState, useEffect } from "react";

export default function Update() {
  const [userInfo, setUserInfo] = useState({});
  const [isStudent, setIsStudent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState(userInfo.status);

  async function onSubmit(event) {
    event.preventDefault();
    const cpf = event.target.cpf.value;
    const response = await fetch("/api/v1/admin/account/info", {
      method: "POST",
      body: new URLSearchParams({ cpf }),
    });

    try {
      const data = await response.json();
      const result = data["result"];

      setUserInfo(result);
      result.password = Buffer.from(result.password.data).toString();
      setIsStudent(!!result.registration);
      setIsAdmin(!!result.is_admin);
    } catch (err) {
      return;
    }
  }

  const convertDateFormat = (dateString) => dateString?.split("T")[0];

  const handleClick = (e) => {
    const { name, checked } = e.target;
    if (name === "is_admin") {
      setIsAdmin(checked);
    } else if (name === "is_student") {
      setIsStudent(checked);
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
  };

  useEffect(() => {
    setStatus(userInfo.status);
  }, [userInfo]);

  return (
    <>
      <h1>Encontrar Usuário</h1>
      <form onSubmit={onSubmit} className="user-search">
        <label htmlFor="cpf">CPF do Usuário</label>
        <input type="text" id="cpf" name="cpf" pattern="\d{11}" required />
        <button type="submit">Buscar</button>
      </form>

      <h1>Atualizar Informações de Usuário</h1>
      <form
        method="POST"
        action="/api/v1/admin/account/update"
        className="user-signup"
      >
        <label htmlFor="is_admin">ADMIN</label>
        <input
          type="checkbox"
          id="is_admin"
          name="is_admin"
          defaultChecked={isAdmin}
          onClick={handleClick}
        ></input>

        <label htmlFor="is_student">Estudante</label>
        <input
          type="checkbox"
          id="is_student"
          name="is_student"
          defaultChecked={isStudent}
          onClick={handleClick}
        ></input>

        <label htmlFor="full_name">Nome</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={userInfo.full_name || ""}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="false"
          defaultValue={userInfo.email || ""}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="false"
        />

        <label htmlFor="birth_date">Data de Nascimento</label>
        <input
          type="date"
          id="birth_date"
          name="birth_date"
          defaultValue={convertDateFormat(userInfo.birth_date) || ""}
          required
        />

        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={userInfo.cpf || ""}
          readOnly
          required
        />

        <label htmlFor="institution">Instituição</label>
        <input
          type="text"
          id="institution"
          name="institution"
          defaultValue={userInfo.institution || ""}
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
            <label htmlFor="birth_date">Validade da Conta</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              defaultValue={convertDateFormat(userInfo.end_date) || ""}
              required
            />
            <label htmlFor="registration">Matrícula</label>
            <input
              type="text"
              id="registration"
              name="registration"
              defaultValue={userInfo.registration || ""}
              required={isStudent}
            />
            <label htmlFor="level">Nível</label>
            <input
              type="text"
              id="level"
              name="level"
              defaultValue={userInfo.level || ""}
              required={isStudent}
            />
            <label htmlFor="course">Curso</label>
            <input
              type="text"
              id="course"
              name="course"
              defaultValue={userInfo.course || ""}
              required={isStudent}
            />
            <label htmlFor="class">Turma</label>
            <input
              type="text"
              id="class"
              name="class"
              defaultValue={userInfo.class || ""}
              required={isStudent}
            />{" "}
          </>
        )}

        <button type="submit">Salvar</button>
      </form>
    </>
  );
}
