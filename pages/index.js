export default function Login() {
  return (
    <>
      <h1>Login</h1>
      <form method="POST" action="/api/v1/auth/signin" className="login">
        <label htmlFor="cpf">CPF</label>
        <input type="text" id="cpf" name="cpf" pattern="\d{11}" required />

        <label htmlFor="password">Senha</label>
        <input type="password" id="password" name="password" required />

        <button type="submit">Entrar</button>
      </form>
    </>
  );
}
