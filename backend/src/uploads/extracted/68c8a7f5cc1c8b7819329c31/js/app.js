// Fonction pour fermer le modal
function closeModal() {
  document.getElementById("welcome-modal").style.display = "none";
  document.getElementById("modal-overlay").style.display = "none";
}

// Afficher le modal au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcome-modal").style.display = "block";
  document.getElementById("modal-overlay").style.display = "block";
});

// Base de données des réactions
const reactions = {
  "acide-ethanoique": {
    ammoniac: {
      equation: "CH3COOH + NH3 → CH3COONH4",
      explication:
        "Le produit formé est l'acétate d'ammonium, un sel de l'acide éthanoïque et de l'ammoniac.",
    },
    aniline: {
      equation: "CH3COOH + C6H5NH2 → C6H5NH3+ + CH3COO-",
      explication:
        "Le produit formé est l'acétate de phénylméthylammonium, un sel de l'acide éthanoïque et de l'aniline.",
    },
    "acetate-ammonium": {
      equation: "CH3COOH + CH3COONH4 → CH3COONH4 + CH3COOH",
      explication:
        "La réaction est une simple mise en solution de l'acétate d'ammonium et de l'acide éthanoïque.",
    },
    "ethanoate-sodium": {
      equation: "CH3COOH + CH3COONa → CH3COONa + CH3COOH",
      explication:
        "La réaction est une simple mise en solution de l'éthanoate de sodium et de l'acide éthanoïque.",
    },
    "carbonate-sodium": {
      equation: "CH3COOH + Na2CO3 → CH3COONa + CO2 + H2O",
      explication:
        "Le produit formé est l'éthanoate de sodium, avec dégagement de dioxyde de carbone et d'eau.",
    },
  },
  "acide-methanoique": {
    ammoniac: {
      equation: "HCOOH + NH3 → NH4+ + HCOO-",
      explication:
        "Le produit formé est le formiate d'ammonium, un sel de l'acide méthanoïque et de l'ammoniac.",
    },
    aniline: {
      equation: "HCOOH + C6H5NH2 → C6H5NH3+ + HCOO-",
      explication:
        "Le produit formé est le formiate de phénylméthylammonium, un sel de l'acide méthanoïque et de l'aniline.",
    },
    "acetate-ammonium": {
      equation: "HCOOH + CH3COONH4 → NH4+ + HCOO- + CH3COOH",
      explication:
        "La réaction est une simple mise en solution de l'acétate d'ammonium, du formiate d'ammonium et de l'acide méthanoïque.",
    },
    "ethanoate-sodium": {
      equation: "HCOOH + CH3COONa → Na+ + HCOO- + CH3COOH",
      explication:
        "La réaction est une simple mise en solution de l'éthanoate de sodium, du formiate de sodium et de l'acide méthanoïque.",
    },
    "carbonate-sodium": {
      equation: "HCOOH + Na2CO3 → NaHCO3 + H2O",
      explication:
        "Le produit formé est le bicarbonate de sodium, avec dégagement de dioxyde de carbone et d'eau.",
    },
  },
  "acide-benzoique": {
    ammoniac: {
      equation: "C6H5COOH + NH3 → C6H5COONH4",
      explication:
        "Le produit formé est le benzoate d'ammonium, un sel de l'acide benzoïque et de l'ammoniac.",
    },
    aniline: {
      equation: "C6H5COOH + C6H5NH2 → H2N-C6H5-COOC6H5 + H2O",
      explication:
        "Le produit formé est le benzoate de phénylméthylammonium, un sel de l'acide benzoïque et de l'aniline.",
    },
    "acetate-ammonium": {
      equation: "C6H5COOH + CH3COONH4 → C6H5COONH4 + CH3COOH",
      explication:
        "La réaction est une simple mise en solution du benzoate d'ammonium et de l'acide benzoïque.",
    },
    "ethanoate-sodium": {
      equation: "C6H5COOH + CH3COONa → C6H5COONa + CH3COOH",
      explication:
        "La réaction est une simple mise en solution du benzoate de sodium et de l'acide benzoïque.",
    },
    "carbonate-sodium": {
      equation: "C6H5COOH + Na2CO3 → C6H5COONa + CO2 + H2O",
      explication:
        "Le produit formé est le benzoate de sodium, avec dégagement de dioxyde de carbone et d'eau.",
    },
  },
  "acide-propanoique": {
    ammoniac: {
      equation: "CH3CH2COOH + NH3 → CH3CH2COONH4",
      explication:
        "Le produit formé est le propanoate d'ammonium, un sel de l'acide propanoïque et de l'ammoniac.",
    },
    aniline: {
      equation: "CH3CH2COOH + C6H5NH2 → C6H5NH3+ + CH3CH2COO-",
      explication:
        "Le produit formé est le propanoate de phénylméthylammonium, un sel de l'acide propanoïque et de l'aniline.",
    },
    "acetate-ammonium": {
      equation: "CH3CH2COOH + CH3COONH4 → CH3CH2COONH4 + CH3COOH",
      explication:
        "La réaction est une simple mise en solution du propanoate d'ammonium et de l'acide propanoïque.",
    },
    "ethanoate-sodium": {
      equation: "CH3CH2COOH + CH3COONa → CH3CH2COONa + CH3COOH",
      explication:
        "La réaction est une simple mise en solution du propanoate de sodium et de l'acide propanoïque.",
    },
    "carbonate-sodium": {
      equation: "CH3CH2COOH + Na2CO3 → CH3CH2COONa + CO2 + H2O",
      explication:
        "Le produit formé est le propanoate de sodium, avec dégagement de dioxyde de carbone et d'eau.",
    },
  },
  "acide-butanoique": {
    ammoniac: {
      equation: "CH3CH2CH2COOH + NH3 → CH3CH2CH2COONH4",
      explication:
        "Le produit formé est le butanoate d'ammonium, un sel de l'acide butanoïque et de l'ammoniac.",
    },
    aniline: {
      equation: "CH3CH2CH2COOH + C6H5NH2 → C6H5NH3+ + CH3CH2CH2COO-",
      explication:
        "Le produit formé est le butanoate de phénylméthylammonium, un sel de l'acide butanoïque et de l'aniline.",
    },
    "acetate-ammonium": {
      equation: "CH3CH2CH2COOH + CH3COONH4 → CH3COONH4 + CH3CH2CH2COOH",
      explication:
        "La réaction est une simple mise en solution du butanoate d'ammonium et de l'acide butanoïque.",
    },
    "ethanoate-sodium": {
      equation: "CH3CH2CH2COOH + CH3COONa → CH3COONa + CH3CH2CH2COOH",
      explication:
        "La réaction est une simple mise en solution du butanoate de sodium et de l'acide butanoïque.",
    },
    "carbonate-sodium": {
      equation: "CH3CH2CH2COOH + Na2CO3 → CH3CH2CH2COONa + CO2 + H2O",
      explication:
        "Le produit formé est le butanoate de sodium, avec dégagement de dioxyde de carbone et d'eau.",
    },
  },
  "acide-heptanoique": {
    ammoniac: {
      equation: "(CH3(CH2)5COOH) + NH3 → (CH3(CH2)5COONH4)",
      explication:
        "Le produit formé est l'heptanoate d'ammonium, un sel de l'acide heptanoïque et de l'ammoniac.",
    },
    aniline: {
      equation: "(CH3(CH2)5COOH) + C6H5NH2 → C6H5NH3+ + (CH3(CH2)5COO-)",
      explication:
        "Le produit formé est l'heptanoate de phénylméthylammonium, un sel de l'acide heptanoïque et de l'aniline.",
    },
    "acetate-ammonium": {
      equation: "(CH3(CH2)5COOH) + CH3COONH4 → CH3COONH4 + (CH3(CH2)5COOH)",
      explication:
        "La réaction est une simple mise en solution de l'heptanoate d'ammonium et de l'acide heptanoïque.",
    },
    "ethanoate-sodium": {
      equation: "(CH3(CH2)5COOH) + CH3COONa → CH3COONa + (CH3(CH2)5COOH)",
      explication:
        "La réaction est une simple mise en solution de l'heptanoate de sodium et de l'acide heptanoïque.",
    },
    "carbonate-sodium": {
      equation: "(CH3(CH2)5COOH) + Na2CO3 → CH3COONa + CO2 + H2O",
      explication:
        "Le produit formé est l'heptanoate de sodium, avec dégagement de dioxyde de carbone et d'eau.",
    },
  },
};

// Fonction pour générer l'équation
function genererEquation() {
  const acide = document.getElementById("acide-faible").value;
  const base = document.getElementById("base-faible").value;

  // Afficher l'animation de chargement
  document.getElementById("equation-bilan").innerHTML =
    '<span class="loading">Génération en cours</span>';

  setTimeout(() => {
    let equation = "Combinaison invalide";
    let explication =
      "Cette combinaison n'est pas disponible dans la base de données.";

    // Vérifier si la combinaison existe dans la base de données
    if (reactions[acide] && reactions[acide][base]) {
      equation = reactions[acide][base].equation;
      explication = reactions[acide][base].explication;
    }

    // Afficher les résultats avec animation
    const equationElement = document.getElementById("equation-bilan");
    const explicationElement = document.getElementById("explication");

    equationElement.style.opacity = "0";
    equationElement.innerText = equation;
    explicationElement.innerText = explication;

    setTimeout(() => {
      equationElement.style.opacity = "1";
      equationElement.classList.add("show");
    }, 50);
  }, 500);
}
