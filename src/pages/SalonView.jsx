import { useState } from "react";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import SalonMap from "../components/SalonMap";
import ZonaModal from "../components/ZonaModal";
import useMesas from "../hooks/useMesas";
import "../styles/salonView.css";

function SalonView() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const { mesas, cargando, error } = useMesas();

  const seleccionarZona = zona => {
    setZonaSeleccionada(zona);
    setMesaSeleccionada(null);
  };

  const cerrarZonaModal = () => {
    setZonaSeleccionada(null);
    setMesaSeleccionada(null);
  };

  const reservarMesaSeleccionada = () => {
    if (!mesaSeleccionada) return;

    console.log("Mesa lista para reservar:", mesaSeleccionada);
    alert(
      `Aquí irá el formulario para reservar la Mesa ${mesaSeleccionada.numero}`,
    );
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

      {cargando && (
        <div className="salon-view__loading">⏳ Cargando salón...</div>
      )}

      {!cargando && error && (
        <div className="salon-view__error">
          <strong>Ocurrió un problema</strong>
          <p>{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <SalonMap
          mesas={mesas}
          zonaActivaId={zonaSeleccionada?.id}
          onSeleccionarZona={seleccionarZona}
        />
      )}

      {zonaSeleccionada && (
        <ZonaModal
          zona={zonaSeleccionada}
          mesaSeleccionada={mesaSeleccionada}
          onSeleccionarMesa={setMesaSeleccionada}
          onCerrar={cerrarZonaModal}
          onReservar={reservarMesaSeleccionada}
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
