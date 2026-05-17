import { RESERVA_CONFIG_DEFAULT } from "../data/reservaConfig";
import { supabase } from "./supabaseClient";

const CONFIG_GLOBAL = "global";

export const getConfiguracionReservas = async () => {
  const { data, error } = await supabase
    .from("configuracion_reservas")
    .select("*")
    .eq("nombre", CONFIG_GLOBAL)
    .eq("activo", true)
    .single();

  if (error) {
    console.error("Error al obtener configuración de reservas:", error);

    return {
      nombre: CONFIG_GLOBAL,
      ...RESERVA_CONFIG_DEFAULT,
    };
  }

  return data;
};

export const updateConfiguracionReservas = async cambios => {
  const payload = {
    ...cambios,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("configuracion_reservas")
    .update(payload)
    .eq("nombre", CONFIG_GLOBAL)
    .select()
    .single();

  if (error) {
    console.error("Error al actualizar configuración de reservas:", error);
    return null;
  }

  return data;
};
