
        let scene, camera, renderer, pancreas, liver, muscleImage, otherImage, mealModels = [], redMolecules = [], blueMoleculeBlock = [];
        let glucoseLevel = 0;
        let isHyperglycemiaAlert = false; // Indique si une alerte d'hyperglycémie est affichée
        let isSimulationRunning = false; // Indique si une simulation est en cours

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
    
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
    
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 1, 1).normalize();
            scene.add(light);
    
            const loader = new THREE.GLTFLoader();
            loader.load('./assets/models/pancreas3.glb', gltf => {
                pancreas = gltf.scene;
                pancreas.scale.set(0.1, 0.1, 0.1);
                pancreas.position.set(-3, 1.5, 0);
                scene.add(pancreas);
                addTextLabel(pancreas, "Pancréas", 1, -1.5);
            }, onError);
    
            loader.load('./assets/models/foie2.glb', gltf => {
                liver = gltf.scene;
                liver.scale.set(5, 5, 5);
                liver.position.set(2, 1, 0.1);
                scene.add(liver);
                addTextLabel(liver, "Foie", 2, -1.5);
            }, onError);
    
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load('./assets/images/muscle.png', texture => {
                muscleImage = createSprite(texture, 2, 2, 3, -1, 0, "Muscle");
            }, onError);
    
            textureLoader.load('./assets/images/cellule.png', texture => {
                otherImage = createSprite(texture, 2, 2, -3.5, 0, 0, "Cellule Beta");
            }, onError);
    
            for (let i = 0; i < 3; i++) {
                loader.load('./assets/models/cake.glb', gltf => {
                    let cake = gltf.scene;
                    cake.scale.set(15, 15, 15);
                    cake.position.set(-5 + (i * -1), 0, 0);
                    cake.visible = false;
                    mealModels.push(cake);
                    scene.add(cake);
                }, onError);
            }
    
            // Créer 10 molécules rouges initiales
            createRedMolecules(10);
            animateRedMolecules();
            showMessage('Glycémie normale à 1g/l ');
    
            animate();
        }
    
        function onError(error) {
            console.error(error);
        }
    
        function createSprite(texture, scaleX, scaleY, posX, posY, posZ, label) {
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(scaleX, scaleY, scaleY);
            sprite.position.set(posX, posY, posZ);
            scene.add(sprite);
            addTextLabel(sprite, label, 1, -1.5);
            return sprite;
        }
    
        function addTextLabel(object, text, xOffset = 0, yOffset = 0) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = 'Bold 24px Arial';
            context.fillStyle = '#000000';
            context.fillText(text, 0, 20);
    
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(3, 1.5, 1);
            sprite.position.set(object.position.x + xOffset, object.position.y + yOffset, object.position.z);
            scene.add(sprite);
        }
    
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
       // foncton qui gere lanimation     du cake et toutes les methodes en repport 
        function moveMealModel() {
            startSimulation(); // Démarrer la simulation
            let mealModel = mealModels[0];
            mealModel.visible = true;
            mealModel.position.set(-5, 0, 0);
            let targetPosition = new THREE.Vector3(0, 0, 0);
    
            gsap.to(mealModel.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 5, // Accélération de l'animation du cake
                onComplete: function () {
                    mealModel.visible = false;
                    showMessage('Le repas a été digéré, création des molécules de glucose.');
                    setTimeout(() => {
                        let additionalMolecules = glucoseLevel > 0 ? glucoseLevel : 20;
                        createRedMolecules(additionalMolecules);
                        showMessage('Les molécules de glucose sont libérées dans le sang.');
                        animateRedMolecules();
                        checkGlucoseLevels(); // Vérifiez les niveaux de glucose après génération
                        setTimeout(() => {
                            showMessage('Le pancréas détecte le glucose et s\'active.');
                            animatePancreas(additionalMolecules);
                        }, 5000); // Attendre 5 secondes avant d'animer le pancréas
                    }, 5000); // Attendre 5 secondes avant de créer des molécules de glucose
                }
            });
        }
          // les messages illustants les phénomene 
        function showMessage(message) {
            const messageBox = document.getElementById('message-box');
            messageBox.innerText = message;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, 10000); // Durée d'affichage des messages augmentée à 10 secondes
        }
        // creation des glucoses 
        function createRedMolecules(count) {
            for (let i = 0; i < count; i++) {
                const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(geometry, material);
    
                sphere.position.set(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
    
                redMolecules.push(sphere);
                scene.add(sphere);
            }
        }
        //l'animation des molecules
    
        function animateRedMolecules() {
            redMolecules.forEach(molecule => {
                animateMolecule(molecule);
            });
        }
    
        function animateMolecule(molecule) {
            gsap.to(molecule.position, {
                x: molecule.position.x + (Math.random() - 0.5) * 0.2,
                y: molecule.position.y + (Math.random() - 0.5) * 0.2,
                z: molecule.position.z + (Math.random() - 0.5) * 0.2,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    
        function animatePancreas(additionalMolecules) {
            gsap.to(pancreas.scale, {
                x: pancreas.scale.x * 1.2,
                y: pancreas.scale.y * 1.2,
                z: pancreas.scale.z * 1.2,
                duration: 1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onComplete: function () {
                    showMessage('Les cellules beta du pancréas produisent de l\'insuline.');
                    setTimeout(() => {
                        animateBetaCell(additionalMolecules);
                    }, 2000); // Attendre 2 secondes avant d'animer la cellule beta
                }
            });
        }
    
        function animateBetaCell(additionalMolecules) {
            gsap.to(otherImage.scale, {
                x: otherImage.scale.x * 1.2,
                y: otherImage.scale.y * 1.2,
                z: otherImage.scale.z * 1.2,
                duration: 1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                onComplete: function () {
                    showMessage('l\'insuline est libérées dans le sang.');
                    if (isHyperglycemiaAlert) {
                        hideHyperglycemiaAlert();
                    }
                    setTimeout(() => {
                        createInsulinBlock(additionalMolecules);
                    }, 2000); // Attendre 2 secondes avant de créer le bloc d'insuline
                }
            });
        }
    
        function createInsulinBlock(additionalMolecules) {
            const insulinBlock = [];
            const offset = 0.25;
            const count = Math.floor((additionalMolecules) / 10);
    
            for (let i = 0; i < count; i++) {
                const geometry = new THREE.SphereGeometry(0.2, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const sphere = new THREE.Mesh(geometry, material);
    
                sphere.position.set(
                    -3.5 + (i % 2) * offset, // Quitter le centre de la cellule beta
                    0.2 + Math.floor(i / 2) * offset,
                    0
                );
    
                insulinBlock.push(sphere);
                scene.add(sphere);
            }
    
            blueMoleculeBlock = insulinBlock;
    
            gsap.to(insulinBlock.map(molecule => molecule.position), {
                x: 0,
                y: 0,
                z: 0,
                duration: 5, // Accélération de l'animation du bloc d'insuline
                onComplete: function () {
                    showMessage('l\'insuline est secretée en fonction de la quantité de glucose dans le sang.');
                    distributeRedMolecules(additionalMolecules);
                }
            });
        }
    
        function distributeRedMolecules(additionalMolecules) {
            const liverTarget = new THREE.Vector3(2, 1, 0.1);
            const muscleTarget = new THREE.Vector3(3, -1, 0);
    
            const moleculesToDistribute = additionalMolecules;
            const half = Math.floor(moleculesToDistribute / 2);
    
            const liverMolecules = redMolecules.splice(0, half);
            const muscleMolecules = redMolecules.splice(0, half);
    
            muscleMolecules.forEach((molecule, index) => {
                gsap.to(molecule.position, {
                    x: muscleTarget.x,
                    y: muscleTarget.y,
                    z: muscleTarget.z,
                    duration: 10, // Durée de l'animation augmentée à 10 secondes
                    delay: index * 0.1,
                    onComplete: function () {
                        scene.remove(molecule);
                        if (index === muscleMolecules.length - 1) {
                            showMessage('le glucose est absorbé par les cellules du muscle afin de gerer la production d\'energie.');
                            animateOrgan(muscleImage);
                            setTimeout(() => {
                                moveInsulinBlockBack();
                                setTimeout(endSimulation, 2000); // Fin de la simulation après 2 secondes
                            }, 5000);
                        }
                    }
                });
                showMessage('L\'insilune favorise l\'absortion du glucose dans les cellules des muscles.');
            });
    
            setTimeout(() => {
                liverMolecules.forEach((molecule, index) => {
                    gsap.to(molecule.position, {
                        x: liverTarget.x,
                        y: liverTarget.y,
                        z: liverTarget.z,
                        duration: 10, // Durée de l'animation augmentée à 10 secondes
                        delay: index * 0.1,
                        onComplete: function () {
                            scene.remove(molecule);
                            if (index === liverMolecules.length - 1) {
                                showMessage('le glucose est stocké dans le foie sous format glycogéne comme réserve.');
                                animateOrgan(liver);
                                setTimeout(() => {
                                    moveInsulinBlockBack();
                                    setTimeout(endSimulation, 2000); // Fin de la simulation après 2 secondes
                                    showMessage('Glycémie régulée.');
                                }, 2000);
                            }
                        }
                    });
                    showMessage('L\'insilune favorise l\'absortion et le stockage du glucose dans le foie');
                });
            }, 20000); // Retard de 20 secondes pour gérer le foie après le muscle
           
        }
    
        function animateOrgan(organ) {
            gsap.to(organ.scale, {
                x: organ.scale.x * 1.2,
                y: organ.scale.y * 1.2,
                z: organ.scale.z * 1.2,
                duration: 1,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            });
        }
    
        function moveInsulinBlockBack() {
            gsap.to(blueMoleculeBlock.map(molecule => molecule.position), {
                x: 0,
                y: 0,
                z: 0,
                duration: 5,
                onComplete: function () {
                    removeInsulinBlock();
                }
            });
        }
    
        function removeInsulinBlock() {
            blueMoleculeBlock.forEach(molecule => {
                scene.remove(molecule);
            });
            blueMoleculeBlock = [];
        }
    
        function checkGlucoseLevels() {
            const glucoseCount = redMolecules.length;
    
            if (glucoseCount > 30) { // Vérifier l'hyperglycémie à partir de plus de 30 molécules
                showHyperglycemiaAlert();
            } else {
                hideHyperglycemiaAlert();
            }
    
            document.getElementById('normalButton').disabled = false;
        }
    
        function showHyperglycemiaAlert() {
            if (!isHyperglycemiaAlert) {
                showMessage('🚨 Hyperglycémie détectée ! 🚨');
                document.body.style.backgroundColor = 'red';
                isHyperglycemiaAlert = true;
            }
        }
    
        function hideHyperglycemiaAlert() {
            if (isHyperglycemiaAlert) {
                showMessage('Glycémie régularisée.');
                document.body.style.backgroundColor = '#101111';
                isHyperglycemiaAlert = false;
            }
        }
    
        document.getElementById('normalButton').addEventListener('click', function () {
            glucoseLevel = parseInt(document.getElementById('glucoseSlider').value, 10);
            moveMealModel();
            showMessage("Repas mangé, digestion en cours...");
        });
    
        document.getElementById('glucoseSlider').addEventListener('input', function () {
            glucoseLevel = parseInt(this.value, 10);
            showMessage(`Niveau de Glucose: ${glucoseLevel}`);
        });

        function startSimulation() {
            isSimulationRunning = true;
            document.getElementById('normalButton').disabled = true;
            document.getElementById('type1Button').disabled = true;
            document.getElementById('type2Button').disabled = true;
            document.getElementById('glucoseSlider').disabled = true;
        }
    
        function endSimulation() {
            isSimulationRunning = false;
            document.getElementById('normalButton').disabled = false;
            document.getElementById('type1Button').disabled = false;
            document.getElementById('type2Button').disabled = false;
            document.getElementById('glucoseSlider').disabled = false;
        }
    
        function resetSimulation() {
            location.reload(); // Recharger la page pour réinitialiser la simulation
        }
    
        init();
