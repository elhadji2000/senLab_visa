import React, { useState } from "react";
import GeometryScene from "./GeometryScene";

export default function App() {
  const [figure, setFigure] = useState("cube");
  const [showInfo, setShowInfo] = useState(false);

  const figureNames = {
    cube: "Cube",
    parallelepiped: "Parallélépipède",
    sphere: "Sphère",
    cone: "Cône",
    pyramid: "Pyramide",
  };

  const formulas = {
    cube: {
      volume: "V = c³",
      area: "A = 6 × c²",
      variables: "c = côté",
    },
    parallelepiped: {
      volume: "V = L × l × h",
      area: "A = 2(L×l + L×h + l×h)",
      variables: "L = longueur, l = largeur, h = hauteur",
    },
    sphere: {
      volume: "V = (4/3) × π × r³",
      area: "A = 4 × π × r²",
      variables: "r = rayon",
    },
    cone: {
      volume: "V = (π × r² × h) / 3",
      area: "A = π × r × (r + g)",
      variables: "r = rayon, h = hauteur, g = génératrice",
    },
    pyramid: {
      volume: "V = (Aire_base × h) / 3",
      area: "A = Aire_base + Aire_faces_latérales",
      variables: "h = hauteur",
    },
  };

  const figureDetails = {
    cube: {
      description:
        "Un cube est un solide avec 6 faces carrées égales, perpendiculaires entre elles.",
      properties: [
        "6 faces carrées",
        "12 arêtes de même longueur",
        "8 sommets",
        "Tous les angles sont droits",
      ],
      examples: "Dés, boîtes, Rubik's Cube",
      explanation:
        "Le cube est un prisme droit particulier où toutes les faces sont des carrés identiques. Toutes ses arêtes ont la même longueur.",
    },
    parallelepiped: {
      description:
        "Un parallélépipède est un solide dont les 6 faces sont des parallélogrammes. S'il est rectangle, toutes ses faces sont rectangulaires.",
      properties: [
        "6 faces parallélogrammes",
        "12 arêtes",
        "8 sommets",
        "Les faces opposées sont parallèles et égales",
      ],
      examples: "Cartons, briques, livres, boîtes de céréales",
      explanation:
        "Le parallélépipède rectangle (ou pavé droit) est un prisme droit à base rectangulaire. Ses faces sont perpendiculaires entre elles.",
    },
    sphere: {
      description:
        "Une sphère est une figure géométrique parfaitement ronde dans l'espace, dont tous les points sont équidistants du centre.",
      properties: [
        "Surface courbe continue",
        "Aucune arête",
        "Aucun sommet",
        "Symétrie parfaite dans toutes les directions",
      ],
      examples: "Ballons, planètes, bulles de savon, billes",
      explanation:
        "La sphère est le solide qui, pour un volume donné, a la plus petite surface. C'est une forme très courante dans la nature.",
    },
    cone: {
      description:
        "Un cône est un solide qui a une base circulaire et un sommet (apex) relié à tous les points du cercle de base par des génératrices.",
      properties: [
        "1 base circulaire",
        "1 sommet (apex)",
        "1 surface latérale courbe",
        "Si droit, l'axe est perpendiculaire à la base",
      ],
      examples: "Cornets de glace, entonnoirs, cônes de signalisation",
      explanation:
        "Un cône est généré par la rotation d'un triangle rectangle autour d'un de ses côtés de l'angle droit. Le cône droit a son apex aligné avec le centre de la base.",
    },
    pyramid: {
      description:
        "Une pyramide est un polyèdre avec une base polygonale et des faces triangulaires qui se rencontrent à un sommet unique (apex).",
      properties: [
        "1 base polygonale",
        "Faces latérales triangulaires",
        "1 sommet (apex)",
        "La hauteur est la distance de l'apex à la base",
      ],
      examples: "Pyramides d'Égypte, toits pointus, flèches d'église",
      explanation:
        "Les pyramides sont classées selon la forme de leur base: pyramidе à base triangulaire (tétraèdre), carrée, pentagonale, etc. La formule du volume est la même quelle que soit la forme de la base: V = (Aire_base × h) / 3.",
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Colonne gauche */}
      <div className="w-1/3 p-6 bg-white shadow-lg flex flex-col gap-6 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🧮 Géométrie 3D Interactive
          </h1>
          <p className="text-gray-600">
            Explorez les propriétés géométriques des figures en 3D :
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {["cube", "parallelepiped", "sphere", "cone", "pyramid"].map(
              (f) => (
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
              )
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow-md mt-6 border border-blue-100">
            <h2 className="font-semibold mb-2 text-blue-800">📏 Formules</h2>
            <div className="text-lg font-mono bg-white p-3 rounded border space-y-2">
              <p>
                <strong>Volume:</strong> {formulas[figure].volume}
              </p>
              <p>
                <strong>Aire:</strong> {formulas[figure].area}
              </p>
              <p className="text-sm mt-2">{formulas[figure].variables}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">
              💡 À propos du {figureNames[figure]}
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              {figureDetails[figure].description}
            </p>
            <div className="mt-3">
              <h4 className="font-medium text-green-700">Propriétés:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                {figureDetails[figure].properties.map((prop, idx) => (
                  <li key={idx}>{prop}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3">
              <h4 className="font-medium text-green-700">Exemples:</h4>
              <p className="text-sm text-gray-700">
                {figureDetails[figure].examples}
              </p>
              {/* Bouton Info */}
              <button
                className="mt-4 p-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowInfo(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Leçon complète
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Colonne droite */}
      <div className="w-2/3 max-h-[700px] h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-md">
        <GeometryScene figure={figure} />
      </div>

      {/* ✅ Modal d'info améliorée */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800">
                📘 Cours de Géométrie 3D - Formules et Explications
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowInfo(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                🎯 Objectifs pédagogiques
              </h3>
              <p className="text-gray-700">
                Comprendre les propriétés des solides en 3D, maîtriser le calcul
                des aires et volumes, et savoir appliquer ces formules à des
                situations concrètes.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
                📐 Notions fondamentales
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-indigo-600">
                    Définitions importantes
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2 font-bold">●</span>
                        <div>
                          <span className="font-medium">Base</span> : face sur
                          laquelle repose le solide ou face particulière (pour
                          pyramides et cônes)
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2 font-bold">●</span>
                        <div>
                          <span className="font-medium">Hauteur (h)</span> :
                          distance perpendiculaire entre la base et le sommet
                          opposé
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2 font-bold">●</span>
                        <div>
                          <span className="font-medium">Apothem</span> : dans
                          une pyramide, hauteur d'une face latérale
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 mr-2 font-bold">
                          ●
                        </span>
                        <div>
                          <span className="font-medium">Aire (A)</span> : mesure
                          de la surface d'un solide (en unités carrées)
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-600 mr-2 font-bold">
                          ●
                        </span>
                        <div>
                          <span className="font-medium">Volume (V)</span> :
                          mesure de l'espace occupé par un solide (en unités
                          cubes)
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-indigo-600">
                    🧭 Mode d'emploi de l'application
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <span className="text-indigo-700 font-bold">1</span>
                      </div>
                      <p className="text-gray-700">
                        Choisissez une figure dans le menu de gauche
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <span className="text-indigo-700 font-bold">2</span>
                      </div>
                      <p className="text-gray-700">
                        Manipulez la figure 3D avec la souris (rotation, zoom)
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <span className="text-indigo-700 font-bold">3</span>
                      </div>
                      <p className="text-gray-700">
                        Observez les différentes parties : base, hauteur, faces
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <span className="text-indigo-700 font-bold">4</span>
                      </div>
                      <p className="text-gray-700">
                        Étudiez les formules de calcul correspondantes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
                📊 Formules détaillées par figure
              </h3>

              <div className="space-y-6">
                {/* Cube */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">
                    Cube
                  </h4>
                  <p className="mb-2">
                    <strong>Volume:</strong> V = c³ (où c est la longueur d'un
                    côté)
                  </p>
                  <p className="mb-2">
                    <strong>Aire totale:</strong> A = 6 × c² (6 faces carrées
                    identiques)
                  </p>
                  <p className="text-sm text-gray-600">
                    Exemple: Si c = 5 cm, alors V = 5³ = 125 cm³ et A = 6 × 5² =
                    150 cm²
                  </p>
                </div>

                {/* Parallélépipède */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">
                    Parallélépipède rectangle
                  </h4>
                  <p className="mb-2">
                    <strong>Volume:</strong> V = L × l × h (Longueur × largeur ×
                    hauteur)
                  </p>
                  <p className="mb-2">
                    <strong>Aire totale:</strong> A = 2(L×l + L×h + l×h)
                  </p>
                  <p className="text-sm text-gray-600">
                    Exemple: Si L=8cm, l=3cm, h=4cm, alors V=8×3×4=96cm³ et
                    A=2(8×3 + 8×4 + 3×4)=2(24+32+12)=136cm²
                  </p>
                </div>

                {/* Sphère */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">
                    Sphère
                  </h4>
                  <p className="mb-2">
                    <strong>Volume:</strong> V = (4/3) × π × r³
                  </p>
                  <p className="mb-2">
                    <strong>Aire:</strong> A = 4 × π × r²
                  </p>
                  <p className="text-sm text-gray-600">
                    Exemple: Si r = 7 cm, alors V = (4/3)×π×343 ≈ 1436.76 cm³ et
                    A = 4×π×49 ≈ 615.75 cm²
                  </p>
                </div>

                {/* Cône */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">
                    Cône
                  </h4>
                  <p className="mb-2">
                    <strong>Volume:</strong> V = (π × r² × h) / 3
                  </p>
                  <p className="mb-2">
                    <strong>Aire totale:</strong> A = π × r² + π × r × g = π × r
                    × (r + g) (où g est la génératrice)
                  </p>
                  <p className="mb-2">
                    Relation: g² = r² + h² (théorème de Pythagore)
                  </p>
                  <p className="text-sm text-gray-600">
                    Exemple: Si r=3cm, h=4cm, alors g=√(3²+4²)=5cm,
                    V=(π×9×4)/3≈37.7cm³, A=π×3×(3+5)≈75.4cm²
                  </p>
                </div>

                {/* Pyramide - Section détaillée */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-2">
                    Pyramide
                  </h4>
                  <p className="mb-2">
                    <strong>Volume:</strong> V = (Aire_base × h) / 3
                  </p>
                  <p className="mb-2">
                    <strong>Aire totale:</strong> A = Aire_base +
                    Aire_faces_latérales
                  </p>

                  <div className="ml-4 mt-3 p-3 bg-blue-50 rounded">
                    <h5 className="font-medium text-blue-800 mb-2">
                      Cas particuliers selon la base:
                    </h5>

                    <div className="mb-3">
                      <p className="font-medium">
                        Pyramide à base carrée (comme les pyramides d'Égypte):
                      </p>
                      <p>Aire_base = c² (côté du carré)</p>
                      <p>
                        Aire_faces_latérales = 4 × (c × a / 2) = 2 × c × a (où a
                        est l'apothem)
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium">
                        Pyramide à base triangulaire (tétraèdre régulier):
                      </p>
                      <p>Aire_base = (c² × √3) / 4</p>
                      <p>Aire_totale = c² × √3</p>
                    </div>

                    <div className="mb-3">
                      <p className="font-medium">
                        Pyramide à base rectangulaire:
                      </p>
                      <p>Aire_base = L × l</p>
                      <p>
                        Aire_faces_latérales = somme des aires des 4 faces
                        triangulaires
                      </p>
                    </div>

                    <div>
                      <p className="font-medium">
                        Pyramide à base pentagonale:
                      </p>
                      <p>Aire_base = (périmètre × apothem_base) / 2</p>
                      <p>
                        Aire_faces_latérales = somme des aires des 5 faces
                        triangulaires
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    Exemple: Pyramide à base carrée avec c=6cm, h=4cm,
                    apothem=5cm. Aire_base = 6² = 36cm², V = (36×4)/3 = 48cm³,
                    Aire_latérale = 2×6×5 = 60cm², Aire_totale = 36+60 = 96cm²
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
                🔍 Conseils pour résoudre les problèmes
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Stratégies de résolution
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Identifiez toujours la figure géométrique en jeu</li>
                    <li>Notez toutes les mesures données dans l'énoncé</li>
                    <li>Repérez ce qu'on vous demande de calculer</li>
                    <li>Choisissez la formule appropriée</li>
                    <li>Faites attention aux unités de mesure</li>
                    <li>Vérifiez la cohérence de votre résultat</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Erreurs fréquentes à éviter
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Confondre aire et volume</li>
                    <li>
                      Oublier de diviser par 3 pour les pyramides et cônes
                    </li>
                    <li>Négliger les unités de mesure ou les conversions</li>
                    <li>Utiliser le diamètre au lieu du rayon</li>
                    <li>
                      Oublier certaines faces dans le calcul de l'aire totale
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                💎 Application dans la vie réelle
              </h3>
              <p className="text-gray-700 mb-2">
                La géométrie spatiale est essentielle dans de nombreux domaines
                :
              </p>
              <ul className="list-disc list-inside text-gray-700 pl-4">
                <li>
                  <strong>Architecture et construction:</strong> calcul des
                  matériaux, stabilité des structures
                </li>
                <li>
                  <strong>Emballage:</strong> conception de boîtes et contenants
                  optimaux
                </li>
                <li>
                  <strong>Ingénierie:</strong> conception de pièces mécaniques,
                  aérodynamique
                </li>
                <li>
                  <strong>Astronomie:</strong> calcul du volume des planètes et
                  étoiles
                </li>
                <li>
                  <strong>Médecine:</strong> calcul de doses médicamenteuses,
                  imagerie 3D
                </li>
              </ul>
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
