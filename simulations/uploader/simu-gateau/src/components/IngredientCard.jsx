import React from "react";
import { formatNumber } from "../utils/scale.js";

export default function IngredientCard({ ingredient, rounding }) {
  const { name, unit, scaledQty, image, imageAlt } = ingredient;

  return (
    <div className="card flex gap-4">
      <img
        src={`/images/${image}`}
        alt={imageAlt || name}
        className="w-20 h-20 rounded-xl object-cover bg-gray-100"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-gray-600">Unité: {unit}</p>
          </div>
          <span className="badge">
            <span className="font-semibold">{formatNumber(scaledQty)}</span> {unit}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {rounding === "none"
            ? "Quantité exacte (non arrondie)."
            : rounding === "integer"
            ? "Arrondi à l’unité la plus proche."
            : "Arrondi au pas de 0,5."}
        </p>
      </div>
    </div>
  );
}
