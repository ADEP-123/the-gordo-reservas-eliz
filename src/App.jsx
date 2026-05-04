import "./App.css";

function App() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.emoji}>🍔</h1>
        <h1 style={styles.title}>Comidas Rápidas The Gordo</h1>
        <p style={styles.subtitle}>Sistema de Reservas de Mesas</p>
        <div style={styles.badge}>🚧 En desarrollo</div>
        <p style={styles.text}>
          Estamos construyendo algo delicioso.
          <br />
          Pronto podrás reservar tu mesa en línea.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "50px 40px",
    textAlign: "center",
    maxWidth: "480px",
    width: "90%",
  },
  emoji: {
    fontSize: "64px",
    margin: "0 0 30px 0",
  },
  title: {
    color: "#ffffff",
    fontSize: "28px",
    margin: "0 0 8px 0",
    fontWeight: "bold",
  },
  subtitle: {
    color: "#a0aec0",
    fontSize: "16px",
    margin: "0 0 24px 0",
  },
  badge: {
    display: "inline-block",
    background: "#f6ad55",
    color: "#1a1a2e",
    borderRadius: "20px",
    padding: "6px 18px",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "24px",
  },
  text: {
    color: "#cbd5e0",
    fontSize: "15px",
    lineHeight: "1.7",
    marginBottom: "30px",
  },
  stack: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  tag: {
    background: "rgba(255,255,255,0.1)",
    color: "#90cdf4",
    border: "1px solid rgba(144,205,244,0.3)",
    borderRadius: "8px",
    padding: "4px 14px",
    fontSize: "13px",
  },
};

export default App;
