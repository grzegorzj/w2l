// Container with padding and children
import { Artboard, Container, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#34495e"
});

// Create container with padding
const container = new Container({
  size: { width: 400, height: 350 },
  padding: "30px"
});

container.position({
  relativeFrom: container.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add a background rectangle to visualize the container
const containerBg = new Rectangle({
  width: 400,
  height: 350,
  style: { 
    fill: "#2c3e50",
    stroke: "#3498db",
    strokeWidth: "2"
  }
});

containerBg.position({
  relativeFrom: containerBg.topLeft,
  relativeTo: container.topLeft,
  x: 0,
  y: 0
});

artboard.addElement(containerBg);

// Add circles to container - they'll respect padding
const circle1 = new Circle({
  radius: 40,
  style: { fill: "#e74c3c" }
});

circle1.position({
  relativeFrom: circle1.center,
  relativeTo: container.topLeft,
  x: 60,
  y: 60
});

const circle2 = new Circle({
  radius: 50,
  style: { fill: "#3498db" }
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: container.center,
  x: 0,
  y: 0
});

const circle3 = new Circle({
  radius: 35,
  style: { fill: "#2ecc71" }
});

circle3.position({
  relativeFrom: circle3.center,
  relativeTo: container.bottomRight,
  x: -60,
  y: -60
});

container.addElement(circle1);
container.addElement(circle2);
container.addElement(circle3);

artboard.addElement(circle1);
artboard.addElement(circle2);
artboard.addElement(circle3);

artboard.render();

