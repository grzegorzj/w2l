/**
 * Trigonometry Functions with Remarkable Points
 * 
 * A comprehensive showcase of trigonometric functions and their remarkable points:
 * - Roots (zeros/x-intercepts)
 * - Local maxima and minima
 * - Vertical asymptotes
 * - Inflection points
 * 
 * Uses Grid layout to organize multiple graphs for easy comparison.
 */

import {
  Artboard,
  Grid,
  FunctionGraph,
  Text,
  Container,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#fafafa",
  boxModel: { padding: 40 },
});

// Main container
const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 30,
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer);

// Title
const title = new Text({
  content: "Trigonometry: Remarkable Points Showcase",
  fontSize: 28,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

mainContainer.addElement(title);

const subtitle = new Text({
  content: "Red dots show auto-detected remarkable points: roots, maxima, minima, asymptotes, and inflection points",
  fontSize: 14,
  style: { fill: "#616161" },
});

mainContainer.addElement(subtitle);

// Create a 3x3 grid for the trigonometric functions
const grid = new Grid({
  rows: 3,
  columns: 3,
  width: 1200,
  height: 1050,
  cellWidth: 380,
  cellHeight: 330,
  gutter: 10,
  boxModel: { padding: 10 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 1,
  },
});

// Note: Grid has a container property that needs to be added to artboard
mainContainer.addElement(grid.container);

// Helper function to create a cell with title, graph, and note
function createTrigCell(row, col, title, fn, color, domain, range, note) {
  const cell = grid.getCell(row, col);
  
  // Title
  const titleText = new Text({
    content: title,
    fontSize: 16,
    fontWeight: "bold",
    style: { fill: color },
  });
  
  titleText.position({
    relativeFrom: titleText.center,
    relativeTo: cell.contentBox.center,
    x: 0,
    y: -140, // Position near top of cell
  });
  
  cell.addElement(titleText);
  
  // Graph
  const graph = new FunctionGraph({
    functions: {
      fn: fn,
      color: color,
      strokeWidth: 2.5,
    },
    width: 340,
    height: 240,
    domain: domain,
    range: range,
    showGrid: true,
    showAxes: true,
    detectRemarkablePoints: true,
    showRemarkablePoints: true,
    remarkablePointStyle: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: 2,
    },
  });
  
  graph.position({
    relativeFrom: graph.center,
    relativeTo: cell.contentBox.center,
    x: 0,
    y: -10, // Center of cell
  });
  
  cell.addElement(graph);
  
  // Note
  const noteText = new Text({
    content: note,
    fontSize: 10,
    style: { fill: "#7f8c8d" },
    fontStyle: "italic",
    maxWidth: 340,
  });
  
  noteText.position({
    relativeFrom: noteText.center,
    relativeTo: cell.contentBox.center,
    x: 0,
    y: 140, // Position near bottom of cell
  });
  
  cell.addElement(noteText);
}

// ============================================================
// Row 1: Basic Trigonometry
// ============================================================

// Cell 0,0: sin(x)
createTrigCell(
  0, 0,
  "sin(x)",
  (x) => Math.sin(x),
  "#1976d2",
  [-Math.PI * 2, Math.PI * 2],
  [-1.5, 1.5],
  "Max at π/2, Min at 3π/2, Roots at nπ"
);

// Cell 0,1: cos(x)
createTrigCell(
  0, 1,
  "cos(x)",
  (x) => Math.cos(x),
  "#2ecc71",
  [-Math.PI * 2, Math.PI * 2],
  [-1.5, 1.5],
  "Max at 0, 2π, Min at π, Roots at π/2 + nπ"
);

// Cell 0,2: tan(x)
createTrigCell(
  0, 2,
  "tan(x)",
  (x) => Math.tan(x),
  "#e67e22",
  [-Math.PI, Math.PI],
  [-4, 4],
  "Asymptotes at ±π/2, Roots at nπ"
);

// ============================================================
// Row 2: Reciprocal Trigonometry
// ============================================================

// Cell 1,0: csc(x) = 1/sin(x)
createTrigCell(
  1, 0,
  "csc(x) = 1/sin(x)",
  (x) => 1 / Math.sin(x),
  "#9b59b6",
  [0.1, Math.PI * 2 - 0.1],
  [-4, 4],
  "Asymptotes at nπ (zeros of sin)"
);

// Cell 1,1: sec(x) = 1/cos(x)
createTrigCell(
  1, 1,
  "sec(x) = 1/cos(x)",
  (x) => 1 / Math.cos(x),
  "#1abc9c",
  [-Math.PI / 2 + 0.2, Math.PI / 2 - 0.2],
  [-6, 6],
  "Asymptotes at π/2 + nπ (zeros of cos)"
);

// Cell 1,2: cot(x) = 1/tan(x)
createTrigCell(
  1, 2,
  "cot(x) = 1/tan(x)",
  (x) => 1 / Math.tan(x),
  "#e84393",
  [0.1, Math.PI - 0.1],
  [-4, 4],
  "Asymptotes at nπ (zeros of tan)"
);

// ============================================================
// Row 3: Modified Trigonometry
// ============================================================

// Cell 2,0: sin(2x)
createTrigCell(
  2, 0,
  "sin(2x)",
  (x) => Math.sin(2 * x),
  "#3498db",
  [-Math.PI, Math.PI],
  [-1.5, 1.5],
  "Double frequency: 4 extrema in [-π, π]"
);

// Cell 2,1: sin(x) * cos(x)
createTrigCell(
  2, 1,
  "sin(x) × cos(x)",
  (x) => Math.sin(x) * Math.cos(x),
  "#f39c12",
  [-Math.PI, Math.PI],
  [-0.6, 0.6],
  "= sin(2x)/2, extrema at π/4 + nπ/2"
);

// Cell 2,2: sin³(x)
createTrigCell(
  2, 2,
  "sin³(x)",
  (x) => Math.pow(Math.sin(x), 3),
  "#d35400",
  [-Math.PI, Math.PI],
  [-1.2, 1.2],
  "Cubic power: sharper peaks, inflection points"
);

// ============================================================
// Legend explaining remarkable point types
// ============================================================

const legendTitle = new Text({
  content: "Remarkable Point Types:",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

mainContainer.addElement(legendTitle);

const legendContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 40,
  boxModel: { padding: 15 },
  style: {
    fill: "#ecf0f1",
    stroke: "#bdc3c7",
    strokeWidth: 1,
  },
});

mainContainer.addElement(legendContainer);

const legendItems = [
  { label: "🔴 Roots", desc: "f(x) = 0 (x-intercepts)" },
  { label: "🔴 Maxima", desc: "Local maximum points" },
  { label: "🔴 Minima", desc: "Local minimum points" },
  { label: "🔴 Asymptotes", desc: "f(x) → ±∞" },
  { label: "🔴 Inflection", desc: "Concavity change" },
];

legendItems.forEach(item => {
  const itemContainer = new Container({
    width: "auto",
    height: "auto",
    direction: "vertical",
    spacing: 5,
  });
  
  const itemLabel = new Text({
    content: item.label,
    fontSize: 13,
    fontWeight: "bold",
    style: { fill: "#2c3e50" },
  });
  
  itemContainer.addElement(itemLabel);
  
  const itemDesc = new Text({
    content: item.desc,
    fontSize: 11,
    style: { fill: "#7f8c8d" },
  });
  
  itemContainer.addElement(itemDesc);
  
  legendContainer.addElement(itemContainer);
});

return artboard.render();

