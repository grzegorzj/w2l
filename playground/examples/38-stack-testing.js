// Example 38: Stack Layout Testing
// Systematic testing of VStack, HStack, and ZStack layouts
import { Artboard, ColumnsLayout, Text, Rectangle, VStack, HStack, ZStack, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 900 },
  backgroundColor: "#2c3e50",
});

// Create columns for testing different layouts
const columns = new ColumnsLayout({
  count: 3,
  width: 1300,
  height: 800,
  gutter: 50,
  fitContent: true,
  style: {
    fill: "#34495e",
    stroke: "#ecf0f1",
    strokeWidth: "2",
  },
});

// Column 1: VStack Examples
const col1 = columns.columns[0];

// Test 1: VStack with header and content
const vstack1 = new VStack({
  spacing: 20,
  horizontalAlign: "center",
  fillWidth: true,
  style: {
    fill: "none",
    stroke: "#95a5a6",
    strokeWidth: "1",
    strokeDasharray: "4,4",
  },
});

// Header as a ZStack (rectangle + centered text)
const header1 = new ZStack({
  width: 350,
  height: 60,
  horizontalAlign: "center",
  verticalAlign: "center",
});

const headerRect = new Rectangle({
  width: 350,
  height: 60,
  cornerStyle: "rounded",
  cornerRadius: 8,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: "2",
  },
});

const headerText = new Text({
  content: "VStack",
  fontSize: 24,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

header1.addElement(headerRect);
header1.addElement(headerText);

// Add header to vstack
vstack1.addElement(header1);

// Add some circles below
const colors = ["#3498db", "#2ecc71", "#f39c12"];
for (let i = 0; i < 3; i++) {
  const circle = new Circle({
    radius: 30,
    style: {
      fill: colors[i],
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  vstack1.addElement(circle);
}

// Add vstack to column
col1.addElement(vstack1);

// Column 2: HStack Examples
const col2 = columns.columns[1];

// Test 2: HStack with header and horizontal items
const vstack2 = new VStack({
  spacing: 20,
  horizontalAlign: "center",
  fillWidth: true,
  style: {
    fill: "none",
    stroke: "#95a5a6",
    strokeWidth: "1",
    strokeDasharray: "4,4",
  },
});

// Header as a ZStack (rectangle + centered text)
const header2 = new ZStack({
  width: 350,
  height: 60,
  horizontalAlign: "center",
  verticalAlign: "center",
});

const headerRect2 = new Rectangle({
  width: 350,
  height: 60,
  cornerStyle: "rounded",
  cornerRadius: 8,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: "2",
  },
});

const headerText2 = new Text({
  content: "HStack",
  fontSize: 24,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});

header2.addElement(headerRect2);
header2.addElement(headerText2);

// Add header to vstack
vstack2.addElement(header2);

// Create an HStack with circles arranged horizontally
const hstack1 = new HStack({
  spacing: 15,
  verticalAlign: "center",
  style: {
    fill: "none",
    stroke: "#95a5a6",
    strokeWidth: "1",
    strokeDasharray: "4,4",
  },
});

// Add circles side by side
const hstackColors = ["#e74c3c", "#2ecc71", "#f39c12"];
for (let i = 0; i < 3; i++) {
  const circle = new Circle({
    radius: 30,
    style: {
      fill: hstackColors[i],
      stroke: "#2c3e50",
      strokeWidth: "2",
    },
  });
  hstack1.addElement(circle);
}

vstack2.addElement(hstack1);
col2.addElement(vstack2);

// Column 3: ZStack Examples
const col3 = columns.columns[2];
const zStackTitle = new Text({
  content: "ZStack",
  fontSize: 24,
  style: { fill: "#ecf0f1", fontWeight: "bold" },
});
col3.addElement(zStackTitle);

// Add columns to artboard
artboard.addElement(columns);

// Position columns
columns.position({
  relativeFrom: columns.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

artboard.render();

