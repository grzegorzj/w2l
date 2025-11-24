// Padding Box Model Test - Column Layout
// Tests padding behavior across GridLayout, VStack, and HStack
// Each column has a header explaining the test and the actual layout being tested

import {
  Artboard,
  Rectangle,
  Circle,
  Text,
  GridLayout,
  VStack,
  HStack,
} from "w2l";

const artboard = new Artboard({
  size: { width: 1400, height: 800 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// ============================================================================
// Main 3-column layout
// ============================================================================

const mainColumns = new HStack({
  spacing: 40,
  verticalAlign: "top",
  autoWidth: true,
  autoHeight: true,
});

// ============================================================================
// COLUMN 1: GridLayout Test
// ============================================================================

const column1 = new VStack({
  spacing: 20,
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
});

// Header for column 1
const header1 = new VStack({
  spacing: 8,
  padding: "15px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
  style: {
    fill: "#e7f5ff",
    stroke: "#1971c2",
    strokeWidth: 2,
  },
});

const title1 = new Text({
  content: "GridLayout Test",
  fontSize: 18,
  style: { fill: "#1971c2", fontWeight: "bold" },
});

const desc1 = new Text({
  content: "width: 300, height: 250\npadding: 20px\nExpected: 340×290",
  fontSize: 12,
  lineHeight: 1.5,
  textAlign: "center",
  style: { fill: "#1864ab" },
});

header1.addElement(title1);
header1.addElement(desc1);

// Target GridLayout being tested
const testGrid = new GridLayout({
  width: 300, // Content area
  height: 250,
  padding: "20px", // Should add 40px to each dimension → 340×290
  columns: 2,
  rows: 2,
  columnGap: "15px",
  rowGap: "15px",
  style: {
    fill: "#d0ebff",
    stroke: "#339af0",
    strokeWidth: 2,
  },
});

// Add cells to grid
const gridColors = ["#4dabf7", "#339af0", "#228be6", "#1c7ed6"];
gridColors.forEach((color) => {
  const cell = new Rectangle({
    width: 60,
    height: 60,
    style: { fill: color, stroke: "#1971c2", strokeWidth: 1 },
  });
  testGrid.addElement(cell);
});

// Result display
const result1 = new Text({
  content: `Actual: ${testGrid.width.toFixed(0)}×${testGrid.height.toFixed(0)}`,
  fontSize: 14,
  style: {
    fill:
      testGrid.width === 340 && testGrid.height === 290 ? "#2f9e44" : "#e03131",
    fontWeight: "bold",
  },
});

column1.addElement(header1);
column1.addElement(testGrid);
column1.addElement(result1);

// ============================================================================
// COLUMN 2: VStack Test
// ============================================================================

const column2 = new VStack({
  spacing: 20,
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
});

// Header for column 2
const header2 = new VStack({
  spacing: 8,
  padding: "15px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
  style: {
    fill: "#d3f9d8",
    stroke: "#2f9e44",
    strokeWidth: 2,
  },
});

const title2 = new Text({
  content: "VStack Test",
  fontSize: 18,
  style: { fill: "#2f9e44", fontWeight: "bold" },
});

const desc2 = new Text({
  content: "autoWidth, autoHeight\npadding: 20px\nSizes to content + padding",
  fontSize: 12,
  lineHeight: 1.5,
  textAlign: "center",
  style: { fill: "#2b8a3e" },
});

header2.addElement(title2);
header2.addElement(desc2);

// Target VStack being tested
const testVStack = new VStack({
  spacing: 15,
  padding: "20px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "left",
  style: {
    fill: "#b2f2bb",
    stroke: "#51cf66",
    strokeWidth: 2,
  },
});

// Add elements to VStack
const vstackItems = [
  { text: "Item 1", color: "#37b24d" },
  { text: "Item 2", color: "#2f9e44" },
  { text: "Item 3", color: "#2b8a3e" },
];

vstackItems.forEach(({ text, color }) => {
  const item = new HStack({
    spacing: 10,
    autoWidth: true,
    autoHeight: true,
    verticalAlign: "center",
  });

  const icon = new Circle({
    radius: 8,
    style: { fill: color },
  });

  const label = new Text({
    content: text,
    fontSize: 14,
    style: { fill: color },
  });

  item.addElement(icon);
  item.addElement(label);
  testVStack.addElement(item);
});

// Result display
const result2 = new Text({
  content: `Actual: ${testVStack.width.toFixed(0)}×${testVStack.height.toFixed(0)}`,
  fontSize: 14,
  style: {
    fill: "#2f9e44",
    fontWeight: "bold",
  },
});

column2.addElement(header2);
column2.addElement(testVStack);
column2.addElement(result2);

// ============================================================================
// COLUMN 3: HStack Test
// ============================================================================

const column3 = new VStack({
  spacing: 20,
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
});

// Header for column 3
const header3 = new VStack({
  spacing: 8,
  padding: "15px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "center",
  style: {
    fill: "#fff3bf",
    stroke: "#f59f00",
    strokeWidth: 2,
  },
});

const title3 = new Text({
  content: "HStack Test",
  fontSize: 18,
  style: { fill: "#f59f00", fontWeight: "bold" },
});

const desc3 = new Text({
  content: "autoWidth, autoHeight\npadding: 20px\nSizes to content + padding",
  fontSize: 12,
  lineHeight: 1.5,
  textAlign: "center",
  style: { fill: "#e67700" },
});

header3.addElement(title3);
header3.addElement(desc3);

// Target HStack being tested
const testHStack = new HStack({
  spacing: 15,
  padding: "20px",
  autoWidth: true,
  autoHeight: true,
  verticalAlign: "center",
  style: {
    fill: "#ffe8cc",
    stroke: "#fd7e14",
    strokeWidth: 2,
  },
});

// Add elements to HStack
const hstackShapes = [
  { type: "circle", size: 50, color: "#ff922b" },
  { type: "square", size: 50, color: "#fd7e14" },
  { type: "circle", size: 50, color: "#f59f00" },
];

hstackShapes.forEach(({ type, size, color }) => {
  if (type === "circle") {
    const circle = new Circle({
      radius: size / 2,
      style: { fill: color, stroke: "#e67700", strokeWidth: 2 },
    });
    testHStack.addElement(circle);
  } else {
    const square = new Rectangle({
      width: size,
      height: size,
      style: { fill: color, stroke: "#e67700", strokeWidth: 2 },
    });
    testHStack.addElement(square);
  }
});

// Result display
const result3 = new Text({
  content: `Actual: ${testHStack.width.toFixed(0)}×${testHStack.height.toFixed(0)}`,
  fontSize: 14,
  style: {
    fill: "#f59f00",
    fontWeight: "bold",
  },
});

column3.addElement(header3);
column3.addElement(testHStack);
column3.addElement(result3);

// ============================================================================
// Add columns to main layout
// ============================================================================

mainColumns.addElement(column1);
mainColumns.addElement(column2);
mainColumns.addElement(column3);

mainColumns.position({
  relativeFrom: mainColumns.center,
  relativeTo: artboard.center,
  x: 0,
  y: 20,
});

// ============================================================================
// Main title and description
// ============================================================================

const mainTitle = new Text({
  content: "Padding Box Model Test",
  fontSize: 28,
  style: { fill: "#212529", fontWeight: "bold" },
});

mainTitle.position({
  relativeFrom: mainTitle.center,
  relativeTo: artboard.center,
  x: 0,
  y: -320,
});

const mainDesc = new Text({
  content: "Padding adds to dimensions (CSS box-sizing: content-box behavior)",
  fontSize: 14,
  style: { fill: "#6c757d" },
});

mainDesc.position({
  relativeFrom: mainDesc.center,
  relativeTo: artboard.center,
  x: 0,
  y: -290,
});

// ============================================================================
// Legend at bottom
// ============================================================================

const legend = new VStack({
  spacing: 10,
  padding: "20px",
  autoWidth: true,
  autoHeight: true,
  horizontalAlign: "left",
  style: {
    fill: "#ffffff",
    stroke: "#adb5bd",
    strokeWidth: 1,
  },
});

const legendTitle = new Text({
  content: "Box Model Rules:",
  fontSize: 14,
  style: { fill: "#212529", fontWeight: "bold" },
});

const rule1 = new Text({
  content: "✓ width/height = content area size",
  fontSize: 12,
  style: { fill: "#495057" },
});

const rule2 = new Text({
  content: "✓ padding is added to total size",
  fontSize: 12,
  style: { fill: "#495057" },
});

const rule3 = new Text({
  content: "✓ children positioned within padded area",
  fontSize: 12,
  style: { fill: "#495057" },
});

legend.addElement(legendTitle);
legend.addElement(rule1);
legend.addElement(rule2);
legend.addElement(rule3);

legend.position({
  relativeFrom: legend.center,
  relativeTo: artboard.center,
  x: 0,
  y: 330,
});

// ============================================================================
// Add all to artboard
// ============================================================================

artboard.addElement(mainColumns);
artboard.addElement(mainTitle);
artboard.addElement(mainDesc);
artboard.addElement(legend);

artboard.render();
