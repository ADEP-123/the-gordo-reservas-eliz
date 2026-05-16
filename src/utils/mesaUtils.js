import { ESTADOS_MESA } from "../data/estadosMesa";

export function normalizarEstadoMesa(estado) {
  return (
    estado?.toString().toLowerCase().trim() || ESTADOS_MESA.disponible.valor
  );
}

export function obtenerTextoEstadoMesa(estado) {
  const estadoNormalizado = normalizarEstadoMesa(estado);

  return ESTADOS_MESA[estadoNormalizado]?.texto || estado;
}

export function estaMesaDisponible(mesa) {
  return normalizarEstadoMesa(mesa?.estado) === ESTADOS_MESA.disponible.valor;
}
