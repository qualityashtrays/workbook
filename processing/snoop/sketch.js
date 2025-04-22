// snoop sketch - Instance Mode Version
"use strict";

let snoopSketch = function(p) {

  let song;
  let snoopImg1, snoopImg2; // Renamed variable
  let typedText = ''; // Renamed for clarity
  let analyzer;
  let mic;

  let canvasInitialized = false;
  let containerElement = null;
  let p5Canvas = null;
  let resizeObserver = null;
  let audioStarted = false; // Flag to track if audio context is running

  // --- Preload ---
  p.preload = function() {
    // Assuming assets are in an 'img' folder relative to this sketch.js file
    // Adjust paths if needed!
    p.soundFormats('mp3', 'ogg'); // Good practice
    song = p.loadSound('../img/Snoopy-Bleah.mp3');
    snoopImg1 = p.loadImage('../img/snoop1.jpg');
    snoopImg2 = p.loadImage('../img/snoop2.jpg'); // Corrected name
  };

  // --- Setup ---
  p.setup = function() {
    // *** Get the container element for THIS sketch ***
    containerElement = document.getElementById('snoop-container'); // <<< CHOOSE AN ID

    if (!containerElement) {
      console.error("Container element '#snoop-container' not found!");
      p5Canvas = p.createCanvas(400, 200).parent(document.body); // Fallback
      p.background(50, 0, 0);
      p.fill(255, 0, 0).textAlign(p.CENTER, p.CENTER);
      p.text("Error: Container not found.", p.width / 2, p.height / 2);
      p.noLoop();
      return;
    }

    // Create minimal canvas, parent it to the container
    p5Canvas = p.createCanvas(1, 1);
    p5Canvas.parent(containerElement);
    console.log("Minimal canvas created for snoop sketch.");

    // Initialize text alignment
    p.textAlign(p.CENTER, p.CENTER);

    // --- Use ResizeObserver for this sketch ---
    resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      console.log(`ResizeObserver (Snoop): ${newWidth} x ${newHeight}`);

      if (p5Canvas && newWidth > 0 && newHeight > 0) {
        p.resizeCanvas(newWidth, newHeight);
        console.log(`Canvas resized (Snoop) to: ${p.width} x ${p.height}`);

        // Resize images to fit the new canvas dimensions
        snoopImg1.resize(p.width, p.height);
        snoopImg2.resize(p.width, p.height);
        console.log("Images resized (Snoop).");

        // Perform initial setup OR redraw background on subsequent resizes
        p.image(snoopImg1, 0, 0); // Draw the base image initially

        if (!canvasInitialized) {
          console.log("Performing initial setup via ResizeObserver (Snoop)...");

          // Setup audio input and analyzer (only once)
          mic = new p5.AudioIn();
          // Mic will be started on mouse click
          analyzer = new p5.Amplitude();
          analyzer.setInput(mic); // Connect analyzer to mic

          canvasInitialized = true;
          p.loop(); // Start draw loop ONLY after first successful resize
          console.log("Draw loop started (Snoop).");
        }
      } else if (p5Canvas) {
        console.warn(`ResizeObserver (Snoop) triggered with invalid size: ${newWidth}x${newHeight}`);
      }
    });

    resizeObserver.observe(containerElement);
    p.noLoop(); // Wait for observer
  };

  // --- Draw ---
  p.draw = function() {
    // Use the second image as the background each frame
    p.image(snoopImg2, 0, 0, p.width, p.height);

    let volume = 0;
    if (mic && audioStarted) { // Get volume only if mic is ready and started
        volume = mic.getLevel();
    }

    // Map volume to text size and circle size
    let mappedSize = p.map(volume, 0, 0.5, 10, 200, true); // Map to a reasonable range (0 to 0.5 input) and clamp

    // Draw the typed text, sized by volume
    p.fill(255); // White text
    p.noStroke();
    p.textSize(mappedSize);
    p.text(typedText, p.width / 2, p.height / 2);

    // Draw a circle at the mouse position, sized by volume
    p.fill(255, 255, 255, 150); // Semi-transparent white circle
    p.circle(p.mouseX, p.mouseY, mappedSize);

    // Optional: Draw rotated text (can be visually busy)
    // p.push();
    // p.translate(p.width / 2, p.height / 2); // Move origin to center
    // p.rotate(p.map(volume, 0, 0.5, 0, p.TWO_PI)); // Rotate based on volume
    // p.fill(0, 255, 0); // Green rotated text
    // p.text(typedText, 0, 0); // Draw text at the new origin (0,0)
    // p.pop();

    // console.log(volume); // Optional: logging volume
  };

  // --- Mouse Clicked ---
  p.mouseClicked = function() {
    // Check if click is within canvas bounds
     if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
        return; // Ignore clicks outside the canvas
     }

    // Start audio context and mic on first click
    if (!audioStarted) {
      p.getAudioContext().resume().then(() => {
         console.log("Audio Context Resumed");
         if (mic) {
             mic.start(() => {
                 console.log("Mic started successfully.");
                 audioStarted = true;
             }, (err) => {
                 console.error("Mic start error:", err);
             });
         }
      });
    }

    // Toggle song playback
    if (song.isPlaying()) {
      song.stop();
      // song.noLoop(); // stop() usually sufficient, loop handled below
    } else {
      if (audioStarted) { // Only play if audio context is running
          song.loop(); // loop() automatically plays
      } else {
          console.warn("Audio context not ready, cannot play song yet.");
      }
    }
  };

  // --- Key Pressed ---
  p.keyPressed = function() {
    // Handle specific keys first
    if (p.key === 's' || p.key === 'S') {
      // Maybe toggle song instead of just playing? Or do nothing extra here?
      // For now, let's just let mouseClicked handle song playback.
      // If you want 's' to specifically START the song:
      // if (!song.isPlaying() && audioStarted) {
      //   song.loop();
      // }
      // return; // Prevent 's' from being added to typedText
    }

    // Add printable characters to the string
    // You might want more sophisticated filtering (e.g., check keyCode range)
    if (p.key.length === 1) { // Basic check for single characters
        typedText += p.key;
    } else if (p.keyCode === p.BACKSPACE) {
        typedText = typedText.substring(0, typedText.length - 1); // Handle backspace
    } else if (p.keyCode === p.DELETE) {
        typedText = ''; // Handle delete (clear text)
    }
     // You could add ENTER handling here if needed
  };

  // Optional cleanup
  // p.remove = function() { ... }

};

// --- Start the sketch ---
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('snoop-container'); // <<< USE THE SAME ID HERE
  if (container) {
    console.log("Found #snoop-container, starting snoop sketch...");
    new p5(snoopSketch); // Pass the sketch function
    console.log("Snoop sketch initiated.");
  } else {
    console.error("Cannot initiate snoop sketch because #snoop-container was not found on DOMContentLoaded.");
  }
});
