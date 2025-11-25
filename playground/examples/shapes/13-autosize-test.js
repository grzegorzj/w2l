/**
 * Auto-Size Test Example
 * 
 * Tests complete auto-sizing chain:
 * - Auto-sized artboard
 * - Auto-sized main container (horizontal)
 * - Auto-sized column containers (vertical)
 * - Various shapes inside
 */

import {
  NewArtboard,
  NewContainer,
  NewRect,
  NewCircle,
} from "w2l";

// Auto-sized artboard with padding
const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f8f9fa",
  boxModel: {
    padding: { top: 30, right: 30, bottom: 30, left: 30 },
  },
});

// Auto-sized main container (horizontal layout)
const mainContainer = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  verticalAlignment: "top", // Match example 83
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
  style: {
    fill: "#ffffff",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

artboard.addElement(mainContainer);

// ========================================
// COLUMN 1 - Auto-sized with rectangles
// ========================================

const column1 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
  style: {
    fill: "#e3f2fd",
    stroke: "#90caf9",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column1);

// Add nested vstack with rectangles (like example 83)
const vstack1 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
  horizontalAlignment: "left",
});

const sizes1 = [80, 60, 70];
sizes1.forEach((height) => {
  const rect = new NewRect({
    width: 150,
    height: height,
    style: {
      fill: "#2196f3",
      stroke: "#1976d2",
      strokeWidth: 2,
    },
  });
  vstack1.addElement(rect);
});

column1.addElement(vstack1);

// ========================================
// COLUMN 2 - Auto-sized with circles
// ========================================

const column2 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
  style: {
    fill: "#f3e5f5",
    stroke: "#ce93d8",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column2);

// Add nested vstack with circles (like example 83)
const vstack2 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
  horizontalAlignment: "center",
});

const radii = [35, 30, 40];
radii.forEach((radius) => {
  const circle = new NewCircle({
    radius: radius,
    style: {
      fill: "#9c27b0",
      stroke: "#7b1fa2",
      strokeWidth: 2,
    },
  });
  vstack2.addElement(circle);
});

column2.addElement(vstack2);

// ========================================
// COLUMN 3 - Auto-sized with mixed shapes
// ========================================

const column3 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: {
    padding: { top: 15, right: 15, bottom: 15, left: 15 },
    border: { top: 2, right: 2, bottom: 2, left: 2 },
  },
  style: {
    fill: "#e8f5e9",
    stroke: "#a5d6a7",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column3);

// Add nested vstack with mixed shapes (like example 83)
const vstack3 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
  horizontalAlignment: "left",
});

const rect1 = new NewRect({
  width: 140,
  height: 60,
  style: {
    fill: "#4caf50",
    stroke: "#388e3c",
    strokeWidth: 2,
  },
});

const circle1 = new NewCircle({
  radius: 35,
  style: {
    fill: "#66bb6a",
    stroke: "#2e7d32",
    strokeWidth: 2,
  },
});

const rect2 = new NewRect({
  width: 120,
  height: 50,
  style: {
    fill: "#4caf50",
    stroke: "#388e3c",
    strokeWidth: 2,
  },
});

vstack3.addElement(rect1);
vstack3.addElement(circle1);
vstack3.addElement(rect2);

column3.addElement(vstack3);

// Render the artboard
return artboard.render();

