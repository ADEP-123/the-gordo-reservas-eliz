import { ESTADOS_MESA } from "../estadosMesa";

export const FORM_MESA_INICIAL = {
  id: null,
  numero: "",
  capacidad: "",
  ubicacion: "Zona central",
  estado: ESTADOS_MESA.disponible.valor,
};

export const UBICACIONES_MESA = ["Zona ventana", "Zona central", "Terraza"];
