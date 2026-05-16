import { supabase } from "./supabaseClient";
import { existeCruceDeReservas, normalizarHora } from "../utils/reservaUtils";

// Obtener todas las reservas
export const getReservas = async () => {
  const { data, error } = await supabase
    .from("reservas")
    .select(
      `
      *,
      mesas (numero, capacidad, ubicacion)
    `,
    )
    .order("fecha", { ascending: true });

  if (error) {
    console.error("Error al obtener reservas:", error);
    return [];
  }

  return data;
};

// Obtener reservas por fecha
export const getReservasByFecha = async fecha => {
  const { data, error } = await supabase
    .from("reservas")
    .select(
      `
      *,
      mesas (numero, capacidad, ubicacion)
    `,
    )
    .eq("fecha", fecha)
    .eq("estado", "activa");

  if (error) {
    console.error("Error al obtener reservas por fecha:", error);
    return [];
  }

  return data;
};

// Verificar si una mesa está disponible para fecha y rango horario
export const verificarDisponibilidad = async (mesa_id, fecha, hora) => {
  const horaNormalizada = normalizarHora(hora);

  const { data, error } = await supabase
    .from("reservas")
    .select("id, hora")
    .eq("mesa_id", mesa_id)
    .eq("fecha", fecha)
    .eq("estado", "activa");

  if (error) {
    console.error("Error al verificar disponibilidad:", error);
    return false;
  }

  return !existeCruceDeReservas(data || [], horaNormalizada);
};

// Crear una nueva reserva
export const createReserva = async reserva => {
  const reservaNormalizada = {
    ...reserva,
    hora: normalizarHora(reserva.hora),
  };

  const disponible = await verificarDisponibilidad(
    reservaNormalizada.mesa_id,
    reservaNormalizada.fecha,
    reservaNormalizada.hora,
  );

  if (!disponible) {
    console.error("La mesa no está disponible para ese rango horario");
    return { error: "Mesa no disponible para ese rango horario" };
  }

  const { data, error } = await supabase
    .from("reservas")
    .insert([reservaNormalizada])
    .select()
    .single();

  if (error) {
    console.error("Error al crear reserva:", error);
    return { error };
  }

  return { data };
};

// Cancelar una reserva
export const cancelarReserva = async id => {
  const { data, error } = await supabase
    .from("reservas")
    .update({ estado: "cancelada" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al cancelar reserva:", error);
    return null;
  }

  return data;
};
