/**
 * Test: Angles at a Vertex (Non-crossing Lines)
 * 
 * When two lines meet at a point (like polygon sides), they don't cross.
 * In this case: outward_angle = 360° - inward_angle
 */

import { Artboard, Line, Angle, Text, Circle } from "w2l";

const artboard = new Artboard({
  width: 800,
  height: 600,
  style: { fill: "#ffffff" },
  boxModel: { padding: 40 },
});

// Title
const title = new Text({
  content: "Angles at a Vertex (Lines Meeting at a Point)",
  fontSize: 20,
  fontWeight: "bold",
});
title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});
artboard.addElement(title);

// Two lines meeting at a point (like polygon sides)
const vertex = { x: 300, y: 300 };
const lineA = new Line({
  start: vertex,
  end: { x: 500, y: 180 },
  style: { stroke: "#3498db", strokeWidth: "3" },
});

const lineB = new Line({
  start: vertex,
  end: { x: 520, y: 380 },
  style: { stroke: "#e74c3c", strokeWidth: "3" },
});

artboard.addElement(lineA);
artboard.addElement(lineB);

// Mark vertex
const marker = new Circle({
  radius: 5,
  style: { fill: "#000000", stroke: "none" },
});
artboard.addElement(marker);
marker.position({
  relativeTo: vertex,
  relativeFrom: marker.center,
});

// Inward angle (inside the "wedge") - use rays pointing away from vertex
const angleIn = new Angle({
  between: [lineA, lineB],
  ray1: "+",
  ray2: "+",
  radius: 70,
  label: "α",
  labelFontSize: 20,
  style: { stroke: "#2ecc71", strokeWidth: "2" },
  debug: true,
});
artboard.addElement(angleIn);

// Outward angle (outside the "wedge") - use rays pointing toward vertex
const angleOut = new Angle({
  between: [lineA, lineB],
  ray1: "-",
  ray2: "-",
  radius: 100,
  label: "β",
  labelFontSize: 20,
  style: { stroke: "#9b59b6", strokeWidth: "2", strokeDasharray: "5,5" },
  debug: true,
});
artboard.addElement(angleOut);

// Explanation
const explanation = new Text({
  content: "When lines meet at a vertex (like polygon sides):\n\nα + β = 360°\n\nThis is different from crossing lines where\nadjacent angles sum to 180°",
  fontSize: 16,
  textAlign: "center",
  style: { fill: "#666" },
  lineHeight: 1.5,
});
explanation.position({
  relativeFrom: explanation.topCenter,
  relativeTo: artboard.contentBox.topLeft,
  x: 300,
  y: 450,
});
artboard.addElement(explanation);

// Legend
const legend = new Text({
  content: "Debug: 🔴 Arc start  🔵 Arc end  🟢 Bisector & label position",
  fontSize: 12,
});
legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 40,
});
artboard.addElement(legend);

return artboard.render();

