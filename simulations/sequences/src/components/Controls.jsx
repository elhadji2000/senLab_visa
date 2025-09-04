import React from "react";
export default function Controls({
  type,
  a1,
  d,
  r,
  n,
  showSum,
  logScale,
  setType,
  setA1,
  setD,
  setR,
  setN,
  setShowSum,
  setLogScale,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-semibold mb-3">Paramètres</h2>

      <label className="block text-sm mb-1">Type de suite</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 rounded border"
      >
        <option value="arith">Arithmétique</option>
        <option value="geo">Géométrique</option>
        <option value="fib">Fibonacci</option>
      </select>

      <div className="mt-3">
        <label className="block text-sm">Premier terme a₁</label>
        <input
          type="number"
          value={a1}
          onChange={(e) => setA1(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {type === "arith" && (
        <div className="mt-3">
          <label className="block text-sm">Différence (d)</label>
          <input
            type="number"
            value={d}
            onChange={(e) => setD(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {type === "geo" && (
        <div className="mt-3">
          <label className="block text-sm">Raison (q)</label>
          <input
            type="number"
            step="any"
            value={r}
            onChange={(e) => setR(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      <div className="mt-3">
        <label className="block text-sm">Nombre de termes (n)</label>
        <input
          type="range"
          min="1"
          max="30"
          value={n}
          onChange={(e) => setN(e.target.value)}
          className="w-full"
        />
        <div className="text-sm mt-1">n = <strong>{n}</strong></div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={showSum}
            onChange={(e) => setShowSum(e.target.checked)}
          />
          Afficher la somme Sₙ
        </label>
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={logScale}
            onChange={(e) => setLogScale(e.target.checked)}
          />
          Échelle logarithmique
        </label>
      </div>
    </div>
  );
}
