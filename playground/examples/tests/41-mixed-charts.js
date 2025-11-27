/**
 * Mixed Chart Types Example
 * 
 * Demonstrates the unified Chart component with composable layers:
 * - Bar + Line combinations
 * - Area + Line overlays
 * - Multiple layers sharing the same coordinate system
 * - Custom positioning using dataToAbsolutePosition
 */

import {
  Artboard,
  Container,
  Chart,
  BarLayer,
  LineLayer,
  AreaLayer,
  ScatterLayer,
  Text,
  Circle,
  Arrow,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#fafafa",
  boxModel: { padding: 40 },
});

// ============================================================
// Example 1: Bar + Line (Actual vs Target)
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
  content: "Example 1: Actual Sales vs Target",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example1Container.addElement(title1);

const actualSales = [
  { label: "Q1", value: 45 },
  { label: "Q2", value: 52 },
  { label: "Q3", value: 48 },
  { label: "Q4", value: 61 },
];

const targetLine = [
  { x: 0.5, y: 50 },
  { x: 1.5, y: 50 },
  { x: 2.5, y: 55 },
  { x: 3.5, y: 55 },
];

const barLineChart = new Chart({
  width: 400,
  height: 250,
  layers: [
    new BarLayer({
      id: "sales",
      data: actualSales,
      color: "#2196f3",
    }),
    new LineLayer({
      id: "target",
      data: targetLine,
      color: "#f44336",
      lineWidth: 3,
      showMarkers: true,
      markerSize: 8,
    }),
  ],
  title: "Sales Performance",
  xAxisLabel: "Quarter",
  yAxisLabel: "Sales ($M)",
  showGrid: true,
  showAxes: true,
});

example1Container.addElement(barLineChart);

// Add legend
const legend1 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  horizontalAlignment: "center",
});

example1Container.addElement(legend1);

[
  { name: "Actual", color: "#2196f3" },
  { name: "Target", color: "#f44336" },
].forEach((item) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 5,
  });
  
  legend1.addElement(legendItem);
  
  const marker = new Circle({
    radius: 6,
    style: { fill: item.color, stroke: "none" },
  });
  
  legendItem.addElement(marker);
  
  const label = new Text({
    content: item.name,
    fontSize: 12,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(label);
});

// ============================================================
// Example 2: Multiple Lines with Area Fill
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
  x: 480,
  y: 0,
});

artboard.addElement(example2Container);

const title2 = new Text({
  content: "Example 2: Revenue Forecast",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example2Container.addElement(title2);

const historicalData = [
  { x: 1, y: 100 },
  { x: 2, y: 110 },
  { x: 3, y: 120 },
  { x: 4, y: 115 },
  { x: 5, y: 130 },
  { x: 6, y: 140 },
];

const forecastData = [
  { x: 6, y: 140 },
  { x: 7, y: 145 },
  { x: 8, y: 155 },
  { x: 9, y: 165 },
  { x: 10, y: 170 },
];

const forecastChart = new Chart({
  width: 400,
  height: 250,
  layers: [
    new AreaLayer({
      id: "forecast-area",
      data: forecastData,
      color: "#9c27b0",
      style: { fillOpacity: "0.2" },
      showLine: false,
    }),
    new LineLayer({
      id: "historical",
      data: historicalData,
      color: "#2196f3",
      lineWidth: 3,
      showMarkers: true,
    }),
    new LineLayer({
      id: "forecast",
      data: forecastData,
      color: "#9c27b0",
      lineWidth: 3,
      showMarkers: true,
      lineStyle: { strokeDasharray: "5,5" },
    }),
  ],
  title: "Revenue Projection",
  xAxisLabel: "Month",
  yAxisLabel: "Revenue ($K)",
  showGrid: true,
  showAxes: true,
});

example2Container.addElement(forecastChart);

const desc2 = new Text({
  content: "Area fill shows the trend visually under the forecast line",
  fontSize: 11,
  style: { fill: "#616161" },
});

example2Container.addElement(desc2);

// Add legend
const legend2 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 15,
  horizontalAlignment: "center",
});

example2Container.addElement(legend2);

[
  { name: "Historical", color: "#2196f3" },
  { name: "Forecast (projected)", color: "#9c27b0" },
].forEach((item) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 5,
  });
  
  legend2.addElement(legendItem);
  
  const marker = new Circle({
    radius: 5,
    style: { fill: item.color, stroke: "none" },
  });
  
  legendItem.addElement(marker);
  
  const label = new Text({
    content: item.name,
    fontSize: 11,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(label);
});

// ============================================================
// Example 3: Scatter + Line (Trend)
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
  x: 960,
  y: 0,
});

artboard.addElement(example3Container);

const title3 = new Text({
  content: "Example 3: Data with Trend Line",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example3Container.addElement(title3);

const scatterData = [
  { x: 1, y: 20 },
  { x: 2, y: 23 },
  { x: 3, y: 21 },
  { x: 4, y: 26 },
  { x: 5, y: 28 },
  { x: 6, y: 25 },
  { x: 7, y: 30 },
  { x: 8, y: 32 },
  { x: 9, y: 29 },
  { x: 10, y: 35 },
];

const trendLine = [
  { x: 1, y: 20 },
  { x: 10, y: 34 },
];

const scatterChart = new Chart({
  width: 400,
  height: 250,
  layers: [
    new LineLayer({
      id: "trend",
      data: trendLine,
      color: "#f44336",
      lineWidth: 2,
      showMarkers: false,
      lineStyle: { strokeDasharray: "4,4" },
    }),
    new ScatterLayer({
      id: "data",
      data: scatterData,
      color: "#2196f3",
      pointSize: 8,
    }),
  ],
  title: "Scatter Plot with Trend",
  xAxisLabel: "Time",
  yAxisLabel: "Value",
  showGrid: true,
  showAxes: true,
});

example3Container.addElement(scatterChart);

// Add legend
const legend3 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 15,
  horizontalAlignment: "center",
});

example3Container.addElement(legend3);

[
  { name: "Data Points", color: "#2196f3" },
  { name: "Trend", color: "#f44336" },
].forEach((item) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 5,
  });
  
  legend3.addElement(legendItem);
  
  const marker = new Circle({
    radius: 5,
    style: { fill: item.color, stroke: "none" },
  });
  
  legendItem.addElement(marker);
  
  const label = new Text({
    content: item.name,
    fontSize: 11,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(label);
});

// ============================================================
// Example 4: Highlighting with dataToAbsolutePosition
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
  y: 380,
});

artboard.addElement(example4Container);

const title4 = new Text({
  content: "Example 4: Category Positioning",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example4Container.addElement(title4);

const desc4 = new Text({
  content: "Using getCategoryPosition() to highlight categorical data",
  fontSize: 11,
  style: { fill: "#616161" },
});

example4Container.addElement(desc4);

const performanceData = [
  { label: "Jan", value: 85 },
  { label: "Feb", value: 78 },
  { label: "Mar", value: 92 },
  { label: "Apr", value: 88 },
];

const performanceBarLayer = new BarLayer({
  id: "performance",
  data: performanceData,
  color: "#00bcd4",
});

const annotationChart = new Chart({
  width: 400,
  height: 250,
  layers: [performanceBarLayer],
  title: "Performance Score",
  xAxisLabel: "Month",
  yAxisLabel: "Score",
  showGrid: true,
  showAxes: true,
});

example4Container.addElement(annotationChart);

// Highlight the best performer by getting the category position
const maxValue = Math.max(...performanceData.map(d => d.value));
const bestMonth = performanceData.find(d => d.value === maxValue);

// Get the position of the "Mar" category (the best performer)
const marPosition = annotationChart.getCategoryPosition(bestMonth.label);

if (marPosition) {
  const highlightCircle = new Circle({
    radius: 15,
    style: {
      fill: "none",
      stroke: "#4caf50",
      strokeWidth: 3,
    },
  });

  // Position at the top of the bar
  highlightCircle.position({
    relativeFrom: highlightCircle.center,
    relativeTo: marPosition,
    boxReference: "artboard",
    x: 0,
    y: -8,
  });

  artboard.addElement(highlightCircle);

  const highlightLabel = new Text({
    content: bestMonth.label,
    fontSize: 13,
    fontWeight: "bold",
    style: { fill: "#4caf50" },
  });

  highlightLabel.position({
    relativeFrom: highlightLabel.bottomCenter,
    relativeTo: marPosition,
    boxReference: "artboard",
    x: 0,
    y: -25,
  });

  artboard.addElement(highlightLabel);
}

// Add text annotations using dataToAbsolutePosition for any data point
performanceData.forEach((dataPoint, index) => {
  // Add value labels on top of each bar
  const barPos = annotationChart.getCategoryPosition(dataPoint.label);
  if (barPos) {
    const valueLabel = new Text({
      content: `${dataPoint.value}`,
      fontSize: 11,
      fontWeight: "bold",
      style: { fill: "#424242" },
    });
    
    valueLabel.position({
      relativeFrom: valueLabel.bottomCenter,
      relativeTo: barPos,
      boxReference: "artboard",
      x: 0,
      y: -5,
    });
    
    artboard.addElement(valueLabel);
  }
});

// ============================================================
// Example 5: Complex Multi-Layer Chart
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
  x: 480,
  y: 380,
});

artboard.addElement(example5Container);

const title5 = new Text({
  content: "Example 5: Multi-Layer Analysis",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example5Container.addElement(title5);

const budgetSpent = [
  { label: "Marketing", value: 45 },
  { label: "R&D", value: 60 },
  { label: "Sales", value: 38 },
  { label: "Operations", value: 52 },
];

const efficiencyLine = [
  { x: 0.5, y: 75 },
  { x: 1.5, y: 85 },
  { x: 2.5, y: 70 },
  { x: 3.5, y: 80 },
];

const targetArea = [
  { x: 0, y: 70 },
  { x: 4, y: 70 },
];

const complexChart = new Chart({
  width: 800,
  height: 300,
  layers: [
    new AreaLayer({
      data: targetArea,
      color: "#4caf50",
      style: { fillOpacity: "0.1" },
      showLine: true,
      lineStyle: { strokeDasharray: "4,4" },
      lineWidth: 2,
    }),
    new BarLayer({
      data: budgetSpent,
      color: "#2196f3",
      style: { fillOpacity: "0.7" },
    }),
    new LineLayer({
      data: efficiencyLine,
      color: "#ff9800",
      lineWidth: 3,
      showMarkers: true,
      markerSize: 10,
    }),
  ],
  title: "Budget vs Efficiency Analysis",
  xAxisLabel: "Department",
  yAxisLabel: "Value",
  showGrid: true,
  showAxes: true,
});

example5Container.addElement(complexChart);

// Add comprehensive legend
const legend5 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  horizontalAlignment: "center",
});

example5Container.addElement(legend5);

[
  { name: "Budget Spent ($K)", color: "#2196f3" },
  { name: "Efficiency (%)", color: "#ff9800" },
  { name: "Target (70%)", color: "#4caf50" },
].forEach((item) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 5,
  });
  
  legend5.addElement(legendItem);
  
  const marker = new Circle({
    radius: 6,
    style: { fill: item.color, stroke: "none" },
  });
  
  legendItem.addElement(marker);
  
  const label = new Text({
    content: item.name,
    fontSize: 12,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(label);
});

return artboard.render();

