import {
  Artboard,
  FunctionGraph,
  Text,
  Circle,
  GridLayout,
  VStack,
} from "w2l";

/**
 * Example 40: Function Graphs
 *
 * Demonstrates the FunctionGraph component with various mathematical functions,
 * remarkable points detection, and comprehensive graphing features.
 * Uses GridLayout and VStack for organized presentation.
 */

// Create auto-sizing artboard that fits to content
const artboard = new Artboard({
  size: { width: 1400, height: 1400 },
  autoAdjust: true,
  padding: "40px",
  backgroundColor: "#ffffff",
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
  relativeTo: artboard.topLeft,
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
  align: "center",
});

description.position({
  relativeFrom: description.topLeft,
  relativeTo: mainTitle.bottomLeft,
  x: 0,
  y: 10,
});

artboard.addElement(description);

// Create grid layout for organizing graphs
const grid = new GridLayout({
  columns: 3,
  rows: 3,
  cellWidth: 400,
  cellHeight: 380,
  columnGap: 30,
  rowGap: 30,
  horizontalAlign: "center",
  verticalAlign: "center",
  debugShowCells: true, // Show cell boundaries for debugging
  style: {
    fill: "transparent",
    stroke: "#ff0000",
    strokeWidth: "2px",
    strokeDasharray: "5,5",
  },
});

grid.position({
  relativeFrom: grid.topLeft,
  relativeTo: description.bottomLeft,
  x: 0,
  y: 30,
});

artboard.addElement(grid);

// Example 1: Quadratic Function
const quadraticGraph = new FunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    label: "f(x) = x² - 4",
    color: "#e74c3c",
  },
  width: 360,
  height: 280,
  domain: [-5, 5],
  name: "QuadraticGraph",
});

const quadraticStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const quadraticTitle = new Text({
  content: "Quadratic Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

quadraticStack.addElement(quadraticTitle);
quadraticStack.addElement(quadraticGraph);

// Add annotation about roots
const quadRoots = quadraticGraph.getRemarkablePoints("root");
if (quadRoots.length > 0) {
  const rootNote = new Text({
    content: `Roots: x = ${quadRoots.map(r => r.x.toFixed(2)).join(", ")}`,
    fontSize: 11,
    style: { fill: "#c0392b" },
  });
  quadraticStack.addElement(rootNote);
}

grid.addElement(quadraticStack);

// Example 2: Trigonometric Functions (with auto-calculated grid spacing)
const trigGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.sin(x),
      label: "sin(x)",
      color: "#3498db",
    },
    {
      fn: (x) => Math.cos(x),
      label: "cos(x)",
      color: "#2ecc71",
    },
  ],
  width: 360,
  height: 280,
  domain: [-2 * Math.PI, 2 * Math.PI],
  range: [-1.5, 1.5],
  // gridSpacing auto-calculated for optimal label density
  name: "TrigGraph",
});

const trigStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const trigTitle = new Text({
  content: "Trigonometric Functions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

trigStack.addElement(trigTitle);
trigStack.addElement(trigGraph);

grid.addElement(trigStack);

// Example 3: Cubic Polynomial
const cubicGraph = new FunctionGraph({
  functions: {
    fn: (x) => (x + 3) * (x - 1) * (x - 4) / 4,
    label: "f(x) = (x+3)(x-1)(x-4)/4",
    color: "#e67e22",
  },
  width: 360,
  height: 280,
  domain: [-5, 6],
  name: "CubicGraph",
});

const cubicStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const cubicTitle = new Text({
  content: "Cubic Polynomial",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

cubicStack.addElement(cubicTitle);
cubicStack.addElement(cubicGraph);

// Add extrema info
const maxima = cubicGraph.getRemarkablePoints("local-maximum");
const minima = cubicGraph.getRemarkablePoints("local-minimum");
if (maxima.length > 0 || minima.length > 0) {
  const extremaNote = new Text({
    content: `Extrema detected: ${maxima.length} max, ${minima.length} min`,
    fontSize: 11,
    style: { fill: "#e67e22" },
  });
  cubicStack.addElement(extremaNote);
}

grid.addElement(cubicStack);

// Example 4: Exponential and Logarithmic
const expLogGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.exp(x / 2),
      label: "e^(x/2)",
      color: "#1abc9c",
    },
    {
      fn: (x) => Math.log(x),
      label: "ln(x)",
      color: "#34495e",
    },
  ],
  width: 360,
  height: 280,
  domain: [0.1, 5],
  range: [-2, 6],
  name: "ExpLogGraph",
});

const expLogStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const expLogTitle = new Text({
  content: "Exponential & Logarithmic",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

expLogStack.addElement(expLogTitle);
expLogStack.addElement(expLogGraph);

grid.addElement(expLogStack);

// Example 5: Rational Function
const rationalGraph = new FunctionGraph({
  functions: {
    fn: (x) => 1 / (x - 2),
    label: "f(x) = 1/(x-2)",
    color: "#e84393",
  },
  width: 360,
  height: 280,
  domain: [-3, 7],
  range: [-5, 5],
  name: "RationalGraph",
});

const rationalStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const rationalTitle = new Text({
  content: "Rational Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

rationalStack.addElement(rationalTitle);
rationalStack.addElement(rationalGraph);

// Add asymptote info
const asymptotes = rationalGraph.getRemarkablePoints("vertical-asymptote");
if (asymptotes.length > 0) {
  const asymNote = new Text({
    content: `Asymptote at x = ${asymptotes[0].x.toFixed(1)}`,
    fontSize: 11,
    style: { fill: "#d63031" },
  });
  rationalStack.addElement(asymNote);
}

grid.addElement(rationalStack);

// Example 6: Piecewise Function
const piecewiseGraph = new FunctionGraph({
  functions: {
    fn: (x) => {
      if (x < -1) return x + 2;
      if (x < 1) return x * x;
      return 2 - x;
    },
    label: "Piecewise",
    color: "#6c5ce7",
  },
  width: 360,
  height: 280,
  domain: [-4, 4],
  name: "PiecewiseGraph",
});

const piecewiseStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const piecewiseTitle = new Text({
  content: "Piecewise Function",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

piecewiseStack.addElement(piecewiseTitle);
piecewiseStack.addElement(piecewiseGraph);

grid.addElement(piecewiseStack);

// Example 7: Absolute Value
const absValueGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => Math.abs(x),
      label: "|x|",
      color: "#00b894",
    },
    {
      fn: (x) => -Math.abs(x - 2) + 3,
      label: "-|x-2|+3",
      color: "#ff7675",
    },
  ],
  width: 360,
  height: 280,
  domain: [-5, 7],
  name: "AbsValueGraph",
});

const absValueStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const absValueTitle = new Text({
  content: "Absolute Value Functions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

absValueStack.addElement(absValueTitle);
absValueStack.addElement(absValueGraph);

grid.addElement(absValueStack);

// Example 8: Quintic Polynomial
const quinticGraph = new FunctionGraph({
  functions: {
    fn: (x) => 0.01 * x ** 5 - 0.1 * x ** 3 + x,
    label: "f(x) = 0.01x⁵ - 0.1x³ + x",
    color: "#fd79a8",
  },
  width: 360,
  height: 280,
  domain: [-5, 5],
  name: "QuinticGraph",
});

const quinticStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const quinticTitle = new Text({
  content: "Quintic Polynomial",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

quinticStack.addElement(quinticTitle);
quinticStack.addElement(quinticGraph);

// Add inflection point info
const inflectionPoints = quinticGraph.getRemarkablePoints("inflection-point");
if (inflectionPoints.length > 0) {
  const inflectionNote = new Text({
    content: `${inflectionPoints.length} inflection points detected`,
    fontSize: 11,
    style: { fill: "#fd79a8" },
  });
  quinticStack.addElement(inflectionNote);
}

grid.addElement(quinticStack);

// Example 9: Sine Wave with Higher Frequency
const sineWaveGraph = new FunctionGraph({
  functions: {
    fn: (x) => Math.sin(2 * x) * Math.exp(-x / 5),
    label: "f(x) = sin(2x)·e^(-x/5)",
    color: "#a29bfe",
  },
  width: 360,
  height: 280,
  domain: [0, 10],
  name: "SineWaveGraph",
});

const sineWaveStack = new VStack({
  spacing: 10,
  style: {
    fill: "transparent",
    stroke: "#0000ff",
    strokeWidth: "1px",
    strokeDasharray: "3,3",
  },
});

const sineWaveTitle = new Text({
  content: "Damped Oscillation",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

sineWaveStack.addElement(sineWaveTitle);
sineWaveStack.addElement(sineWaveGraph);

const dampedNote = new Text({
  content: "Exponentially damped sine wave",
  fontSize: 11,
  style: { fill: "#6c5ce7" },
});
sineWaveStack.addElement(dampedNote);

grid.addElement(sineWaveStack);

// Demonstrate label coordinate retrieval - add a small annotation
// to show we can get coordinates of specific labels
const demoAnnotation = new Text({
  content: "📍 Label coordinate demo",
  fontSize: 10,
  style: { fill: "#e74c3c" },
});

// Get the position of x=0 label from the quadratic graph
const x0Label = quadraticGraph.getLabelPosition('y', 0);
if (x0Label) {
  // Position relative to the quadratic graph
  demoAnnotation.position({
    relativeFrom: demoAnnotation.leftCenter,
    relativeTo: quadraticGraph.topLeft,
    x: x0Label.x + 15,
    y: x0Label.y,
  });
  artboard.addElement(demoAnnotation);
}

artboard.render();
