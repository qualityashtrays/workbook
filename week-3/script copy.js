import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
const a = 1.5; // Common 'a' value for all spirals
const numPoints = 2000;
const maxTheta = 30 * Math.PI; // Adjust for number of turns

// --- Colors ---
const spiral1Color = 0x00ff00; // Green
const spiral2Color = 0x0000ff; // Blue
const spiral3Color = 0xff0000; // Red
const spiral4Color = 0xffa500; // Orange

// --- Create and Add Spirals ---
const spiral1 = createSpiral1(a, numPoints, maxTheta, spiral1Color);
scene.add(spiral1);

const spiral2 = createSpiral2(a, numPoints, maxTheta, spiral2Color);
scene.add(spiral2);

const spiral3 = createSpiral3(a, numPoints, maxTheta, spiral3Color);
scene.add(spiral3);

const spiral4 = createSpiral4(a, numPoints, maxTheta, spiral4Color);
scene.add(spiral4);

// --- Camera Setup ---
camera.position.z = .7;
camera.position.y = 0;
camera.lookAt(0, 0, 0);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
