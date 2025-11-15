// Prompt: Create a comprehensive geometric construction showing rectangle corners, diagonals, triangle heights, and lines connecting various points
import { Artboard, Rectangle, Triangle, Line, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 700 },
  backgroundColor: "#1a1a2e",
});

// Create a rectangle on the left
const rect = new Rectangle({
  width: 200,
  height: 150,
  cornerStyle: "rounded",
  cornerRadius: 8,
  style: {
    fill: "#16213e",
    stroke: "#0f3460",
    strokeWidth: "2",
  },
});

rect.position({
  relativeFrom: rect.center,
  relativeTo: artboard.center,
  x: -280,
  y: 0,
});

artboard.addElement(rect);

// Draw rectangle diagonals
const rectDiag1 = new Line({
  start: rect.diagonal.start,
  end: rect.diagonal.end,
  style: {
    stroke: "#e94560",
    strokeWidth: "1.5",
    opacity: "0.5",
  },
});

artboard.addElement(rectDiag1);

const rectDiag2 = new Line({
  start: rect.antiDiagonal.start,
  end: rect.antiDiagonal.end,
  style: {
    stroke: "#e94560",
    strokeWidth: "1.5",
    opacity: "0.5",
  },
});

artboard.addElement(rectDiag2);

// Mark rectangle corners
const rectCorners = [rect.topLeft, rect.topRight, rect.bottomLeft, rect.bottomRight];
rectCorners.forEach((corner) => {
  const circle = new Circle({
    radius: 4,
    style: {
      fill: "#e94560",
      stroke: "#ffffff",
      strokeWidth: "1",
    },
  });
  circle.position({
    relativeFrom: circle.center,
    relativeTo: corner,
    x: 0,
    y: 0,
  });
  artboard.addElement(circle);
});

// Create a triangle on the right
const triangle = new Triangle({
  type: "right",
  a: 160,
  b: 120,
  style: {
    fill: "#16213e",
    stroke: "#0f3460",
    strokeWidth: "2",
  },
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 280,
  y: 0,
});

artboard.addElement(triangle);

// Draw triangle altitudes
const altitudes = triangle.altitudes;
const altitudeColors = ["#f39c12", "#2ecc71", "#9b59b6"];

altitudes.forEach((altitude, index) => {
  const altitudeLine = new Line({
    start: altitude.vertex,
    end: altitude.foot,
    style: {
      stroke: altitudeColors[index],
      strokeWidth: "1.5",
      strokeDasharray: "4,4",
      opacity: "0.7",
    },
  });
  artboard.addElement(altitudeLine);

  // Mark vertices
  const vertexCircle = new Circle({
    radius: 5,
    style: {
      fill: altitudeColors[index],
      stroke: "#ffffff",
      strokeWidth: "1",
    },
  });
  vertexCircle.position({
    relativeFrom: vertexCircle.center,
    relativeTo: altitude.vertex,
    x: 0,
    y: 0,
  });
  artboard.addElement(vertexCircle);

  // Mark foot points
  const footCircle = new Circle({
    radius: 3,
    style: {
      fill: altitudeColors[index],
      opacity: "0.7",
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

// Connect rectangle center to triangle center
const connectLine = new Line({
  start: rect.center,
  end: triangle.center,
  style: {
    stroke: "#3498db",
    strokeWidth: "2",
    opacity: "0.4",
  },
});

artboard.addElement(connectLine);

// Connect specific points between shapes
const connection1 = new Line({
  start: rect.rightCenter,
  end: triangle.getVertices()[0],
  style: {
    stroke: "#1abc9c",
    strokeWidth: "1",
    opacity: "0.3",
  },
});

artboard.addElement(connection1);

// Mark centers
const rectCenterCircle = new Circle({
  radius: 6,
  style: {
    fill: "#3498db",
    stroke: "#ffffff",
    strokeWidth: "2",
  },
});

rectCenterCircle.position({
  relativeFrom: rectCenterCircle.center,
  relativeTo: rect.center,
  x: 0,
  y: 0,
});

artboard.addElement(rectCenterCircle);

const triangleCenterCircle = new Circle({
  radius: 6,
  style: {
    fill: "#3498db",
    stroke: "#ffffff",
    strokeWidth: "2",
  },
});

triangleCenterCircle.position({
  relativeFrom: triangleCenterCircle.center,
  relativeTo: triangle.center,
  x: 0,
  y: 0,
});

artboard.addElement(triangleCenterCircle);

artboard.render();

