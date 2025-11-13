// Pythagorean theorem visualization
import { Artboard, Triangle, Square } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50",
});

// Create a 3-4-5 right triangle
const triangle = new Triangle({
  type: "right",
  a: 120,
  b: 90,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

artboard.addElement(triangle);

// Get the three sides
const sides = triangle.sides;
const colors = ["#e74c3c", "#3498db", "#2ecc71"];

// Place a square on each side
sides.forEach((side, index) => {
  const square = new Square({
    size: side.length,
    cornerStyle: "rounded",
    cornerRadius: 8,
    style: {
      fill: colors[index],
      fillOpacity: "0.7",
      stroke: colors[index],
      strokeWidth: "2",
    },
  });

  // Position square at the center of the side
  square.position({
    relativeFrom: square.center,
    relativeTo: side.center,
    x: 0,
    y: 0,
  });

  // Rotate to align with the side - the side.angle is used automatically
  square.rotate({ relativeTo: side });

  // Move it outward along the normal
  square.translate({
    along: side.outwardNormal,
    distance: side.length / 2,
  });

  artboard.addElement(square);
});

artboard.render();
