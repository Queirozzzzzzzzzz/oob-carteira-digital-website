export default function Notification(req, res) {
  return (
    <>
      <h1>Enviar Notificações</h1>
      <form action="" className="notify">
        <label htmlFor="name">Nome:</label>
        <input type="text" id="name" name="name" autoComplete="off" required />

        <label htmlFor="">Destinatários:</label>

        <label htmlFor="message">Mensagem:</label>
        <textarea
          id="message"
          name="message"
          autoComplete="off"
          required
        ></textarea>

        <button type="submit">Enviar</button>
      </form>
    </>
  );
}
