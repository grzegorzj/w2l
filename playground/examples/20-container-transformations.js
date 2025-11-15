// Test container transformations and how they affect children
import { Artboard, Container, Circle, Rectangle, Triangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#ecf0f1"
});

// Create a container with some shapes inside
const container = new Container({
  size: { width: 300, height: 200 },
  padding: "15px"
});

// Position container at center
container.position({
  relativeFrom: container.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add background to visualize container
const containerBg = new Rectangle({
  width: 300,
  height: 200,
  style: { 
    fill: "#3498db",
    fillOpacity: "0.3",
    stroke: "#2980b9",
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

// Add shapes to container
const circle = new Circle({
  radius: 40,
  style: { fill: "#e74c3c" }
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: container.topLeft,
  x: 75,
  y: 60
});

container.addElement(circle);

const rect = new Rectangle({
  width: 60,
  height: 60,
  style: { fill: "#2ecc71" }
});

rect.position({
  relativeFrom: rect.center,
  relativeTo: container.center,
  x: 0,
  y: 0
});

container.addElement(rect);

const triangle = new Triangle({
  type: "equilateral",
  a: 50,
  style: { fill: "#f39c12" }
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: container.bottomRight,
  x: -60,
  y: -50
});

container.addElement(triangle);

// Add only the container to artboard
// All children are automatically rendered recursively
artboard.addElement(container);

// Test translation: Move the container
container.translate({ along: { x: 1, y: 0 }, distance: 100 });

// Test rotation: Rotate the container
// (Uncomment to test rotation - children should rotate with it)
// container.rotate({ deg: 15 });

artboard.render();

