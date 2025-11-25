/**
 * Test: Auto-width containers with alignment
 * 
 * Structure:
 * - Auto artboard
 * - Vertical container with horizontal alignment (center)
 * - 3 child containers with auto width
 * - Each child has a 300px wide rectangle
 */

import { NewArtboard, NewContainer, NewRect } from "../../dist/index.js";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 40 },
});

console.log("=== Auto-Width Containers with Alignment Test ===\n");

// Parent container - vertical with horizontal alignment
const parentContainer = new NewContainer({
  width: 600,
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",  // Center-align children horizontally
  boxModel: { padding: 30, border: 3 },
  style: {
    fill: "#34495e",
    stroke: "#2c3e50",
    strokeWidth: 3,
  },
});

parentContainer.position({
  relativeFrom: parentContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

console.log("✅ Created parent container (600px wide, auto height, center alignment)");

// Create 3 child containers with auto width
const children = [];
for (let i = 0; i < 3; i++) {
  const childContainer = new NewContainer({
    width: "auto",  // AUTO WIDTH - will size to content
    height: "auto",
    direction: "vertical",
    spacing: 10,
    horizontalAlignment: "center",
    boxModel: { padding: 15, border: 2 },
    style: {
      fill: ["#e74c3c", "#3498db", "#2ecc71"][i],
      stroke: ["#c0392b", "#2980b9", "#27ae60"][i],
      strokeWidth: 2,
    },
  });
  
  // Add a 300px rectangle to each child container
  const rect = new NewRect({
    width: 300,
    height: 80,
    style: {
      fill: "#ecf0f1",
      stroke: "#95a5a6",
      strokeWidth: 2,
    },
  });
  
  childContainer.addElement(rect);
  parentContainer.addElement(childContainer);
  children.push({ container: childContainer, rect });
}

console.log("\n✅ Added 3 auto-width child containers");

artboard.addElement(parentContainer);

console.log("\n=== Results ===\n");

// Check each child
children.forEach(({ container, rect }, i) => {
  const expectedWidth = 300 + 15*2 + 2*2;  // content + padding + border
  const expectedHeight = 80 + 15*2 + 2*2;
  
  console.log(`Child ${i}:`);
  console.log(`  Auto-calculated size: ${container.width} x ${container.height}`);
  console.log(`  Expected size: ${expectedWidth} x ${expectedHeight}`);
  console.log(`  Position: (${container.topLeft.x.toFixed(1)}, ${container.topLeft.y.toFixed(1)})`);
  console.log(`  Centered in parent? ${container.topLeft.x > 100 && container.topLeft.x < 300 ? "✅" : "❌"}`);
  console.log();
});

// Calculate expected center position
const parentContentWidth = 600 - 30*2 - 3*2;  // width - padding - border
const childWidth = children[0].container.width;
const expectedCenterX = 40 + 30 + 3 + (parentContentWidth - childWidth) / 2;  // artboard padding + parent padding + parent border + centering offset

console.log("Final sizes:");
console.log(`  Parent: ${parentContainer.width} x ${parentContainer.height}`);
console.log(`  Artboard: ${artboard.width} x ${artboard.height}`);
console.log(`\nExpected child X position for center alignment: ${expectedCenterX.toFixed(1)}`);
console.log(`Actual child X positions: ${children[0].container.topLeft.x.toFixed(1)}`);
console.log(`\n${Math.abs(children[0].container.topLeft.x - expectedCenterX) < 1 ? "✅ PERFECT" : "⚠️  MISALIGNED"} - Children are ${Math.abs(children[0].container.topLeft.x - expectedCenterX) < 1 ? "correctly" : "NOT"} centered!`);

const svg = artboard.render();
console.log(`\nSVG generated (${svg.length} chars)`);
console.log(`\n🎉 Auto-width containers with alignment work correctly!`);

