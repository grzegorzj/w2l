/**
 * Test incremental element addition with normalization
 */

import { NewContainer, NewRect } from "./dist/index.js";

console.log("=== Incremental Addition Test ===\n");

const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform",
  boxModel: { padding: 20 },
});

// Add rect1 at negative coords
const rect1 = new NewRect({
  width: 100,
  height: 80,
  style: { fill: "red" },
});

rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: { x: -10, y: -10 },
  x: 0,
  y: 0,
});

console.log("1. Rect1 positioned (before adding)");
console.log("   TopLeft:", rect1.topLeft);

container.addElement(rect1);

console.log("\n2. Rect1 added");
console.log("   Container size:", container.width, "x", container.height);
console.log("   Rect1 topLeft:", rect1.topLeft);

// Add rect2 at positive coords
const rect2 = new NewRect({
  width: 50,
  height: 40,
  style: { fill: "blue" },
});

rect2.position({
  relativeFrom: rect2.topLeft,
  relativeTo: { x: 50, y: 50 },
  x: 0,
  y: 0,
});

console.log("\n3. Rect2 positioned (before adding)");
console.log("   TopLeft:", rect2.topLeft);
console.log("   Rect1 topLeft (before rect2 add):", rect1.topLeft);

container.addElement(rect2);

console.log("\n4. Rect2 added");
console.log("   Container size:", container.width, "x", container.height);
console.log("   Rect1 topLeft (after rect2 add):", rect1.topLeft);
console.log("   Rect2 topLeft:", rect2.topLeft);

// Check if rect1 moved
const rect1Stable = Math.abs(rect1.topLeft.x - 20) < 0.1 && Math.abs(rect1.topLeft.y - 20) < 0.1;

console.log("\n5. Verification:");
console.log(`   Rect1 stable: ${rect1Stable ? '✅' : '❌'} (should be at 20,20, got ${rect1.topLeft.x.toFixed(1)},${rect1.topLeft.y.toFixed(1)})`);

if (rect1Stable) {
  console.log("\n✅ Incremental addition works!");
} else {
  console.log("\n❌ Rect1 moved when rect2 was added");
  process.exit(1);
}

