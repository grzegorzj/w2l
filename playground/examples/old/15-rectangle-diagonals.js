// Prompt: Draw a rectangle with both its diagonals, and place circles along the diagonal normals to show the perpendicular directions
import { Artboard, Rectangle, Line, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ecf0f1",
});

// Create a rectangle
const rect = new Rectangle({
  width: 300,
  height: 180,
  cornerStyle: "rounded",
  cornerRadius: 8,
  style: {
    fill: "#3498db",
    fillOpacity: "0.3",
    stroke: "#2980b9",
    strokeWidth: "2",
  },
});

rect.position({
  relativeFrom: rect.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

artboard.addElement(rect);

// Draw the main diagonal (topLeft to bottomRight)
const diagonal1 = new Line({
  start: rect.diagonal.start,
  end: rect.diagonal.end,
  style: {
    stroke: "#e74c3c",
    strokeWidth: "3",
  },
});

artboard.addElement(diagonal1);

// Draw the anti-diagonal (topRight to bottomLeft)
const diagonal2 = new Line({
  start: rect.antiDiagonal.start,
  end: rect.antiDiagonal.end,
  style: {
    stroke: "#2ecc71",
    strokeWidth: "3",
  },
});

artboard.addElement(diagonal2);

// Mark the center (where diagonals intersect)
const centerCircle = new Circle({
  radius: 8,
  style: {
    fill: "#9b59b6",
    stroke: "#ffffff",
    strokeWidth: "2",
  },
});

centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: rect.center,
  x: 0,
  y: 0,
});

artboard.addElement(centerCircle);

// Show outward normals for diagonal 1 (red)
const normal1Circle = new Circle({
  radius: 6,
  style: {
    fill: "#e74c3c",
    fillOpacity: "0.7",
  },
});

normal1Circle.position({
  relativeFrom: normal1Circle.center,
  relativeTo: rect.diagonal.center,
  x: 0,
  y: 0,
});

normal1Circle.translate({
  along: rect.diagonal.outwardNormal,
  distance: 50,
});

artboard.addElement(normal1Circle);

// Show outward normals for diagonal 2 (green)
const normal2Circle = new Circle({
  radius: 6,
  style: {
    fill: "#2ecc71",
    fillOpacity: "0.7",
  },
});

normal2Circle.position({
  relativeFrom: normal2Circle.center,
  relativeTo: rect.antiDiagonal.center,
  x: 0,
  y: 0,
});

normal2Circle.translate({
  along: rect.antiDiagonal.outwardNormal,
  distance: 50,
});

artboard.addElement(normal2Circle);

// Mark corners
[rect.topLeft, rect.topRight, rect.bottomLeft, rect.bottomRight].forEach((corner) => {
  const cornerCircle = new Circle({
    radius: 5,
    style: {
      fill: "#34495e",
      stroke: "#ffffff",
      strokeWidth: "2",
    },
  });

  cornerCircle.position({
    relativeFrom: cornerCircle.center,
    relativeTo: corner,
    x: 0,
    y: 0,
  });

  artboard.addElement(cornerCircle);
});

artboard.render();

