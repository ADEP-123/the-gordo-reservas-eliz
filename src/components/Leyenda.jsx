import "../styles/leyenda.css";

function Leyenda() {
  return (
    <div className="leyenda-container">
      <div className="leyenda">
        <span className="leyenda-item">🟢 Disponible</span>
        <span className="leyenda-item">🔴 Ocupada</span>
        <span className="leyenda-item">⚫ Bloqueada</span>
      </div>
      <p className="leyenda-hint">
        Haz clic en una mesa disponible para reservar
      </p>
    </div>
  );
}

export default Leyenda;
