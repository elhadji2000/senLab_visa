import React from "react";

export default function ComplexInput({ label = "z", value, onChange }) {
  return (
    <div className="flex items-end gap-3">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">{label} (réel)</label>
        <input
          type="number"
          step="0.1"
          className="border rounded-xl px-3 py-2 w-28"
          value={value.re}
          onChange={(e) => onChange({ ...value, re: parseFloat(e.target.value || 0) })}
        />
      </div>
      <span className="pb-2 text-lg">+</span>
      <div className="flex flex-col">
        <label className="text-sm text-gray-600">{label} (imag.)</label>
        <input
          type="number"
          step="0.1"
          className="border rounded-xl px-3 py-2 w-28"
          value={value.im}
          onChange={(e) => onChange({ ...value, im: parseFloat(e.target.value || 0) })}
        />
      </div>
      <span className="pb-2 text-lg">i</span>
    </div>
  );
}
