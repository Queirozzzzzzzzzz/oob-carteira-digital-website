export default function Login() {
  async function onSubmit(e) {
    e.preventDefault();
    const cpf = e.target.cpf.value;
    const password = e.target.password.value;
    const result = await fetch("/api/v1/auth/signin", {
      method: "POST",
      body: new URLSearchParams({ cpf, password }),
    });

    const response = await result.json();
    if (response.admin_logged) {
      window.location.href = window.location.href;
    }
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={onSubmit} className="login">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          pattern="\d{11}"
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

        <button type="submit">Entrar</button>
      </form>
    </>
  );
}
