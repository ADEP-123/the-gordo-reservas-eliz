import { useCallback, useEffect, useState } from "react";
import { getMesas } from "../services/mesasService";

function useMesas() {
  const [mesas, setMesas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarMesas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await getMesas();

      setMesas(data || []);
    } catch (error) {
      console.error("Error al cargar las mesas:", error);
      setError("No fue posible cargar las mesas del restaurante.");
      setMesas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarMesas();
  }, [cargarMesas]);

  return {
    mesas,
    cargando,
    error,
    recargarMesas: cargarMesas,
  };
}

export default useMesas;
