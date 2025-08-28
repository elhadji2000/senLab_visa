import React from "react";

export default function Tutoriel({ isOpen, onClose }) {
  if (!isOpen) return null; // ne rend rien si fermé

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">📘 Tutoriel : Transformations géométriques</h2>

        <p className="mb-4">
          Bienvenue dans cette simulation interactive ! L’objectif de cette activité est de vous permettre de comprendre et de visualiser les <strong>transformations géométriques</strong> dans un plan orthonormé. Vous pourrez manipuler des figures et observer les effets des <strong>translations, symétries et rotations</strong> directement sur le plan.
        </p>

        <h3 className="text-xl font-semibold mb-2">🎯 Objectifs pédagogiques</h3>
        <ul className="list-disc pl-5 mb-4">
          <li>Comprendre la notion de <strong>translation</strong> : déplacer une figure sans la déformer.</li>
          <li>Comprendre les différents types de <strong>symétries</strong> : axiale (Ox, Oy), centrale (O), diagonale (y=x).</li>
          <li>Comprendre les <strong>rotations</strong> autour d’un point, notamment l’origine.</li>
          <li>Savoir appliquer ces transformations sur différentes figures (triangle, rectangle, pentagone).</li>
          <li>Apprendre à lire et utiliser les coordonnées dans un plan orthonormé.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">📖 Notions importantes à retenir</h3>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Translation :</strong> chaque point de la figure se déplace de la même distance et dans la même direction.</li>
          <li><strong>Symétrie axiale :</strong> réflexion par rapport à un axe (Ox ou Oy).</li>
          <li><strong>Symétrie centrale :</strong> réflexion par rapport à l’origine.</li>
          <li><strong>Symétrie diagonale :</strong> réflexion par rapport à la droite y = x.</li>
          <li><strong>Rotation :</strong> faire tourner la figure autour de l’origine de 90°, 180° ou 270°.</li>
          <li>Le plan est gradué pour faciliter la visualisation des déplacements.</li>
          <li>Activer l’option “Accrocher à la grille” pour que les points aient des coordonnées entières.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">💡 Comment utiliser la simulation</h3>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Choisir la figure :</strong> sélectionnez triangle, rectangle ou pentagone.</li>
          <li><strong>Déplacement libre :</strong> cliquez et glissez la figure pour la déplacer manuellement.</li>
          <li><strong>Translation :</strong> entrez les valeurs dx (horizontal) et dy (vertical), puis cliquez sur le bouton pour appliquer le déplacement.</li>
          <li><strong>Symétries :</strong> utilisez les boutons pour appliquer des réflexions sur la figure.</li>
          <li><strong>Rotations :</strong> cliquez sur les boutons 90°, 180° ou 270° pour faire tourner la figure autour de l’origine.</li>
          <li><strong>Mémoriser :</strong> crée un “fantôme” pour visualiser l’ancienne position avant transformation.</li>
          <li><strong>Réinitialiser :</strong> ramène la figure à sa position initiale.</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">📝 Conseils pour bien apprendre</h3>
        <ul className="list-disc pl-5 mb-4">
          <li>Observez comment chaque transformation modifie la figure et ses coordonnées.</li>
          <li>Essayez différentes valeurs pour dx et dy pour mieux comprendre la translation.</li>
          <li>Comparez les effets des symétries et rotations sur la même figure.</li>
          <li>Utilisez le fantôme pour visualiser le mouvement sans perdre la figure initiale.</li>
        </ul>

        <p className="italic text-sm text-gray-600">
          À la fin de cette simulation, vous devriez être capables de :
          <ul className="list-disc pl-5 mt-1">
            <li>Appliquer une translation, symétrie ou rotation sur n’importe quelle figure.</li>
            <li>Lire les coordonnées de chaque point dans le plan orthonormé.</li>
            <li>Comprendre comment les transformations modifient la position et l’orientation des figures.</li>
          </ul>
        </p>
      </div>
    </div>
  );
}
