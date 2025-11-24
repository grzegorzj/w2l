/**
 * Example: Nested Horizontal + Vertical Stacks
 *
 * Demonstrates nesting of horizontal and vertical containers.
 *
 * **FIX**: Position AFTER adding children (so auto-sizing completes first)
 * Structure:
 * - Outer VStack (AUTO-HEIGHT, center alignment, positioned after children added)
 *   - Header rect
 *   - HStack (horizontal, auto-width) with multiple items
 *   - VStack (vertical, auto-height) nested
 *   - Footer rect
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from "w2l";

const artboard = new NewArtboard({
  width: 1000,
  height: 900,
  backgroundColor: "#ecf0f1",
});

// Helper to create debug circles
function createDebugCircle(position, color, radius = 3) {
  const circle = new NewCircle({
    radius,
    style: { fill: color, stroke: "white", strokeWidth: 1 },
  });
  circle.position({
    relativeFrom: circle.center,
    relativeTo: position,
    x: 0,
    y: 0,
  });
  return circle;
}

// Outer VStack - Main container with auto-sizing
const outerVStack = new NewContainer({
  width: 800,
  height: "auto", // Auto-height
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",
  boxModel: { padding: 30, border: 3 },
  style: {
    fill: "#34495e",
    stroke: "#2c3e50",
    strokeWidth: 3,
  },
});

// DON'T position it manually before adding children
// The problem: if we position before auto-sizing, the position becomes stale

// Header rect
const header = new NewRect({
  width: 700,
  height: 80,
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 2,
  },
});

// Inner HStack - Horizontal layout
const innerHStack = new NewContainer({
  width: "auto", // Auto-width
  height: 120,
  direction: "horizontal",
  spacing: 15,
  verticalAlignment: "center", // Center vertically (cross-axis for horizontal stack)
  boxModel: { padding: 15, border: 2 },
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});

// Add items to HStack
const hStackWidths = [100, 120, 90, 110];
const hStackColors = ["#e74c3c", "#f39c12", "#2ecc71", "#1abc9c"];

hStackWidths.forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 70,
    style: {
      fill: hStackColors[idx],
      stroke: "#2c3e50",
      strokeWidth: 2,
    },
  });
  innerHStack.addElement(rect);
});

// Inner VStack - Vertical layout
const innerVStack = new NewContainer({
  width: 500,
  height: "auto", // Auto-height
  direction: "vertical",
  spacing: 12,
  horizontalAlignment: "left", // Align left (cross-axis for vertical stack)
  boxModel: { padding: 15, border: 2 },
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});

// Add items to VStack
const vStackWidths = [400, 300, 450, 350];
const vStackColors = ["#e67e22", "#f39c12", "#d35400", "#e74c3c"];

vStackWidths.forEach((width, idx) => {
  const rect = new NewRect({
    width: width,
    height: 50,
    style: {
      fill: vStackColors[idx],
      stroke: "#2c3e50",
      strokeWidth: 2,
    },
  });
  innerVStack.addElement(rect);
});

// Footer rect
const footer = new NewRect({
  width: 700,
  height: 60,
  style: {
    fill: "#16a085",
    stroke: "#138d75",
    strokeWidth: 2,
  },
});

// Build hierarchy - add children FIRST (so auto-sizing happens)
outerVStack.addElement(header);
outerVStack.addElement(innerHStack);
outerVStack.addElement(innerVStack);
outerVStack.addElement(footer);

// NOW position after auto-sizing is complete
outerVStack.position({
  relativeFrom: outerVStack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

// Add to artboard
artboard.addElement(outerVStack);

// Debug markers
const debugMarkers = [];

// Artboard center (where outerVStack should be centered)
debugMarkers.push(createDebugCircle(artboard.center, "#e74c3c", 8));

// Outer VStack center (should align with artboard center)
debugMarkers.push(createDebugCircle(outerVStack.center, "#f39c12", 6));

// Inner HStack border box
debugMarkers.push(
  createDebugCircle(innerHStack.borderBox.topLeft, "#3498db", 4),
  createDebugCircle(innerHStack.borderBox.topRight, "#3498db", 4),
  createDebugCircle(innerHStack.borderBox.bottomLeft, "#3498db", 4),
  createDebugCircle(innerHStack.borderBox.bottomRight, "#3498db", 4)
);

// Inner VStack border box
debugMarkers.push(
  createDebugCircle(innerVStack.borderBox.topLeft, "#2ecc71", 4),
  createDebugCircle(innerVStack.borderBox.topRight, "#2ecc71", 4),
  createDebugCircle(innerVStack.borderBox.bottomLeft, "#2ecc71", 4),
  createDebugCircle(innerVStack.borderBox.bottomRight, "#2ecc71", 4)
);

// Header and footer corners
debugMarkers.push(
  createDebugCircle(header.topLeft, "#9b59b6", 3),
  createDebugCircle(header.topRight, "#9b59b6", 3),
  createDebugCircle(footer.bottomLeft, "#16a085", 3),
  createDebugCircle(footer.bottomRight, "#16a085", 3)
);

debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

return artboard.render();
