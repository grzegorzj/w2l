// Basic shapes demonstration
import { Artboard, Circle, Rectangle, Square, Triangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#f5f5f5"
});

// Circle
const circle = new Circle({
  radius: 50,
  style: { fill: "#3498db" }
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.center,
  x: -200,
  y: -150
});

// Rectangle
const rect = new Rectangle({
  width: 120,
  height: 80,
  style: { fill: "#e74c3c" }
});

rect.position({
  relativeFrom: rect.center,
  relativeTo: artboard.center,
  x: 0,
  y: -150
});

// Square
const square = new Square({
  size: 100,
  style: { fill: "#2ecc71" }
});

square.position({
  relativeFrom: square.center,
  relativeTo: artboard.center,
  x: 200,
  y: -150
});

// Triangle
const triangle = new Triangle({
  type: "right",
  a: 100,
  b: 80,
  style: { fill: "#f39c12" }
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 100
});

artboard.addElement(circle);
artboard.addElement(rect);
artboard.addElement(square);
artboard.addElement(triangle);

artboard.render();

