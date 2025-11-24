// Prompt: Create a triangle and draw all three altitudes from each vertex to the opposite side, with circles marking the foot points
import { Artboard, Triangle, Line, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50",
});

// Create a triangle
const triangle = new Triangle({
  type: "right",
  a: 240,
  b: 180,
  style: {
    fill: "#3498db",
    fillOpacity: "0.5",
    stroke: "#2980b9",
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

// Get the three altitudes
const altitudes = triangle.altitudes;
const colors = ["#e74c3c", "#2ecc71", "#f39c12"];

// Draw each altitude
altitudes.forEach((altitude, index) => {
  // Draw the altitude line
  const altitudeLine = new Line({
    start: altitude.vertex,
    end: altitude.foot,
    style: {
      stroke: colors[index],
      strokeWidth: "2",
      strokeDasharray: "5,5",
    },
  });

  artboard.addElement(altitudeLine);

  // Mark the vertex with a circle
  const vertexCircle = new Circle({
    radius: 7,
    style: {
      fill: colors[index],
      stroke: "#ecf0f1",
      strokeWidth: "2",
    },
  });

  vertexCircle.position({
    relativeFrom: vertexCircle.center,
    relativeTo: altitude.vertex,
    x: 0,
    y: 0,
  });

  artboard.addElement(vertexCircle);

  // Mark the foot point with a circle
  const footCircle = new Circle({
    radius: 5,
    style: {
      fill: colors[index],
      fillOpacity: "0.7",
      stroke: "#ecf0f1",
      strokeWidth: "2",
    },
  });

  footCircle.position({
    relativeFrom: footCircle.center,
    relativeTo: altitude.foot,
    x: 0,
    y: 0,
  });

  artboard.addElement(footCircle);
});

// Mark the centroid (where the triangle is positioned)
const centroidCircle = new Circle({
  radius: 6,
  style: {
    fill: "#9b59b6",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

centroidCircle.position({
  relativeFrom: centroidCircle.center,
  relativeTo: triangle.center,
  x: 0,
  y: 0,
});

artboard.addElement(centroidCircle);

artboard.render();

