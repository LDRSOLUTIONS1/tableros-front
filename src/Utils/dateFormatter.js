export const dateFormatter = (dateString) => {
  if (!dateString) return "";

  let fecha;
  let mostrarHora = false;

  // Formato: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-");

    fecha = new Date(Number(year), Number(month) - 1, Number(day));
  }

  // Formato: YYYY-MM-DD HH:mm:ss
  else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
    const [datePart, timePart] = dateString.split(" ");

    const [year, month, day] = datePart.split("-");
    const [hours, minutes, seconds] = timePart.split(":");

    fecha = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    );

    mostrarHora = true;
  }

  // Formato ISO: YYYY-MM-DDTHH:mm:ss...Z
  else if (dateString.includes("T")) {
    const datePart = dateString.split("T")[0];

    const [year, month, day] = datePart.split("-");

    fecha = new Date(Number(year), Number(month) - 1, Number(day));

    mostrarHora = false;
  } else {
    return "";
  }

  if (isNaN(fecha.getTime())) return "";

  const fechaTexto = fecha.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (!mostrarHora) {
    return fechaTexto;
  }

  const horaTexto = fecha.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${fechaTexto} - ${horaTexto}`;
};
