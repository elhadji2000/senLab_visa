import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const randomResult = () => (Math.random() < 0.5 ? "PILE" : "FACE");

function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "auto"
        }}
      >
        <h2 style={{ marginTop: 0 }}>Jeu de Probabilités : Pile ou Face</h2>
        
        <h3>Objectif pédagogique</h3>
        <p>Ce jeu permet de comprendre les concepts de base des probabilités :</p>
        <ul>
          <li>Probabilité théorique (50% pile, 50% face)</li>
          <li>Probabilité expérimentale (résultats observés)</li>
          <li>Loi des grands nombres (convergence vers la probabilité théorique)</li>
        </ul>
        
        <h3>Comment jouer</h3>
        <p>Les joueurs lancent la pièce à tour de rôle et observent les résultats.</p>
        <p>Comparez vos résultats avec la probabilité théorique de 50/50.</p>
        
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Commencer le jeu
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function TeachingAssistant({ currentPlayer, results, onExplainProbability }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Bonjour ! Je suis ton assistant pour comprendre les probabilités. Clique sur les questions ci-dessous pour en apprendre plus !",
      sender: "assistant"
    }
  ]);

  const commonQuestions = [
    "Qu'est-ce qu'une probabilité ?",
    "Pourquoi on a environ 50% de chance d'avoir pile ou face ?",
    "Comment calcule-t-on une probabilité ?",
    "Pourquoi mes résultats sont-ils différents de la théorie ?"
  ];

  const handleQuestionClick = (question) => {
    setMessages(prev => [...prev, { text: question, sender: "user" }]);
    
    let response = "";
    
    switch(question) {
      case "Qu'est-ce qu'une probabilité ?":
        response = "Une probabilité est une mesure du caractère probable d'un événement. Elle est comprise entre 0 (impossible) et 1 (certain). Pour un lancer de pièce, pile et face ont chacun une probabilité de 0.5 (soit 50%).";
        break;
      case "Pourquoi on a environ 50% de chance d'avoir pile ou face ?":
        response = "Une pièce de monnaie équilibrée a deux faces équiprobables. Si elle n'est pas truquée, chaque face a exactement les mêmes chances de sortir. C'est ce qu'on appelle l'équiprobabilité.";
        break;
      case "Comment calcule-t-on une probabilité ?":
        response = "On calcule une probabilité en divisant le nombre de cas favorables par le nombre de cas possibles. Pour une pièce : 1 cas favorable (pile) / 2 cas possibles (pile ou face) = 1/2 = 0.5 = 50%.";
        break;
      case "Pourquoi mes résultats sont-ils différents de la théorie ?":
        response = "Avec un petit nombre de lancers, les résultats peuvent s'écarter de la probabilité théorique. C'est ce qu'on appelle les fluctuations d'échantillonnage. Plus on fait de lancers, plus les résultats se rapprochent de la théorie (loi des grands nombres).";
        break;
      default:
        response = "Je ne comprends pas la question. Posez-moi une question sur les probabilités !";
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: "assistant" }]);
    }, 500);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "300px",
      zIndex: 100,
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      overflow: "hidden"
    }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "12px",
          background: "#4f46e5",
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div><strong>Assistant Probabilités</strong></div>
        <div>{isOpen ? "−" : "+"}</div>
      </div>
      
      {isOpen && (
        <div>
          <div style={{
            height: "200px",
            overflowY: "auto",
            padding: "12px",
            background: "#f9f9f9"
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "8px"
              }}>
                <div style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: msg.sender === "user" 
                    ? "12px 12px 0 12px" 
                    : "12px 12px 12px 0",
                  background: msg.sender === "user" ? "#4f46e5" : "#e5e7eb",
                  color: msg.sender === "user" ? "white" : "black"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ padding: "12px" }}>
            <div style={{ fontSize: "12px", marginBottom: "8px" }}>
              <strong>Questions courantes :</strong>
            </div>
            {commonQuestions.map((question, index) => (
              <div
                key={index}
                onClick={() => handleQuestionClick(question)}
                style={{
                  fontSize: "11px",
                  padding: "5px",
                  marginBottom: "4px",
                  background: "#f0f0f0",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                {question}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Coin3D({
  radius = 1,
  thickness = 0.16,
  headsUrl,
  tailsUrl,
  flippingTrigger = 0,
  onStop = () => {},
}) {
  const group = useRef();
  const [headsMap, tailsMap] = useTexture([headsUrl, tailsUrl]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(1.4);
  const [finalResult, setFinalResult] = useState("PILE");

  useEffect(() => {
    if (!group.current) return;
    const d = 1.2 + Math.random() * 0.8;
    setDuration(d);
    setFinalResult(randomResult());
    setStartTime(performance.now());
    setIsFlipping(true);
  }, [flippingTrigger]);

  useFrame(() => {
    if (!isFlipping || !group.current) return;
    const t = (performance.now() - startTime) / 1000;
    const progress = Math.min(t / duration, 1);
    const spins = 6 + Math.random() * 4;
    const eased = 1 - Math.pow(1 - progress, 3);
    const angle = eased * spins * Math.PI;
    const hop = Math.sin(progress * Math.PI) * 0.8;
    group.current.rotation.set(angle, 0, 0);
    group.current.position.set(0, hop, 0);

    if (progress >= 1) {
      const endAngle = finalResult === "PILE" ? 0 : Math.PI;
      group.current.rotation.set(endAngle, 0, 0);
      group.current.position.set(0, 0, 0);
      setIsFlipping(false);
      onStop(finalResult);
    }
  });

  const rimGeom = useMemo(
    () => new THREE.CylinderGeometry(radius, radius, thickness, 48, 1, false),
    [radius, thickness]
  );
  const faceGeom = useMemo(
    () => new THREE.CircleGeometry(radius, 64),
    [radius]
  );

  return (
    <group ref={group}>
      <mesh geometry={rimGeom}>
        <meshStandardMaterial metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh
        geometry={faceGeom}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, thickness / 2, 0]}
      >
        <meshStandardMaterial map={headsMap} />
      </mesh>
      <mesh
        geometry={faceGeom}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -thickness / 2, 0]}
      >
        <meshStandardMaterial map={tailsMap} />
      </mesh>
    </group>
  );
}

function CoinScene({ trigger, onDone, headsUrl, tailsUrl }) {
  return (
    <Canvas camera={{ position: [0, 1.8, 3], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={0.9} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      <Suspense fallback={<Html center>Chargement…</Html>}>
        <Coin3D
          flippingTrigger={trigger}
          onStop={onDone}
          headsUrl={headsUrl}
          tailsUrl={tailsUrl}
        />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
    </Canvas>
  );
}

export default function App() {
  const [trigger, setTrigger] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);
  const [player1Score, setPlayer1Score] = useState({ PILE: 0, FACE: 0, total: 0 });
  const [player2Score, setPlayer2Score] = useState({ PILE: 0, FACE: 0, total: 0 });
  const [lastResult, setLastResult] = useState("—");

  const reset = () => {
    setPlayer1Score({ PILE: 0, FACE: 0, total: 0 });
    setPlayer2Score({ PILE: 0, FACE: 0, total: 0 });
    setCurrentPlayer(1);
    setLastResult("—");
  };

  const handleDone = (result) => {
    if (currentPlayer === 1) {
      setPlayer1Score(prev => ({
        ...prev,
        [result]: prev[result] + 1,
        total: prev.total + 1
      }));
    } else {
      setPlayer2Score(prev => ({
        ...prev,
        [result]: prev[result] + 1,
        total: prev.total + 1
      }));
    }
    setLastResult(result);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const totalThrows = player1Score.total + player2Score.total;
  const totalHeads = player1Score.PILE + player2Score.PILE;
  const totalTails = player1Score.FACE + player2Score.FACE;
  const headsPercentage = totalThrows > 0 ? Math.round((totalHeads / totalThrows) * 100) : 0;
  const tailsPercentage = totalThrows > 0 ? Math.round((totalTails / totalThrows) * 100) : 0;

  return (
    <div style={{ 
      padding: "15px", 
      fontFamily: "Arial, sans-serif", 
      minHeight: "100vh", 
      background: "#fafafa",
      display: "flex",
      gap: "20px"
    }}>
      <InstructionsModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
      
      <TeachingAssistant 
        currentPlayer={currentPlayer}
        results={{ player1Score, player2Score }}
      />
      
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "white",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "15px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "20px", margin: 0, color: "#4f46e5" }}>
              Jeu de Probabilités : Pile ou Face
            </h1>
            <div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowInstructions(true)}
                style={{
                  marginRight: "8px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: "transparent",
                  color: "#4f46e5",
                  border: "1px solid #4f46e5",
                  fontSize: "12px"
                }}
              >
                Instructions
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={reset}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  fontSize: "12px"
                }}
              >
                Réinitialiser
              </motion.button>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          gap: "15px", 
          flex: 1,
          background: "white",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{
              padding: "10px",
              background: currentPlayer === 1 ? "#f0f7ff" : "#f9f9f9",
              border: `2px solid ${currentPlayer === 1 ? "#4f46e5" : "#ddd"}`,
              borderRadius: "8px",
              marginBottom: "10px",
              transition: "all 0.3s ease"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginRight: "8px"
                }}>
                  J1
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#666" }}>Joueur 1</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: currentPlayer === 1 ? "#4f46e5" : "#000" }}>Amina</div>
                </div>
                {currentPlayer === 1 && (
                  <div style={{
                    marginLeft: "auto",
                    padding: "3px 6px",
                    background: "#4f46e5",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "10px"
                  }}>
                    À toi de jouer !
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <div>PILE: <b>{player1Score.PILE}</b></div>
                <div>FACE: <b>{player1Score.FACE}</b></div>
                <div>Total: <b>{player1Score.total}</b></div>
              </div>
            </div>
            
            <div style={{ flex: 1, position: "relative" }}>
              <div style={{ height: "250px" }}>
                <CoinScene
                  trigger={trigger}
                  onDone={handleDone}
                  headsUrl="/assets/coin-heads.png"
                  tailsUrl="/assets/coin-tails.png"
                />
              </div>
              
              <div style={{ 
                textAlign: "center", 
                marginTop: "10px",
                padding: "8px",
                background: "#f8f9fa",
                borderRadius: "8px"
              }}>
                <div style={{ fontSize: "11px", color: "#666" }}>Dernier résultat</div>
                <div style={{ 
                  fontWeight: "bold", 
                  fontSize: "14px",
                  color: lastResult === "PILE" ? "#059669" : "#dc2626"
                }}>
                  {lastResult}
                </div>
              </div>
            </div>
            
            <div style={{
              padding: "10px",
              background: currentPlayer === 2 ? "#f0f7ff" : "#f9f9f9",
              border: `2px solid ${currentPlayer === 2 ? "#4f46e5" : "#ddd"}`,
              borderRadius: "8px",
              marginTop: "10px",
              transition: "all 0.3s ease"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginRight: "8px"
                }}>
                  J2
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#666" }}>Joueur 2</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: currentPlayer === 2 ? "#4f46e5" : "#000" }}>Ousmane</div>
                </div>
                {currentPlayer === 2 && (
                  <div style={{
                    marginLeft: "auto",
                    padding: "3px 6px",
                    background: "#4f46e5",
                    color: "white",
                    borderRadius: "6px",
                    fontSize: "10px"
                  }}>
                    À toi de jouer !
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <div>PILE: <b>{player2Score.PILE}</b></div>
                <div>FACE: <b>{player2Score.FACE}</b></div>
                <div>Total: <b>{player2Score.total}</b></div>
              </div>
            </div>
            
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setTrigger(t => t + 1)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#4f46e5",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                Lancer la pièce (Joueur {currentPlayer})
              </motion.button>
            </div>
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#4f46e5" }}>Statistiques Globales</h3>
              
              <div style={{ marginBottom: "8px" }}>
                <div style={{ fontSize: "11px", color: "#666" }}>Total des lancers</div>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>{totalThrows}</div>
              </div>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>PILE</div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#059669" }}>
                    {totalHeads} <span style={{ fontSize: "12px" }}>({headsPercentage}%)</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>FACE</div>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: "#dc2626" }}>
                    {totalTails} <span style={{ fontSize: "12px" }}>({tailsPercentage}%)</span>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                height: "10px", 
                background: "#e9ecef", 
                borderRadius: "5px",
                overflow: "hidden",
                marginBottom: "8px"
              }}>
                <div style={{ 
                  height: "100%", 
                  width: `${headsPercentage}%`, 
                  background: "#059669" 
                }} />
              </div>
              
              <div style={{ fontSize: "11px", color: "#666" }}>
                Théorie: <b>50% PILE / 50% FACE</b>
              </div>
            </div>
            
            <div style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#4f46e5" }}>Joueur 1 (Amina)</h3>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>PILE</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#059669" }}>
                    {player1Score.PILE}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>FACE</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#dc2626" }}>
                    {player1Score.FACE}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>Total</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {player1Score.total}
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: "11px" }}>
                % PILE: <b>{player1Score.total > 0 ? Math.round((player1Score.PILE / player1Score.total) * 100) : 0}%</b>
              </div>
            </div>
            
            <div style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#4f46e5" }}>Joueur 2 (Ousmane)</h3>
              
              <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>PILE</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#059669" }}>
                    {player2Score.PILE}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>FACE</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#dc2626" }}>
                    {player2Score.FACE}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", color: "#666" }}>Total</div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {player2Score.total}
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: "11px" }}>
                % PILE: <b>{player2Score.total > 0 ? Math.round((player2Score.PILE / player2Score.total) * 100) : 0}%</b>
              </div>
            </div>
            
            <div style={{
              padding: "12px",
              background: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
              fontSize: "11px"
            }}>
              <h3 style={{ margin: "0 0 8px", fontSize: "14px", color: "#4f46e5" }}>Analyse des Résultats</h3>
              <p style={{ margin: 0 }}>
                {totalThrows > 0 ? (
                  <>
                    Après <b>{totalThrows} lancers</b>, vous avez <b style={{color: "#059669"}}>{totalHeads} PILE ({headsPercentage}%)</b> et{" "}
                    <b style={{color: "#dc2626"}}>{totalTails} FACE ({tailsPercentage}%)</b>.
                    {Math.abs(headsPercentage - 50) > 10 ? (
                      <span> L'écart avec la théorie est important. Continuez pour voir la loi des grands nombres!</span>
                    ) : (
                      <span> Vos résultats sont proches de la probabilité théorique.</span>
                    )}
                  </>
                ) : (
                  "Commencez à jouer pour voir les statistiques apparaître ici."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}