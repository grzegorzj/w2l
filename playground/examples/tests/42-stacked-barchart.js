/**
 * Stacked Bar Chart Example
 *
 * Demonstrates stacked bar charts with:
 * - Multiple data series stacked on top of each other
 * - Vertical and horizontal orientations
 * - Custom colors per series
 * - Segment access for annotations
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
  content: "Stacked Bar Charts",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

mainContainer.addElement(title);

// ============================================================
// Example 1: Vertical Stacked Bar Chart - Revenue Breakdown
// ============================================================

const example1Title = new Text({
  content: "1. Vertical Stacked Bar Chart: Quarterly Revenue Breakdown",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example1Title);

const verticalStackedChart = new BarChart({
  categories: ["Q1", "Q2", "Q3", "Q4"],
  series: [
    {
      name: "Product Sales",
      data: [120, 145, 168, 190],
      color: "#2196f3",
    },
    {
      name: "Services",
      data: [80, 95, 110, 125],
      color: "#4caf50",
    },
    {
      name: "Licensing",
      data: [40, 50, 45, 60],
      color: "#ff9800",
    },
  ],
  stacked: true,
  orientation: "vertical",
  width: 700,
  height: 400,
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: false,
  detectRemarkablePoints: false,
  chartPadding: {
    top: 40,
    right: 40,
    bottom: 60,
    left: 80,
  },
});

mainContainer.addElement(verticalStackedChart);

// Add legend for vertical chart
const legend1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 25,
});

mainContainer.addElement(legend1Container);

const legend1Items = [
  { color: "#2196f3", label: "Product Sales" },
  { color: "#4caf50", label: "Services" },
  { color: "#ff9800", label: "Licensing" },
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
// Example 2: Horizontal Stacked Bar Chart - Team Progress
// ============================================================

const example2Title = new Text({
  content: "2. Horizontal Stacked Bar Chart: Project Progress by Team",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example2Title);

const horizontalStackedChart = new BarChart({
  categories: ["Backend Team", "Frontend Team", "DevOps Team", "Design Team"],
  series: [
    {
      name: "Completed",
      data: [85, 92, 78, 95],
      color: "#4caf50",
    },
    {
      name: "In Progress",
      data: [12, 15, 18, 8],
      color: "#ff9800",
    },
    {
      name: "Pending",
      data: [8, 6, 10, 4],
      color: "#f44336",
    },
  ],
  stacked: true,
  orientation: "horizontal",
  width: 700,
  height: 350,
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: false,
  detectRemarkablePoints: false,
  chartPadding: {
    top: 40,
    right: 60,
    bottom: 50,
    left: 140,
  },
});

mainContainer.addElement(horizontalStackedChart);

// Add legend for horizontal chart
const legend2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 25,
});

mainContainer.addElement(legend2Container);

const legend2Items = [
  { color: "#4caf50", label: "Completed" },
  { color: "#ff9800", label: "In Progress" },
  { color: "#f44336", label: "Pending" },
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
// Example 3: With Annotations - Highlighting Best Quarter
// ============================================================

const example3Title = new Text({
  content: "3. With Annotations: Highlighting Best Quarter",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(example3Title);

const annotatedStackedChart = new BarChart({
  categories: ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"],
  series: [
    {
      name: "North Region",
      data: [45, 52, 48, 65],
      color: "#2196f3",
    },
    {
      name: "South Region",
      data: [38, 45, 42, 58],
      color: "#4caf50",
    },
    {
      name: "East Region",
      data: [32, 38, 35, 48],
      color: "#ff9800",
    },
    {
      name: "West Region",
      data: [28, 34, 31, 44],
      color: "#9c27b0",
    },
  ],
  stacked: true,
  orientation: "vertical",
  width: 750,
  height: 400,
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  showValueLabels: false,
  detectRemarkablePoints: false,
  chartPadding: {
    top: 60,
    right: 40,
    bottom: 60,
    left: 80,
  },
});

mainContainer.addElement(annotatedStackedChart);

// Find and annotate the best quarter (Q4 - index 3)
const bars = annotatedStackedChart.getBars();
const bestQuarterBar = bars[3]; // Oct-Dec

if (bestQuarterBar) {
  // Add a star annotation above the best quarter
  const star = new Text({
    content: "⭐ Best Quarter!",
    fontSize: 16,
    fontWeight: "bold",
    style: { fill: "#ff6f00" },
  });

  star.position({
    relativeFrom: star.bottomCenter,
    relativeTo: bestQuarterBar.topCenter,
    boxReference: "artboard",
    x: 0,
    y: -20,
  });

  artboard.addElement(star);

  // Add a total value label
  const totalLabel = new Text({
    content: `Total: ${bestQuarterBar.value.toFixed(0)}`,
    fontSize: 12,
    fontWeight: "bold",
    style: { fill: "#424242" },
  });

  totalLabel.position({
    relativeFrom: totalLabel.bottomCenter,
    relativeTo: bestQuarterBar.topCenter,
    boxReference: "artboard",
    x: 0,
    y: -5,
  });

  artboard.addElement(totalLabel);

  // Add a dashed line pointing to it
  const pointer = new Line({
    start: { x: 0, y: 0 },
    end: { x: 0, y: -10 },
    style: {
      stroke: "#ff6f00",
      strokeWidth: "2",
      strokeDasharray: "3,3",
    },
  });

  pointer.position({
    relativeFrom: pointer.end,
    relativeTo: bestQuarterBar.topCenter,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });

  artboard.addElement(pointer);
}

// Add legend for annotated chart
const legend3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
});

mainContainer.addElement(legend3Container);

const legend3Items = [
  { color: "#2196f3", label: "North Region" },
  { color: "#4caf50", label: "South Region" },
  { color: "#ff9800", label: "East Region" },
  { color: "#9c27b0", label: "West Region" },
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

