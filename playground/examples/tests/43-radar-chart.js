/**
 * Radar Chart (Spider Chart) Example
 *
 * Demonstrates radar/spider charts with:
 * - Multiple data series overlaid
 * - Customizable axes
 * - Position retrieval for annotations
 * - Remarkable point detection
 */

import {
  Artboard,
  RadarChart,
  Container,
  Text,
  Circle,
  Line,
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
  spacing: 40,
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
  content: "Radar Charts (Spider Charts)",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

mainContainer.addElement(title);

// ============================================================
// Example 1: Skills Assessment
// ============================================================

const example1Title = new Text({
  content: "1. Skills Assessment Comparison",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example1Title);

const skillsChart = new RadarChart({
  axes: ["Communication", "Leadership", "Technical", "Problem Solving", "Creativity", "Teamwork"],
  series: [
    {
      name: "Candidate A",
      data: [85, 75, 90, 80, 70, 88],
      color: "#2196f3",
      filled: true,
    },
    {
      name: "Candidate B",
      data: [78, 88, 75, 85, 92, 80],
      color: "#4caf50",
      filled: true,
    },
  ],
  width: 600,
  height: 600,
  maxValue: 100,
  showGrid: true,
  showAxes: true,
  showLabels: true,
  showValueLabels: false,
});

mainContainer.addElement(skillsChart);

// Add legend
const legend1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 25,
});

mainContainer.addElement(legend1Container);

const legend1Items = [
  { color: "#2196f3", label: "Candidate A" },
  { color: "#4caf50", label: "Candidate B" },
];

legend1Items.forEach((item) => {
  const itemContainer = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 8,
    verticalAlignment: "center",
  });

  const colorBox = new Circle({
    radius: 8,
    style: { fill: item.color, stroke: "none" },
  });

  itemContainer.addElement(colorBox);

  const labelText = new Text({
    content: item.label,
    fontSize: 12,
    style: { fill: "#616161" },
  });

  itemContainer.addElement(labelText);
  legend1Container.addElement(itemContainer);
});

// ============================================================
// Example 2: Product Feature Comparison
// ============================================================

const example2Title = new Text({
  content: "2. Product Feature Comparison",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example2Title);

const productChart = new RadarChart({
  axes: ["Performance", "Design", "Battery Life", "Camera", "Price"],
  series: [
    {
      name: "Product X",
      data: [90, 85, 70, 95, 60],
      color: "#ff6b6b",
      filled: true,
    },
    {
      name: "Product Y",
      data: [75, 95, 85, 80, 75],
      color: "#4ecdc4",
      filled: true,
    },
    {
      name: "Product Z",
      data: [85, 80, 90, 75, 85],
      color: "#ffe66d",
      filled: true,
    },
  ],
  width: 600,
  height: 600,
  maxValue: 100,
  showGrid: true,
  showAxes: true,
  showLabels: true,
  showValueLabels: true,
  gridLevels: 5,
});

mainContainer.addElement(productChart);

// Add legend
const legend2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 25,
});

mainContainer.addElement(legend2Container);

const legend2Items = [
  { color: "#ff6b6b", label: "Product X" },
  { color: "#4ecdc4", label: "Product Y" },
  { color: "#ffe66d", label: "Product Z" },
];

legend2Items.forEach((item) => {
  const itemContainer = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 8,
    verticalAlignment: "center",
  });

  const colorBox = new Circle({
    radius: 8,
    style: { fill: item.color, stroke: "none" },
  });

  itemContainer.addElement(colorBox);

  const labelText = new Text({
    content: item.label,
    fontSize: 12,
    style: { fill: "#616161" },
  });

  itemContainer.addElement(labelText);
  legend2Container.addElement(itemContainer);
});

// ============================================================
// Example 3: With Annotations
// ============================================================

const example3Title = new Text({
  content: "3. Team Performance with Peak Highlights",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example3Title);

const teamChart = new RadarChart({
  axes: ["Quality", "Speed", "Innovation", "Collaboration"],
  series: [
    {
      name: "Q1 2024",
      data: [78, 82, 75, 88],
      color: "#9c27b0",
      filled: true,
    },
    {
      name: "Q2 2024",
      data: [85, 88, 82, 92],
      color: "#ff9800",
      filled: true,
    },
  ],
  width: 550,
  height: 550,
  maxValue: 100,
  showGrid: true,
  showAxes: true,
  showLabels: true,
  detectRemarkablePoints: true,
});

mainContainer.addElement(teamChart);

// Highlight the best overall score (Q2 Collaboration - 92)
const bestPos = teamChart.getDataPointPosition(1, 3); // Series 1 (Q2), Axis 3 (Collaboration)

const bestMarker = new Circle({
  radius: 12,
  style: {
    fill: "none",
    stroke: "#ff5722",
    strokeWidth: 3,
  },
});

bestMarker.position({
  relativeFrom: bestMarker.center,
  relativeTo: bestPos,
  boxReference: "artboard",
  x: 0,
  y: 0,
});

artboard.addElement(bestMarker);

const bestLabel = new Text({
  content: "Peak! 92",
  fontSize: 12,
  fontWeight: "bold",
  style: { fill: "#ff5722" },
});

bestLabel.position({
  relativeFrom: bestLabel.center,
  relativeTo: bestPos,
  boxReference: "artboard",
  x: 25,
  y: 0,
});

artboard.addElement(bestLabel);

// Add legend
const legend3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 25,
});

mainContainer.addElement(legend3Container);

const legend3Items = [
  { color: "#9c27b0", label: "Q1 2024" },
  { color: "#ff9800", label: "Q2 2024" },
];

legend3Items.forEach((item) => {
  const itemContainer = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 8,
    verticalAlignment: "center",
  });

  const colorBox = new Circle({
    radius: 8,
    style: { fill: item.color, stroke: "none" },
  });

  itemContainer.addElement(colorBox);

  const labelText = new Text({
    content: item.label,
    fontSize: 12,
    style: { fill: "#616161" },
  });

  itemContainer.addElement(labelText);
  legend3Container.addElement(itemContainer);
});

return artboard.render();

