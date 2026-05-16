import { useState } from "react";
import { RESERVA_CONFIG_DEFAULT } from "../data/reservaConfig";
import { horaRespetaIntervalo, normalizarHora } from "../utils/reservaUtils";
import "../styles/busquedaDisponibilidad.css";

function obtenerFechaActual() {
  return new Date().toISOString().split("T")[0];
}

function obtenerTextoPersonas(personas) {
  return Number(personas) === 1 ? "1 persona" : `${personas} personas`;
}

function BusquedaDisponibilidad({
  configuracion = RESERVA_CONFIG_DEFAULT,
  buscando = false,
  criteriosActivos,
  error,
  onBuscar,
  onLimpiar,
}) {
  const fechaActual = obtenerFechaActual();

  const intervaloMinutos = Number(
    configuracion?.intervalo_horarios_minutos ||
      RESERVA_CONFIG_DEFAULT.intervalo_horarios_minutos,
  );

  const duracionMinutos = Number(
    configuracion?.duracion_reserva_minutos ||
      RESERVA_CONFIG_DEFAULT.duracion_reserva_minutos,
  );

  const [formData, setFormData] = useState({
    fecha: fechaActual,
    hora: "19:00",
    personas: 2,
  });

  const [errores, setErrores] = useState({});

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    const cantidadPersonas = Number(formData.personas);

    if (!formData.fecha) {
      nuevosErrores.fecha = "Selecciona una fecha.";
    }

    if (!formData.hora) {
      nuevosErrores.hora = "Selecciona una hora.";
    }

    if (
      formData.hora &&
      !horaRespetaIntervalo(formData.hora, intervaloMinutos)
    ) {
      nuevosErrores.hora = `Usa intervalos de ${intervaloMinutos} minutos.`;
    }

    if (!cantidadPersonas || cantidadPersonas < 1) {
      nuevosErrores.personas = "Ingresa al menos una persona.";
    }

    return nuevosErrores;
  };

  const handleSubmit = event => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    onBuscar({
      fecha: formData.fecha,
      hora: normalizarHora(formData.hora),
      personas: Number(formData.personas),
    });
  };

  return (
    <section
      className={`busqueda-disponibilidad ${
        !criteriosActivos ? "busqueda-disponibilidad--inicial" : ""
      }`}
    >
      <div className="busqueda-disponibilidad__intro">
        <span>Buscar disponibilidad</span>
        <h2>Encuentra una mesa según tu visita</h2>
        <p>
          Indica fecha, hora y número de personas. Después de buscar, te
          mostraremos el mapa del restaurante con las zonas y mesas disponibles
          para tu visita.
        </p>
      </div>

      <form className="busqueda-disponibilidad__form" onSubmit={handleSubmit}>
        <div className="busqueda-disponibilidad__grupo">
          <label htmlFor="busqueda-fecha">Fecha</label>
          <input
            id="busqueda-fecha"
            name="fecha"
            type="date"
            min={fechaActual}
            value={formData.fecha}
            onChange={handleChange}
          />
          {errores.fecha && <small>{errores.fecha}</small>}
        </div>

        <div className="busqueda-disponibilidad__grupo">
          <label htmlFor="busqueda-hora">Hora</label>
          <input
            id="busqueda-hora"
            name="hora"
            type="time"
            step={intervaloMinutos * 60}
            value={formData.hora}
            onChange={handleChange}
          />
          {errores.hora && <small>{errores.hora}</small>}
        </div>

        <div className="busqueda-disponibilidad__grupo">
          <label htmlFor="busqueda-personas">Personas</label>
          <input
            id="busqueda-personas"
            name="personas"
            type="number"
            min="1"
            value={formData.personas}
            onChange={handleChange}
          />
          {errores.personas && <small>{errores.personas}</small>}
        </div>

        <div className="busqueda-disponibilidad__acciones">
          <button
            type="submit"
            className="busqueda-disponibilidad__btn busqueda-disponibilidad__btn--principal"
            disabled={buscando}
          >
            {buscando ? "Buscando..." : "Buscar mesas"}
          </button>

          {criteriosActivos && (
            <button
              type="button"
              className="busqueda-disponibilidad__btn busqueda-disponibilidad__btn--secundario"
              onClick={onLimpiar}
              disabled={buscando}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      </form>

      <div className="busqueda-disponibilidad__meta">
        <span>
          Duración configurada: <strong>{duracionMinutos} min</strong>
        </span>

        <span>
          Intervalos: <strong>cada {intervaloMinutos} min</strong>
        </span>
      </div>

      {criteriosActivos && (
        <div className="busqueda-disponibilidad__resultado">
          Mostrando disponibilidad para el{" "}
          <strong>{criteriosActivos.fecha}</strong> a las{" "}
          <strong>{criteriosActivos.hora}</strong>, para{" "}
          <strong>{obtenerTextoPersonas(criteriosActivos.personas)}</strong>.
        </div>
      )}

      {error && <div className="busqueda-disponibilidad__error">{error}</div>}
    </section>
  );
}

export default BusquedaDisponibilidad;
