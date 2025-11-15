// Test nested positioning with containers and transformations
import { Artboard, Container, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50"
});

// Create outer container
const outerContainer = new Container({
  size: { width: 400, height: 350 },
  padding: "20px"
});

// Position outer container at center
outerContainer.position({
  relativeFrom: outerContainer.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add a background for outer container to visualize it
const outerBg = new Rectangle({
  width: 400,
  height: 350,
  style: { 
    fill: "#34495e",
    stroke: "#3498db",
    strokeWidth: "2"
  }
});

outerBg.position({
  relativeFrom: outerBg.topLeft,
  relativeTo: outerContainer.topLeft,
  x: 0,
  y: 0
});

artboard.addElement(outerBg);

// Create inner container inside outer container
const innerContainer = new Container({
  size: { width: 200, height: 150 },
  padding: "10px"
});

// Position inner container inside outer (relative positioning)
innerContainer.position({
  relativeFrom: innerContainer.center,
  relativeTo: outerContainer.center,
  x: -50,
  y: -30
});

// Add inner container to outer container
outerContainer.addElement(innerContainer);

// Add background for inner container
const innerBg = new Rectangle({
  width: 200,
  height: 150,
  style: { 
    fill: "#1abc9c",
    stroke: "#16a085",
    strokeWidth: "2"
  }
});

innerBg.position({
  relativeFrom: innerBg.topLeft,
  relativeTo: innerContainer.topLeft,
  x: 0,
  y: 0
});

outerContainer.addElement(innerBg);

// Add a circle to the inner container
const circle1 = new Circle({
  radius: 25,
  style: { fill: "#e74c3c" }
});

// Position circle inside inner container (should move with both containers)
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: innerContainer.center,
  x: 0,
  y: 0
});

innerContainer.addElement(circle1);

// Add another circle in the outer container (outside inner container)
const circle2 = new Circle({
  radius: 30,
  style: { fill: "#f39c12" }
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: outerContainer.topRight,
  x: -50,
  y: 50
});

outerContainer.addElement(circle2);

// Add text that moves with inner container
const text = new Text({
  content: "Nested!",
  fontSize: "16px",
  fontWeight: "bold",
  style: { fill: "#ecf0f1" }
});

text.position({
  relativeFrom: text.center,
  relativeTo: innerContainer.bottomCenter,
  x: 0,
  y: -15
});

innerContainer.addElement(text);

// Add only the outer container to artboard
// All children are automatically rendered recursively
artboard.addElement(outerContainer);

// Test: Now move the outer container - everything should move together
// (Uncomment to test)
// outerContainer.translate({ along: { x: 1, y: 0 }, distance: 50 });

artboard.render();

