// text-to-points - Instance Mode Version
"use strict";

let textPointsSketch = function(p) {

  let font;
  let points = []; // Initialize as an empty array
  let currentSampleF = 0.2; // Store the current sample factor used for points
  let canvasInitialized = false;
  let containerElement = null;
  let p5Canvas = null;
  let resizeObserver = null;

  p.preload = function() {
    // Ensure this path is correct relative to your HTML file
    // Use p.loadFont in instance mode
    font = p.loadFont("../processing/fonts/OCR-B.otf"); // Adjust path if needed
    console.log("Font loaded (Text Points):", font ? "Success" : "Failed");
  };

  p.setup = function() {
    // *** Get the container element for THIS sketch ***
    containerElement = document.getElementById('text-points-container'); // <<< CHOOSE AN ID

    if (!containerElement) {
      console.error("Container element '#text-points-container' not found!");
      p5Canvas = p.createCanvas(400, 200).parent(document.body); // Fallback
      p.background(50);
      p.fill(255, 0, 0).textAlign(p.CENTER, p.CENTER);
      p.text("Error: Container not found.", p.width / 2, p.height / 2);
      p.noLoop();
      return;
    }

    // Create minimal canvas, parent it to the container
    p5Canvas = p.createCanvas(1, 1);
    p5Canvas.parent(containerElement);
    console.log("Minimal canvas created for text points sketch.");

    // --- Use ResizeObserver for this sketch ---
    resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      console.log(`ResizeObserver (Text Points): ${newWidth} x ${newHeight}`);

      if (p5Canvas && newWidth > 0 && newHeight > 0) {
        p.resizeCanvas(newWidth, newHeight);
        console.log(`Canvas resized (Text Points) to: ${p.width} x ${p.height}`);

        // Recalculate points after resize
        p.recalculatePoints();
        console.log("Points recalculated after resize (Text Points). Count:", points.length);


        if (!canvasInitialized) {
          console.log("Performing initial setup via ResizeObserver (Text Points)...");
          // Initial background can be set here or in draw
          // p.background('blue'); // Or keep it in draw
          canvasInitialized = true;
          p.loop(); // Start draw loop ONLY after first successful resize
          console.log("Draw loop started (Text Points).");
        }
      } else if (p5Canvas) {
        console.warn(`ResizeObserver (Text Points) triggered with invalid size: ${newWidth}x${newHeight}`);
      }
    });

    resizeObserver.observe(containerElement);
    p.noLoop(); // Wait for observer
  };

  p.draw = function() {
    p.background('blue'); // Clear background each frame

    // --- Calculate desired sample factor based on mouse ---
    let desiredSampleF = p.map(p.mouseX, 0, p.width, 0.05, 0.5, true);

    // --- Recalculate points ONLY if sample factor changes significantly ---
    if (p.abs(desiredSampleF - currentSampleF) > 0.01) {
      currentSampleF = desiredSampleF;
      p.recalculatePoints();
    }

    // --- Draw the visualization ---
    if (points && points.length > 0) {
      for (let i = 0; i < points.length; i++) {
        p.stroke('limegreen');
        p.strokeWeight(1);
        p.line(points[i].x, points[i].y, p.mouseX, p.mouseY);

        p.noStroke();
        p.fill(255, 200, 0, 200);
        p.circle(points[i].x + p.random(-2, 2), points[i].y + p.random(-2, 2), 8);
      }
    } else {
      p.fill(255, 0, 0);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(50);
      p.text("No points to display (move mouse?)", p.width / 2, p.height / 2);
    }
  };

  // Helper function to calculate points (now uses 'p.')
  p.recalculatePoints = function() {
    if (font) {
      // Adjust positioning based on p.width/p.height
      let textX = p.width / 2 - 350; // Or adjust centering logic as needed
      let textY = p.height / 2;
      let fontSize = 200; // Or make dynamic based on p.width/p.height

      // Ensure text fits reasonably, adjust fontSize or position if needed
      // Example: Scale font size roughly with width
      fontSize = p.constrain(p.width / 10, 10, 300); // Min 50, Max 300, scales with width
      textX = p.width / 2 - (fontSize * 4.5); // Rough centering adjustment based on "HEY, world" length

      points = font.textToPoints("HEY, world", textX, textY, fontSize, {
        sampleFactor: currentSampleF,
        simplifyThreshold: 0
      });
      // console.log(`Recalculated points (Text Points). SampleF: ${currentSampleF}, Count: ${points.length}`);
    } else {
      console.warn("Attempted to recalculate points (Text Points), but font is not loaded yet.");
      points = [];
    }
  };

  // p.windowResized is handled by ResizeObserver now

  // Optional cleanup
  // p.remove = function() { ... }

};

// --- Start the sketch ---
document.addEventListener('DOMContentLoaded', () => { // <<< CHANGE HERE
  // Make sure the container exists before starting
  const container = document.getElementById('text-points-container'); // <<< USE THE SAME ID HERE
  if (container) {
    console.log("Found #text-points-container, starting text points sketch...");
    new p5(textPointsSketch); // Pass the sketch function
    console.log("Text points sketch initiated.");
  } else {
    // Update error message slightly for clarity
    console.error("Cannot initiate text points sketch because #text-points-container was not found on DOMContentLoaded.");
  }
});
