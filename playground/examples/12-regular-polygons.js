// Regular polygons demonstration
import { Artboard, RegularPolygon, Text, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 800 },
  backgroundColor: "#f8f9fa"
});

// Title
const title = new Text({
  content: "Regular Polygons",
  fontSize: 36,
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

// Pentagon (5 sides)
const pentagon = new RegularPolygon({
  sides: 5,
  size: 70,
  style: { 
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2
  }
});

pentagon.position({
  relativeFrom: pentagon.center,
  relativeTo: artboard.center,
  x: -300,
  y: -100
});

const pentagonLabel = new Text({
  content: `Pentagon (5)\nInterior angle: ${pentagon.interiorAngle.toFixed(1)}°\nArea: ${pentagon.area.toFixed(1)} px²`,
  fontSize: 13,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

pentagonLabel.position({
  relativeFrom: pentagonLabel.topCenter,
  relativeTo: pentagon.center,
  x: 0,
  y: 100
});

// Hexagon (6 sides)
const hexagon = new RegularPolygon({
  sides: 6,
  size: 70,
  style: { 
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2
  }
});

hexagon.position({
  relativeFrom: hexagon.center,
  relativeTo: artboard.center,
  x: -100,
  y: -100
});

const hexagonLabel = new Text({
  content: `Hexagon (6)\nInterior angle: ${hexagon.interiorAngle.toFixed(1)}°\nArea: ${hexagon.area.toFixed(1)} px²`,
  fontSize: 13,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

hexagonLabel.position({
  relativeFrom: hexagonLabel.topCenter,
  relativeTo: hexagon.center,
  x: 0,
  y: 100
});

// Heptagon (7 sides)
const heptagon = new RegularPolygon({
  sides: 7,
  size: 70,
  style: { 
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 2
  }
});

heptagon.position({
  relativeFrom: heptagon.center,
  relativeTo: artboard.center,
  x: 100,
  y: -100
});

const heptagonLabel = new Text({
  content: `Heptagon (7)\nInterior angle: ${heptagon.interiorAngle.toFixed(1)}°\nArea: ${heptagon.area.toFixed(1)} px²`,
  fontSize: 13,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

heptagonLabel.position({
  relativeFrom: heptagonLabel.topCenter,
  relativeTo: heptagon.center,
  x: 0,
  y: 100
});

// Octagon (8 sides)
const octagon = new RegularPolygon({
  sides: 8,
  size: 70,
  style: { 
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2
  }
});

octagon.position({
  relativeFrom: octagon.center,
  relativeTo: artboard.center,
  x: 300,
  y: -100
});

const octagonLabel = new Text({
  content: `Octagon (8)\nInterior angle: ${octagon.interiorAngle.toFixed(1)}°\nArea: ${octagon.area.toFixed(1)} px²`,
  fontSize: 13,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

octagonLabel.position({
  relativeFrom: octagonLabel.topCenter,
  relativeTo: octagon.center,
  x: 0,
  y: 100
});

// Decagon (10 sides) - with side length mode
const decagon = new RegularPolygon({
  sides: 10,
  size: 40,
  sizeMode: "sideLength",
  rotation: 18,
  style: { 
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 2
  }
});

decagon.position({
  relativeFrom: decagon.center,
  relativeTo: artboard.center,
  x: -150,
  y: 150
});

const decagonLabel = new Text({
  content: `Decagon (10)\nSide length mode\nArea: ${decagon.area.toFixed(1)} px²`,
  fontSize: 13,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

decagonLabel.position({
  relativeFrom: decagonLabel.topCenter,
  relativeTo: decagon.center,
  x: 0,
  y: 100
});

// Dodecagon (12 sides)
const dodecagon = new RegularPolygon({
  sides: 12,
  size: 70,
  style: { 
    fill: "#1abc9c",
    stroke: "#16a085",
    strokeWidth: 2
  }
});

dodecagon.position({
  relativeFrom: dodecagon.center,
  relativeTo: artboard.center,
  x: 150,
  y: 150
});

const dodecagonLabel = new Text({
  content: `Dodecagon (12)\nInterior angle: ${dodecagon.interiorAngle.toFixed(1)}°\nArea: ${dodecagon.area.toFixed(1)} px²`,
  fontSize: 13,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

dodecagonLabel.position({
  relativeFrom: dodecagonLabel.topCenter,
  relativeTo: dodecagon.center,
  x: 0,
  y: 100
});

// Add all elements
artboard.addElement(title);
artboard.addElement(pentagon);
artboard.addElement(pentagonLabel);
artboard.addElement(hexagon);
artboard.addElement(hexagonLabel);
artboard.addElement(heptagon);
artboard.addElement(heptagonLabel);
artboard.addElement(octagon);
artboard.addElement(octagonLabel);
artboard.addElement(decagon);
artboard.addElement(decagonLabel);
artboard.addElement(dodecagon);
artboard.addElement(dodecagonLabel);

artboard.render();

