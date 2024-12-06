import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background.
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const loader = new GLTFLoader(); // Declare loader globally
const mixers = []; // Array to store all mixers
const models = []; // Array to store all models

// Load model function with independent mixers
function loadModel(path, position, scale, rotation, onLoad) {
    loader.load(
        path,
        function (gltf) {
            const model = gltf.scene;

            // Set position, scale, and rotation
            model.position.set(position.x, position.y, position.z);
            model.scale.set(scale.x, scale.y, scale.z);
            model.rotation.set(rotation.x, rotation.y, rotation.z); // Apply rotation

            // Add model to the scene
            scene.add(model);

            // Enable shadows for the model
            model.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            // Set up animation mixer and play animations
            if (gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    action.play();
                });
                mixers.push(mixer); // Add the mixer to the array
            } else {
                console.warn(`No animations found in ${path}`);
            }

            // Store the model for later access
            models.push(model);

            // Callback after model is loaded
            if (onLoad) onLoad(model);
        },
        undefined,
        function (error) {
            console.error(`Error loading model at ${path}:`, error);
        }
    );
}

// Load models
loadModel('./model/coca.glb', { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, function () {
    console.log('Coca model loaded with rotation');
});

loadModel('./model/cj2.glb', { x: 5, y: 1.5, z: 0 }, { x: 0.08, y: 0.08, z: 0.08 }, { x: 0, y: 180, z: 0 }, function () {
    console.log('Pepsi model loaded with rotation');
});

loadModel('./model/rifa.glb', { x: -5, y: 1.5, z: 0 }, { x: 2, y: 2, z: 2 }, { x: 0, y: 90, z: 0 }, function () {
    console.log('Pepsi model loaded with rotation');
});

// Sets orbit control to move the camera around.
const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(light);

const pointLight = new THREE.PointLight(0xff0000, 3, 100);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Camera positioning.
camera.position.set(-20, 18, -20);

// Has to be done everytime we update the camera position.
controls.update();

// Creates a 12 by 12 grid helper.
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Creates an axes helper with an axis length of 4.
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// Animation loop
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
    const delta = clock.getDelta(); // Get the time elapsed since the last frame

    // Update mixers
    mixers.forEach((mixer) => mixer.update(delta));

    // Rotate the first loaded model
    if (models[0]) {
        models[0].rotation.y += 0; // Rotate on Y-axis
    }

    // Rotate the second loaded model
    if (models[1]) {
        models[1].rotation.y += 0; // Rotate on Y-axis
    }

    controls.update();
    renderer.render(scene, camera);
});
