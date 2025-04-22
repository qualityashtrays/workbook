import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Set a background color for the scene (optional, helps if mask isn't perfectly black)
scene.background = new THREE.Color(0x000000);
document.body.appendChild(renderer.domElement);

// --- Icosahedron ---
const radius = 5;
const detail = 1;
const icosahedronGeometry = new THREE.IcosahedronGeometry(radius, detail);
const icosahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x003030, wireframe: true });
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
scene.add(icosahedron);

// --- Spiral Parameters ---
const numPoints = 250;
const maxTheta = 9 * Math.PI;
let a = 1.5; // Initial 'a' value

// --- Spiral Creation Function (Optimized) ---
function createSpiral(radiusFunc, numPoints, maxTheta, color) {
    const vertices = new Float32Array(numPoints * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({ color: color });
    const spiral = new THREE.Line(geometry, material);

    return {
        mesh: spiral,
        geometry: geometry,
        update: (currentA) => {
            const positions = geometry.attributes.position.array;
            let vertexIndex = 0;
            for (let i = 0; i < numPoints; i++) {
                const theta = (i / (numPoints - 1)) * maxTheta;
                const r = radiusFunc(currentA, theta);
                const x = r * Math.cos(theta);
                const y = r * Math.sin(theta);
                const z = 0;
                positions[vertexIndex++] = x;
                positions[vertexIndex++] = y;
                positions[vertexIndex++] = z;
            }
            geometry.attributes.position.needsUpdate = true;
            // geometry.computeBoundingSphere(); // Optional
        }
    };
}

// --- Define Radius Calculation Functions ---
const radiusFunc1 = (a, theta) => a ** (-theta);
const radiusFunc2 = (a, theta) => -(a ** (-theta));
const radiusFunc3 = (a, theta) => Math.max(0, 0.33 * (a ** theta) - 0.33);
const radiusFunc4 = (a, theta) => Math.max(0, 0.33 * (a ** theta) - 0.33);

// --- Create Spirals ---
const spirals = [
    createSpiral(radiusFunc1, numPoints, maxTheta, 0x00ff00), // Green
    createSpiral(radiusFunc2, numPoints, maxTheta, 0x00ffff), // Cyan
    createSpiral(radiusFunc3, numPoints, maxTheta, 0xff0000), // Red
    createSpiral(radiusFunc4, numPoints, maxTheta, 0xffa500)  // Orange (negation handled in animate)
];

// --- Add Spirals to Scene ---
spirals.forEach(spiralData => scene.add(spiralData.mesh));

// --- Camera Setup ---
camera.position.z = 0.7;
camera.position.y = 0;
camera.lookAt(0, 0, 0);

// --- Animation Variables ---
let isAnimating = true; // <<<--- New flag to control animation state
let animationDirection = 1;
const animationSpeed = 0.00025;
const rotationSpeed = 0.00025;

// --- Animation Loop ---
function animate() {
    // Only perform updates if isAnimating is true
    if (isAnimating) {
        // Update 'a' value
        a += animationDirection * animationSpeed;

        // Reverse direction if 'a' reaches the limits
        if (a >= 2.0) {
            a = 2.0;
            animationDirection = -1;
        } else if (a <= 1.0) {
            a = 1.0;
            animationDirection = 1;
        }

        // Update spiral vertices
        spirals[0].update(a);
        spirals[1].update(a);
        spirals[2].update(a);

        // Special handling for spiral 4's coordinate negation
        const positions4 = spirals[3].geometry.attributes.position.array;
        let vertexIndex4 = 0;
        const currentA = a; // Use a consistent 'a' for this frame
        for (let i = 0; i < numPoints; i++) {
            const theta = (i / (numPoints - 1)) * maxTheta;
            const r = radiusFunc4(currentA, theta);
            const x = -r * Math.cos(theta); // Negate x
            const y = -r * Math.sin(theta); // Negate y
            const z = 0;
            positions4[vertexIndex4++] = x;
            positions4[vertexIndex4++] = y;
            positions4[vertexIndex4++] = z;
        }
        spirals[3].geometry.attributes.position.needsUpdate = true;

        // Rotate the icosahedron
        icosahedron.rotation.z += rotationSpeed;
    } // <<<--- End of isAnimating check

    // Always render the scene, even if paused, to keep it responsive
    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Note: If you change the mask size based on window size, update it here too.
}
window.addEventListener('resize', onWindowResize, false);

// --- Handle Click to Toggle Animation --- // <<<--- New Event Listener
renderer.domElement.addEventListener('click', () => {
    isAnimating = !isAnimating; // Toggle the flag
    console.log("Animation " + (isAnimating ? "Resumed" : "Paused")); // Optional feedback
});


// --- Start Animation ---
renderer.setAnimationLoop(animate);

window.openNav = function() {
    document.getElementById("mySidebar").style.width = "80px";
    document.getElementById("main").style.marginLeft = "0px";
  }
  window.closeNav = function() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }