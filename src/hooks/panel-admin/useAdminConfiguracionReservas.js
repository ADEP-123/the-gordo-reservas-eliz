import { useCallback, useEffect, useState } from "react";
import {
  getConfiguracionReservas,
  updateConfiguracionReservas,
} from "../../services/configuracionReservasService";
import { CONFIGURACION_RESERVAS_FORM_DEFAULT } from "../../data/panel-admin/configuracionReservasAdminConfig";

function useAdminConfiguracionReservas() {
  const [configuracion, setConfiguracion] = useState(
    CONFIGURACION_RESERVAS_FORM_DEFAULT,
  );

  const [cargandoConfiguracion, setCargandoConfiguracion] = useState(true);
  const [guardandoConfiguracion, setGuardandoConfiguracion] = useState(false);
  const [errorConfiguracion, setErrorConfiguracion] = useState(null);

  const cargarConfiguracion = useCallback(async () => {
    try {
      setCargandoConfiguracion(true);
      setErrorConfiguracion(null);

      const data = await getConfiguracionReservas();

      setConfiguracion({
        ...CONFIGURACION_RESERVAS_FORM_DEFAULT,
        ...data,
      });
    } catch (error) {
      console.error("Error al cargar configuración:", error);
      setErrorConfiguracion("No fue posible cargar la configuración.");
    } finally {
      setCargandoConfiguracion(false);
    }
  }, []);

  useEffect(() => {
    cargarConfiguracion();
  }, [cargarConfiguracion]);

  const guardarConfiguracion = async cambios => {
    try {
      setGuardandoConfiguracion(true);
      setErrorConfiguracion(null);

      const payload = {
        duracion_reserva_minutos: Number(cambios.duracion_reserva_minutos),
        intervalo_horarios_minutos: Number(cambios.intervalo_horarios_minutos),
        ocupacion_minima_porcentaje: Number(
          cambios.ocupacion_minima_porcentaje,
        ),
        activo: true,
      };

      const resultado = await updateConfiguracionReservas(payload);

      if (!resultado) {
        setErrorConfiguracion("No fue posible guardar la configuración.");
        return false;
      }

      setConfiguracion({
        ...CONFIGURACION_RESERVAS_FORM_DEFAULT,
        ...resultado,
      });

      return true;
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      setErrorConfiguracion("Ocurrió un error al guardar la configuración.");
      return false;
    } finally {
      setGuardandoConfiguracion(false);
    }
  };

  return {
    configuracion,
    cargandoConfiguracion,
    guardandoConfiguracion,
    errorConfiguracion,
    cargarConfiguracion,
    guardarConfiguracion,
  };
}

export default useAdminConfiguracionReservas;
