import { supabase } from "./supabaseClient";
import { obtenerOCrearCliente } from "./clientesService";
import { getConfiguracionReservas } from "./configuracionReservasService";
import {
  calcularHoraFin,
  calcularMinimoPersonasMesa,
  existeCruceDeReservas,
  mesaCumpleOcupacionMinima,
  normalizarHora,
} from "../utils/reservaUtils";

function crearRespuestaError(error) {
  return {
    data: null,
    error,
  };
}

function crearReservaNormalizada(reserva, configuracion) {
  const duracionMinutos = Number(configuracion.duracion_reserva_minutos);
  const hora = normalizarHora(reserva.hora);
  const horaFin = reserva.hora_fin || calcularHoraFin(hora, duracionMinutos);

  return {
    mesa_id: reserva.mesa_id,
    cliente_id: reserva.cliente_id,
    fecha: reserva.fecha,
    hora,
    hora_fin: normalizarHora(horaFin),
    duracion_minutos: duracionMinutos,
    num_personas: Number(reserva.num_personas),
    observaciones: reserva.observaciones?.trim() || null,
    estado: reserva.estado || "activa",
  };
}

// Obtener todas las reservas
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

// Obtener reservas por fecha
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

// Verificar si una mesa está disponible para fecha y rango horario
export const verificarDisponibilidad = async (
  mesa_id,
  fecha,
  hora,
  duracionMinutos,
) => {
  const configuracion = await getConfiguracionReservas();
  const duracionReserva =
    duracionMinutos || Number(configuracion.duracion_reserva_minutos);

  const horaNormalizada = normalizarHora(hora);
  const horaFin = calcularHoraFin(horaNormalizada, duracionReserva);

  const nuevaReserva = {
    hora: horaNormalizada,
    hora_fin: horaFin,
  };

  const { data, error } = await supabase
    .from("reservas")
    .select("id, hora, hora_fin")
    .eq("mesa_id", mesa_id)
    .eq("fecha", fecha)
    .eq("estado", "activa");

  if (error) {
    console.error("Error al verificar disponibilidad:", error);
    return false;
  }

  return !existeCruceDeReservas(data || [], nuevaReserva);
};

// Obtener mesas con disponibilidad calculada para búsqueda
export const getMesasConDisponibilidad = async ({
  fecha,
  hora,
  num_personas,
}) => {
  const configuracion = await getConfiguracionReservas();
  const duracionMinutos = Number(configuracion.duracion_reserva_minutos);
  const horaNormalizada = normalizarHora(hora);
  const horaFin = calcularHoraFin(horaNormalizada, duracionMinutos);

  const { data: mesas, error: mesasError } = await supabase
    .from("mesas")
    .select("*")
    .order("numero", { ascending: true });

  if (mesasError) {
    console.error("Error al obtener mesas:", mesasError);
    return [];
  }

  const { data: reservas, error: reservasError } = await supabase
    .from("reservas")
    .select("id, mesa_id, hora, hora_fin")
    .eq("fecha", fecha)
    .eq("estado", "activa");

  if (reservasError) {
    console.error(
      "Error al obtener reservas para disponibilidad:",
      reservasError,
    );
    return [];
  }

  const nuevaReserva = {
    hora: horaNormalizada,
    hora_fin: horaFin,
  };

  return (mesas || []).map(mesa => {
    const reservasMesa = (reservas || []).filter(
      reserva => reserva.mesa_id === mesa.id,
    );

    const tieneCruce = existeCruceDeReservas(reservasMesa, nuevaReserva);
    const capacidadMesa = Number(mesa.capacidad);
    const personasSolicitadas = Number(num_personas);
    const ocupacionMinimaPorcentaje = Number(
      configuracion.ocupacion_minima_porcentaje,
    );

    const minimoPersonasMesa = calcularMinimoPersonasMesa(
      capacidadMesa,
      ocupacionMinimaPorcentaje,
    );

    const noCumpleCapacidad = personasSolicitadas > capacidadMesa;
    const noCumpleMinimo = !mesaCumpleOcupacionMinima({
      capacidad: capacidadMesa,
      numPersonas: personasSolicitadas,
      ocupacionMinimaPorcentaje,
    });

    const estaBloqueada = mesa.estado === "bloqueada";

    const disponibleParaCriterio =
      !tieneCruce && !noCumpleCapacidad && !noCumpleMinimo && !estaBloqueada;

    let estadoCalculado = "disponible";

    if (estaBloqueada) {
      estadoCalculado = "bloqueada";
    } else if (tieneCruce || noCumpleCapacidad) {
      estadoCalculado = "ocupada";
    } else if (noCumpleMinimo) {
      estadoCalculado = "ocupacion_baja";
    }

    return {
      ...mesa,
      disponible_para_criterio: disponibleParaCriterio,
      estado_original: mesa.estado,
      minimo_personas_requerido: minimoPersonasMesa,
      motivo_no_disponibilidad: tieneCruce
        ? "Mesa reservada en ese horario"
        : noCumpleCapacidad
          ? "La mesa no tiene capacidad suficiente"
          : noCumpleMinimo
            ? `Requiere mínimo ${minimoPersonasMesa} personas`
            : estaBloqueada
              ? "Mesa bloqueada"
              : null,
      estado: estadoCalculado,
    };
  });
};

// Crear una nueva reserva
export const createReserva = async reserva => {
  const configuracion = await getConfiguracionReservas();

  const { data: cliente, error: clienteError } = await obtenerOCrearCliente({
    cliente_nombre: reserva.cliente_nombre,
    cliente_tel: reserva.cliente_tel,
    cliente_email: reserva.cliente_email,
  });

  if (clienteError || !cliente) {
    return crearRespuestaError(
      clienteError || "No fue posible registrar los datos del cliente",
    );
  }

  const reservaNormalizada = crearReservaNormalizada(
    {
      ...reserva,
      cliente_id: cliente.id,
    },
    configuracion,
  );

  const disponible = await verificarDisponibilidad(
    reservaNormalizada.mesa_id,
    reservaNormalizada.fecha,
    reservaNormalizada.hora,
    reservaNormalizada.duracion_minutos,
  );

  if (!disponible) {
    return crearRespuestaError("Mesa no disponible para ese rango horario");
  }

  const { data, error } = await supabase
    .from("reservas")
    .insert([reservaNormalizada])
    .select(
      `
      *,
      mesas (numero, capacidad, ubicacion),
      clientes (cliente_nombre, cliente_tel, cliente_email)
    `,
    )
    .single();

  if (error) {
    console.error("Error al crear reserva:", error);
    return crearRespuestaError(error);
  }

  return { data, error: null };
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
