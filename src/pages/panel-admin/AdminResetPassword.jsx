import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import {
  evaluarReglasPassword,
  passwordsCoinciden,
  validarCambioPassword,
} from "../../utils/panel-admin/passwordValidation";
import { obtenerMensajeErrorAuth } from "../../utils/panel-admin/authErrorMessages";
import "../../styles/panel-admin/adminLogin.css";

function AdminResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  const reglasEvaluadas = useMemo(
    () => evaluarReglasPassword(formData.password),
    [formData.password],
  );

  const passwordValida = reglasEvaluadas.every(rule => rule.valido);

  const confirmacionIngresada = formData.confirmPassword.length > 0;

  const confirmacionValida = passwordsCoinciden(
    formData.password,
    formData.confirmPassword,
  );

  const formularioValido =
    passwordValida && confirmacionIngresada && confirmacionValida;

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    setError("");
    setMensaje("");
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setError("");
    setMensaje("");

    const errorValidacion = validarCambioPassword(formData);

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setGuardando(true);

      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setError(obtenerMensajeErrorAuth(error));
        return;
      }

      await supabase.auth.signOut();

      setMensaje("Contraseña actualizada correctamente.");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1200);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <span className="admin-login__label">Nueva contraseña</span>

        <h1>Actualizar</h1>

        <p>
          Escribe una contraseña nueva. Debe cumplir los requisitos de seguridad
          y ser diferente a la contraseña anterior.
        </p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__grupo">
            <label htmlFor="password">Nueva contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="admin-login__requirements">
            {reglasEvaluadas.map(rule => (
              <span
                key={rule.id}
                className={`admin-login__requirement ${
                  rule.valido ? "admin-login__requirement--valid" : ""
                }`}
              >
                <strong>{rule.valido ? "✓" : "•"}</strong>
                {rule.label}
              </span>
            ))}
          </div>

          <div className="admin-login__grupo">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {confirmacionIngresada && (
              <small
                className={
                  confirmacionValida
                    ? "admin-login__hint admin-login__hint--valid"
                    : "admin-login__hint admin-login__hint--error"
                }
              >
                {confirmacionValida
                  ? "Las contraseñas coinciden."
                  : "Las contraseñas no coinciden."}
              </small>
            )}
          </div>

          {error && <div className="admin-login__error">{error}</div>}

          {mensaje && <div className="admin-login__success">{mensaje}</div>}

          <button type="submit" disabled={guardando || !formularioValido}>
            {guardando ? "Guardando..." : "Actualizar contraseña"}
          </button>

          <Link className="admin-login__link" to="/admin/login">
            Volver al inicio de sesión
          </Link>
        </form>
      </section>
    </main>
  );
}

export default AdminResetPassword;
