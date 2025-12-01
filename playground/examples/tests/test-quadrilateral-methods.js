/**
 * Demonstration of new altitude, diagonal, and angle methods for quadrilaterals and rectangles
 * Shows how to use the Triangle-like methods on quadrilateral and rectangle shapes
 */

import {
  Artboard,
  Quadrilateral,
  Rect,
  Square,
  Text,
} from "w2l";

const artboard = new Artboard({
  width: 1200,
  height: 800,
  title: "Quadrilateral & Rectangle Methods Demo",
});

// Example 1: Rectangle with diagonals and angle markers
const rect = new Rect({
  width: 150,
  height: 100,
  style: {
    fill: "lightblue",
    stroke: "blue",
    strokeWidth: 2,
  },
});

rect.position({
  relativeTo: { x: 150, y: 150 },
  relativeFrom: rect.center,
  x: 0,
  y: 0,
});

artboard.add(rect);

// Draw diagonals
const rectDiagonals = rect.drawDiagonals({
  stroke: "blue",
  strokeWidth: 1.5,
  strokeDasharray: "5,3",
});
rectDiagonals.forEach((line) => artboard.add(line));

// Show angle markers at all corners (rectangles have 90° angles)
const rectAngles = rect.showAngles({
  rightAngleMarker: "square",
});
rectAngles.forEach((angle) => artboard.add(angle));

// Label the rectangle corners
const rectCornerLabels = rect.createCornerLabels(["$A$", "$B$", "$C$", "$D$"], 25, 14);
rectCornerLabels.forEach((label) => artboard.add(label));

// Add title
const rectTitle = new Text({
  content: "Rectangle: Diagonals & Right Angles",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
rectTitle.position({
  relativeTo: rect.center,
  relativeFrom: rectTitle.center,
  x: 0,
  y: -80,
});
artboard.add(rectTitle);

// Example 2: Square with diagonals
const square = new Square({
  size: 120,
  style: {
    fill: "lightgreen",
    stroke: "green",
    strokeWidth: 2,
  },
});

square.position({
  relativeTo: { x: 450, y: 150 },
  relativeFrom: square.center,
  x: 0,
  y: 0,
});

artboard.add(square);

// Draw diagonals (inherited from Rect)
const squareDiagonals = square.drawDiagonals({
  stroke: "green",
  strokeWidth: 1.5,
  strokeDasharray: "5,3",
});
squareDiagonals.forEach((line) => artboard.add(line));

// Show angles (inherited from Rect)
const squareAngles = square.showAngles({
  rightAngleMarker: "square",
});
squareAngles.forEach((angle) => artboard.add(angle));

// Label corners
const squareLabels = square.createCornerLabels(["$A$", "$B$", "$C$", "$D$"], 25, 14);
squareLabels.forEach((label) => artboard.add(label));

// Add title
const squareTitle = new Text({
  content: "Square: Diagonals (inherited from Rect)",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
squareTitle.position({
  relativeTo: square.center,
  relativeFrom: squareTitle.center,
  x: 0,
  y: -80,
});
artboard.add(squareTitle);

// Example 3: Parallelogram with altitudes and diagonals
const para = new Quadrilateral({
  type: "parallelogram",
  a: 140,
  b: 70,
  angle: 65,
  style: {
    fill: "lightyellow",
    stroke: "orange",
    strokeWidth: 2,
  },
});

para.position({
  relativeTo: { x: 750, y: 150 },
  relativeFrom: para.center,
  x: 0,
  y: 0,
});

artboard.add(para);

// Draw altitudes
const paraAltitudes = para.drawAltitudes({
  stroke: "red",
  strokeWidth: 1,
  strokeDasharray: "3,3",
});
paraAltitudes.forEach((line) => artboard.add(line));

// Draw diagonals
const paraDiagonals = para.drawDiagonals({
  stroke: "orange",
  strokeWidth: 1.5,
  strokeDasharray: "5,3",
});
paraDiagonals.forEach((line) => artboard.add(line));

// Show angles at all vertices
const paraAngles = para.showAngles({
  mode: "internal",
});
paraAngles.forEach((angle) => artboard.add(angle));

// Label vertices
const paraLabels = para.createVertexLabels(["$A$", "$B$", "$C$", "$D$"], 30, 14);
paraLabels.forEach((label) => artboard.add(label));

// Add title
const paraTitle = new Text({
  content: "Parallelogram: Altitudes & Diagonals",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
paraTitle.position({
  relativeTo: para.center,
  relativeFrom: paraTitle.center,
  x: 0,
  y: -60,
});
artboard.add(paraTitle);

// Example 4: Trapezoid with altitudes
const trapezoid = new Quadrilateral({
  type: "trapezoid",
  a: 150, // bottom base
  b: 90,  // top base
  angle: 80, // height
  style: {
    fill: "lightpink",
    stroke: "purple",
    strokeWidth: 2,
  },
});

trapezoid.position({
  relativeTo: { x: 200, y: 450 },
  relativeFrom: trapezoid.center,
  x: 0,
  y: 0,
});

artboard.add(trapezoid);

// Draw altitudes (trapezoids now return only the 2 meaningful altitudes - from top base to bottom base)
const trapAltitudes = trapezoid.drawAltitudes({
  stroke: "purple",
  strokeWidth: 1,
  strokeDasharray: "3,3",
});
trapAltitudes.forEach((line) => artboard.add(line));

// Draw diagonals
const trapDiagonals = trapezoid.drawDiagonals({
  stroke: "purple",
  strokeWidth: 1.5,
  strokeDasharray: "5,3",
});
trapDiagonals.forEach((line) => artboard.add(line));

// Show angles
const trapAngles = trapezoid.showAngles({
  mode: "internal",
});
trapAngles.forEach((angle) => artboard.add(angle));

// Label vertices
const trapLabels = trapezoid.createVertexLabels(["$A$", "$B$", "$C$", "$D$"], 28, 14);
trapLabels.forEach((label) => artboard.add(label));

// Add title
const trapTitle = new Text({
  content: "Trapezoid: Altitudes & Diagonals",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
trapTitle.position({
  relativeTo: trapezoid.center,
  relativeFrom: trapTitle.center,
  x: 0,
  y: -80,
});
artboard.add(trapTitle);

// Example 5: Rhombus with diagonals (they're perpendicular!)
const rhombus = new Quadrilateral({
  type: "rhombus",
  a: 100,
  angle: 60,
  style: {
    fill: "lavender",
    stroke: "darkviolet",
    strokeWidth: 2,
  },
});

rhombus.position({
  relativeTo: { x: 550, y: 480 },
  relativeFrom: rhombus.center,
  x: 0,
  y: 0,
});

artboard.add(rhombus);

// Draw diagonals (perpendicular in rhombus)
const rhombusDiagonals = rhombus.drawDiagonals({
  stroke: "darkviolet",
  strokeWidth: 2,
  strokeDasharray: "5,3",
});
rhombusDiagonals.forEach((line) => artboard.add(line));

// Show angles
const rhombusAngles = rhombus.showAngles({
  mode: "internal",
});
rhombusAngles.forEach((angle) => artboard.add(angle));

// Label vertices
const rhombusLabels = rhombus.createVertexLabels(["$A$", "$B$", "$C$", "$D$"], 28, 14);
rhombusLabels.forEach((label) => artboard.add(label));

// Add title
const rhombusTitle = new Text({
  content: "Rhombus: Perpendicular Diagonals",
  fontSize: 16,
  style: { fontWeight: "bold" },
});
rhombusTitle.position({
  relativeTo: rhombus.center,
  relativeFrom: rhombusTitle.center,
  x: 0,
  y: -80,
});
artboard.add(rhombusTitle);

// Example 6: Demonstration of altitude positioning information
const infoRect = new Rect({
  width: 300,
  height: 180,
  style: {
    fill: "white",
    stroke: "black",
    strokeWidth: 1,
  },
});

infoRect.position({
  relativeTo: { x: 950, y: 480 },
  relativeFrom: infoRect.center,
  x: 0,
  y: 0,
});

artboard.add(infoRect);

// Get diagonal info and display it (use the rect from Example 1, not infoRect)
const diags = rect.getDiagonals();
const infoTitle = new Text({
  content: "Rectangle Diagonal Info:",
  fontSize: 14,
  style: { fontWeight: "bold" },
});
infoTitle.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: infoTitle.topLeft,
  x: 10,
  y: 10,
});
artboard.add(infoTitle);

const info1 = new Text({
  content: `Diagonal 1 length: ${diags[0].length.toFixed(2)}px`,
  fontSize: 12,
});
info1.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: info1.topLeft,
  x: 10,
  y: 35,
});
artboard.add(info1);

const info2 = new Text({
  content: `Diagonal 2 length: ${diags[1].length.toFixed(2)}px`,
  fontSize: 12,
});
info2.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: info2.topLeft,
  x: 10,
  y: 55,
});
artboard.add(info2);

const info3 = new Text({
  content: `Center: (${diags[0].center.x.toFixed(1)}, ${diags[0].center.y.toFixed(1)})`,
  fontSize: 12,
});
info3.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: info3.topLeft,
  x: 10,
  y: 75,
});
artboard.add(info3);

// Show altitude info for parallelogram
const paraAltInfo = para.getAltitudes();
const info4 = new Text({
  content: "Parallelogram altitudes:",
  fontSize: 12,
  style: { fontWeight: "bold" },
});
info4.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: info4.topLeft,
  x: 10,
  y: 100,
});
artboard.add(info4);

const info5 = new Text({
  content: `Height 1: ${paraAltInfo[0].height.toFixed(2)}px`,
  fontSize: 11,
});
info5.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: info5.topLeft,
  x: 10,
  y: 120,
});
artboard.add(info5);

const info6 = new Text({
  content: `Height 2: ${paraAltInfo[1].height.toFixed(2)}px`,
  fontSize: 11,
});
info6.position({
  relativeTo: infoRect.topLeft,
  relativeFrom: info6.topLeft,
  x: 10,
  y: 140,
});
artboard.add(info6);

// Add main title
const mainTitle = new Text({
  content: "Quadrilateral & Rectangle: Altitudes, Diagonals & Angles",
  fontSize: 22,
  style: { fontWeight: "bold" },
});
mainTitle.position({
  relativeTo: { x: 600, y: 40 },
  relativeFrom: mainTitle.center,
  x: 0,
  y: 0,
});
artboard.add(mainTitle);

const subtitle = new Text({
  content: "All quadrilaterals and rectangles now support Triangle-like methods",
  fontSize: 14,
  style: { fill: "#666" },
});
subtitle.position({
  relativeTo: { x: 600, y: 65 },
  relativeFrom: subtitle.center,
  x: 0,
  y: 0,
});
artboard.add(subtitle);

return artboard.render();

