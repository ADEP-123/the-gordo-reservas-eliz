import { useAuth } from "../context/AuthContext";
import "../styles/adminDashboard.css";

function AdminDashboard() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <main className="admin-dashboard">
      <aside className="admin-dashboard__sidebar">
        <div>
          <span className="admin-dashboard__label">The Gordo</span>
          <h1>Admin</h1>
        </div>

        <nav className="admin-dashboard__nav">
          <button type="button" className="admin-dashboard__nav-item active">
            Mesas
          </button>
          <button type="button" className="admin-dashboard__nav-item">
            Reservas
          </button>
          <button type="button" className="admin-dashboard__nav-item">
            Horarios
          </button>
          <button type="button" className="admin-dashboard__nav-item">
            Configuración
          </button>
        </nav>

        <button
          type="button"
          className="admin-dashboard__logout"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </aside>

      <section className="admin-dashboard__content">
        <header className="admin-dashboard__header">
          <div>
            <span className="admin-dashboard__label">Panel principal</span>
            <h2>Gestión del restaurante</h2>
            <p>
              Sesión iniciada como <strong>{usuario?.email}</strong>.
            </p>
          </div>
        </header>

        <div className="admin-dashboard__cards">
          <article>
            <span>Mesas</span>
            <strong>Gestión pendiente</strong>
            <p>Crear, editar, bloquear y desbloquear mesas.</p>
          </article>

          <article>
            <span>Reservas</span>
            <strong>Gestión pendiente</strong>
            <p>Consultar y cancelar reservas realizadas.</p>
          </article>

          <article>
            <span>Horarios</span>
            <strong>Gestión pendiente</strong>
            <p>Configurar días activos, apertura y cierre.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
