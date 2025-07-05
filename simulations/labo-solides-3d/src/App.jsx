import React, { useState, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Scene from "./components/Scene";
import * as htmlToImage from "html-to-image";
import { Button, Toast, ToastContainer } from "react-bootstrap";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "./App.css";

function App() {
  const [shape, setShape] = useState("cube");
  const [copied, setCopied] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: 2,
    height: 2,
    depth: 2,
    radius: 1,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const volume = useMemo(() => {
    switch (shape) {
      case "cube":
        return (
          dimensions.width *
          dimensions.height *
          dimensions.depth
        ).toFixed(2);
      case "sphere":
        return ((4 / 3) * Math.PI * Math.pow(dimensions.radius, 3)).toFixed(2);
      case "cylinder":
        return (
          Math.PI *
          Math.pow(dimensions.radius, 2) *
          dimensions.height
        ).toFixed(2);
      default:
        return 0;
    }
  }, [shape, dimensions]);

  const getExplanation = () => {
    switch (shape) {
      case "cube":
        return `Formule : V = largeur × hauteur × profondeur
               = ${dimensions.width} × ${dimensions.height} × ${dimensions.depth}
               = ${volume} cm³`;
      case "sphere":
        return `Formule : V = (4/3) × π × r³
               = (4/3) × π × ${dimensions.radius}³
               ≈ ${volume} cm³`;
      case "cylinder":
        return `Formule : V = π × r² × h
               = π × ${dimensions.radius}² × ${dimensions.height}
               ≈ ${volume} cm³`;
      default:
        return "";
    }
  };

  return (
    <div className="container-simulation">
      {/* LIGNE PRINCIPALE : paramètres + scène */}
      <div className="simulation-row">
        {/* Colonne gauche : paramètres */}
        <div className="left-panel">
          <div className="simulation-card">
            <h5 className="mb-3">🧰 Paramètres</h5>

            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className="form-select mb-3"
            >
              <option value="cube">Cube</option>
              <option value="sphere">Sphère</option>
              <option value="cylinder">Cylindre</option>
            </select>

            {shape === "cube" && (
              <>
                <div className="mb-3">
                  <label className="form-label">
                    Largeur : {dimensions.width} cm
                  </label>
                  <input
                    type="range"
                    name="width"
                    min="1"
                    max="5"
                    step="0.1"
                    value={dimensions.width}
                    onChange={handleChange}
                    className="form-range"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Hauteur : {dimensions.height} cm
                  </label>
                  <input
                    type="range"
                    name="height"
                    min="1"
                    max="5"
                    step="0.1"
                    value={dimensions.height}
                    onChange={handleChange}
                    className="form-range"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Profondeur : {dimensions.depth} cm
                  </label>
                  <input
                    type="range"
                    name="depth"
                    min="1"
                    max="5"
                    step="0.1"
                    value={dimensions.depth}
                    onChange={handleChange}
                    className="form-range"
                  />
                </div>
              </>
            )}
            {shape === "sphere" && (
              <div className="mb-3">
                <label className="form-label">
                  Rayon : {dimensions.radius} cm
                </label>
                <input
                  type="range"
                  name="radius"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={dimensions.radius}
                  onChange={handleChange}
                  className="form-range"
                />
              </div>
            )}
            {shape === "cylinder" && (
              <>
                <div className="mb-3">
                  <label className="form-label">
                    Rayon : {dimensions.radius} cm
                  </label>
                  <input
                    type="range"
                    name="radius"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={dimensions.radius}
                    onChange={handleChange}
                    className="form-range"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Hauteur : {dimensions.height} cm
                  </label>
                  <input
                    type="range"
                    name="height"
                    min="1"
                    max="5"
                    step="0.1"
                    value={dimensions.height}
                    onChange={handleChange}
                    className="form-range"
                  />
                </div>
              </>
            )}

            <h6 className="mt-3">📐 Volume : {volume} cm³</h6>

            <Button
              variant="outline-secondary"
              size="sm"
              className="mt-3 w-100"
              onClick={() => {
                const canvas = document.querySelector("canvas");
                htmlToImage.toPng(canvas).then((dataUrl) => {
                  const link = document.createElement("a");
                  link.download = `capture-${shape}.png`;
                  link.href = dataUrl;
                  link.click();
                });
              }}
            >
              📸 Capturer
            </Button>

            <Button
              variant="outline-primary"
              className="mt-2 w-100"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 3000);
              }}
            >
              🔗 Copier le lien
            </Button>

            <ToastContainer position="top-end" className="p-3">
              <Toast
                bg="success"
                show={copied}
                onClose={() => setCopied(false)}
                delay={3000}
                autohide
              >
                <Toast.Body className="text-white">Lien copié !</Toast.Body>
              </Toast>
            </ToastContainer>
          </div>
        </div>

        {/* Colonne centrale : Vue 3D */}
        <div className="center-panel">
          <div className="simulation-card scene-3d-container">
            <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <OrbitControls />
              <Scene shape={shape} dimensions={dimensions} />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Partie pédagogique sous la scène */}
      <div className="simulation-card mt-4 explanation-text">
        <h4 className="mb-3">📘 Comprendre cette simulation</h4>
        <p>
          Cette simulation interactive permet aux élèves de comprendre{" "}
          <strong>
            comment le volume des solides dépend de leurs dimensions
          </strong>
          . En modifiant les paramètres via les curseurs, l’élève observe en
          temps réel les changements dans la forme et le volume du solide.
        </p>

        <h5 className="mt-4">🧮 Formule utilisée</h5>
        {ready && (
          <MathJaxContext>
            <MathJax key={shape + volume}>
              {shape === "cube" &&
                `\\( V = \\text{largeur} \\times \\text{hauteur} \\times \\text{profondeur} = ${dimensions.width} \\times ${dimensions.height} \\times ${dimensions.depth} = ${volume}\\ \\text{cm}^3 \\)`}
              {shape === "sphere" &&
                `\\( V = \\frac{4}{3} \\pi r^3 = \\frac{4}{3} \\pi \\times (${dimensions.radius})^3 = ${volume}\\ \\text{cm}^3 \\)`}
              {shape === "cylinder" &&
                `\\( V = \\pi r^2 h = \\pi \\times (${dimensions.radius})^2 \\times ${dimensions.height} = ${volume}\\ \\text{cm}^3 \\)`}
            </MathJax>
          </MathJaxContext>
        )}

        <h5 className="mt-4">🎯 Objectifs pédagogiques</h5>
        <ul>
          <li>💡 Comprendre les concepts géométriques liés au volume.</li>
          <li>📊 Manipuler les dimensions pour observer leurs effets.</li>
          <li>
            👁️ Visualiser les solides en 3D pour une compréhension spatiale
            claire.
          </li>
          <li>✍️ Mémoriser les formules grâce à la pratique interactive.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
