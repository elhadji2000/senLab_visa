// PythagoreIntro.jsx
import React, { useEffect } from "react";

export default function PythagoreIntro({ open, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Théorème de Pythagore - Explications détaillées
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">1. Énoncé du théorème</h3>
            <p className="text-justify">
              Le théorème de Pythagore est une relation fondamentale en géométrie euclidienne qui établit que dans un triangle rectangle, le carré de la longueur de l'hypoténuse (le côté opposé à l'angle droit) est égal à la somme des carrés des longueurs des deux autres côtés.
            </p>
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <p className="text-center font-mono text-lg font-semibold">
                c² = a² + b²
              </p>
              <p className="text-center text-sm mt-2">
                où c est la longueur de l'hypoténuse, et a et b sont les longueurs des deux autres côtés.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">2. Démonstration visuelle</h3>
            <p className="text-justify">
              Le théorème peut être démontré visuellement en comparant les aires des carrés construits sur chaque côté du triangle rectangle. L'aire du carré construit sur l'hypoténuse est égale à la somme des aires des carrés construits sur les deux autres côtés.
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Dans cette simulation:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Le triangle ABC est rectangle en A</li>
                  <li>AB = c (hypoténuse)</li>
                  <li>AC = b (côté adjacent)</li>
                  <li>BC = a (côté opposé)</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Propriétés:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Angle A = 90° (angle droit)</li>
                  <li>La somme des angles B et C = 90°</li>
                  <li>L'aire du carré sur l'hypoténuse = somme des aires des carrés sur les côtés</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">3. Utilisation de la simulation</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <span className="font-medium">Ajustez les longueurs:</span> Utilisez les curseurs pour modifier les valeurs des côtés a et b (en cm).
              </li>
              <li>
                <span className="font-medium">Observez les changements:</span> La longueur de l'hypoténuse c est calculée automatiquement selon la formule c = √(a² + b²).
              </li>
              <li>
                <span className="font-medium">Vérifiez le théorème:</span> La section "Vérification du théorème" montre le calcul détaillé confirmant que a² + b² = c².
              </li>
              <li>
                <span className="font-medium">Visualisez géométriquement:</span> Le triangle est redessiné en temps réel avec les nouvelles dimensions.
              </li>
            </ol>
            <p className="text-sm text-gray-600 mt-3">
              Note: L'échelle est de 1 cm = 30 px pour une meilleure visibilité.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">4. Applications pratiques</h3>
            <p className="text-justify">
              Le théorème de Pythagore a de nombreuses applications concrètes:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Calcul de distances en navigation et en topographie</li>
              <li>Construction et architecture (vérification d'angles droits)</li>
              <li>Ingénierie et conception technique</li>
              <li>Informatique graphique et jeux vidéo (calculs de distances)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">5. Exercices suggérés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium mb-2">Vérification classique:</h4>
                <p>Réglez a = 3 cm et b = 4 cm. Vérifiez que c = 5 cm.</p>
                <p className="mt-1 text-sm">3² + 4² = 9 + 16 = 25 = 5²</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium mb-2">Autre triplet:</h4>
                <p>Testez a = 5 cm et b = 12 cm. Vous devriez obtenir c = 13 cm.</p>
                <p className="mt-1 text-sm">5² + 12² = 25 + 144 = 169 = 13²</p>
              </div>
              <div className="p-3 bg-green-50 rounded md:col-span-2">
                <h4 className="font-medium mb-2">Défi:</h4>
                <p>Essayez de trouver d'autres triplets pythagoriciens (nombres entiers vérifiant a² + b² = c²).</p>
                <p className="mt-1 text-sm">Exemples: (6, 8, 10), (7, 24, 25), (8, 15, 17)</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">6. Limitations et précisions</h3>
            <p className="text-justify">
              Bien que cette simulation permette de visualiser le théorème de Pythagore, notez que:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Les valeurs sont arrondies à deux décimales pour l'affichage</li>
              <li>Le théorème s'applique uniquement aux triangles rectangles</li>
              <li>La précision visuelle est limitée par la résolution de l'écran</li>
              <li>Les calculs sous-jacents utilisent la précision des nombres flottants JavaScript</li>
            </ul>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
          >
            Commencer l'expérimentation
          </button>
        </div>
      </div>
    </div>
  );
}