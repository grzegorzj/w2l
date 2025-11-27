/**
 * DonutChart Component Example
 * 
 * Demonstrates the DonutChart compound component with:
 * - Basic pie chart (innerRadius = 0)
 * - Classic donut chart (innerRadius = 50%)
 * - Custom styled donut with labels
 * - Accessing remarkable points
 * - Retrieving slice positions for annotations
 */

import {
  Artboard,
  Container,
  DonutChart,
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

// Sample data
const salesData = [
  { label: "Electronics", value: 45 },
  { label: "Clothing", value: 30 },
  { label: "Food", value: 15 },
  { label: "Books", value: 10 },
];

const marketShareData = [
  { label: "Company A", value: 52 },
  { label: "Company B", value: 28 },
  { label: "Company C", value: 12 },
  { label: "Others", value: 8 },
];

const budgetData = [
  { label: "Salaries", value: 60, color: "#FF6384" },
  { label: "Marketing", value: 20, color: "#36A2EB" },
  { label: "R&D", value: 15, color: "#FFCE56" },
  { label: "Operations", value: 5, color: "#4BC0C0" },
];

// ============================================================
// Example 1: Basic Pie Chart (no inner radius)
// ============================================================

const example1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

example1Container.position({
  relativeFrom: example1Container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(example1Container);

const title1 = new Text({
  content: "Example 1: Pie Chart",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example1Container.addElement(title1);

const pieChart = new DonutChart({
  data: salesData,
  width: 300,
  height: 300,
  innerRadius: 0, // Pie chart
  showLabels: true,
  detectRemarkablePoints: true,
});

example1Container.addElement(pieChart);

// Add label showing the largest slice
const maxPoint = pieChart.getRemarkablePoints("maximum")[0];
if (maxPoint) {
  const maxLabel = new Text({
    content: `Largest: ${maxPoint.label} (${maxPoint.percentage.toFixed(1)}%)`,
    fontSize: 14,
    style: { fill: "#2e7d32" },
    fontWeight: "bold",
  });
  
  example1Container.addElement(maxLabel);
}

// ============================================================
// Example 2: Classic Donut Chart
// ============================================================

const example2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

example2Container.position({
  relativeFrom: example2Container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 350,
  y: 0,
});

artboard.addElement(example2Container);

const title2 = new Text({
  content: "Example 2: Donut Chart",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example2Container.addElement(title2);

const donutChart = new DonutChart({
  data: salesData,
  width: 300,
  height: 300,
  innerRadius: "50%", // Donut with 50% inner radius
  showLabels: true,
  detectRemarkablePoints: true,
});

example2Container.addElement(donutChart);

// Add center label showing total
const centerLabel = new Text({
  content: "Total Sales",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

const totalValue = salesData.reduce((sum, d) => sum + d.value, 0);
const centerValue = new Text({
  content: `${totalValue}`,
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

const centerPos = donutChart.getCenterPosition();

centerLabel.position({
  relativeFrom: centerLabel.center,
  relativeTo: centerPos,
  boxReference: "artboard",
  x: 0,
  y: -15,
});

centerValue.position({
  relativeFrom: centerValue.center,
  relativeTo: centerPos,
  boxReference: "artboard",
  x: 0,
  y: 10,
});

artboard.addElement(centerLabel);
artboard.addElement(centerValue);

// ============================================================
// Example 3: Market Share with Majority Indicator
// ============================================================

const example3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

example3Container.position({
  relativeFrom: example3Container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 700,
  y: 0,
});

artboard.addElement(example3Container);

const title3 = new Text({
  content: "Example 3: Market Share",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example3Container.addElement(title3);

const marketChart = new DonutChart({
  data: marketShareData,
  width: 300,
  height: 300,
  innerRadius: "60%",
  showLabels: true,
  detectRemarkablePoints: true,
  startAngle: 0, // Start from right
});

example3Container.addElement(marketChart);

// Highlight the majority holder if exists
const majorityPoint = marketChart.getRemarkablePoints("majority")[0];
if (majorityPoint) {
  const majoritySlice = marketChart.getSlice(majorityPoint.index);
  if (majoritySlice) {
    // Draw a marker at the outer midpoint
    const markerPos = majoritySlice.outerMidpoint;
    
    const marker = new Circle({
      radius: 8,
      style: {
        fill: "#4caf50",
        stroke: "#2e7d32",
        strokeWidth: 2,
      },
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: markerPos,
      boxReference: "artboard",
      x: 0,
      y: 0,
    });
    
    artboard.addElement(marker);
    
    // Add annotation
    const annotation = new Text({
      content: "Majority",
      fontSize: 12,
      fontWeight: "bold",
      style: { fill: "#2e7d32" },
    });
    
    const annotationPos = majoritySlice.externalLabelPosition;
    annotation.position({
      relativeFrom: annotation.center,
      relativeTo: annotationPos,
      boxReference: "artboard",
      x: 0,
      y: 0,
    });
    
    artboard.addElement(annotation);
  }
}

// ============================================================
// Example 4: Budget Breakdown with Custom Colors and Legend
// ============================================================

const example4Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

example4Container.position({
  relativeFrom: example4Container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 420,
});

artboard.addElement(example4Container);

const title4 = new Text({
  content: "Example 4: Budget Breakdown",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example4Container.addElement(title4);

const budgetChart = new DonutChart({
  data: budgetData,
  width: 300,
  height: 300,
  innerRadius: "40%",
  showLabels: true,
  detectRemarkablePoints: true,
  sliceStyle: {
    strokeWidth: 3,
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

example4Container.addElement(budgetChart);

// Create a simple legend manually
const legendContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
  boxModel: { padding: 15 },
  style: {
    fill: "#f5f5f5",
    stroke: "#bdbdbd",
    strokeWidth: 1,
  },
});

legendContainer.position({
  relativeFrom: legendContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 350,
  y: 420 + 50,
});

artboard.addElement(legendContainer);

const legendTitle = new Text({
  content: "Legend",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

legendContainer.addElement(legendTitle);

// Add legend items
budgetData.forEach((item, index) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 10,
    horizontalAlignment: "left",
  });
  
  legendContainer.addElement(legendItem);
  
  // Color box
  const colorBox = new Circle({
    radius: 8,
    style: {
      fill: item.color,
      stroke: "none",
    },
  });
  
  legendItem.addElement(colorBox);
  
  // Label
  const slice = budgetChart.getSlice(index);
  const labelText = new Text({
    content: `${item.label}: ${item.value}% (${slice?.percentage.toFixed(1)}%)`,
    fontSize: 12,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(labelText);
});

// ============================================================
// Example 5: Highlighting Slices with Markers
// ============================================================

const example5Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 15,
  boxModel: { padding: 20 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

example5Container.position({
  relativeFrom: example5Container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 700,
  y: 420,
});

artboard.addElement(example5Container);

const title5 = new Text({
  content: "Example 5: Slice Positions",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example5Container.addElement(title5);

const positionChart = new DonutChart({
  data: [
    { label: "North", value: 25 },
    { label: "East", value: 25 },
    { label: "South", value: 25 },
    { label: "West", value: 25 },
  ],
  width: 300,
  height: 300,
  innerRadius: "45%",
  showLabels: false,
  detectRemarkablePoints: false,
  startAngle: -135, // Start at -135° so midpoint of first slice is at -90° (top/North)
  colors: ["#e53935", "#fb8c00", "#43a047", "#1e88e5"],
  cornerRadius: 8, // Add rounded corners
});

example5Container.addElement(positionChart);

// Mark each slice's key positions
positionChart.getAllSlices().forEach((slice, index) => {
  // Outer midpoint marker
  const outerMarker = new Circle({
    radius: 5,
    style: {
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 2,
    },
  });
  
  outerMarker.position({
    relativeFrom: outerMarker.center,
    relativeTo: slice.outerMidpoint,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  artboard.addElement(outerMarker);
  
  // External label
  const externalLabel = new Text({
    content: slice.label,
    fontSize: 14,
    fontWeight: "bold",
    style: { fill: "#1a237e" },
  });
  
  externalLabel.position({
    relativeFrom: externalLabel.center,
    relativeTo: slice.externalLabelPosition,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  artboard.addElement(externalLabel);
  
  // Line from center to outer midpoint
  const sliceCenterPos = positionChart.getCenterPosition();
  const line = new Line({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    style: {
      stroke: "#9e9e9e",
      strokeWidth: "1",
      strokeDasharray: "4 2",
    },
  });
  
  line.position({
    relativeFrom: line.start,
    relativeTo: sliceCenterPos,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  line.end.x = slice.outerMidpoint.x - sliceCenterPos.x;
  line.end.y = slice.outerMidpoint.y - sliceCenterPos.y;
  
  artboard.addElement(line);
});

// Add markers at the actual cardinal directions (top, right, bottom, left)
const chartCenter = positionChart.getCenterPosition();
const outerRadius = 135; // Approximate outer radius

const cardinalDirections = [
  { angle: -90, label: "↑ Top", color: "#e53935" },
  { angle: 0, label: "→ Right", color: "#fb8c00" },
  { angle: 90, label: "↓ Bottom", color: "#43a047" },
  { angle: 180, label: "← Left", color: "#1e88e5" },
];

cardinalDirections.forEach(({ angle, label, color }) => {
  const angleRad = (angle * Math.PI) / 180;
  const distance = outerRadius + 35;
  
  const marker = new Circle({
    radius: 3,
    style: {
      fill: color,
      stroke: "none",
    },
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: chartCenter,
    boxReference: "artboard",
    x: distance * Math.cos(angleRad),
    y: distance * Math.sin(angleRad),
  });
  
  artboard.addElement(marker);
});

return artboard.render();
