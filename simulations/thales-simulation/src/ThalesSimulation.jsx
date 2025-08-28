// ThalesSimulation.jsx
import React, { useState } from "react";
import IntroThales from "./IntroThales";

export default function ThalesSimulation() {
  const [k, setK] = useState(0.5);
  const [openIntro, setOpenIntro] = useState(false);

  const scalePxPerCm = 10;
  const A = { x: 100, y: 50 };
  const B = { x: 50,  y: 300 };
  const C = { x: 300, y: 300 };
  const D = { x: A.x + (B.x - A.x) * k, y: A.y + (B.y - A.y) * k };
  const E = { x: A.x + (C.x - A.x) * k, y: A.y + (C.y - A.y) * k };

  const AB_px = Math.hypot(B.x - A.x, B.y - A.y);
  const AD_px = Math.hypot(D.x - A.x, D.y - A.y);
  const AC_px = Math.hypot(C.x - A.x, C.y - A.y);
  const AE_px = Math.hypot(E.x - A.x, E.y - A.y);
  const DE_px = Math.hypot(E.x - D.x, E.y - D.y);
  const BC_px = Math.hypot(C.x - B.x, C.y - B.y);

  const AB = AB_px / scalePxPerCm;
  const AD = AD_px / scalePxPerCm;
  const AC = AC_px / scalePxPerCm;
  const AE = AE_px / scalePxPerCm;
  const DE = DE_px / scalePxPerCm;
  const BC = BC_px / scalePxPerCm;

  const ratioAD_AB = AD / AB;
  const ratioAE_AC = AE / AC;
  const ratioDE_BC = DE / BC;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Théorème de Thalès - Démonstration interactive
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Visualisation des rapports de proportionnalité dans une configuration triangulaire
          </p>
        </div>
        <button
          onClick={() => setOpenIntro(true)}
          className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Explications détaillées
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panneau de contrôle */}
        <div className="lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres de configuration</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position de la droite (DE) : {k.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.01"
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Près de A</span>
                <span>Près de BC</span>
              </div>
            </div>
          </div>

          {/* Mesures */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Mesures des segments (cm)</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Segment AB</p>
                <p className="text-lg font-semibold">{AB.toFixed(1)} cm</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Segment AD</p>
                <p className="text-lg font-semibold">{AD.toFixed(1)} cm</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Segment AC</p>
                <p className="text-lg font-semibold">{AC.toFixed(1)} cm</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Segment AE</p>
                <p className="text-lg font-semibold">{AE.toFixed(1)} cm</p>
              </div>
            </div>
          </div>

          {/* Rapports */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow">
            <h3 className="font-semibold text-lg text-blue-800 mb-3">Calcul des rapports</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">AD / AB</span>
                <span className="font-semibold">{ratioAD_AB.toFixed(3)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">AE / AC</span>
                <span className="font-semibold">{ratioAE_AC.toFixed(3)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">DE / BC</span>
                <span className="font-semibold">{ratioDE_BC.toFixed(3)}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
              <p className="text-green-700 font-semibold text-center">
                AD/AB = AE/AC = DE/BC = {ratioAD_AB.toFixed(3)}
              </p>
              <p className="text-sm text-green-600 mt-1 text-center">
                Le théorème de Thalès est vérifié
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Échelle: 10 px = 1 cm • Les droites (DE) et (BC) sont parallèles
          </div>
        </div>

        {/* Représentation visuelle */}
        <div className="lg:w-3/5 flex flex-col items-center">
          <div className="w-full bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Configuration géométrique</h2>
            
            <div className="flex justify-center">
              <svg width="460" height="380" className="border rounded-xl bg-white">
                {/* Triangle ABC */}
                <polygon
                  points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
                  fill="#F3F4F6"
                  stroke="#4B5563"
                  strokeWidth="2"
                />

                {/* Segment BC (base) */}
                <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#4B5563" strokeWidth="3" />

                {/* Parallèle DE */}
                <line x1={D.x} y1={D.y} x2={E.x} y2={E.y} stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5" />

                {/* Points */}
                {[A, B, C].map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="6" fill="#1D4ED8" />
                ))}
                
                {[D, E].map((p, i) => (
                  <circle key={i+3} cx={p.x} cy={p.y} r="6" fill="#DC2626" />
                ))}

                {/* Labels des points */}
                <text x={A.x - 15} y={A.y - 8} fontSize="14" fontWeight="bold" fill="#1D4ED8">A</text>
                <text x={B.x - 18} y={B.y + 18} fontSize="14" fontWeight="bold" fill="#1D4ED8">B</text>
                <text x={C.x + 8}  y={C.y + 18} fontSize="14" fontWeight="bold" fill="#1D4ED8">C</text>
                <text x={D.x - 18} y={D.y - 10} fontSize="14" fontWeight="bold" fill="#DC2626">D</text>
                <text x={E.x + 8}  y={E.y - 10} fontSize="14" fontWeight="bold" fill="#DC2626">E</text>

                {/* Mesures sur les segments */}
                <text x={(A.x + B.x) / 2 - 20} y={(A.y + B.y) / 2 - 10} fontSize="12" fill="#1D4ED8" fontWeight="500">
                  AB = {AB.toFixed(1)} cm
                </text>
                <text x={(A.x + D.x) / 2 - 20} y={(A.y + D.y) / 2 - 8} fontSize="12" fill="#DC2626" fontWeight="500">
                  AD = {AD.toFixed(1)} cm
                </text>
                <text x={(A.x + C.x) / 2 + 10} y={(A.y + C.y) / 2 - 8} fontSize="12" fill="#1D4ED8" fontWeight="500">
                  AC = {AC.toFixed(1)} cm
                </text>
                <text x={(A.x + E.x) / 2 + 10} y={(A.y + E.y) / 2 - 8} fontSize="12" fill="#DC2626" fontWeight="500">
                  AE = {AE.toFixed(1)} cm
                </text>
                <text x={(D.x + E.x) / 2} y={(D.y + E.y) / 2 - 10} fontSize="12" fill="#DC2626" fontWeight="500">
                  DE = {DE.toFixed(1)} cm
                </text>
                <text x={(B.x + C.x) / 2} y={B.y + 20} fontSize="12" fill="#1D4ED8" fontWeight="500">
                  BC = {BC.toFixed(1)} cm
                </text>

                {/* Indication de parallélisme */}
                <g transform={`translate(${D.x - 15}, ${D.y - 15})`}>
                  <path d="M0,0 L10,5 L0,10 Z" fill="#DC2626" />
                </g>
                <g transform={`translate(${B.x - 15}, ${B.y - 15})`}>
                  <path d="M0,0 L10,5 L0,10 Z" fill="#1D4ED8" />
                </g>

                {/* Légende échelle */}
                <g transform="translate(20, 340)">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#4B5563" strokeWidth="2" />
                  <line x1="0" y1="-5" x2="0" y2="5" stroke="#4B5563" strokeWidth="2" />
                  <line x1="100" y1="-5" x2="100" y2="5" stroke="#4B5563" strokeWidth="2" />
                  <text x="0" y="-8" fontSize="10" fill="#4B5563">0 cm</text>
                  <text x="80" y="-8" fontSize="10" fill="#4B5563">10 cm</text>
                  <text x="20" y="18" fontSize="11" fill="#4B5563">Échelle : 10 px = 1 cm</text>
                </g>
              </svg>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              Configuration classique du théorème de Thalès avec (DE) ∥ (BC)
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'introduction */}
      <IntroThales open={openIntro} onClose={() => setOpenIntro(false)} />
    </div>
  );
}