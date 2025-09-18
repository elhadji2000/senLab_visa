// Fonction pour fermer l'alerte personnalisée
function closeCustomAlert() {
document.getElementById('custom-alert').style.display = 'none';
}

// Afficher l'alerte personnalisée à l'ouverture de la page
document.addEventListener('DOMContentLoaded', () => {
document.getElementById('custom-alert').style.display = 'block';
});

document.addEventListener('DOMContentLoaded', function () {
    const selectElement = document.getElementById('acid-base-select');
    const pipetteImg = document.getElementById('pipette-img');
    const phDisplay = document.getElementById('ph-display');
    const pipetteLiquid = document.getElementById('pipette-liquid');
    const liquidLevel = document.getElementById('liquid-level');
    const waterJet = document.querySelector('.water-jet');
    const drainLiquid = document.getElementById('drain-liquid');
    const liquidJet = document.querySelector('.liquid-jet');

    let currentSubstance = null; // Variable to store the current substance
    let waterAdded = 0; // Variable to track the amount of water added (in %)
    let liquidAdded = 0; // Variable to track the amount of liquid added (in %)

    if (!selectElement || !pipetteImg || !phDisplay || !pipetteLiquid || !liquidLevel || !waterJet || !drainLiquid || !liquidJet) {
        console.error("Un ou plusieurs éléments n'ont pas été trouvés.");
        return;
    }

    // List of acids and bases with their pH values
    const substances = {
        "CH3COOH": { type: "acid", pH: 4.76, color: "red", info: "L'acide acétique est un acide faible présent dans le vinaigre." },
        "HCOOH": { type: "acid", pH: 3.75, color: "red", info: "L'acide formique est un acide faible trouvé dans le venin de certaines fourmis." },
        "C6H5COOH": { type: "acid", pH: 4.2, color: "red", info: "L'acide benzoïque est un acide faible utilisé comme conservateur alimentaire." },
        "CH3CH2COOH": { type: "acid", pH: 4.87, color: "red", info: "L'acide propionique est utilisé comme conservateur dans les produits alimentaires." },
        "CH3(CH2)2COOH": { type: "acid", pH: 4.82, color: "red", info: "L'acide butyrique est présent dans les produits laitiers et a une odeur désagréable." },
        "NH3": { type: "base", pH: 11.6, color: "blue", info: "L'ammoniac est une base forte utilisée dans les produits de nettoyage." },
        "C6H5NH2": { type: "base", pH: 4.6, color: "blue", info: "L'aniline est une base faible utilisée dans la fabrication de colorants." },
        "CH3COONH4": { type: "base", pH: 9.25, color: "blue", info: "L'acétate d'ammonium est une base faible utilisée dans les solutions tampons." },
        "CH3COONa": { type: "base", pH: 9.0, color: "blue", info: "L'acétate de sodium est une base faible utilisée dans la cuisine moléculaire." },
        "Na2CO3": { type: "base", pH: 11.6, color: "blue", info: "Le carbonate de sodium est une base forte utilisée dans la fabrication de verre." }
    };

    // Event Listeners
    selectElement.addEventListener('change', changePipetteColor);
    pipetteImg.addEventListener('click', pourLiquid);
    document.querySelector('.water-tap img').addEventListener('click', increaseWaterLevel);
    document.querySelector('.drain-tap').addEventListener('click', drainBurette);
    document.getElementById('reset-button').addEventListener('click', resetBurette);

    function changePipetteColor() {
        const selectedValue = selectElement.value;

        if (selectedValue in substances) {
            currentSubstance = substances[selectedValue];
            pipetteLiquid.style.backgroundColor = currentSubstance.color;
            liquidLevel.style.backgroundColor = currentSubstance.color;
            liquidJet.style.backgroundColor = currentSubstance.color; // Change the liquid jet color
            updatePhDisplay();
            updateExplanatoryText(); // Mettre à jour le texte explicatif lors du changement de solution
        } else {
            currentSubstance = null;
            pipetteLiquid.style.backgroundColor = "rgb(218, 208, 208)"; // Couleur par défaut
            liquidLevel.style.backgroundColor = "blue"; // Couleur par défaut
            liquidJet.style.backgroundColor = "transparent"; // Default color for liquid jet
            phDisplay.textContent = "pH -";
            updateExplanatoryText(); // Réinitialiser le texte explicatif lorsqu'aucune solution n'est sélectionnée
        }
    }

    function updateExplanatoryText() {
        const solutionInfo = document.getElementById('solution-info');
        if (currentSubstance) {
            solutionInfo.textContent = currentSubstance.info;
        } else {
            solutionInfo.textContent = "Sélectionnez une solution pour afficher les informations.";
        }
    }

    function pourLiquid() {
        if (!currentSubstance) return;

        liquidAdded += 10; // Increase liquid added percentage by 10
        liquidAdded = Math.min(liquidAdded, 100); // Ensure it does not exceed 100%

        let currentHeight = parseFloat(liquidLevel.style.height) || 0;
        let pipetteHeight = parseFloat(pipetteLiquid.style.height) || 100;

        if (pipetteHeight > 0 && currentHeight < 100) {
            currentHeight += 10; // Increase liquid level height by 10%
            pipetteHeight -= 10; // Decrease pipette liquid height by 10%

            liquidLevel.style.height = `${currentHeight}%`;
            liquidLevel.textContent = `${(currentHeight / 20).toFixed(1)} L`; // Convert percentage to liters, 10% is 0.5L

            pipetteLiquid.style.height = `${pipetteHeight}%`;
        }

        liquidJet.style.display = 'block';
        setTimeout(() => {
            liquidJet.style.display = 'none'; // Hide liquid jet after 1 second
        }, 1000);

        updatePhDisplay();
        updateLiquidColor(); // Update the liquid color when the substance is added
    }

    function increaseWaterLevel() {
        let currentHeight = parseFloat(liquidLevel.style.height) || 0;

        if (currentHeight < 100) {
            waterAdded += 5; // Increase water added percentage by 5
            waterAdded = Math.min(waterAdded, 100); // Ensure it does not exceed 100%
            currentHeight += 5; // Increase liquid level height by 5%

            liquidLevel.style.height = `${currentHeight}%`;
            liquidLevel.textContent = `${(currentHeight / 20).toFixed(1)} L`; // Convert percentage to liters, 5% is 0.25L
            updatePhDisplay();
            updateLiquidColor(); // Update the liquid color when water is added
        }

        waterJet.style.display = 'block';
        setTimeout(() => {
            waterJet.style.display = 'none'; // Hide water jet after 1 second
        }, 1000);
    }

    function resetBurette() {
        waterAdded = 0;
        liquidAdded = 0;
        liquidLevel.style.height = "0%";
        liquidLevel.textContent = "0 L";
        pipetteLiquid.style.height = "100%";
        pipetteLiquid.style.display = 'none';
        liquidJet.style.display = 'none'; // Hide liquid jet
        phDisplay.textContent = "pH -";
    }

    function drainBurette() {
        if (!liquidLevel || !drainLiquid) {
            console.error("L'élément liquid-level ou drain-liquid n'a pas été trouvé.");
            return;
        }

        let currentHeight = parseFloat(liquidLevel.style.height) || 0;

        if (currentHeight > 0) {
            // Decrease the liquid level in the burette by 10% (0.1 L equivalent)
            currentHeight -= 10; // Decrease by 10% for each click

            liquidLevel.style.height = `${currentHeight}%`;
            liquidLevel.textContent = `${(currentHeight / 20).toFixed(1)} L`; // Convert percentage to liters (assuming full burette is 1 L)

            drainLiquid.style.display = 'block';
            drainLiquid.style.backgroundColor = liquidLevel.style.backgroundColor; // Match the color with the burette

            setTimeout(() => {
                drainLiquid.style.display = 'none';
            }, 1000); // 1000 milliseconds = 1 second
        }

        // Ensure the liquid level does not go below 0%
        if (currentHeight <= 0) {
            liquidLevel.style.height = '0%';
            liquidLevel.textContent = '0 L';
        }

        updatePhDisplay(); // Update the pH display after draining
        updateLiquidColor(); // Update the liquid color when draining
    }

    function updatePhDisplay() {
        if (!currentSubstance) {
            phDisplay.textContent = "pH -";
            return;
        }

        let totalVolume = waterAdded + liquidAdded;
        let concentration = liquidAdded / totalVolume;
        let newPh = (currentSubstance.pH * concentration) + (7 * (1 - concentration)); // Simplified mixing formula

        phDisplay.textContent = `pH ${newPh.toFixed(2)}`;
        updatePhArrow(); // Update the position of the arrow when pH changes
    }

    function updateLiquidColor() {
        if (!currentSubstance) return;

        // Calculate the new color based on the amount of water added
        let totalVolume = waterAdded + liquidAdded;
        let waterPercentage = waterAdded / totalVolume;
        let substancePercentage = liquidAdded / totalVolume;

        // Initial colors
        let substanceColor = currentSubstance.color === "red" ? [255, 0, 0] : [0, 0, 255];
        let waterColor = [255, 255, 255]; // White for water

        // Calculate new color
        let newColor = [
            Math.round(substanceColor[0] * substancePercentage + waterColor[0] * waterPercentage),
            Math.round(substanceColor[1] * substancePercentage + waterColor[1] * waterPercentage),
            Math.round(substanceColor[2] * substancePercentage + waterColor[2] * waterPercentage)
        ];

        // Update the liquid level color
        liquidLevel.style.backgroundColor = `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`;
    }

    // Add arrow element to HTML
    const phMeter = document.querySelector('.ph-scale');
    const arrow = document.createElement('div');
    arrow.id = 'ph-arrow';
    arrow.style.position = 'absolute';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '10px solid transparent';
    arrow.style.borderRight = '10px solid transparent';
    arrow.style.borderBottom = '20px solid black';
    arrow.style.left = '100%';
    phMeter.appendChild(arrow);

    function updatePhArrow() {
        if (!currentSubstance) return;

        let totalVolume = waterAdded + liquidAdded;
        let concentration = liquidAdded / totalVolume;
        let newPh = (currentSubstance.pH * concentration) + (7 * (1 - concentration)); // Simplified mixing formula

        // Map pH value to the scale position
        let scaleHeight = phMeter.clientHeight;
        let position = ((14 - newPh) / 14) * scaleHeight; // Assuming pH scale from 0 to 14

        arrow.style.top = `${position}px`;

        // Synchronize the pH display position with the arrow, offset slightly to avoid overlap
        phDisplay.style.top = `${position}px`;
        phDisplay.style.left = '120%'; // Adjust left
    }

    // Initial call to set the position of the arrow
    updatePhArrow();
});
