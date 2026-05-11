import "../styles/mesaCard.css";

const getColorMesa = estado => {
  switch (estado) {
    case "disponible":
      return "#48bb78";
    case "ocupada":
      return "#fc8181";
    case "bloqueada":
      return "#a0aec0";
    default:
      return "#a0aec0";
  }
};

const getEmojiMesa = estado => {
  switch (estado) {
    case "disponible":
      return "🟢";
    case "ocupada":
      return "🔴";
    case "bloqueada":
      return "⚫";
    default:
      return "⚫";
  }
};

function MesaCard({ mesa, seleccionada, onClick }) {
  const disponible = mesa.estado === "disponible";

  return (
    <div
      className={`mesa-card ${seleccionada ? "mesa-card--seleccionada" : ""} ${!disponible ? "mesa-card--inactiva" : ""}`}
      style={{ background: getColorMesa(mesa.estado) }}
      onClick={() => disponible && onClick(mesa)}
    >
      <span className="mesa-card__numero">Mesa {mesa.numero}</span>
      <span className="mesa-card__emoji">{getEmojiMesa(mesa.estado)}</span>
      <span className="mesa-card__capacidad">👥 {mesa.capacidad} personas</span>
    </div>
  );
}

export default MesaCard;
