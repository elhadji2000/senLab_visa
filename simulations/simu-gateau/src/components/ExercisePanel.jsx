import React, { useMemo, useState } from "react";
import { scaleQuantity } from "../utils/scale.js";

function parseNumber(str) {
  if (typeof str === "number") return str;
  if (!str) return NaN;
  // Allow comma as decimal separator
  const s = String(str).replace(",", ".").trim();
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export default function ExercisePanel({ baseServings, servings, ingredients }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const solutions = useMemo(
    () =>
      Object.fromEntries(
        ingredients.map((ing) => [
          ing.id,
          scaleQuantity(ing.quantity, baseServings, servings, "none"),
        ])
      ),
    [ingredients, baseServings, servings]
  );

  function onChange(id, value) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function check() {
    setChecked(true);
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    setRevealed(false);
  }

  const tolerance = 0.05; // 5% tolerance

  return (
    <div className="card">
      <h3 className="font-semibold mb-1">Exercice : calcule les quantités</h3>
      <p className="text-sm text-gray-600 mb-4">
        Entre les quantités pour {servings} personne(s). Tolérance d’erreur: ±5%.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {ingredients.map((ing) => {
          const userVal = parseNumber(answers[ing.id]);
          const solution = solutions[ing.id];
          const error =
            Number.isFinite(userVal) && solution !== 0
              ? Math.abs(userVal - solution) / solution
              : null;
          const ok = checked && error !== null && error <= tolerance;

          return (
            <div key={ing.id} className="border rounded-2xl p-3 flex items-center gap-3">
              <img
                src={`/images/${ing.image}`}
                alt={ing.name}
                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{ing.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    className="w-28 border rounded-xl px-2 py-1 text-sm"
                    placeholder={`en ${ing.unit}`}
                    value={answers[ing.id] ?? ""}
                    onChange={(e) => onChange(ing.id, e.target.value)}
                  />
                  <span className="text-xs text-gray-600">{ing.unit}</span>
                </div>
                {checked && (
                  <div className={"text-xs mt-1 " + (ok ? "text-green-600" : "text-red-600")}>
                    {ok ? "✔️ Correct" : "❌ À revoir"}
                    {!ok && Number.isFinite(userVal) && (
                      <span className="ml-1 text-gray-500">
                        (attendu ≈ {solution.toFixed(2)})
                      </span>
                    )}
                  </div>
                )}
                {revealed && (
                  <div className="text-xs text-blue-700 mt-1">
                    Solution: {solution.toFixed(2)} {ing.unit}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={check}>Vérifier</button>
        <button className="btn" onClick={() => setRevealed((s) => !s)}>
          {revealed ? "Cacher les solutions" : "Afficher les solutions"}
        </button>
        <button className="btn" onClick={reset}>Réinitialiser</button>
      </div>
    </div>
  );
}
