/**
 * Example: Simple Artboard Auto-Sizing
 * 
 * Clean test of artboard auto-sizing with:
 * - One container with rectangles (NOT positioned - defaults to content area)
 * - One circle positioned far away
 * 
 * Key behaviors:
 * 1. Container respects artboard's 20px padding (positioned at 20, 20)
 * 2. Artboard auto-sizes to contain both container and far circle
 * 3. Only artboard captures globally positioned items (circle), not container
 */

import { NewArtboard, NewContainer, NewRect, NewCircle } from "w2l";

// Artboard with auto-sizing
const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 20 },
});

// Container with some rectangles (NOT positioned - should default to artboard's content area)
const container = new NewContainer({
  width: 200,
  height: 300,
  direction: "vertical",
  spacing: 15,
  alignment: "center",
  boxModel: { padding: 20, border: 3 },
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3,
  },
});

// NO explicit positioning - should default to (0, 0) which respects artboard padding

// Add rectangles to container
const rect1 = new NewRect({
  width: 140,
  height: 60,
  style: {
    fill: "#ecf0f1",
    stroke: "#bdc3c7",
    strokeWidth: 2,
  },
});

const rect2 = new NewRect({
  width: 140,
  height: 80,
  style: {
    fill: "#ecf0f1",
    stroke: "#bdc3c7",
    strokeWidth: 2,
  },
});

const rect3 = new NewRect({
  width: 140,
  height: 70,
  style: {
    fill: "#ecf0f1",
    stroke: "#bdc3c7",
    strokeWidth: 2,
  },
});

container.addElement(rect1);
container.addElement(rect2);
container.addElement(rect3);

// Circle positioned far away from the container
const farCircle = new NewCircle({
  radius: 50,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 3,
  },
});

farCircle.position({
  relativeFrom: farCircle.center,
  relativeTo: { x: 500, y: 450 },
  x: 0,
  y: 0,
});

// Add elements to artboard
artboard.addElement(container);
artboard.addElement(farCircle);

// Debug markers
function createDebugCircle(position, color, radius = 4) {
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

const debugMarkers = [];

// Container corners (blue) - should be at (20, 20) respecting artboard padding
debugMarkers.push(
  createDebugCircle(container.borderBox.topLeft, "#2980b9", 5),
  createDebugCircle(container.borderBox.topRight, "#2980b9", 5),
  createDebugCircle(container.borderBox.bottomLeft, "#2980b9", 5),
  createDebugCircle(container.borderBox.bottomRight, "#2980b9", 5)
);

// Far circle center (red) - positioned at (500, 450)
debugMarkers.push(createDebugCircle(farCircle.center, "#c0392b", 6));

// Artboard content box corners (gray) - should encompass everything with 20px padding around it
debugMarkers.push(
  createDebugCircle(artboard.contentBox.topLeft, "#95a5a6", 7),
  createDebugCircle(artboard.contentBox.topRight, "#95a5a6", 7),
  createDebugCircle(artboard.contentBox.bottomLeft, "#95a5a6", 7),
  createDebugCircle(artboard.contentBox.bottomRight, "#95a5a6", 7)
);

// Add debug markers with high z-index
debugMarkers.forEach((marker, idx) => {
  marker.zIndex = 1000 + idx;
  artboard.addElement(marker);
});

// Expected result:
// - Container defaults to artboard's content box (0, 0) relative to parent
// - Since artboard has 20px padding, container is at absolute (20, 20)
// - Container size 200×300 → extends to (220, 320)
// - Circle at (500, 450) with radius 50 → extends to (550, 500)
// - Bounding box: (20, 20) to (550, 500) = 530×480 content
// - Artboard border box: 530 + 20*2 = 570 width, 480 + 20*2 = 520 height

return artboard.render();

