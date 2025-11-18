// Example 28: Vertical Spread Layout
// Demonstrates spreading elements vertically with different alignments
import { Artboard, SpreadLayout, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1200, height: 700 },
  backgroundColor: "#ecf0f1",
});

// Example 1: Vertical spread with center align
const spread1 = new SpreadLayout({
  direction: "vertical",
  width: 180,
  height: 600,
  justify: "space-between",
  align: "center",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 6; i++) {
  const circle = new Circle({
    radius: 25,
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
  x: -450,
  y: 0,
});

const label1 = new Text({
  content: "align: center",
  fontSize: 14,
  style: { fill: "#2c3e50" },
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: spread1.topCenter,
  x: 0,
  y: -25,
});

// Example 2: Vertical spread with start align (left)
const spread2 = new SpreadLayout({
  direction: "vertical",
  width: 180,
  height: 600,
  justify: "space-evenly",
  align: "start",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 5; i++) {
  const rect = new Rectangle({
    width: 80,
    height: 60,
    cornerStyle: "rounded",
    cornerRadius: 8,
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
  x: -225,
  y: 0,
});

const label2 = new Text({
  content: "align: start",
  fontSize: 14,
  style: { fill: "#2c3e50" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: spread2.topCenter,
  x: 0,
  y: -25,
});

// Example 3: Vertical spread with end align (right)
const spread3 = new SpreadLayout({
  direction: "vertical",
  width: 180,
  height: 600,
  justify: "space-around",
  align: "end",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 5; i++) {
  const circle = new Circle({
    radius: 30,
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
  y: 0,
});

const label3 = new Text({
  content: "align: end",
  fontSize: 14,
  style: { fill: "#2c3e50" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: spread3.topCenter,
  x: 0,
  y: -25,
});

// Example 4: Fixed spacing with center align
const spread4 = new SpreadLayout({
  direction: "vertical",
  width: 180,
  height: 600,
  spacing: 30,
  justify: "center",
  align: "center",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 7; i++) {
  const rect = new Rectangle({
    width: 70,
    height: 40,
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
  x: 225,
  y: 0,
});

const label4 = new Text({
  content: "spacing: 30px",
  fontSize: 14,
  style: { fill: "#2c3e50" },
});

label4.position({
  relativeFrom: label4.center,
  relativeTo: spread4.topCenter,
  x: 0,
  y: -25,
});

// Example 5: Start justify
const spread5 = new SpreadLayout({
  direction: "vertical",
  width: 180,
  height: 600,
  spacing: 20,
  justify: "start",
  align: "center",
  style: {
    fill: "#ffffff",
    stroke: "#bdc3c7",
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
  x: 450,
  y: 0,
});

const label5 = new Text({
  content: "justify: start",
  fontSize: 14,
  style: { fill: "#2c3e50" },
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

