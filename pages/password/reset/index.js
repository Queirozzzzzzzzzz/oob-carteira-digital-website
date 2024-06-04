export default function Reset() {
  return (
    <>
      <form
        method="POST"
        action="/api/v1/password/reset"
        className="reset_form"
      >
        <h2>Redefinir Senha</h2>

        <label for="new_password">Nova Senha</label>
        <input
          type="password"
          id="new_password"
          name="new_password"
          required
        ></input>

        <label for="confirm_new_password">Confirmar Nova Senha</label>
        <input
          type="password"
          id="confirm_new_password"
          name="confirm_new_password"
          required
        ></input>

        <button type="submit">Salvar</button>
      </form>
    </>
  );
}
