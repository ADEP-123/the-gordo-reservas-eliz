import { useCallback, useState } from "react";
import {
  buscarSiguienteHorarioDisponible,
  getMesasConDisponibilidad,
} from "../services/reservasService";

function useBusquedaDisponibilidad() {
  const [mesasFiltradas, setMesasFiltradas] = useState(null);
  const [criteriosBusqueda, setCriteriosBusqueda] = useState(null);
  const [buscandoDisponibilidad, setBuscandoDisponibilidad] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);
  const [sinDisponibilidad, setSinDisponibilidad] = useState(false);
  const [sugerenciaDisponibilidad, setSugerenciaDisponibilidad] =
    useState(null);

  const buscarDisponibilidad = useCallback(async criterios => {
    try {
      setBuscandoDisponibilidad(true);
      setErrorBusqueda(null);
      setSinDisponibilidad(false);
      setSugerenciaDisponibilidad(null);

      const data = await getMesasConDisponibilidad({
        fecha: criterios.fecha,
        hora: criterios.hora,
        num_personas: criterios.personas,
      });

      setMesasFiltradas(data);
      setCriteriosBusqueda(criterios);

      const hayMesasDisponibles = data.some(
        mesa => mesa.disponible_para_criterio,
      );

      if (!hayMesasDisponibles) {
        const sugerencia = await buscarSiguienteHorarioDisponible({
          fecha: criterios.fecha,
          hora: criterios.hora,
          num_personas: criterios.personas,
        });

        setSugerenciaDisponibilidad(sugerencia);
        setSinDisponibilidad(true);
      }
    } catch (error) {
      console.error("Error al buscar disponibilidad:", error);
      setErrorBusqueda("No fue posible consultar la disponibilidad.");
      setMesasFiltradas(null);
      setCriteriosBusqueda(null);
      setSinDisponibilidad(false);
      setSugerenciaDisponibilidad(null);
    } finally {
      setBuscandoDisponibilidad(false);
    }
  }, []);

  const limpiarBusqueda = useCallback(() => {
    setMesasFiltradas(null);
    setCriteriosBusqueda(null);
    setErrorBusqueda(null);
    setSinDisponibilidad(false);
    setSugerenciaDisponibilidad(null);
  }, []);

  const cerrarSugerenciaDisponibilidad = useCallback(() => {
    setSinDisponibilidad(false);
    setSugerenciaDisponibilidad(null);
  }, []);

  return {
    mesasFiltradas,
    criteriosBusqueda,
    buscandoDisponibilidad,
    errorBusqueda,
    sinDisponibilidad,
    sugerenciaDisponibilidad,
    buscarDisponibilidad,
    limpiarBusqueda,
    cerrarSugerenciaDisponibilidad,
  };
}

export default useBusquedaDisponibilidad;
