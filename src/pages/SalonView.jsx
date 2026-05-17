import { useState } from "react";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import SalonMap from "../components/SalonMap";
import ZonaModal from "../components/ZonaModal";
import ReservaModal from "../components/ReservaModal";
import ConfirmacionReservaModal from "../components/ConfirmacionReservaModal";
import BusquedaDisponibilidad from "../components/BusquedaDisponibilidad";
import SugerenciaDisponibilidadModal from "../components/SugerenciaDisponibilidadModal";
import useMesas from "../hooks/useMesas";
import useConfiguracionReservas from "../hooks/useConfiguracionReservas";
import useBusquedaDisponibilidad from "../hooks/useBusquedaDisponibilidad";
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

  const { configuracion, cargandoConfiguracion, errorConfiguracion } =
    useConfiguracionReservas();

  const {
    mesasFiltradas,
    criteriosBusqueda,
    buscandoDisponibilidad,
    errorBusqueda,
    sinDisponibilidad,
    sugerenciaDisponibilidad,
    buscarDisponibilidad,
    limpiarBusqueda,
    cerrarSugerenciaDisponibilidad,
  } = useBusquedaDisponibilidad();

  const hayBusquedaActiva = Boolean(criteriosBusqueda);
  const mesasParaMapa = mesasFiltradas || mesas;

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
    limpiarBusqueda();
    recargarMesas();
  };

  const limpiarBusquedaCompleta = () => {
    limpiarBusqueda();
    cerrarFlujoReserva();
  };

  const obtenerReservaInicial = () => {
    if (reservaBorrador) return reservaBorrador;

    if (!criteriosBusqueda) return null;

    return {
      fecha: criteriosBusqueda.fecha,
      hora: criteriosBusqueda.hora,
      num_personas: criteriosBusqueda.personas,
    };
  };

  const aceptarSugerenciaDisponibilidad = sugerencia => {
    if (!criteriosBusqueda || !sugerencia) return;

    cerrarFlujoReserva();
    cerrarSugerenciaDisponibilidad();

    buscarDisponibilidad({
      fecha: sugerencia.fecha,
      hora: sugerencia.hora,
      personas: criteriosBusqueda.personas,
    });
  };

  const estaCargando = cargando || cargandoConfiguracion;
  const mensajeError = error || errorConfiguracion;

  return (
    <div className="salon-view">
      <Navbar />

      <header className="salon-view__hero">
        <h2>
          Reserva tu <span>Mesa</span>
        </h2>
        <p>Busca disponibilidad, elige una zona y confirma tu reserva</p>
      </header>

      {estaCargando && (
        <div className="salon-view__loading">⏳ Cargando salón...</div>
      )}

      {!estaCargando && mensajeError && (
        <div className="salon-view__error">
          <strong>Ocurrió un problema</strong>
          <p>{mensajeError}</p>
        </div>
      )}

      {!estaCargando && !mensajeError && (
        <>
          <BusquedaDisponibilidad
            configuracion={configuracion}
            buscando={buscandoDisponibilidad}
            criteriosActivos={criteriosBusqueda}
            error={errorBusqueda}
            onBuscar={buscarDisponibilidad}
            onLimpiar={limpiarBusquedaCompleta}
          />

          {hayBusquedaActiva && (
            <>
              <Leyenda />

              <SalonMap
                mesas={mesasParaMapa}
                zonaActivaId={zonaSeleccionada?.id}
                onSeleccionarZona={seleccionarZona}
              />
            </>
          )}
        </>
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
          configuracion={configuracion}
          reservaInicial={obtenerReservaInicial()}
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

      {sinDisponibilidad && criteriosBusqueda && (
        <SugerenciaDisponibilidadModal
          criterios={criteriosBusqueda}
          sugerencia={sugerenciaDisponibilidad}
          onAceptar={aceptarSugerenciaDisponibilidad}
          onCerrar={cerrarSugerenciaDisponibilidad}
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
