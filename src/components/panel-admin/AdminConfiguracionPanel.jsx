import { useEffect, useState } from "react";
import {
  CONFIGURACION_RESERVAS_FORM_DEFAULT,
  OPCIONES_DURACION_RESERVA,
  OPCIONES_INTERVALO_HORARIOS,
  OPCIONES_OCUPACION_MINIMA,
} from "../../data/panel-admin/configuracionReservasAdminConfig";
import useAdminConfiguracionReservas from "../../hooks/panel-admin/useAdminConfiguracionReservas";
import "../../styles/panel-admin/adminConfiguracionPanel.css";

function AdminConfiguracionPanel() {
  const {
    configuracion,
    cargandoConfiguracion,
    guardandoConfiguracion,
    errorConfiguracion,
    guardarConfiguracion,
  } = useAdminConfiguracionReservas();

  const [formData, setFormData] = useState(CONFIGURACION_RESERVAS_FORM_DEFAULT);
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    setFormData({
      duracion_reserva_minutos: configuracion.duracion_reserva_minutos,
      intervalo_horarios_minutos: configuracion.intervalo_horarios_minutos,
      ocupacion_minima_porcentaje: configuracion.ocupacion_minima_porcentaje,
    });
  }, [configuracion]);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: Number(value),
    }));

    setErrores({});
    setMensajeExito("");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (Number(formData.duracion_reserva_minutos) <= 0) {
      nuevosErrores.duracion_reserva_minutos =
        "La duración debe ser mayor a cero.";
    }

    if (Number(formData.intervalo_horarios_minutos) <= 0) {
      nuevosErrores.intervalo_horarios_minutos =
        "El intervalo debe ser mayor a cero.";
    }

    if (
      Number(formData.ocupacion_minima_porcentaje) <= 0 ||
      Number(formData.ocupacion_minima_porcentaje) > 100
    ) {
      nuevosErrores.ocupacion_minima_porcentaje =
        "La ocupación mínima debe estar entre 1% y 100%.";
    }

    if (
      Number(formData.intervalo_horarios_minutos) >
      Number(formData.duracion_reserva_minutos)
    ) {
      nuevosErrores.intervalo_horarios_minutos =
        "El intervalo no debería ser mayor que la duración de la reserva.";
    }

    return nuevosErrores;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);
    setMensajeExito("");

    if (Object.keys(nuevosErrores).length > 0) return;

    const guardado = await guardarConfiguracion(formData);

    if (guardado) {
      setMensajeExito("Configuración actualizada correctamente.");
    }
  };

  if (cargandoConfiguracion) {
    return (
      <section className="admin-configuracion">
        <div className="admin-configuracion__empty">
          Cargando configuración...
        </div>
      </section>
    );
  }

  return (
    <section className="admin-configuracion">
      {errorConfiguracion && (
        <div className="admin-configuracion__error">{errorConfiguracion}</div>
      )}

      {mensajeExito && (
        <div className="admin-configuracion__success">{mensajeExito}</div>
      )}

      <section className="admin-configuracion__layout">
        <form className="admin-configuracion__form" onSubmit={handleSubmit}>
          <span className="admin-configuracion__label">Reglas de reserva</span>

          <h3>Parámetros generales</h3>

          <div className="admin-configuracion__grupo">
            <label htmlFor="duracion_reserva_minutos">
              Duración de cada reserva
            </label>

            <select
              id="duracion_reserva_minutos"
              name="duracion_reserva_minutos"
              value={formData.duracion_reserva_minutos}
              onChange={handleChange}
            >
              {OPCIONES_DURACION_RESERVA.map(duracion => (
                <option key={duracion} value={duracion}>
                  {duracion} minutos
                </option>
              ))}
            </select>

            {errores.duracion_reserva_minutos && (
              <small>{errores.duracion_reserva_minutos}</small>
            )}
          </div>

          <div className="admin-configuracion__grupo">
            <label htmlFor="intervalo_horarios_minutos">
              Intervalo entre horarios
            </label>

            <select
              id="intervalo_horarios_minutos"
              name="intervalo_horarios_minutos"
              value={formData.intervalo_horarios_minutos}
              onChange={handleChange}
            >
              {OPCIONES_INTERVALO_HORARIOS.map(intervalo => (
                <option key={intervalo} value={intervalo}>
                  Cada {intervalo} minutos
                </option>
              ))}
            </select>

            {errores.intervalo_horarios_minutos && (
              <small>{errores.intervalo_horarios_minutos}</small>
            )}
          </div>

          <div className="admin-configuracion__grupo">
            <label htmlFor="ocupacion_minima_porcentaje">
              Ocupación mínima de una mesa
            </label>

            <select
              id="ocupacion_minima_porcentaje"
              name="ocupacion_minima_porcentaje"
              value={formData.ocupacion_minima_porcentaje}
              onChange={handleChange}
            >
              {OPCIONES_OCUPACION_MINIMA.map(porcentaje => (
                <option key={porcentaje} value={porcentaje}>
                  {porcentaje}%
                </option>
              ))}
            </select>

            {errores.ocupacion_minima_porcentaje && (
              <small>{errores.ocupacion_minima_porcentaje}</small>
            )}
          </div>

          <button
            type="submit"
            className="admin-configuracion__btn"
            disabled={guardandoConfiguracion}
          >
            {guardandoConfiguracion ? "Guardando..." : "Guardar configuración"}
          </button>
        </form>

        <aside className="admin-configuracion__info">
          <span className="admin-configuracion__label">
            Impacto en el cliente
          </span>

          <h3>Cómo afecta estas reglas</h3>

          <article>
            <strong>Duración</strong>
            <p>
              Si configuras 60 minutos, una reserva a las 19:00 bloqueará la
              mesa hasta las 20:00.
            </p>
          </article>

          <article>
            <strong>Intervalo</strong>
            <p>
              Define cada cuánto aparecen horarios en el selector del cliente:
              cada 15, 30, 45 o 60 minutos.
            </p>
          </article>

          <article>
            <strong>Ocupación mínima</strong>
            <p>
              Evita que una mesa grande se reserve para muy pocas personas. Por
              ejemplo, con 75%, una mesa de 6 requiere mínimo 5 personas.
            </p>
          </article>
        </aside>
      </section>
    </section>
  );
}

export default AdminConfiguracionPanel;
