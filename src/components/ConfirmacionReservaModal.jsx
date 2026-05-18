import { useEffect, useState } from "react";
import {
  createReserva,
  verificarDisponibilidad,
} from "../services/reservasService";
import "../styles/confirmacionReservaModal.css";

function crearPayloadReserva(reserva) {
  return {
    mesa_id: reserva.mesa_id,
    cliente_nombre: reserva.cliente_nombre,
    cliente_tel: reserva.cliente_tel,
    cliente_email: reserva.cliente_email || null,
    fecha: reserva.fecha,
    hora: reserva.hora,
    hora_fin: reserva.hora_fin,
    duracion_minutos: reserva.duracion_minutos,
    num_personas: reserva.num_personas,
    observaciones: reserva.observaciones || null,
    estado: "activa",
  };
}

function ConfirmacionReservaModal({
  reserva,
  onCerrar,
  onVolver,
  onReservaCreada,
}) {
  const [verificando, setVerificando] = useState(true);
  const [disponible, setDisponible] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [reservaCreada, setReservaCreada] = useState(null);

  useEffect(() => {
    let componenteActivo = true;

    const validarDisponibilidad = async () => {
      if (!reserva) return;

      try {
        setVerificando(true);
        setError("");

        const estaDisponible = await verificarDisponibilidad(
          reserva.mesa_id,
          reserva.fecha,
          reserva.hora,
          reserva.duracion_minutos,
          reserva.num_personas,
        );

        if (!componenteActivo) return;

        setDisponible(estaDisponible);

        if (!estaDisponible) {
          setError(
            "La mesa ya no está disponible para la fecha y hora seleccionadas.",
          );
        }
      } catch (error) {
        console.error("Error al validar disponibilidad:", error);

        if (!componenteActivo) return;

        setDisponible(false);
        setError("No fue posible validar la disponibilidad de la mesa.");
      } finally {
        if (componenteActivo) {
          setVerificando(false);
        }
      }
    };

    validarDisponibilidad();

    return () => {
      componenteActivo = false;
    };
  }, [reserva]);

  if (!reserva) return null;

  const confirmarReserva = async () => {
    try {
      setGuardando(true);
      setError("");

      const payload = crearPayloadReserva(reserva);
      const resultado = await createReserva(payload);

      if (resultado.error) {
        const mensaje =
          typeof resultado.error === "string"
            ? resultado.error
            : resultado.error.message || "No fue posible crear la reserva.";

        setError(mensaje);
        return;
      }

      setReservaCreada(resultado.data);
    } catch (error) {
      console.error("Error al confirmar reserva:", error);
      setError("Ocurrió un error inesperado al confirmar la reserva.");
    } finally {
      setGuardando(false);
    }
  };

  if (reservaCreada) {
    return (
      <section className="confirmacion-modal-backdrop">
        <article
          className="confirmacion-modal confirmacion-modal--success"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmacion-success-title"
        >
          <div className="confirmacion-modal__success-icon">✓</div>

          <span className="confirmacion-modal__label">Reserva confirmada</span>

          <h2 id="confirmacion-success-title">
            Tu reserva fue creada correctamente
          </h2>

          <p>
            La Mesa {reserva.mesa.numero} quedó reservada para el{" "}
            <strong>{reserva.fecha}</strong> a las{" "}
            <strong>{reserva.hora}</strong>.
          </p>

          <div className="confirmacion-modal__acciones">
            <button
              type="button"
              className="confirmacion-modal__btn confirmacion-modal__btn--principal"
              onClick={() => onReservaCreada(reservaCreada)}
            >
              Finalizar
            </button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="confirmacion-modal-backdrop">
      <article
        className="confirmacion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmacion-modal-title"
      >
        <button
          type="button"
          className="confirmacion-modal__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar confirmación de reserva"
        >
          ×
        </button>

        <header className="confirmacion-modal__header">
          <span className="confirmacion-modal__label">Confirmar reserva</span>
          <h2 id="confirmacion-modal-title">Revisa los datos</h2>
          <p>
            Antes de guardar la reserva, verificamos si la mesa sigue disponible
            para la fecha y hora seleccionadas.
          </p>
        </header>

        <div className="confirmacion-modal__estado">
          {verificando ? (
            <span className="confirmacion-modal__estado-chip confirmacion-modal__estado-chip--loading">
              Validando disponibilidad...
            </span>
          ) : disponible ? (
            <span className="confirmacion-modal__estado-chip confirmacion-modal__estado-chip--ok">
              Mesa disponible
            </span>
          ) : (
            <span className="confirmacion-modal__estado-chip confirmacion-modal__estado-chip--error">
              Mesa no disponible
            </span>
          )}
        </div>

        <div className="confirmacion-modal__grid">
          <section className="confirmacion-modal__card">
            <span>Mesa</span>
            <h3>Mesa {reserva.mesa.numero}</h3>

            <div className="confirmacion-modal__dato">
              <p>Zona</p>
              <strong>{reserva.zona?.nombre || reserva.mesa.ubicacion}</strong>
            </div>

            <div className="confirmacion-modal__dato">
              <p>Capacidad</p>
              <strong>{reserva.mesa.capacidad} personas</strong>
            </div>

            <div className="confirmacion-modal__dato">
              <p>Personas</p>
              <strong>{reserva.num_personas}</strong>
            </div>
          </section>

          <section className="confirmacion-modal__card">
            <span>Cliente</span>
            <h3>{reserva.cliente_nombre}</h3>
            <strong>{reserva.cliente_tel}</strong>
            <strong>{reserva.cliente_email || "No registrado"}</strong>
            <strong>{reserva.num_personas}</strong>

            <div className="confirmacion-modal__dato">
              <p>Teléfono</p>
              <strong>{reserva.cliente_tel}</strong>
            </div>

            <div className="confirmacion-modal__dato">
              <p>Correo</p>
              <strong>{reserva.cliente_email || "No registrado"}</strong>
            </div>
          </section>

          <section className="confirmacion-modal__card confirmacion-modal__card--full">
            <span>Fecha y hora</span>

            <div className="confirmacion-modal__fecha">
              <strong>{reserva.fecha}</strong>
              <strong>
                {reserva.hora} - {reserva.hora_fin}
              </strong>
            </div>

            {reserva.observaciones && (
              <div className="confirmacion-modal__observaciones">
                <p>Observaciones</p>
                <strong>{reserva.observaciones}</strong>
              </div>
            )}
          </section>
        </div>

        {error && <p className="confirmacion-modal__error">{error}</p>}

        <div className="confirmacion-modal__acciones">
          <button
            type="button"
            className="confirmacion-modal__btn confirmacion-modal__btn--secundario"
            onClick={onVolver}
            disabled={guardando}
          >
            Volver al formulario
          </button>

          <button
            type="button"
            className="confirmacion-modal__btn confirmacion-modal__btn--principal"
            onClick={confirmarReserva}
            disabled={verificando || !disponible || guardando}
          >
            {guardando ? "Guardando..." : "Confirmar reserva"}
          </button>
        </div>
      </article>
    </section>
  );
}

export default ConfirmacionReservaModal;
