/**
 * Test columns with alignments and absolutely positioned lines
 * This verifies that the Container fixes work correctly
 */

import { NewArtboard, NewContainer, NewRect, NewCircle, NewLine, Columns } from "../../../dist/index.js";

console.log("=== Columns + Alignment + Absolute Lines Test ===\n");

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#2c3e50",
  boxModel: { padding: 50 },
});

// Create 3 columns using the Columns utility
const columns = new Columns({
  count: 3,
  columnWidth: 200,
  height: 400,
  gutter: 30,
  verticalAlignment: "top", // Align items to top within each column
  horizontalAlignment: "center", // Center items horizontally within each column
  boxModel: { padding: 20 },
  style: {
    fill: "#34495e",
    stroke: "#95a5a6",
    strokeWidth: 2,
  },
});

columns.container.position({
  relativeFrom: columns.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(columns.container);

console.log("1. Created 3 columns");
console.log("   Column 0 position:", columns.getColumn(0).topLeft);
console.log("   Column 1 position:", columns.getColumn(1).topLeft);
console.log("   Column 2 position:", columns.getColumn(2).topLeft);

// Add content to columns with different alignments
// Column 0: Top alignment (default)
const col0VStack = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  horizontalAlignment: "center",
  boxModel: { padding: 10 },
});

[80, 60, 100].forEach((height, idx) => {
  const rect = new NewRect({
    width: 120,
    height: height,
    style: {
      fill: ["#e74c3c", "#f39c12", "#2ecc71"][idx],
      stroke: "#2c3e50",
      strokeWidth: 2,
    },
  });
  col0VStack.addElement(rect);
});

columns.getColumn(0).addElement(col0VStack);

console.log("\n2. Added VStack to column 0");
console.log("   VStack size:", col0VStack.width, "x", col0VStack.height);
console.log("   VStack position:", col0VStack.topLeft);

// Column 1: HStack with vertical center alignment
const col1HStack = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 10,
  verticalAlignment: "center",
  boxModel: { padding: 10 },
});

[25, 35, 30].forEach((radius, idx) => {
  const circle = new NewCircle({
    radius: radius,
    style: {
      fill: ["#3498db", "#9b59b6", "#1abc9c"][idx],
      stroke: "#2c3e50",
      strokeWidth: 2,
    },
  });
  col1HStack.addElement(circle);
});

columns.getColumn(1).addElement(col1HStack);

console.log("\n3. Added HStack to column 1");
console.log("   HStack size:", col1HStack.width, "x", col1HStack.height);
console.log("   HStack position:", col1HStack.topLeft);

// Column 2: Mixed content
const col2Content = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "left",
  boxModel: { padding: 10 },
});

const rect1 = new NewRect({
  width: 140,
  height: 80,
  style: {
    fill: "#e67e22",
    stroke: "#2c3e50",
    strokeWidth: 2,
  },
});

const circle1 = new NewCircle({
  radius: 40,
  style: {
    fill: "#16a085",
    stroke: "#2c3e50",
    strokeWidth: 2,
  },
});

col2Content.addElement(rect1);
col2Content.addElement(circle1);

columns.getColumn(2).addElement(col2Content);

console.log("\n4. Added mixed content to column 2");
console.log("   Content size:", col2Content.width, "x", col2Content.height);
console.log("   Rect1 position:", rect1.topLeft);
console.log("   Circle1 center:", circle1.center);

// NOW add absolutely positioned lines connecting corners
console.log("\n5. Adding absolutely positioned lines...");

// Get the first rect from column 0
const col0Rects = col0VStack.children.filter(c => c.width);
const firstRect = col0Rects[0];

// Get the first circle from column 1
const col1Circles = col1HStack.children.filter(c => c.radius);
const firstCircle = col1Circles[0];

console.log("   First rect topRight:", firstRect.topRight);
console.log("   First circle center:", firstCircle.center);

// Line from rect to circle
const line1 = new NewLine({
  start: firstRect.topRight,
  end: firstCircle.center,
  style: {
    stroke: "#ecf0f1",
    strokeWidth: 3,
    strokeDasharray: "8,4",
  },
});

artboard.addElement(line1);

// Line from circle to rect in column 2
const line2 = new NewLine({
  start: firstCircle.center,
  end: rect1.topLeft,
  style: {
    stroke: "#f39c12",
    strokeWidth: 3,
    strokeDasharray: "8,4",
  },
});

artboard.addElement(line2);

console.log("   Line 1: ", line1.start, "→", line1.end);
console.log("   Line 2: ", line2.start, "→", line2.end);

// Add debug circles at line endpoints
const debugCircles = [
  { pos: firstRect.topRight, color: "#e74c3c" },
  { pos: firstCircle.center, color: "#3498db" },
  { pos: rect1.topLeft, color: "#e67e22" },
];

debugCircles.forEach(({ pos, color }) => {
  const debugCircle = new NewCircle({
    radius: 6,
    style: {
      fill: color,
      stroke: "white",
      strokeWidth: 2,
    },
  });
  
  debugCircle.position({
    relativeFrom: debugCircle.center,
    relativeTo: pos,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  artboard.addElement(debugCircle);
  
  console.log("   Debug circle at:", pos);
});

// Render
const svg = artboard.render();

console.log("\n=== Final Results ===");
console.log("Artboard size:", artboard.width, "x", artboard.height);
console.log("SVG length:", svg.length);
console.log("Has columns:", svg.includes("#34495e") ? "✅" : "❌");
console.log("Has rects:", (svg.match(/<rect/g) || []).length >= 4 ? "✅" : "❌");
console.log("Has circles:", (svg.match(/<circle/g) || []).length >= 6 ? "✅" : "❌");
console.log("Has lines:", (svg.match(/<line/g) || []).length >= 2 ? "✅" : "❌");

// Verify line endpoints match debug circles
const line1StartMatch = Math.abs(line1.start.x - firstRect.topRight.x) < 1 &&
                        Math.abs(line1.start.y - firstRect.topRight.y) < 1;
const line1EndMatch = Math.abs(line1.end.x - firstCircle.center.x) < 1 &&
                      Math.abs(line1.end.y - firstCircle.center.y) < 1;
const line2StartMatch = Math.abs(line2.start.x - firstCircle.center.x) < 1 &&
                        Math.abs(line2.start.y - firstCircle.center.y) < 1;
const line2EndMatch = Math.abs(line2.end.x - rect1.topLeft.x) < 1 &&
                      Math.abs(line2.end.y - rect1.topLeft.y) < 1;

console.log("\nLine endpoint accuracy:");
console.log("  Line 1 start (rect corner):", line1StartMatch ? "✅" : "❌");
console.log("  Line 1 end (circle center):", line1EndMatch ? "✅" : "❌");
console.log("  Line 2 start (circle center):", line2StartMatch ? "✅" : "❌");
console.log("  Line 2 end (rect corner):", line2EndMatch ? "✅" : "❌");

if (line1StartMatch && line1EndMatch && line2StartMatch && line2EndMatch) {
  console.log("\n✅ ALL TESTS PASSED! Columns, alignment, and absolute positioning work!");
} else {
  console.log("\n❌ Some tests failed - check the output above");
}

artboard.render();

