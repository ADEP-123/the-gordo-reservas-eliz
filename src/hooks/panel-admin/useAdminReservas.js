import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cambiarEstadoReserva,
  getReservas,
} from "../../services/reservasService";

function useAdminReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargandoReservas, setCargandoReservas] = useState(true);
  const [guardandoReserva, setGuardandoReserva] = useState(false);
  const [errorReservas, setErrorReservas] = useState(null);

  const [filtros, setFiltros] = useState({
    fecha: "",
    estado: "todas",
  });

  const cargarReservas = useCallback(async () => {
    try {
      setCargandoReservas(true);
      setErrorReservas(null);

      const data = await getReservas();

      setReservas(data || []);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setErrorReservas("No fue posible cargar las reservas.");
      setReservas([]);
    } finally {
      setCargandoReservas(false);
    }
  }, []);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  const reservasFiltradas = useMemo(() => {
    return reservas.filter(reserva => {
      const coincideFecha = filtros.fecha
        ? reserva.fecha === filtros.fecha
        : true;

      const coincideEstado =
        filtros.estado === "todas" ? true : reserva.estado === filtros.estado;

      return coincideFecha && coincideEstado;
    });
  }, [reservas, filtros]);

  const actualizarFiltro = (name, value) => {
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha: "",
      estado: "todas",
    });
  };

  const actualizarEstadoReserva = async (reservaId, estado) => {
    try {
      setGuardandoReserva(true);
      setErrorReservas(null);

      const resultado = await cambiarEstadoReserva(reservaId, estado);

      if (!resultado) {
        setErrorReservas("No fue posible actualizar la reserva.");
        return false;
      }

      await cargarReservas();
      return true;
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      setErrorReservas("Ocurrió un error al actualizar la reserva.");
      return false;
    } finally {
      setGuardandoReserva(false);
    }
  };

  return {
    reservas,
    reservasFiltradas,
    filtros,
    cargandoReservas,
    guardandoReserva,
    errorReservas,
    cargarReservas,
    actualizarFiltro,
    limpiarFiltros,
    actualizarEstadoReserva,
  };
}

export default useAdminReservas;
