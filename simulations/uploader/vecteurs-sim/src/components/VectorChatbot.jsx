import React, { useState } from "react";

const faqs = [
  {
    q: "Comment additionner deux vecteurs ?",
    a: "Pour additionner A(x1,y1) et B(x2,y2), on calcule A+B = (x1+x2, y1+y2). Géométriquement, c’est la diagonale du parallélogramme formé par A et B."
  },
  {
    q: "Comment calculer l’angle entre deux vecteurs ?",
    a: "On utilise : cosθ = (A·B)/(‖A‖‖B‖). L’angle est θ = arccos(...)."
  },
  {
    q: "À quoi sert la projection d’un vecteur ?",
    a: "La projection de A sur B est la partie de A qui est alignée avec B. Elle s’écrit proj_B(A) = (A·B / ‖B‖²) B."
  },
  {
    q: "Qu’est-ce que le produit scalaire ?",
    a: "Le produit scalaire A·B = x1*x2 + y1*y2. Il sert à mesurer l’angle ou la longueur projetée d’un vecteur sur un autre."
  }
];

export default function VectorChatbot() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="panel">
      <h3>Aide & FAQ</h3>
      {faqs.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 10 }}>
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            style={{ width: "100%", textAlign: "left", fontWeight: "bold" }}
          >
            {item.q}
          </button>
          {openIndex === idx && (
            <p style={{ marginTop: 6, color: "#a8b3c7", fontSize: 14 }}>
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
