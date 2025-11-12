/**
 * Example usage of the w2l library.
 * 
 * This demonstrates basic usage of the library's core features,
 * showing how intuitive it is for LLMs to create structured visuals.
 */

import { Artboard, Triangle } from "w2l";

// Create an artboard with auto-sizing
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "20px",
  backgroundColor: "#f8f9fa"
});

console.log("Created artboard with center at:", artboard.center);

// Create a right triangle (for Pythagorean theorem visualization)
const triangle = new Triangle({
  type: "right",
  a: 300,
  b: 400,
  orientation: "bottomLeft",
  fill: "#3498db",
  stroke: "#2c3e50",
  strokeWidth: 2
});

console.log("\nCreated triangle with:");
console.log("- Center:", triangle.center);
console.log("- Number of sides:", triangle.sides.length);

// Display information about each side
triangle.sides.forEach((side, index) => {
  console.log(`\nSide ${index + 1}:`);
  console.log(`  Length: ${side.length.toFixed(2)}px`);
  console.log(`  Center: (${side.center.x}, ${side.center.y})`);
  console.log(`  Outward normal: (${side.outwardNormal.x.toFixed(2)}, ${side.outwardNormal.y.toFixed(2)})`);
});

// Position the triangle at the artboard center
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

console.log("\n✓ Triangle positioned at artboard center");
console.log("✓ Library import and usage successful!");
console.log("\nThis demonstrates that:");
console.log("  1. The library compiles correctly");
console.log("  2. It can be imported by external projects");
console.log("  3. The API is intuitive and self-documenting");

