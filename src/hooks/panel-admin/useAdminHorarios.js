import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createHorario,
  getHorariosAdmin,
  updateHorario,
} from "../../services/horariosService";
import { DIAS_SEMANA_ADMIN } from "../../data/panel-admin/horariosAdminConfig";

function ordenarHorarios(horarios = []) {
  return [...horarios].sort((a, b) => {
    const ordenA = DIAS_SEMANA_ADMIN.findIndex(dia => dia.id === a.dia_semana);
    const ordenB = DIAS_SEMANA_ADMIN.findIndex(dia => dia.id === b.dia_semana);

    return ordenA - ordenB;
  });
}

function actualizarHorarioEnLista(horarios, horarioActualizado) {
  const existeHorario = horarios.some(
    horario => horario.id === horarioActualizado.id,
  );

  if (!existeHorario) {
    return ordenarHorarios([...horarios, horarioActualizado]);
  }

  return ordenarHorarios(
    horarios.map(horario =>
      horario.id === horarioActualizado.id ? horarioActualizado : horario,
    ),
  );
}

function useAdminHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(true);
  const [guardandoHorario, setGuardandoHorario] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState(null);

  const cargarHorarios = useCallback(async () => {
    try {
      setCargandoHorarios(true);
      setErrorHorarios(null);

      const data = await getHorariosAdmin();

      setHorarios(ordenarHorarios(data || []));
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      setErrorHorarios("No fue posible cargar los horarios.");
      setHorarios([]);
    } finally {
      setCargandoHorarios(false);
    }
  }, []);

  useEffect(() => {
    cargarHorarios();
  }, [cargarHorarios]);

  const horariosPorDia = useMemo(() => {
    return horarios.reduce((acc, horario) => {
      acc[horario.dia_semana] = horario;
      return acc;
    }, {});
  }, [horarios]);

  const guardarHorario = async horario => {
    try {
      setGuardandoHorario(true);
      setErrorHorarios(null);

      const payload = {
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        activo: Boolean(horario.activo),
      };

      const resultado = horario.id
        ? await updateHorario(horario.id, payload)
        : await createHorario(payload);

      if (!resultado) {
        setErrorHorarios("No fue posible guardar el horario.");
        return false;
      }

      setHorarios(prevHorarios =>
        actualizarHorarioEnLista(prevHorarios, resultado),
      );

      return true;
    } catch (error) {
      console.error("Error al guardar horario:", error);
      setErrorHorarios("Ocurrió un error al guardar el horario.");
      return false;
    } finally {
      setGuardandoHorario(false);
    }
  };

  const cambiarEstadoHorario = async (horario, activo) => {
    if (!horario?.id) {
      return false;
    }

    try {
      setGuardandoHorario(true);
      setErrorHorarios(null);

      const resultado = await updateHorario(horario.id, {
        dia_semana: horario.dia_semana,
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin,
        activo,
      });

      if (!resultado) {
        setErrorHorarios("No fue posible cambiar el estado del horario.");
        return false;
      }

      setHorarios(prevHorarios =>
        actualizarHorarioEnLista(prevHorarios, resultado),
      );

      return true;
    } catch (error) {
      console.error("Error al cambiar estado del horario:", error);
      setErrorHorarios("Ocurrió un error al cambiar el estado del horario.");
      return false;
    } finally {
      setGuardandoHorario(false);
    }
  };

  return {
    horarios,
    horariosPorDia,
    cargandoHorarios,
    guardandoHorario,
    errorHorarios,
    cargarHorarios,
    guardarHorario,
    cambiarEstadoHorario,
  };
}

export default useAdminHorarios;
