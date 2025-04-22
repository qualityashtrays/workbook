// uncover img - Instance Mode Version
"use strict";

let uncoverSketch = function(p) {

  let bottomImg, topImg;
  let canvasInitialized = false; // Flag for initial setup
  let containerElement = null; // Reference to the container div
  let p5Canvas = null; // Reference to the p5 canvas
  let resizeObserver = null; // Observer instance

  // --- Preload ---
  p.preload = function() {
    // Use p.loadImage in instance mode
    topImg = p.loadImage('../img/palette1.png'); // Adjust path if needed
    bottomImg = p.loadImage('../img/palette2.png'); // Adjust path if needed
  };

  // --- Setup ---
  p.setup = function() {
    // Get the container element - *** REPLACE 'uncover-container' with your actual container ID ***
    containerElement = document.getElementById('uncover-container');

    if (!containerElement) {
      console.error("Container element '#uncover-container' not found!");
      // Create a fallback canvas if the container is missing
      p5Canvas = p.createCanvas(400, 200).parent(document.body); // Attach to body as fallback
      p.background(150);
      p.fill(255, 0, 0).textAlign(p.CENTER, p.CENTER);
      p.text("Error: Container not found.", p.width / 2, p.height / 2);
      p.noLoop();
      return;
    }

    // Create a minimal canvas initially, parent it to the container
    p5Canvas = p.createCanvas(1, 1);
    p5Canvas.parent(containerElement); // Attach canvas to the container
    console.log("Minimal canvas created for uncover sketch.");

    // --- Use ResizeObserver ---
    resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      console.log(`ResizeObserver (Uncover): ${newWidth} x ${newHeight}`);

      if (p5Canvas && newWidth > 0 && newHeight > 0) {
        p.resizeCanvas(newWidth, newHeight);
        console.log(`Canvas resized to: ${p.width} x ${p.height}`);

        // Resize images to fit the new canvas dimensions
        // Use 0 for width/height to maintain aspect ratio if desired,
        // or p.width, p.height to fill the container. Let's fill.
        bottomImg.resize(p.width, p.height);
        topImg.resize(p.width, p.height);
        console.log("Images resized.");

        // Perform initial setup OR redraw background on subsequent resizes
        p.background(222, 222, 222); // Set background color
        p.image(bottomImg, 0, 0); // Draw the base image
        console.log("Background and bottom image drawn.");

        if (!canvasInitialized) {
          console.log("Performing initial setup via ResizeObserver (Uncover)...");
          // Any other one-time setup after first resize can go here
          canvasInitialized = true;
          p.loop(); // Start draw loop ONLY after first successful resize
          console.log("Draw loop started (Uncover).");
        }
      } else if (p5Canvas) {
        console.warn(`ResizeObserver (Uncover) triggered with invalid size: ${newWidth}x${newHeight}`);
      }
    });

    // Start observing the container element
    resizeObserver.observe(containerElement);

    p.noLoop(); // Don't start drawing until the observer provides dimensions
  };

  // --- Draw (currently empty, but structure is here) ---
  p.draw = function() {
    // The background and bottom image are drawn in setup/resize.
    // Draw loop is mainly needed for mouseDragged here.
  };

  // --- Mouse Dragged ---
  p.mouseDragged = function() {
    // Use p. variables/functions in instance mode
    if (p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height) {
       // Copy a portion (e.g., 80x80) of the top image to the canvas at the mouse position
       p.copy(topImg, p.mouseX - 40, p.mouseY - 40, 80, 80, p.mouseX - 40, p.mouseY - 40, 80, 80);
    }
  };

  // --- Cleanup (Optional) ---
  // p.remove = function() {
  //   if (resizeObserver && containerElement) {
  //     resizeObserver.unobserve(containerElement);
  //     console.log("ResizeObserver disconnected (Uncover).");
  //   }
  // }

};

// --- Start the sketch ---
// Ensure this runs after the container element exists in the DOM
document.addEventListener('DOMContentLoaded', () => { // <<< CHANGE HERE
  const container = document.getElementById('uncover-container'); // *** Use the same ID here ***
  if (container) {
    console.log("Found #uncover-container, starting uncover sketch...");
    new p5(uncoverSketch); // Pass the sketch function to p5
    console.log("Uncover sketch initiated.");
  } else {
    // Update error message slightly for clarity
    console.error("Cannot initiate uncover sketch because #uncover-container was not found on DOMContentLoaded.");
  }

});
