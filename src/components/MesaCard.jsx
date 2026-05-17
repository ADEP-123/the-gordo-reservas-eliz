import "../styles/mesaCard.css";
import MesaVisual from "./MesaVisual";
import {
  estaMesaDisponible,
  normalizarEstadoMesa,
  obtenerTextoEstadoMesa,
} from "../utils/mesaUtils";

function MesaCard({ mesa, seleccionada = false, onSeleccionar }) {
  const estado = normalizarEstadoMesa(mesa.estado);
  const estaDisponible = estaMesaDisponible(mesa);

  const handleClick = () => {
    if (!estaDisponible) return;
    onSeleccionar(mesa);
  };

  return (
    <button
      type="button"
      className={`mesa-card mesa-card--${estado} ${
        seleccionada ? "mesa-card--seleccionada" : ""
      }`}
      onClick={handleClick}
      disabled={!estaDisponible}
    >
      <div className="mesa-card__header">
        <h3>Mesa {mesa.numero}</h3>

        <span className="mesa-card__badge">
          <span className="mesa-card__estado-punto"></span>
          {obtenerTextoEstadoMesa(mesa.estado)}
        </span>
      </div>

      <div className="mesa-card__visual">
        <MesaVisual capacidad={mesa.capacidad} estado={estado} />
      </div>

      <div className="mesa-card__footer">
        <span className="mesa-card__capacidad">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3ZM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5C23 14.17 18.33 13 16 13Z"
              fill="currentColor"
            />
          </svg>
          {mesa.capacidad} personas
        </span>
      </div>

      {seleccionada && (
        <span className="mesa-card__seleccion-tag">Seleccionada</span>
      )}
    </button>
  );
}

export default MesaCard;
