// Example 27: Horizontal Spread Layout
// Demonstrates spreading elements horizontally with different justify modes
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
for (let i = 0; i < 5; i++) {
  const circle = new Circle({
    radius: 30,
    style: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: "2",
    },
  });
  spread1.addElement(circle);
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

for (let i = 0; i < 5; i++) {
  const rect = new Rectangle({
    width: 60,
    height: 60,
    cornerStyle: "rounded",
    cornerRadius: 10,
    style: {
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: "2",
    },
  });
  spread2.addElement(rect);
}

spread2.position({
  relativeFrom: spread2.center,
  relativeTo: artboard.center,
  x: 0,
  y: -130,
});

const label2 = new Text({
  content: "justify: space-around",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: spread2.topCenter,
  x: 0,
  y: -25,
});

// Example 3: Space-evenly
const spread3 = new SpreadLayout({
  direction: "horizontal",
  width: "900px",
  height: "120px",
  justify: "space-evenly",
  align: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 5; i++) {
  const circle = new Circle({
    radius: 25,
    style: {
      fill: "#2ecc71",
      stroke: "#27ae60",
      strokeWidth: "2",
    },
  });
  spread3.addElement(circle);
}

spread3.position({
  relativeFrom: spread3.center,
  relativeTo: artboard.center,
  x: 0,
  y: 20,
});

const label3 = new Text({
  content: "justify: space-evenly",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: spread3.topCenter,
  x: 0,
  y: -25,
});

// Example 4: Fixed spacing
const spread4 = new SpreadLayout({
  direction: "horizontal",
  width: "900px",
  height: "120px",
  spacing: "40px", // Fixed 40px spacing
  justify: "center",
  align: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 6; i++) {
  const rect = new Rectangle({
    width: 50,
    height: 50,
    style: {
      fill: "#f39c12",
      stroke: "#d68910",
      strokeWidth: "2",
    },
  });
  spread4.addElement(rect);
}

spread4.position({
  relativeFrom: spread4.center,
  relativeTo: artboard.center,
  x: 0,
  y: 170,
});

const label4 = new Text({
  content: "spacing: 40px, justify: center",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label4.position({
  relativeFrom: label4.center,
  relativeTo: spread4.topCenter,
  x: 0,
  y: -25,
});

// Example 5: Start alignment
const spread5 = new SpreadLayout({
  direction: "horizontal",
  width: "900px",
  height: "120px",
  spacing: "30px",
  justify: "start",
  align: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 4; i++) {
  const circle = new Circle({
    radius: 35,
    style: {
      fill: "#9b59b6",
      stroke: "#8e44ad",
      strokeWidth: "2",
    },
  });
  spread5.addElement(circle);
}

spread5.position({
  relativeFrom: spread5.center,
  relativeTo: artboard.center,
  x: 0,
  y: 320,
});

const label5 = new Text({
  content: "spacing: 30px, justify: start",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label5.position({
  relativeFrom: label5.center,
  relativeTo: spread5.topCenter,
  x: 0,
  y: -25,
});

// Add all to artboard
artboard.addElement(spread1);
artboard.addElement(label1);
artboard.addElement(spread2);
artboard.addElement(label2);
artboard.addElement(spread3);
artboard.addElement(label3);
artboard.addElement(spread4);
artboard.addElement(label4);
artboard.addElement(spread5);
artboard.addElement(label5);

artboard.render();
