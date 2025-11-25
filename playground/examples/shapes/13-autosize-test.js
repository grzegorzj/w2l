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
  boxModel: { padding: 30 },
});

// Auto-sized main container (horizontal layout)
const mainContainer = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  boxModel: { padding: 15 },
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
  boxModel: { padding: 15 },
  style: {
    fill: "#e3f2fd",
    stroke: "#90caf9",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column1);

// Add fixed-size rectangles
for (let i = 0; i < 3; i++) {
  const rect = new NewRect({
    width: 150,
    height: 80,
    style: {
      fill: "#2196f3",
      stroke: "#1976d2",
      strokeWidth: 2,
    },
  });
  column1.addElement(rect);
}

// ========================================
// COLUMN 2 - Auto-sized with circles
// ========================================

const column2 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 15 },
  style: {
    fill: "#f3e5f5",
    stroke: "#ce93d8",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column2);

// Add circles
for (let i = 0; i < 4; i++) {
  const circle = new NewCircle({
    radius: 40,
    style: {
      fill: "#9c27b0",
      stroke: "#7b1fa2",
      strokeWidth: 2,
    },
  });
  column2.addElement(circle);
}

// ========================================
// COLUMN 3 - Auto-sized with mixed shapes
// ========================================

const column3 = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 15 },
  style: {
    fill: "#e8f5e9",
    stroke: "#a5d6a7",
    strokeWidth: 2,
  },
});

mainContainer.addElement(column3);

// Add rectangles of varying sizes
const sizes = [
  { width: 120, height: 60 },
  { width: 180, height: 50 },
  { width: 140, height: 70 },
  { width: 160, height: 55 },
];

sizes.forEach(size => {
  const rect = new NewRect({
    width: size.width,
    height: size.height,
    style: {
      fill: "#4caf50",
      stroke: "#388e3c",
      strokeWidth: 2,
    },
  });
  column3.addElement(rect);
});

// Render the artboard
return artboard.render();

