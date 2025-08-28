// PythagoreSimulation.jsx
import React, { useState } from "react";
import PythagoreIntro from "./PythagoreIntro";

export default function PythagoreSimulation() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [openIntro, setOpenIntro] = useState(false);

  const scalePxPerCm = 30;
  const A = { x: 50, y: 300 };
  const B = { x: A.x + a * scalePxPerCm, y: A.y };
  const C = { x: A.x, y: A.y - b * scalePxPerCm };
  const c = Math.sqrt(a * a + b * b);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Théorème de Pythagore - Démonstration interactive
        </h1>
        <button
          onClick={() => setOpenIntro(true)}
          className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Introduction
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panneau de contrôle */}
        <div className="lg:w-2/5 bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Paramètres</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Côté adjacent (a) : {a.toFixed(1)} cm
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.1"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Côté opposé (b) : {b.toFixed(1)} cm
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.1"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Résultats */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Mesures calculées</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Côté a</p>
                <p className="text-lg font-semibold">{a.toFixed(1)} cm</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Côté b</p>
                <p className="text-lg font-semibold">{b.toFixed(1)} cm</p>
              </div>
              
              <div className="p-3 bg-blue-50 rounded col-span-2">
                <p className="text-sm text-blue-600">Hypoténuse c</p>
                <p className="text-lg font-semibold text-blue-700">{c.toFixed(2)} cm</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded">
              <p className="text-sm text-green-700">Vérification du théorème</p>
              <p className="font-medium">a² + b² = {a.toFixed(1)}² + {b.toFixed(1)}² = {(a*a).toFixed(2)} + {(b*b).toFixed(2)} = {(a*a + b*b).toFixed(2)}</p>
              <p className="font-medium">c² = {c.toFixed(2)}² = {(c*c).toFixed(2)}</p>
              <p className="mt-1 text-green-700 font-semibold">
                a² + b² ≈ c² → {(a*a + b*b).toFixed(2)} ≈ {(c*c).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Représentation visuelle */}
        <div className="lg:w-3/5 flex flex-col items-center">
          <div className="w-full bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Représentation géométrique</h2>
            
            <div className="flex justify-center">
              <svg width="400" height="350" className="border rounded-xl bg-white">
                {/* Triangle */}
                <polygon
                  points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
                  fill="#E1F5FE"
                  stroke="#0288D1"
                  strokeWidth="2"
                />
                
                {/* Points */}
                {[A, B, C].map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="5" fill="#D32F2F" />
                ))}
                
                {/* Labels des points */}
                <text x={A.x-15} y={A.y+5} fontSize="14" fontWeight="bold">A</text>
                <text x={B.x+5} y={B.y+5} fontSize="14" fontWeight="bold">B</text>
                <text x={C.x-15} y={C.y-10} fontSize="14" fontWeight="bold">C</text>

                {/* Labels des côtés */}
                <text x={(A.x+B.x)/2-10} y={A.y+20} fontSize="12" fill="#1976D2" fontWeight="500">{a.toFixed(1)} cm</text>
                <text x={A.x-30} y={(A.y+C.y)/2} fontSize="12" fill="#1976D2" fontWeight="500">{b.toFixed(1)} cm</text>
                <text x={(B.x+C.x)/2+5} y={(B.y+C.y)/2} fontSize="12" fill="#388E3C" fontWeight="500">{c.toFixed(2)} cm</text>
                
                {/* Angle droit */}
                <path d={`M ${A.x+10},${A.y-10} L ${A.x+10},${A.y} L ${A.x},${A.y-10} Z`} fill="#D32F2F" />
              </svg>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              Échelle: 1 cm = {scalePxPerCm} px • Les côtés a et b forment un angle droit (90°)
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'introduction */}
      <PythagoreIntro open={openIntro} onClose={() => setOpenIntro(false)} />
    </div>
  );
}