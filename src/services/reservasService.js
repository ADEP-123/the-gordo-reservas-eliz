import { supabase } from "./supabaseClient";

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

// Verificar si una mesa está disponible para fecha y hora
export const verificarDisponibilidad = async (mesa_id, fecha, hora) => {
  const { data, error } = await supabase
    .from("reservas")
    .select("id")
    .eq("mesa_id", mesa_id)
    .eq("fecha", fecha)
    .eq("hora", hora)
    .eq("estado", "activa");

  if (error) {
    console.error("Error al verificar disponibilidad:", error);
    return false;
  }

  // Si no hay reservas para esa mesa, fecha y hora, está disponible
  return data.length === 0;
};

// Crear una nueva reserva
export const createReserva = async reserva => {
  // Verificar disponibilidad antes de crear
  const disponible = await verificarDisponibilidad(
    reserva.mesa_id,
    reserva.fecha,
    reserva.hora,
  );

  if (!disponible) {
    console.error("La mesa no está disponible para ese horario");
    return { error: "Mesa no disponible para ese horario" };
  }

  const { data, error } = await supabase
    .from("reservas")
    .insert([reserva])
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
