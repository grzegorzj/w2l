/**
 * Trace through normalization to understand the bug
 */

import { NewContainer, NewRect } from "./dist/index.js";

console.log("=== Normalization Trace ===\n");

// Simple test: single rect that extends into negative space
const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform",
  boxModel: { padding: 20 },
});

console.log("1. Container created");
console.log("   Border box origin:", container.getAbsolutePosition());
console.log("   Content box origin:", container.contentBox.topLeft);
console.log("   Size:", container.width, "x", container.height);

// Add a rect positioned in negative space
const rect = new NewRect({
  width: 100,
  height: 80,
  style: { fill: "red" },
});

// Position rect so its top-left is at (-10, -10) in absolute coords
rect.position({
  relativeFrom: rect.topLeft,
  relativeTo: { x: -10, y: -10 },
  x: 0,
  y: 0,
});

console.log("\n2. Rect positioned (before adding)");
console.log("   Rect topLeft:", rect.topLeft);
console.log("   Rect bottomRight:", rect.bottomRight);

container.addElement(rect);

console.log("\n3. Rect added to container (after normalization)");
console.log("   Container size:", container.width, "x", container.height);
console.log("   Container border box origin:", container.getAbsolutePosition());
console.log("   Container content box origin:", container.contentBox.topLeft);
console.log("   Rect topLeft:", rect.topLeft);
console.log("   Rect bottomRight:", rect.bottomRight);

// Expected result:
// - Rect was at topLeft (-10, -10)
// - Container border box at (0, 0)
// - Container content box at (20, 20) due to padding
// - Rect extends from -10 to 90 (width 100)
// - Relative to content box: from -30 to 70
// - After normalization, should shift by 30
// - Rect should be at (20, 20) to (120, 100)
// - Content size should be 100x80
// - Border size should be 140x120 (100+40, 80+40)

const expectedContentSize = { width: 100, height: 80 };
const expectedBorderSize = { width: 140, height: 120 };
const expectedRectTopLeft = { x: 20, y: 20 };

const contentSizeMatch = 
  container.contentWidth === expectedContentSize.width &&
  container.contentHeight === expectedContentSize.height;

const borderSizeMatch = 
  container.width === expectedBorderSize.width &&
  container.height === expectedBorderSize.height;

const rectPosMatch = 
  Math.abs(rect.topLeft.x - expectedRectTopLeft.x) < 0.1 &&
  Math.abs(rect.topLeft.y - expectedRectTopLeft.y) < 0.1;

console.log("\n4. Verification:");
console.log(`   Content size: ${contentSizeMatch ? '✅' : '❌'} (expected ${expectedContentSize.width}x${expectedContentSize.height}, got ${container.contentWidth}x${container.contentHeight})`);
console.log(`   Border size: ${borderSizeMatch ? '✅' : '❌'} (expected ${expectedBorderSize.width}x${expectedBorderSize.height}, got ${container.width}x${container.height})`);
console.log(`   Rect position: ${rectPosMatch ? '✅' : '❌'} (expected ${expectedRectTopLeft.x},${expectedRectTopLeft.y}, got ${rect.topLeft.x.toFixed(1)},${rect.topLeft.y.toFixed(1)})`);

if (contentSizeMatch && borderSizeMatch && rectPosMatch) {
  console.log("\n✅ Normalization working correctly!");
} else {
  console.log("\n❌ Normalization has bugs");
  process.exit(1);
}

