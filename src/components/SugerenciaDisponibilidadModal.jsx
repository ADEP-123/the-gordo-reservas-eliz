import "../styles/sugerenciaDisponibilidadModal.css";

function obtenerTextoPersonas(personas) {
  return Number(personas) === 1 ? "1 persona" : `${personas} personas`;
}

function SugerenciaDisponibilidadModal({
  criterios,
  sugerencia,
  onAceptar,
  onCerrar,
}) {
  if (!criterios) return null;

  return (
    <section className="sugerencia-modal-backdrop">
      <article
        className="sugerencia-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sugerencia-modal-title"
      >
        <button
          type="button"
          className="sugerencia-modal__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar sugerencia de disponibilidad"
        >
          ×
        </button>

        <span className="sugerencia-modal__label">Sin disponibilidad</span>

        <h2 id="sugerencia-modal-title">Lo sentimos</h2>

        <p>
          No encontramos mesas disponibles para el{" "}
          <strong>{criterios.fecha}</strong> a las{" "}
          <strong>{criterios.hora}</strong>, para{" "}
          <strong>{obtenerTextoPersonas(criterios.personas)}</strong>.
        </p>

        {sugerencia ? (
          <>
            <div className="sugerencia-modal__card">
              <span>Hora más cercana disponible</span>

              <strong>
                {sugerencia.hora} - {sugerencia.hora_fin}
              </strong>

              <p>
                Hay {sugerencia.mesas_disponibles} mesas disponibles y{" "}
                {sugerencia.asientos_disponibles} asientos posibles para esa
                hora.
              </p>
            </div>

            <div className="sugerencia-modal__acciones">
              <button
                type="button"
                className="sugerencia-modal__btn sugerencia-modal__btn--secundario"
                onClick={onCerrar}
              >
                Buscar otra hora
              </button>

              <button
                type="button"
                className="sugerencia-modal__btn sugerencia-modal__btn--principal"
                onClick={() => onAceptar(sugerencia)}
              >
                Usar esta hora
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sugerencia-modal__card sugerencia-modal__card--empty">
              <span>Sin alternativa cercana</span>

              <p>
                No encontramos otra hora disponible para esta fecha dentro del
                horario del restaurante. Prueba con otra fecha, hora o número de
                personas.
              </p>
            </div>

            <div className="sugerencia-modal__acciones">
              <button
                type="button"
                className="sugerencia-modal__btn sugerencia-modal__btn--principal"
                onClick={onCerrar}
              >
                Entendido
              </button>
            </div>
          </>
        )}
      </article>
    </section>
  );
}

export default SugerenciaDisponibilidadModal;
