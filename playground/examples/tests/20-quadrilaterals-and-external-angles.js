/**
 * Example demonstrating quadrilaterals with external angle markings
 * using the new showAngle() and showAngles() API
 */

import { Artboard, Quadrilateral, Text } from "w2l";

// Create artboard
const artboard = new Artboard({
  width: 1200,
  height: 800,
  style: { fill: "#f8f9fa" },
});

// Example 1: Parallelogram with external angles
const parallelogram = new Quadrilateral({
  type: "parallelogram",
  a: 140,
  b: 80,
  angle: 65,
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: "2" },
});

parallelogram.position({
  relativeFrom: parallelogram.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 100,
  y: 150,
});

// Create vertex and side labels
const paraVertexLabels = parallelogram.createVertexLabels(["$A$", "$B$", "$C$", "$D$"]);
const paraSideLabels = parallelogram.createSideLabels(["$a$", "$b$", "$c$", "$d$"]);

// External angles using new showAngle() API
const paraExtAngle0 = parallelogram.showAngle(0, {
  mode: 'external',
  radius: 40,
  label: "α",
  labelFontSize: 16,
  style: { stroke: "#d32f2f", strokeWidth: "2" },
});

const paraExtAngle1 = parallelogram.showAngle(1, {
  mode: 'external',
  radius: 40,
  label: "β",
  labelFontSize: 16,
  style: { stroke: "#d32f2f", strokeWidth: "2" },
});

// Add all elements to artboard
artboard.addElement(parallelogram);
paraVertexLabels.forEach((label) => artboard.addElement(label));
paraSideLabels.forEach((label) => artboard.addElement(label));
artboard.addElement(paraExtAngle0);
artboard.addElement(paraExtAngle1);

// Example 2: Trapezoid with all external angles marked
const trapezoid = new Quadrilateral({
  type: "trapezoid",
  a: 140,
  b: 80,
  angle: 70,
  style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: "2" },
});

trapezoid.position({
  relativeFrom: trapezoid.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 450,
  y: 150,
});

// Create labels
const trapVertexLabels = trapezoid.createVertexLabels(["$P$", "$Q$", "$R$", "$S$"]);
const trapSideLabels = trapezoid.createSideLabels(["$p$", "$q$", "$r$", "$s$"]);

// External angles at all four vertices using new showAngles() API
const trapAngles = trapezoid.showAngles({
  mode: 'external',
  labels: ["γ", "δ", "ε", "ζ"],
  radius: 35,
  labelFontSize: 16,
  style: { stroke: "#f57c00", strokeWidth: "1.5" },
});

// Add other elements
artboard.addElement(trapezoid);
trapVertexLabels.forEach((label) => artboard.addElement(label));
trapSideLabels.forEach((label) => artboard.addElement(label));
trapAngles.forEach((angle) => artboard.addElement(angle));

// Example 3: Rhombus with acute external angles
const rhombus = new Quadrilateral({
  type: "rhombus",
  a: 90,
  angle: 70,
  style: { fill: "#f3e5f5", stroke: "#7b1fa2", strokeWidth: "2" },
});

rhombus.position({
  relativeFrom: rhombus.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 850,
  y: 150,
});

// Create labels
const rhombusVertexLabels = rhombus.createVertexLabels(["$W$", "$X$", "$Y$", "$Z$"]);
const rhombusSideLabels = rhombus.createSideLabels(["$s$", "$s$", "$s$", "$s$"]);

// Mark two opposite external angles using new showAngle() API
const rhombusExtAngle1 = rhombus.showAngle(1, {
  mode: 'external',
  radius: 40,
  label: "η",
  labelFontSize: 16,
  style: { stroke: "#7b1fa2", strokeWidth: "2" },
});

const rhombusExtAngle3 = rhombus.showAngle(3, {
  mode: 'external',
  radius: 40,
  label: "θ",
  labelFontSize: 16,
  style: { stroke: "#7b1fa2", strokeWidth: "2" },
});

// Add all elements
artboard.addElement(rhombus);
rhombusVertexLabels.forEach((label) => artboard.addElement(label));
rhombusSideLabels.forEach((label) => artboard.addElement(label));
artboard.addElement(rhombusExtAngle1);
artboard.addElement(rhombusExtAngle3);

// Example 4: Rectangle with right angle markers at all corners
const rectangle = new Quadrilateral({
  type: "rectangle",
  a: 140,
  b: 90,
  style: { fill: "#e8f5e9", stroke: "#388e3c", strokeWidth: "2" },
});

rectangle.position({
  relativeFrom: rectangle.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 250,
  y: 450,
});

// Create labels
const rectVertexLabels = rectangle.createVertexLabels(["$M$", "$N$", "$O$", "$P$"]);
const rectSideLabels = rectangle.createSideLabels(["$w$", "$h$", "$w$", "$h$"]);

// Mark all internal right angles with square markers using new showAngles() API
const rectAngles = rectangle.showAngles({
  mode: 'internal',
  radius: 25,
  rightAngleMarker: 'square',
  style: { stroke: "#388e3c", strokeWidth: "2" },
});

// Add other elements
artboard.addElement(rectangle);
rectVertexLabels.forEach((label) => artboard.addElement(label));
rectSideLabels.forEach((label) => artboard.addElement(label));
rectAngles.forEach((angle) => artboard.addElement(angle));

return artboard.render();
