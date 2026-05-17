import { useState } from "react";
import AdminMesasPanel from "../../components/panel-admin/AdminMesasPanel";
import { useAuth } from "../../context/AuthContext";
import {
  SECCIONES_ADMIN,
  SECCIONES_INFO,
} from "../../data/panel-admin/seccionesAdmin";
import "../../styles/panel-admin/adminDashboard.css";

function AdminDashboard() {
  const { usuario, cerrarSesion } = useAuth();
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES_ADMIN.mesas);
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  const seccionActual = SECCIONES_INFO[seccionActiva];

  const renderContenido = () => {
    if (seccionActiva === SECCIONES_ADMIN.mesas) {
      return <AdminMesasPanel />;
    }

    return (
      <section className="admin-dashboard__placeholder">
        <span className="admin-dashboard__label">Próximamente</span>
        <h2>Sección en construcción</h2>
        <p>
          Esta sección se implementará en el siguiente avance del módulo
          administrador.
        </p>
      </section>
    );
  };

  const handleCerrarSesion = async () => {
    setMenuUsuarioAbierto(false);
    await cerrarSesion();
  };

  const renderUsuarioMenu = () => (
    <div className="admin-dashboard__user-wrap">
      <button
        type="button"
        className="admin-dashboard__user"
        onClick={() => setMenuUsuarioAbierto(prev => !prev)}
        aria-expanded={menuUsuarioAbierto}
      >
        <span>{usuario?.email}</span>
        <strong aria-hidden="true">👤</strong>
      </button>

      {menuUsuarioAbierto && (
        <div className="admin-dashboard__user-menu">
          <button type="button" onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main
      className={`admin-dashboard ${
        sidebarColapsado ? "admin-dashboard--sidebar-colapsado" : ""
      }`}
    >
      <aside className="admin-dashboard__sidebar">
        <div className="admin-dashboard__sidebar-top">
          <div className="admin-dashboard__brand">
            <div className="admin-dashboard__brand-text">
              <span className="admin-dashboard__label">The Gordo</span>
              <h1>Admin</h1>

              <img
                className="admin-dashboard__mobile-logo"
                src="/logo.webp"
                alt=""
                aria-hidden="true"
              />
            </div>

            <button
              type="button"
              className="admin-dashboard__collapse"
              onClick={() => setSidebarColapsado(prev => !prev)}
              aria-label={
                sidebarColapsado
                  ? "Expandir menú administrador"
                  : "Contraer menú administrador"
              }
            >
              <span className="admin-dashboard__collapse-inner">
                <span className="admin-dashboard__collapse-face admin-dashboard__collapse-face--front">
                  <img
                    className="admin-dashboard__collapse-logo"
                    src="/logo.webp"
                    alt=""
                    aria-hidden="true"
                  />
                </span>

                <span className="admin-dashboard__collapse-face admin-dashboard__collapse-face--back">
                  {sidebarColapsado ? "→" : "←"}
                </span>
              </span>
            </button>
          </div>

          <div className="admin-dashboard__mobile-summary">
            <span className="admin-dashboard__label">Panel principal</span>
            <h2>Gestión del restaurante</h2>
            <p>{seccionActual.titulo}</p>
            {renderUsuarioMenu()}
          </div>
        </div>

        <nav className="admin-dashboard__nav">
          {Object.entries(SECCIONES_INFO).map(([key, seccion]) => (
            <button
              key={key}
              type="button"
              className={`admin-dashboard__nav-item ${
                seccionActiva === key ? "active" : ""
              }`}
              onClick={() => setSeccionActiva(key)}
              title={seccion.label}
            >
              <span className="admin-dashboard__nav-icon">
                {seccion.inicial}
              </span>
              <span className="admin-dashboard__nav-text">{seccion.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="admin-dashboard__content">
        <header className="admin-dashboard__topbar">
          <div className="admin-dashboard__title">
            <span className="admin-dashboard__label">Panel principal</span>
            <h2>Gestión del restaurante</h2>
            <p>{seccionActual.titulo}</p>
          </div>

          {renderUsuarioMenu()}
        </header>

        {renderContenido()}
      </section>
    </main>
  );
}

export default AdminDashboard;
