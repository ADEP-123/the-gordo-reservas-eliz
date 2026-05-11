import MesaCard from "./MesaCard";
import "../styles/zonaModal.css";

function ZonaModal({
  zona,
  mesaSeleccionada,
  onSeleccionarMesa,
  onCerrar,
  onReservar,
}) {
  if (!zona) return null;

  const mesas = zona.mesas || [];
  const mesasDisponibles = zona.resumen?.mesasDisponibles || 0;
  const asientosDisponibles = zona.resumen?.asientosDisponibles || 0;

  return (
    <section className="zona-modal-backdrop">
      <article
        className="zona-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zona-modal-title"
      >
        <button
          type="button"
          className="zona-modal__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar detalle de zona"
        >
          ×
        </button>

        <header className="zona-modal__header">
          <div>
            <span className="zona-modal__label">Zona seleccionada</span>
            <h2 id="zona-modal-title">{zona.nombre}</h2>
            <p>
              Elige una mesa disponible dentro de esta zona para continuar con
              la reserva.
            </p>
          </div>

          <div className="zona-modal__stats">
            <div>
              <strong>{mesasDisponibles}</strong>
              <span>Mesas disponibles</span>
            </div>

            <div>
              <strong>{asientosDisponibles}</strong>
              <span>Asientos disponibles</span>
            </div>
          </div>
        </header>

        <div className="zona-modal__body">
          {mesas.length > 0 ? (
            <div className="zona-modal__mesas">
              {mesas.map(mesa => (
                <MesaCard
                  key={mesa.id}
                  mesa={mesa}
                  seleccionada={mesaSeleccionada?.id === mesa.id}
                  onSeleccionar={onSeleccionarMesa}
                />
              ))}
            </div>
          ) : (
            <div className="zona-modal__empty">
              <strong>No hay mesas registradas en esta zona</strong>
              <p>
                Revisa la ubicación asignada a las mesas en la base de datos.
              </p>
            </div>
          )}

          <aside className="zona-modal__seleccion">
            {mesaSeleccionada ? (
              <>
                <span>Mesa seleccionada</span>
                <h3>Mesa {mesaSeleccionada.numero}</h3>

                <div className="zona-modal__detalle">
                  <p>
                    <strong>Capacidad:</strong> {mesaSeleccionada.capacidad}{" "}
                    personas
                  </p>
                  <p>
                    <strong>Estado:</strong> {mesaSeleccionada.estado}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {mesaSeleccionada.ubicacion}
                  </p>
                </div>

                <button
                  type="button"
                  className="zona-modal__reservar"
                  onClick={onReservar}
                >
                  Reservar esta mesa
                </button>
              </>
            ) : (
              <>
                <span>Sin mesa seleccionada</span>
                <h3>Elige una mesa</h3>
                <p>
                  Selecciona una mesa disponible para ver su resumen antes de
                  continuar.
                </p>
              </>
            )}
          </aside>
        </div>
      </article>
    </section>
  );
}

export default ZonaModal;
