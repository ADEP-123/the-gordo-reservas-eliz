import { useCallback, useEffect, useState } from "react";
import {
  cambiarEstadoMesa,
  createMesa,
  getMesas,
  updateMesa,
} from "../../services/mesasService";

function useAdminMesas() {
  const [mesas, setMesas] = useState([]);
  const [cargandoMesas, setCargandoMesas] = useState(true);
  const [guardandoMesa, setGuardandoMesa] = useState(false);
  const [errorMesas, setErrorMesas] = useState(null);

  const cargarMesas = useCallback(async () => {
    try {
      setCargandoMesas(true);
      setErrorMesas(null);

      const data = await getMesas();

      setMesas(data || []);
    } catch (error) {
      console.error("Error al cargar mesas:", error);
      setErrorMesas("No fue posible cargar las mesas.");
      setMesas([]);
    } finally {
      setCargandoMesas(false);
    }
  }, []);

  useEffect(() => {
    cargarMesas();
  }, [cargarMesas]);

  const guardarMesa = async ({ id, numero, capacidad, ubicacion, estado }) => {
    try {
      setGuardandoMesa(true);
      setErrorMesas(null);

      const payload = {
        numero: Number(numero),
        capacidad: Number(capacidad),
        ubicacion: ubicacion.trim(),
        estado,
      };

      const resultado = id
        ? await updateMesa(id, payload)
        : await createMesa(payload);

      if (!resultado) {
        setErrorMesas("No fue posible guardar la mesa.");
        return false;
      }

      await cargarMesas();
      return true;
    } catch (error) {
      console.error("Error al guardar mesa:", error);
      setErrorMesas("Ocurrió un error al guardar la mesa.");
      return false;
    } finally {
      setGuardandoMesa(false);
    }
  };

  const actualizarEstadoMesa = async (mesaId, estado) => {
    try {
      setGuardandoMesa(true);
      setErrorMesas(null);

      const resultado = await cambiarEstadoMesa(mesaId, estado);

      if (!resultado) {
        setErrorMesas("No fue posible cambiar el estado de la mesa.");
        return false;
      }

      await cargarMesas();
      return true;
    } catch (error) {
      console.error("Error al cambiar estado de mesa:", error);
      setErrorMesas("Ocurrió un error al cambiar el estado de la mesa.");
      return false;
    } finally {
      setGuardandoMesa(false);
    }
  };

  return {
    mesas,
    cargandoMesas,
    guardandoMesa,
    errorMesas,
    cargarMesas,
    guardarMesa,
    actualizarEstadoMesa,
  };
}

export default useAdminMesas;
