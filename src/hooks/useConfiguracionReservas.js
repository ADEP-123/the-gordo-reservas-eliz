import { useCallback, useEffect, useState } from "react";
import { getConfiguracionReservas } from "../services/configuracionReservasService";
import { RESERVA_CONFIG_DEFAULT } from "../data/reservaConfig";

function useConfiguracionReservas() {
  const [configuracion, setConfiguracion] = useState(RESERVA_CONFIG_DEFAULT);
  const [cargandoConfiguracion, setCargandoConfiguracion] = useState(true);
  const [errorConfiguracion, setErrorConfiguracion] = useState(null);

  const cargarConfiguracion = useCallback(async () => {
    try {
      setCargandoConfiguracion(true);
      setErrorConfiguracion(null);

      const data = await getConfiguracionReservas();

      setConfiguracion({
        ...RESERVA_CONFIG_DEFAULT,
        ...data,
      });
    } catch (error) {
      console.error("Error al cargar configuración de reservas:", error);
      setErrorConfiguracion(
        "No fue posible cargar la configuración de reservas.",
      );
      setConfiguracion(RESERVA_CONFIG_DEFAULT);
    } finally {
      setCargandoConfiguracion(false);
    }
  }, []);

  useEffect(() => {
    cargarConfiguracion();
  }, [cargarConfiguracion]);

  return {
    configuracion,
    cargandoConfiguracion,
    errorConfiguracion,
    recargarConfiguracion: cargarConfiguracion,
  };
}

export default useConfiguracionReservas;
