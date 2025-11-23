/**
 * Shapes Example: Lines Connecting Shapes
 * 
 * Demonstrates NewLine connecting different shapes
 * to verify line positioning works correctly.
 */

import { NewArtboard, NewCircle, NewSquare, NewTriangle, NewLine } from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#2c3e50",
  boxModel: { padding: 50 },
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
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
});

artboard.addElement(centerCircle);

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
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: -250,
});

artboard.addElement(topSquare);

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
  relativeTo: artboard.contentBox.center,
  x: 250,
  y: 0,
});

artboard.addElement(rightTriangle);

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
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 250,
});

artboard.addElement(bottomCircle);

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
  relativeTo: artboard.contentBox.center,
  x: -250,
  y: 0,
});

artboard.addElement(leftTriangle);

// Draw lines from center to each shape
// Lines use relative coordinates, so we calculate the vector from center to each shape
const lineTargets = [
  { shape: topSquare, color: "#3498db" },
  { shape: rightTriangle, color: "#2ecc71" },
  { shape: bottomCircle, color: "#f39c12" },
  { shape: leftTriangle, color: "#9b59b6" },
];

lineTargets.forEach((target) => {
  // Calculate relative position
  const dx = target.shape.center.x - centerCircle.center.x;
  const dy = target.shape.center.y - centerCircle.center.y;
  
  const line = new NewLine({
    start: { x: 0, y: 0 },
    end: { x: dx, y: dy },
    style: {
      stroke: target.color,
      strokeWidth: 3,
      strokeDasharray: "10,5",
    },
  });

  // Position the line's start at the center circle
  line.position({
    relativeFrom: line.start,
    relativeTo: centerCircle.center,
    x: 0,
    y: 0,
  });

  artboard.addElement(line);
});

return artboard.render();
