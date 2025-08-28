import React, { useMemo, useRef, useState } from "react";
import Tutoriel from "./Tutoriel";

/**
 * TransformationsGeometriques — simulation interactive
 * - Plan orthonormé gradué (SVG)
 * - Choix de la figure (triangle, rectangle)
 * - Déplacement (drag & drop)
 * - Translation (dx, dy)
 * - Symétries : Ox, Oy, centrale (O), diagonale (y = x)
 * - Rotations : 90°, 180°, 270° autour de O
 *
 * Intégration :
 *   export default function App() { return <TransformationsGeometriques /> }
 */

export default function TransformationsGeometriques() {
  // --- Paramètres du plan ---
  const width = 900;
  const height = 600;
  const unit = 40; // pixels par unité
  const origin = useMemo(
    () => ({ x: Math.floor(width / 2), y: Math.floor(height / 2) }),
    [width, height]
  );
  const minX = useMemo(() => -Math.floor(origin.x / unit), [origin.x, unit]);
  const maxX = useMemo(
    () => Math.floor((width - origin.x) / unit),
    [origin.x, unit, width]
  );
  const minY = useMemo(
    () => -Math.floor((height - origin.y) / unit),
    [origin.y, unit, height]
  );
  const maxY = useMemo(() => Math.floor(origin.y / unit), [origin.y, unit]);

  // --- Figures de base ---
  const figures = useMemo(
    () => ({
      triangle: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
        { x: 0, y: 2 },
      ],
      rectangle: [
        { x: -2, y: -1 },
        { x: 2, y: -1 },
        { x: 2, y: 1 },
        { x: -2, y: 1 },
      ],
      pentagone: [
        { x: 0, y: 2 },
        { x: 2, y: 0.7 },
        { x: 1.2, y: -1.6 },
        { x: -1.2, y: -1.6 },
        { x: -2, y: 0.7 },
      ],
    }),
    []
  );

  const [shapeName, setShapeName] = useState("triangle");
  const [shape, setShape] = useState(figures.triangle);
  const [ghost, setGhost] = useState(null); // ancienne figure (pré-image)

  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(1);

  const [snap, setSnap] = useState(true); // arrondi à la graduation

  // --- Drag state ---
  const svgRef = useRef(null);
  const dragRef = useRef({ dragging: false, start: null, startShape: null });

  // --- Helpers coordonnées ---
  const toScreen = (p) => ({
    x: origin.x + p.x * unit,
    y: origin.y - p.y * unit,
  });
  const fromClientToMath = (clientX, clientY) => {
    const rect = svgRef.current?.getBoundingClientRect();
    const x = (clientX - rect.left - origin.x) / unit;
    const y = (origin.y - (clientY - rect.top)) / unit;
    return { x, y };
  };

  // --- Outils géométriques ---
  const translate = (pts, tx, ty) =>
    pts.map((p) => ({ x: p.x + tx, y: p.y + ty }));
  const reflectOx = (pts) => pts.map((p) => ({ x: p.x, y: -p.y }));
  const reflectOy = (pts) => pts.map((p) => ({ x: -p.x, y: p.y }));
  const reflectOrigin = (pts) => pts.map((p) => ({ x: -p.x, y: -p.y }));
  const reflectDiag = (pts) => pts.map((p) => ({ x: p.y, y: p.x })); // y=x
  const rotate90 = (pts) => pts.map((p) => ({ x: -p.y, y: p.x }));
  const rotate180 = (pts) => pts.map((p) => ({ x: -p.x, y: -p.y }));
  const rotate270 = (pts) => pts.map((p) => ({ x: p.y, y: -p.x }));

  const applyAndGhost = (fn) => {
    setGhost(shape);
    setShape((prev) => (snap ? fn(prev).map(snapPoint) : fn(prev)));
  };

  const snapVal = (v) => (snap ? Math.round(v) : v);
  const snapPoint = (p) => ({ x: snapVal(p.x), y: snapVal(p.y) });

  const onMouseDownShape = (e) => {
    e.preventDefault();
    const m = fromClientToMath(e.clientX, e.clientY);
    dragRef.current = { dragging: true, start: m, startShape: shape };
  };

  const onMouseMove = (e) => {
    if (!dragRef.current.dragging) return;
    const m = fromClientToMath(e.clientX, e.clientY);
    const dxm = m.x - dragRef.current.start.x;
    const dym = m.y - dragRef.current.start.y;
    const moved = dragRef.current.startShape.map((p) => ({
      x: p.x + dxm,
      y: p.y + dym,
    }));
    setShape(snap ? moved.map(snapPoint) : moved);
  };

  const onMouseUp = () => {
    if (dragRef.current.dragging) {
      dragRef.current.dragging = false;
    }
  };

  const pathFromPoints = (pts) => {
    if (!pts || pts.length === 0) return "";
    const s = toScreen(pts[0]);
    let d = `M ${s.x} ${s.y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = toScreen(pts[i]);
      d += ` L ${p.x} ${p.y}`;
    }
    d += " Z"; // fermer
    return d;
  };

  const resetShape = () => {
    setGhost(null);
    setShape(figures[shapeName].map((p) => ({ ...p })));
  };

  const changeFigure = (name) => {
    setShapeName(name);
    setGhost(null);
    setShape(figures[name].map((p) => ({ ...p })));
  };

  // --- Rendu grille & axes ---
  const gridLines = [];
  for (let x = minX; x <= maxX; x++) {
    gridLines.push(
      <line
        key={`vx-${x}`}
        x1={origin.x + x * unit}
        y1={0}
        x2={origin.x + x * unit}
        y2={height}
        stroke="#e5e7eb"
        strokeWidth={x === 0 ? 2 : 1}
        opacity={x === 0 ? 1 : 0.8}
      />
    );
  }
  for (let y = minY; y <= maxY; y++) {
    gridLines.push(
      <line
        key={`hz-${y}`}
        x1={0}
        y1={origin.y - y * unit}
        x2={width}
        y2={origin.y - y * unit}
        stroke="#e5e7eb"
        strokeWidth={y === 0 ? 2 : 1}
        opacity={y === 0 ? 1 : 0.8}
      />
    );
  }

  const tickMarks = [];
  for (let x = minX; x <= maxX; x++) {
    if (x === 0) continue;
    const sx = origin.x + x * unit;
    tickMarks.push(
      <g key={`tx-${x}`}>
        <line
          x1={sx}
          y1={origin.y - 4}
          x2={sx}
          y2={origin.y + 4}
          stroke="#374151"
          strokeWidth={1}
        />
        <text x={sx + 2} y={origin.y + 14} fontSize="10" fill="#374151">
          {x}
        </text>
      </g>
    );
  }
  for (let y = minY; y <= maxY; y++) {
    if (y === 0) continue;
    const sy = origin.y - y * unit;
    tickMarks.push(
      <g key={`ty-${y}`}>
        <line
          x1={origin.x - 4}
          y1={sy}
          x2={origin.x + 4}
          y2={sy}
          stroke="#374151"
          strokeWidth={1}
        />
        <text x={origin.x + 6} y={sy - 2} fontSize="10" fill="#374151">
          {y}
        </text>
      </g>
    );
  }
  const [tutorialOpen, setTutorialOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <div className="max-w-6xl w-full px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">
          Transformations géométriques — plan orthonormé
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Déplace la figure à la souris (drag). Applique une translation, une
          symétrie ou une rotation autour de l'origine.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Panneau de contrôle */}
          <div className="col-span-1 bg-gray-50 rounded-2xl p-4 shadow-sm border">
            <button
              className="w-full rounded-xl border p-2 mb-4 hover:bg-gray-100 bg-blue-100 text-blue-700"
              onClick={() => setTutorialOpen(true)}
            >
              📘 Afficher le tutoriel
            </button>

            <h2 className="font-semibold mb-3">Contrôles</h2>

            <label className="block text-sm mb-1">Figure</label>
            <select
              className="w-full mb-3 rounded-xl border p-2"
              value={shapeName}
              onChange={(e) => changeFigure(e.target.value)}
            >
              <option value="triangle">Triangle</option>
              <option value="rectangle">Rectangle</option>
              <option value="pentagone">Pentagone</option>
            </select>

            <div className="flex items-center gap-2 mb-4">
              <input
                id="snap"
                type="checkbox"
                checked={snap}
                onChange={(e) => setSnap(e.target.checked)}
              />
              <label htmlFor="snap" className="text-sm">
                Accrocher à la grille
              </label>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Translation</h3>
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-600">dx</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border p-2"
                    value={dx}
                    onChange={(e) => setDx(Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600">dy</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border p-2"
                    value={dy}
                    onChange={(e) => setDy(Number(e.target.value))}
                  />
                </div>
              </div>
              <button
                className="w-full rounded-xl border p-2 hover:bg-gray-100"
                onClick={() => applyAndGhost((pts) => translate(pts, dx, dy))}
              >
                Appliquer la translation (dx, dy)
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Symétries</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(reflectOx)}
                >
                  Axiale (Ox)
                </button>
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(reflectOy)}
                >
                  Axiale (Oy)
                </button>
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(reflectOrigin)}
                >
                  Centrale (O)
                </button>
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(reflectDiag)}
                >
                  Diagonale (y = x)
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Rotations (autour de O)</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(rotate90)}
                >
                  90°
                </button>
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(rotate180)}
                >
                  180°
                </button>
                <button
                  className="rounded-xl border p-2 hover:bg-gray-100"
                  onClick={() => applyAndGhost(rotate270)}
                >
                  270°
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 rounded-xl border p-2 hover:bg-gray-100"
                onClick={resetShape}
              >
                Réinitialiser
              </button>
              <button
                className="flex-1 rounded-xl border p-2 hover:bg-gray-100"
                onClick={() => setGhost(shape)}
              >
                Mémoriser (fantôme)
              </button>
            </div>
          </div>

          {/* Zone de dessin */}
          <div className="col-span-1 lg:col-span-3 bg-white rounded-2xl p-2 shadow-sm border">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              className="rounded-xl select-none touch-none"
              style={{ background: "#ffffff" }}
            >
              {/* Grille */}
              <g>{gridLines}</g>

              {/* Axes */}
              <g>
                {/* Axe Ox */}
                <line
                  x1={0}
                  y1={origin.y}
                  x2={width}
                  y2={origin.y}
                  stroke="#111827"
                  strokeWidth={1.5}
                />
                {/* flèche x */}
                <polygon
                  points={`${width - 12},${origin.y - 4} ${width - 12},${
                    origin.y + 4
                  } ${width - 2},${origin.y}`}
                  fill="#111827"
                />
                <text
                  x={width - 18}
                  y={origin.y - 8}
                  fontSize="12"
                  fill="#111827"
                >
                  x
                </text>

                {/* Axe Oy */}
                <line
                  x1={origin.x}
                  y1={0}
                  x2={origin.x}
                  y2={height}
                  stroke="#111827"
                  strokeWidth={1.5}
                />
                {/* flèche y */}
                <polygon
                  points={`${origin.x - 4},12 ${origin.x + 4},12 ${origin.x},2`}
                  fill="#111827"
                />
                <text x={origin.x + 8} y={14} fontSize="12" fill="#111827">
                  y
                </text>
              </g>

              {/* Graduation chiffres */}
              <g>{tickMarks}</g>

              {/* Fantôme (ancienne figure) */}
              {ghost && (
                <path
                  d={pathFromPoints(ghost)}
                  fill="rgba(59,130,246,0.08)"
                  stroke="#93c5fd"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
              )}

              {/* Figure active */}
              <path
                d={pathFromPoints(shape)}
                fill="rgba(16,185,129,0.15)"
                stroke="#10b981"
                strokeWidth={3}
                onMouseDown={onMouseDownShape}
                style={{ cursor: "grab" }}
              />

              {/* Sommets */}
              {shape.map((p, idx) => {
                const s = toScreen(p);
                return (
                  <g key={`pt-${idx}`}>
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={5}
                      fill="#10b981"
                      onMouseDown={onMouseDownShape}
                    />
                    <text x={s.x + 6} y={s.y - 6} fontSize="11" fill="#065f46">
                      ({snapVal(p.x)}, {snapVal(p.y)})
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="text-xs text-gray-500 px-2 py-1">
              Astuce : active "Accrocher à la grille" pour garantir des
              coordonnées entières.
            </div>
          </div>
        </div>
      </div>
      <Tutoriel isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />;
    </div>
  );
}
