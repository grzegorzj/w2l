// Example 30: Layout Absolute Positioning
// Demonstrates moving elements out of layouts without affecting others
import { Artboard, GridLayout, SpreadLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1200, height: 700 },
  backgroundColor: "#ecf0f1",
});

// Grid Layout Example
const grid = new GridLayout({
  columns: 4,
  rows: 3,
  width: 500,
  height: 300,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
});

const gridCircles = [];
for (let i = 0; i < 12; i++) {
  const circle = new Circle({
    radius: 25,
    name: `grid-circle-${i}`,
    style: {
      fill: i === 5 ? "#e74c3c" : "#3498db", // Highlight the one we'll move
      stroke: i === 5 ? "#c0392b" : "#2980b9",
      strokeWidth: "2",
    },
  });
  grid.addElement(circle);
  gridCircles.push(circle);
}

grid.position({
  relativeFrom: grid.center,
  relativeTo: artboard.center,
  x: -300,
  y: -100,
});

const gridLabel = new Text({
  content: "Grid: Red circle moved out →",
  fontSize: 16,
  style: { fill: "#2c3e50" },
});

gridLabel.position({
  relativeFrom: gridLabel.center,
  relativeTo: grid.topCenter,
  x: 0,
  y: -30,
});

// Move one circle (index 5) out of the grid
// Other circles should stay in place
gridCircles[5].position({
  relativeFrom: gridCircles[5].center,
  relativeTo: gridCircles[5].center,
  x: 200, // Move 200px to the right
  y: -50, // Move 50px up
});

// Spread Layout Example
const spread = new SpreadLayout({
  direction: "horizontal",
  width: 500,
  height: 100,
  justify: "space-between",
  align: "center",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
});

const spreadRects = [];
for (let i = 0; i < 5; i++) {
  const rect = new Rectangle({
    width: 60,
    height: 60,
    name: `spread-rect-${i}`,
    cornerStyle: "rounded",
    cornerRadius: 8,
    style: {
      fill: i === 2 ? "#2ecc71" : "#9b59b6", // Highlight the one we'll move
      stroke: i === 2 ? "#27ae60" : "#8e44ad",
      strokeWidth: "2",
    },
  });
  spread.addElement(rect);
  spreadRects.push(rect);
}

spread.position({
  relativeFrom: spread.center,
  relativeTo: artboard.center,
  x: -300,
  y: 250,
});

const spreadLabel = new Text({
  content: "Spread: Green rect moved down ↓",
  fontSize: 16,
  style: { fill: "#2c3e50" },
});

spreadLabel.position({
  relativeFrom: spreadLabel.center,
  relativeTo: spread.topCenter,
  x: 0,
  y: -30,
});

// Move middle rectangle out of the spread
// Other rectangles should stay in place
spreadRects[2].position({
  relativeFrom: spreadRects[2].center,
  relativeTo: spreadRects[2].center,
  x: 0,
  y: 150, // Move 150px down
});

// Add annotation text
const annotation = new Text({
  content: `Demonstration of Layout Immutability:
  
• When an element is explicitly positioned (position() called),
  it switches to "absolute positioning mode"
  
• Other elements in the layout remain in their original positions
  
• This allows you to "pick out" individual elements without
  disrupting the overall layout structure
  
• The red circle and green rectangle have been moved,
  but all other elements stayed in place`,
  fontSize: 14,
  lineHeight: 1.6,
  style: { fill: "#2c3e50" },
});

annotation.position({
  relativeFrom: annotation.topLeft,
  relativeTo: artboard.center,
  x: 100,
  y: -250,
});

// Add all to artboard
artboard.addElement(grid);
artboard.addElement(gridLabel);
artboard.addElement(spread);
artboard.addElement(spreadLabel);
artboard.addElement(annotation);

artboard.render();

