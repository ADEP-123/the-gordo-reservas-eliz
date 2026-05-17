import { useEffect, useState } from "react";
import { getOpcionesHorarioPorFecha } from "../services/horariosService";

function useOpcionesHorario(fecha, configuracion) {
  const [horario, setHorario] = useState(null);
  const [opcionesHorario, setOpcionesHorario] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarOpciones = async () => {
      if (!fecha || !configuracion) {
        setHorario(null);
        setOpcionesHorario([]);
        return;
      }

      try {
        setCargandoHorarios(true);
        setErrorHorarios(null);

        const resultado = await getOpcionesHorarioPorFecha(
          fecha,
          configuracion,
        );

        if (!activo) return;

        setHorario(resultado.horario);
        setOpcionesHorario(resultado.opciones);
      } catch (error) {
        console.error("Error al cargar opciones de horario:", error);

        if (!activo) return;

        setHorario(null);
        setOpcionesHorario([]);
        setErrorHorarios("No fue posible cargar los horarios disponibles.");
      } finally {
        if (activo) {
          setCargandoHorarios(false);
        }
      }
    };

    cargarOpciones();

    return () => {
      activo = false;
    };
  }, [
    fecha,
    configuracion?.duracion_reserva_minutos,
    configuracion?.intervalo_horarios_minutos,
  ]);

  return {
    horario,
    opcionesHorario,
    cargandoHorarios,
    errorHorarios,
  };
}

export default useOpcionesHorario;
