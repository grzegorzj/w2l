// Triangle angles and properties demonstration
import { Artboard, Triangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 900, height: 700 },
  backgroundColor: "#f8f9fa"
});

// Right Triangle
const rightTriangle = new Triangle({
  type: "right",
  a: 150,
  b: 200,
  orientation: "bottomLeft",
  style: { 
    fill: "#3498db", 
    stroke: "#2980b9",
    strokeWidth: 2
  }
});

rightTriangle.position({
  relativeFrom: rightTriangle.center,
  relativeTo: artboard.center,
  x: -300,
  y: -100
});

// Get angles
const rightAngles = rightTriangle.angles;
const rightLabel = new Text({
  content: `Right Triangle\nAngles: ${rightAngles.angleA.toFixed(1)}°, ${rightAngles.angleB.toFixed(1)}°, ${rightAngles.angleC.toFixed(1)}°\nArea: ${rightTriangle.area.toFixed(1)} px²`,
  fontSize: 14,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

rightLabel.position({
  relativeFrom: rightLabel.topCenter,
  relativeTo: rightTriangle.center,
  x: 0,
  y: 150
});

// Equilateral Triangle
const equilateralTriangle = new Triangle({
  type: "equilateral",
  a: 180,
  style: { 
    fill: "#2ecc71", 
    stroke: "#27ae60",
    strokeWidth: 2
  }
});

equilateralTriangle.position({
  relativeFrom: equilateralTriangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: -100
});

const equilateralAngles = equilateralTriangle.angles;
const equilateralLabel = new Text({
  content: `Equilateral Triangle\nAngles: ${equilateralAngles.angleA.toFixed(1)}°, ${equilateralAngles.angleB.toFixed(1)}°, ${equilateralAngles.angleC.toFixed(1)}°\nArea: ${equilateralTriangle.area.toFixed(1)} px²`,
  fontSize: 14,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

equilateralLabel.position({
  relativeFrom: equilateralLabel.topCenter,
  relativeTo: equilateralTriangle.center,
  x: 0,
  y: 130
});

// Isosceles Triangle
const isoscelesTriangle = new Triangle({
  type: "isosceles",
  a: 160,
  b: 200,
  style: { 
    fill: "#e74c3c", 
    stroke: "#c0392b",
    strokeWidth: 2
  }
});

isoscelesTriangle.position({
  relativeFrom: isoscelesTriangle.center,
  relativeTo: artboard.center,
  x: 300,
  y: -100
});

const isoscelesAngles = isoscelesTriangle.angles;
const isoscelesLabel = new Text({
  content: `Isosceles Triangle\nAngles: ${isoscelesAngles.angleA.toFixed(1)}°, ${isoscelesAngles.angleB.toFixed(1)}°, ${isoscelesAngles.angleC.toFixed(1)}°\nArea: ${isoscelesTriangle.area.toFixed(1)} px²`,
  fontSize: 14,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

isoscelesLabel.position({
  relativeFrom: isoscelesLabel.topCenter,
  relativeTo: isoscelesTriangle.center,
  x: 0,
  y: 130
});

// Title
const title = new Text({
  content: "Enhanced Triangle Properties",
  fontSize: 32,
  fontWeight: "bold",
  textAlign: "center",
  style: { fill: "#34495e" }
});

title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 30
});

// Add all elements
artboard.addElement(rightTriangle);
artboard.addElement(rightLabel);
artboard.addElement(equilateralTriangle);
artboard.addElement(equilateralLabel);
artboard.addElement(isoscelesTriangle);
artboard.addElement(isoscelesLabel);
artboard.addElement(title);

artboard.render();

