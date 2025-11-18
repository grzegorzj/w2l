/**
 * Image Backgrounds Example - MINIMAL VERSION FOR DEBUGGING
 */

import {
  Artboard,
  Circle,
  BezierCurve,
  Text,
} from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 1200, height: 800 },
  padding: "40px",
  style: {
    fill: "#f0f0f0",
  },
});

// Title
const title = new Text({
  content: "Minimal Test",
  style: {
    fontSize: "32px",
    fontWeight: "bold",
    fill: "#2c3e50",
    fontFamily: "Arial, sans-serif",
  },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 20,
});
artboard.addElement(title);

console.log("Step 1: Title added");

// Create two circles
const circle1 = new Circle({
  radius: 20,
  style: {
    fill: "#2ecc71",
  },
});
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: { x: "650px", y: "360px" },
  x: 0,
  y: 0,
});
artboard.addElement(circle1);

console.log("Step 2: Circle 1 added");

const circle2 = new Circle({
  radius: 20,
  style: {
    fill: "#9b59b6",
  },
});
circle2.position({
  relativeFrom: circle2.center,
  relativeTo: { x: "850px", y: "440px" },
  x: 0,
  y: 0,
});
artboard.addElement(circle2);

console.log("Step 3: Circle 2 added");

// Test getting reference points
console.log("Circle 1 rightCenter:", circle1.rightCenter);
console.log("Circle 2 leftCenter:", circle2.leftCenter);

// Try creating bezier curve with circle reference points
const connectionCurve = new BezierCurve({
  start: circle1.rightCenter,
  end: circle2.leftCenter,
  controlPoint1: { x: 720, y: 340 },
  controlPoint2: { x: 780, y: 460 },
  style: {
    stroke: "#34495e",
    strokeWidth: 2,
    fill: "none",
  },
});
artboard.addElement(connectionCurve);

console.log("Step 4: Bezier curve added");

// Render
artboard.render();

console.log("Step 5: Rendered!");

