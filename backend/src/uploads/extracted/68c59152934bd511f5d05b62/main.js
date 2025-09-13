document.addEventListener('DOMContentLoaded', () => {
    const aminoAcids = [
        { name: 'Glycine', category: 'non-polaire', description: 'Simple et non polaire.', image: 'assets/images/glycinee.jpeg' },
        { name: 'Alanine', category: 'non-polaire', description: 'Hydrophobe et non polaire.', image: 'assets/images/alanine.png' },
        { name: 'Sérine', category: 'polaire', description: 'Hydrophile et polaire.', image: 'assets/images/serine.png' }
    ];

    const cardsContainer = document.getElementById('cards');
    const categories = document.querySelectorAll('.category');
    const resultsContainer = document.getElementById('results');
    const scoreElement = document.getElementById('score');
    const emojiElement = document.getElementById('emoji');

    // Ajouter les cartes dynamiquement
    aminoAcids.forEach(acid => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('draggable', 'true');
        card.dataset.category = acid.category;

        const img = document.createElement('img');
        img.src = acid.image;
        img.alt = acid.name;
        img.style.width = '80px';
        img.style.height = '80px';

        const text = document.createElement('div');
        text.textContent = acid.name;

        card.appendChild(img);
        card.appendChild(text);
        cardsContainer.appendChild(card);
    });

    // Gestion du drag and drop
    categories.forEach(category => {
        category.addEventListener('dragover', (event) => {
            event.preventDefault();
            category.classList.add('dragover');
        });

        category.addEventListener('dragleave', () => {
            category.classList.remove('dragover');
        });

        category.addEventListener('drop', (event) => {
            event.preventDefault();
            const draggedCard = document.querySelector('.dragging');
            if (draggedCard) {
                category.appendChild(draggedCard);
                category.classList.remove('dragover');
            }
        });
    });

    document.addEventListener('dragstart', (event) => {
        if (event.target.classList.contains('card')) {
            event.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', (event) => {
        if (event.target.classList.contains('card')) {
            event.target.classList.remove('dragging');
        }
    });

    document.getElementById('check-results').addEventListener('click', () => {
        let correctCount = 0;

        categories.forEach(category => {
            const expectedCategory = category.id;
            const cardsInCategory = category.querySelectorAll('.card');

            cardsInCategory.forEach(card => {
                if (card.dataset.category === expectedCategory) {
                    correctCount++;
                    card.classList.add('correct');
                    card.classList.remove('incorrect');
                } else {
                    card.classList.add('incorrect');
                    card.classList.remove('correct');
                }
            });
        });

        const percentage = (correctCount / aminoAcids.length) * 100;

        scoreElement.textContent = `Score: ${correctCount} / ${aminoAcids.length}`;
        emojiElement.textContent = percentage === 100 ? '😃' : percentage >= 75 ? '😊' : percentage >= 50 ? '😐' : '😢';
    });

    document.getElementById('close-alert-btn').addEventListener('click', () => {
        document.getElementById('custom-alert').style.display = 'none';
    });

    // Afficher l'alerte au chargement
    document.getElementById('custom-alert').style.display = 'block';
});
