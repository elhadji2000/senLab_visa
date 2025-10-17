import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";

function Home() {
  return (
    <Container>
      <h1 style={{ marginBottom: 12, color: "#0f172a" }}>
        Bienvenue dans TrigoLab 👋
      </h1>

      <p style={{ lineHeight: 1.7, fontSize: "1.1rem", color: "#334155" }}>
        La trigonométrie est une branche des mathématiques qui étudie les
        relations entre les <b>angles</b> et les <b>longueurs</b> dans un
        cercle ou un triangle.  
        Dans TrigoLab, vous allez pouvoir <b>manipuler un cercle
        trigonométrique</b> de façon interactive pour mieux comprendre les
        notions de <b>sinus</b> et <b>cosinus</b>.
      </p>

      <div
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          padding: 20,
          borderRadius: 12,
          margin: "20px 0",
          border: "1px solid #bae6fd",
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0c4a6e" }}>
          Ce que vous allez apprendre :
        </h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>✔️ Comprendre le <b>cercle trigonométrique</b></li>
          <li>
            ✔️ Placer un point <b>M(cos θ, sin θ)</b> sur le cercle
          </li>
          <li>
            ✔️ Lire les valeurs du <b>cosinus</b> et du <b>sinus</b> grâce aux
            projections sur les axes
          </li>
          <li>✔️ Passer facilement des <b>degrés</b> aux <b>radians</b></li>
          <li>
            ✔️ Relier la géométrie aux calculs à travers des <b>exemples
            visuels</b>
          </li>
        </ul>
      </div>

      <div
        style={{
          background: "#fef9c3",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #facc15",
          marginBottom: 20,
          color: "#713f12",
          fontSize: "1rem",
          lineHeight: 1.6,
        }}
      >
        ✨ <b>Conseil :</b> bougez le curseur de l’angle et observez comment les
        coordonnées du point M changent. Vous verrez que la valeur en abscisse
        correspond toujours à <b>cos(θ)</b>, et la valeur en ordonnée à{" "}
        <b>sin(θ)</b>.  
        C’est une manière simple et visuelle de retenir ces définitions !
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <Link
          to="/trigo"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
          }}
        >
          Explorer le cercle trigonométrique
        </Link>
      </div>
    </Container>
  );
}

export default Home;
