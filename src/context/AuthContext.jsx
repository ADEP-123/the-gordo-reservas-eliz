import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

async function verificarPermisoAdmin() {
  const { data, error } = await supabase.rpc("is_admin");

  if (error) {
    console.error("Error al verificar permisos de admin:", error);
    return false;
  }

  return Boolean(data);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargandoSesionBase, setCargandoSesionBase] = useState(true);
  const [verificandoAdmin, setVerificandoAdmin] = useState(false);

  useEffect(() => {
    let componenteActivo = true;

    const cargarSesionInicial = async () => {
      try {
        setCargandoSesionBase(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!componenteActivo) return;

        setUsuario(session?.user || null);
      } catch (error) {
        console.error("Error al cargar sesión:", error);

        if (!componenteActivo) return;

        setUsuario(null);
        setEsAdmin(false);
      } finally {
        if (componenteActivo) {
          setCargandoSesionBase(false);
        }
      }
    };

    cargarSesionInicial();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null;

      setUsuario(user);

      if (!user) {
        setEsAdmin(false);
      }
    });

    return () => {
      componenteActivo = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let componenteActivo = true;

    const validarAdmin = async () => {
      if (!usuario?.id) {
        setEsAdmin(false);
        setVerificandoAdmin(false);
        return;
      }

      try {
        setVerificandoAdmin(true);

        const admin = await verificarPermisoAdmin();

        if (!componenteActivo) return;

        setEsAdmin(admin);
      } finally {
        if (componenteActivo) {
          setVerificandoAdmin(false);
        }
      }
    };

    validarAdmin();

    return () => {
      componenteActivo = false;
    };
  }, [usuario?.id]);

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

    const admin = await verificarPermisoAdmin();

    if (!admin) {
      await supabase.auth.signOut();

      setUsuario(null);
      setEsAdmin(false);

      return {
        usuario: null,
        error: {
          message:
            "El usuario inició sesión correctamente, pero no está registrado como administrador.",
        },
      };
    }

    setUsuario(data.user);
    setEsAdmin(true);

    return {
      usuario: data.user,
      error: null,
    };
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();

    setUsuario(null);
    setEsAdmin(false);
  };

  const cargandoSesion = cargandoSesionBase || verificandoAdmin;

  const value = useMemo(
    () => ({
      usuario,
      esAdmin,
      cargandoSesion,
      estaAutenticado: Boolean(usuario),
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, esAdmin, cargandoSesion],
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
