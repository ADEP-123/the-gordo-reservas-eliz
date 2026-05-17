import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { estaAutenticado, cargandoSesion } = useAuth();

  if (cargandoSesion) {
    return (
      <div className="salon-view__loading">
        ⏳ Validando sesión de administrador...
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;
