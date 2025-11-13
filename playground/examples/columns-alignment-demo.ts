/**
 * Columns Alignment Demonstration
 *
 * Shows all the different alignment options for ColumnsLayout:
 * - Horizontal: left, center, right
 * - Vertical: top, center, bottom
 * - Combinations of both
 */

import { Artboard, ColumnsLayout, Circle, Rectangle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: "1400px", height: "900px" },
  padding: "30px",
  backgroundColor: "#fafafa",
});

// Helper function to create a label rectangle
const createLabel = () => {
  return new Rectangle({
    width: "200px",
    height: "30px",
    style: {
      fill: "#424242",
      stroke: "#212121",
      strokeWidth: 1,
    },
  });
};

// Helper to create a shape with consistent styling
const createShape = (color) => {
  return new Circle({
    radius: "30px",
    style: {
      fill: color,
      stroke: "#000000",
      strokeWidth: 2,
    },
  });
};

// ===== Row 1: Horizontal Alignment =====
// Left alignment
const leftAlign = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "420px",
  height: "150px",
  horizontalAlign: "left",
  verticalAlign: "center",
  columnStyle: {
    fill: "#e3f2fd",
    stroke: "#90caf9",
    strokeWidth: 2,
  },
});

leftAlign.position({
  relativeTo: artboard.topLeft,
  relativeFrom: leftAlign.topLeft,
  x: "50px",
  y: "80px",
});

leftAlign.columns[0].addElement(createShape("#f44336"));
leftAlign.columns[1].addElement(createShape("#2196f3"));
leftAlign.columns[2].addElement(createShape("#4caf50"));

// Center alignment
const centerAlign = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "420px",
  height: "150px",
  horizontalAlign: "center",
  verticalAlign: "center",
  columnStyle: {
    fill: "#f3e5f5",
    stroke: "#ce93d8",
    strokeWidth: 2,
  },
});

centerAlign.position({
  relativeTo: leftAlign.topRight,
  relativeFrom: centerAlign.topLeft,
  x: "30px",
  y: 0,
});

centerAlign.columns[0].addElement(createShape("#f44336"));
centerAlign.columns[1].addElement(createShape("#2196f3"));
centerAlign.columns[2].addElement(createShape("#4caf50"));

// Right alignment
const rightAlign = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "420px",
  height: "150px",
  horizontalAlign: "right",
  verticalAlign: "center",
  columnStyle: {
    fill: "#e8f5e9",
    stroke: "#a5d6a7",
    strokeWidth: 2,
  },
});

rightAlign.position({
  relativeTo: centerAlign.topRight,
  relativeFrom: rightAlign.topLeft,
  x: "30px",
  y: 0,
});

rightAlign.columns[0].addElement(createShape("#f44336"));
rightAlign.columns[1].addElement(createShape("#2196f3"));
rightAlign.columns[2].addElement(createShape("#4caf50"));

// ===== Row 2: Vertical Alignment =====
// Top alignment
const topAlign = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "420px",
  height: "200px",
  horizontalAlign: "center",
  verticalAlign: "top",
  columnStyle: {
    fill: "#fff3e0",
    stroke: "#ffb74d",
    strokeWidth: 2,
  },
});

topAlign.position({
  relativeTo: leftAlign.bottomLeft,
  relativeFrom: topAlign.topLeft,
  x: 0,
  y: "60px",
});

topAlign.columns[0].addElement(createShape("#ff5722"));
topAlign.columns[1].addElement(createShape("#03a9f4"));
topAlign.columns[2].addElement(createShape("#8bc34a"));

// Center vertical alignment
const centerVertAlign = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "420px",
  height: "200px",
  horizontalAlign: "center",
  verticalAlign: "center",
  columnStyle: {
    fill: "#fce4ec",
    stroke: "#f48fb1",
    strokeWidth: 2,
  },
});

centerVertAlign.position({
  relativeTo: topAlign.topRight,
  relativeFrom: centerVertAlign.topLeft,
  x: "30px",
  y: 0,
});

centerVertAlign.columns[0].addElement(createShape("#ff5722"));
centerVertAlign.columns[1].addElement(createShape("#03a9f4"));
centerVertAlign.columns[2].addElement(createShape("#8bc34a"));

// Bottom alignment
const bottomAlign = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "420px",
  height: "200px",
  horizontalAlign: "center",
  verticalAlign: "bottom",
  columnStyle: {
    fill: "#e0f2f1",
    stroke: "#80cbc4",
    strokeWidth: 2,
  },
});

bottomAlign.position({
  relativeTo: centerVertAlign.topRight,
  relativeFrom: bottomAlign.topLeft,
  x: "30px",
  y: 0,
});

bottomAlign.columns[0].addElement(createShape("#ff5722"));
bottomAlign.columns[1].addElement(createShape("#03a9f4"));
bottomAlign.columns[2].addElement(createShape("#8bc34a"));

// ===== Row 3: Different Column Counts =====
// 2 columns
const twoColumns = new ColumnsLayout({
  count: 2,
  gutter: "30px",
  width: "400px",
  height: "150px",
  horizontalAlign: "center",
  verticalAlign: "center",
  columnStyle: {
    fill: "#ede7f6",
    stroke: "#b39ddb",
    strokeWidth: 2,
  },
});

twoColumns.position({
  relativeTo: topAlign.bottomLeft,
  relativeFrom: twoColumns.topLeft,
  x: 0,
  y: "60px",
});

twoColumns.columns[0].addElement(createShape("#9c27b0"));
twoColumns.columns[1].addElement(createShape("#673ab7"));

// 4 columns
const fourColumns = new ColumnsLayout({
  count: 4,
  gutter: "15px",
  width: "460px",
  height: "150px",
  horizontalAlign: "center",
  verticalAlign: "center",
  columnStyle: {
    fill: "#fff9c4",
    stroke: "#fff176",
    strokeWidth: 2,
  },
});

fourColumns.position({
  relativeTo: twoColumns.topRight,
  relativeFrom: fourColumns.topLeft,
  x: "30px",
  y: 0,
});

fourColumns.columns[0].addElement(createShape("#ff6f00"));
fourColumns.columns[1].addElement(createShape("#ff9100"));
fourColumns.columns[2].addElement(createShape("#ffab00"));
fourColumns.columns[3].addElement(createShape("#ffc400"));

// 5 columns (narrow)
const fiveColumns = new ColumnsLayout({
  count: 5,
  gutter: "10px",
  width: "440px",
  height: "150px",
  horizontalAlign: "center",
  verticalAlign: "center",
  columnStyle: {
    fill: "#e1f5fe",
    stroke: "#81d4fa",
    strokeWidth: 2,
  },
});

fiveColumns.position({
  relativeTo: fourColumns.topRight,
  relativeFrom: fiveColumns.topLeft,
  x: "30px",
  y: 0,
});

fiveColumns.columns[0].addElement(createShape("#006064"));
fiveColumns.columns[1].addElement(createShape("#00838f"));
fiveColumns.columns[2].addElement(createShape("#0097a7"));
fiveColumns.columns[3].addElement(createShape("#00acc1"));
fiveColumns.columns[4].addElement(createShape("#00bcd4"));

// Add text labels (as rectangles for demonstration)
const label1 = createLabel();
label1.position({
  relativeTo: leftAlign.topCenter,
  relativeFrom: label1.bottomCenter,
  x: 0,
  y: "-15px",
});

const label2 = createLabel();
label2.position({
  relativeTo: centerAlign.topCenter,
  relativeFrom: label2.bottomCenter,
  x: 0,
  y: "-15px",
});

const label3 = createLabel();
label3.position({
  relativeTo: rightAlign.topCenter,
  relativeFrom: label3.bottomCenter,
  x: 0,
  y: "-15px",
});

const label4 = createLabel();
label4.position({
  relativeTo: topAlign.topCenter,
  relativeFrom: label4.bottomCenter,
  x: 0,
  y: "-15px",
});

const label5 = createLabel();
label5.position({
  relativeTo: centerVertAlign.topCenter,
  relativeFrom: label5.bottomCenter,
  x: 0,
  y: "-15px",
});

const label6 = createLabel();
label6.position({
  relativeTo: bottomAlign.topCenter,
  relativeFrom: label6.bottomCenter,
  x: 0,
  y: "-15px",
});

const label7 = createLabel();
label7.position({
  relativeTo: twoColumns.topCenter,
  relativeFrom: label7.bottomCenter,
  x: 0,
  y: "-15px",
});

const label8 = createLabel();
label8.position({
  relativeTo: fourColumns.topCenter,
  relativeFrom: label8.bottomCenter,
  x: 0,
  y: "-15px",
});

const label9 = createLabel();
label9.position({
  relativeTo: fiveColumns.topCenter,
  relativeFrom: label9.bottomCenter,
  x: 0,
  y: "-15px",
});

// Add everything to artboard
artboard.addElement(leftAlign);
artboard.addElement(centerAlign);
artboard.addElement(rightAlign);
artboard.addElement(topAlign);
artboard.addElement(centerVertAlign);
artboard.addElement(bottomAlign);
artboard.addElement(twoColumns);
artboard.addElement(fourColumns);
artboard.addElement(fiveColumns);

artboard.addElement(label1);
artboard.addElement(label2);
artboard.addElement(label3);
artboard.addElement(label4);
artboard.addElement(label5);
artboard.addElement(label6);
artboard.addElement(label7);
artboard.addElement(label8);
artboard.addElement(label9);

return artboard.render();

