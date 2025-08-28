import React, { useState } from "react";
import GeometryScene from "./GeometryScene";

export default function App() {
  const [figure, setFigure] = useState("triangle");
  const [showInfo, setShowInfo] = useState(false);

  const figureNames = {
    triangle: "Triangle",
    rectangle: "Rectangle",
    square: "Carré",
    pyramid: "Pyramide"
  };

  const formulas = {
    triangle: "Aire = (Base × Hauteur) / 2",
    rectangle: "Aire = Longueur × Largeur",
    square: "Aire = Côté × Côté",
    pyramid: "Volume = (Aire de la base × Hauteur) / 3",
  };

  const figureDetails = {
    triangle: {
      description: "Un triangle est une figure géométrique à trois côtés et trois angles.",
      properties: ["3 côtés", "3 angles", "Somme des angles = 180°"],
      examples: "Panneaux routiers, toits de maison, supports structurels"
    },
    rectangle: {
      description: "Un rectangle est un quadrilatère avec quatre angles droits.",
      properties: ["4 côtés", "4 angles droits", "Côtés opposés égaux et parallèles"],
      examples: "Portes, fenêtres, écrans, livres"
    },
    square: {
      description: "Un carré est un rectangle particulier avec quatre côtés égaux.",
      properties: ["4 côtés égaux", "4 angles droits", "Diagonales de même longueur"],
      examples: "Carreaux de carrelage, cases de jeu d'échecs, cadres photo"
    },
    pyramid: {
      description: "Une pyramide est un polyèdre dont la base est un polygone et les faces latérales sont des triangles qui se rencontrent à un sommet.",
      properties: ["Base polygonale", "Faces triangulaires", "Sommet unique"],
      examples: "Pyramides d'Égypte, toits en flèche, emballages de chocolat"
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Colonne gauche */}
      <div className="w-1/3 p-6 bg-white shadow-lg flex flex-col gap-6 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🧮 Géométrie 3D Interactive</h1>
          <p className="text-gray-600">
            Explorez les propriétés géométriques des figures en 3D :
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {["triangle", "rectangle", "square", "pyramid"].map((f) => (
              <button
                key={f}
                onClick={() => setFigure(f)}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  figure === f
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 border border-gray-200 hover:bg-gray-200"
                }`}
              >
                {figureNames[f]}
              </button>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow-md mt-6 border border-blue-100">
            <h2 className="font-semibold mb-2 text-blue-800">📏 Formule</h2>
            <p className="text-lg font-mono bg-white p-3 rounded border">{formulas[figure]}</p>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">💡 À propos du {figureNames[figure]}</h3>
            <p className="text-sm text-gray-700">{figureDetails[figure].description}</p>
          </div>
        </div>

        {/* Bouton Info */}
        <button
          className="mt-4 p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          onClick={() => setShowInfo(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Leçon complète
        </button>
      </div>

      {/* Colonne droite */}
      <div className="w-2/3 h-screen bg-gradient-to-br from-gray-200 to-gray-300">
        <GeometryScene figure={figure} />
      </div>

      {/* ✅ Modal d'info améliorée */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800">📘 Cours de Géométrie 3D</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowInfo(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 Objectifs pédagogiques</h3>
              <p className="text-gray-700">
                Cette simulation interactive permet aux élèves de comprendre et visualiser les concepts fondamentaux de la géométrie dans l'espace.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-indigo-700">🧭 Mode d'emploi</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <span className="text-indigo-700 font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Choisissez une figure dans le menu de gauche</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <span className="text-indigo-700 font-bold">2</span>
                    </div>
                    <p className="text-gray-700">Manipulez la figure 3D avec la souris (rotation, zoom et déplacement)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <span className="text-indigo-700 font-bold">3</span>
                    </div>
                    <p className="text-gray-700">Observez les différentes parties : base (jaune), hauteur (rouge), faces latérales</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <span className="text-indigo-700 font-bold">4</span>
                    </div>
                    <p className="text-gray-700">Consultez la formule de calcul correspondante</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-indigo-700">📐 Notions abordées</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">●</span>
                      <span><b>Base</b> : face sur laquelle repose la figure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">●</span>
                      <span><b>Hauteur</b> : distance perpendiculaire entre la base et le sommet opposé</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">●</span>
                      <span><b>Faces latérales</b> : surfaces qui relient la base au sommet</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">●</span>
                      <span><b>Aire</b> : mesure de la surface d'une figure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">●</span>
                      <span><b>Volume</b> : mesure de l'espace occupé par un solide</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-indigo-700">📊 Formules essentielles</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="p-2 text-left">Figure</th>
                      <th className="p-2 text-left">Aire</th>
                      <th className="p-2 text-left">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Triangle</td>
                      <td className="p-2">(Base × Hauteur) / 2</td>
                      <td className="p-2">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Rectangle</td>
                      <td className="p-2">Longueur × Largeur</td>
                      <td className="p-2">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Carré</td>
                      <td className="p-2">Côté × Côté</td>
                      <td className="p-2">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Pyramide</td>
                      <td className="p-2">Aire base + Aire faces latérales</td>
                      <td className="p-2">(Aire base × Hauteur) / 3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">💎 Conseil pédagogique</h3>
              <p className="text-gray-700">
                Pour mieux comprendre ces concepts, essayez de trouver des exemples de ces figures dans votre environnement quotidien : 
                les boîtes (rectangles), les pyramides égyptiennes (pyramides), les panneaux routiers (triangles), etc.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => setShowInfo(false)}
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}