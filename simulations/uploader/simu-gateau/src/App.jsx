import React, { useMemo, useState } from "react";
import recipe from "./data/recipe.js";
import { scaleQuantity, formatNumber } from "./utils/scale.js";
import ServingControl from "./components/ServingControl.jsx";
import IngredientCard from "./components/IngredientCard.jsx";
import Explanation from "./components/Explanation.jsx";
import ExercisePanel from "./components/ExercisePanel.jsx";

export default function App() {
  const [servings, setServings] = useState(2);
  const [rounding, setRounding] = useState("none"); // none | integer | half
  const [mode, setMode] = useState("simulate"); // simulate | exercise

  const scaled = useMemo(() => {
    return recipe.ingredients.map((ing) => ({
      ...ing,
      scaledQty: scaleQuantity(ing.quantity, recipe.baseServings, servings, rounding),
      exactQty: (ing.quantity * servings) / recipe.baseServings,
    }));
  }, [servings, rounding]);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <img src="/images/cake.svg" alt="Gâteau" className="w-10 h-10" />
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold leading-tight">
              {recipe.name} — Simulation de proportionnalité
            </h1>
            <p className="text-sm text-gray-600">
              Base: {recipe.baseServings} personnes. Ajuste le nombre de
              personnes et observe la mise à l’échelle des ingrédients.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={
                "btn " + (mode === "simulate" ? "btn-primary" : "")
              }
              onClick={() => setMode("simulate")}
            >
              Simulation
            </button>
            <button
              className={
                "btn " + (mode === "exercise" ? "btn-primary" : "")
              }
              onClick={() => setMode("exercise")}
            >
              Mode exercice
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-5 gap-6">
        {/* Left column: controls */}
        <aside className="md:col-span-2 space-y-4">
          <div className="card">
            <ServingControl
              baseServings={recipe.baseServings}
              value={servings}
              onChange={setServings}
            />
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Arrondi</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: "none", label: "Aucun" },
                { key: "integer", label: "À l’unité" },
                { key: "half", label: "Pas de 0,5" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  className={
                    "btn " + (rounding === opt.key ? "btn-primary" : "")
                  }
                  onClick={() => setRounding(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Choisis le mode d’arrondi pour rendre les quantités plus pratiques.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-2">Astuces</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>
                Multiplier par le <b>rapport</b>: cible / base = {servings} / {recipe.baseServings}.
              </li>
              <li>
                Quantité × rapport = nouvelle quantité. Exemple sucre: {formatNumber(recipe.ingredients[1].quantity)} g × {formatNumber(servings / recipe.baseServings)} ={" "}
                {formatNumber((recipe.ingredients[1].quantity * servings) / recipe.baseServings)} g.
              </li>
              <li>
                Ajuste l’arrondi pour des mesures faciles (cuillères, sachets, œufs entiers).
              </li>
            </ul>
          </div>
        </aside>

        {/* Right column: ingredients or exercise */}
        <section className="md:col-span-3 space-y-4">
          {mode === "simulate" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {scaled.map((ing) => (
                <IngredientCard key={ing.id} ingredient={ing} rounding={rounding} />
              ))}
            </div>
          ) : (
            <ExercisePanel
              baseServings={recipe.baseServings}
              servings={servings}
              ingredients={recipe.ingredients}
            />
          )}

          <Explanation
            baseServings={recipe.baseServings}
            servings={servings}
            example={scaled[1]}
          />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Simu Gâteau — Apprendre par la vie quotidienne.
      </footer>
    </div>
  );
}
