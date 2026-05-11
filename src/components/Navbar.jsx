import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <span className="navbar-logo">🍔</span>
          <div>
            <h1 className="navbar-title">The Gordo</h1>
            <p className="navbar-subtitle">Reservas de Mesas</p>
          </div>
        </div>
        <ul className="navbar-links">
          <li>
            <a href="#">Inicio</a>
          </li>
          <li>
            <a href="#">Menú</a>
          </li>
          <li>
            <a href="#">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
