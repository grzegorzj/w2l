import {
  Artboard,
  Triangle,
  Quadrilateral,
  Text,
} from "w2l";

/**
 * Demonstrates the new showAngles() and showAngle() API for geometric figures.
 * 
 * These methods provide a convenient way to annotate angles without manually
 * creating Angle components.
 */

const artboard = new Artboard({ width: 1400, height: 900 });

// ========================================
// Section 1: Triangle - showAngles() for all internal angles
// ========================================

const title1 = new Text({
  content: "Triangle.showAngles() - All Internal Angles",
  fontSize: 18,
  style: { fontWeight: "bold" },
});
title1.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title1.topLeft,
  x: 50,
  y: 50,
});
artboard.addElement(title1);

const triangle1 = new Triangle({
  type: "right",
  a: 100,
  b: 80,
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: "2" },
});

triangle1.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: triangle1.boundingBoxTopLeft,
  x: 100,
  y: 120,
});

// Show all internal angles with labels
const angles1 = triangle1.showAngles({
  mode: "internal",
  labels: ["α", "β", "γ"],
  style: { stroke: "#1976d2", strokeWidth: "2" },
});

artboard.addElement(triangle1);
angles1.forEach((angle) => artboard.addElement(angle));

// ========================================
// Section 2: Triangle - showAngle() for a specific angle
// ========================================

const title2 = new Text({
  content: "Triangle.showAngle(index) - Specific Angle",
  fontSize: 18,
  style: { fontWeight: "bold" },
});
title2.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title2.topLeft,
  x: 400,
  y: 50,
});
artboard.addElement(title2);

const triangle2 = new Triangle({
  type: "equilateral",
  a: 100,
  style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: "2" },
});

triangle2.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: triangle2.boundingBoxTopLeft,
  x: 450,
  y: 120,
});

// Show only one specific angle
const specificAngle = triangle2.showAngle(0, {
  mode: "internal",
  label: "60°",
  radius: 45,
  style: { stroke: "#f57c00", strokeWidth: "2.5" },
});

artboard.addElement(triangle2);
artboard.addElement(specificAngle);

// ========================================
// Section 3: Triangle - External angles
// ========================================

const title3 = new Text({
  content: "Triangle - External Angles",
  fontSize: 18,
  style: { fontWeight: "bold" },
});
title3.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title3.topLeft,
  x: 750,
  y: 50,
});
artboard.addElement(title3);

const triangle3 = new Triangle({
  type: "isosceles",
  a: 100,
  b: 100,
  style: { fill: "#f3e5f5", stroke: "#7b1fa2", strokeWidth: "2" },
});

triangle3.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: triangle3.boundingBoxTopLeft,
  x: 800,
  y: 120,
});

// Show external angles
const externalAngles = triangle3.showAngles({
  mode: "external",
  labels: ["α'", "β'", "γ'"],
  radius: 50,
  style: { stroke: "#7b1fa2", strokeWidth: "2", strokeDasharray: "5,5" },
});

artboard.addElement(triangle3);
externalAngles.forEach((angle) => artboard.addElement(angle));

// ========================================
// Section 4: Rectangle - Right angle markers
// ========================================

const title4 = new Text({
  content: "Rectangle.showAngles() - Right Angle Markers",
  fontSize: 18,
  style: { fontWeight: "bold" },
});
title4.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title4.topLeft,
  x: 50,
  y: 350,
});
artboard.addElement(title4);

const rectangle = new Quadrilateral({
  type: "rectangle",
  a: 120,
  b: 80,
  style: { fill: "#e8f5e9", stroke: "#2e7d32", strokeWidth: "2" },
});

rectangle.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: rectangle.boundingBoxTopLeft,
  x: 100,
  y: 420,
});

// Show all angles with square markers for right angles
const rectAngles = rectangle.showAngles({
  mode: "internal",
  radius: 25,
  rightAngleMarker: "square",
  style: { stroke: "#2e7d32", strokeWidth: "2" },
});

artboard.addElement(rectangle);
rectAngles.forEach((angle) => artboard.addElement(angle));

// ========================================
// Section 5: Parallelogram - Mixed angle markers
// ========================================

const title5 = new Text({
  content: "Parallelogram - Internal and External Angles",
  fontSize: 18,
  style: { fontWeight: "bold" },
});
title5.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title5.topLeft,
  x: 400,
  y: 350,
});
artboard.addElement(title5);

const parallelogram = new Quadrilateral({
  type: "parallelogram",
  a: 120,
  b: 70,
  angle: 60,
  style: { fill: "#fce4ec", stroke: "#c2185b", strokeWidth: "2" },
});

parallelogram.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: parallelogram.boundingBoxTopLeft,
  x: 450,
  y: 420,
});

// Show internal angles at vertices 0 and 2
const paraInternal1 = parallelogram.showAngle(0, {
  mode: "internal",
  label: "60°",
  radius: 35,
  style: { stroke: "#c2185b", strokeWidth: "2" },
});

const paraInternal2 = parallelogram.showAngle(2, {
  mode: "internal",
  label: "60°",
  radius: 35,
  style: { stroke: "#c2185b", strokeWidth: "2" },
});

// Show internal angles at vertices 1 and 3
const paraInternal3 = parallelogram.showAngle(1, {
  mode: "internal",
  label: "120°",
  radius: 35,
  style: { stroke: "#1976d2", strokeWidth: "2" },
});

const paraInternal4 = parallelogram.showAngle(3, {
  mode: "internal",
  label: "120°",
  radius: 35,
  style: { stroke: "#1976d2", strokeWidth: "2" },
});

artboard.addElement(parallelogram);
artboard.addElement(paraInternal1);
artboard.addElement(paraInternal2);
artboard.addElement(paraInternal3);
artboard.addElement(paraInternal4);

// ========================================
// Section 6: Rhombus - All external angles
// ========================================

const title6 = new Text({
  content: "Rhombus - External Angles",
  fontSize: 18,
  style: { fontWeight: "bold" },
});
title6.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: title6.topLeft,
  x: 50,
  y: 600,
});
artboard.addElement(title6);

const rhombus = new Quadrilateral({
  type: "rhombus",
  a: 100,
  angle: 70,
  style: { fill: "#fff8e1", stroke: "#f9a825", strokeWidth: "2" },
});

rhombus.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: rhombus.boundingBoxTopLeft,
  x: 100,
  y: 670,
});

// Show all external angles
const rhombusExtAngles = rhombus.showAngles({
  mode: "external",
  labels: ["α", "β", "γ", "δ"],
  radius: 55,
  style: { stroke: "#f9a825", strokeWidth: "2", strokeDasharray: "4,4" },
});

artboard.addElement(rhombus);
rhombusExtAngles.forEach((angle) => artboard.addElement(angle));

// ========================================
// Summary Text
// ========================================

const summaryTitle = new Text({
  content: "New API Summary:",
  fontSize: 14,
  style: { fontWeight: "bold" },
});
summaryTitle.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryTitle.topLeft,
  x: 750,
  y: 600,
});
artboard.addElement(summaryTitle);

const summaryLine1 = new Text({
  content: "• triangle.showAngles({ mode: 'internal', labels: [...] })",
  fontSize: 12,
});
summaryLine1.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine1.topLeft,
  x: 770,
  y: 630,
});
artboard.addElement(summaryLine1);

const summaryLine2 = new Text({
  content: "• triangle.showAngle(0, { mode: 'external', label: 'α' })",
  fontSize: 12,
});
summaryLine2.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine2.topLeft,
  x: 770,
  y: 650,
});
artboard.addElement(summaryLine2);

const summaryLine3 = new Text({
  content: "• quadrilateral.showAngles({ mode: 'internal', ... })",
  fontSize: 12,
});
summaryLine3.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine3.topLeft,
  x: 770,
  y: 670,
});
artboard.addElement(summaryLine3);

const summaryLine4 = new Text({
  content: "• Supports: internal/external modes, custom labels, styling",
  fontSize: 12,
});
summaryLine4.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine4.topLeft,
  x: 770,
  y: 690,
});
artboard.addElement(summaryLine4);

const summaryLine5 = new Text({
  content: "• Automatic right angle detection (square/dot markers)",
  fontSize: 12,
});
summaryLine5.position({
  relativeTo: artboard.contentBox.topLeft,
  relativeFrom: summaryLine5.topLeft,
  x: 770,
  y: 710,
});
artboard.addElement(summaryLine5);

return artboard.render();

