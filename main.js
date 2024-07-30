import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { TextureLoader } from 'three';

const container = document.getElementById('container'); // Get the container element

const scene = new THREE.Scene(); // Sets up the scene

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 1000); // Params: angle (deg), view width, view height, near render, far render
camera.position.set(0, 0, 10); // Params: x, y, z (adjusted to be closer to the origin)
camera.lookAt(0, 0, 0); //Params: x, y, z

const renderer = new THREE.WebGLRenderer(); // Creates the renderer object
renderer.setSize(container.clientWidth, container.clientHeight); // Set renderer size to match the container
container.appendChild(renderer.domElement); // Append renderer to the container

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(container.clientWidth, container.clientHeight); // Sets the size related to the scene box
labelRenderer.domElement.style.position = 'absolute'; // Works like CSS styles
labelRenderer.domElement.style.top = '10px';
labelRenderer.domElement.style.pointerEvents = 'none'; // Ensures that the CSS2DRenderer doesn't block the directions given by the orbiter
container.appendChild(labelRenderer.domElement); // Includes the text in the container

const textureLoader = new TextureLoader();
textureLoader.load('background/PokemonLeague.jpg', function(texture) {
    scene.background = texture;
});

const fontLoader = new FontLoader(); // Creates a new loader for text
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font){
    const textGeometry = new TextGeometry('Pokemon League!', {
        font: font,
        size: 1,
        depth: 0.3,
        curveSegments: 10,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
    }); // Creates a new geometry for text
    const textMaterial = new THREE.MeshBasicMaterial({color:0x000000}); // Adds a material of color green
    const textMesh = new THREE.Mesh(textGeometry, textMaterial); // Params: geometry, material
    textMesh.position.set(-5.1, 5, 0); // Declares the location of the text
    scene.add(textMesh);
});



const light = new THREE.DirectionalLight(0xffffff, 1); // Add lighting
light.position.set(1, 1, 1).normalize();
scene.add(light);

const loader = new GLTFLoader();

loader.load('3d-models/shiba/scene.gltf', function(gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Scale the model
    model.scale.set(4, 4, 4); // Adjust these values to scale the model
    model.position.set(0,-3.5,0)
}, function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}, function(error) {
    console.log('An error happened', error);
});

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth damping (inertia)

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Update controls on each frame

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

const div = document.createElement('div');
div.className = 'label';
div.textContent = 'Shiba Inu';
div.style.color = '#000000';
div.style.marginTop = '-1em';
const label = new CSS2DObject(div);
label.position.set(0, 1, 0);
scene.add(label);


animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
});
