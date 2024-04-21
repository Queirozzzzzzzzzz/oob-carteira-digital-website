export default function Notification(req, res) {
  return (
    <>
      <h1>Enviar Notificações</h1>
      <form action="" className="notify">
        <label htmlFor="name">Nome:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="message">Mensagem:</label>
        <textarea id="message" name="message" required></textarea>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
}
