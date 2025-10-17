import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const linkStyle = {
  color: "#e2e8f0",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #334155",
  transition: "all 0.2s ease",
  background: "rgba(30, 41, 59, 0.4)",
};
function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        borderBottom: "1px solid #334155",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: "1.4rem" }}>🧪</span> TrigoLab
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <Link style={linkStyle} to="/">
          Accueil
        </Link>
        <Link style={linkStyle} to="/trigo">
          Cercle trigonométrique
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
