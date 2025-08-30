import React from "react";
import { formatNumber } from "../utils/scale.js";

export default function Explanation({ baseServings, servings, example }) {
  if (!example) return null;
  const ratio = servings / baseServings;

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Explication mathématique</h3>
      <p className="text-sm text-gray-700">
        On utilise la <b>proportionnalité</b> : on multiplie chaque quantité de la recette de base par le{" "}
        <b>rapport</b> entre le nombre de personnes visées et celui de la recette de base.
      </p>

      <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-800">
        Formule : <code className="px-2 py-1 bg-white rounded border">Nouvelle quantité = Quantité de base × (Personnes visées ÷ Personnes de base)</code>
      </div>

      <div className="mt-3 text-sm text-gray-700">
        <p>
          Exemple avec <b>{example.name}</b> : {formatNumber(example.quantity)} {example.unit} × ({servings} ÷ {baseServings}) ={" "}
          {formatNumber(example.exactQty)} {example.unit}
        </p>
      </div>
    </div>
  );
}
