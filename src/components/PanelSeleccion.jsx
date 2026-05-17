import "../styles/panelSeleccion.css";

function PanelSeleccion({ mesa, onReservar, onCancelar }) {
  return (
    <div className="panel">
      <h3 className="panel__title">Mesa {mesa.numero} seleccionada ✅</h3>
      <p className="panel__info">📍 {mesa.ubicacion}</p>
      <p className="panel__info">👥 Capacidad: {mesa.capacidad} personas</p>
      <button className="panel__btn-reservar" onClick={onReservar}>
        Reservar esta mesa
      </button>
      <button className="panel__btn-cancelar" onClick={onCancelar}>
        Cancelar
      </button>
    </div>
  );
}

export default PanelSeleccion;
