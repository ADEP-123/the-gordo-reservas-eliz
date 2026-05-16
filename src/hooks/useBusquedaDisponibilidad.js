import { useCallback, useState } from "react";
import { getMesasConDisponibilidad } from "../services/reservasService";

function useBusquedaDisponibilidad() {
  const [mesasFiltradas, setMesasFiltradas] = useState(null);
  const [criteriosBusqueda, setCriteriosBusqueda] = useState(null);
  const [buscandoDisponibilidad, setBuscandoDisponibilidad] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  const buscarDisponibilidad = useCallback(async criterios => {
    try {
      setBuscandoDisponibilidad(true);
      setErrorBusqueda(null);

      const data = await getMesasConDisponibilidad({
        fecha: criterios.fecha,
        hora: criterios.hora,
        num_personas: criterios.personas,
      });

      setMesasFiltradas(data);
      setCriteriosBusqueda(criterios);
    } catch (error) {
      console.error("Error al buscar disponibilidad:", error);
      setErrorBusqueda("No fue posible consultar la disponibilidad.");
      setMesasFiltradas(null);
      setCriteriosBusqueda(null);
    } finally {
      setBuscandoDisponibilidad(false);
    }
  }, []);

  const limpiarBusqueda = useCallback(() => {
    setMesasFiltradas(null);
    setCriteriosBusqueda(null);
    setErrorBusqueda(null);
  }, []);

  return {
    mesasFiltradas,
    criteriosBusqueda,
    buscandoDisponibilidad,
    errorBusqueda,
    buscarDisponibilidad,
    limpiarBusqueda,
  };
}

export default useBusquedaDisponibilidad;
