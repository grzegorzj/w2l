/**
 * Text Positioning Debug
 *
 * Testing that Text elements position correctly and return correct dimensions
 * for Container auto-sizing and position accessors like centerLeft.
 */

import {
  Artboard,
  Container,
  Text,
  Circle,
  Rect,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f5f5f5",
  boxModel: { padding: 40 },
});

// Reference point in the middle of the artboard
const referenceX = 400;
const referenceY = 300;

// Draw a reference cross
const refLineV = new Rect({
  width: 2,
  height: 600,
  style: { fill: "#ff0000" },
});

refLineV.position({
  relativeFrom: refLineV.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: 0,
});

artboard.addElement(refLineV);

const refLineH = new Rect({
  width: 800,
  height: 2,
  style: { fill: "#ff0000" },
});

refLineH.position({
  relativeFrom: refLineH.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: 0,
});

artboard.addElement(refLineH);

// Add a circle at the reference point
const refCircle = new Circle({
  radius: 5,
  style: { fill: "#ff0000" },
});

refCircle.position({
  relativeFrom: refCircle.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: 0,
});

artboard.addElement(refCircle);

// ============================================================
// Test 1: Container with Text positioned using centerLeft
// ============================================================

const badge1 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 5,
  boxModel: { padding: 10 },
  style: {
    fill: "#e3f2fd",
    stroke: "#1976d2",
    strokeWidth: "2",
  },
});

const badgeText1 = new Text({
  content: "Test Badge",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#1565c0" },
});

badge1.addElement(badgeText1);

// Position badge 1 using centerLeft - should be to the RIGHT of reference point
badge1.position({
  relativeFrom: badge1.centerLeft,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 20, // 20px to the right
  y: -80, // Up
});

artboard.addElement(badge1);

// Add label
const label1 = new Text({
  content: "centerLeft (should be to the right)",
  fontSize: 11,
  style: { fill: "#424242" },
});

label1.position({
  relativeFrom: label1.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: -120,
});

artboard.addElement(label1);

// ============================================================
// Test 2: Container positioned using center
// ============================================================

const badge2 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 5,
  boxModel: { padding: 10 },
  style: {
    fill: "#f3e5f5",
    stroke: "#7b1fa2",
    strokeWidth: "2",
  },
});

const badgeText2 = new Text({
  content: "Centered Badge",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#4a148c" },
});

badge2.addElement(badgeText2);

// Position badge 2 using center - should be centered on reference point
badge2.position({
  relativeFrom: badge2.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: 0,
});

artboard.addElement(badge2);

// Add label
const label2 = new Text({
  content: "center (should be centered)",
  fontSize: 11,
  style: { fill: "#424242" },
});

label2.position({
  relativeFrom: label2.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: 40,
});

artboard.addElement(label2);

// ============================================================
// Test 3: Container positioned using centerRight
// ============================================================

const badge3 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 5,
  boxModel: { padding: 10 },
  style: {
    fill: "#fff3e0",
    stroke: "#e65100",
    strokeWidth: "2",
  },
});

const badgeText3 = new Text({
  content: "Right Badge",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#bf360c" },
});

badge3.addElement(badgeText3);

// Position badge 3 using centerRight - should be to the LEFT of reference point
badge3.position({
  relativeFrom: badge3.centerRight,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: -20, // 20px to the left
  y: 80, // Down
});

artboard.addElement(badge3);

// Add label
const label3 = new Text({
  content: "centerRight (should be to the left)",
  fontSize: 11,
  style: { fill: "#424242" },
});

label3.position({
  relativeFrom: label3.center,
  relativeTo: { x: referenceX, y: referenceY },
  boxReference: "artboard",
  x: 0,
  y: 120,
});

artboard.addElement(label3);

// ============================================================
// Debug info - show the dimensions of badge1
// ============================================================

const debugText = new Text({
  content: `Badge1 dimensions: width=${badge1.width.toFixed(1)}, height=${badge1.height.toFixed(1)}`,
  fontSize: 10,
  style: { fill: "#666666" },
});

debugText.position({
  relativeFrom: debugText.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 10,
  y: 10,
});

artboard.addElement(debugText);

// Debug: Show where centerLeft actually is
const centerLeftPos = badge1.centerLeft;
const centerLeftMarker = new Circle({
  radius: 4,
  style: { fill: "#00ff00", stroke: "#008800", strokeWidth: "2" },
});

centerLeftMarker.position({
  relativeFrom: centerLeftMarker.center,
  relativeTo: centerLeftPos,
  boxReference: "artboard",
  x: 0,
  y: 0,
});

artboard.addElement(centerLeftMarker);

const centerLeftLabel = new Text({
  content: "actual centerLeft",
  fontSize: 9,
  style: { fill: "#008800" },
});

centerLeftLabel.position({
  relativeFrom: centerLeftLabel.bottomLeft,
  relativeTo: centerLeftPos,
  boxReference: "artboard",
  x: 8,
  y: -5,
});

artboard.addElement(centerLeftLabel);

return artboard.render();

