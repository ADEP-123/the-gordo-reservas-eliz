import { supabase } from "./supabaseClient";

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
