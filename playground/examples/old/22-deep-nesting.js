// Test deep nesting hierarchies - containers within containers
import { Artboard, Container, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50"
});

// Level 1: Outer container
const level1Container = new Container({
  size: { width: 500, height: 450 },
  padding: "15px"
});

level1Container.position({
  relativeFrom: level1Container.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

const level1Bg = new Rectangle({
  width: 500,
  height: 450,
  style: { 
    fill: "transparent",
    stroke: "#e74c3c",
    strokeWidth: "3"
  }
});

level1Bg.position({
  relativeFrom: level1Bg.topLeft,
  relativeTo: level1Container.topLeft,
  x: 0,
  y: 0
});

artboard.addElement(level1Bg);

// Level 1 label
const level1Text = new Text({
  content: "Level 1",
  fontSize: "14px",
  fontWeight: "bold",
  style: { fill: "#e74c3c" }
});

level1Text.position({
  relativeFrom: level1Text.topLeft,
  relativeTo: level1Container.topLeft,
  x: 5,
  y: 5
});

level1Container.addElement(level1Text);

// Level 2: Middle container
const level2Container = new Container({
  size: { width: 350, height: 300 },
  padding: "15px"
});

level2Container.position({
  relativeFrom: level2Container.center,
  relativeTo: level1Container.center,
  x: 0,
  y: 20
});

level1Container.addElement(level2Container);

const level2Bg = new Rectangle({
  width: 350,
  height: 300,
  style: { 
    fill: "transparent",
    stroke: "#f39c12",
    strokeWidth: "3"
  }
});

level2Bg.position({
  relativeFrom: level2Bg.topLeft,
  relativeTo: level2Container.topLeft,
  x: 0,
  y: 0
});

level1Container.addElement(level2Bg);

// Level 2 label
const level2Text = new Text({
  content: "Level 2",
  fontSize: "14px",
  fontWeight: "bold",
  style: { fill: "#f39c12" }
});

level2Text.position({
  relativeFrom: level2Text.topLeft,
  relativeTo: level2Container.topLeft,
  x: 5,
  y: 5
});

level2Container.addElement(level2Text);

// Level 3: Inner container
const level3Container = new Container({
  size: { width: 200, height: 150 },
  padding: "10px"
});

level3Container.position({
  relativeFrom: level3Container.center,
  relativeTo: level2Container.center,
  x: 0,
  y: 15
});

level2Container.addElement(level3Container);

const level3Bg = new Rectangle({
  width: 200,
  height: 150,
  style: { 
    fill: "transparent",
    stroke: "#2ecc71",
    strokeWidth: "3"
  }
});

level3Bg.position({
  relativeFrom: level3Bg.topLeft,
  relativeTo: level3Container.topLeft,
  x: 0,
  y: 0
});

level2Container.addElement(level3Bg);

// Level 3 label
const level3Text = new Text({
  content: "Level 3",
  fontSize: "14px",
  fontWeight: "bold",
  style: { fill: "#2ecc71" }
});

level3Text.position({
  relativeFrom: level3Text.topLeft,
  relativeTo: level3Container.topLeft,
  x: 5,
  y: 5
});

level3Container.addElement(level3Text);

// Add a circle at the deepest level
const deepCircle = new Circle({
  radius: 30,
  style: { fill: "#3498db" }
});

deepCircle.position({
  relativeFrom: deepCircle.center,
  relativeTo: level3Container.center,
  x: 0,
  y: 10
});

level3Container.addElement(deepCircle);

// Add only the level 1 container to artboard
// All nested children are automatically rendered recursively
artboard.addElement(level1Container);

// Test: Move level 1 container - everything should move together
// (Uncomment to test)
// level1Container.translate({ along: { x: 1, y: 0 }, distance: 50 });

// Test: Move level 2 container - levels 2 and 3 should move, level 1 border stays
// (Uncomment to test)
// level2Container.translate({ along: { x: 1, y: 1 }, distance: 30 });

// Test: Move level 3 container - only level 3 moves
// (Uncomment to test)
// level3Container.translate({ along: { x: 0, y: 1 }, distance: 20 });

artboard.render();

