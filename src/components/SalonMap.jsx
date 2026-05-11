import { ZONAS_SALON } from "../data/zonasSalon";
import { obtenerMesasPorZona, obtenerResumenZona } from "../utils/salonUtils";
import "../styles/salonMap.css";

function SalonMap({ mesas = [], zonaActivaId, onSeleccionarZona }) {
  const renderZona = zona => {
    const mesasZona = obtenerMesasPorZona(mesas, zona);
    const resumen = obtenerResumenZona(mesasZona);
    const estaActiva = zonaActivaId === zona.id;

    return (
      <button
        key={zona.id}
        type="button"
        className={`salon-map__zona ${zona.clase} ${
          estaActiva ? "salon-map__zona--activa" : ""
        }`}
        onClick={() =>
          onSeleccionarZona({
            ...zona,
            mesas: mesasZona,
            resumen,
          })
        }
      >
        <span className="salon-map__zona-tag">{zona.descripcion}</span>

        <strong>{zona.nombre}</strong>

        <div className="salon-map__zona-resumen">
          <span>
            <b>{resumen.mesasDisponibles}</b>
            mesas disponibles
          </span>

          <span>
            <b>{resumen.asientosDisponibles}</b>
            asientos disponibles
          </span>
        </div>
      </button>
    );
  };

  const zonasInteriores = ZONAS_SALON.filter(zona => zona.id !== "terraza");
  const zonaTerraza = ZONAS_SALON.find(zona => zona.id === "terraza");

  return (
    <section className="salon-map" aria-label="Mapa del salón del restaurante">
      <div className="salon-map__header">
        <div>
          <span className="salon-map__label">Mapa del restaurante</span>
          <h2>Explora las zonas del salón</h2>
        </div>

        <p>Selecciona una zona para ver sus mesas disponibles.</p>
      </div>

      <div className="salon-map__plano">
        <div className="salon-map__ventanas" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="salon-map__interior">
          {zonasInteriores.map(renderZona)}

          <div className="salon-map__cocina" aria-hidden="true">
            <span>Cocina</span>
          </div>

          <div className="salon-map__wc" aria-hidden="true">
            <span>WC</span>
          </div>

          <div className="salon-map__entrada" aria-hidden="true">
            <span>Entrada</span>
            <strong>↳</strong>
          </div>

          <div className="salon-map__vacio" aria-hidden="true"></div>
        </div>

        <div className="salon-map__exterior">
          <div className="salon-map__conexion-terraza" aria-hidden="true">
            Salida a terraza
          </div>

          {zonaTerraza && renderZona(zonaTerraza)}
        </div>
      </div>
    </section>
  );
}

export default SalonMap;
