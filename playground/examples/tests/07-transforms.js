/**
 * Transform Demonstration
 * 
 * Shows how to use geometric transforms:
 * - rotate(degrees): Rotate shape around its center
 * - translate(direction, distance): Move shape along a vector
 * - getCorners(): Query actual corner/vertex positions
 */

import { NewArtboard, NewRect, NewCircle, NewTriangle } from "w2l";

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 40 },
});

// Example 1: Rotate a rectangle
const rect1 = new NewRect({
  width: 100,
  height: 60,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});

rect1.position({
  relativeFrom: rect1.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 150,
  y: 100,
  boxReference: "contentBox",
});

rect1.rotate(30); // Rotate 30 degrees

artboard.addElement(rect1);

// Add debug circles at corners (after adding to artboard)
rect1.getCorners().forEach((corner, index) => {
  const circle = new NewCircle({
    radius: 4,
    style: {
      fill: ["#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"][index],
      stroke: "white",
      strokeWidth: 2,
    },
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: corner,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  artboard.addElement(circle);
});

// Example 2: Rotate and translate
const rect2 = new NewRect({
  width: 80,
  height: 80,
  style: {
    fill: "#e74c3c",
    fillOpacity: 0.7,
    stroke: "#c0392b",
    strokeWidth: 2,
  },
});

rect2.position({
  relativeFrom: rect2.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 400,
  y: 150,
  boxReference: "contentBox",
});

rect2.rotate(45);
// Translate diagonally (northeast)
rect2.translate({ x: 1, y: -1 }, 60);

artboard.addElement(rect2);

// Add debug circles
rect2.getCorners().forEach((corner, index) => {
  const circle = new NewCircle({
    radius: 4,
    style: {
      fill: ["#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"][index],
      stroke: "white",
      strokeWidth: 2,
    },
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: corner,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  artboard.addElement(circle);
});

// Example 3: Triangle with rotation
const triangle = new NewTriangle({
  type: "equilateral",
  a: 80,
  style: {
    fill: "#2ecc71",
    fillOpacity: 0.8,
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 150,
  y: 350,
  boxReference: "contentBox",
});

triangle.rotate(60);
// Translate along custom vector
triangle.translate({ x: 2, y: 1 }, 40);

artboard.addElement(triangle);

// Add debug circles at triangle vertices
triangle.getCorners().forEach((corner, index) => {
  const circle = new NewCircle({
    radius: 5,
    style: {
      fill: ["#e74c3c", "#f39c12", "#9b59b6"][index],
      stroke: "white",
      strokeWidth: 2,
    },
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: corner,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  artboard.addElement(circle);
});

// Example 4: Multiple translations
const rect3 = new NewRect({
  width: 60,
  height: 40,
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 2,
  },
});

rect3.position({
  relativeFrom: rect3.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 550,
  y: 350,
  boxReference: "contentBox",
});

// Chain multiple translations
rect3.translate({ x: 1, y: 0 }, 30);  // Move right
rect3.translate({ x: 0, y: 1 }, 40);  // Move down
rect3.translate({ x: -1, y: 0 }, 20); // Move left

artboard.addElement(rect3);

// Add debug circles
rect3.getCorners().forEach((corner, index) => {
  const circle = new NewCircle({
    radius: 4,
    style: {
      fill: ["#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"][index],
      stroke: "white",
      strokeWidth: 2,
    },
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: corner,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  artboard.addElement(circle);
});

console.log("=== TRANSFORM EXAMPLES ===");
console.log("Rect1 (rotated 30°):");
console.log("  Center:", rect1.center);
console.log("  Corners:", rect1.getCorners());

console.log("\nRect2 (rotated 45° + translated):");
console.log("  Center:", rect2.center);
console.log("  Corners:", rect2.getCorners());

console.log("\nTriangle (rotated 60° + translated):");
console.log("  Center:", triangle.center);
console.log("  Vertices:", triangle.getCorners());

console.log("\nRect3 (multiple translations):");
console.log("  Center:", rect3.center);
console.log("  Corners:", rect3.getCorners());

return artboard.render();

