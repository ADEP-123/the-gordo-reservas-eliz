import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const cargarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUsuario(session?.user || null);
      setCargandoSesion(false);
    };

    cargarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user || null);
      setCargandoSesion(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const iniciarSesion = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        usuario: null,
        error,
      };
    }

    setUsuario(data.user);

    return {
      usuario: data.user,
      error: null,
    };
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  const value = useMemo(
    () => ({
      usuario,
      cargandoSesion,
      estaAutenticado: Boolean(usuario),
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, cargandoSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
