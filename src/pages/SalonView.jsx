import { useState } from "react";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import SalonMap from "../components/SalonMap";
import ZonaModal from "../components/ZonaModal";
import ReservaModal from "../components/ReservaModal";
import ConfirmacionReservaModal from "../components/ConfirmacionReservaModal";
import useMesas from "../hooks/useMesas";
import "../styles/salonView.css";

function SalonView() {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [formularioReservaAbierto, setFormularioReservaAbierto] =
    useState(false);
  const [confirmacionReservaAbierta, setConfirmacionReservaAbierta] =
    useState(false);
  const [reservaBorrador, setReservaBorrador] = useState(null);

  const { mesas, cargando, error, recargarMesas } = useMesas();

  const seleccionarZona = zona => {
    setZonaSeleccionada(zona);
    setMesaSeleccionada(null);
    setFormularioReservaAbierto(false);
    setConfirmacionReservaAbierta(false);
    setReservaBorrador(null);
  };

  const cerrarFlujoReserva = () => {
    setZonaSeleccionada(null);
    setMesaSeleccionada(null);
    setFormularioReservaAbierto(false);
    setConfirmacionReservaAbierta(false);
    setReservaBorrador(null);
  };

  const cerrarFormularioReserva = () => {
    setFormularioReservaAbierto(false);
  };

  const abrirFormularioReserva = () => {
    if (!mesaSeleccionada) return;
    setFormularioReservaAbierto(true);
  };

  const continuarReserva = reserva => {
    setReservaBorrador(reserva);
    setFormularioReservaAbierto(false);
    setConfirmacionReservaAbierta(true);
  };

  const volverAlFormulario = () => {
    setConfirmacionReservaAbierta(false);
    setFormularioReservaAbierto(true);
  };

  const finalizarReservaCreada = () => {
    cerrarFlujoReserva();
    recargarMesas();
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
          onCerrar={cerrarFlujoReserva}
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

      {confirmacionReservaAbierta && reservaBorrador && (
        <ConfirmacionReservaModal
          reserva={reservaBorrador}
          onCerrar={() => setConfirmacionReservaAbierta(false)}
          onVolver={volverAlFormulario}
          onReservaCreada={finalizarReservaCreada}
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
