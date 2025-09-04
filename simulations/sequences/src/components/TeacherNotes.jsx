/* eslint-disable no-unused-vars */
import React from "react";
export default function TeacherNotes({ type }) {
  return (
    <div className="mt-4">
      <h3 className="font-medium">Conseils pédagogiques</h3>
      <ul className="list-disc list-inside text-sm mt-2 space-y-2">
        <li>Demande aux élèves de prédire le terme suivant avant de dévoiler le graphe.</li>
        <li>Pour les suites géométriques, varie le ratio (q) autour de 1 pour montrer croissance/décroissance.</li>
        <li>Utilise la somme Sₙ pour introduire des problèmes appliqués (ex : total gagné après n années).</li>
      </ul>
    </div>
  );
}
