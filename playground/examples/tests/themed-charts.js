/**
 * Themed Charts Demo
 * 
 * This example demonstrates charts styled with the Swiss design theme:
 * - Narrow bars for bar charts
 * - Dimmed color palette
 * - Clean grid lines and axes
 * - Professional aesthetics
 */

import {
  Artboard,
  BarChart,
  Container,
  Text,
} from "w2l";

// Create artboard - automatically themed
const artboard = new Artboard({
  width: 1000,
  height: 700,
});

// Main container
const mainContainer = new Container({
  width: 900,
  height: 600,
  direction: "vertical",
  spacing: 32,
  horizontalAlignment: "center",
  style: {
    fill: "none",
  },
  boxModel: {
    padding: 24,
  },
});

// Title - automatically themed
const title = new Text({
  content: "Themed Charts Example",
  fontSize: "1.5rem", // 2xl
  style: {
    fontWeight: "700",
  },
});
mainContainer.addElement(title);

// Chart container
const chartContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 48,
  style: {
    fill: "none",
  },
});

// Bar Chart 1 - automatically themed with narrow bars!
const barChart1 = new BarChart({
  width: 380,
  height: 300,
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 62 },
    { label: "Mar", value: 38 },
    { label: "Apr", value: 78 },
    { label: "May", value: 55 },
    { label: "Jun", value: 91 },
  ],
  orientation: "vertical",
  barSpacing: 0.4, // Narrow bars
  barColor: "#525252",
  showGrid: true,
  showAxes: true,
  showValueLabels: false,
  chartPadding: {
    top: 16,
    right: 16,
    bottom: 32,
    left: 32,
  },
});

// Chart title
const chartTitle1 = new Text({
  content: "Monthly Revenue",
  fontSize: "0.875rem", // sm
  style: {
    fontWeight: "500",
    fill: "#262626",
  },
});
chartTitle1.position({
  relativeFrom: chartTitle1.bottomLeft,
  relativeTo: barChart1.topLeft,
  y: -8,
});

chartContainer.addElement(barChart1);

// Bar Chart 2 - Stacked with neutral colors
const barChart2 = new BarChart({
  width: 380,
  height: 300,
  series: [
    {
      name: "Product A",
      data: [30, 40, 25, 50, 35, 60],
      color: "#A3A3A3",
    },
    {
      name: "Product B",
      data: [20, 25, 18, 35, 28, 40],
      color: "#525252",
    },
    {
      name: "Product C",
      data: [15, 18, 12, 28, 20, 35],
      color: "#262626",
    },
  ],
  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  stacked: true,
  orientation: "vertical",
  barSpacing: 0.4, // Narrow bars
  showGrid: true,
  showAxes: true,
  chartPadding: {
    top: 16,
    right: 16,
    bottom: 32,
    left: 32,
  },
});

// Chart title 2
const chartTitle2 = new Text({
  content: "Product Sales (Stacked)",
  fontSize: "0.875rem",
  style: {
    fontWeight: "500",
    fill: "#262626",
  },
});
chartTitle2.position({
  relativeFrom: chartTitle2.bottomLeft,
  relativeTo: barChart2.topLeft,
  y: -8,
});

chartContainer.addElement(barChart2);

mainContainer.addElement(chartContainer);

// Add chart titles to artboard (outside containers)
artboard.addElement(chartTitle1);
artboard.addElement(chartTitle2);

// Position main container
artboard.addElement(mainContainer);
mainContainer.position({
  relativeFrom: mainContainer.center,
  relativeTo: artboard.center,
});

return artboard.render();
