document.addEventListener("DOMContentLoaded", (event) => {
  let scene, camera, renderer, controls;
  let table,
    walls,
    floor,
    agitator,
    stand,
    tube,
    beaker,
    beakerLiquid,
    pipette,
    shelf;
  let agitatorLight;
  let agitatorRunning = false;
  let agitatorDirection = 1;
  let liquidLevel = 0;
  let indicatorAdded = false;
  let initialPipettePosition;

  init();
  animate();

  function init() {
    // Configuration de la scène
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("three-canvas").appendChild(renderer.domElement);

    // Ajout des contrôles OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1.5, 3); // Ajuster la position de la caméra
    controls.update();

    // Lumières de base
    const ambientLight = new THREE.AmbientLight(0x404040); // Lumière ambiante douce
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Créer une chambre (boîte)
    const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
    const roomMaterial = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      side: THREE.BackSide,
    });
    walls = new THREE.Mesh(roomGeometry, roomMaterial);
    scene.add(walls);

    // Ajouter un sol avec des carreaux
    const floorTexture = new THREE.TextureLoader().load(
      "assets/images/carreaux.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ map: texture });
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; // Tourner le sol pour qu'il soit horizontal
        floor.position.y = 0;
        scene.add(floor);
      }
    );

    // Créer une table simple avec des géométries de base
    const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const tableTop = new THREE.Mesh(tableGeometry, tableMaterial);
    tableTop.position.set(0, 0.55, 0); // Élever légèrement la table pour qu'elle soit au-dessus du sol
    scene.add(tableTop);

    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const legPositions = [
      [-0.9, 0, -0.4],
      [-0.9, 0, 0.4],
      [0.9, 0, -0.4],
      [0.9, 0, 0.4],
    ];

    legPositions.forEach((position) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...position);
      leg.position.y = 0.05; // Fixer la table au sol
      scene.add(leg);
    });

    // Initialiser l'agitateur
    const loader = new THREE.GLTFLoader();
    loader.load("assets/models/agitateur1.glb", function (gltf) {
      agitator = gltf.scene;
      agitator.scale.set(0.3, 0.3, 0.17);
      agitator.position.set(0.5, 0.799, 0); // Ajuster la position de l'agitateur
      agitator.rotation.y = -Math.PI / 2; // Tourner l'agitateur à droite (90 degrés)
      scene.add(agitator);

      // Ajouter une lampe témoin
      const lightGeometry = new THREE.SphereGeometry(0.02, 32, 32); // Petite lampe
      const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Rouge pour éteint
      agitatorLight = new THREE.Mesh(lightGeometry, lightMaterial);
      agitatorLight.position.set(0, 0.3, 0); // Positionner la lampe sur l'agitateur
      agitator.add(agitatorLight);
    });

    // Charger et ajouter la potence (stand)
    loader.load("assets/models/barre.glb", function (gltf) {
      stand = gltf.scene;
      stand.scale.set(0.5, 1, 1);
      stand.position.set(0.1, 1.65, 0.21); // Ajuster la position de la potence
      stand.rotation.y = -Math.PI / 2; // Tourner la potence à droite (90 degrés)
      scene.add(stand);
    });

    // Charger et ajouter le bécher
    loader.load("assets/models/becher.glb", function (gltf) {
      beaker = gltf.scene;
      beaker.scale.set(0.03, 0.03, 0.03);
      beaker.position.set(0.5, 1.1, 0); // Ajuster la position du bécher
      scene.add(beaker);

      // Initialiser le liquide dans le bécher
      beakerLiquid = createLiquidMesh(0.18, 0.1, 0xffffff); // Liquide incolore initialement
      beakerLiquid.material.opacity = 0.5; // Ajuster l'opacité pour rendre le liquide semi-transparent
      beakerLiquid.material.transparent = true;
      beakerLiquid.position.set(0.5, 1.1 + 0.05, 0); // Ajuster la position du liquide
      scene.add(beakerLiquid);
    });

    // Charger et ajouter le tube
    loader.load("assets/models/tube.glb", function (gltf) {
      tube = gltf.scene;
      tube.scale.set(0.08, 0.08, 0.08);
      tube.position.set(0.5, 1.5, 0); // Ajuster la position du tube
      scene.add(tube);
    });

    // Charger et ajouter la pipette
    loader.load("assets/models/pipette.glb", function (gltf) {
      pipette = gltf.scene;
      pipette.scale.set(0.8, 0.8, 0.7);
      pipette.position.set(0.4, 1.8, 0); // Position initiale de la pipette
      initialPipettePosition = pipette.position.clone(); // Enregistrer la position initiale
      scene.add(pipette);
    });

    // Ajouter l'étagère
    addShelf();

    // Ajouter les écouteurs d'événements pour les boutons
    document
      .getElementById("start-agitator")
      .addEventListener("click", startAgitator);
    document
      .getElementById("stop-agitator")
      .addEventListener("click", stopAgitator);
    document
      .getElementById("start-dosage")
      .addEventListener("click", pourLiquid);
    document
      .getElementById("add-indicator")
      .addEventListener("click", addIndicator);

    // Initialiser le graphique de titration
    const ctx = document.getElementById("titration-chart").getContext("2d");
    titrationChart = new Chart(ctx, { // Suppression du 'const'
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "pH en fonction du volume",
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#555",
              font: {
                size: 14,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `Volume : ${context.label} mL, pH : ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Volume (mL)",
              color: "#333",
              font: {
                size: 16,
              },
            },
            ticks: {
              color: "#666",
            },
          },
          y: {
            title: {
              display: true,
              text: "pH",
              color: "#333",
              font: {
                size: 16,
              },
            },
            ticks: {
              color: "#666",
              callback: function (value) {
                return value.toFixed(1);
              },
            },
          },
        },
      },
    });
  }

  // Fonction pour créer un maillage de liquide
  function createLiquidMesh(radius, initialHeight, color) {
    const liquidGeometry = new THREE.CylinderGeometry(
      radius,
      radius,
      initialHeight,
      32
    );
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: color,
      opacity: 0.5,
      transparent: true,
    });
    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    return liquidMesh;
  }

  // Fonction pour ajouter l'étagère
  function addShelf() {
    const shelfWidth = 2;
    const shelfHeight = 0.1;
    const shelfDepth = 0.5;
    const shelfLevels = 4;
    const shelfSpacing = 1;

    const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    // Créer les niveaux de l'étagère
    for (let i = 0; i < shelfLevels; i++) {
      const shelfGeometry = new THREE.BoxGeometry(
        shelfWidth,
        shelfHeight,
        shelfDepth
      );
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(-3, i * shelfSpacing + 0.5, -3);
      scene.add(shelf);
    }

    // Créer les supports verticaux de l'étagère
    const supportWidth = 0.1;
    const supportHeight = (shelfLevels - 1) * shelfSpacing + shelfHeight;
    const supportDepth = 0.1;

    const supportGeometry = new THREE.BoxGeometry(
      supportWidth,
      supportHeight,
      supportDepth
    );
    const supportPositions = [
      [
        -3 - shelfWidth / 2 + supportWidth / 2,
        supportHeight / 2,
        -3 - shelfDepth / 2 + supportDepth / 2,
      ],
      [
        -3 - shelfWidth / 2 + supportWidth / 2,
        supportHeight / 2,
        -3 + shelfDepth / 2 - supportDepth / 2,
      ],
      [
        -3 + shelfWidth / 2 - supportWidth / 2,
        supportHeight / 2,
        -3 - shelfDepth / 2 + supportDepth / 2,
      ],
      [
        -3 + shelfWidth / 2 - supportWidth / 2,
        supportHeight / 2,
        -3 + shelfDepth / 2 - supportDepth / 2,
      ],
    ];

    supportPositions.forEach((position) => {
      const support = new THREE.Mesh(supportGeometry, shelfMaterial);
      support.position.set(...position);
      scene.add(support);
    });
  }

  // Fonction pour mettre à jour le niveau de liquide
  function updateLiquidLevel(
    liquid,
    volume,
    maxVolume,
    initialHeight,
    initialPositionY
  ) {
    const height = (volume / maxVolume) * initialHeight;
    liquid.scale.y = height / initialHeight;
    liquid.position.y = initialPositionY + height / 2;
  }

  // Fonction pour verser le liquide de la base
  function pourLiquid() {
    const initialVolumeAcid = parseFloat(
      document.getElementById("volume-acid").value
    );
    const concentrationAcid = parseFloat(
      document.getElementById("concentration-acid").value
    );
    const concentrationBase = parseFloat(
      document.getElementById("concentration-base").value
    );
    const maxVolume = 100; // Volume maximum du bécher en mL

    document.getElementById("info").innerText = "Versement en cours...";

    let volumeBaseAdded = 0;
    const interval = setInterval(() => {
      if (volumeBaseAdded >= 50) {
        // Arrêter après 50 mL de base ajoutée
        clearInterval(interval);
        document.getElementById("info").innerText = "Versement terminé!";
        return;
      }

      // Créer des gouttes de liquide
      const drop1 = createLiquidMesh(0.01, 0.02, 0x0000ff);
      const drop2 = createLiquidMesh(0.01, 0.02, 0x0000ff);
      const drop3 = createLiquidMesh(0.01, 0.02, 0x0000ff);

      drop1.position.set(0.5, 1.6, 0);
      drop2.position.set(0.5, 1.5, 0);
      drop3.position.set(0.5, 1.4, 0);

      scene.add(drop1);

      setTimeout(() => {
        scene.add(drop2);
      }, 300); // Délai avant apparition de la deuxième goutte

      setTimeout(() => {
        scene.add(drop3);
      }, 600); // Délai avant apparition de la troisième goutte

      setTimeout(() => {
        scene.remove(drop1);
        scene.remove(drop2);
        scene.remove(drop3);
        liquidLevel += 1.5; // Augmenter le niveau de liquide dans le bécher
        volumeBaseAdded += 1.5; // Augmenter le volume de la base ajoutée
        updateLiquidLevel(beakerLiquid, liquidLevel, maxVolume, 0.1, 1.1);

        // Calculer le pH et mettre à jour la couleur
        const ph = calculatePH(
          volumeBaseAdded,
          initialVolumeAcid,
          concentrationAcid,
          concentrationBase
        );
        updateLiquidColorByPH(ph);

        // Mise à jour du graphique de titration
        titrationChart.data.labels.push(volumeBaseAdded.toFixed(1));
        titrationChart.data.datasets[0].data.push(ph);
        titrationChart.update();

        document.getElementById("info").innerText = `pH actuel : ${ph.toFixed(
          2
        )}`;
      }, 1000); // Délai avant que les gouttes disparaissent
    }, 2000); // Intervalle entre chaque série de gouttes
  }

  // Fonction pour calculer le pH
  function calculatePH(
    volumeBase,
    volumeAcid,
    concentrationAcid,
    concentrationBase
  ) {
    const molesAcid = volumeAcid * concentrationAcid;
    const molesBase = volumeBase * concentrationBase;
    const molesHPlus = molesAcid - molesBase;

    let ph;
    if (molesHPlus > 0) {
      ph = -Math.log10(molesHPlus / (volumeAcid + volumeBase));
    } else {
      const molesOHMinus = molesBase - molesAcid;
      ph = 14 + Math.log10(molesOHMinus / (volumeAcid + volumeBase));
    }

    return ph;
  }

  // Fonction pour mettre à jour la couleur du liquide en fonction du pH
  function updateLiquidColorByPH(ph) {
    if (indicatorAdded) {
      if (ph < 7) {
        beakerLiquid.material.color.set(0xffcccc); // Rose clair pour acide
      } else if (ph >= 7 && ph < 9) {
        beakerLiquid.material.color.set(0xff00ff); // Rose/pourpre pour point d'équivalence
      } else {
        beakerLiquid.material.color.set(0xcc0099); // Rose foncé pour base
      }
    }
  }

  // Fonction pour démarrer l'agitateur
  function startAgitator() {
    if (agitator && !agitatorRunning) {
      agitatorRunning = true;
      agitatorLight.material.color.set(0x00ff00); // Vert pour allumé
      document.getElementById("info").innerText = "Agitateur allumé";

      const agitatorInterval = setInterval(() => {
        if (!agitatorRunning) {
          clearInterval(agitatorInterval);
          return;
        }
        agitator.position.x += 0.005 * agitatorDirection; // Réduire la distance de déplacement
        if (agitator.position.x > 0.55 || agitator.position.x < 0.45) {
          agitatorDirection *= -1;
        }
      }, 100);
    }
  }

  // Fonction pour arrêter l'agitateur
  function stopAgitator() {
    if (agitator && agitatorRunning) {
      agitatorRunning = false;
      agitatorLight.material.color.set(0xff0000); // Rouge pour éteint
      document.getElementById("info").innerText = "Agitateur éteint";
    }
  }

  // Fonction pour ajouter l'indicateur
  function addIndicator() {
    // Animation de la pipette avec apparition de quatre cercles
    const circle1 = createLiquidMesh(0.02, 0.02, 0xff00ff); // Cercle de couleur rose/pourpre
    const circle2 = createLiquidMesh(0.02, 0.02, 0xff00ff); // Cercle de couleur rose/pourpre
    const circle3 = createLiquidMesh(0.02, 0.02, 0xff00ff); // Cercle de couleur rose/pourpre
    const circle4 = createLiquidMesh(0.02, 0.02, 0xff00ff); // Cercle de couleur rose/pourpre

    circle1.position.set(
      pipette.position.x,
      pipette.position.y,
      pipette.position.z
    );
    circle2.position.set(
      pipette.position.x,
      pipette.position.y - 0.1,
      pipette.position.z
    );
    circle3.position.set(
      pipette.position.x,
      pipette.position.y - 0.2,
      pipette.position.z
    );
    circle4.position.set(
      pipette.position.x,
      pipette.position.y - 0.3,
      pipette.position.z
    );

    scene.add(circle1);
    setTimeout(() => {
      scene.add(circle2);
    }, 300);
    setTimeout(() => {
      scene.add(circle3);
    }, 600);
    setTimeout(() => {
      scene.add(circle4);
    }, 900);

    setTimeout(() => {
      scene.remove(circle1);
      scene.remove(circle2);
      scene.remove(circle3);
      scene.remove(circle4);
      indicatorAdded = true;
      document.getElementById("info").innerText = "Indicateur ajouté";
    }, 1200);
  }

  // Fonction d'animation principale
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
});
