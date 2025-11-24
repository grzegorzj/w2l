// Example 46: Positioning - Comprehensive Testing
// Tests all positioning scenarios: relative positioning, offsets, anchor points
import { Artboard, Circle, Rectangle, Text } from "w2l";

const artboard = new Artboard({
  size: { width: 1600, height: 1200 },
  backgroundColor: "#ecf0f1",
  padding: "40px",
});

// Reference element for all tests
const referenceRect = new Rectangle({
  width: 100,
  height: 100,
  style: {
    fill: "#34495e",
    stroke: "#2c3e50",
    strokeWidth: "3px",
  },
});
referenceRect.position({
  relativeFrom: referenceRect.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

const refLabel = new Text({
  content: "Reference\nElement",
  fontSize: 12,
  fontWeight: "bold",
  style: { fill: "#ffffff" },
  align: "center",
});
refLabel.position({
  relativeFrom: refLabel.center,
  relativeTo: referenceRect.center,
  x: 0,
  y: 0,
});

// Test 1: Position relative to corners
const topLeftCircle = new Circle({
  radius: 15,
  style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: "2px" },
});
topLeftCircle.position({
  relativeFrom: topLeftCircle.center,
  relativeTo: referenceRect.topLeft,
  x: 0,
  y: 0,
});

const topRightCircle = new Circle({
  radius: 15,
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: "2px" },
});
topRightCircle.position({
  relativeFrom: topRightCircle.center,
  relativeTo: referenceRect.topRight,
  x: 0,
  y: 0,
});

const bottomLeftCircle = new Circle({
  radius: 15,
  style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: "2px" },
});
bottomLeftCircle.position({
  relativeFrom: bottomLeftCircle.center,
  relativeTo: referenceRect.bottomLeft,
  x: 0,
  y: 0,
});

const bottomRightCircle = new Circle({
  radius: 15,
  style: { fill: "#f39c12", stroke: "#d68910", strokeWidth: "2px" },
});
bottomRightCircle.position({
  relativeFrom: bottomRightCircle.center,
  relativeTo: referenceRect.bottomRight,
  x: 0,
  y: 0,
});

// Test 2: Position relative to centers
const topCenterSquare = new Rectangle({
  width: 20,
  height: 20,
  style: { fill: "#9b59b6", stroke: "#8e44ad", strokeWidth: "2px" },
});
topCenterSquare.position({
  relativeFrom: topCenterSquare.center,
  relativeTo: referenceRect.topCenter,
  x: 0,
  y: -40,
});

const leftCenterSquare = new Rectangle({
  width: 20,
  height: 20,
  style: { fill: "#1abc9c", stroke: "#16a085", strokeWidth: "2px" },
});
leftCenterSquare.position({
  relativeFrom: leftCenterSquare.center,
  relativeTo: referenceRect.leftCenter,
  x: -40,
  y: 0,
});

const rightCenterSquare = new Rectangle({
  width: 20,
  height: 20,
  style: { fill: "#e67e22", stroke: "#d35400", strokeWidth: "2px" },
});
rightCenterSquare.position({
  relativeFrom: rightCenterSquare.center,
  relativeTo: referenceRect.rightCenter,
  x: 40,
  y: 0,
});

const bottomCenterSquare = new Rectangle({
  width: 20,
  height: 20,
  style: { fill: "#95a5a6", stroke: "#7f8c8d", strokeWidth: "2px" },
});
bottomCenterSquare.position({
  relativeFrom: bottomCenterSquare.center,
  relativeTo: referenceRect.bottomCenter,
  x: 0,
  y: 40,
});

// Test 3: Offset positioning (above, below, left, right)
const aboveRect = new Rectangle({
  width: 80,
  height: 30,
  cornerRadius: 5,
  style: { fill: "#e74c3c" },
});
aboveRect.position({
  relativeFrom: aboveRect.bottomCenter,
  relativeTo: referenceRect.topCenter,
  x: 0,
  y: -20,
});

const aboveLabel = new Text({
  content: "Above",
  fontSize: 10,
  style: { fill: "#ffffff" },
});
aboveLabel.position({
  relativeFrom: aboveLabel.center,
  relativeTo: aboveRect.center,
  x: 0,
  y: 0,
});

const belowRect = new Rectangle({
  width: 80,
  height: 30,
  cornerRadius: 5,
  style: { fill: "#3498db" },
});
belowRect.position({
  relativeFrom: belowRect.topCenter,
  relativeTo: referenceRect.bottomCenter,
  x: 0,
  y: 20,
});

const belowLabel = new Text({
  content: "Below",
  fontSize: 10,
  style: { fill: "#ffffff" },
});
belowLabel.position({
  relativeFrom: belowLabel.center,
  relativeTo: belowRect.center,
  x: 0,
  y: 0,
});

const leftRect = new Rectangle({
  width: 60,
  height: 40,
  cornerRadius: 5,
  style: { fill: "#2ecc71" },
});
leftRect.position({
  relativeFrom: leftRect.rightCenter,
  relativeTo: referenceRect.leftCenter,
  x: -20,
  y: 0,
});

const leftLabel = new Text({
  content: "Left",
  fontSize: 10,
  style: { fill: "#ffffff" },
});
leftLabel.position({
  relativeFrom: leftLabel.center,
  relativeTo: leftRect.center,
  x: 0,
  y: 0,
});

const rightRect = new Rectangle({
  width: 60,
  height: 40,
  cornerRadius: 5,
  style: { fill: "#f39c12" },
});
rightRect.position({
  relativeFrom: rightRect.leftCenter,
  relativeTo: referenceRect.rightCenter,
  x: 20,
  y: 0,
});

const rightLabel = new Text({
  content: "Right",
  fontSize: 10,
  style: { fill: "#ffffff" },
});
rightLabel.position({
  relativeFrom: rightLabel.center,
  relativeTo: rightRect.center,
  x: 0,
  y: 0,
});

// Test 4: Chain positioning (element relative to another element)
const chain1 = new Circle({
  radius: 20,
  style: { fill: "#9b59b6" },
});
chain1.position({
  relativeFrom: chain1.center,
  relativeTo: topCenterSquare.topCenter,
  x: 0,
  y: -60,
});

const chain2 = new Circle({
  radius: 18,
  style: { fill: "#8e44ad" },
});
chain2.position({
  relativeFrom: chain2.center,
  relativeTo: chain1.topCenter,
  x: 0,
  y: -50,
});

const chain3 = new Circle({
  radius: 16,
  style: { fill: "#7d3c98" },
});
chain3.position({
  relativeFrom: chain3.center,
  relativeTo: chain2.topCenter,
  x: 0,
  y: -45,
});

const chainLabel = new Text({
  content: "Chained\nPositioning",
  fontSize: 10,
  style: { fill: "#9b59b6" },
  align: "center",
});
chainLabel.position({
  relativeFrom: chainLabel.bottomCenter,
  relativeTo: chain3.topCenter,
  x: 0,
  y: -10,
});

// Test 5: Different relativeFrom points
const fromTopLeft = new Rectangle({
  width: 40,
  height: 40,
  style: { fill: "#e74c3c" },
});
fromTopLeft.position({
  relativeFrom: fromTopLeft.topLeft,
  relativeTo: bottomLeftCircle.center,
  x: -100,
  y: 80,
});

const fromTopLeftLabel = new Text({
  content: "From: topLeft",
  fontSize: 9,
  style: { fill: "#e74c3c" },
});
fromTopLeftLabel.position({
  relativeFrom: fromTopLeftLabel.topLeft,
  relativeTo: fromTopLeft.bottomLeft,
  x: 0,
  y: 5,
});

const fromCenter = new Rectangle({
  width: 40,
  height: 40,
  style: { fill: "#3498db" },
});
fromCenter.position({
  relativeFrom: fromCenter.center,
  relativeTo: bottomLeftCircle.center,
  x: 0,
  y: 80,
});

const fromCenterLabel = new Text({
  content: "From: center",
  fontSize: 9,
  style: { fill: "#3498db" },
});
fromCenterLabel.position({
  relativeFrom: fromCenterLabel.topCenter,
  relativeTo: fromCenter.bottomCenter,
  x: 0,
  y: 5,
});

const fromBottomRight = new Rectangle({
  width: 40,
  height: 40,
  style: { fill: "#2ecc71" },
});
fromBottomRight.position({
  relativeFrom: fromBottomRight.bottomRight,
  relativeTo: bottomLeftCircle.center,
  x: 100,
  y: 80,
});

const fromBottomRightLabel = new Text({
  content: "From: bottomRight",
  fontSize: 9,
  style: { fill: "#2ecc71" },
});
fromBottomRightLabel.position({
  relativeFrom: fromBottomRightLabel.topRight,
  relativeTo: fromBottomRight.bottomRight,
  x: 0,
  y: 5,
});

// Main title
const title = new Text({
  content: "Comprehensive Positioning Test Suite",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 0,
});

const subtitle = new Text({
  content: "Testing all anchor points, offsets, and chaining",
  fontSize: 14,
  style: { fill: "#7f8c8d" },
});
subtitle.position({
  relativeFrom: subtitle.topCenter,
  relativeTo: title.bottomCenter,
  x: 0,
  y: 10,
});

// Legend
const legend = new Text({
  content: "Circles = Corners • Squares = Centers • Rectangles = Offset positioning",
  fontSize: 12,
  style: { fill: "#34495e" },
});
legend.position({
  relativeFrom: legend.bottomCenter,
  relativeTo: artboard.bottomCenter,
  x: 0,
  y: 0,
});

// Add all to artboard
artboard.addElement(referenceRect);
artboard.addElement(refLabel);
artboard.addElement(topLeftCircle);
artboard.addElement(topRightCircle);
artboard.addElement(bottomLeftCircle);
artboard.addElement(bottomRightCircle);
artboard.addElement(topCenterSquare);
artboard.addElement(leftCenterSquare);
artboard.addElement(rightCenterSquare);
artboard.addElement(bottomCenterSquare);
artboard.addElement(aboveRect);
artboard.addElement(aboveLabel);
artboard.addElement(belowRect);
artboard.addElement(belowLabel);
artboard.addElement(leftRect);
artboard.addElement(leftLabel);
artboard.addElement(rightRect);
artboard.addElement(rightLabel);
artboard.addElement(chain1);
artboard.addElement(chain2);
artboard.addElement(chain3);
artboard.addElement(chainLabel);
artboard.addElement(fromTopLeft);
artboard.addElement(fromTopLeftLabel);
artboard.addElement(fromCenter);
artboard.addElement(fromCenterLabel);
artboard.addElement(fromBottomRight);
artboard.addElement(fromBottomRightLabel);
artboard.addElement(title);
artboard.addElement(subtitle);
artboard.addElement(legend);

artboard.render();

