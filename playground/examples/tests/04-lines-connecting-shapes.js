/**
 * Shapes Example: Lines Connecting Shapes
 * 
 * Demonstrates NewLine connecting different shapes
 * to verify line positioning works correctly.
 * 
 * Uses a freeform container to auto-size and normalize positions.
 */

import { NewArtboard, NewContainer, NewCircle, NewSquare, NewTriangle, NewLine } from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#2c3e50",
  boxModel: { padding: 50 },
});

// Container with auto-sizing to hold all shapes
const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform", // Freeform mode with normalization
  boxModel: { padding: 20 },
  style: {
    fill: "none",
    stroke: "#95a5a6",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
});

// Center circle
const centerCircle = new NewCircle({
  radius: 60,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 3,
  },
});

centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: container.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(centerCircle);

// Top square
const topSquare = new NewSquare({
  size: 100,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3,
  },
});

topSquare.position({
  relativeFrom: topSquare.center,
  relativeTo: container.contentBox.center,
  x: 0,
  y: -250,
  boxReference: "contentBox",
});

container.addElement(topSquare);

// Right triangle
const rightTriangle = new NewTriangle({
  type: "equilateral",
  a: 120,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 3,
  },
});

rightTriangle.position({
  relativeFrom: rightTriangle.center,
  relativeTo: container.contentBox.center,
  x: 250,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(rightTriangle);

// Bottom circle
const bottomCircle = new NewCircle({
  radius: 70,
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 3,
  },
});

bottomCircle.position({
  relativeFrom: bottomCircle.center,
  relativeTo: container.contentBox.center,
  x: 0,
  y: 250,
  boxReference: "contentBox",
});

container.addElement(bottomCircle);

// Left triangle
const leftTriangle = new NewTriangle({
  type: "right",
  a: 100,
  b: 100,
  orientation: "topRight",
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 3,
  },
});

leftTriangle.position({
  relativeFrom: leftTriangle.center,
  relativeTo: container.contentBox.center,
  x: -250,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(leftTriangle);

// Draw lines from center circle to each shape
// Using the NEW positioning-aware NewLine API
const lineTargets = [
  { shape: topSquare, color: "#3498db" },
  { shape: rightTriangle, color: "#2ecc71" },
  { shape: bottomCircle, color: "#f39c12" },
  { shape: leftTriangle, color: "#9b59b6" },
];

lineTargets.forEach((target) => {
  // Calculate the relative offset from center circle to target shape
  const dx = target.shape.center.x - centerCircle.center.x;
  const dy = target.shape.center.y - centerCircle.center.y;
  
  // Create a line with start at (0,0) and end at the relative offset
  const line = new NewLine({
    start: { x: 0, y: 0 },
    end: { x: dx, y: dy },
    style: {
      stroke: target.color,
      strokeWidth: 3,
      strokeDasharray: "10,5",
    },
  });

  // Position the line's start at the center circle's center
  // This now works because NewLine.render() calls getAbsolutePosition()!
  line.position({
    relativeFrom: line.start,
    relativeTo: centerCircle.center,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });

  container.addElement(line);
});

// FINALIZE the freeform layout (calculate size and normalize children)
// This must be called after all children are added but before positioning the container
container.finalizeFreeformLayout();

// Now position the container at the center of the artboard
// (after it has been finalized)
container.position({
  relativeFrom: container.center,
  relativeTo: artboard.contentBox.center,
    x: 0,
    y: 0,
  boxReference: "contentBox",
});

// Add the container to the artboard
artboard.addElement(container);

return artboard.render();
