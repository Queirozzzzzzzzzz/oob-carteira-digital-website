function Update() {
  return (
    <>
      <div className="menu">
        <a href="/notification">Notificações</a>
        <a href="/user">Usuários</a>
        <a href="/">Sair</a>
      </div>
      <h1>Atualizar Informações de Usuário</h1>
      <form action="" className="user-signup">
        <label htmlFor="name">Nome</label>
        <input type="text" id="name" name="name" required />

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

module.exports = Update;
