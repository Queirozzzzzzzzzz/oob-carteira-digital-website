export default function Add() {
  return (
    <>
      <h1>Adicionar Curso</h1>
      <form method="POST" action="/api/v1/admin/course/add">
        <label htmlFor="course">Curso</label>
        <input type="text" id="course" name="course" required></input>

        <label htmlFor="class">Classe</label>
        <input type="text" id="c_class" name="c_class" required></input>

        <button type="submit">Adicionar</button>
      </form>
    </>
  );
}
