// Prompt: Create two circles and a rectangle, then connect various points between them using Lines to show geometric relationships
import { Artboard, Circle, Rectangle, Line } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ecf0f1",
});

// Create first circle
const circle1 = new Circle({
  radius: 60,
  style: {
    fill: "#3498db",
    fillOpacity: "0.7",
    stroke: "#2980b9",
    strokeWidth: "2",
  },
});

circle1.position({
  relativeFrom: circle1.center,
  relativeTo: artboard.center,
  x: -200,
  y: -80,
});

artboard.addElement(circle1);

// Create second circle
const circle2 = new Circle({
  radius: 50,
  style: {
    fill: "#e74c3c",
    fillOpacity: "0.7",
    stroke: "#c0392b",
    strokeWidth: "2",
  },
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: artboard.center,
  x: 200,
  y: -80,
});

artboard.addElement(circle2);

// Create a rectangle
const rect = new Rectangle({
  width: 280,
  height: 140,
  cornerStyle: "rounded",
  cornerRadius: 10,
  style: {
    fill: "#2ecc71",
    fillOpacity: "0.7",
    stroke: "#27ae60",
    strokeWidth: "2",
  },
});

rect.position({
  relativeFrom: rect.center,
  relativeTo: artboard.center,
  x: 0,
  y: 120,
});

artboard.addElement(rect);

// Connect circle centers
const line1 = new Line({
  start: circle1.center,
  end: circle2.center,
  style: {
    stroke: "#34495e",
    strokeWidth: "2",
    strokeDasharray: "5,5",
  },
});

artboard.addElement(line1);

// Connect circle1 right point to rect top-left corner
const line2 = new Line({
  start: circle1.right,
  end: rect.topLeft,
  style: {
    stroke: "#9b59b6",
    strokeWidth: "2",
  },
});

artboard.addElement(line2);

// Connect circle2 left point to rect top-right corner
const line3 = new Line({
  start: circle2.left,
  end: rect.topRight,
  style: {
    stroke: "#f39c12",
    strokeWidth: "2",
  },
});

artboard.addElement(line3);

// Connect circle1 bottom to rect left-center
const line4 = new Line({
  start: circle1.bottom,
  end: rect.leftCenter,
  style: {
    stroke: "#1abc9c",
    strokeWidth: "2",
    opacity: "0.6",
  },
});

artboard.addElement(line4);

// Connect circle2 bottom to rect right-center
const line5 = new Line({
  start: circle2.bottom,
  end: rect.rightCenter,
  style: {
    stroke: "#e67e22",
    strokeWidth: "2",
    opacity: "0.6",
  },
});

artboard.addElement(line5);

// Draw rectangle diagonals
const diagonal1 = new Line({
  start: rect.diagonal.start,
  end: rect.diagonal.end,
  style: {
    stroke: "#95a5a6",
    strokeWidth: "1",
    strokeDasharray: "3,3",
    opacity: "0.5",
  },
});

artboard.addElement(diagonal1);

const diagonal2 = new Line({
  start: rect.antiDiagonal.start,
  end: rect.antiDiagonal.end,
  style: {
    stroke: "#95a5a6",
    strokeWidth: "1",
    strokeDasharray: "3,3",
    opacity: "0.5",
  },
});

artboard.addElement(diagonal2);

artboard.render();

