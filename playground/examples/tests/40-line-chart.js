/**
 * LineChart Component Example
 * 
 * Demonstrates the LineChart compound component with:
 * - Single series line chart
 * - Multiple series with different styles
 * - Smooth lines vs straight lines
 * - Area fill under the curve
 * - Remarkable points detection and highlighting
 * - Individual data point position retrieval
 * - Custom styling and markers
 */

import {
  Artboard,
  Container,
  LineChart,
  Text,
  Circle,
  Line,
  Arrow,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#fafafa",
  boxModel: { padding: 40 },
});

// ============================================================
// Example 1: Simple Line Chart with Markers
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
  content: "Example 1: Simple Line Chart",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example1Container.addElement(title1);

const simpleLineChart = new LineChart({
  series: [{
    name: "Temperature",
    data: [
      { x: 0, y: 20 },
      { x: 1, y: 22 },
      { x: 2, y: 25 },
      { x: 3, y: 23 },
      { x: 4, y: 27 },
      { x: 5, y: 30 },
      { x: 6, y: 28 },
      { x: 7, y: 26 },
    ],
    color: "#2196f3",
    showMarkers: true,
  }],
  width: 400,
  height: 250,
  showGrid: true,
  showAxes: true,
  showAxisLabels: true,
  detectRemarkablePoints: true,
  showRemarkablePoints: false,
});

example1Container.addElement(simpleLineChart);

// Highlight the maximum point
const maxPoints = simpleLineChart.getRemarkablePoints("maximum");
if (maxPoints.length > 0) {
  const maxPoint = maxPoints[0];
  const maxPos = simpleLineChart.getRemarkablePointPosition(maxPoint);
  
  const maxMarker = new Circle({
    radius: 8,
    style: {
      fill: "#ff5722",
      stroke: "#d84315",
      strokeWidth: 2,
    },
  });
  
  maxMarker.position({
    relativeFrom: maxMarker.center,
    relativeTo: maxPos,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  artboard.addElement(maxMarker);
  
  const maxLabel = new Text({
    content: `Max: ${maxPoint.y.toFixed(1)}°C`,
    fontSize: 12,
    fontWeight: "bold",
    style: { fill: "#d84315" },
  });
  
  maxLabel.position({
    relativeFrom: maxLabel.bottomCenter,
    relativeTo: maxPos,
    boxReference: "artboard",
    x: 0,
    y: -15,
  });
  
  artboard.addElement(maxLabel);
}

// Add description
const desc1 = new Text({
  content: "Single series with markers and maximum point highlighted",
  fontSize: 12,
  style: { fill: "#616161" },
});

example1Container.addElement(desc1);

// ============================================================
// Example 2: Multiple Series
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
  content: "Example 2: Multiple Series",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example2Container.addElement(title2);

const multiSeriesChart = new LineChart({
  series: [
    {
      name: "Product A",
      data: [
        { x: 1, y: 30 },
        { x: 2, y: 35 },
        { x: 3, y: 32 },
        { x: 4, y: 40 },
        { x: 5, y: 45 },
        { x: 6, y: 42 },
      ],
      color: "#2196f3",
      showMarkers: true,
    },
    {
      name: "Product B",
      data: [
        { x: 1, y: 20 },
        { x: 2, y: 25 },
        { x: 3, y: 28 },
        { x: 4, y: 30 },
        { x: 5, y: 33 },
        { x: 6, y: 38 },
      ],
      color: "#f44336",
      showMarkers: true,
    },
    {
      name: "Product C",
      data: [
        { x: 1, y: 15 },
        { x: 2, y: 18 },
        { x: 3, y: 22 },
        { x: 4, y: 25 },
        { x: 5, y: 28 },
        { x: 6, y: 32 },
      ],
      color: "#4caf50",
      showMarkers: true,
    },
  ],
  width: 400,
  height: 250,
  showGrid: true,
  showAxes: true,
  showAxisLabels: true,
  detectRemarkablePoints: false,
});

example2Container.addElement(multiSeriesChart);

// Create a simple legend
const legendContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  horizontalAlignment: "center",
});

example2Container.addElement(legendContainer);

const legendItems = [
  { name: "Product A", color: "#2196f3" },
  { name: "Product B", color: "#f44336" },
  { name: "Product C", color: "#4caf50" },
];

legendItems.forEach((item) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 5,
  });
  
  legendContainer.addElement(legendItem);
  
  const colorMarker = new Circle({
    radius: 5,
    style: { fill: item.color, stroke: "none" },
  });
  
  legendItem.addElement(colorMarker);
  
  const legendText = new Text({
    content: item.name,
    fontSize: 11,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(legendText);
});

// ============================================================
// Example 3: Smooth Lines with Area Fill
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
  content: "Example 3: Smooth Area Chart",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example3Container.addElement(title3);

const smoothAreaChart = new LineChart({
  series: [{
    name: "Revenue",
    data: [
      { x: 0, y: 100 },
      { x: 1, y: 120 },
      { x: 2, y: 115 },
      { x: 3, y: 140 },
      { x: 4, y: 165 },
      { x: 5, y: 155 },
      { x: 6, y: 180 },
      { x: 7, y: 200 },
    ],
    color: "#9c27b0",
    showMarkers: false,
  }],
  width: 400,
  height: 250,
  smoothLines: true,
  fillArea: true,
  showGrid: true,
  showAxes: true,
  showAxisLabels: true,
  lineWidth: 3,
  detectRemarkablePoints: false,
});

example3Container.addElement(smoothAreaChart);

const desc3 = new Text({
  content: "Smooth curves with area fill for trend visualization",
  fontSize: 12,
  style: { fill: "#616161" },
});

example3Container.addElement(desc3);

// ============================================================
// Example 4: Remarkable Points Detection
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
  y: 400,
});

artboard.addElement(example4Container);

const title4 = new Text({
  content: "Example 4: Remarkable Points",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example4Container.addElement(title4);

const remarkableChart = new LineChart({
  series: [{
    name: "Stock Price",
    data: [
      { x: 0, y: 50 },
      { x: 1, y: 55 },
      { x: 2, y: 60 },
      { x: 3, y: 58 },
      { x: 4, y: 65 },
      { x: 5, y: 70 },
      { x: 6, y: 68 },
      { x: 7, y: 72 },
      { x: 8, y: 69 },
      { x: 9, y: 75 },
    ],
    color: "#00bcd4",
    showMarkers: true,
  }],
  width: 400,
  height: 250,
  showGrid: true,
  showAxes: true,
  showAxisLabels: true,
  detectRemarkablePoints: true,
  showRemarkablePoints: false,
});

example4Container.addElement(remarkableChart);

// Manually highlight local maxima and minima
const localMaxima = remarkableChart.getRemarkablePoints("localMaximum");
const localMinima = remarkableChart.getRemarkablePoints("localMinimum");

localMaxima.forEach((point) => {
  const pos = remarkableChart.getRemarkablePointPosition(point);
  
  const marker = new Circle({
    radius: 6,
    style: {
      fill: "#4caf50",
      stroke: "#2e7d32",
      strokeWidth: 2,
    },
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: pos,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  artboard.addElement(marker);
  
  // Add upward arrow
  const arrow = new Text({
    content: "▲",
    fontSize: 12,
    style: { fill: "#2e7d32" },
  });
  
  arrow.position({
    relativeFrom: arrow.center,
    relativeTo: pos,
    boxReference: "artboard",
    x: 0,
    y: -18,
  });
  
  artboard.addElement(arrow);
});

localMinima.forEach((point) => {
  const pos = remarkableChart.getRemarkablePointPosition(point);
  
  const marker = new Circle({
    radius: 6,
    style: {
      fill: "#f44336",
      stroke: "#c62828",
      strokeWidth: 2,
    },
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: pos,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  artboard.addElement(marker);
  
  // Add downward arrow
  const arrow = new Text({
    content: "▼",
    fontSize: 12,
    style: { fill: "#c62828" },
  });
  
  arrow.position({
    relativeFrom: arrow.center,
    relativeTo: pos,
    boxReference: "artboard",
    x: 0,
    y: 18,
  });
  
  artboard.addElement(arrow);
});

const desc4 = new Text({
  content: `Local maxima (▲) and minima (▼) automatically detected`,
  fontSize: 12,
  style: { fill: "#616161" },
});

example4Container.addElement(desc4);

// ============================================================
// Example 5: Sin/Cos Wave with Zero Crossings
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
  y: 400,
});

artboard.addElement(example5Container);

const title5 = new Text({
  content: "Example 5: Wave Functions",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example5Container.addElement(title5);

// Generate sine wave data
const sineData = [];
const cosineData = [];
const steps = 50;

for (let i = 0; i <= steps; i++) {
  const x = (i / steps) * 4 * Math.PI;
  sineData.push({ x: x, y: Math.sin(x) });
  cosineData.push({ x: x, y: Math.cos(x) });
}

const waveChart = new LineChart({
  series: [
    {
      name: "sin(x)",
      data: sineData,
      color: "#e91e63",
      showMarkers: false,
    },
    {
      name: "cos(x)",
      data: cosineData,
      color: "#673ab7",
      showMarkers: false,
    },
  ],
  width: 400,
  height: 250,
  smoothLines: false,
  showGrid: true,
  showAxes: true,
  showAxisLabels: true,
  lineWidth: 2,
  detectRemarkablePoints: true,
  showRemarkablePoints: false,
  minY: -1.5,
  maxY: 1.5,
});

example5Container.addElement(waveChart);

// Highlight zero crossings for sine wave
const crossings = waveChart.getRemarkablePoints("crossing").filter(p => p.seriesIndex === 0);

crossings.forEach((crossing) => {
  const pos = waveChart.getRemarkablePointPosition(crossing);
  
  const marker = new Circle({
    radius: 4,
    style: {
      fill: "#ff9800",
      stroke: "#f57c00",
      strokeWidth: 2,
    },
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: pos,
    boxReference: "artboard",
    x: 0,
    y: 0,
  });
  
  artboard.addElement(marker);
});

// Add legend
const waveLegend = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  horizontalAlignment: "center",
});

example5Container.addElement(waveLegend);

[
  { name: "sin(x)", color: "#e91e63" },
  { name: "cos(x)", color: "#673ab7" },
  { name: "Zero crossings", color: "#ff9800" },
].forEach((item) => {
  const legendItem = new Container({
    width: "auto",
    height: "auto",
    direction: "horizontal",
    spacing: 5,
  });
  
  waveLegend.addElement(legendItem);
  
  const colorMarker = new Circle({
    radius: 5,
    style: { fill: item.color, stroke: "none" },
  });
  
  legendItem.addElement(colorMarker);
  
  const legendText = new Text({
    content: item.name,
    fontSize: 11,
    style: { fill: "#424242" },
  });
  
  legendItem.addElement(legendText);
});

// ============================================================
// Example 6: Data Point Position Access
// ============================================================

const example6Container = new Container({
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

example6Container.position({
  relativeFrom: example6Container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 960,
  y: 400,
});

artboard.addElement(example6Container);

const title6 = new Text({
  content: "Example 6: Custom Annotations",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

example6Container.addElement(title6);

const annotatedChart = new LineChart({
  series: [{
    name: "Growth",
    data: [
      { x: 0, y: 10, label: "Start" },
      { x: 1, y: 15 },
      { x: 2, y: 22 },
      { x: 3, y: 28, label: "Milestone" },
      { x: 4, y: 35 },
      { x: 5, y: 50, label: "Target" },
    ],
    color: "#009688",
    showMarkers: true,
  }],
  width: 400,
  height: 250,
  showGrid: true,
  showAxes: true,
  showAxisLabels: true,
  detectRemarkablePoints: false,
});

example6Container.addElement(annotatedChart);

// Add custom annotations for specific data points
const allPoints = annotatedChart.getSeriesDataPoints(0);

allPoints.forEach((point) => {
  if (point.label) {
    const pos = point.position;
    
    // Highlight the point
    const marker = new Circle({
      radius: 8,
      style: {
        fill: "none",
        stroke: "#009688",
        strokeWidth: 2,
      },
    });
    
    marker.position({
      relativeFrom: marker.center,
      relativeTo: pos,
      boxReference: "artboard",
      x: 0,
      y: 0,
    });
    
    artboard.addElement(marker);
    
    // Add label
    const label = new Text({
      content: point.label,
      fontSize: 12,
      fontWeight: "bold",
      style: { fill: "#00695c" },
    });
    
    label.position({
      relativeFrom: label.bottomCenter,
      relativeTo: pos,
      boxReference: "artboard",
      x: 0,
      y: -15,
    });
    
    artboard.addElement(label);
    
    // Add value
    const valueLabel = new Text({
      content: `${point.y}`,
      fontSize: 10,
      style: { fill: "#00695c" },
    });
    
    valueLabel.position({
      relativeFrom: valueLabel.topCenter,
      relativeTo: pos,
      boxReference: "artboard",
      x: 0,
      y: 15,
    });
    
    artboard.addElement(valueLabel);
  }
});

const desc6 = new Text({
  content: "Using data point positions for custom annotations",
  fontSize: 12,
  style: { fill: "#616161" },
});

example6Container.addElement(desc6);

return artboard.render();

