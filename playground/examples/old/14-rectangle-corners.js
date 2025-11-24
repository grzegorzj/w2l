// Prompt: Create a rectangle and visualize all its corner and edge center points with colored circles
import { Artboard, Rectangle, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50",
});

// Create a rectangle
const rect = new Rectangle({
  width: 300,
  height: 200,
  cornerStyle: "rounded",
  cornerRadius: 12,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
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

// Define all the reference points
const points = [
  { pos: rect.topLeft, color: "#e74c3c", label: "topLeft" },
  { pos: rect.topCenter, color: "#3498db", label: "topCenter" },
  { pos: rect.topRight, color: "#2ecc71", label: "topRight" },
  { pos: rect.leftCenter, color: "#f39c12", label: "leftCenter" },
  { pos: rect.center, color: "#9b59b6", label: "center" },
  { pos: rect.rightCenter, color: "#1abc9c", label: "rightCenter" },
  { pos: rect.bottomLeft, color: "#e67e22", label: "bottomLeft" },
  { pos: rect.bottomCenter, color: "#95a5a6", label: "bottomCenter" },
  { pos: rect.bottomRight, color: "#d35400", label: "bottomRight" },
];

// Mark each point with a circle
points.forEach((point) => {
  const circle = new Circle({
    radius: 8,
    style: {
      fill: point.color,
      stroke: "#ecf0f1",
      strokeWidth: "2",
    },
  });

  circle.position({
    relativeFrom: circle.center,
    relativeTo: point.pos,
    x: 0,
    y: 0,
  });

  artboard.addElement(circle);
});

artboard.render();

