/**
 * Example demonstrating quadrilaterals with external angle markings
 */

import { Artboard, Quadrilateral, Angle, Text } from "w2l";

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

// External angles using figure API
const paraExtAngle0 = new Angle({
  figure: parallelogram,
  vertexIndex: 0,
  type: 'outward',
  radius: 35,
  label: `${parallelogram.getExternalAngleAt(0).toFixed(0)}°`,
  style: { stroke: "#d32f2f", strokeWidth: "2" },
});

const paraExtAngle1 = new Angle({
  figure: parallelogram,
  vertexIndex: 1,
  type: 'outward',
  radius: 35,
  label: `${parallelogram.getExternalAngleAt(1).toFixed(0)}°`,
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

// External angles at all four vertices
for (let i = 0; i < 4; i++) {
  const angle = new Angle({
    figure: trapezoid,
    vertexIndex: i,
    type: 'outward',
    radius: 30,
    label: `${trapezoid.getExternalAngleAt(i).toFixed(0)}°`,
    style: { stroke: "#f57c00", strokeWidth: "1.5" },
  });
  artboard.addElement(angle);
}

// Add other elements
artboard.addElement(trapezoid);
trapVertexLabels.forEach((label) => artboard.addElement(label));
trapSideLabels.forEach((label) => artboard.addElement(label));

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

// Mark two opposite external angles
const rhombusExtAngle1 = new Angle({
  figure: rhombus,
  vertexIndex: 1,
  type: 'outward',
  radius: 35,
  label: `${rhombus.getExternalAngleAt(1).toFixed(0)}°`,
  style: { stroke: "#7b1fa2", strokeWidth: "2" },
});

const rhombusExtAngle3 = new Angle({
  figure: rhombus,
  vertexIndex: 3,
  type: 'outward',
  radius: 35,
  label: `${rhombus.getExternalAngleAt(3).toFixed(0)}°`,
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

// Mark all internal right angles with square markers
for (let i = 0; i < 4; i++) {
  const angle = new Angle({
    figure: rectangle,
    vertexIndex: i,
    type: 'inward',
    radius: 25,
    style: { stroke: "#388e3c", strokeWidth: "2" },
  });
  artboard.addElement(angle);
}

// Add other elements
artboard.addElement(rectangle);
rectVertexLabels.forEach((label) => artboard.addElement(label));
rectSideLabels.forEach((label) => artboard.addElement(label));

return artboard.render();
