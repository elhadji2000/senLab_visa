import React, { useMemo } from "react";
import { add, sub, scale, projectionOfAOntoB } from "../utils/vector";

export default function VectorCanvas({
  width = 800,
  height = 520,
  scalePx = 32, // pixels par unité
  A,
  B,
  k,
  showSum,
  showDiff,
  showProj,
  showK,
}) {
  const cx = width / 2;
  const cy = height / 2;

  const toScreen = (v) => ({ x: cx + v.x * scalePx, y: cy - v.y * scalePx });

  const Aend = toScreen(A);
  const Bend = toScreen(B);
  const Sum = useMemo(() => add(A, B), [A, B]);
  const Diff = useMemo(() => sub(A, B), [A, B]);
  const K = useMemo(() => scale(A, k), [A, k]);
  const Proj = useMemo(() => projectionOfAOntoB(A, B), [A, B]);

  const gridLines = useMemo(() => {
    const lines = [];
    const maxX = Math.ceil(width / (2 * scalePx));
    const maxY = Math.ceil(height / (2 * scalePx));
    for (let i = -maxX; i <= maxX; i++) {
      const x = cx + i * scalePx;
      lines.push(
        <line
          key={`v${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#1a2753"
          strokeWidth="1"
        />
      );
    }
    for (let j = -maxY; j <= maxY; j++) {
      const y = cy + j * scalePx;
      lines.push(
        <line
          key={`h${j}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#1a2753"
          strokeWidth="1"
        />
      );
    }
    return lines;
  }, [width, height, scalePx, cx, cy]);

  const Arrow = ({
    from = { x: cx, y: cy },
    to,
    color = "#6aa9ff",
    dashed = false,
    label,
  }) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    const ux = len === 0 ? 0 : dx / len;
    const uy = len === 0 ? 0 : dy / len;
    const head = 10;
    const backX = to.x - ux * head;
    const backY = to.y - uy * head;

    return (
      <>
        <line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth="3"
          strokeDasharray={dashed ? "8 6" : "0"}
        />
        {/* pointe de flèche */}
        <polygon
          points={`${to.x},${to.y} ${backX - uy * 4},${backY + ux * 4} ${
            backX + uy * 4
          },${backY - ux * 4}`}
          fill={color}
        />
        {label && (
          <text
            x={to.x + 8}
            y={to.y - 8}
            fontSize="12"
            fill="#eaf2ff"
            style={{ userSelect: "none" }}
          >
            {label}
          </text>
        )}
      </>
    );
  };

  return (
    <div className="panel" style={{ overflow: "hidden" }}>
      <h2>Plan vectoriel interactif</h2>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Plan vectoriel"
      >
        {/* Grille */}
        <rect x="0" y="0" width={width} height={height} fill="#0a1024" />
        {gridLines}

        {/* Axes avec flèches */}
        <line
          x1={0}
          y1={cy}
          x2={width}
          y2={cy}
          stroke="#3852a8"
          strokeWidth="2"
        />
        <polygon
          points={`${width},${cy} ${width - 12},${cy - 6} ${width - 12},${
            cy + 6
          }`}
          fill="#3852a8"
        />

        <line
          x1={cx}
          y1={0}
          x2={cx}
          y2={height}
          stroke="#3852a8"
          strokeWidth="2"
        />
        <polygon points={`${cx},0 ${cx - 6},12 ${cx + 6},12`} fill="#3852a8" />

        {/* Labels des axes */}
        <text x={width - 20} y={cy - 10} fontSize="14" fill="#cfe0ff">
          x
        </text>
        <text x={cx + 10} y={16} fontSize="14" fill="#cfe0ff">
          y
        </text>
        <text x={cx + 6} y={cy + 14} fontSize="12" fill="#cfe0ff">
          O
        </text>

        {/* Graduations + numérotation X */}
        {[...Array(Math.floor(width / scalePx))].map((_, i) => {
          const val = i - Math.floor(width / (2 * scalePx));
          if (val === 0) return null;
          const pos = cx + val * scalePx;
          return (
            <g key={`gx${i}`}>
              <line
                x1={pos}
                y1={cy - 4}
                x2={pos}
                y2={cy + 4}
                stroke="#cfe0ff"
              />
              <text
                x={pos}
                y={cy + 18}
                fontSize="12"
                fill="#cfe0ff"
                textAnchor="middle"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Graduations + numérotation Y */}
        {[...Array(Math.floor(height / scalePx))].map((_, j) => {
          const val = j - Math.floor(height / (2 * scalePx));
          if (val === 0) return null;
          const pos = cy - val * scalePx;
          return (
            <g key={`gy${j}`}>
              <line
                x1={cx - 4}
                y1={pos}
                x2={cx + 4}
                y2={pos}
                stroke="#cfe0ff"
              />
              <text
                x={cx - 14}
                y={pos + 4}
                fontSize="12"
                fill="#cfe0ff"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Vecteurs principaux */}
        <Arrow to={Aend} color="#6aa9ff" label="A" />
        <Arrow to={Bend} color="#88e0c1" label="B" />

        {/* Vecteurs dérivés */}
        {showSum && (
          <Arrow
            to={toScreen(Sum)}
            color="#7ad6ff"
            dashed={false}
            label="A + B"
          />
        )}
        {showDiff && (
          <Arrow
            to={toScreen(Diff)}
            color="#ffa8a8"
            dashed={false}
            label="A − B"
          />
        )}
        {showK && (
          <Arrow
            to={toScreen(K)}
            color="#ffd27a"
            dashed={true}
            label={`k·A (${k})`}
          />
        )}
        {showProj && (
          <Arrow
            to={toScreen(Proj)}
            color="#caa7ff"
            dashed={true}
            label="proj_B(A)"
          />
        )}
      </svg>
      <div className="badge">Échelle: 1 unité = {scalePx}px</div>
    </div>
  );
}
