// IntroThales.jsx
import React, { useEffect } from "react";

export default function IntroThales({ open, onClose }) {
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
            Théorème de Thalès - Explications détaillées
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
            <h3 className="font-semibold text-lg mb-3 text-blue-700">1. Énoncé du théorème de Thalès</h3>
            <p className="text-justify">
              Le théorème de Thalès est un théorème de géométrie qui établit une relation de proportionnalité entre les longueurs des côtés de deux triangles semblables. Dans sa configuration la plus courante, il s'énonce ainsi :
            </p>
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <p className="text-center font-mono text-lg font-semibold">
                Si (DE) ∥ (BC), alors AD/AB = AE/AC = DE/BC
              </p>
              <p className="text-center text-sm mt-2">
                où A, D, B sont alignés dans cet ordre et A, E, C sont alignés dans cet ordre
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">2. Conditions d'application</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Configuration nécessaire :</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Deux droites sécantes en A</li>
                  <li>Deux points D et E sur ces droites</li>
                  <li>Une droite (DE) parallèle à (BC)</li>
                  <li>Les points A, D, B alignés dans cet ordre</li>
                  <li>Les points A, E, C alignés dans cet ordre</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Dans cette simulation :</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Le triangle ABC est quelconque</li>
                  <li>La droite (DE) est parallèle à (BC)</li>
                  <li>D ∈ [AB] et E ∈ [AC]</li>
                  <li>Le paramètre k contrôle la position de D et E</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">3. Réciproque du théorème</h3>
            <p className="text-justify">
              La réciproque du théorème de Thalès permet de démontrer que deux droites sont parallèles :
            </p>
            <div className="mt-3 p-4 bg-green-50 rounded-lg">
              <p className="text-center font-mono text-lg font-semibold">
                Si AD/AB = AE/AC et si les points A, D, B et A, E, C sont alignés dans le même ordre, alors (DE) ∥ (BC)
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Attention : L'égalité des rapports seule ne suffit pas, il faut également vérifier l'alignement et l'ordre des points.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">4. Utilisation de la simulation</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <span className="font-medium">Ajustez la position :</span> Utilisez le curseur pour modifier la position de la droite (DE) parallèle à (BC).
              </li>
              <li>
                <span className="font-medium">Observez les mesures :</span> Les longueurs des segments sont calculées en temps réel et affichées en centimètres.
              </li>
              <li>
                <span className="font-medium">Vérifiez les rapports :</span> Les trois rapports AD/AB, AE/AC et DE/BC sont calculés et comparés.
              </li>
              <li>
                <span className="font-medium">Expérimentez :</span> Testez différentes positions pour constater la proportionnalité.
              </li>
            </ol>
            <p className="text-sm text-gray-600 mt-3">
              Note: L'échelle est de 10 px = 1 cm pour une visualisation optimale.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">5. Applications pratiques</h3>
            <p className="text-justify">
              Le théorème de Thalès est utilisé dans de nombreux domaines :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Géométrie et trigonométrie</li>
              <li>Topographie et cartographie</li>
              <li>Architecture et construction</li>
              <li>Physique et optique (calculs de distances focales)</li>
              <li>Astronomie (mesures de distances)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">6. Exercices suggérés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium mb-2">Exercice 1 : Vérification</h4>
                <p>Positionnez le curseur à k = 0,3 et notez les valeurs de AD, AB, AE, AC.</p>
                <p className="mt-1 text-sm">Calculez manuellement AD/AB et AE/AC. Que constatez-vous?</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium mb-2">Exercice 2 : Calcul</h4>
                <p>Si AB = 12 cm et AD = 4 cm, quelle devrait être la valeur de AE si AC = 9 cm?</p>
                <p className="mt-1 text-sm">Vérifiez votre calcul avec la simulation.</p>
              </div>
              <div className="p-3 bg-green-50 rounded md:col-span-2">
                <h4 className="font-medium mb-2">Exercice 3 : Réciproque</h4>
                <p>Si AD/AB = 2/3 et AC = 15 cm, où doit se trouver le point E sur [AC]?</p>
                <p className="mt-1 text-sm">Positionnez le curseur pour obtenir ce rapport.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-blue-700">7. Limitations et précisions</h3>
            <p className="text-justify">
              Bien que cette simulation permette de visualiser le théorème de Thalès, notez que:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Les valeurs sont arrondies à une décimale pour l'affichage</li>
              <li>Le théorème s'applique uniquement dans la configuration décrite</li>
              <li>La précision visuelle est limitée par la résolution de l'écran</li>
              <li>Les calculs utilisent la précision des nombres flottants JavaScript</li>
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