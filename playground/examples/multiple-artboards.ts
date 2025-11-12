import { Artboard, Triangle } from 'w2l';

// Create first artboard with a right triangle
const artboard1 = new Artboard({
  size: { width: "600px", height: "400px" },
  padding: "20px",
  backgroundColor: "#ecf0f1"
});

const triangle1 = new Triangle({
  type: "right",
  a: "200px",
  b: "150px",
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: "2px"
  }
});

triangle1.position({
  relativeFrom: triangle1.center,
  relativeTo: artboard1.center,
  x: "0px",
  y: "0px"
});

artboard1.addElement(triangle1);

// Create second artboard with an equilateral triangle
const artboard2 = new Artboard({
  size: { width: "600px", height: "400px" },
  padding: "20px",
  backgroundColor: "#e8f8f5"
});

const triangle2 = new Triangle({
  type: "equilateral",
  a: "180px",
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: "2px"
  }
});

triangle2.position({
  relativeFrom: triangle2.center,
  relativeTo: artboard2.center,
  x: "0px",
  y: "0px"
});

artboard2.addElement(triangle2);

// Create third artboard with an isosceles triangle
const artboard3 = new Artboard({
  size: { width: "600px", height: "400px" },
  padding: "20px",
  backgroundColor: "#ebf5fb"
});

const triangle3 = new Triangle({
  type: "isosceles",
  a: "200px",
  b: "140px",
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: "2px"
  }
});

triangle3.position({
  relativeFrom: triangle3.center,
  relativeTo: artboard3.center,
  x: "0px",
  y: "0px"
});

artboard3.addElement(triangle3);

// Return an array of rendered artboards
return [
  artboard1.render(),
  artboard2.render(),
  artboard3.render()
];

