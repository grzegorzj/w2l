// Example 32: Text in Grid
// Tests whether Text elements render correctly when added to a GridLayout
import { Artboard, GridLayout, Text, Circle, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  backgroundColor: "#2c3e50",
});

// Test 1: Grid with Text elements only
const textGrid = new GridLayout({
  columns: 3,
  rows: 2,
  width: 450,
  height: 250,
  gap: 15,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add text elements
const labels = ["A", "B", "C", "D", "E", "F"];
for (let i = 0; i < 6; i++) {
  const text = new Text({
    content: labels[i],
    fontSize: 32,
    style: { fill: "#e74c3c", fontWeight: "bold" },
  });
  textGrid.addElement(text);
}

textGrid.position({
  relativeFrom: textGrid.center,
  relativeTo: artboard.center,
  x: -400,
  y: -250,
});

const label1 = new Text({
  content: "Grid with Text Only",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: textGrid.topCenter,
  x: 0,
  y: -30,
});

// Test 2: Grid with mixed elements (Circles and Text)
const mixedGrid = new GridLayout({
  columns: 4,
  rows: 3,
  width: 500,
  height: 350,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Add alternating circles and text
for (let i = 0; i < 12; i++) {
  if (i % 2 === 0) {
    const circle = new Circle({
      radius: 25,
      style: {
        fill: "#3498db",
        stroke: "#2980b9",
        strokeWidth: "2",
      },
    });
    mixedGrid.addElement(circle);
  } else {
    const text = new Text({
      content: String(Math.floor(i / 2) + 1),
      fontSize: 24,
      style: { fill: "#2ecc71", fontWeight: "bold" },
    });
    mixedGrid.addElement(text);
  }
}

mixedGrid.position({
  relativeFrom: mixedGrid.center,
  relativeTo: artboard.center,
  x: 150,
  y: -220,
});

const label2 = new Text({
  content: "Grid with Mixed Elements (Circles & Text)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: mixedGrid.topCenter,
  x: 0,
  y: -30,
});

// Test 3: Comparison - Grid with Circles (known to work)
const circleGrid = new GridLayout({
  columns: 4,
  rows: 2,
  width: 450,
  height: 220,
  gap: 12,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

for (let i = 0; i < 8; i++) {
  const circle = new Circle({
    radius: 30,
    style: {
      fill: "#f39c12",
      stroke: "#d68910",
      strokeWidth: "2",
    },
  });
  circleGrid.addElement(circle);
}

circleGrid.position({
  relativeFrom: circleGrid.center,
  relativeTo: artboard.center,
  x: -200,
  y: 250,
});

const label3 = new Text({
  content: "Control: Grid with Circles (Should Work)",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: circleGrid.topCenter,
  x: 0,
  y: -30,
});

// Test 4: Grid with Text of varying sizes
const varyingTextGrid = new GridLayout({
  columns: 2,
  rows: 2,
  width: 350,
  height: 300,
  gap: 20,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

const fontSizes = [16, 24, 32, 40];
const contents = ["Small", "Medium", "Large", "XLarge"];
for (let i = 0; i < 4; i++) {
  const text = new Text({
    content: contents[i],
    fontSize: fontSizes[i],
    style: { fill: "#9b59b6", fontWeight: "bold" },
  });
  varyingTextGrid.addElement(text);
}

varyingTextGrid.position({
  relativeFrom: varyingTextGrid.center,
  relativeTo: artboard.center,
  x: 380,
  y: 280,
});

const label4 = new Text({
  content: "Grid with Varying Text Sizes",
  fontSize: 16,
  style: { fill: "#ecf0f1" },
});

label4.position({
  relativeFrom: label4.center,
  relativeTo: varyingTextGrid.topCenter,
  x: 0,
  y: -30,
});

// Add all to artboard
artboard.addElement(textGrid);
artboard.addElement(label1);
artboard.addElement(mixedGrid);
artboard.addElement(label2);
artboard.addElement(circleGrid);
artboard.addElement(label3);
artboard.addElement(varyingTextGrid);
artboard.addElement(label4);

artboard.render();

