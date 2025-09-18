document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pKaForm');
    const resultsContainer = document.getElementById('results');
    const ctx = document.getElementById('phChart').getContext('2d');

    let phChart = initChart(ctx);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const initialConcentration = parseFloat(document.getElementById('initialConcentration').value);
        const hydrogenConcentration = parseFloat(document.getElementById('hydrogenConcentration').value);

        if (initialConcentration > 0 && hydrogenConcentration > 0) {
            const pKa = -Math.log10(hydrogenConcentration / initialConcentration);
            resultsContainer.innerHTML = `<strong>Le pKa de l'acide est :</strong> ${pKa.toFixed(2)}`;

            updateChart(phChart, pKa);
        } else {
            resultsContainer.innerHTML = `<strong>Erreur :</strong> Les concentrations doivent être positives.`;
        }
    });

    document.getElementById('explanationModal').style.display = 'block';
});

// Fonction pour fermer la modale
function closeModal() {
    document.getElementById('explanationModal').style.display = 'none';
}

// Fonction pour initialiser le graphique
function initChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'pH',
                data: [],
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'pH'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Concentration de base (mol/L)'
                    }
                }
            }
        }
    });
}

// Fonction pour mettre à jour le graphique
function updateChart(chart, pKa) {
    const concentrations = Array.from({ length: 10 }, (_, i) => 0.1 * (i + 1));
    const phValues = concentrations.map(concentration => -Math.log10(10 ** (-pKa) / concentration));

    chart.data.labels = concentrations.map(c => `${c.toFixed(2)} M`);
    chart.data.datasets[0].data = phValues;
    chart.update();
}
