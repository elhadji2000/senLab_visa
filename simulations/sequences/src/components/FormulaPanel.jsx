import React from "react";
import { formatNumber } from "../utils/suites";

export default function FormulaPanel({ nthTerm, sum, showSum }) {
  return (
    <div>
      <h3 className="font-medium">Formules et résultats</h3>
      <div className="mt-2 text-sm">
        <div><strong>Terme général :</strong> {nthTerm}</div>
        {showSum && sum !== null && (
          <div className="mt-2"><strong>Somme Sₙ :</strong> {formatNumber(sum)}</div>
        )}
      </div>
    </div>
  );
}
