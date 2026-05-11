import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <span className="navbar-logo">🍔</span>
        <div>
          <h1 className="navbar-title">Comidas Rápidas The Gordo</h1>
          <p className="navbar-subtitle">Sistema de Reservas de Mesas</p>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
