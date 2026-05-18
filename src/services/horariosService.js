import { supabase } from "./supabaseClient";
import {
  convertirHoraAMinutos,
  convertirMinutosAHora,
} from "../utils/reservaUtils";

const DIAS_SEMANA = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

function obtenerDiaSemana(fecha) {
  const [year, month, day] = fecha.split("-").map(Number);
  const fechaLocal = new Date(year, month - 1, day);

  return DIAS_SEMANA[fechaLocal.getDay()];
}

export function generarOpcionesHorario({
  horaInicio,
  horaFin,
  duracionMinutos,
  intervaloMinutos,
}) {
  const apertura = convertirHoraAMinutos(horaInicio);
  const cierre = convertirHoraAMinutos(horaFin);
  const duracion = Number(duracionMinutos);
  const intervalo = Number(intervaloMinutos);

  const opciones = [];

  for (
    let minutoActual = apertura;
    minutoActual + duracion <= cierre;
    minutoActual += intervalo
  ) {
    opciones.push(convertirMinutosAHora(minutoActual));
  }

  return opciones;
}

// Obtener todos los horarios activos
export const getHorarios = async () => {
  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .eq("activo", true)
    .order("dia_semana", { ascending: true });

  if (error) {
    console.error("Error al obtener horarios:", error);
    return [];
  }

  return data;
};

// Obtener horarios por día de la semana
export const getHorariosByDia = async dia => {
  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .eq("dia_semana", dia)
    .eq("activo", true);

  if (error) {
    console.error("Error al obtener horarios por día:", error);
    return [];
  }

  return data;
};

// Obtener horario activo según fecha
export const getHorarioActivoPorFecha = async fecha => {
  const diaSemana = obtenerDiaSemana(fecha);

  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .eq("dia_semana", diaSemana)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    console.error("Error al obtener horario activo por fecha:", error);
    return null;
  }

  return data;
};

// Obtener opciones de hora válidas según fecha y configuración
export const getOpcionesHorarioPorFecha = async (fecha, configuracion) => {
  if (!fecha || !configuracion) {
    return {
      horario: null,
      opciones: [],
    };
  }

  const horario = await getHorarioActivoPorFecha(fecha);

  if (!horario) {
    return {
      horario: null,
      opciones: [],
    };
  }

  const opciones = generarOpcionesHorario({
    horaInicio: horario.hora_inicio,
    horaFin: horario.hora_fin,
    duracionMinutos: configuracion.duracion_reserva_minutos,
    intervaloMinutos: configuracion.intervalo_horarios_minutos,
  });

  return {
    horario,
    opciones,
  };
};

// Crear un horario nuevo
export const createHorario = async horario => {
  const { data, error } = await supabase
    .from("horarios")
    .insert([horario])
    .select()
    .single();

  if (error) {
    console.error("Error al crear horario:", error);
    return null;
  }

  return data;
};

// Actualizar un horario existente
export const updateHorario = async (id, cambios) => {
  const { data, error } = await supabase
    .from("horarios")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar horario:", error);
    return null;
  }

  return data;
};

// Activar o desactivar un horario
export const toggleHorario = async (id, activo) => {
  return await updateHorario(id, { activo });
};

export const getHorariosAdmin = async () => {
  const { data, error } = await supabase.from("horarios").select("*");

  if (error) {
    console.error("Error al obtener horarios para admin:", error);
    return [];
  }

  return data;
};
