import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer({antialias: true});
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

// Sets orbit control to move the camera around.
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning.
camera.position.set(6, 8, 14);
// Has to be done everytime we update the camera position.
orbit.update();

// Creates a 12 by 12 grid helper.
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Creates an axes helper with an axis length of 4.
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

const light = new THREE.AmbientLight(0x404040, 5); // soft white light
scene.add(light);

const pointLight = new THREE.PointLight(0xff0000, 3, 100);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);


// Loader untuk GLTF
const loader = new GLTFLoader();
let mixer; // Untuk menyimpan AnimationMixer

// Memuat model GLB
loader.load(
  "./model/rifa.glb",
  function (gltf) {
    // Tambahkan model ke scene
    const model = gltf.scene;
    scene.add(model);

    // Atur posisi model
    model.position.set(0, 0, 0);

    //atur ukuran
    model.scale.set(2, 2, 2);

    // Buat AnimationMixer untuk animasi model
    mixer = new THREE.AnimationMixer(model);

    // Dapatkan semua animasi dari model
    const clips = gltf.animations;

    // Memainkan semua animasi
    clips.forEach(function (clip) {
      const action = mixer.clipAction(clip);
      action.play();
    });
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

// Untuk mengupdate animasi
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  // Hitung waktu delta dan update mixer jika ada
  const deltaSeconds = clock.getDelta();
  if (mixer) mixer.update(deltaSeconds);

  renderer.render(scene, camera);
}

// Mulai animasi
animate();


renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
