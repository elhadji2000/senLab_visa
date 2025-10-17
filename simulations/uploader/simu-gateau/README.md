# Simu Gâteau — Apprendre la proportionnalité par la cuisine 🍰

Une petite application React (Vite) + Tailwind pour apprendre la **proportionnalité** en partant d’une **recette de gâteau**.

## 🚀 Lancer le projet

```bash
# 1) Dézippez ce dossier
# 2) Dans le dossier, installez les dépendances
npm install

# 3) Lancez le serveur de développement
npm run dev
```

Ouvrez l’URL affichée (par défaut : http://localhost:5173).

## 🧱 Tech
- React 18 + Vite
- TailwindCSS
- Composants React réutilisables et structure claire

## 🖼️ Images réelles
Des **images de remplacement** (SVG simples) sont fournies. Remplacez-les par vos **images réelles** dans `public/images/` en conservant les noms de fichiers :
- `eggs.svg`
- `sugar.svg`
- `flour.svg`
- `butter.svg`
- `baking-powder.svg`
- `cake.svg` (icône d’entête)

Vous pouvez utiliser vos propres `.jpg` / `.png` et mettre à jour les extensions dans `src/data/recipe.js` si besoin.

## 🧠 Pédagogie
- **Simulation** : ajuster le nombre de personnes, voir les quantités recalculées (arrondis configurables).
- **Exercice** : l’élève saisit ses réponses et obtient un feedback (tolérance ±5%).

## 📁 Structure
```
simu-gateau/
  public/
    images/            # images des ingrédients
  src/
    components/
      ExercisePanel.jsx
      Explanation.jsx
      IngredientCard.jsx
      ServingControl.jsx
    data/
      recipe.js
    utils/
      scale.js
    App.jsx
    main.jsx
    index.css
  index.html
  package.json
  tailwind.config.js
  postcss.config.js
  vite.config.js
```

## ✏️ Modifier la recette
Éditez `src/data/recipe.js`. Exemple d’ingrédient :
```js
{
  id: "sugar",
  name: "Sucre",
  unit: "g",
  quantity: 100,
  image: "sugar.svg",
  imageAlt: "Sucre en poudre",
}
```

- `quantity` est la quantité **pour la recette de base** (`baseServings`).
- Les unités sont libres : `g`, `ml`, `sachet(s)`, `pièce(s)`, etc.

## 🔢 Maths
Formule utilisée :
```
nouvelle_quantité = quantité_de_base × (personnes_visées ÷ personnes_de_base)
```
Options d’arrondi :
- **Aucun** : résultat exact
- **À l’unité** : arrondi à l’entier le plus proche
- **Pas de 0,5** : arrondi au pas de 0,5

Bon apprentissage ! 🎓
