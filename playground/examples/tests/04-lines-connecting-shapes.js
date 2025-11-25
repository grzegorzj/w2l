/**
 * Shapes Example: Lines Connecting Shapes
 * 
 * Demonstrates NewLine connecting different shapes
 * to verify line positioning works correctly.
 * 
 * NO CONTAINER - positioning directly on artboard to test artboard positioning.
 */

import { NewArtboard, NewCircle, NewSquare, NewTriangle, NewLine } from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#2c3e50",
  boxModel: { padding: 50 },
});

// Center circle - position at artboard center
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
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(centerCircle);

// Top square - position above center circle
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
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: -250,
  boxReference: "contentBox",
});

artboard.addElement(topSquare);

// Right triangle - position to the right
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
  relativeTo: artboard.contentBox.center,
  x: 250,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(rightTriangle);

// Bottom circle - position below
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
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 250,
  boxReference: "contentBox",
});

artboard.addElement(bottomCircle);

// Left triangle - position to the left
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
  relativeTo: artboard.contentBox.center,
  x: -250,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(leftTriangle);

// Draw lines from center circle to each shape
// Using the NEW positioning-aware NewLine API
const lineTargets = [
  { shape: topSquare, color: "#3498db", name: "topSquare" },
  { shape: rightTriangle, color: "#2ecc71", name: "rightTriangle" },
  { shape: bottomCircle, color: "#f39c12", name: "bottomCircle" },
  { shape: leftTriangle, color: "#9b59b6", name: "leftTriangle" },
];

console.log("=== BEFORE LINE CREATION ===");
console.log("centerCircle.center:", centerCircle.center);
lineTargets.forEach((t) => {
  console.log(`${t.name}.center:`, t.shape.center);
});

lineTargets.forEach((target) => {
  // Calculate the relative offset from center circle to target shape
  const dx = target.shape.center.x - centerCircle.center.x;
  const dy = target.shape.center.y - centerCircle.center.y;
  
  console.log(`${target.name}: dx=${dx}, dy=${dy}`);
  
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
  line.position({
    relativeFrom: line.start,
    relativeTo: centerCircle.center,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });

  artboard.addElement(line);
});

return artboard.render();
