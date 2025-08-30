import React from "react";

export default function ServingControl({ baseServings = 2, value, onChange }) {
  const min = 1;
  const max = 16;

  return (
    <div>
      <h3 className="font-semibold mb-2">Personnes</h3>
      <div className="flex items-center gap-2">
        <button className="btn" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Diminuer">
          −
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step="1"
          className="w-24 text-center border border-gray-300 rounded-2xl px-3 py-2"
          value={value}
          onChange={(e) => onChange(Number(e.target.value || baseServings))}
        />
        <button className="btn" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Augmenter">
          +
        </button>
      </div>

      <input
        className="mt-4 w-full"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      <p className="text-sm text-gray-600 mt-2">
        Rapport = {value} / {baseServings} = {(value / baseServings).toFixed(2)}.
      </p>
    </div>
  );
}
