import React, { useMemo } from "react";
import { mag, dot, angle, toDeg, nearZero } from "../utils/vector";

export default function VectorInfo({ A, B }) {
  const mA = useMemo(() => mag(A), [A]);
  const mB = useMemo(() => mag(B), [B]);
  const d  = useMemo(() => dot(A, B), [A, B]);
  const ang = useMemo(() => toDeg(angle(A, B)), [A, B]);

  const relation = (() => {
    if (ang == null) return "—";
    if (Math.abs(ang) < 1) return "≈ parallèles (même sens)";
    if (Math.abs(ang - 180) < 1) return "≈ parallèles (sens opposé)";
    if (nearZero(d)) return "≈ perpendiculaires";
    return "génériques";
  })();

  return (
    <div className="panel">
      <h3>Données</h3>
      <div className="info-grid">
        <div className="info-row"><span>‖A‖</span><strong>{mA.toFixed(3)}</strong></div>
        <div className="info-row"><span>‖B‖</span><strong>{mB.toFixed(3)}</strong></div>
        <div className="info-row"><span>A · B</span><strong>{d.toFixed(3)}</strong></div>
        <div className="info-row"><span>∠(A, B)</span><strong>{ang == null ? "—" : ang.toFixed(1) + "°"}</strong></div>
        <div className="info-row"><span>Relation</span><strong>{relation}</strong></div>
      </div>
      <p style={{ marginTop: 10, color: "#a8b3c7", fontSize: 13 }}>
        Rappels : A·B = ‖A‖‖B‖cosθ. La projection <em>de A sur B</em> vaut (A·B / ‖B‖²) B.
      </p>
    </div>
  );
}
