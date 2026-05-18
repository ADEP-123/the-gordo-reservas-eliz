import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "../../styles/panel-admin/adminLogin.css";
import { obtenerMensajeErrorAuth } from "../../utils/panel-admin/authErrorMessages";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!email.trim()) {
      setError("Ingresa el correo del administrador.");
      return;
    }

    try {
      setEnviando(true);

      const redirectTo = `${window.location.origin}/admin/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo,
        },
      );

      if (error) {
        setError(obtenerMensajeErrorAuth(error));
        return;
      }

      setMensaje(
        "Si el correo está registrado, recibirás un enlace para restablecer la contraseña.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <span className="admin-login__label">Recuperar acceso</span>

        <h1>Contraseña</h1>

        <p>
          Ingresa el correo del administrador. Te enviaremos un enlace para
          crear una nueva contraseña.
        </p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__grupo">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="admin@thegordo.com"
            />
          </div>

          {error && <div className="admin-login__error">{error}</div>}

          {mensaje && <div className="admin-login__success">{mensaje}</div>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar enlace"}
          </button>

          <Link className="admin-login__link" to="/admin/login">
            Volver al inicio de sesión
          </Link>
        </form>
      </section>
    </main>
  );
}

export default AdminForgotPassword;
