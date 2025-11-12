/**
 * Example: Rotation and Transformation Test
 *
 * This example demonstrates that corner/edge getters return the ACTUAL
 * transformed positions after rotation, not just the logical positions.
 */

import { Artboard, Rectangle, Circle } from "w2l";

// Create an artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// ===== Example 1: Unrotated Rectangle =====

const rect1 = new Rectangle({
  width: 200,
  height: 100,
  fill: "#3498db",
  stroke: "#2c3e50",
  strokeWidth: 2,
});

// Position at top-left area
rect1.position({
  relativeTo: artboard.topLeft,
  relativeFrom: rect1.topLeft,
  x: "100px",
  y: "100px",
});

artboard.addElement(rect1);

// Add circles at each corner to visualize the actual corner positions
const corners1 = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
corners1.forEach((corner) => {
  const circle = new Circle({
    radius: 5,
    fill: "#e74c3c",
  });
  circle.position({
    relativeTo: rect1[corner],
    relativeFrom: circle.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(circle);
});

// ===== Example 2: Rotated Rectangle (45°) =====

const rect2 = new Rectangle({
  width: 200,
  height: 100,
  fill: "#9b59b6",
  stroke: "#8e44ad",
  strokeWidth: 2,
});

// Position at center-left area
rect2.position({
  relativeTo: artboard.center,
  relativeFrom: rect2.center,
  x: "-150px",
  y: "100px",
});

// Rotate 45 degrees
rect2.rotate({ relativeTo: rect2.center, deg: 45 });

artboard.addElement(rect2);

// Add circles at each corner - these should follow the rotation!
const corners2 = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
corners2.forEach((corner) => {
  const circle = new Circle({
    radius: 5,
    fill: "#e74c3c",
  });
  circle.position({
    relativeTo: rect2[corner],
    relativeFrom: circle.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(circle);
});

// ===== Example 3: Heavily Rotated Rectangle (120°) =====

const rect3 = new Rectangle({
  width: 150,
  height: 80,
  fill: "#2ecc71",
  stroke: "#27ae60",
  strokeWidth: 2,
  cornerStyle: "rounded",
  cornerRadius: 10,
});

// Position at right area
rect3.position({
  relativeTo: artboard.center,
  relativeFrom: rect3.center,
  x: "200px",
  y: "100px",
});

// Rotate 120 degrees
rect3.rotate({ relativeTo: rect3.center, deg: 120 });

artboard.addElement(rect3);

// Add circles at each corner
const corners3 = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
corners3.forEach((corner) => {
  const circle = new Circle({
    radius: 5,
    fill: "#e74c3c",
  });
  circle.position({
    relativeTo: rect3[corner],
    relativeFrom: circle.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(circle);
});

// ===== Example 4: Edge Centers on Rotated Rectangle =====

const rect4 = new Rectangle({
  width: 160,
  height: 60,
  fill: "#f39c12",
  stroke: "#e67e22",
  strokeWidth: 2,
});

// Position at bottom area
rect4.position({
  relativeTo: artboard.bottomCenter,
  relativeFrom: rect4.bottomCenter,
  x: 0,
  y: "-100px",
});

// Rotate 30 degrees
rect4.rotate({ relativeTo: rect4.center, deg: 30 });

artboard.addElement(rect4);

// Add circles at edge centers to show they transform correctly
const edges = ["topCenter", "rightCenter", "bottomCenter", "leftCenter"];
edges.forEach((edge) => {
  const circle = new Circle({
    radius: 6,
    fill: "#16a085",
  });
  circle.position({
    relativeTo: rect4[edge],
    relativeFrom: circle.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(circle);
});

// Render happens automatically - no need to export
artboard.render();

