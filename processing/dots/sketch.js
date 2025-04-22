"use strict";

let sketch = function(p) {

  let canvasInitialized = false; // Flag to track if initial setup is done
  let item2Element = null; // Store reference to the container element
  let p5Canvas = null; // Store reference to the p5 canvas
  let resizeObserver = null; // Store the observer instance

  // --- Setup ---
  p.setup = function() {
    item2Element = document.getElementById("item2"); // Store the element reference

    if (!item2Element) {
      console.error("Element #item2 not found during setup!");
      p.createCanvas(400, 400).background(100);
      p.fill(255).textAlign(p.CENTER, p.CENTER).text("Error: #item2 not found.", 200, 200);
      p.noLoop();
      return;
    }

    // Create a minimal 1x1 canvas initially.
    p5Canvas = p.createCanvas(1, 1);
    p5Canvas.parent("item2");
    console.log("Minimal canvas created in setup. Setting up ResizeObserver.");

    // --- Use ResizeObserver ---
    resizeObserver = new ResizeObserver(entries => {
      // We are only observing one element
      if (!entries || entries.length === 0) {
        return;
      }
      const entry = entries[0];
      // Use contentRect width, or fallback to offsetWidth
      let width = entry.contentRect.width > 0 ? entry.contentRect.width : item2Element.offsetWidth;
      // *** Force height to be equal to width ***
      let height = width;

      console.log(`ResizeObserver triggered: Measured width=${width}, Forcing height=${height}`);

      if (p5Canvas && width > 0 && height > 0) {
        // Dimensions are valid, resize the canvas
        p.resizeCanvas(width, height); // Use width for both dimensions
        console.log(`Canvas resized via ResizeObserver to square: ${width}x${height}`);

        // Perform initial setup ONLY if it hasn't been done yet
        if (!canvasInitialized) {
          console.log("Performing initial setup via ResizeObserver...");
          p.background(p.random(255)); // Set initial background
          p.noStroke();
          p.frameRate(25);
          p.loop(); // <<<<<< START THE DRAW LOOP HERE
          canvasInitialized = true; // Mark as initialized
          console.log("Draw loop started via ResizeObserver.");
        }
      } else if (p5Canvas) {
        // Log if size becomes invalid after initialization
        console.warn(`ResizeObserver triggered with invalid width: width=${width}`);
      }
    });

    // Start observing the target element
    resizeObserver.observe(item2Element);

    p.noLoop(); // Don't start the loop until observer triggers
  };

  // --- Draw ---
  p.draw = function() {
    // Draw multiple ellipses each frame
    for (let i = 0; i < 10; i++) {
      p.fill(p.random(255), p.random(255), p.random(255), p.random(255));
      p.ellipse(p.random(p.width), p.random(p.height), p.random(10, 200));
    }
  };

  // --- Cleanup ---
  // Optional: Disconnect observer if sketch is removed dynamically
  // p.remove = function() { ... }

};

// --- Start the sketch after the window loads ---
window.onload = function() {
  let item2 = document.getElementById("item2");
  if (item2) {
      console.log("Found #item2, attempting to start p5 sketch...");
      new p5(sketch); // Create the p5 instance
      console.log("p5 sketch initiated (using ResizeObserver, forcing square canvas).");
  } else {
      console.error("Cannot initiate p5 sketch because #item2 was not found on window.onload.");
  }
};
