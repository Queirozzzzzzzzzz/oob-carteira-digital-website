export default function Add() {
  const daysOfWeek = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  return (
    <>
      <h1>Adicionar Curso</h1>
      <form method="POST" action="/api/v1/admin/course/add">
        <label htmlFor="course">Curso</label>
        <input
          type="text"
          id="course"
          name="course"
          autoComplete="off"
          required
        ></input>

        <label htmlFor="class">Classe</label>
        <input
          type="text"
          id="c_class"
          name="c_class"
          autoComplete="off"
          required
        ></input>

        <label htmlFor="class">Horário de Entrada</label>
        <input
          type="time"
          id="enter_time"
          name="enter_time"
          autoComplete="off"
          required
        ></input>

        <label htmlFor="class">Horário de Saída</label>
        <input
          type="time"
          id="leave_time"
          name="leave_time"
          autoComplete="off"
          required
        ></input>

        <label htmlFor="class">Término do Curso</label>
        <input
          type="date"
          id="end_date"
          name="end_date"
          autoComplete="off"
          required
        ></input>

        <fieldset>
          <label>Dias</label>
          {daysOfWeek.map((day, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`day-${index}`}
                name="days"
                value={day}
              />
              <label htmlFor={`day-${index}`}>{day}</label>
            </div>
          ))}
        </fieldset>

        <button type="submit">Adicionar</button>
      </form>
    </>
  );
}
