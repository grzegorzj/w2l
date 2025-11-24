// Advanced positioning with reference points
import { Artboard, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "20px",
  backgroundColor: "#ecf0f1"
});

// Central rectangle
const centerRect = new Rectangle({
  width: 200,
  height: 150,
  style: { fill: "#34495e" }
});

centerRect.position({
  relativeFrom: centerRect.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Position circles at each corner
const topLeftCircle = new Circle({
  radius: 20,
  style: { fill: "#e74c3c" }
});

topLeftCircle.position({
  relativeFrom: topLeftCircle.center,
  relativeTo: centerRect.topLeft,
  x: 0,
  y: 0
});

const topRightCircle = new Circle({
  radius: 20,
  style: { fill: "#3498db" }
});

topRightCircle.position({
  relativeFrom: topRightCircle.center,
  relativeTo: centerRect.topRight,
  x: 0,
  y: 0
});

const bottomLeftCircle = new Circle({
  radius: 20,
  style: { fill: "#2ecc71" }
});

bottomLeftCircle.position({
  relativeFrom: bottomLeftCircle.center,
  relativeTo: centerRect.bottomLeft,
  x: 0,
  y: 0
});

const bottomRightCircle = new Circle({
  radius: 20,
  style: { fill: "#f39c12" }
});

bottomRightCircle.position({
  relativeFrom: bottomRightCircle.center,
  relativeTo: centerRect.bottomRight,
  x: 0,
  y: 0
});

artboard.addElement(centerRect);
artboard.addElement(topLeftCircle);
artboard.addElement(topRightCircle);
artboard.addElement(bottomLeftCircle);
artboard.addElement(bottomRightCircle);

artboard.render();

