import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Icosahedron
const radius = 5; // Make it larger than the camera's view
const detail = 1; // Adjust for level of detail (0 is a basic icosahedron)
const icosahedronGeometry = new THREE.IcosahedronGeometry(radius, detail); 
const icosahedronMaterial = new THREE.MeshBasicMaterial({ color: 0x003030, wireframe: true }); // Cyan, wireframe for visibility
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
scene.add(icosahedron);


// --- Spiral 1 (r = a^(-theta)) ---
function createSpiral1(a, numPoints, maxTheta, color) {
    const vertices = [];
    for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * maxTheta; // Angle (theta)
        const r = a ** (-theta); // Radius (r) based on the formula r = a^(-theta)

        // Convert polar coordinates (r, theta) to Cartesian (x, y)
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = 0; // Keep it flat on the x-y plane for now

        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.LineBasicMaterial({ color: color });
    const spiral = new THREE.Line(geometry, material);
    return spiral;
}

// --- Spiral 2 (r = -a^(-theta)) ---
function createSpiral2(a, numPoints, maxTheta, color) {
    const vertices = [];
    for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * maxTheta; // Angle (theta)
        const r = -(a ** (-theta)); // Radius (r) based on the formula r = -a^(-theta)

        // Convert polar coordinates (r, theta) to Cartesian (x, y)
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = 0; // Keep it flat on the x-y plane for now

        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.LineBasicMaterial({ color: color });
    const spiral = new THREE.Line(geometry, material);
    return spiral;
}

// --- Spiral 3 (r = 0.33a^(theta) - 0.33) ---
function createSpiral3(a, numPoints, maxTheta, color) {
    const vertices = [];
    for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * maxTheta; // Angle (theta)
        const r = 0.33 * (a ** theta) - 0.33; // Radius (r) based on the formula r = 0.33a^(theta) - 0.33

        // Ensure r is not negative (avoid undefined behavior)
        const safeR = Math.max(0, r);

        // Convert polar coordinates (r, theta) to Cartesian (x, y)
        const x = safeR * Math.cos(theta);
        const y = safeR * Math.sin(theta);
        const z = 0; // Keep it flat on the x-y plane for now

        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.LineBasicMaterial({ color: color });
    const spiral = new THREE.Line(geometry, material);
    return spiral;
}

// --- Spiral 4 (r = -0.33a^(theta) + 0.33 + theta) ---
function createSpiral4(a, numPoints, maxTheta, color) {
    const vertices = [];
    for (let i = 0; i < numPoints; i++) {
        const theta = (i / numPoints) * maxTheta; // Angle (theta)
        const r = 0.33 * (a ** theta) - 0.33; // Radius (r) based on the formula r = -0.33a^(theta) + 0.33 + theta

        // Ensure r is not negative (avoid undefined behavior)
        const safeR = Math.max(0, r);

        // Convert polar coordinates (r, theta) to Cartesian (x, y)
        const x = -safeR * Math.cos(theta);
        const y = -safeR * Math.sin(theta);
        const z = 0; // Keep it flat on the x-y plane for now

        vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.LineBasicMaterial({ color: color });
    const spiral = new THREE.Line(geometry, material);
    return spiral;
}

// --- Parameters ---
let a = 1.5; // Initial 'a' value
const numPoints = 250;
const maxTheta = 9 * Math.PI; // Adjust for number of turns

// --- Colors ---
const spiral1Color = 0x00ff00; // Green
const spiral2Color = 0x00ffff; // Blue
const spiral3Color = 0xff0000; // Red
const spiral4Color = 0xffa500; // Orange

// --- Create and Add Spirals ---
let spiral1 = createSpiral1(a, numPoints, maxTheta, spiral1Color);
scene.add(spiral1);

let spiral2 = createSpiral2(a, numPoints, maxTheta, spiral2Color);
scene.add(spiral2);

let spiral3 = createSpiral3(a, numPoints, maxTheta, spiral3Color);
scene.add(spiral3);

let spiral4 = createSpiral4(a, numPoints, maxTheta, spiral4Color);
scene.add(spiral4);

// --- Camera Setup ---
camera.position.z = .7;
camera.position.y = 0;
camera.lookAt(0, 0, 0);

// --- Animation Loop ---
let animationDirection = 1; // 1 for increasing, -1 for decreasing
const animationSpeed = 0.00025; // Adjust for animation speed
let rotationSpeed = 0.00025; // Adjust rotation speed


function animate() {
    requestAnimationFrame(animate);

    // Update 'a' value
    a += animationDirection * animationSpeed;

    // Reverse direction if 'a' reaches the limits
    if (a >= 2) {
        animationDirection = -1;
    } else if (a <= 1) {
        animationDirection = 1;
    }

    // Remove old spirals
    scene.remove(spiral1);
    scene.remove(spiral2);
    scene.remove(spiral3);
    scene.remove(spiral4);

    // Create new spirals with updated 'a' value
    const newSpiral1 = createSpiral1(a, numPoints, maxTheta, spiral1Color);
    scene.add(newSpiral1);

    const newSpiral2 = createSpiral2(a, numPoints, maxTheta, spiral2Color);
    scene.add(newSpiral2);

    const newSpiral3 = createSpiral3(a, numPoints, maxTheta, spiral3Color);
    scene.add(newSpiral3);

    const newSpiral4 = createSpiral4(a, numPoints, maxTheta, spiral4Color);
    scene.add(newSpiral4);

    // Update references to the new spirals
    spiral1.geometry.dispose();
    spiral1.material.dispose();
    spiral1 = newSpiral1;

    spiral2.geometry.dispose();
    spiral2.material.dispose();
    spiral2 = newSpiral2;

    spiral3.geometry.dispose();
    spiral3.material.dispose();
    spiral3 = newSpiral3;

    spiral4.geometry.dispose();
    spiral4.material.dispose();
    spiral4 = newSpiral4;


    // Rotate the icosahedron around the z-axis
    icosahedron.rotation.z += rotationSpeed;

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
