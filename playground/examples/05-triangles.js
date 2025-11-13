// Triangle sides and normals
import { Artboard, Triangle, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ecf0f1"
});

// Main triangle
const triangle = new Triangle({
  type: "right",
  a: 200,
  b: 150,
  style: { 
    fill: "#3498db",
    fillOpacity: "0.7",
    stroke: "#2980b9",
    strokeWidth: "2"
  }
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

artboard.addElement(triangle);

// Mark the center
const centerCircle = new Circle({
  radius: 8,
  style: { fill: "#e74c3c" }
});

centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: triangle.center,
  x: 0,
  y: 0
});

artboard.addElement(centerCircle);

// Place circles at the center of each side
const sides = triangle.sides;
const colors = ["#e74c3c", "#2ecc71", "#f39c12"];

sides.forEach((side, index) => {
  // Circle at side center
  const sideCircle = new Circle({
    radius: 10,
    style: { fill: colors[index] }
  });
  
  sideCircle.position({
    relativeFrom: sideCircle.center,
    relativeTo: side.center,
    x: 0,
    y: 0
  });
  
  artboard.addElement(sideCircle);
  
  // Small circle along outward normal
  const normalCircle = new Circle({
    radius: 6,
    style: { fill: colors[index], fillOpacity: "0.6" }
  });
  
  normalCircle.position({
    relativeFrom: normalCircle.center,
    relativeTo: side.center,
    x: 0,
    y: 0
  });
  
  normalCircle.translate({
    along: side.outwardNormal,
    distance: 40
  });
  
  artboard.addElement(normalCircle);
});

artboard.render();

