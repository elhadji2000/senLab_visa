// Configuration de la scène Three.js
class MoleculeViewer {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.models = {};
        this.currentModel = null;
        
        this.init();
        this.setupLights();
        this.setupControls();
    }

    init() {
        const container = document.getElementById('molecule-viewer');
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor(0xf8f9fa);
        container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 5;
        
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);

        // Ajout d'une lumière d'appoint pour meilleure visibilité
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        this.scene.add(hemisphereLight);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 2.0;
    }

    loadMolecule(moleculeData) {
        // Afficher un indicateur de chargement
        this.showLoadingIndicator();

        if (this.models[moleculeData.objet3D]) {
            this.showModel(moleculeData.objet3D);
            this.hideLoadingIndicator();
        } else {
            const loader = new THREE.GLTFLoader();
            loader.load(
                `../assets/models/${moleculeData.objet3D}`,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(0.5, 0.5, 0.5);
                    this.models[moleculeData.objet3D] = model;
                    this.scene.add(model);
                    this.showModel(moleculeData.objet3D);
                    this.hideLoadingIndicator();
                },
                (xhr) => {
                    // Progression du chargement
                    const percentComplete = (xhr.loaded / xhr.total) * 100;
                    this.updateLoadingProgress(percentComplete);
                },
                (error) => {
                    console.error('Erreur de chargement du modèle:', error);
                    this.hideLoadingIndicator();
                    this.showErrorMessage();
                }
            );
        }
        this.updateDescription(moleculeData.description);
    }

    showModel(modelId) {
        Object.values(this.models).forEach(model => model.visible = false);
        if (this.models[modelId]) {
            this.models[modelId].visible = true;
            this.currentModel = this.models[modelId];
            
            // Réinitialiser la position de la caméra
            this.camera.position.set(0, 0, 5);
            this.controls.reset();
        }
    }

    updateDescription(description) {
        const descriptionElement = document.getElementById('molecule-description');
        descriptionElement.style.opacity = '0';
        
        setTimeout(() => {
            descriptionElement.textContent = description;
            descriptionElement.style.opacity = '1';
        }, 300);
    }

    showLoadingIndicator() {
        const viewer = document.getElementById('molecule-viewer');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-indicator';
        loadingDiv.innerHTML = '<div class="spinner"></div><p>Chargement du modèle...</p>';
        viewer.appendChild(loadingDiv);
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    updateLoadingProgress(percent) {
        const loadingIndicator = document.querySelector('.loading-indicator p');
        if (loadingIndicator) {
            loadingIndicator.textContent = `Chargement: ${Math.round(percent)}%`;
        }
    }

    showErrorMessage() {
        const viewer = document.getElementById('molecule-viewer');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = "Erreur lors du chargement du modèle 3D";
        viewer.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 3000);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.currentModel) {
            this.currentModel.rotation.y += 0.005;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const container = document.getElementById('molecule-viewer');
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    toggleAutoRotate() {
        this.controls.autoRotate = !this.controls.autoRotate;
    }

    resetView() {
        this.camera.position.set(0, 0, 5);
        this.controls.reset();
    }
}

// Gestion du modal
function closeModal() {
    document.getElementById('welcome-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Créer l'instance du viewer
    const viewer = new MoleculeViewer();
    viewer.animate();

    // Remplir le tableau
    const tbody = document.querySelector('#molecules-table tbody');
    moleculesData.forEach(molecule => {
        const row = document.createElement('tr');
        
        // Nom de la molécule
        const nomCell = document.createElement('td');
        nomCell.textContent = molecule.nom;
        row.appendChild(nomCell);
        
        // Type
        const typeCell = document.createElement('td');
        typeCell.textContent = molecule.type;
        row.appendChild(typeCell);
        
        // Bouton de visualisation
        const buttonCell = document.createElement('td');
        const viewButton = document.createElement('button');
        viewButton.className = 'view-button';
        viewButton.textContent = 'Voir en 3D';
        viewButton.addEventListener('click', () => {
            viewer.loadMolecule(molecule);
            
            // Faire défiler jusqu'au visualiseur
            document.getElementById('molecule-viewer').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
        buttonCell.appendChild(viewButton);
        row.appendChild(buttonCell);
        
        tbody.appendChild(row);
    });

    // Ajouter des contrôles supplémentaires
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'viewer-controls';
    
    // Bouton de rotation automatique
    const autoRotateButton = document.createElement('button');
    autoRotateButton.className = 'control-button';
    autoRotateButton.textContent = 'Auto-rotation';
    autoRotateButton.onclick = () => viewer.toggleAutoRotate();
    
    // Bouton de réinitialisation de la vue
    const resetButton = document.createElement('button');
    resetButton.className = 'control-button';
    resetButton.textContent = 'Réinitialiser la vue';
    resetButton.onclick = () => viewer.resetView();
    
    controlsDiv.appendChild(autoRotateButton);
    controlsDiv.appendChild(resetButton);
    document.getElementById('molecule-viewer').appendChild(controlsDiv);

    // Afficher le modal de bienvenue
    document.getElementById('welcome-modal').style.display = 'block';
    document.getElementById('modal-overlay').style.display = 'block';
});