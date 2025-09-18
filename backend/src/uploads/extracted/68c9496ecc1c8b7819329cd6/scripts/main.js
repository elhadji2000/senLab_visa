document.addEventListener('DOMContentLoaded', () => {
    let scene, camera, renderer, controls, currentModel = null;

    const descriptions = {
        glycine: "La glycine est le plus simple des acides aminés.",
        alanine: "L'alanine aide à transformer le glucose en énergie.",
        isoleucine: "L'isoleucine est un acide aminé essentiel.",
        leucine: "La leucine favorise la croissance musculaire.",
        phenylalanine: "La phénylalanine influence l'humeur et le comportement.",
        serine: "La sérine est essentielle au métabolisme des graisses.",
        valine: "La valine stimule la croissance des tissus."
    };

    function init() {
        // Création de la scène
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.8 / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1, 3);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
        renderer.setClearColor(0xf4f9ff); // Fond clair
        document.getElementById('three-canvas').appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // Ajout de lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Lumière ambiante douce
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 2);
        directionalLight.castShadow = true; // Ajout d'ombres pour plus de profondeur
        scene.add(directionalLight);

        // Charger l'acide aminé par défaut
        document.getElementById('amino-acid-select').addEventListener('change', function () {
            loadAminoAcid(this.value);
        });
        loadAminoAcid('glycine');
        animate();
    }

    function loadAminoAcid(name) {
        if (currentModel) {
            scene.remove(currentModel);
        }

        const loader = new THREE.GLTFLoader();
        loader.load(`assets/models/${name}.glb`, (gltf) => {
            currentModel = gltf.scene;

            // Ajuster la taille et la position
            currentModel.scale.set(0.5, 0.5, 0.5); // Réduit la taille globale
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            currentModel.position.sub(center); // Centre le modèle

            scene.add(currentModel);
        });

        // Mettre à jour la description et l'image
        document.getElementById('description-text').textContent = descriptions[name];
        const image = document.getElementById('amino-acid-2d');
        image.src = `assets/images/${name}.png`;
        image.style.display = 'block';
    }

    function animate() {
        requestAnimationFrame(animate);

        if (currentModel) {
            currentModel.rotation.y += 0.01; // Rotation lente pour une meilleure visualisation
        }

        controls.update();
        renderer.render(scene, camera);
    }

    init();
});

function closeCustomAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}
