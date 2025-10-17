import React, { useMemo, useState, useRef } from "react";
import ComplexInput from "./components/ComplexInput.jsx";
import ComplexPlane from "./components/ComplexPlane.jsx";
import InfoModal from "./components/InfoModal.jsx";
import { add, mul, mod, arg } from "./utils/complex.js";

export default function App() {
  const [z1, setZ1] = useState({ re: 2, im: 1 });
  const [z2, setZ2] = useState({ re: 1, im: 2 });
  const [op, setOp] = useState("none");
  const [scale, setScale] = useState(50);
  const [showInfo, setShowInfo] = useState(false);

  // --- État du son ---
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  // Explication vocale (mode d’emploi)
  const voiceText = `
    Bienvenue dans la simulation des nombres complexes.
    Vous pouvez saisir deux nombres complexes z1 et z2,
    les représenter dans le plan d’Argand,
    et effectuer des opérations comme l’addition ou la multiplication.
    Rappelez-vous : un nombre complexe est de la forme a + bi,
    où a est la partie réelle et b la partie imaginaire.
    Expérimentez en changeant les valeurs et observez les résultats.
  `;

  const toggleSpeech = () => {
    if (!speaking) {
      // Crée une nouvelle instance
      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.lang = "fr-FR";
      utterance.rate = 1; // vitesse normale
      utterance.pitch = 1;

      utterance.onend = () => setSpeaking(false);

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
      setSpeaking(true);
    } else {
      // Stopper la lecture
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const result = useMemo(() => {
    if (op === "add") return add(z1, z2);
    if (op === "mul") return mul(z1, z2);
    return null;
  }, [z1, z2, op]);

  const points = useMemo(() => {
    const pts = [
      { ...z1, color: "#3b82f6", label: `z₁ = ${z1.re} + ${z1.im}i` },
      { ...z2, color: "#f97316", label: `z₂ = ${z2.re} + ${z2.im}i` },
    ];
    if (result) {
      const label = op === "add" ? "z₁ + z₂" : "z₁ × z₂";
      pts.push({ ...result, color: "#10b981", label: `${label}` });
    }
    return pts;
  }, [z1, z2, result, op]);

  const describe = (z) =>
    `|z| = ${mod(z).toFixed(3)}  ·  arg(z) = ${(arg(z) * 180 / Math.PI).toFixed(1)}°`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-5 bg-white border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Simulation — Nombres complexes</h1>
          <p className="text-gray-600">
            Représentation dans le plan d’Argand + opérations
          </p>
        </div>

        <div className="flex gap-2">
          {/* Bouton Info */}
          <button
            onClick={() => setShowInfo(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            ℹ️ Info
          </button>

          {/* Bouton Son */}
          <button
            onClick={toggleSpeech}
            className={`px-4 py-2 rounded-xl shadow ${
              speaking ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {speaking ? "🔇 Stop" : "🔊 Audio"}
          </button>
        </div>
      </header>

      <main className="p-5 grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Panneau de contrôle */}
        <section className="bg-white rounded-2xl shadow p-4 space-y-6">
          <div className="space-y-2">
            <h2 className="font-semibold">Entrée</h2>
            <ComplexInput label="z₁" value={z1} onChange={setZ1} />
            <div className="text-sm text-gray-600">{describe(z1)}</div>
          </div>

          <div className="space-y-2">
            <ComplexInput label="z₂" value={z2} onChange={setZ2} />
            <div className="text-sm text-gray-600">{describe(z2)}</div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Opération</h2>
            <div className="flex gap-2">
              <select
                className="border rounded-xl px-3 py-2"
                value={op}
                onChange={(e) => setOp(e.target.value)}
              >
                <option value="none">Aucune</option>
                <option value="add">Addition (z₁ + z₂)</option>
                <option value="mul">Multiplication (z₁ × z₂)</option>
              </select>
              <button
                className="px-3 py-2 rounded-xl border"
                onClick={() => setOp("none")}
                title="Réinitialiser l'opération"
              >
                Réinitialiser
              </button>
            </div>
            {result && (
              <div className="text-sm">
                <div className="font-medium">
                  Résultat : {op === "add" ? "z₁ + z₂" : "z₁ × z₂"} ={" "}
                  {result.re.toFixed(2)} + {result.im.toFixed(2)}i
                </div>
                <div className="text-gray-600">{describe(result)}</div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Échelle (zoom)</h2>
            <input
              type="range"
              min="25"
              max="100"
              step="5"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600">1 unité = {scale}px</div>
          </div>

          <div className="text-xs text-gray-500">
            Astuce : multiplier par <b>i</b> fait tourner de 90° (ex. z × i).
          </div>
        </section>

        {/* Plan complexe */}
        <section className="bg-white rounded-2xl shadow p-4">
          <ComplexPlane points={points} scale={scale} />
        </section>
      </main>

      {/* Modal Info */}
      {showInfo && (
        <InfoModal open={showInfo} onClose={() => setShowInfo(false)} />
      )}
    </div>
  );
}
