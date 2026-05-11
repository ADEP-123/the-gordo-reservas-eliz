import { useState, useEffect } from "react";
import { getMesas } from "../services/mesasService";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import SalonMap from "../components/SalonMap";
import "../styles/salonView.css";

function SalonView() {
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    setCargando(true);

    const data = await getMesas();

    setMesas(data);
    setCargando(false);
  };

  return (
    <div className="salon-view">
      <Navbar />

      <header className="salon-view__hero">
        <h2>
          Reserva tu <span>Mesa</span>
        </h2>
        <p>Explora el salón, elige una zona y selecciona tu mesa ideal</p>
      </header>

      <Leyenda />

      {cargando ? (
        <div className="salon-view__loading">⏳ Cargando salón...</div>
      ) : (
        <>
          <SalonMap
            mesas={mesas}
            zonaActivaId={zonaSeleccionada?.id}
            onSeleccionarZona={setZonaSeleccionada}
          />

          {zonaSeleccionada && (
            <div className="zona-preview">
              <div>
                <span>Zona seleccionada</span>
                <strong>{zonaSeleccionada.nombre}</strong>

                <p>
                  {zonaSeleccionada.resumen.mesasDisponibles} mesas disponibles
                  · {zonaSeleccionada.resumen.asientosDisponibles} asientos
                  disponibles
                </p>
              </div>

              <button type="button" onClick={() => setZonaSeleccionada(null)}>
                Cerrar
              </button>
            </div>
          )}
        </>
      )}

      <footer className="salon-view__footer">
        📞 (57) 300 123 4567 &nbsp;|&nbsp; ✉️ contacto@thegordo.com
        &nbsp;|&nbsp; 📍 Calle 10 #5-20, Colombia
      </footer>
    </div>
  );
}

export default SalonView;
