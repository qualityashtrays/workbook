// --- Spiral Parameters ---
// These will be managed by the A-Frame component, but are good reference
// const numPoints = 250;
// const maxTheta = 9 * Math.PI;
// let a = 1.5; // Initial 'a' value

// --- Spiral Creation Function (Optimized) ---
export function createSpiral(THREE_Ref, radiusFunc, numPoints, maxTheta, color, negateXY = false) {
    const vertices = new Float32Array(numPoints * 3); // x, y, z for each point
    const geometry = new THREE_Ref.BufferGeometry();
    geometry.setAttribute('position', new THREE_Ref.BufferAttribute(vertices, 3));

    const material = new THREE_Ref.LineBasicMaterial({ color: color });
    const spiral = new THREE_Ref.Line(geometry, material);

    return {
        mesh: spiral,
        geometry: geometry,
        update: (currentA) => {
            const positions = geometry.attributes.position.array;
            let vertexIndex = 0;
            for (let i = 0; i < numPoints; i++) {
                const theta = (i / (numPoints - 1)) * maxTheta;
                let r = radiusFunc(currentA, theta);
                let x = r * Math.cos(theta);
                let y = r * Math.sin(theta);
                if (negateXY) {
                    x = -x;
                    y = -y;
                }
                const z = 0; // Spirals are created in the XY plane by default
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
export const radiusFunc1 = (a, theta) => 500*a ** (-theta);
export const radiusFunc2 = (a, theta) => -(500*a ** (-theta));
export const radiusFunc3 = (a, theta) => Math.max(0, 0.33 * (a ** theta) - 0.33);
export const radiusFunc4 = (a, theta) => Math.max(0, 0.33 * (a ** theta) - 0.33); // Negation will be handled by the `negateXY` flag in createSpiral