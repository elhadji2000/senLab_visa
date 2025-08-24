import React from 'react';
import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Line, Html, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
const deg2rad = (d) => (d * Math.PI) / 180;

const tagStyle = {
  background: "rgba(2,6,23,0.9)",
  color: "#e2e8f0",
  padding: "6px 10px",
  fontSize: 12,
  borderRadius: 8,
  border: "1px solid #334155",
  whiteSpace: "nowrap",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
};
function TrigoCirclePage() {
  const [useDegrees, setUseDegrees] = useState(true);
  const [angle, setAngle] = useState(30);
  const [showLabels, setShowLabels] = useState(true);
  const [showProjections, setShowProjections] = useState(true);
  const R = 2.5; // Cercle réduit pour plus de visibilité

  const theta = useDegrees ? deg2rad(angle) : angle;
  const x = Math.cos(theta);
  const y = Math.sin(theta);

  const circlePoints = useMemo(() => {
    const N = 256;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      pts.push([R * Math.cos(t), R * Math.sin(t), 0]);
    }
    return pts;
  }, [R]);

  const axis = 4;

  // Common angles in degrees and radians
  const commonAngles = [
    { deg: 0, rad: 0 },
    { deg: 30, rad: Math.PI / 6 },
    { deg: 45, rad: Math.PI / 4 },
    { deg: 60, rad: Math.PI / 3 },
    { deg: 90, rad: Math.PI / 2 },
    { deg: 120, rad: (2 * Math.PI) / 3 },
    { deg: 135, rad: (3 * Math.PI) / 4 },
    { deg: 150, rad: (5 * Math.PI) / 6 },
    { deg: 180, rad: Math.PI },
    { deg: 210, rad: (7 * Math.PI) / 6 },
    { deg: 225, rad: (5 * Math.PI) / 4 },
    { deg: 240, rad: (4 * Math.PI) / 3 },
    { deg: 270, rad: (3 * Math.PI) / 2 },
    { deg: 300, rad: (5 * Math.PI) / 3 },
    { deg: 315, rad: (7 * Math.PI) / 4 },
    { deg: 330, rad: (11 * Math.PI) / 6 },
    { deg: 360, rad: 2 * Math.PI },
  ];

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: "#0f172a",
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Canvas à gauche */}
      <div style={{ 
        flex: 1, 
        width: "70%",
        height: "100%",
        position: "relative"
      }}>
        <Canvas
          orthographic
          camera={{ position: [0, 0, 10], zoom: 90 }}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#0f172a"]} />

          {/* Grille améliorée */}
          <gridHelper
            args={[20, 20, "#334155", "#334155"]}
            rotation={[0, 0, 0]}
            position={[0, 0, -0.1]}
          />
          
          {/* Sous-grille plus fine */}
          <gridHelper
            args={[20, 40, "#1e293b", "#1e293b"]}
            rotation={[0, 0, 0]}
            position={[0, 0, -0.05]}
          />

          {/* Axes */}
          <Line
            points={[
              [-axis, 0, 0],
              [axis, 0, 0],
            ]}
            color="#60a5fa"
            lineWidth={3}
          />
          <Line
            points={[
              [0, -axis, 0],
              [0, axis, 0],
            ]}
            color="#60a5fa"
            lineWidth={3}
          />

          {/* Axis labels */}
          {showLabels && (
            <>
              <Html position={[axis + 0.2, 0, 0]} center>
                <div
                  style={{
                    color: "#60a5fa",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  x
                </div>
              </Html>
              <Html position={[0, axis + 0.2, 0]} center>
                <div
                  style={{
                    color: "#60a5fa",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  y
                </div>
              </Html>
              <Html position={[1.1, -0.2, 0]} center>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>1</div>
              </Html>
              <Html position={[-0.2, 1.1, 0]} center>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>1</div>
              </Html>
            </>
          )}

          {/* Circle */}
          <Line points={circlePoints} color="#f8fafc" lineWidth={2} />

          {/* Radius line */}
          <Line
            points={[
              [0, 0, 0],
              [R * x, R * y, 0],
            ]}
            color="#f87171"
            lineWidth={2}
          />

          {/* Point M */}
          <mesh position={[R * x, R * y, 0]}>
            <circleGeometry args={[0.08, 24]} />
            <meshBasicMaterial color={"#f87171"} />
          </mesh>

          {/* Projections */}
          {showProjections && (
            <>
              <Line
                points={[
                  [R * x, 0, 0],
                  [R * x, R * y, 0],
                ]}
                color="#86efac"
                dashed
                dashSize={0.1}
                gapSize={0.1}
                lineWidth={2}
              />
              <Line
                points={[
                  [0, R * y, 0],
                  [R * x, R * y, 0],
                ]}
                color="#86efac"
                dashed
                dashSize={0.1}
                gapSize={0.1}
                lineWidth={2}
              />

              {/* Projection points */}
              <mesh position={[R * x, 0, 0]}>
                <circleGeometry args={[0.06, 24]} />
                <meshBasicMaterial color={"#86efac"} />
              </mesh>
              <mesh position={[0, R * y, 0]}>
                <circleGeometry args={[0.06, 24]} />
                <meshBasicMaterial color={"#86efac"} />
              </mesh>
            </>
          )}

          {/* Labels */}
          {showLabels && (
            <>
              <Html position={[R * x, R * y, 0]} center>
                <div style={tagStyle}>
                  M({x.toFixed(2)}, {y.toFixed(2)})
                </div>
              </Html>

              {showProjections && (
                <>
                  <Html position={[R * x, -0.3, 0]} center>
                    <div
                      style={{
                        ...tagStyle,
                        background: "rgba(134, 239, 172, 0.2)",
                        color: "#86efac",
                      }}
                    >
                      cos θ = {x.toFixed(2)}
                    </div>
                  </Html>
                  <Html position={[-0.4, R * y, 0]} center>
                    <div
                      style={{
                        ...tagStyle,
                        background: "rgba(134, 239, 172, 0.2)",
                        color: "#86efac",
                        transform: "rotate(-90deg)",
                      }}
                    >
                      sin θ = {y.toFixed(2)}
                    </div>
                  </Html>
                </>
              )}

              <Html position={[R * x * 0.5 + 0.2, R * y * 0.5 + 0.2, 0]} center>
                <div
                  style={{
                    ...tagStyle,
                    background: "rgba(248, 113, 113, 0.2)",
                    color: "#f87171",
                    fontSize: "12px",
                  }}
                >
                  θ ={" "}
                  {useDegrees
                    ? `${angle.toFixed(0)}°`
                    : `${angle.toFixed(2)} rad`}
                </div>
              </Html>
            </>
          )}

          {/* Angle arc */}
          <mesh>
            <ringGeometry args={[0.4, 0.5, 64, 1, 0, theta]} />
            <meshBasicMaterial
              color="#f87171"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Canvas>
      </div>

      {/* Contrôles à droite */}
      <div
        style={{
          width: "30%",
          minWidth: "350px",
          background: "rgba(15,23,42,0.95)",
          color: "#e2e8f0",
          padding: "20px",
          borderLeft: "1px solid #334155",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "-4px 0 12px rgba(0,0,0,0.2)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚙️</span> Contrôles
        </h3>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <label style={{ fontWeight: 500 }}>Unité d'angle:</label>
            <div
              style={{
                display: "flex",
                gap: 12,
                background: "#1e293b",
                padding: 4,
                borderRadius: 8,
              }}
            >
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: useDegrees ? "#3b82f6" : "transparent",
                  color: useDegrees ? "white" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setUseDegrees(true)}
              >
                Degrés
              </button>
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  background: !useDegrees ? "#3b82f6" : "transparent",
                  color: !useDegrees ? "white" : "#cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setUseDegrees(false)}
              >
                Radians
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>Angle θ:</span>
              <span
                style={{
                  fontFamily: "monospace",
                  background: "#1e293b",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                {useDegrees
                  ? `${angle.toFixed(1)}°`
                  : `${angle.toFixed(2)} rad`}
              </span>
            </div>
            <input
              type="range"
              min={useDegrees ? 0 : 0}
              max={useDegrees ? 360 : (2 * Math.PI).toFixed(2)}
              step={useDegrees ? 1 : 0.01}
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value))}
              style={{
                width: "100%",
                height: 6,
                borderRadius: 3,
                background:
                  "linear-gradient(to right, #3b82f6 0%, #3b82f6 100%)",
                outline: "none",
                opacity: 0.7,
                transition: "opacity 0.2s",
                WebkitAppearance: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                padding: 10,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>cos(θ)</div>
              <div style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                {x.toFixed(3)}
              </div>
            </div>
            <div
              style={{
                background: "rgba(30, 41, 59, 0.7)",
                padding: 10,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: "#94a3b8" }}>sin(θ)</div>
              <div style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                {y.toFixed(3)}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
                style={{ cursor: "pointer" }}
              />
              Afficher les labels
            </label>
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={showProjections}
                onChange={() => setShowProjections(!showProjections)}
                style={{ cursor: "pointer" }}
              />
              Afficher les projections
            </label>
          </div>
        </div>

        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid #334155",
          }}
        >
          <h4 style={{ marginBottom: 8 }}>Angles communs</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 6,
              maxHeight: 120,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {commonAngles.map((angleObj, idx) => (
              <button
                key={idx}
                style={{
                  padding: "4px 6px",
                  borderRadius: 4,
                  border: "none",
                  background: "#1e293b",
                  color: "#cbd5e1",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => {
                  setAngle(useDegrees ? angleObj.deg : angleObj.rad);
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#3b82f6";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#1e293b";
                  e.target.style.color = "#cbd5e1";
                }}
              >
                {useDegrees ? `${angleObj.deg}°` : `${angleObj.rad.toFixed(2)}`}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            paddingTop: 16,
            borderTop: "1px solid #334155",
          }}
        >
          <h4
            style={{
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>ℹ️</span> Informations
          </h4>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
            Le point{" "}
            <span style={{ color: "#60a5fa", fontWeight: "bold" }}>M</span>{" "}
            représente les coordonnées{" "}
            <span style={{ color: "#60a5fa", fontWeight: "bold" }}>
              (cos θ, sin θ)
            </span>
            sur le cercle trigonométrique. Les projections sur les axes illustrent
            les valeurs du cosinus et du sinus pour l'angle θ.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TrigoCirclePage;