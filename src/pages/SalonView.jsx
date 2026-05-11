import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Leyenda from "../components/Leyenda";
import "../styles/salonView.css";

function SalonView() {

  return (
    <div className="salon-view">
      <Navbar />
      <Leyenda />

      <footer className="salon-view__footer">
        <p>
          📞 (57) 300 123 4567 | ✉️ contacto@thegordo.com | 📍 Calle 10 #5-20,
          Colombia
        </p>
      </footer>
    </div>
  );
}

export default SalonView;
