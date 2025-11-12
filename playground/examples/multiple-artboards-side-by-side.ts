import { Artboard, Triangle } from 'w2l';

// Create first artboard with white background
const artboard1 = new Artboard({
  size: { width: 400, height: 400 },
  padding: "20px",
  backgroundColor: "white"
});

// Create second artboard with light gray background
const artboard2 = new Artboard({
  size: { width: 400, height: 400 },
  padding: "20px",
  backgroundColor: "#f0f0f0"
});

// Create third artboard with no background (transparent)
const artboard3 = new Artboard({
  size: { width: 400, height: 400 },
  padding: "20px"
});

// Create a blue triangle for first artboard
const triangle1 = new Triangle({
  type: "right",
  a: 150,
  b: 200,
  style: {
    fill: "#3498db",
    stroke: "#2c3e50",
    strokeWidth: 2
  }
});

triangle1.position({
  relativeFrom: triangle1.center,
  relativeTo: artboard1.center,
  x: 0,
  y: 0
});

// Create a red triangle for second artboard
const triangle2 = new Triangle({
  type: "right",
  a: 100,
  b: 150,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 2
  }
});

triangle2.position({
  relativeFrom: triangle2.center,
  relativeTo: artboard2.center,
  x: 0,
  y: 0
});

// Create a green triangle for third artboard
const triangle3 = new Triangle({
  type: "right",
  a: 120,
  b: 180,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 2
  }
});

triangle3.position({
  relativeFrom: triangle3.center,
  relativeTo: artboard3.center,
  x: 0,
  y: 0
});

// Add triangles to their respective artboards
artboard1.addElement(triangle1);
artboard2.addElement(triangle2);
artboard3.addElement(triangle3);

// Render all three artboards - they will be displayed side by side!
// Each artboard maintains its own background color and styling
artboard1.render();
artboard2.render();
artboard3.render();

