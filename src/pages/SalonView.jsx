import { useState, useEffect } from "react";
import { getMesas } from "../services/mesasService";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import MesaCard from "../components/MesaCard";
import PanelSeleccion from "../components/PanelSeleccion";
import "../styles/salonView.css";

function SalonView() {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarMesas();
  }, []);

  const cargarMesas = async () => {
    setCargando(true);
    const data = await getMesas();
    setMesas(data);
    setCargando(false);
  };

  const agruparPorZona = () => {
    return mesas.reduce((acc, mesa) => {
      if (!acc[mesa.ubicacion]) acc[mesa.ubicacion] = [];
      acc[mesa.ubicacion].push(mesa);
      return acc;
    }, {});
  };

  return (
    <div className="salon-view">
      <Navbar />

      {/* HERO */}
      <div className="salon-view__hero">
        <h2>
          Reserva tu <span>Mesa</span>
        </h2>
        <p>Selecciona una mesa disponible y reserva en menos de 3 minutos</p>
      </div>

      <Leyenda />

      {cargando ? (
        <div className="salon-view__loading">⏳ Cargando salón...</div>
      ) : (
        <div className="salon-view__salon">
          {Object.entries(agruparPorZona()).map(([zona, mesasZona]) => (
            <div key={zona} className="salon-view__zona">
              <h2 className="salon-view__zona-title">📍 {zona}</h2>
              <div className="salon-view__mesas-grid">
                {mesasZona.map(mesa => (
                  <MesaCard
                    key={mesa.id}
                    mesa={mesa}
                    seleccionada={mesaSeleccionada?.id === mesa.id}
                    onClick={setMesaSeleccionada}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {mesaSeleccionada && (
        <PanelSeleccion
          mesa={mesaSeleccionada}
          onReservar={() => alert("Aquí irá el formulario (Fase 3)")}
          onCancelar={() => setMesaSeleccionada(null)}
        />
      )}

      <footer className="salon-view__footer">
        📞 (57) 300 123 4567 &nbsp;|&nbsp; ✉️ contacto@thegordo.com
        &nbsp;|&nbsp; 📍 Calle 10 #5-20, Colombia
      </footer>
    </div>
  );
}

export default SalonView;
