/**
 * Intelligent Alignment Demonstration
 *
 * Shows how elements intelligently choose their alignment points.
 * 
 * When aligned "left", elements use their left edge center.
 * When aligned "right", elements use their right edge center.
 * When aligned "top", elements use their top edge center.
 * When aligned "bottom", elements use their bottom edge center.
 * 
 * This creates natural, intuitive alignment behavior.
 */

import { Artboard, ColumnsLayout, Rectangle, Circle, Square } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: "1200px", height: "800px" },
  padding: "30px",
  backgroundColor: "#fafafa",
});

// ===== Left Alignment Demo =====
const leftAlignLayout = new ColumnsLayout({
  count: 1,
  width: "300px",
  height: "200px",
  horizontalAlign: "left",
  verticalAlign: "center",
  columnStyle: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 2,
  },
});

leftAlignLayout.position({
  relativeTo: artboard.topLeft,
  relativeFrom: leftAlignLayout.topLeft,
  x: "50px",
  y: "100px",
});

// Add different sized elements - they should all align their LEFT edges
const leftRect1 = new Rectangle({
  width: "100px",
  height: "40px",
  style: { fill: "#f44336", stroke: "#c62828", strokeWidth: 2 },
});

const leftRect2 = new Rectangle({
  width: "150px",
  height: "40px",
  style: { fill: "#e91e63", stroke: "#880e4f", strokeWidth: 2 },
});

const leftRect3 = new Rectangle({
  width: "80px",
  height: "40px",
  style: { fill: "#9c27b0", stroke: "#4a148c", strokeWidth: 2 },
});

// Position them vertically
leftRect1.position({
  relativeTo: leftAlignLayout.columns[0].topLeft,
  relativeFrom: leftRect1.topLeft,
  x: "10px",
  y: "20px",
});

leftRect2.position({
  relativeTo: leftRect1.bottomLeft,
  relativeFrom: leftRect2.topLeft,
  x: 0,
  y: "15px",
});

leftRect3.position({
  relativeTo: leftRect2.bottomLeft,
  relativeFrom: leftRect3.topLeft,
  x: 0,
  y: "15px",
});

leftAlignLayout.columns[0].addElement(leftRect1);
leftAlignLayout.columns[0].addElement(leftRect2);
leftAlignLayout.columns[0].addElement(leftRect3);

// ===== Right Alignment Demo =====
const rightAlignLayout = new ColumnsLayout({
  count: 1,
  width: "300px",
  height: "200px",
  horizontalAlign: "right",
  verticalAlign: "center",
  columnStyle: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 2,
  },
});

rightAlignLayout.position({
  relativeTo: leftAlignLayout.topRight,
  relativeFrom: rightAlignLayout.topLeft,
  x: "50px",
  y: 0,
});

// Add different sized elements - they should all align their RIGHT edges
const rightRect1 = new Rectangle({
  width: "120px",
  height: "40px",
  style: { fill: "#2196f3", stroke: "#0d47a1", strokeWidth: 2 },
});

const rightRect2 = new Rectangle({
  width: "90px",
  height: "40px",
  style: { fill: "#03a9f4", stroke: "#01579b", strokeWidth: 2 },
});

const rightRect3 = new Rectangle({
  width: "160px",
  height: "40px",
  style: { fill: "#00bcd4", stroke: "#006064", strokeWidth: 2 },
});

rightRect1.position({
  relativeTo: rightAlignLayout.columns[0].topRight,
  relativeFrom: rightRect1.topRight,
  x: "-10px",
  y: "20px",
});

rightRect2.position({
  relativeTo: rightRect1.bottomRight,
  relativeFrom: rightRect2.topRight,
  x: 0,
  y: "15px",
});

rightRect3.position({
  relativeTo: rightRect2.bottomRight,
  relativeFrom: rightRect3.topRight,
  x: 0,
  y: "15px",
});

rightAlignLayout.columns[0].addElement(rightRect1);
rightAlignLayout.columns[0].addElement(rightRect2);
rightAlignLayout.columns[0].addElement(rightRect3);

// ===== Center Alignment Demo =====
const centerAlignLayout = new ColumnsLayout({
  count: 1,
  width: "300px",
  height: "200px",
  horizontalAlign: "center",
  verticalAlign: "center",
  columnStyle: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

centerAlignLayout.position({
  relativeTo: rightAlignLayout.topRight,
  relativeFrom: centerAlignLayout.topLeft,
  x: "50px",
  y: 0,
});

// Add different sized shapes - they should all align their CENTERS
const centerCircle = new Circle({
  radius: "30px",
  style: { fill: "#4caf50", stroke: "#1b5e20", strokeWidth: 2 },
});

const centerSquare = new Square({
  size: "50px",
  style: { fill: "#8bc34a", stroke: "#33691e", strokeWidth: 2 },
});

const centerRect = new Rectangle({
  width: "80px",
  height: "30px",
  style: { fill: "#cddc39", stroke: "#827717", strokeWidth: 2 },
});

centerCircle.position({
  relativeTo: centerAlignLayout.columns[0].topCenter,
  relativeFrom: centerCircle.center,
  x: 0,
  y: "40px",
});

centerSquare.position({
  relativeTo: centerCircle.bottomCenter,
  relativeFrom: centerSquare.topCenter,
  x: 0,
  y: "15px",
});

centerRect.position({
  relativeTo: centerSquare.bottomCenter,
  relativeFrom: centerRect.topCenter,
  x: 0,
  y: "15px",
});

centerAlignLayout.columns[0].addElement(centerCircle);
centerAlignLayout.columns[0].addElement(centerSquare);
centerAlignLayout.columns[0].addElement(centerRect);

// ===== Top Alignment Demo =====
const topAlignLayout = new ColumnsLayout({
  count: 3,
  gutter: "15px",
  width: "450px",
  height: "150px",
  horizontalAlign: "center",
  verticalAlign: "top",
  columnStyle: {
    fill: "#fff3e0",
    stroke: "#ff9800",
    strokeWidth: 2,
  },
});

topAlignLayout.position({
  relativeTo: leftAlignLayout.bottomLeft,
  relativeFrom: topAlignLayout.topLeft,
  x: 0,
  y: "50px",
});

// Different height elements - all should align TOP edges
const topCircle1 = new Circle({
  radius: "20px",
  style: { fill: "#ff5722", stroke: "#bf360c", strokeWidth: 2 },
});

const topCircle2 = new Circle({
  radius: "35px",
  style: { fill: "#ff9800", stroke: "#e65100", strokeWidth: 2 },
});

const topCircle3 = new Circle({
  radius: "25px",
  style: { fill: "#ffc107", stroke: "#f57f17", strokeWidth: 2 },
});

topAlignLayout.columns[0].addElement(topCircle1);
topAlignLayout.columns[1].addElement(topCircle2);
topAlignLayout.columns[2].addElement(topCircle3);

// ===== Bottom Alignment Demo =====
const bottomAlignLayout = new ColumnsLayout({
  count: 3,
  gutter: "15px",
  width: "450px",
  height: "150px",
  horizontalAlign: "center",
  verticalAlign: "bottom",
  columnStyle: {
    fill: "#fce4ec",
    stroke: "#e91e63",
    strokeWidth: 2,
  },
});

bottomAlignLayout.position({
  relativeTo: topAlignLayout.topRight,
  relativeFrom: bottomAlignLayout.topLeft,
  x: "50px",
  y: 0,
});

// Different height elements - all should align BOTTOM edges
const bottomSquare1 = new Square({
  size: "40px",
  style: { fill: "#e91e63", stroke: "#880e4f", strokeWidth: 2 },
});

const bottomSquare2 = new Square({
  size: "60px",
  style: { fill: "#f06292", stroke: "#ad1457", strokeWidth: 2 },
});

const bottomSquare3 = new Square({
  size: "50px",
  style: { fill: "#f48fb1", stroke: "#c2185b", strokeWidth: 2 },
});

bottomAlignLayout.columns[0].addElement(bottomSquare1);
bottomAlignLayout.columns[1].addElement(bottomSquare2);
bottomAlignLayout.columns[2].addElement(bottomSquare3);

// Add title markers
const titleLeft = new Rectangle({
  width: "100px",
  height: "25px",
  style: { fill: "#2196f3", stroke: "#0d47a1", strokeWidth: 1 },
});

titleLeft.position({
  relativeTo: leftAlignLayout.topCenter,
  relativeFrom: titleLeft.bottomCenter,
  x: 0,
  y: "-10px",
});

const titleRight = new Rectangle({
  width: "100px",
  height: "25px",
  style: { fill: "#9c27b0", stroke: "#4a148c", strokeWidth: 1 },
});

titleRight.position({
  relativeTo: rightAlignLayout.topCenter,
  relativeFrom: titleRight.bottomCenter,
  x: 0,
  y: "-10px",
});

const titleCenter = new Rectangle({
  width: "100px",
  height: "25px",
  style: { fill: "#4caf50", stroke: "#1b5e20", strokeWidth: 1 },
});

titleCenter.position({
  relativeTo: centerAlignLayout.topCenter,
  relativeFrom: titleCenter.bottomCenter,
  x: 0,
  y: "-10px",
});

const titleTop = new Rectangle({
  width: "100px",
  height: "25px",
  style: { fill: "#ff9800", stroke: "#e65100", strokeWidth: 1 },
});

titleTop.position({
  relativeTo: topAlignLayout.topCenter,
  relativeFrom: titleTop.bottomCenter,
  x: 0,
  y: "-10px",
});

const titleBottom = new Rectangle({
  width: "100px",
  height: "25px",
  style: { fill: "#e91e63", stroke: "#880e4f", strokeWidth: 1 },
});

titleBottom.position({
  relativeTo: bottomAlignLayout.topCenter,
  relativeFrom: titleBottom.bottomCenter,
  x: 0,
  y: "-10px",
});

// Add all to artboard
artboard.addElement(leftAlignLayout);
artboard.addElement(rightAlignLayout);
artboard.addElement(centerAlignLayout);
artboard.addElement(topAlignLayout);
artboard.addElement(bottomAlignLayout);
artboard.addElement(titleLeft);
artboard.addElement(titleRight);
artboard.addElement(titleCenter);
artboard.addElement(titleTop);
artboard.addElement(titleBottom);

return artboard.render();

