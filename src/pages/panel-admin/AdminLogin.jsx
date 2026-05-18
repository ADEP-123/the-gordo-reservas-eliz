import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/panel-admin/adminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { iniciarSesion, estaAutenticado, esAdmin, cargandoSesion } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  if (cargandoSesion) {
    return (
      <main className="admin-login">
        <section className="admin-login__card">
          <span className="admin-login__label">Panel administrador</span>
          <h1>Validando</h1>
          <p>Estamos revisando tu sesión.</p>
        </section>
      </main>
    );
  }

  if (estaAutenticado && esAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Ingresa correo y contraseña.");
      return;
    }

    try {
      setCargando(true);

      const { error } = await iniciarSesion({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        setError("Credenciales incorrectas o usuario no autorizado.");
        return;
      }

      navigate("/admin");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <span className="admin-login__label">Panel administrador</span>

        <h1>Ingresar</h1>

        <p>
          Accede al panel para gestionar mesas, reservas y horarios del
          restaurante.
        </p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__grupo">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@thegordo.com"
            />
          </div>

          <div className="admin-login__grupo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="admin-login__error">{error}</div>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
