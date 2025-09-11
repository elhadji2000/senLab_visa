/* eslint-disable no-unused-vars */
// App.jsx
import React, { useState, useEffect } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { create, all } from "mathjs";
import "./App.css";

// ⚙️ mathjs avec support de ln(x)
const math = create(all);
math.import({
  ln: (x) => math.log(x),
});

export default function App() {
  const [funcInput, setFuncInput] = useState("(x^2 - 4)/(x - 2)");
  const [approachPoint, setApproachPoint] = useState(2);
  const [x, setX] = useState(2);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const predefinedLimits = [
    { label: "lim (1/x) quand x→∞", func: "1/x", point: Infinity },
    { label: "lim (x/(x+1)) quand x→∞", func: "x/(x+1)", point: Infinity },
    { label: "lim (x^2/(x^2+1)) quand x→∞", func: "x^2/(x^2+1)", point: Infinity },
    { label: "lim (sin(x)/x) quand x→∞", func: "sin(x)/x", point: Infinity },
    { label: "lim (sin(x)/x) quand x→0", func: "sin(x)/x", point: 0 },
  ];

  // calcule f(x)
  const f = (x) => {
    try {
      return math.evaluate(funcInput, { x });
    } catch (err) {
      return NaN;
    }
  };

  // changement limite prédéfinie
  const handlePredefinedChange = (e) => {
    const choice = predefinedLimits[e.target.value];
    if (choice) {
      setFuncInput(choice.func);
      setApproachPoint(choice.point === Infinity ? 50 : choice.point);
    }
  };

  // synchroniser x avec approachPoint automatiquement
  useEffect(() => {
    if (approachPoint === 50) {
      setX(50); // simule l'infini
    } else {
      setX(approachPoint); // exactement le point a
    }
  }, [approachPoint]);

  const explanation = `
    Une limite, c’est comme observer vers quelle valeur une fonction se rapproche,
    quand x s’approche d’un certain nombre ou devient très grand.
    Par exemple, quand on dit que x tend vers l’infini,
    cela veut dire que x devient de plus en plus grand sans fin.
    Mais, dans notre simulation, comme l’ordinateur ne peut pas vraiment calculer l’infini,
    on remplace l’infini par un grand nombre, ici 50, pour montrer la tendance.
    Cela permet de voir concrètement ce que la fonction fait.
  `;

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(explanation);
      utterance.lang = "fr-FR";
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="app">
      <h1>🌟 Simulation : Comprendre les Limites</h1>

      <button className="voice-btn" onClick={toggleSpeech}>
        {isSpeaking ? "⏹️ Arrêter la voix" : "🔊 Expliquer avec la voix"}
      </button>

      <h2>📘 Introduction simple</h2>
      <p>
        Une <b>limite</b> décrit la <b>tendance</b> d’une fonction quand{" "}
        <InlineMath math="x" /> s’approche d’une valeur, ou quand{" "}
        <InlineMath math="x" /> devient très grand.
      </p>
      <p>
        Exemple : si tu marches vers un mur, même sans toucher le mur, on peut
        dire que ta distance <InlineMath math="d(x)" /> tend vers 0.
      </p>

      <h3>🔹 Important</h3>
      <p>
        Quand on écrit <InlineMath math="x \to \infty" />, cela veut dire que{" "}
        <InlineMath math="x" /> devient très grand. Mais comme l’ordinateur ne
        peut pas manipuler l’infini,
        <b> dans cette simulation on prend “∞” ≈ 50</b>. C’est une approximation,
        mais elle nous aide à comprendre la tendance.
      </p>

      <h2>🎛️ Panneau de contrôle</h2>
      <div className="control-panel">
        <label>
          Choisir une limite prédéfinie :
          <select onChange={handlePredefinedChange} defaultValue="">
            <option value="">-- Choisir --</option>
            {predefinedLimits.map((lim, index) => (
              <option key={index} value={index}>
                {lim.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fonction f(x) :
          <input
            type="text"
            value={funcInput}
            onChange={(e) => setFuncInput(e.target.value)}
            placeholder="ex: (x^2 - 1)/(x - 1) ou ln(x)"
          />
        </label>

        <label>
          Point d’approche (a) :
          <input
            type="number"
            value={approachPoint}
            onChange={(e) => setApproachPoint(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <h2>🧮 Limite étudiée</h2>
      <BlockMath
        math={`\\lim_{x \\to ${
          approachPoint === 50 ? "\\infty" : approachPoint
        }} ${funcInput}`}
      />

      <p>
        Alors :{" "}
        <InlineMath
          math={`f(${x.toFixed(3)}) = ${isNaN(f(x)) ? "❌" : f(x).toFixed(4)}`}
        />
      </p>

      <h2>📖 Concepts clés</h2>
      <ul>
        <li>
          La limite décrit la valeur que <InlineMath math="f(x)" /> approche
          quand <InlineMath math="x" /> s’approche d’un nombre donné.
        </li>
        <li>
          Si <InlineMath math="x" /> devient énorme, on parle de{" "}
          <b>limite à l’infini</b>.
        </li>
        <li>
          Certaines limites donnent des <b>formes indéterminées</b> comme{" "}
          <InlineMath math="\frac{0}{0}" /> ou{" "}
          <InlineMath math="\frac{\infty}{\infty}" />, qu’il faut simplifier.
        </li>
      </ul>
    </div>
  );
}
