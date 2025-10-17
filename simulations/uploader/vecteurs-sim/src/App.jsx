import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import VectorCanvas from "./components/VectorCanvas";
import VectorControls from "./components/VectorControls";
import VectorInfo from "./components/VectorInfo";
import VectorChatbot from "./components/VectorChatbot";

export default function App() {
  const [A, setA] = useState({ x: 3, y: 2 });
  const [B, setB] = useState({ x: -2, y: 1 });
  const [k, setK] = useState(1.5);

  const [showSum, setShowSum] = useState(true);
  const [showDiff, setShowDiff] = useState(true);
  const [showProj, setShowProj] = useState(true);
  const [showK, setShowK] = useState(true);

  // 🔊 gestion de la voix
  const [isSpeaking, setIsSpeaking] = useState(true);
  const utteranceRef = useRef(null);

  const lessonText = `
    Bienvenue dans la simulation de calcul vectoriel.
    Ici, vous pouvez explorer les vecteurs A et B, 
    calculer leur somme, leur différence, 
    ainsi que la projection de A sur B.
    La flèche bleu représente un vecteur dans le plan orthonormé.
    Vous pouvez modifier les coordonnées, tester des valeurs aléatoires,
    et observer les résultats graphiques et numériques.
    magui sante yalla bou bax di sante serigne touba .
  `;

  useEffect(() => {
    if (isSpeaking) {
      utteranceRef.current = new SpeechSynthesisUtterance(lessonText);
      utteranceRef.current.lang = "fr-FR";
      window.speechSynthesis.speak(utteranceRef.current);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [isSpeaking]);

  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const handleRandomize = () => {
    setA({ x: randomInt(-5, 5), y: randomInt(-5, 5) });
    setB({ x: randomInt(-5, 5), y: randomInt(-5, 5) });
    setK(parseFloat((Math.random() * 10 - 5).toFixed(1)));
  };

  const handleReset = () => {
    setA({ x: 3, y: 2 });
    setB({ x: -2, y: 1 });
    setK(1.5);
    setShowSum(true);
    setShowDiff(true);
    setShowProj(true);
    setShowK(true);
  };

  return (
    <div className="app">
      <div className="layout">
        <VectorCanvas
          width={840}
          height={520}
          scalePx={32}
          A={A}
          B={B}
          k={k}
          showSum={showSum}
          showDiff={showDiff}
          showProj={showProj}
          showK={showK}
        />

        <div>
          {/* 🎤 Bouton ON/OFF voix */}
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-800"
          >
            {isSpeaking ? "🔇 Couper la voix" : "🔊 Activer la voix"}
          </button>
          <VectorControls
            A={A}
            B={B}
            k={k}
            setA={setA}
            setB={setB}
            setK={setK}
            showSum={showSum}
            setShowSum={setShowSum}
            showDiff={showDiff}
            setShowDiff={setShowDiff}
            showProj={showProj}
            setShowProj={setShowProj}
            showK={showK}
            setShowK={setShowK}
            onRandomize={handleRandomize}
            onReset={handleReset}
          />

          <VectorInfo A={A} B={B} />

          <VectorChatbot />

          
        </div>
      </div>
    </div>
  );
}
