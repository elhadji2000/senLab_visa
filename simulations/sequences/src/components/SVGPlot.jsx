import React from "react";
import { formatNumber } from "../utils/suites";

export default function SVGPlot({ terms, logScale }) {
  const width = 600, height = 240, pad = 30;
  const n = terms.length;
  if (n === 0) return null;

  const xs = terms.map((_, i) => pad + (i / (n - 1)) * (width - pad * 2));
  const values = terms.map((v) =>
    logScale ? Math.sign(v) * Math.log10(Math.abs(v) + 1) : v
  );
  const minY = Math.min(...values), maxY = Math.max(...values);
  const span = maxY - minY || 1;
  const ys = values.map(
    (v) => pad + (1 - (v - minY) / span) * (height - pad * 2)
  );

  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full border rounded bg-white">
      <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={points} />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r={5} fill="#fff" stroke="#2563eb" />
          <title>{`n=${i + 1}, Tn=${formatNumber(terms[i])}`}</title>
        </g>
      ))}
      {xs.map((x, i) => (
        <text key={i} x={x} y={height - 10} fontSize={10} textAnchor="middle">
          {i + 1}
        </text>
      ))}
    </svg>
  );
}
