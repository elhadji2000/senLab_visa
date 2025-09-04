import React from "react";
import { formatNumber } from "../utils/suites";

export default function TermList({ terms }) {
  return (
    <div>
      <h3 className="font-medium">Suite générée</h3>
      <ol className="list-decimal list-inside mt-2 text-sm max-h-48 overflow-auto border p-2 rounded">
        {terms.map((t, i) => (
          <li key={i}>
            <strong>T{i + 1}</strong> = {formatNumber(t)}
          </li>
        ))}
      </ol>
    </div>
  );
}
