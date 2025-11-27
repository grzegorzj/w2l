/**
 * Vertical Bar Chart Example
 *
 * Demonstrates vertical bar charts with:
 * - Basic data visualization
 * - Remarkable point detection (max, min)
 * - Position retrieval for custom annotations
 * - Custom styling per bar
 */

import {
  Artboard,
  BarChart,
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
  content: "Vertical Bar Chart: Monthly Sales Data",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

mainContainer.addElement(title);

// ============================================================
// Example 1: Basic Vertical Bar Chart
// ============================================================

const example1Title = new Text({
  content: "1. Basic Vertical Bar Chart",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example1Title);

const basicChart = new BarChart({
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 52 },
    { label: "Mar", value: 38 },
    { label: "Apr", value: 67 },
    { label: "May", value: 73 },
    { label: "Jun", value: 81 },
  ],
  orientation: "vertical",
  width: 600,
  height: 350,
  barColor: "#2196f3",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: false,
  detectRemarkablePoints: true,
  showRemarkablePoints: false,
});

mainContainer.addElement(basicChart);

// ============================================================
// Example 2: With Remarkable Points and Annotations
// ============================================================

const example2Title = new Text({
  content: "2. With Remarkable Points & Custom Annotations",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example2Title);

const annotatedChart = new BarChart({
  data: [
    { label: "Product A", value: 125 },
    { label: "Product B", value: 89 },
    { label: "Product C", value: 156 },
    { label: "Product D", value: 67 },
    { label: "Product E", value: 142 },
    { label: "Product F", value: 98 },
  ],
  orientation: "vertical",
  width: 700,
  height: 400,
  barColor: "#4caf50",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: true,
  detectRemarkablePoints: true,
  showRemarkablePoints: true,
  remarkablePointStyle: {
    fill: "#ff5722",
    stroke: "#d84315",
    strokeWidth: 2,
  },
});

mainContainer.addElement(annotatedChart);

// Add custom annotations using position retrieval
const remarkablePoints = annotatedChart.getRemarkablePoints();

remarkablePoints.forEach((point) => {
  if (point.type === "maximum" || point.type === "minimum") {
    const pos = annotatedChart.getRemarkablePointPosition(point);

    // Add a label above the remarkable point
    const label = new Text({
      content: point.type === "maximum" ? "Best Seller!" : "Needs Attention",
      fontSize: 11,
      fontWeight: "bold",
      style: {
        fill: point.type === "maximum" ? "#2e7d32" : "#c62828",
      },
    });

    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: { x: pos.x, y: pos.y },
      boxReference: "artboard",
      x: 0,
      y: -15,
    });

    artboard.addElement(label);

    // Add a connecting line
    const line = new Line({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 5 },
      style: {
        stroke: point.type === "maximum" ? "#2e7d32" : "#c62828",
        strokeWidth: "2",
      },
    });

    line.position({
      relativeFrom: line.start,
      relativeTo: { x: pos.x, y: pos.y - 10 },
      boxReference: "artboard",
      x: 0,
      y: 0,
    });

    artboard.addElement(line);
  }
});

// ============================================================
// Example 3: Custom Colors Per Bar
// ============================================================

const example3Title = new Text({
  content: "3. Custom Colors Per Bar (Performance Status)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example3Title);

const coloredChart = new BarChart({
  data: [
    { label: "Q1", value: 85, color: "#4caf50" }, // Green - Good
    { label: "Q2", value: 92, color: "#4caf50" }, // Green - Good
    { label: "Q3", value: 67, color: "#ff9800" }, // Orange - Warning
    { label: "Q4", value: 45, color: "#f44336" }, // Red - Critical
  ],
  orientation: "vertical",
  width: 500,
  height: 350,
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: true,
  gridLineCount: 4,
  chartPadding: {
    top: 30,
    right: 30,
    bottom: 50,
    left: 70,
  },
});

mainContainer.addElement(coloredChart);

// Add legend
const legendContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 25,
});

mainContainer.addElement(legendContainer);

const legendItems = [
  { color: "#4caf50", label: "Good (≥80)" },
  { color: "#ff9800", label: "Warning (60-79)" },
  { color: "#f44336", label: "Critical (<60)" },
];

legendItems.forEach((item) => {
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
  legendContainer.addElement(itemContainer);
});

// ============================================================
// Example 4: Highlighting Specific Bars
// ============================================================

const example4Title = new Text({
  content: "4. Highlighting Specific Data Points",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example4Title);

const highlightChart = new BarChart({
  data: [
    { label: "Mon", value: 34 },
    { label: "Tue", value: 42 },
    { label: "Wed", value: 51 },
    { label: "Thu", value: 38 },
    { label: "Fri", value: 65 },
    { label: "Sat", value: 28 },
    { label: "Sun", value: 31 },
  ],
  orientation: "vertical",
  width: 750,
  height: 350,
  barColor: "#9e9e9e",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  detectRemarkablePoints: false,
});

mainContainer.addElement(highlightChart);

// Highlight specific bars (e.g., Friday is the best day)
const bars = highlightChart.getBars();
const fridayBar = bars[4]; // Index 4 is Friday

if (fridayBar) {
  // Add a star marker at the top of the bar
  const star = new Text({
    content: "⭐",
    fontSize: 28,
  });

  star.position({
    relativeFrom: star.center,
    relativeTo: fridayBar.topCenter,
    boxReference: "artboard",
    x: 0,
    y: -25,
  });

  artboard.addElement(star);

  // Add text annotation
  const annotation = new Text({
    content: "Peak Day!",
    fontSize: 12,
    fontWeight: "bold",
    style: { fill: "#ff6f00" },
  });

  annotation.position({
    relativeFrom: annotation.center,
    relativeTo: fridayBar.topCenter,
    boxReference: "artboard",
    x: 0,
    y: -50,
  });

  artboard.addElement(annotation);

  // Add a highlight circle at the bar center
  const highlight = new Circle({
    radius: 30,
    style: {
      fill: "none",
      stroke: "#ff6f00",
      strokeWidth: 3,
      strokeDasharray: "5,5",
    },
  });

  highlight.position({
    relativeFrom: highlight.center,
    relativeTo: fridayBar.center,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });

  artboard.addElement(highlight);
}

return artboard.render();

