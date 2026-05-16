import { useState } from "react";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import SalonMap from "../components/SalonMap";
import ZonaModal from "../components/ZonaModal";
import ReservaModal from "../components/ReservaModal";
import useMesas from "../hooks/useMesas";
import "../styles/salonView.css";

function SalonView() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [formularioReservaAbierto, setFormularioReservaAbierto] =
    useState(false);
  const [reservaBorrador, setReservaBorrador] = useState(null);

  const { mesas, cargando, error } = useMesas();

  const seleccionarZona = zona => {
    setZonaSeleccionada(zona);
    setMesaSeleccionada(null);
    setFormularioReservaAbierto(false);
    setReservaBorrador(null);
  };

  const cerrarZonaModal = () => {
    setZonaSeleccionada(null);
    setMesaSeleccionada(null);
    setFormularioReservaAbierto(false);
    setReservaBorrador(null);
  };

  const abrirFormularioReserva = () => {
    if (!mesaSeleccionada) return;
    setFormularioReservaAbierto(true);
  };

  const cerrarFormularioReserva = () => {
    setFormularioReservaAbierto(false);
  };

  const continuarReserva = reserva => {
    setReservaBorrador(reserva);
    setFormularioReservaAbierto(false);

    console.log("Reserva lista para confirmar:", reserva);

    alert(
      `Datos registrados para la Mesa ${reserva.mesa.numero}. El siguiente paso será confirmar disponibilidad.`,
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
          onReservar={abrirFormularioReserva}
        />
      )}

      {formularioReservaAbierto && mesaSeleccionada && (
        <ReservaModal
          mesa={mesaSeleccionada}
          zona={zonaSeleccionada}
          onCerrar={cerrarFormularioReserva}
          onVolver={cerrarFormularioReserva}
          onContinuar={continuarReserva}
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
