/**
 * New Components Showcase
 * 
 * Demonstrates NewBezierCurve and NewArrow
 */

import {
  NewArtboard,
  NewBezierCurve,
  NewArrow,
  NewCircle,
  NewRect,
} from "w2l";

const artboard = new NewArtboard({
  width: 900,
  height: 500,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 50 },
});

// Three simple shapes
const circle1 = new NewCircle({
  radius: 50,
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: 2 },
});

circle1.position({
  relativeFrom: circle1.center,
  relativeTo: artboard.contentBox.center,
  x: -250,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(circle1);

const circle2 = new NewCircle({
  radius: 50,
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: 2 },
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(circle2);

const circle3 = new NewCircle({
  radius: 50,
  style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: 2 },
});

circle3.position({
  relativeFrom: circle3.center,
  relativeTo: artboard.contentBox.center,
  x: 250,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(circle3);

// Bezier curves connecting them
const c1 = circle1.center;
const c2 = circle2.center;
const c3 = circle3.center;

const curve1 = new NewBezierCurve({
  start: { x: c1.x + 50, y: c1.y },
  end: { x: c2.x - 50, y: c2.y },
  controlPoint1: { x: c1.x + 100, y: c1.y - 60 },
  controlPoint2: { x: c2.x - 100, y: c2.y + 60 },
  style: {
    stroke: "#9b59b6",
    strokeWidth: 3,
    fill: "none",
    strokeDasharray: "8,4",
  },
});

artboard.addElement(curve1);

const curve2 = new NewBezierCurve({
  start: { x: c2.x + 50, y: c2.y },
  end: { x: c3.x - 50, y: c3.y },
  controlPoint1: { x: c2.x + 100, y: c2.y + 60 },
  controlPoint2: { x: c3.x - 100, y: c3.y - 60 },
  style: {
    stroke: "#f39c12",
    strokeWidth: 3,
    fill: "none",
  },
});

artboard.addElement(curve2);

// Arrows
const arrow1 = new NewArrow({
  start: { x: c1.x, y: c1.y - 50 },
  end: { x: c2.x, y: c2.y - 50 },
  headStyle: "triangle",
  headSize: 10,
  style: {
    stroke: "#3498db",
    strokeWidth: 2,
    fill: "#3498db",
  },
});

artboard.addElement(arrow1);

const arrow2 = new NewArrow({
  start: { x: c2.x, y: c2.y + 50 },
  end: { x: c3.x, y: c3.y + 50 },
  headStyle: "line",
  headSize: 12,
  doubleEnded: true,
  style: {
    stroke: "#e74c3c",
    strokeWidth: 2,
  },
});

artboard.addElement(arrow2);

// Sample points on curve
for (let i = 0; i <= 8; i++) {
  const t = i / 8;
  const point = curve1.pointAt(t);
  
  const dot = new NewCircle({
    radius: 3,
    style: { fill: "#9b59b6", opacity: 0.7 },
  });
  
  dot.position({
    relativeFrom: dot.center,
    relativeTo: point,
    x: 0,
    y: 0,
  });
  
  artboard.addElement(dot);
}

return artboard.render();
