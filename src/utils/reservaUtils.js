import { DURACION_RESERVA_MINUTOS } from "../data/reservaConfig";

export function normalizarHora(hora = "") {
  const [horas = "00", minutos = "00"] = hora.toString().split(":");

  return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
}

export function convertirHoraAMinutos(hora) {
  const horaNormalizada = normalizarHora(hora);
  const [horas, minutos] = horaNormalizada.split(":").map(Number);

  return horas * 60 + minutos;
}

export function obtenerRangoReserva(
  hora,
  duracionMinutos = DURACION_RESERVA_MINUTOS,
) {
  const inicio = convertirHoraAMinutos(hora);

  return {
    inicio,
    fin: inicio + duracionMinutos,
  };
}

export function reservasSeCruzan(
  horaReservaExistente,
  horaNuevaReserva,
  duracionMinutos = DURACION_RESERVA_MINUTOS,
) {
  const reservaExistente = obtenerRangoReserva(
    horaReservaExistente,
    duracionMinutos,
  );

  const nuevaReserva = obtenerRangoReserva(horaNuevaReserva, duracionMinutos);

  return (
    reservaExistente.inicio < nuevaReserva.fin &&
    nuevaReserva.inicio < reservaExistente.fin
  );
}

export function existeCruceDeReservas(
  reservas = [],
  horaNuevaReserva,
  duracionMinutos = DURACION_RESERVA_MINUTOS,
) {
  return reservas.some(reserva =>
    reservasSeCruzan(reserva.hora, horaNuevaReserva, duracionMinutos),
  );
}

export function horaRespetaIntervalo(hora, intervaloMinutos) {
  return convertirHoraAMinutos(hora) % intervaloMinutos === 0;
}

export function obtenerTextoDuracionReserva() {
  if (DURACION_RESERVA_MINUTOS === 60) return "1 hora";

  return `${DURACION_RESERVA_MINUTOS} minutos`;
}
