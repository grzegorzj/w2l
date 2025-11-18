/**
 * Minimal Image Test
 * 
 * Absolute minimal example to test Image component
 */

import {
  Artboard,
  Image,
} from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",
  style: {
    fill: "#f0f0f0",
  },
});

// Create a simple image
const img = new Image({
  src: "https://via.placeholder.com/200x150/3498db/ffffff?text=Test",
  width: 200,
  height: 150,
});

// Position it - using absolute positioning first
img.position({
  relativeFrom: img.topLeft,
  relativeTo: { x: "100px", y: "100px" },
  x: 0,
  y: 0,
});

artboard.addElement(img);

// Render
artboard.render();

