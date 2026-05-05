import { supabase } from "./supabaseClient";

// Obtener todas las mesas
export const getMesas = async () => {
  const { data, error } = await supabase
    .from("mesas")
    .select("*")
    .order("numero", { ascending: true });

  if (error) {
    console.error("Error al obtener mesas:", error);
    return [];
  }
  return data;
};

// Obtener una mesa por ID
export const getMesaById = async id => {
  const { data, error } = await supabase
    .from("mesas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener mesa:", error);
    return null;
  }
  return data;
};

// Crear una nueva mesa
export const createMesa = async mesa => {
  const { data, error } = await supabase
    .from("mesas")
    .insert([mesa])
    .select()
    .single();

  if (error) {
    console.error("Error al crear mesa:", error);
    return null;
  }
  return data;
};

// Actualizar una mesa existente
export const updateMesa = async (id, cambios) => {
  const { data, error } = await supabase
    .from("mesas")
    .update(cambios)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar mesa:", error);
    return null;
  }
  return data;
};

// Cambiar estado de una mesa (disponible, ocupada, bloqueada)
export const cambiarEstadoMesa = async (id, estado) => {
  return await updateMesa(id, { estado });
};
