// Test the new Inspector feature
// This example creates a simple layout to test the inspector functionality

const { Artboard, Circle, Rectangle, Text, HStack, VStack, Container } = w2l;

// Create an artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",
  backgroundColor: "#f5f5f5"
});

// Create some named elements to make them easy to identify in the inspector
const title = new Text({
  content: "Inspector Test",
  fontSize: 32,
  fontWeight: "bold",
  name: "title"
});

const circle1 = new Circle({
  radius: 50,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3
  },
  name: "blue-circle"
});

const circle2 = new Circle({
  radius: 50,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 3
  },
  name: "red-circle"
});

const rect1 = new Rectangle({
  width: 100,
  height: 80,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 3
  },
  name: "green-rectangle"
});

const rect2 = new Rectangle({
  width: 100,
  height: 80,
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 3
  },
  name: "orange-rectangle"
});

// Create a horizontal stack with circles
const circleStack = new HStack({
  children: [circle1, circle2],
  spacing: 20,
  name: "circle-stack"
});

// Create a horizontal stack with rectangles
const rectStack = new HStack({
  children: [rect1, rect2],
  spacing: 20,
  name: "rectangle-stack"
});

// Create a vertical stack with all elements
const mainStack = new VStack({
  children: [title, circleStack, rectStack],
  spacing: 30,
  name: "main-stack"
});

// Create a container to center everything
const container = new Container({
  children: [mainStack],
  name: "root-container"
});

// Add to artboard
artboard.addElement(container);

// Position the container in the center
mainStack.position({
  relativeFrom: mainStack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Instructions text
const instructions = new Text({
  content: "Click the 🔍 button to open the Inspector!",
  fontSize: 14,
  style: {
    fill: "#7f8c8d"
  },
  name: "instructions"
});

artboard.addElement(instructions);

instructions.position({
  relativeFrom: instructions.bottomCenter,
  relativeTo: artboard.bottomCenter,
  x: 0,
  y: -10
});

artboard.render();

