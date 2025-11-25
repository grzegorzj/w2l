/**
 * Example demonstrating mathematical labeling:
 * - Vertex labels (A, B, C)
 * - Side labels (a, b, c)
 * - Angle annotations with arcs
 */

import {
  Artboard,
  Triangle,
  Angle,
  Container,
  Text,
} from "w2l";

// Create artboard
const artboard = new Artboard({
  width: 1200,
  height: 600,
  style: { fill: "#f8f9fa" },
});

// Example 1: Right triangle with all labels
const triangle1 = new Triangle({
  type: "right",
  a: 120,
  b: 90,
  orientation: "bottomLeft",
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: "2" },
});

// Position the triangle
triangle1.position({
  relativeFrom: triangle1.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 150,
  y: 200,
});

// Create vertex labels (uppercase)
const vertexLabels1 = triangle1.createVertexLabels(["$A$", "$B$", "$C$"], 30, 18);

// Create side labels (lowercase)
const sideLabels1 = triangle1.createSideLabels(["$a$", "$b$", "$c$"], { offset: 25, fontSize: 16 });

// Create angle annotation for the right angle
const verts1 = triangle1.absoluteVertices;
const angle1 = new Angle({
  vertex: verts1[0], // Right angle vertex
  startAngle: 0,
  endAngle: 90,
  radius: 35,
  label: "90°",
  labelFontSize: 14,
  style: { stroke: "#f44336", strokeWidth: "2" },
});

// Add all elements to artboard
artboard.addElement(triangle1);
vertexLabels1.forEach(label => artboard.addElement(label));
sideLabels1.forEach(label => artboard.addElement(label));
artboard.addElement(angle1);

// Add title
const title1 = new Text({
  content: "Right Triangle with Labels",
  fontSize: 16,
  fontWeight: "bold",
});
title1.position({
  relativeTo: triangle1.boundingBoxTopLeft,
  relativeFrom: title1.bottomCenter,
  x: 60,
  y: -30,
});
artboard.addElement(title1);

// Example 2: Equilateral triangle with all angles labeled
const triangle2 = new Triangle({
  type: "equilateral",
  a: 140,
  style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: "2" },
});

triangle2.position({
  relativeFrom: triangle2.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 500,
  y: 250,
});

// Create vertex labels
const vertexLabels2 = triangle2.createVertexLabels(["$D$", "$E$", "$F$"], 30, 18);

// Create side labels
const sideLabels2 = triangle2.createSideLabels(["$d$", "$e$", "$f$"], { offset: 25, fontSize: 16 });

// Create angle annotations for all three 60° angles
const verts2 = triangle2.absoluteVertices;

// Calculate angles for each vertex
// For an equilateral triangle pointing up, we need to calculate the actual angles
const angle2a = new Angle({
  vertex: verts2[0], // Bottom-left
  startAngle: 0,    // Horizontal right (toward bottom-right vertex)
  endAngle: 60,     // 60° up toward top vertex
  radius: 35,
  label: "60°",
  labelFontSize: 12,
  style: { stroke: "#f57c00", strokeWidth: "1.5" },
});

const angle2b = new Angle({
  vertex: verts2[1], // Bottom-right
  startAngle: 120,  // Toward top vertex
  endAngle: 180,    // Toward bottom-left vertex
  radius: 35,
  label: "60°",
  labelFontSize: 12,
  style: { stroke: "#f57c00", strokeWidth: "1.5" },
});

const angle2c = new Angle({
  vertex: verts2[2], // Top
  startAngle: 240,  // Toward bottom-left
  endAngle: 300,    // Toward bottom-right
  radius: 35,
  label: "60°",
  labelFontSize: 12,
  style: { stroke: "#f57c00", strokeWidth: "1.5" },
});

// Add all elements to artboard
artboard.addElement(triangle2);
vertexLabels2.forEach(label => artboard.addElement(label));
sideLabels2.forEach(label => artboard.addElement(label));
artboard.addElement(angle2a);
artboard.addElement(angle2b);
artboard.addElement(angle2c);

// Add title
const title2 = new Text({
  content: "Equilateral Triangle (all angles 60°)",
  fontSize: 16,
  fontWeight: "bold",
});
title2.position({
  relativeTo: triangle2.boundingBoxTopLeft,
  relativeFrom: title2.bottomCenter,
  x: 70,
  y: -40,
});
artboard.addElement(title2);

// Example 3: Isosceles triangle with custom labels
const triangle3 = new Triangle({
  type: "isosceles",
  a: 120,
  b: 100,
  style: { fill: "#f3e5f5", stroke: "#7b1fa2", strokeWidth: "2" },
});

triangle3.position({
  relativeFrom: triangle3.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 930,
  y: 270,
});

// Create vertex labels with Greek letters
const vertexLabels3 = triangle3.createVertexLabels(["$P$", "$Q$", "$R$"], 30, 18);

// Create side labels - mark equal sides with same label
const sideLabels3 = triangle3.createSideLabels(["$p$", "$q$", "$q$"], { offset: 25, fontSize: 16 });

// Create angle annotation for the apex angle
const verts3 = triangle3.absoluteVertices;
const angle3 = new Angle({
  vertex: verts3[2], // Top vertex (apex)
  startAngle: 235,
  endAngle: 305,
  radius: 40,
  label: "$\\alpha$",
  labelFontSize: 14,
  style: { stroke: "#7b1fa2", strokeWidth: "2" },
});

// Add all elements to artboard
artboard.addElement(triangle3);
vertexLabels3.forEach(label => artboard.addElement(label));
sideLabels3.forEach(label => artboard.addElement(label));
artboard.addElement(angle3);

// Add title
const title3 = new Text({
  content: "Isosceles Triangle",
  fontSize: 16,
  fontWeight: "bold",
});
title3.position({
  relativeTo: triangle3.boundingBoxTopLeft,
  relativeFrom: title3.bottomCenter,
  x: 60,
  y: -35,
});
artboard.addElement(title3);

// Note: Main title and description could be added here, but simplified for now

return artboard.render();

