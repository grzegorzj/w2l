/**
 * Example 15: Function Graphs (New System)
 *
 * Demonstrates the FunctionGraph component with various mathematical functions,
 * remarkable points detection, and comprehensive graphing features.
 * Uses Columns layout for organized presentation.
 */

import {
  Artboard,
  FunctionGraph,
  Text,
  Circle,
  Columns,
  Container,
} from "w2l";

// Create auto-sizing artboard that fits to content
const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

// Main title
const mainTitle = new Text({
  content: "Function Graph Examples - K-12 & University Mathematics",
  fontSize: 24,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

mainTitle.position({
  relativeFrom: mainTitle.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainTitle);

// Description
const description = new Text({
  content:
    "Demonstrating function plotting with automatic remarkable point detection (roots, extrema, inflection points, asymptotes)",
  fontSize: 12,
  style: { fill: "#7f8c8d" },
  maxWidth: 1200,
  textAlign: "center",
});

description.position({
  relativeFrom: description.topLeft,
  relativeTo: mainTitle.bottomLeft,
  x: 0,
  y: 10,
});

artboard.addElement(description);

// Create a 3-column layout for organizing graphs
const columns = new Columns({
  count: 3,
  columnWidth: 400,
  height: "auto",
  gutter: 30,
  verticalAlignment: "top",
  horizontalAlignment: "center",
  columnSpacing: 20,
  boxModel: { padding: 20 },
});

columns.container.position({
  relativeFrom: columns.container.topLeft,
  relativeTo: description.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(columns.container);

// Example 1: Quadratic Function
const quadraticTitle = new Text({
  content: "Quadratic Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const quadraticGraph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "#e74c3c",
  },
  width: 360,
  height: 280,
  domain: [-5, 5],
  debug: false,
});

const quadRoots = quadraticGraph.getRemarkablePoints("root");
const quadNote = new Text({
  content: quadRoots.length > 0 
    ? `Roots: x = ${quadRoots.map(r => r.x.toFixed(2)).join(", ")}`
    : "No roots found",
  fontSize: 11,
  style: { fill: "#c0392b" },
});

// Create vertical container for column 1
const col1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col1Container.addElement(quadraticTitle);
col1Container.addElement(quadraticGraph);
col1Container.addElement(quadNote);

columns.getColumn(0).addElement(col1Container);

// Example 2: Trigonometric Functions
const trigTitle = new Text({
  content: "Trigonometric Functions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const trigGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.sin(x),
      color: "#3498db",
    },
    {
      fn: (x) => Math.cos(x),
      color: "#2ecc71",
    },
  ],
  width: 360,
  height: 280,
  domain: [-2 * Math.PI, 2 * Math.PI],
  range: [-1.5, 1.5],
  debug: false,
});

const col2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col2Container.addElement(trigTitle);
col2Container.addElement(trigGraph);

columns.getColumn(1).addElement(col2Container);

// Example 3: Cubic Polynomial
const cubicTitle = new Text({
  content: "Cubic Polynomial",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const cubicGraph = new FunctionGraph({
  functions: {
    fn: (x) => (x + 3) * (x - 1) * (x - 4) / 4,
    color: "#e67e22",
  },
  width: 360,
  height: 280,
  domain: [-5, 6],
  debug: false,
});

// Add extrema info
const maxima = cubicGraph.getRemarkablePoints("local-maximum");
const minima = cubicGraph.getRemarkablePoints("local-minimum");
const extremaNote = new Text({
  content: `Extrema detected: ${maxima.length} max, ${minima.length} min`,
  fontSize: 11,
  style: { fill: "#e67e22" },
});

const col3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col3Container.addElement(cubicTitle);
col3Container.addElement(cubicGraph);
col3Container.addElement(extremaNote);

columns.getColumn(2).addElement(col3Container);

// Row 2: More examples

// Example 4: Exponential and Logarithmic
const expLogTitle = new Text({
  content: "Exponential & Logarithmic",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const expLogGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.exp(x / 2),
      color: "#1abc9c",
    },
    {
      fn: (x) => Math.log(x),
      color: "#34495e",
    },
  ],
  width: 360,
  height: 280,
  domain: [0.1, 5],
  range: [-2, 6],
  debug: false,
});

const col4Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col4Container.addElement(expLogTitle);
col4Container.addElement(expLogGraph);

columns.getColumn(0).addElement(col4Container);

// Example 5: Rational Function
const rationalTitle = new Text({
  content: "Rational Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const rationalGraph = new FunctionGraph({
  functions: {
    fn: (x) => 1 / (x - 2),
    color: "#e84393",
  },
  width: 360,
  height: 280,
  domain: [-3, 7],
  range: [-5, 5],
  debug: false,
});

// Add asymptote info
const asymptotes = rationalGraph.getRemarkablePoints("vertical-asymptote");
const asymNote = new Text({
  content: asymptotes.length > 0 
    ? `Asymptote at x = ${asymptotes[0].x.toFixed(1)}`
    : "No asymptotes found",
  fontSize: 11,
  style: { fill: "#d63031" },
});

const col5Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col5Container.addElement(rationalTitle);
col5Container.addElement(rationalGraph);
col5Container.addElement(asymNote);

columns.getColumn(1).addElement(col5Container);

// Example 6: Piecewise Function
const piecewiseTitle = new Text({
  content: "Piecewise Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const piecewiseGraph = new FunctionGraph({
  functions: {
    fn: (x) => {
      if (x < -1) return x + 2;
      if (x < 1) return x * x;
      return 2 - x;
    },
    color: "#6c5ce7",
  },
  width: 360,
  height: 280,
  domain: [-4, 4],
  debug: false,
});

const col6Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col6Container.addElement(piecewiseTitle);
col6Container.addElement(piecewiseGraph);

columns.getColumn(2).addElement(col6Container);

// Row 3: Final examples

// Example 7: Absolute Value
const absValueTitle = new Text({
  content: "Absolute Value Functions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const absValueGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.abs(x),
      color: "#00b894",
    },
    {
      fn: (x) => -Math.abs(x - 2) + 3,
      color: "#ff7675",
    },
  ],
  width: 360,
  height: 280,
  domain: [-5, 7],
  debug: false,
});

const col7Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col7Container.addElement(absValueTitle);
col7Container.addElement(absValueGraph);

columns.getColumn(0).addElement(col7Container);

// Example 8: Quintic Polynomial
const quinticTitle = new Text({
  content: "Quintic Polynomial",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const quinticGraph = new FunctionGraph({
  functions: {
    fn: (x) => 0.01 * x ** 5 - 0.1 * x ** 3 + x,
    color: "#fd79a8",
  },
  width: 360,
  height: 280,
  domain: [-5, 5],
  debug: false,
});

// Add inflection point info
const inflectionPoints = quinticGraph.getRemarkablePoints("inflection-point");
const inflectionNote = new Text({
  content: `${inflectionPoints.length} inflection points detected`,
  fontSize: 11,
  style: { fill: "#fd79a8" },
});

const col8Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col8Container.addElement(quinticTitle);
col8Container.addElement(quinticGraph);
col8Container.addElement(inflectionNote);

columns.getColumn(1).addElement(col8Container);

// Example 9: Damped Oscillation
const sineWaveTitle = new Text({
  content: "Damped Oscillation",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const sineWaveGraph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(2 * x) * Math.exp(-x / 5),
    color: "#a29bfe",
  },
  width: 360,
  height: 280,
  domain: [0, 10],
  debug: false,
});

const dampedNote = new Text({
  content: "Exponentially damped sine wave",
  fontSize: 11,
  style: { fill: "#6c5ce7" },
});

const col9Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

col9Container.addElement(sineWaveTitle);
col9Container.addElement(sineWaveGraph);
col9Container.addElement(dampedNote);

columns.getColumn(2).addElement(col9Container);

return artboard.render();

