import React, { useState } from "react";

function PizzaFraction() {
  const [parts, setParts] = useState(4);
  const [eaten, setEaten] = useState(0);

  // Charger une image selon les parts
  const pizzaImage = `/src/assets/pizza_${parts}_parts.png`;

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>🍕 Simulation de fractions avec une pizza</h2>

      {/* Curseur */}
      <label>
        Nombre de parts : {parts}
        <input
          type="range"
          min="2"
          max="12"
          value={parts}
          onChange={(e) => {
            setParts(parseInt(e.target.value));
            setEaten(0); // reset quand on change
          }}
        />
      </label>

      {/* Pizza affichée */}
      <div style={{ marginTop: 20 }}>
        <img
          src={pizzaImage}
          alt={`Pizza découpée en ${parts} parts`}
          style={{ width: "300px" }}
          onClick={() => {
            if (eaten < parts) setEaten(eaten + 1);
          }}
        />
      </div>

      {/* Texte explicatif */}
      <p style={{ fontSize: "1.2rem", marginTop: 15 }}>
        Chaque part représente <b>1/{parts}</b> de la pizza.
        <br />
        Tu as mangé <b>{eaten}</b> part(s), il reste{" "}
        <b>
          {parts - eaten}/{parts}
        </b>{" "}
        de la pizza.
      </p>
      <small>(Clique sur la pizza pour manger une part 🍴)</small>
    </div>
  );
}

export default PizzaFraction;
