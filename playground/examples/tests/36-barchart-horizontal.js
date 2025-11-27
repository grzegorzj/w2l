/**
 * Horizontal Bar Chart Example
 *
 * Demonstrates horizontal bar charts with:
 * - Horizontal orientation for category comparison
 * - Position retrieval for annotations
 * - Remarkable point detection
 * - Custom styling
 */

import {
  Artboard,
  BarChart,
  Container,
  Text,
  Circle,
  Rect,
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
  content: "Horizontal Bar Charts: Country Statistics",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

mainContainer.addElement(title);

const subtitle = new Text({
  content: "Horizontal orientation is ideal for comparing categories with long labels",
  fontSize: 13,
  style: { fill: "#616161" },
});

mainContainer.addElement(subtitle);

// ============================================================
// Example 1: Basic Horizontal Bar Chart
// ============================================================

const example1Title = new Text({
  content: "1. Population by Country (millions)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example1Title);

const populationChart = new BarChart({
  data: [
    { label: "United States", value: 331 },
    { label: "Brazil", value: 213 },
    { label: "Japan", value: 126 },
    { label: "Germany", value: 83 },
    { label: "United Kingdom", value: 67 },
  ],
  orientation: "horizontal",
  width: 700,
  height: 350,
  barColor: "#3f51b5",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: false,
  chartPadding: {
    top: 20,
    right: 80,
    bottom: 40,
    left: 150,
  },
});

mainContainer.addElement(populationChart);

// ============================================================
// Example 2: With Remarkable Points
// ============================================================

const example2Title = new Text({
  content: "2. Technology Adoption Rate (%) with Remarkable Points",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example2Title);

const techChart = new BarChart({
  data: [
    { label: "Artificial Intelligence", value: 67 },
    { label: "Cloud Computing", value: 89 },
    { label: "Internet of Things", value: 54 },
    { label: "Blockchain", value: 23 },
    { label: "5G Networks", value: 45 },
    { label: "Quantum Computing", value: 8 },
  ],
  orientation: "horizontal",
  width: 750,
  height: 400,
  barColor: "#009688",
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
  chartPadding: {
    top: 30,
    right: 100,
    bottom: 50,
    left: 180,
  },
});

mainContainer.addElement(techChart);

// Add annotations for remarkable points
const remarkablePoints = techChart.getRemarkablePoints();

remarkablePoints.forEach((point) => {
  if (point.type === "maximum") {
    const pos = techChart.getRemarkablePointPosition(point);

    const badge = new Container({
      width: "auto",
      height: "auto",
      direction: "horizontal",
      spacing: 5,
      boxModel: { padding: 5 },
      style: {
        fill: "#c8e6c9",
        stroke: "#388e3c",
        strokeWidth: 2,
      },
    });

    const badgeText = new Text({
      content: "🏆 Most Adopted",
      fontSize: 11,
      fontWeight: "bold",
      style: { fill: "#1b5e20" },
    });

    badge.addElement(badgeText);

    badge.position({
      relativeFrom: badge.centerLeft,
      relativeTo: { x: pos.x, y: pos.y },
      boxReference: "artboard",
      x: 15,
      y: 0,
    });

    artboard.addElement(badge);
  } else if (point.type === "minimum") {
    const pos = techChart.getRemarkablePointPosition(point);

    const badge = new Container({
      width: "auto",
      height: "auto",
      direction: "horizontal",
      spacing: 5,
      boxModel: { padding: 5 },
      style: {
        fill: "#ffecb3",
        stroke: "#f57c00",
        strokeWidth: 2,
      },
    });

    const badgeText = new Text({
      content: "💡 Emerging Tech",
      fontSize: 11,
      fontWeight: "bold",
      style: { fill: "#e65100" },
    });

    badge.addElement(badgeText);

    badge.position({
      relativeFrom: badge.centerLeft,
      relativeTo: { x: pos.x, y: pos.y },
      boxReference: "artboard",
      x: 15,
      y: 0,
    });

    artboard.addElement(badge);
  }
});

// ============================================================
// Example 3: Progress Bars with Thresholds
// ============================================================

const example3Title = new Text({
  content: "3. Project Completion Status",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example3Title);

const projectData = [
  { label: "Frontend Development", value: 92, color: "#4caf50" },
  { label: "Backend API", value: 78, color: "#ff9800" },
  { label: "Database Migration", value: 100, color: "#4caf50" },
  { label: "Testing & QA", value: 45, color: "#f44336" },
  { label: "Documentation", value: 67, color: "#ff9800" },
];

const projectChart = new BarChart({
  data: projectData,
  orientation: "horizontal",
  width: 700,
  height: 350,
  maxValue: 100,
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: true,
  detectRemarkablePoints: false,
  chartPadding: {
    top: 20,
    right: 100,
    bottom: 40,
    left: 180,
  },
});

mainContainer.addElement(projectChart);

// Add threshold line at 75%
const bars = projectChart.getBars();
if (bars.length > 0) {
  // Get chart bounds using the first bar as reference
  const absPos = projectChart.getAbsolutePosition();
  const chartBox = projectChart.bbox;

  // Calculate threshold line position (75% of max value)
  const thresholdValue = 75;
  const maxValue = 100;
  const chartPaddingLeft = 180;
  const chartPaddingRight = 100;
  const plotWidth = 700 - chartPaddingLeft - chartPaddingRight;
  const thresholdX = absPos.x + chartPaddingLeft + (thresholdValue / maxValue) * plotWidth;

  const chartPaddingTop = 20;
  const chartPaddingBottom = 40;
  const plotHeight = 350 - chartPaddingTop - chartPaddingBottom;

  // Draw threshold line
  const thresholdLine = new Rect({
    width: 2,
    height: plotHeight,
    style: {
      fill: "#1976d2",
      stroke: "none",
      strokeDasharray: "5,5",
    },
  });

  thresholdLine.position({
    relativeFrom: thresholdLine.topLeft,
    relativeTo: { x: thresholdX, y: absPos.y + chartPaddingTop },
    boxReference: "artboard",
    x: 0,
    y: 0,
  });

  artboard.addElement(thresholdLine);

  // Add threshold label
  const thresholdLabel = new Text({
    content: "Target: 75%",
    fontSize: 11,
    fontWeight: "bold",
    style: { fill: "#1976d2" },
  });

  thresholdLabel.position({
    relativeFrom: thresholdLabel.bottomCenter,
    relativeTo: { x: thresholdX, y: absPos.y },
    boxReference: "artboard",
    x: 0,
    y: 15,
  });

  artboard.addElement(thresholdLabel);
}

// ============================================================
// Example 4: Comparison with Bar Center Annotations
// ============================================================

const example4Title = new Text({
  content: "4. Revenue Comparison (with percentage change)",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example4Title);

const revenueData = [
  { label: "Product Line A", value: 2.4 },
  { label: "Product Line B", value: 1.8 },
  { label: "Product Line C", value: 3.2 },
  { label: "Product Line D", value: 0.9 },
];

const revenueChart = new BarChart({
  data: revenueData,
  orientation: "horizontal",
  width: 700,
  height: 300,
  barColor: "#673ab7",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: false,
  detectRemarkablePoints: false,
  chartPadding: {
    top: 20,
    right: 120,
    bottom: 40,
    left: 150,
  },
});

mainContainer.addElement(revenueChart);

// Add percentage badges on each bar
const revenueChanges = ["+12%", "-5%", "+18%", "-8%"];
const revenueBars = revenueChart.getBars();

revenueBars.forEach((bar, index) => {
  const change = revenueChanges[index];
  const isPositive = change.startsWith("+");

  const badge = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 3,
    boxModel: { padding: 4 },
    style: {
      fill: isPositive ? "#e8f5e9" : "#ffebee",
      stroke: isPositive ? "#4caf50" : "#f44336",
      strokeWidth: 1.5,
    },
  });

  const badgeText = new Text({
    content: change,
    fontSize: 10,
    fontWeight: "bold",
    style: { fill: isPositive ? "#2e7d32" : "#c62828" },
  });

  badge.addElement(badgeText);

  badge.position({
    relativeFrom: badge.center,
    relativeTo: bar.center,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });

  artboard.addElement(badge);
});

return artboard.render();

