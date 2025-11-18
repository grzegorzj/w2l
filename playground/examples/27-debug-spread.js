// Example 27 Debug: Minimal Spread Layout with debug visualization
// Shows actual element positions vs rendered positions
import { Artboard, SpreadLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 800 },
  backgroundColor: "#2c3e50",
});

// Example 1: Space-between (default)
const spread1 = new SpreadLayout({
  direction: "horizontal",
  width: "900px",
  height: "120px",
  justify: "space-between",
  align: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add elements
const circles = [];
for (let i = 0; i < 5; i++) {
  const circle = new Circle({
    radius: 30,
    name: `circle-${i}`,
    style: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: "2",
    },
  });
  spread1.addElement(circle);
  circles.push(circle);
}

spread1.position({
  relativeFrom: spread1.center,
  relativeTo: artboard.center,
  x: 0,
  y: -280,
});

const label1 = new Text({
  content: "justify: space-between",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: spread1.topCenter,
  x: 0,
  y: -25,
});

// DEBUG: Draw rectangles around circles to show their actual bounds
for (let i = 0; i < circles.length; i++) {
  const circle = circles[i];
  const debugBox = new Rectangle({
    width: 60, // radius * 2
    height: 60,
    name: `debug-circle-${i}`,
    style: {
      fill: "none",
      stroke: "#ff00ff",
      strokeWidth: "2",
      strokeDasharray: "5,5",
    },
  });

  // Position debug box at circle's center
  debugBox.position({
    relativeFrom: debugBox.center,
    relativeTo: circle.center,
    x: 0,
    y: 0,
  });

  artboard.addElement(debugBox);
}

// Example 2: Space-around
const spread2 = new SpreadLayout({
  direction: "horizontal",
  width: "900px",
  height: "120px",
  justify: "space-around",
  align: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// DEBUG: Add boxes around the spread layouts themselves
const layoutDebug1 = new Rectangle({
  width: 900,
  height: 120,
  name: "spread1-bounds",
  style: {
    fill: "none",
    stroke: "#00ffff", // Cyan
    strokeWidth: "3",
    strokeDasharray: "10,5",
  },
});

layoutDebug1.position({
  relativeFrom: layoutDebug1.center,
  relativeTo: spread1.center,
  x: 0,
  y: 0,
});

// DEBUG: Add crosshairs at spread centers to show where they actually are
const crosshair1 = new Rectangle({
  width: 20,
  height: 20,
  name: "spread1-crosshair",
  style: {
    fill: "none",
    stroke: "#ffff00",
    strokeWidth: "3",
  },
});

crosshair1.position({
  relativeFrom: crosshair1.center,
  relativeTo: spread1.center,
  x: 0,
  y: 0,
});

// Add all to artboard
artboard.addElement(spread1);
artboard.addElement(label1);
artboard.addElement(layoutDebug1);
artboard.addElement(crosshair1);

artboard.render();
