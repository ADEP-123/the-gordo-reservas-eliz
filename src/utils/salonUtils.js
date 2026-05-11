export function normalizarTexto(texto = "") {
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function obtenerMesasPorZona(mesas = [], zona) {
  return mesas.filter(mesa => {
    const ubicacion = normalizarTexto(mesa.ubicacion || mesa.zona || "");
    return ubicacion.includes(zona.match);
  });
}

export function obtenerResumenZona(mesasZona = []) {
  const mesasDisponibles = mesasZona.filter(
    mesa => normalizarTexto(mesa.estado) === "disponible",
  );

  const asientosDisponibles = mesasDisponibles.reduce(
    (total, mesa) => total + Number(mesa.capacidad || 0),
    0,
  );

  return {
    mesasDisponibles: mesasDisponibles.length,
    asientosDisponibles,
    mesasTotales: mesasZona.length,
  };
}
