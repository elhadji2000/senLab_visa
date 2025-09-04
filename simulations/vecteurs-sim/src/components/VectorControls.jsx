import React from "react";

export default function VectorControls({
  A, B, k,
  setA, setB, setK,
  showSum, setShowSum,
  showDiff, setShowDiff,
  showProj, setShowProj,
  showK, setShowK,
  onRandomize, onReset
}) {
  const numField = (id, value, onChange) => (
    <div className="input-row">
      <input
        type="number"
        step="1"
        min="-10"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );

  return (
    <div className="panel">
      <h3>Contrôles</h3>

      <div className="controls-grid" style={{ marginBottom: 8 }}>
        <label>Ax</label>
        {numField("ax", A.x, (v) => setA({ ...A, x: v }))}
        <label>Ay</label>
        {numField("ay", A.y, (v) => setA({ ...A, y: v }))}
        <label>Bx</label>
        {numField("bx", B.x, (v) => setB({ ...B, x: v }))}
        <label>By</label>
        {numField("by", B.y, (v) => setB({ ...B, y: v }))}
      </div>

      <label style={{ fontSize: 12, color: "#a8b3c7" }}>k (multiplication scalaire de A)</label>
      <div className="input-row">
        <input
          type="range"
          min="-5" max="5" step="0.1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
        <div className="badge">{k}</div>
      </div>

      <div className="switches">
        <label><input type="checkbox" checked={showSum}  onChange={(e) => setShowSum(e.target.checked)} /> Afficher A+B</label>
        <label><input type="checkbox" checked={showDiff} onChange={(e) => setShowDiff(e.target.checked)} /> Afficher A−B</label>
        <label><input type="checkbox" checked={showProj} onChange={(e) => setShowProj(e.target.checked)} /> Afficher proj_B(A)</label>
        <label><input type="checkbox" checked={showK}    onChange={(e) => setShowK(e.target.checked)} /> Afficher k·A</label>
      </div>

      <div className="btns">
        <button onClick={onRandomize}>Aléatoire</button>
        <button onClick={onReset}>Réinitialiser</button>
      </div>
    </div>
  );
}
