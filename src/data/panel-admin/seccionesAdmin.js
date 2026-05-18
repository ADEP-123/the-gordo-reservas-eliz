export const SECCIONES_ADMIN = {
  mesas: "mesas",
  reservas: "reservas",
  horarios: "horarios",
  configuracion: "configuracion",
};

export const SECCIONES_INFO = {
  [SECCIONES_ADMIN.mesas]: {
    label: "Mesas",
    titulo: "Mesas del restaurante",
    inicial: "M",
  },
  [SECCIONES_ADMIN.reservas]: {
    label: "Reservas",
    titulo: "Reservas del restaurante",
    inicial: "R",
  },
  [SECCIONES_ADMIN.horarios]: {
    label: "Horarios",
    titulo: "Horarios del restaurante",
    inicial: "H",
  },
  [SECCIONES_ADMIN.configuracion]: {
    label: "Configuración",
    titulo: "Configuración del sistema",
    inicial: "C",
  },
};
