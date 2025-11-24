/**
 * Pythagorean Theorem Visualization (New Layout)
 * 
 * Demonstrates the Pythagorean theorem (a² + b² = c²) by placing squares
 * on each side of a right triangle. The areas of the two smaller squares
 * equal the area of the largest square.
 * 
 * Uses the new layout system with geometric transforms:
 * - NewTriangle with sides property (length, center, angle, outward normal)
 * - NewRect with geometric transforms (rotate, translate)
 * - Reactive bounds normalization for auto-sizing
 */

import { NewArtboard, NewTriangle, NewRect, NewCircle } from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#2c3e50",
  boxModel: { padding: 50 },
});

// Create a 3-4-5 right triangle (classic Pythagorean triple)
const triangle = new NewTriangle({
  type: "right",
  a: 120, // Base = 3 units
  b: 90,  // Height = 4 units  
  // Hypotenuse will be 5 units (150px)
  orientation: "bottomLeft",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: 3,
  },
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(triangle);

// Get the three sides
const sides = triangle.sides;
const colors = ["#e74c3c", "#3498db", "#2ecc71"]; // Red, Blue, Green

console.log("=== PYTHAGOREAN THEOREM ===");
console.log("Side a:", Math.round(sides[0].length));
console.log("Side b:", Math.round(sides[1].length));
console.log("Side c (hypotenuse):", Math.round(sides[2].length));
console.log("a² + b² = c²?", 
  Math.round(sides[0].length ** 2 + sides[1].length ** 2), 
  "≈", 
  Math.round(sides[2].length ** 2));

// Place a square on each side
sides.forEach((side, index) => {
  const square = new NewRect({
    width: side.length,
    height: side.length,
    style: {
      fill: colors[index],
      fillOpacity: 0.7,
      stroke: colors[index],
      strokeWidth: 2,
    },
  });

  // Position square at the center of the side
  square.position({
    relativeFrom: square.center,
    relativeTo: side.center,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });

  // Rotate to align with the side
  square.rotate(side.angle);

  // Move it outward along the normal
  square.translate(side.outwardNormal, side.length / 2);

  artboard.addElement(square);
  
  // Add debug circles at the transformed corners
  const corners = square.getTransformedCorners();
  corners.forEach((corner, cornerIndex) => {
    const debugCircle = new NewCircle({
      radius: 4,
      style: {
        fill: "white",
        stroke: colors[index],
        strokeWidth: 2,
      },
    });
    
    debugCircle.position({
      relativeFrom: debugCircle.center,
      relativeTo: corner,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });
    
    artboard.addElement(debugCircle);
  });
});

console.log("\n=== ARTBOARD ===");
console.log("Final size:", artboard.width, "x", artboard.height);

artboard.render();

