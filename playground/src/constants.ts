export const DEFAULT_CODE = `import { Artboard, Triangle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "800px", height: "600px" },
  padding: "20px",
  backgroundColor: "white"
});

// Create a right triangle (3-4-5)
const triangle = new Triangle({
  type: "right",
  a: "300px",
  b: "400px",
  fill: "#3498db",
  stroke: "#2c3e50",
  strokeWidth: "2px"
});

// Position the triangle at the center
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

// Add triangle to artboard
artboard.addElement(triangle);

// Render the artboard
artboard.render();
`;

