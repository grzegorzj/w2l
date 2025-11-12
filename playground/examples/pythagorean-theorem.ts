import { Artboard, Triangle, Square } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1200px", height: "900px" },
  padding: "60px",
  backgroundColor: "#ecf0f1"
});

// Create a 3-4-5 right triangle
const triangle = new Triangle({
  type: "right",
  a: "180px",  // 3 units
  b: "240px",  // 4 units
  orientation: "bottomLeft",
  fill: "rgba(52, 152, 219, 0.2)",
  stroke: "#2c3e50",
  strokeWidth: "4px"
});

// Position the triangle at the center
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

artboard.addElement(triangle);

// Get the three sides of the triangle
const sides = triangle.sides;

// Colors for the squares (a², b², c²)
const colors = [
  "#3498db",  // Blue for side a
  "#e74c3c",  // Red for side b
  "#2ecc71"   // Green for hypotenuse c
];

// Create a square on each side
sides.forEach((side, i) => {
  const square = new Square({
    a: side.length,
    cornerStyle: "rounded",
    cornerRadius: "8px",
    fill: `rgba(${i === 0 ? '52, 152, 219' : i === 1 ? '231, 76, 60' : '46, 204, 113'}, 0.6)`,
    stroke: colors[i],
    strokeWidth: "3px"
  });

  // Position square at side center
  square.position({
    relativeTo: side.center,
    relativeFrom: square.center,
    x: "0px",
    y: "0px"
  });

  // Rotate to align with the side
  square.rotate({
    relativeTo: side,
    deg: side.angle
  });

  // Move outward along the normal
  square.translate({
    along: side.outwardNormal,
    distance: side.length / 2
  });

  artboard.addElement(square);
});

// Add small circles at triangle vertices
const vertices = [
  { x: "0px", y: "0px" },      // Will be positioned based on triangle
  { x: "180px", y: "0px" },
  { x: "0px", y: "240px" }
];

sides.forEach((side) => {
  const startCircle = new Circle({
    radius: "8px",
    fill: "#2c3e50",
    stroke: "#ecf0f1",
    strokeWidth: "2px"
  });
  
  startCircle.position({
    relativeFrom: startCircle.center,
    relativeTo: side.start,
    x: "0px",
    y: "0px"
  });
  
  artboard.addElement(startCircle);
});

// Add text annotations (using small colored squares as labels)
const labelColors = ["#3498db", "#e74c3c", "#2ecc71"];
const labelPositions = [
  { x: "-350px", y: "100px" },
  { x: "100px", y: "300px" },
  { x: "-200px", y: "-280px" }
];

labelPositions.forEach((pos, i) => {
  const label = new Square({
    size: "30px",
    cornerStyle: "squircle",
    cornerRadius: "8px",
    fill: labelColors[i],
    stroke: "#2c3e50",
    strokeWidth: "2px"
  });
  
  label.position({
    relativeFrom: label.center,
    relativeTo: artboard.center,
    x: pos.x,
    y: pos.y
  });
  
  artboard.addElement(label);
});

// Import Circle for vertices
import { Circle } from 'w2l';

return artboard.render();

