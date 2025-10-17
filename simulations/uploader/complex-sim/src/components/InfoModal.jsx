// src/components/InfoModal.jsx
import React from "react";
import { BlockMath, InlineMath } from "react-katex";

export default function InfoModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Leçon : Nombres Complexes</h2>

        <div className="space-y-4 text-gray-700 text-justify">
          <p>
            Un <b>nombre complexe</b> est un nombre de la forme{" "}
            <InlineMath math="z = a + bi" /> où :
          </p>
          <ul className="list-disc list-inside ml-4">
            <li><b>a</b> est la partie réelle (axe horizontal).</li>
            <li><b>b</b> est la partie imaginaire (axe vertical).</li>
            <li><b>i</b> est l’unité imaginaire, définie par <InlineMath math="i^2 = -1" />.</li>
          </ul>

          <h3 className="font-semibold text-lg">Représentation géométrique</h3>
          <p>
            On place le point <InlineMath math="(a, b)" /> dans le plan appelé{" "}
            <b>plan d’Argand</b>. Le vecteur allant de l’origine au point
            représente le nombre complexe.
          </p>

          <h3 className="font-semibold text-lg">Formules importantes</h3>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              Addition : <BlockMath math="(a + bi) + (c + di) = (a + c) + (b + d)i" />
            </li>
            <li>
              Multiplication : <BlockMath math="(a + bi)(c + di) = (ac - bd) + (ad + bc)i" />
            </li>
            <li>
              Module : <BlockMath math="|z| = \sqrt{a^2 + b^2}" />
            </li>
            <li>
              Argument : <BlockMath math="\arg(z) = \arctan\!\left(\tfrac{b}{a}\right)" />
            </li>
            <li>
              Conjugué : <BlockMath math="\overline{z} = a - bi" />
            </li>
          </ul>

          <h3 className="font-semibold text-lg">Exemples concrets</h3>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              <b>Rotation</b> : multiplier par <InlineMath math="i" /> correspond à une
              rotation de <InlineMath math="90^\circ" /> dans le plan.
            </li>
            <li>
              <b>Changement d’échelle</b> : multiplier par un réel{" "}
              <InlineMath math="\lambda" /> agrandit ou réduit la longueur du vecteur.
            </li>
            <li>
              <b>Applications</b> : électricité (courants alternatifs), mécanique
              (oscillations), informatique (graphismes 2D/3D).
            </li>
          </ul>

          <p className="italic text-sm text-gray-600">
            Astuce : expérimente dans la simulation pour voir ces propriétés en action.
          </p>
        </div>

        {/* Bouton fermer */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
