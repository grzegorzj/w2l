import { Artboard, Triangle } from 'w2l';

// Create an artboard with custom settings
const artboard = new Artboard({
  size: { width: "1000px", height: "800px" },
  padding: "40px",
  backgroundColor: "#f5f5f5"
});

// Create an equilateral triangle
const triangle1 = new Triangle({
  type: "equilateral",
  a: "200px",
  fill: "#e74c3c",
  stroke: "#c0392b",
  strokeWidth: "3px"
});

// Position it on the left
triangle1.position({
  relativeFrom: triangle1.center,
  relativeTo: artboard.center,
  x: "-250px",
  y: "0px"
});

// Create a right triangle
const triangle2 = new Triangle({
  type: "right",
  a: "180px",
  b: "240px",
  fill: "#3498db",
  stroke: "#2980b9",
  strokeWidth: "3px",
  orientation: "topRight"
});

// Position it in the center
triangle2.position({
  relativeFrom: triangle2.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

// Create an isosceles triangle
const triangle3 = new Triangle({
  type: "isosceles",
  a: "200px",
  b: "150px",
  fill: "#2ecc71",
  stroke: "#27ae60",
  strokeWidth: "3px"
});

// Position it on the right
triangle3.position({
  relativeFrom: triangle3.center,
  relativeTo: artboard.center,
  x: "250px",
  y: "0px"
});

// Add all triangles to the artboard
artboard.addElement(triangle1);
artboard.addElement(triangle2);
artboard.addElement(triangle3);

// Render the artboard
return artboard.render();

