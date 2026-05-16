import { RESERVA_CONFIG_DEFAULT } from "../data/reservaConfig";

export function normalizarHora(hora = "") {
  const [horas = "00", minutos = "00"] = hora.toString().split(":");

  return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
}

export function convertirHoraAMinutos(hora) {
  const horaNormalizada = normalizarHora(hora);
  const [horas, minutos] = horaNormalizada.split(":").map(Number);

  return horas * 60 + minutos;
}

export function convertirMinutosAHora(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

export function calcularHoraFin(
  horaInicio,
  duracionMinutos = RESERVA_CONFIG_DEFAULT.duracion_reserva_minutos,
) {
  const inicioMinutos = convertirHoraAMinutos(horaInicio);
  const finMinutos = inicioMinutos + Number(duracionMinutos);

  return convertirMinutosAHora(finMinutos);
}

export function obtenerRangoReservaPorHoras(horaInicio, horaFin) {
  return {
    inicio: convertirHoraAMinutos(horaInicio),
    fin: convertirHoraAMinutos(horaFin),
  };
}

export function rangosSeCruzan(rangoExistente, rangoNuevo) {
  return (
    rangoExistente.inicio < rangoNuevo.fin &&
    rangoNuevo.inicio < rangoExistente.fin
  );
}

export function reservasSeCruzan(reservaExistente, nuevaReserva) {
  const rangoExistente = obtenerRangoReservaPorHoras(
    reservaExistente.hora,
    reservaExistente.hora_fin,
  );

  const rangoNuevo = obtenerRangoReservaPorHoras(
    nuevaReserva.hora,
    nuevaReserva.hora_fin,
  );

  return rangosSeCruzan(rangoExistente, rangoNuevo);
}

export function existeCruceDeReservas(reservas = [], nuevaReserva) {
  return reservas.some(reserva => reservasSeCruzan(reserva, nuevaReserva));
}

export function horaRespetaIntervalo(hora, intervaloMinutos) {
  return convertirHoraAMinutos(hora) % Number(intervaloMinutos) === 0;
}
