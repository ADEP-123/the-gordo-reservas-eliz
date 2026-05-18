import { useEffect, useMemo, useState } from "react";
import useAdminReservas from "../../hooks/panel-admin/useAdminReservas";
import "../../styles/panel-admin/adminReservasPanel.css";

const ESTADOS_RESERVA = {
  activa: "Activa",
  cancelada: "Cancelada",
  completada: "Completada",
};

function formatearHora(hora = "") {
  return hora.toString().slice(0, 5);
}

function obtenerCliente(reserva) {
  return reserva.clientes?.cliente_nombre || "Cliente no registrado";
}

function obtenerTelefono(reserva) {
  return reserva.clientes?.cliente_tel || "Sin teléfono";
}

function obtenerCorreo(reserva) {
  return reserva.clientes?.cliente_email || "Sin correo";
}

function obtenerMesa(reserva) {
  if (!reserva.mesas) return "Mesa no registrada";

  return `Mesa ${reserva.mesas.numero}`;
}

function AdminReservasPanel() {
  const {
    reservasFiltradas,
    filtros,
    cargandoReservas,
    guardandoReserva,
    errorReservas,
    actualizarFiltro,
    limpiarFiltros,
    actualizarEstadoReserva,
  } = useAdminReservas();

  const [reservaActivaId, setReservaActivaId] = useState("");

  useEffect(() => {
    if (reservasFiltradas.length === 0) {
      setReservaActivaId("");
      return;
    }

    const existeReservaActiva = reservasFiltradas.some(
      reserva => reserva.id === reservaActivaId,
    );

    if (!existeReservaActiva) {
      setReservaActivaId(reservasFiltradas[0].id);
    }
  }, [reservasFiltradas, reservaActivaId]);

  const reservaActiva = useMemo(() => {
    return (
      reservasFiltradas.find(reserva => reserva.id === reservaActivaId) || null
    );
  }, [reservasFiltradas, reservaActivaId]);

  const handleFiltroChange = event => {
    const { name, value } = event.target;
    actualizarFiltro(name, value);
  };

  const renderEstado = estado => (
    <span
      className={`admin-reservas__estado admin-reservas__estado--${estado}`}
    >
      {ESTADOS_RESERVA[estado] || estado}
    </span>
  );

  const renderAccionesReserva = reserva => {
    if (reserva.estado !== "activa") {
      return <span className="admin-reservas__sin-acciones">Sin acciones</span>;
    }

    return (
      <div className="admin-reservas__acciones">
        <button
          type="button"
          onClick={() => actualizarEstadoReserva(reserva.id, "completada")}
          disabled={guardandoReserva}
        >
          Completar
        </button>

        <button
          type="button"
          onClick={() => actualizarEstadoReserva(reserva.id, "cancelada")}
          disabled={guardandoReserva}
        >
          Cancelar
        </button>
      </div>
    );
  };

  return (
    <section className="admin-reservas">
      {errorReservas && (
        <div className="admin-reservas__error">{errorReservas}</div>
      )}

      <section className="admin-reservas__filtros">
        <div className="admin-reservas__grupo">
          <label htmlFor="fecha">Fecha</label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            value={filtros.fecha}
            onChange={handleFiltroChange}
          />
        </div>

        <div className="admin-reservas__grupo">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
          >
            <option value="todas">Todas</option>
            <option value="activa">Activas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        <button
          type="button"
          className="admin-reservas__btn admin-reservas__btn--secundario"
          onClick={limpiarFiltros}
        >
          Limpiar filtros
        </button>
      </section>

      <section className="admin-reservas__tabla-card">
        <div className="admin-reservas__tabla-header">
          <div>
            <span className="admin-reservas__label">Listado</span>
            <h3>Reservas registradas</h3>
          </div>
        </div>

        {cargandoReservas ? (
          <div className="admin-reservas__empty">Cargando reservas...</div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="admin-reservas__empty">
            No hay reservas con los filtros seleccionados.
          </div>
        ) : (
          <>
            <div className="admin-reservas__selector-movil">
              <label htmlFor="reserva-activa">Selecciona una reserva</label>
              <select
                id="reserva-activa"
                value={reservaActivaId}
                onChange={event => setReservaActivaId(event.target.value)}
              >
                {reservasFiltradas.map(reserva => (
                  <option key={reserva.id} value={reserva.id}>
                    {reserva.fecha} · {formatearHora(reserva.hora)} ·{" "}
                    {obtenerMesa(reserva)} · {obtenerCliente(reserva)}
                  </option>
                ))}
              </select>
            </div>

            {reservaActiva && (
              <article className="admin-reservas__detalle-movil">
                <div>
                  <span className="admin-reservas__label">
                    Reserva seleccionada
                  </span>
                  <h4>
                    {reservaActiva.fecha} · {formatearHora(reservaActiva.hora)}
                  </h4>
                </div>

                <div className="admin-reservas__detalle-grid">
                  <p>
                    <span>Mesa</span>
                    <strong>{obtenerMesa(reservaActiva)}</strong>
                  </p>

                  <p>
                    <span>Cliente</span>
                    <strong>{obtenerCliente(reservaActiva)}</strong>
                  </p>

                  <p>
                    <span>Teléfono</span>
                    <strong>{obtenerTelefono(reservaActiva)}</strong>
                  </p>

                  <p>
                    <span>Correo</span>
                    <strong>{obtenerCorreo(reservaActiva)}</strong>
                  </p>

                  <p>
                    <span>Personas</span>
                    <strong>{reservaActiva.num_personas}</strong>
                  </p>

                  <p>
                    <span>Horario</span>
                    <strong>
                      {formatearHora(reservaActiva.hora)} -{" "}
                      {formatearHora(reservaActiva.hora_fin)}
                    </strong>
                  </p>

                  <p>
                    <span>Estado</span>
                    <strong>{ESTADOS_RESERVA[reservaActiva.estado]}</strong>
                  </p>

                  {reservaActiva.observaciones && (
                    <p>
                      <span>Observaciones</span>
                      <strong>{reservaActiva.observaciones}</strong>
                    </p>
                  )}
                </div>

                {renderAccionesReserva(reservaActiva)}
              </article>
            )}

            <div className="admin-reservas__tabla">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Mesa</th>
                    <th>Cliente</th>
                    <th>Personas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {reservasFiltradas.map(reserva => (
                    <tr key={reserva.id}>
                      <td>{reserva.fecha}</td>

                      <td>
                        {formatearHora(reserva.hora)} -{" "}
                        {formatearHora(reserva.hora_fin)}
                      </td>

                      <td>{obtenerMesa(reserva)}</td>

                      <td>
                        <strong>{obtenerCliente(reserva)}</strong>
                        <small>{obtenerTelefono(reserva)}</small>
                      </td>

                      <td>{reserva.num_personas}</td>

                      <td>{renderEstado(reserva.estado)}</td>

                      <td>{renderAccionesReserva(reserva)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </section>
  );
}

export default AdminReservasPanel;
