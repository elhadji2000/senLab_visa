import React, { useState } from "react";

function App() {
  const [parts, setParts] = useState(0); // 0 = entier, sinon 2,3,4
  const [eaten, setEaten] = useState(0); // nb de parts mangées

  // Générer le nom de l'image selon l'état
  const getImageSrc = () => {
    if (parts === 0) {
      return "/images/pizza_whole.png"; // pizza entière
    } else {
      return `/images/pizza_${parts}_${eaten}.png`;
      // ex: pizza_4_0.png (4 parts, rien mangé)
      // ex: pizza_4_1.png (4 parts, 1 mangé)
    }
  };

  const handleCut = (n) => {
    setParts(n);
    setEaten(0);
  };

  const handleEat = () => {
    if (parts > 0 && eaten < parts) {
      setEaten(eaten + 1);
    }
  };

  // Calculer la fraction mangée et restante
  const fractionMangee = eaten / parts;
  const fractionRestante = (parts - eaten) / parts;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #e2e8f0 100%)",
        padding: 20,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Zone Canvas (à gauche) */}
      <div
        style={{
          flex: 2,
          display: "flex",
          maxHeight: "100vh",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #e2e8f0",
          borderRadius: 12,
          background: "white",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          padding: 20,
        }}
      >
        <h2 style={{ color: "#1e293b", marginBottom: 10 }}>Visualisation des Fractions 🍕</h2>
        
        <div style={{
          width: '100%',
          maxWidth: 400,
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20
        }}>
          <img
            src={getImageSrc()}
            alt="Pizza"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
        
        {/* Explications contextuelles */}
        <div style={{
          background: "#f1f5f9",
          padding: 15,
          borderRadius: 8,
          marginTop: 10,
          width: '100%',
          maxWidth: 400
        }}>
          <h3 style={{ color: "#334155", marginTop: 0 }}>💡 Le savais-tu ?</h3>
          {parts === 0 ? (
            <p>Une pizza entière représente l'unité complète (1/1). Quand on la partage, on la divise en fractions égales.</p>
          ) : eaten === 0 ? (
            <p>Cette pizza est divisée en {parts} parts égales. Chaque part représente 1/{parts} de la pizza totale.</p>
          ) : eaten === parts ? (
            <p>Tu as mangé toutes les parts ! La fraction mangée est {parts}/{parts}, ce qui équivaut à 1 (l'unité entière).</p>
          ) : (
            <p>Tu as mangé {eaten} part{eaten > 1 ? 's' : ''} sur {parts}. 
               Cela représente {eaten}/{parts} de la pizza. Il reste {parts - eaten} part{parts - eaten > 1 ? 's' : ''}.</p>
          )}
        </div>
      </div>

      {/* Zone Contrôles et Théorie (à droite) */}
      <div
        style={{
          flex: 1,
          marginLeft: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <h2 style={{ color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: 10 }}>Contrôles 🎮</h2>
        
        <div style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
        }}>
          <p style={{ color: "#475569", fontWeight: "bold" }}>
            Choisis en combien de parts tu veux partager la pizza :
          </p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: 15 }}>
            <button 
              onClick={() => handleCut(2)}
              style={{
                padding: "10px 15px",
                borderRadius: 8,
                border: "none",
                background: parts === 2 ? "#3b82f6" : "#e2e8f0",
                color: parts === 2 ? "white" : "#1e293b",
                cursor: "pointer",
                flex: 1,
                transition: "all 0.2s"
              }}
            >
              Découper en 2
            </button>
            <button 
              onClick={() => handleCut(3)}
              style={{
                padding: "10px 15px",
                borderRadius: 8,
                border: "none",
                background: parts === 3 ? "#3b82f6" : "#e2e8f0",
                color: parts === 3 ? "white" : "#1e293b",
                cursor: "pointer",
                flex: 1,
                transition: "all 0.2s"
              }}
            >
              Découper en 3
            </button>
            <button 
              onClick={() => handleCut(4)}
              style={{
                padding: "10px 15px",
                borderRadius: 8,
                border: "none",
                background: parts === 4 ? "#3b82f6" : "#e2e8f0",
                color: parts === 4 ? "white" : "#1e293b",
                cursor: "pointer",
                flex: 1,
                transition: "all 0.2s"
              }}
            >
              Découper en 4
            </button>
          </div>
          
          <button
            onClick={handleEat}
            disabled={parts === 0 || eaten >= parts}
            style={{
              width: "100%",
              marginTop: "1rem",
              background: parts === 0 || eaten >= parts ? "#94a3b8" : "#ef4444",
              color: "white",
              padding: "0.75rem",
              borderRadius: 8,
              border: "none",
              cursor: parts === 0 || eaten >= parts ? "not-allowed" : "pointer",
              fontSize: "1rem",
              transition: "all 0.2s"
            }}
          >
            {parts === 0 ? "Découpe d'abord la pizza!" : 
             eaten >= parts ? "Plus de parts à manger!" : 
             "Manger une part 😋"}
          </button>
          
          {parts > 0 && (
            <div style={{ marginTop: "1rem", padding: "15px", background: "#f8fafc", borderRadius: 8 }}>
              <p style={{ color: "#0f172a", fontWeight: "bold" }}>Fractions :</p>
              <p>Mangée : <span style={{ color: "#ef4444" }}>{eaten}/{parts}</span></p>
              <p>Restante : <span style={{ color: "#10b981" }}>{parts - eaten}/{parts}</span></p>
              
              {/* Représentation visuelle des fractions */}
              <div style={{ display: "flex", marginTop: 10, height: 20 }}>
                <div style={{
                  width: `${fractionMangee * 100}%`,
                  background: "#ef4444",
                  borderRadius: "4px 0 0 4px"
                }}></div>
                <div style={{
                  width: `${fractionRestante * 100}%`,
                  background: "#10b981",
                  borderRadius: "0 4px 4px 0"
                }}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Section éducative */}
        <div style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          marginTop: 20
        }}>
          <h2 style={{ color: "#1e293b" }}>📚 Comprendre les Fractions</h2>
          
          <h3 style={{ color: "#475569" }}>C'est quoi une fraction ?</h3>
          <p>Une fraction représente une partie d'un tout. Elle est composée de deux nombres :</p>
          <ul>
            <li>Le <strong>numérateur</strong> (en haut) : indique combien de parts on prend</li>
            <li>Le <strong>dénominateur</strong> (en bas) : indique en combien de parts égales on a divisé le tout</li>
          </ul>
          
          <h3 style={{ color: "#475569" }}>Exemple avec la pizza</h3>
          <p>Si tu découpes une pizza en 4 parts égales et que tu manges 1 part :</p>
          <ul>
            <li>Tu as mangé <strong>1/4</strong> de la pizza</li>
            <li>Il reste <strong>3/4</strong> de la pizza</li>
          </ul>
          
          <h3 style={{ color: "#475569" }}>À quoi servent les fractions ?</h3>
          <p>Les fractions sont partout dans la vie quotidienne :</p>
          <ul>
            <li>Partager une pizza ou un gâteau</li>
            <li>Mesurer des ingrédients en cuisine (½ litre de lait)</li>
            <li>Calculer des distances (¾ de kilomètre)</li>
            <li>Exprimer des pourcentages (¼ = 25%)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;