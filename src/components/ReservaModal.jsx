import { useState } from "react";
import "../styles/reservaModal.css";
import { INTERVALO_HORARIOS_MINUTOS } from "../data/reservaConfig";
import {
  horaRespetaIntervalo,
  obtenerTextoDuracionReserva,
} from "../utils/reservaUtils";

function obtenerFechaActual() {
  return new Date().toISOString().split("T")[0];
}

function ReservaModal({ mesa, zona, onCerrar, onVolver, onContinuar }) {
  const fechaActual = obtenerFechaActual();

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    fecha: fechaActual,
    hora: "19:00",
    personas: 1,
    observaciones: "",
  });

  const [errores, setErrores] = useState({});

  if (!mesa) return null;

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

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del cliente es obligatorio.";
    }

    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    }

    if (
      formData.correo &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
    ) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = "Selecciona una fecha.";
    }

    if (!formData.hora) {
      nuevosErrores.hora = "Selecciona una hora.";
    }

    if (
      formData.hora &&
      !horaRespetaIntervalo(formData.hora, INTERVALO_HORARIOS_MINUTOS)
    ) {
      nuevosErrores.hora = `Selecciona una hora en intervalos de ${INTERVALO_HORARIOS_MINUTOS} minutos.`;
    }

    if (!cantidadPersonas || cantidadPersonas < 1) {
      nuevosErrores.personas = "Debe haber al menos una persona.";
    }

    if (cantidadPersonas > Number(mesa.capacidad)) {
      nuevosErrores.personas = `Esta mesa permite máximo ${mesa.capacidad} personas.`;
    }

    return nuevosErrores;
  };

  const handleSubmit = event => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const reservaBorrador = {
      mesa,
      zona,
      mesa_id: mesa.id,
      cliente_nombre: formData.nombre.trim(),
      cliente_tel: formData.telefono.trim(),
      cliente_email: formData.correo.trim(),
      fecha: formData.fecha,
      hora: formData.hora,
      num_personas: Number(formData.personas),
    };

    onContinuar(reservaBorrador);
  };

  return (
    <section className="reserva-modal-backdrop">
      <article
        className="reserva-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reserva-modal-title"
      >
        <button
          type="button"
          className="reserva-modal__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar formulario de reserva"
        >
          ×
        </button>

        <header className="reserva-modal__header">
          <div>
            <span className="reserva-modal__label">Datos de reserva</span>
            <h2 id="reserva-modal-title">Reserva la mesa {mesa.numero}</h2>
            <p>
              Completa los datos del cliente. En el siguiente paso se confirmará
              la disponibilidad antes de guardar la reserva.
            </p>
          </div>
        </header>

        <div className="reserva-modal__body">
          <aside className="reserva-modal__resumen">
            <span>Resumen</span>
            <h3>Mesa {mesa.numero}</h3>

            <div className="reserva-modal__dato">
              <p>Zona</p>
              <strong>{zona?.nombre || mesa.ubicacion}</strong>
            </div>

            <div className="reserva-modal__dato">
              <p>Capacidad</p>
              <strong>{mesa.capacidad} personas</strong>
            </div>

            <div className="reserva-modal__dato">
              <p>Estado</p>
              <strong>{mesa.estado}</strong>
            </div>
          </aside>

          <form className="reserva-modal__form" onSubmit={handleSubmit}>
            <div className="reserva-modal__grupo">
              <label htmlFor="nombre">Nombre del cliente</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: María Gómez"
              />
              {errores.nombre && <small>{errores.nombre}</small>}
            </div>

            <div className="reserva-modal__grupo">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Ej: 300 123 4567"
              />
              {errores.telefono && <small>{errores.telefono}</small>}
            </div>

            <div className="reserva-modal__grupo">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                placeholder="cliente@email.com"
              />
              {errores.correo && <small>{errores.correo}</small>}
            </div>

            <div className="reserva-modal__fila">
              <div className="reserva-modal__grupo">
                <label htmlFor="fecha">Fecha</label>
                <input
                  id="fecha"
                  name="fecha"
                  type="date"
                  min={fechaActual}
                  value={formData.fecha}
                  onChange={handleChange}
                />
                {errores.fecha && <small>{errores.fecha}</small>}
              </div>

              <div className="reserva-modal__grupo">
                <label htmlFor="hora">Hora</label>
                <input
                  id="hora"
                  name="hora"
                  type="time"
                  step={INTERVALO_HORARIOS_MINUTOS * 60}
                  value={formData.hora}
                  onChange={handleChange}
                />
                {errores.hora && <small>{errores.hora}</small>}

                {!errores.hora && (
                  <small className="reserva-modal__ayuda">
                    Cada reserva bloquea la mesa por{" "}
                    {obtenerTextoDuracionReserva()}.
                  </small>
                )}
              </div>
            </div>

            <div className="reserva-modal__grupo">
              <label htmlFor="personas">Número de personas</label>
              <input
                id="personas"
                name="personas"
                type="number"
                min="1"
                max={mesa.capacidad}
                value={formData.personas}
                onChange={handleChange}
              />
              {errores.personas && <small>{errores.personas}</small>}
            </div>

            <div className="reserva-modal__grupo">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                rows="4"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Ej: silla para bebé, celebración, mesa cerca de la ventana..."
              />
            </div>

            <div className="reserva-modal__acciones">
              <button
                type="button"
                className="reserva-modal__btn reserva-modal__btn--secundario"
                onClick={onVolver}
              >
                Volver a mesas
              </button>

              <button
                type="submit"
                className="reserva-modal__btn reserva-modal__btn--principal"
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      </article>
    </section>
  );
}

export default ReservaModal;
