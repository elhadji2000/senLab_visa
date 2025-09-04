import React from "react";
export default function ExamplesPanel() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="font-semibold mb-3">Exemples concrets</h2>
      <ul className="list-disc list-inside text-sm space-y-2">
        <li><strong>Arithmétique :</strong> marches d’escalier, salaire avec prime fixe annuelle.</li>
        <li><strong>Géométrique :</strong> intérêts bancaires, croissance bactérienne, radioactivité (demi-vie).</li>
        <li><strong>Fibonacci :</strong> reproduction simplifiée, spirales de tournesol, coquilles.</li>
      </ul>

      <h3 className="font-medium mt-4">Exercices rapides</h3>
      <ol className="list-decimal list-inside text-sm space-y-2 mt-2">
        <li>Suite arithmétique a₁=4, d=5 → calcule T₆ et S₆.</li>
        <li>Suite géométrique a₁=3, q=3 → quel est le 5ᵉ terme ?</li>
        <li>Avec Fibonacci, à partir de quel terme la suite dépasse 100 ?</li>
      </ol>
    </div>
  );
}
