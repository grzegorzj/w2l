/**
 * Example: Artboard Auto-Sizing
 *
 * Tests artboard with auto width and height.
 * The artboard should grow to fit all children, both:
 * - Explicitly positioned elements (rect1, rect2, circle)
 * - Non-positioned elements (defaultContainer at 0,0)
 *
 * This verifies that padding is correctly applied even with auto-sizing.
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from "w2l";

// Artboard with auto-sizing
const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 20 },
});

// Container that is NOT explicitly positioned
// Should default to (0, 0) relative to artboard
// This tests that auto-sizing captures non-positioned children too
const defaultContainer = new NewContainer({
  width: 180,
  height: 140,
  direction: "vertical",
  spacing: 10,
  alignment: "center",
  boxModel: { padding: 15, border: 2 },
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 2,
  },
});

// Add some items to the container
[60, 50].forEach((height) => {
  const rect = new NewRect({
    width: 120,
    height: height,
    style: {
      fill: "#ecf0f1",
      stroke: "#bdc3c7",
      strokeWidth: 2,
    },
  });
  defaultContainer.addElement(rect);
});

// Add some positioned elements
const rect1 = new NewRect({
  width: 200,
  height: 150,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2,
  },
});

rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: { x: 50, y: 50 },
  x: 0,
  y: 0,
});

const rect2 = new NewRect({
  width: 180,
  height: 120,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});

rect2.position({
  relativeFrom: rect2.topLeft,
  relativeTo: { x: 300, y: 100 },
  x: 0,
  y: 0,
});

const circle = new NewCircle({
  radius: 60,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2,
  },
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: { x: 400, y: 300 },
  x: 0,
  y: 0,
});

// Add all elements
artboard.addElement(defaultContainer); // Not positioned - defaults to (0,0)
artboard.addElement(rect1);
artboard.addElement(rect2);
artboard.addElement(circle);

// Debug markers
const debugMarkers = [];

function createDebugCircle(position, color, radius = 4) {
  const debugCircle = new NewCircle({
    radius,
    style: { fill: color, stroke: "white", strokeWidth: 1 },
  });
  debugCircle.position({
    relativeFrom: debugCircle.center,
    relativeTo: position,
    x: 0,
    y: 0,
  });
  return debugCircle;
}

// Mark the default container (should be at top-left of content area)
debugMarkers.push(
  createDebugCircle(defaultContainer.borderBox.topLeft, "#8e44ad", 5),
  createDebugCircle(defaultContainer.borderBox.topRight, "#8e44ad", 5),
  createDebugCircle(defaultContainer.borderBox.bottomLeft, "#8e44ad", 5),
  createDebugCircle(defaultContainer.borderBox.bottomRight, "#8e44ad", 5)
);

// Mark artboard content box corners
debugMarkers.push(
  createDebugCircle(artboard.contentBox.topLeft, "#95a5a6", 6),
  createDebugCircle(artboard.contentBox.topRight, "#95a5a6", 6),
  createDebugCircle(artboard.contentBox.bottomLeft, "#95a5a6", 6),
  createDebugCircle(artboard.contentBox.bottomRight, "#95a5a6", 6)
);

// Add debug markers with high z-index
debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

// The artboard should now have auto-sized to contain all elements
// Element bounds:
//   - defaultContainer at (0,0): 180×140 border box
//   - rect1 at (50,50): 200×150
//   - rect2 at (300,100): 180×120
//   - circle at (400,300): radius 60 → (340,240) to (460,360)
// Bounding box: (0,0) to (480,360)
// Border box: 480 + 20*2 = 520 width, 360 + 20*2 = 400 height

return artboard.render();
