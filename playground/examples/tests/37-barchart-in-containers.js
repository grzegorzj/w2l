/**
 * BarChart Container Positioning Test
 *
 * Tests that BarCharts position correctly within Container layouts.
 * This verifies that the positioning inheritance from Rectangle works properly.
 */

import {
  Artboard,
  BarChart,
  Container,
  Text,
  Grid,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#f5f5f5",
  boxModel: { padding: 30 },
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
  content: "BarChart Positioning Tests",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

mainContainer.addElement(title);

const subtitle = new Text({
  content: "Verifying that BarCharts respect Container positioning",
  fontSize: 13,
  style: { fill: "#616161" },
});

mainContainer.addElement(subtitle);

// ============================================================
// Test 1: Simple Container with Padding
// ============================================================

const test1Title = new Text({
  content: "Test 1: BarChart in Container with Padding",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(test1Title);

const paddedContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
  boxModel: { padding: 20 },
  style: {
    fill: "#e3f2fd",
    stroke: "#1976d2",
    strokeWidth: "2",
  },
});

mainContainer.addElement(paddedContainer);

const containerLabel = new Text({
  content: "Container with 20px padding (blue border)",
  fontSize: 12,
  style: { fill: "#1565c0" },
});

paddedContainer.addElement(containerLabel);

const chart1 = new BarChart({
  data: [
    { label: "A", value: 30 },
    { label: "B", value: 45 },
    { label: "C", value: 25 },
    { label: "D", value: 55 },
  ],
  orientation: "vertical",
  width: 400,
  height: 250,
  barColor: "#2196f3",
  showGrid: true,
  showAxes: true,
});

paddedContainer.addElement(chart1);

// ============================================================
// Test 2: Multiple Charts in Horizontal Container
// ============================================================

const test2Title = new Text({
  content: "Test 2: Multiple Charts in Horizontal Layout",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(test2Title);

const horizontalContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  boxModel: { padding: 15 },
  style: {
    fill: "#f3e5f5",
    stroke: "#7b1fa2",
    strokeWidth: "2",
  },
});

mainContainer.addElement(horizontalContainer);

const chart2a = new BarChart({
  data: [
    { label: "Q1", value: 120 },
    { label: "Q2", value: 150 },
    { label: "Q3", value: 135 },
  ],
  orientation: "vertical",
  width: 280,
  height: 220,
  barColor: "#9c27b0",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  chartPadding: {
    top: 20,
    right: 20,
    bottom: 35,
    left: 50,
  },
});

horizontalContainer.addElement(chart2a);

const chart2b = new BarChart({
  data: [
    { label: "Jan", value: 85 },
    { label: "Feb", value: 92 },
    { label: "Mar", value: 78 },
  ],
  orientation: "vertical",
  width: 280,
  height: 220,
  barColor: "#4caf50",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  chartPadding: {
    top: 20,
    right: 20,
    bottom: 35,
    left: 50,
  },
});

horizontalContainer.addElement(chart2b);

// ============================================================
// Test 3: Charts in Grid
// ============================================================

const test3Title = new Text({
  content: "Test 3: Charts in 2x2 Grid",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(test3Title);

const grid = new Grid({
  rows: 2,
  columns: 2,
  width: 800,
  height: 480,
  cellWidth: 390,
  cellHeight: 230,
  gutter: 20,
  boxModel: { padding: 15 },
  style: {
    fill: "#fff3e0",
    stroke: "#e65100",
    strokeWidth: "2",
  },
});

mainContainer.addElement(grid.container);

// Grid cell 0,0
const gridChart1 = new BarChart({
  data: [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 15 },
    { label: "Wed", value: 18 },
  ],
  orientation: "vertical",
  width: 350,
  height: 180,
  barColor: "#ff5722",
  showGrid: false,
  showAxes: true,
  showValueLabels: true,
  chartPadding: { top: 15, right: 15, bottom: 30, left: 40 },
});

gridChart1.position({
  relativeFrom: gridChart1.center,
  relativeTo: grid.getCell(0, 0).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(0, 0).addElement(gridChart1);

// Grid cell 0,1
const gridChart2 = new BarChart({
  data: [
    { label: "Red", value: 8 },
    { label: "Blue", value: 12 },
    { label: "Green", value: 6 },
  ],
  orientation: "horizontal",
  width: 350,
  height: 180,
  barColor: "#03a9f4",
  showGrid: false,
  showAxes: true,
  showCategoryLabels: true,
  chartPadding: { top: 15, right: 60, bottom: 30, left: 80 },
});

gridChart2.position({
  relativeFrom: gridChart2.center,
  relativeTo: grid.getCell(0, 1).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(0, 1).addElement(gridChart2);

// Grid cell 1,0
const gridChart3 = new BarChart({
  data: [
    { label: "X", value: 42, color: "#e91e63" },
    { label: "Y", value: 35, color: "#9c27b0" },
    { label: "Z", value: 50, color: "#3f51b5" },
  ],
  orientation: "vertical",
  width: 350,
  height: 180,
  showGrid: true,
  showAxes: true,
  chartPadding: { top: 15, right: 15, bottom: 30, left: 40 },
});

gridChart3.position({
  relativeFrom: gridChart3.center,
  relativeTo: grid.getCell(1, 0).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(1, 0).addElement(gridChart3);

// Grid cell 1,1
const gridChart4 = new BarChart({
  data: [
    { label: "Low", value: 15 },
    { label: "Medium", value: 40 },
    { label: "High", value: 25 },
  ],
  orientation: "horizontal",
  width: 350,
  height: 180,
  barColor: "#8bc34a",
  showGrid: true,
  showAxes: true,
  showCategoryLabels: true,
  chartPadding: { top: 15, right: 60, bottom: 30, left: 80 },
});

gridChart4.position({
  relativeFrom: gridChart4.center,
  relativeTo: grid.getCell(1, 1).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(1, 1).addElement(gridChart4);

// ============================================================
// Test 4: Nested Containers
// ============================================================

const test4Title = new Text({
  content: "Test 4: Chart in Nested Containers",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#424242" },
});

mainContainer.addElement(test4Title);

const outerContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
  boxModel: { padding: 20 },
  style: {
    fill: "#e8eaf6",
    stroke: "#3f51b5",
    strokeWidth: "3",
  },
});

mainContainer.addElement(outerContainer);

const outerLabel = new Text({
  content: "Outer Container (thick blue border, 20px padding)",
  fontSize: 11,
  style: { fill: "#283593" },
});

outerContainer.addElement(outerLabel);

const innerContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 8,
  boxModel: { padding: 15 },
  style: {
    fill: "#fce4ec",
    stroke: "#c2185b",
    strokeWidth: "2",
  },
});

outerContainer.addElement(innerContainer);

const innerLabel = new Text({
  content: "Inner Container (pink border, 15px padding)",
  fontSize: 11,
  style: { fill: "#880e4f" },
});

innerContainer.addElement(innerLabel);

const nestedChart = new BarChart({
  data: [
    { label: "Alpha", value: 65 },
    { label: "Beta", value: 78 },
    { label: "Gamma", value: 52 },
    { label: "Delta", value: 89 },
  ],
  orientation: "vertical",
  width: 500,
  height: 250,
  barColor: "#e91e63",
  showGrid: true,
  showAxes: true,
  showValueLabels: true,
});

innerContainer.addElement(nestedChart);

return artboard.render();

