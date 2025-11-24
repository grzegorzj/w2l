/**
 * Test if getBoundingBox() correctly includes rotated corners
 */

import { NewContainer, NewRect } from "./dist/index.js";

console.log("=== Rotated Bounding Box Test ===\n");

const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform",
  boxModel: { padding: 20 },
});

// Create a rotated square
const square = new NewRect({
  width: 100,
  height: 100,
  style: { fill: "blue" },
});

// Position it at (100, 100)
square.position({
  relativeFrom: square.center,
  relativeTo: { x: 100, y: 100 },
  x: 0,
  y: 0,
});

// Rotate 45 degrees
square.rotate(45);

console.log("1. Square positioned and rotated (before adding)");
console.log("   Center:", square.center);
console.log("   Rotation:", square.rotation);

// Get corners and bounding box
const corners = square.getCorners();
console.log("\n2. Corners:");
corners.forEach((corner, i) => {
  console.log(`   Corner ${i}: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
});

const bbox = square.getBoundingBox();
console.log("\n3. Bounding box (BEFORE adding to container):");
console.log(`   Min: (${bbox.minX.toFixed(1)}, ${bbox.minY.toFixed(1)})`);
console.log(`   Max: (${bbox.maxX.toFixed(1)}, ${bbox.maxY.toFixed(1)})`);

// Check if bbox contains all corners
let allCornersInBbox = true;
corners.forEach((corner, i) => {
  const inBbox = 
    corner.x >= bbox.minX - 0.1 && corner.x <= bbox.maxX + 0.1 &&
    corner.y >= bbox.minY - 0.1 && corner.y <= bbox.maxY + 0.1;
  
  if (!inBbox) {
    console.log(`   ❌ Corner ${i} NOT in bbox!`);
    allCornersInBbox = false;
  }
});

console.log(`\n4. All corners in bbox: ${allCornersInBbox ? '✅' : '❌'}`);

// Now add to container
container.addElement(square);

console.log("\n5. Square added to container");
console.log("   Container size:", container.width, "x", container.height);
console.log("   Square center:", square.center);

const cornersAfter = square.getCorners();
console.log("\n6. Corners after adding:");
cornersAfter.forEach((corner, i) => {
  console.log(`   Corner ${i}: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
});

const bboxAfter = square.getBoundingBox();
console.log("\n7. Bounding box (AFTER adding to container):");
console.log(`   Min: (${bboxAfter.minX.toFixed(1)}, ${bboxAfter.minY.toFixed(1)})`);
console.log(`   Max: (${bboxAfter.maxX.toFixed(1)}, ${bboxAfter.maxY.toFixed(1)})`);

// Verify bbox still contains all corners
let allCornersInBboxAfter = true;
cornersAfter.forEach((corner, i) => {
  const inBbox = 
    corner.x >= bboxAfter.minX - 0.1 && corner.x <= bboxAfter.maxX + 0.1 &&
    corner.y >= bboxAfter.minY - 0.1 && corner.y <= bboxAfter.maxY + 0.1;
  
  if (!inBbox) {
    console.log(`   ❌ Corner ${i} NOT in bbox after adding!`);
    allCornersInBboxAfter = false;
  }
});

console.log(`\n8. All corners in bbox after: ${allCornersInBboxAfter ? '✅' : '❌'}`);

if (allCornersInBbox && allCornersInBboxAfter) {
  console.log("\n✅ getBoundingBox() correctly includes rotated corners!");
} else {
  console.log("\n❌ getBoundingBox() doesn't match getCorners()");
  process.exit(1);
}

