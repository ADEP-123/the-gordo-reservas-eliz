import { supabase } from "./supabaseClient";
import { normalizarHora } from "../utils/reservaUtils";

// Obtener todas las reservas.
// Ahora esto es solo para admin, porque RLS bloquea lectura pública.
export const getReservas = async () => {
  const { data, error } = await supabase
    .from("reservas")
    .select(
      `
      *,
      mesas (numero, capacidad, ubicacion),
      clientes (cliente_nombre, cliente_tel, cliente_email)
    `,
    )
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) {
    console.error("Error al obtener reservas:", error);
    return [];
  }

  return data;
};

// Obtener reservas por fecha.
// Ahora esto es solo para admin.
export const getReservasByFecha = async fecha => {
  const { data, error } = await supabase
    .from("reservas")
    .select(
      `
      *,
      mesas (numero, capacidad, ubicacion),
      clientes (cliente_nombre, cliente_tel, cliente_email)
    `,
    )
    .eq("fecha", fecha)
    .eq("estado", "activa")
    .order("hora", { ascending: true });

  if (error) {
    console.error("Error al obtener reservas por fecha:", error);
    return [];
  }

  return data;
};

// Verificar mesa concreta usando RPC segura.
export const verificarDisponibilidad = async (
  mesa_id,
  fecha,
  hora,
  _duracionMinutos,
  num_personas,
) => {
  const { data, error } = await supabase.rpc("verificar_mesa_disponible", {
    p_mesa_id: mesa_id,
    p_fecha: fecha,
    p_hora: normalizarHora(hora),
    p_num_personas: Number(num_personas),
  });

  if (error) {
    console.error("Error al verificar disponibilidad:", error);
    return false;
  }

  return Boolean(data);
};

// Obtener mesas con disponibilidad sin exponer reservas/clientes.
export const getMesasConDisponibilidad = async ({
  fecha,
  hora,
  num_personas,
}) => {
  const { data, error } = await supabase.rpc("get_mesas_con_disponibilidad", {
    p_fecha: fecha,
    p_hora: normalizarHora(hora),
    p_num_personas: Number(num_personas),
  });

  if (error) {
    console.error("Error al obtener mesas con disponibilidad:", error);
    return [];
  }

  return data || [];
};

// Crear reserva pública mediante RPC controlada.
export const createReserva = async reserva => {
  const { data, error } = await supabase.rpc("crear_reserva_publica", {
    p_mesa_id: reserva.mesa_id,
    p_cliente_nombre: reserva.cliente_nombre,
    p_cliente_tel: reserva.cliente_tel,
    p_cliente_email: reserva.cliente_email || null,
    p_fecha: reserva.fecha,
    p_hora: normalizarHora(reserva.hora),
    p_num_personas: Number(reserva.num_personas),
    p_observaciones: reserva.observaciones || null,
  });

  if (error) {
    console.error("Error al crear reserva:", error);

    return {
      data: null,
      error: error.message || "No fue posible crear la reserva.",
    };
  }

  return {
    data,
    error: null,
  };
};

// Sugerir siguiente horario sin exponer reservas.
export const buscarSiguienteHorarioDisponible = async ({
  fecha,
  hora,
  num_personas,
}) => {
  const { data, error } = await supabase.rpc(
    "buscar_siguiente_horario_disponible",
    {
      p_fecha: fecha,
      p_hora: normalizarHora(hora),
      p_num_personas: Number(num_personas),
    },
  );

  if (error) {
    console.error("Error al buscar siguiente horario disponible:", error);
    return null;
  }

  return data?.[0] || null;
};

// Cancelar reserva.
// Solo admin podrá hacerlo por RLS.
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
