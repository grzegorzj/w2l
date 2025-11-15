// Test absolute vs relative positioning
// Elements positioned explicitly with position() should use absolute positioning
// Elements added to containers without explicit positioning should use relative positioning
import { Artboard, Container, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#34495e"
});

// Create two containers side by side
const leftContainer = new Container({
  size: { width: 300, height: 400 },
  padding: "20px"
});

leftContainer.position({
  relativeFrom: leftContainer.center,
  relativeTo: artboard.center,
  x: -225,
  y: 0
});

// Background for left container
const leftBg = new Rectangle({
  width: 300,
  height: 400,
  style: { 
    fill: "#2c3e50",
    stroke: "#1abc9c",
    strokeWidth: "2"
  }
});

leftBg.position({
  relativeFrom: leftBg.topLeft,
  relativeTo: leftContainer.topLeft,
  x: 0,
  y: 0
});

artboard.addElement(leftBg);

// Right container
const rightContainer = new Container({
  size: { width: 300, height: 400 },
  padding: "20px"
});

rightContainer.position({
  relativeFrom: rightContainer.center,
  relativeTo: artboard.center,
  x: 225,
  y: 0
});

// Background for right container
const rightBg = new Rectangle({
  width: 300,
  height: 400,
  style: { 
    fill: "#2c3e50",
    stroke: "#e74c3c",
    strokeWidth: "2"
  }
});

rightBg.position({
  relativeFrom: rightBg.topLeft,
  relativeTo: rightContainer.topLeft,
  x: 0,
  y: 0
});

artboard.addElement(rightBg);

// LEFT CONTAINER: Relative positioning (elements move with container)
const leftTitle = new Text({
  content: "Relative",
  fontSize: "20px",
  fontWeight: "bold",
  style: { fill: "#1abc9c" }
});

leftTitle.position({
  relativeFrom: leftTitle.center,
  relativeTo: leftContainer.topCenter,
  x: 0,
  y: 30
});

leftContainer.addElement(leftTitle);

// Circle that moves with container
const relativeCircle = new Circle({
  radius: 40,
  style: { fill: "#1abc9c" }
});

relativeCircle.position({
  relativeFrom: relativeCircle.center,
  relativeTo: leftContainer.center,
  x: 0,
  y: 20
});

leftContainer.addElement(relativeCircle);

// Rectangle that moves with container
const relativeRect = new Rectangle({
  width: 80,
  height: 60,
  style: { fill: "#16a085" }
});

relativeRect.position({
  relativeFrom: relativeRect.center,
  relativeTo: leftContainer.bottomCenter,
  x: 0,
  y: -60
});

leftContainer.addElement(relativeRect);

// RIGHT CONTAINER: Absolute positioning (elements position relative to artboard, not container)
const rightTitle = new Text({
  content: "Absolute",
  fontSize: "20px",
  fontWeight: "bold",
  style: { fill: "#e74c3c" }
});

// Position relative to artboard, not container (absolute)
rightTitle.position({
  relativeFrom: rightTitle.center,
  relativeTo: artboard.center,
  x: 225,
  y: -170
});

// This element should not move when rightContainer moves
const absoluteCircle = new Circle({
  radius: 40,
  style: { fill: "#e74c3c" }
});

absoluteCircle.position({
  relativeFrom: absoluteCircle.center,
  relativeTo: artboard.center,
  x: 225,
  y: 20
});

// Add to container but it won't move with it (already absolutely positioned)
rightContainer.addElement(absoluteCircle);

// Another absolute element
const absoluteRect = new Rectangle({
  width: 80,
  height: 60,
  style: { fill: "#c0392b" }
});

absoluteRect.position({
  relativeFrom: absoluteRect.center,
  relativeTo: artboard.center,
  x: 225,
  y: 130
});

rightContainer.addElement(absoluteRect);

// Add both containers to artboard
// All children are automatically rendered recursively
artboard.addElement(leftContainer);
artboard.addElement(rightContainer);

// Test: Move containers - left elements should move, right elements should stay
// (Uncomment to test)
// leftContainer.translate({ along: { x: 0, y: 1 }, distance: -50 });
// rightContainer.translate({ along: { x: 0, y: 1 }, distance: -50 });

artboard.render();

