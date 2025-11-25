/**
 * New Components Showcase
 * 
 * Demonstrates the newly migrated components:
 * - NewImage: Raster image support
 * - NewBezierCurve: Smooth curved paths
 * - NewArrow: Directional arrows with various styles
 * 
 * Creates a visual diagram showing these components in action.
 */

import {
  NewArtboard,
  NewImage,
  NewBezierCurve,
  NewArrow,
  NewCircle,
  NewRect,
  NewText,
  NewContainer,
} from "w2l";

const artboard = new NewArtboard({
  width: 1200,
  height: 800,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 50 },
});

// Create a main container for the diagram
const mainContainer = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 150,
  horizontalAlignment: "center",
  verticalAlignment: "center",
});

// ===== LEFT SIDE: Image with curved path =====

// Create a colored rectangle as a placeholder "image"
// (In real use, you'd use a real image URL)
const imageBox = new NewRect({
  width: 200,
  height: 150,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3,
    rx: 10,
    ry: 10,
  },
});

const imageLabel = new NewText({
  content: "NewImage\nSupport",
  width: 200,
  style: {
    fill: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAnchor: "middle",
  },
});

const leftColumn = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",
});

leftColumn.addElement(imageBox);
leftColumn.addElement(imageLabel);

mainContainer.addElement(leftColumn);

// ===== CENTER: Circle with bezier curves =====

const centerCircle = new NewCircle({
  radius: 80,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 3,
  },
});

const centerLabel = new NewText({
  content: "Bezier\nCurves",
  width: 150,
  style: {
    fill: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAnchor: "middle",
  },
});

centerLabel.position({
  relativeFrom: centerLabel.center,
  relativeTo: centerCircle.center,
  x: 0,
  y: 0,
});

const centerColumn = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",
});

centerColumn.addElement(centerCircle);
centerColumn.addElement(centerLabel);

mainContainer.addElement(centerColumn);

// ===== RIGHT SIDE: Rectangle with arrows =====

const rightBox = new NewRect({
  width: 200,
  height: 150,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 3,
    rx: 10,
    ry: 10,
  },
});

const rightLabel = new NewText({
  content: "NewArrow\nComponents",
  width: 200,
  style: {
    fill: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAnchor: "middle",
  },
});

const rightColumn = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: "center",
});

rightColumn.addElement(rightBox);
rightColumn.addElement(rightLabel);

mainContainer.addElement(rightColumn);

// Position the main container
mainContainer.position({
  relativeFrom: mainContainer.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

artboard.addElement(mainContainer);

// Helper function to get positions after elements are in hierarchy
// We'll compute relative positions based on the container layout
const getRelativePos = (containerElement, offsetX = 0, offsetY = 0) => {
  // For positioned elements, use a calculated center based on container
  const artboardCenter = { x: 600, y: 400 }; // Center of 1200x800
  return {
    x: artboardCenter.x + offsetX,
    y: artboardCenter.y + offsetY,
  };
};

// ===== ADD BEZIER CURVES =====
// Smooth S-curve connecting left and center (using calculated positions)
const leftToCenterCurve = new NewBezierCurve({
  start: { x: 225, y: 400 }, // Right edge of left box
  end: { x: 525, y: 400 },   // Left edge of center circle
  controlPoint1: { x: 305, y: 350 },
  controlPoint2: { x: 445, y: 450 },
  style: {
    stroke: "#9b59b6",
    strokeWidth: 4,
    fill: "none",
    strokeDasharray: "10,5",
  },
});

artboard.addElement(leftToCenterCurve);

// Smooth curve from center to right
const centerToRightCurve = new NewBezierCurve({
  start: { x: 680, y: 400 },  // Right edge of center circle
  end: { x: 875, y: 400 },    // Left edge of right box
  controlPoint1: { x: 760, y: 440 },
  controlPoint2: { x: 795, y: 360 },
  style: {
    stroke: "#f39c12",
    strokeWidth: 4,
    fill: "none",
  },
});

artboard.addElement(centerToRightCurve);

// ===== ADD ARROWS =====

// Simple arrow from top-left to center
const topLeftArrow = new NewArrow({
  start: { x: 150, y: 150 },
  end: { x: 550, y: 350 },
  headStyle: "triangle",
  headSize: 12,
  style: {
    stroke: "#3498db",
    strokeWidth: 3,
    fill: "#3498db",
  },
});

artboard.addElement(topLeftArrow);

// Double-ended arrow at the top
const doubleArrow = new NewArrow({
  start: { x: 225, y: 250 },
  end: { x: 975, y: 250 },
  headStyle: "line",
  headSize: 15,
  doubleEnded: true,
  style: {
    stroke: "#e74c3c",
    strokeWidth: 2,
  },
});

artboard.addElement(doubleArrow);

// Arrow pointing down from right side
const downArrow = new NewArrow({
  start: { x: 975, y: 475 },
  end: { x: 975, y: 575 },
  headStyle: "triangle",
  headSize: 14,
  style: {
    stroke: "#2ecc71",
    strokeWidth: 3,
    fill: "#2ecc71",
  },
});

artboard.addElement(downArrow);

// ===== ADD DECORATIVE ELEMENTS =====

// Small circles along the bezier curve (showing curve sampling)
for (let i = 0; i <= 10; i++) {
  const t = i / 10;
  const point = leftToCenterCurve.pointAt(t);
  
  const dot = new NewCircle({
    radius: 4,
    style: {
      fill: "#9b59b6",
      opacity: 0.6,
    },
  });
  
  dot.position({
    relativeFrom: dot.center,
    relativeTo: { x: point.x, y: point.y },
    x: 0,
    y: 0,
  });
  
  artboard.addElement(dot);
}

// Title text
const title = new NewText({
  content: "New Components Showcase",
  width: 1100,
  style: {
    fill: "#2c3e50",
    fontSize: 32,
    fontWeight: "bold",
    textAnchor: "middle",
  },
});

title.position({
  relativeFrom: title.center,
  relativeTo: { x: artboard.contentBox.center.x, y: 80 },
  x: 0,
  y: 0,
});

artboard.addElement(title);

// Subtitle text
const subtitle = new NewText({
  content: "NewImage • NewBezierCurve • NewArrow",
  width: 1100,
  style: {
    fill: "#7f8c8d",
    fontSize: 18,
    textAnchor: "middle",
  },
});

subtitle.position({
  relativeFrom: subtitle.center,
  relativeTo: { x: artboard.contentBox.center.x, y: 120 },
  x: 0,
  y: 0,
});

artboard.addElement(subtitle);

return artboard.render();

