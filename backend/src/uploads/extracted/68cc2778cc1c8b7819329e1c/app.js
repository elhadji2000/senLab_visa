
        let scene, camera, renderer, pancreas, liver, muscleImage, otherImage, mealModels = [], redMolecules = [], blueMoleculeBlock = [];
        let glucoseLevel = 0;
        let isHyperglycemiaAlert = false;
        let isSimulationRunning = false;
        let diabetesType = null;

        // Initialise la scène 3D
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
            loader.load( './assets/models/pancreas3.glb', gltf => {
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

            createRedMolecules(10);
            animateRedMolecules();
            showMessage('Glycémie normale à 1g/l ');

            animate();
        }

        // Gestion des erreurs de chargement
        function onError(error) {
            console.error(error);
        }

        // Crée un sprite avec une texture donnée
        function createSprite(texture, scaleX, scaleY, posX, posY, posZ, label) {
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(scaleX, scaleY, scaleY);
            sprite.position.set(posX, posY, posZ);
            scene.add(sprite);
            addTextLabel(sprite, label, 1, -1.5);
            return sprite;
        }

        // Ajoute un texte de légende à un objet
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

        // Anime la scène en continu
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        // Déclenche la consommation d'un gâteau
        function moveMealModel() {
            startSimulation();
            let mealModel = mealModels[0];
            mealModel.visible = true;
            mealModel.position.set(-5, 0, 0);
            let targetPosition = new THREE.Vector3(0, 0, 0);

            gsap.to(mealModel.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 5,
                onComplete: function () {
                    mealModel.visible = false;
                    showMessage('Le repas a été digéré, création des molécules de glucose.');
                    setTimeout(() => {
                        let additionalMolecules = glucoseLevel > 0 ? glucoseLevel : 20;
                        createRedMolecules(additionalMolecules);
                        showHyperglycemiaAlert();
                        showMessage('Les molécules de glucose sont libérées dans le sang.');
                        animateRedMolecules();
                        setTimeout(() => {
                            if (diabetesType === 'type1') {
                                showMessage('Le pancréas ne produit pas d\'insuline. Les cellules bêta sont inactives.');
                                showInsulinButton();
                            } else {
                                showMessage('Le pancréas détecte le glucose et produit une petite quantité d\'insuline.');
                                animatePancreas(additionalMolecules);
                            }
                        }, 5000);
                    }, 5000);
                }
            });
        }

        // Affiche un message avec une durée définie
        function showMessage(message, duration = 15000) {
            const messageBox = document.getElementById('message-box');
            messageBox.innerText = message;
            messageBox.style.display = 'block';
            setTimeout(() => {
                messageBox.style.display = 'none';
            }, duration);
        }

        // Crée des molécules rouges (glucose)
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

        // Anime les molécules rouges
        function animateRedMolecules() {
            redMolecules.forEach(molecule => {
                animateMolecule(molecule);
            });
        }

        // Anime une molécule de manière aléatoire
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

        // Anime le pancréas
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
                    if (diabetesType === 'type2') {
                        additionalMolecules *= 0.4;
                    }
                    showMessage('Les cellules bêta produisent de l\'insuline.');
                    setTimeout(() => {
                        animateBetaCell(additionalMolecules);
                    }, 2000);
                }
            });
        }

        // Anime les cellules bêta
        function animateBetaCell(additionalMolecules) {
            if (diabetesType === 'type1') {
                otherImage.material.color.set(0xff0000); // Changer la couleur en rouge pour indiquer l'inactivation
                showInsulinButton();
            } else {
                gsap.to(otherImage
                .scale, {
                    x: otherImage.scale.x * 1.2,
                    y: otherImage.scale.y * 1.2,
                    z: otherImage.scale.z * 1.2,
                    duration: 1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut",
                    onComplete: function () {
                        showMessage('Une petite quantité d\'insuline est libérée dans le sang.');
                        setTimeout(() => {
                            createInsulinBlock(additionalMolecules);
                            showInterventionButtons();
                        }, 2000);
                    }
                });
            }
        }

        // Crée des blocs d'insuline
        function createInsulinBlock(additionalMolecules) {
            const insulinBlock = [];
            const offset = 0.25;
            const count = Math.floor((additionalMolecules) / 10);

            for (let i = 0; i < count; i++) {
                const geometry = new THREE.SphereGeometry(0.2, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const sphere = new THREE.Mesh(geometry, material);

                sphere.position.set(
                    -3.5 + (i % 2) * offset,
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
                duration: 5,
                onComplete: function () {
                    showMessage('L\'insuline est sécrétée en fonction de la quantité de glucose dans le sang.');
                    distributeRedMolecules(additionalMolecules);
                }
            });
        }

        // Affiche les boutons d'intervention pour le diabète de type 2
        function showInterventionButtons() {
            document.querySelector('.intervention-buttons').style.display = 'flex';
        }

        // Distribue les molécules rouges vers le foie et les muscles
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
                    duration: 10,
                    delay: index * 0.1,
                    onComplete: function () {
                        scene.remove(molecule);
                        if (index === muscleMolecules.length - 1) {
                            showMessage('Le glucose est absorbé par les cellules du muscle afin de gérer la production d\'énergie.');
                            animateOrgan(muscleImage);
                            setTimeout(() => {
                                moveInsulinBlockBack();
                                setTimeout(endSimulation, 2000);
                            }, 5000);
                        }
                    }
                });
                showMessage('L\'insuline favorise l\'absorption du glucose dans les cellules des muscles.');
            });

            setTimeout(() => {
                liverMolecules.forEach((molecule, index) => {
                    gsap.to(molecule.position, {
                        x: liverTarget.x,
                        y: liverTarget.y,
                        z: liverTarget.z,
                        duration: 10,
                        delay: index * 0.1,
                        onComplete: function () {
                            scene.remove(molecule);
                            if (index === liverMolecules.length - 1) {
                                showMessage('Le glucose est stocké dans le foie sous forme de glycogène comme réserve.');
                                animateOrgan(liver);
                                setTimeout(() => {
                                    moveInsulinBlockBack();
                                    setTimeout(endSimulation, 2000);
                                    showMessage('Glycémie régulée.');
                                }, 2000);
                            }
                        }
                    });
                    showMessage('L\'insuline favorise l\'absorption et le stockage du glucose dans le foie.');
                });
            }, 20000);
        }

        // Anime les organes (foie et muscles)
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

        // Ramène les blocs d'insuline à leur position initiale
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

        // Retire les blocs d'insuline de la scène
        function removeInsulinBlock() {
            blueMoleculeBlock.forEach(molecule => {
                scene.remove(molecule);
            });
            blueMoleculeBlock = [];
        }

        // Affiche une alerte d'hyperglycémie
        function showHyperglycemiaAlert() {
            if (!isHyperglycemiaAlert) {
                showMessage('🚨 Hyperglycémie détectée ! 🚨');
                document.body.style.backgroundColor = 'red';
                isHyperglycemiaAlert = true;
            }
        }

        // Masque l'alerte d'hyperglycémie
        function hideHyperglycemiaAlert() {
            if (isHyperglycemiaAlert) {
                showMessage('Glycémie régularisée.');
                document.body.style.backgroundColor = '#101111';
                isHyperglycemiaAlert = false;
            }
        }

        // Affiche le bouton d'injection d'insuline
        function showInsulinButton() {
            document.getElementById('insulin-button').style.display = 'block';
        }

        // Gère l'injection d'insuline pour le diabète de type 1
        function injectInsulin() {
            showMessage('Injection d\'insuline effectuée. Glycémie en cours de régulation.');
            createInsulinBlock(glucoseLevel); // Simuler la production d'insuline
            document.getElementById('insulin-button').style.display = 'none';
            otherImage.material.color.set(0xffffff); // Restaurer la couleur normale
            hideHyperglycemiaAlert();
        }

        // Gère l'exercice pour le diabète de type 2
        function exercise() {
            showMessage('Faire du sport aide à réguler la glycémie en augmentant l\'utilisation du glucose par les muscles.');
            distribute
            .scale, {
                    x: otherImage.scale.x * 1.2,
                    y: otherImage.scale.y * 1.2,
                    z: otherImage.scale.z * 1.2,
                    duration: 1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut",
                    onComplete: function () {
                        showMessage('Une petite quantité d\'insuline est libérée dans le sang.');
                        setTimeout(() => {
                            createInsulinBlock(additionalMolecules);
                            showInterventionButtons();
                        }, 2000);
                    }
                };
            }
       

        // Crée des blocs d'insuline
        function createInsulinBlock(additionalMolecules) {
            const insulinBlock = [];
            const offset = 0.25;
            const count = Math.floor((additionalMolecules) / 10);

            for (let i = 0; i < count; i++) {
                const geometry = new THREE.SphereGeometry(0.2, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const sphere = new THREE.Mesh(geometry, material);

                sphere.position.set(
                    -3.5 + (i % 2) * offset,
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
                duration: 5,
                onComplete: function () {
                    showMessage('L\'insuline est sécrétée en fonction de la quantité de glucose dans le sang.');
                    distributeRedMolecules(additionalMolecules);
                }
            });
        }

        // Affiche les boutons d'intervention pour le diabète de type 2
        function showInterventionButtons() {
            document.querySelector('.intervention-buttons').style.display = 'flex';
        }

        // Distribue les molécules rouges vers le foie et les muscles
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
                    duration: 10,
                    delay: index * 0.1,
                    onComplete: function () {
                        scene.remove(molecule);
                        if (index === muscleMolecules.length - 1) {
                            showMessage('Le glucose est absorbé par les cellules du muscle afin de gérer la production d\'énergie.');
                            animateOrgan(muscleImage);
                            setTimeout(() => {
                                moveInsulinBlockBack();
                                setTimeout(showInterventionButtons, 2000);
                            }, 5000);
                        }
                    }
                });
                showMessage('L\'insuline favorise l\'absorption du glucose dans les cellules des muscles.');
            });

            setTimeout(() => {
                liverMolecules.forEach((molecule, index) => {
                    gsap.to(molecule.position, {
                        x: liverTarget.x,
                        y: liverTarget.y,
                        z: liverTarget.z,
                        duration: 10,
                        delay: index * 0.1,
                        onComplete: function () {
                            scene.remove(molecule);
                            if (index === liverMolecules.length - 1) {
                                showMessage('Le glucose est stocké dans le foie sous forme de glycogène comme réserve.');
                                animateOrgan(liver);
                                setTimeout(() => {
                                    moveInsulinBlockBack();
                                    setTimeout(showInterventionButtons, 2000);
                                    showMessage('Glycémie régulée.');
                                }, 2000);
                            }
                        }
                    });
                    showMessage('L\'insuline favorise l\'absorption et le stockage du glucose dans le foie.');
                });
            }, 20000);
        }

        // Anime les organes (foie et muscles)
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

        // Ramène les blocs d'insuline à leur position initiale
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

        // Retire les blocs d'insuline de la scène
        function removeInsulinBlock() {
            blueMoleculeBlock.forEach(molecule => {
                scene.remove(molecule);
            });
            blueMoleculeBlock = [];
        }

        // Affiche une alerte d'hyperglycémie
        function showHyperglycemiaAlert() {
            if (!isHyperglycemiaAlert) {
                showMessage('🚨 Hyperglycémie détectée ! 🚨');
                document.body.style.backgroundColor = 'red';
                isHyperglycemiaAlert = true;
            }
        }

        // Masque l'alerte d'hyperglycémie
        function hideHyperglycemiaAlert() {
            if (isHyperglycemiaAlert) {
                showMessage('Glycémie régularisée.');
                document.body.style.backgroundColor = '#101111';
                isHyperglycemiaAlert = false;
            }
        }

        // Affiche le bouton d'injection d'insuline
        function showInsulinButton() {
            document.getElementById('insulin-button').style.display = 'block';
        }

        // Gère l'injection d'insuline pour le diabète de type 1
        function injectInsulin() {
            showMessage('Injection d\'insuline effectuée. Glycémie en cours de régulation.');
            createInsulinBlock(glucoseLevel); // Simuler la production d'insuline
            document.getElementById('insulin-button').style.display = 'none';
            otherImage.material.color.set(0xffffff); // Restaurer la couleur normale
            hideHyperglycemiaAlert();
        }

        // Gère l'exercice pour le diabète de type 2
        function exercise() {
            showMessage('Faire du sport aide à réguler la glycémie en augmentant l\'utilisation du glucose par les muscles.');
            distributeRedMoleculesToMuscle();
            hideHyperglycemiaAlert();
            endSimulation();
        }

        // Gère la prise de médicaments pour le diabète de type 2
        function takeMedication() {
            showMessage('Les médicaments peuvent aider à réguler la glycémie en augmentant la sensibilité à l\'insuline ou en stimulant sa production.');
            createMedicationEffect();
            hideHyperglycemiaAlert();
            endSimulation();
        }

        // Régule la glycémie pour le diabète de type 2 en simulant la prise de médicaments
        function createMedicationEffect() {
            const medication = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );
            medication.position.set(0, 0, 0);
            scene.add(medication);

            gsap.to(medication.position, {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2,
                duration: 2,
                onComplete: function () {
                    scene.remove(medication);
                    removeRedMoleculesProportion(0.4); // Faire disparaître 2/5 des molécules de glucose
                }
            });
        }

        // Distribue les molécules rouges vers les muscles uniquement pour l'exercice
        function distributeRedMoleculesToMuscle() {
            const muscleTarget = new THREE.Vector3(3, -1, 0);
            const moleculesToDistribute = Math.floor(redMolecules.length * (2 / 3));

            redMolecules.slice(0, moleculesToDistribute).forEach((molecule, index) => {
                gsap.to(molecule.position, {
                    x: muscleTarget.x,
                    y: muscleTarget.y,
                    z: muscleTarget.z,
                    duration: 5,
                    delay: index * 0.1,
                    onComplete: function () {
                        scene.remove(molecule);
                        if (index === moleculesToDistribute - 1) {
                            showMessage('Le glucose est absorbé par les muscles.');
                        }
                    }
                });
            });

            redMolecules = redMolecules.slice(moleculesToDistribute); // Mettre à jour la liste des molécules de glucose restantes
        }

        // Retire une proportion donnée de molécules de glucose de la scène
        function removeRedMoleculesProportion(proportion) {
            const moleculesToRemove = Math.floor(redMolecules.length * proportion);

            redMolecules.slice(0, moleculesToRemove).forEach(molecule => {
                scene.remove(molecule);
            });

            redMolecules = redMolecules.slice(moleculesToRemove); // Mettre à jour la liste des molécules de glucose restantes
        }

        // Démarre une simulation
        function startSimulation() {
            isSimulationRunning = true;
            document.getElementById('type1Button').disabled = true;
            document.getElementById('type2Button').disabled = true;
            document.getElementById('glucoseSlider').disabled = true;
        }

        // Termine une simulation
        function endSimulation() {
            isSimulationRunning = false;
            document.getElementById('type1Button').disabled = false;
            document.getElementById('type2Button').disabled = false;
            document.getElementById('glucoseSlider').disabled = false;
            document.querySelector('.intervention-buttons').style.display = 'none';
        }

        // Réinitialise la simulation
        function resetSimulation() {
            location.reload();
        }

        document.getElementById('type1Button').addEventListener('click', function () {
            diabetesType = 'type1';
            glucoseLevel = parseInt(document.getElementById('glucoseSlider').value, 10);
            moveMealModel();
            showMessage("Repas mangé, digestion en cours...");
        });

        document.getElementById('type2Button').addEventListener('click', function () {
            diabetesType = 'type2';
            glucoseLevel = parseInt(document.getElementById('glucoseSlider').value, 10);
            moveMealModel();
            showMessage("Repas mangé, digestion en cours...");
        });

        document.getElementById('glucoseSlider').addEventListener('input', function () {
            glucoseLevel = parseInt(this.value, 10);
            showMessage(`Niveau de Glucose: ${glucoseLevel}`);
        });

        init();
