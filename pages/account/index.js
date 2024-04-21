export default function Account() {
  return (
    <>
      <div className="section">
        <a href="/account/signup">Cadastrar Usuário</a>
      </div>
      <h1>Encontrar Usuário</h1>
      <form action="/account/update" className="user-search">
        <label htmlFor="name">E-mail ou CPF</label>
        <input type="text" id="name" name="name" required />

        <button type="submit">Buscar</button>
      </form>
      ;
    </>
  );
}
