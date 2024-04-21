export default function Signup() {
  return (
    <>
      <h1>Cadastrar Usuário</h1>
      <form action="/api/v1/account/create" className="user-signup">
        <label htmlFor="isStudent">Estudante</label>
        <input type="checkbox" id="isStudent" name="isStudent" required></input>

        <label htmlFor="full_name">Nome</label>
        <input type="text" id="full_name" name="full_name" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="password">Senha</label>
        <input type="password" id="password" name="password" required />

        <label htmlFor="birth_date">Data de Nascimento</label>
        <input type="date" id="birth_date" name="birth_date" required />

        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" name="cpf" required />

        <label htmlFor="institution">Instituição</label>
        <input type="text" id="institution" name="institution" required />

        <label htmlFor="status">Status</label>
        <select id="status" name="status">
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="suspended">Suspenso</option>
        </select>

        <label htmlFor="registration">Matrícula</label>
        <input type="text" id="registration" name="registration" required />

        <label htmlFor="level">Nível</label>
        <input type="text" id="level" name="level" required />

        <label htmlFor="course">Curso</label>
        <input type="text" id="course" name="course" required />

        <label htmlFor="class">Turma</label>
        <input type="text" id="class" name="class" required />

        <button type="submit">Salvar</button>
      </form>
    </>
  );
}
