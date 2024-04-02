function User() {
  return (
    <>
      <div className="menu">
        <a href="/notification">Notificações</a>
        <a href="/user">Usuários</a>
        <a href="/">Sair</a>
      </div>
      <div className="section">
        <a href="/user/signup">Cadastrar Usuário</a>
      </div>
      <h1>Encontrar Usuário</h1>
      <form action="/user/update" className="user-search">
        <label htmlFor="name">E-mail ou CPF</label>
        <input type="text" id="name" name="name" required />

        <button type="submit">Buscar</button>
      </form>
      ;
    </>
  );
}

module.exports = User;
