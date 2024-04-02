function Login() {
  return (
    <>
      <h1>Login</h1>
      <form action="/notification" className="login">
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" name="cpf" pattern="\d{11}" required />

        <label htmlFor="password">Senha</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Entrar</button>
      </form>
    </>
  );
}

module.exports = Login;
