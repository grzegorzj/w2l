/**
 * Quadratic Function Intersection Challenge (9th Grade Level - Hard)
 * 
 * PROBLEM:
 * Two functions are given:
 *   f(x) = -x² + 4 (a downward-opening parabola)
 *   g(x) = x - 2 (a linear function)
 * 
 * Tasks:
 * 1. Find the x-coordinates where these functions intersect
 * 2. Determine the y-coordinates at these intersection points
 * 3. Estimate the area of the region bounded by these two curves
 * 
 * This problem is challenging for 9th graders because it requires:
 * - Solving quadratic equations
 * - Understanding function intersections
 * - Visualizing geometric regions
 * - Applying the Pythagorean theorem or geometric estimation
 * - Working with negative coefficients and multiple solution methods
 * 
 * This example demonstrates:
 * - Using FunctionGraph to plot multiple functions
 * - Using Container with vertical/horizontal layouts for explanations
 * - Highlighting intersection regions
 * - Step-by-step solution presentation
 * - LaTeX for mathematical notation
 */

import {
  Artboard,
  Container,
  FunctionGraph,
  Text,
  Latex,
  Circle,
  Line,
  Rect,
} from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#fafafa",
  boxModel: { padding: 40 },
});

// ============================================================
// MAIN LAYOUT: Horizontal container with graph on left, solution on right
// ============================================================

const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 50,
  verticalAlignment: "top",
  boxModel: { padding: 20 },
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 60,
});

artboard.addElement(mainContainer);

// ============================================================
// TITLE
// ============================================================

const title = new Text({
  content: "Challenge Problem: Function Intersection & Area",
  fontSize: 28,
  fontWeight: "bold",
  style: { fill: "#1a237e" },
});

title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(title);

// ============================================================
// LEFT SIDE: GRAPH VISUALIZATION
// ============================================================

const graphContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 20,
  boxModel: { padding: 25 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

mainContainer.addElement(graphContainer);

// Problem statement
const problemTitle = new Text({
  content: "Given Functions:",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#283593" },
});

graphContainer.addElement(problemTitle);

const function1Text = new Latex({
  content: "f(x) = -x^2 + 4",
  fontSize: 16,
  style: { fill: "#d32f2f" },
});

graphContainer.addElement(function1Text);

const function2Text = new Latex({
  content: "g(x) = x - 2",
  fontSize: 16,
  style: { fill: "#1976d2" },
});

graphContainer.addElement(function2Text);

// The actual graph with shaded region
const functionGraph = new FunctionGraph({
  functions: [
    {
      fn: (x) => -x * x + 4,  // Function 0: parabola
      color: "#d32f2f",
      strokeWidth: 3,
    },
    {
      fn: (x) => x - 2,  // Function 1: line
      color: "#1976d2",
      strokeWidth: 3,
    },
  ],
  width: 500,
  height: 450,
  domain: [-4, 4],
  range: [-5, 5],
  showGrid: true,
  showAxes: true,
  axisStyle: {
    stroke: "#424242",
    strokeWidth: 2,
  },
  gridStyle: {
    stroke: "#e0e0e0",
    strokeWidth: 1,
  },
  
  // Shade the region between the two functions
  shadedRegions: [
    {
      topFunction: 0,  // Parabola is on top
      bottomFunction: 1,  // Line is on bottom
      domain: [-3, 2],  // Between intersection points
      style: {
        fill: "#ffd54f",
        fillOpacity: 0.25,
      },
    },
  ],
});

graphContainer.addElement(functionGraph);

// Graph labels
const graphLabel = new Text({
  content: "The shaded region is bounded by both functions",
  fontSize: 13,
  style: { fill: "#616161" },
  fontStyle: "italic",
});

graphContainer.addElement(graphLabel);

// ============================================================
// RIGHT SIDE: STEP-BY-STEP SOLUTION
// ============================================================

const solutionContainer = new Container({
  width: 650,
  height: "auto",
  direction: "vertical",
  spacing: 20,
  boxModel: { padding: 30 },
  style: {
    fill: "#ffffff",
    stroke: "#e0e0e0",
    strokeWidth: 2,
  },
});

mainContainer.addElement(solutionContainer);

// Solution title
const solutionTitle = new Text({
  content: "Step-by-Step Solution",
  fontSize: 20,
  fontWeight: "bold",
  style: { fill: "#283593" },
});

solutionContainer.addElement(solutionTitle);

// ============================================================
// STEP 1: Find intersection points
// ============================================================

const step1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 12,
  boxModel: { padding: 15 },
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

solutionContainer.addElement(step1Container);

const step1Title = new Text({
  content: "Step 1: Find Intersection Points",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2e7d32" },
});

step1Container.addElement(step1Title);

const step1Text1 = new Text({
  content: "Set the functions equal to each other:",
  fontSize: 14,
  style: { fill: "#424242" },
});

step1Container.addElement(step1Text1);

const step1Eq1 = new Latex({
  content: "-x^2 + 4 = x - 2",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#1a237e" },
});

step1Container.addElement(step1Eq1);

const step1Text2 = new Text({
  content: "Rearrange to standard form:",
  fontSize: 14,
  style: { fill: "#424242" },
});

step1Container.addElement(step1Text2);

const step1Eq2 = new Latex({
  content: "-x^2 - x + 6 = 0",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#1a237e" },
});

step1Container.addElement(step1Eq2);

const step1Text3 = new Text({
  content: "Or multiply by -1:",
  fontSize: 14,
  style: { fill: "#424242" },
});

step1Container.addElement(step1Text3);

const step1Eq3 = new Latex({
  content: "x^2 + x - 6 = 0",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#1a237e" },
});

step1Container.addElement(step1Eq3);

// ============================================================
// STEP 2: Solve the quadratic equation
// ============================================================

const step2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 12,
  boxModel: { padding: 15 },
  style: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 2,
  },
});

solutionContainer.addElement(step2Container);

const step2Title = new Text({
  content: "Step 2: Solve Using Factoring or Quadratic Formula",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#1565c0" },
});

step2Container.addElement(step2Title);

const step2Text1 = new Text({
  content: "Method 1: Factoring (find two numbers that multiply to -6 and add to 1)",
  fontSize: 14,
  style: { fill: "#424242" },
});

step2Container.addElement(step2Text1);

const step2Eq1 = new Latex({
  content: "(x + 3)(x - 2) = 0",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#1a237e" },
});

step2Container.addElement(step2Eq1);

const step2Text2 = new Text({
  content: "Therefore:",
  fontSize: 14,
  style: { fill: "#424242" },
});

step2Container.addElement(step2Text2);

const step2Eq2 = new Latex({
  content: "x = -3 \\text{ or } x = 2",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#d32f2f" },
});

step2Container.addElement(step2Eq2);

// ============================================================
// STEP 3: Find y-coordinates
// ============================================================

const step3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 12,
  boxModel: { padding: 15 },
  style: {
    fill: "#fff3e0",
    stroke: "#ff9800",
    strokeWidth: 2,
  },
});

solutionContainer.addElement(step3Container);

const step3Title = new Text({
  content: "Step 3: Calculate Y-Coordinates",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#e65100" },
});

step3Container.addElement(step3Title);

const step3Text1 = new Text({
  content: "Substitute x-values into either function (we'll use g(x) = x - 2):",
  fontSize: 14,
  style: { fill: "#424242" },
});

step3Container.addElement(step3Text1);

// Horizontal layout for the two calculations
const step3CalcsContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  horizontalAlignment: "center",
});

step3Container.addElement(step3CalcsContainer);

// Left calculation
const leftCalc = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 8,
});

step3CalcsContainer.addElement(leftCalc);

const leftCalcEq1 = new Latex({
  content: "x = -3:",
  fontSize: 14,
  style: { fill: "#424242" },
});

leftCalc.addElement(leftCalcEq1);

const leftCalcEq2 = new Latex({
  content: "y = -3 - 2 = -5",
  fontSize: 14,
  style: { fill: "#1a237e" },
});

leftCalc.addElement(leftCalcEq2);

// Right calculation
const rightCalc = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 8,
});

step3CalcsContainer.addElement(rightCalc);

const rightCalcEq1 = new Latex({
  content: "x = 2:",
  fontSize: 14,
  style: { fill: "#424242" },
});

rightCalc.addElement(rightCalcEq1);

const rightCalcEq2 = new Latex({
  content: "y = 2 - 2 = 0",
  fontSize: 14,
  style: { fill: "#1a237e" },
});

rightCalc.addElement(rightCalcEq2);

const step3Result = new Latex({
  content: "\\text{Intersection points: } (-3, -5) \\text{ and } (2, 0)",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#d32f2f", fontWeight: "bold" },
});

step3Container.addElement(step3Result);

// ============================================================
// STEP 4: Estimate the area
// ============================================================

const step4Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 12,
  boxModel: { padding: 15 },
  style: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 2,
  },
});

solutionContainer.addElement(step4Container);

const step4Title = new Text({
  content: "Step 4: Estimate the Area (Challenge!)",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#6a1b9a" },
});

step4Container.addElement(step4Title);

const step4Text1 = new Text({
  content: "The area between the curves can be estimated using geometry:",
  fontSize: 14,
  style: { fill: "#424242" },
});

step4Container.addElement(step4Text1);

const step4Text2 = new Text({
  content: "• Width of region: 2 - (-3) = 5 units",
  fontSize: 14,
  style: { fill: "#424242" },
});

step4Container.addElement(step4Text2);

const step4Text3 = new Text({
  content: "• Maximum height: approximately 4.1 units (at x ≈ -0.5)",
  fontSize: 14,
  style: { fill: "#424242" },
});

step4Container.addElement(step4Text3);

const step4Text4 = new Text({
  content: "• Using the trapezoidal approximation:",
  fontSize: 14,
  style: { fill: "#424242" },
});

step4Container.addElement(step4Text4);

const step4Eq = new Latex({
  content: "\\text{Area} \\approx \\frac{5 \\times 4.1}{2} \\approx 10.25 \\text{ square units}",
  fontSize: 15,
  displayMode: true,
  style: { fill: "#1a237e" },
});

step4Container.addElement(step4Eq);

const step4Note = new Text({
  content: "Note: The exact area is 125/6 ≈ 20.83 square units (using calculus)",
  fontSize: 12,
  style: { fill: "#7b1fa2" },
  fontStyle: "italic",
});

step4Container.addElement(step4Note);

// ============================================================
// Add visual indicators on the graph
// ============================================================

// Calculate intersection points directly (from solving x² + x - 6 = 0)
// We know the intersections are at x = -3 and x = 2
const intersectionPoints = [
  { x: -3, y: -3 - 2 }, // At x=-3: g(-3) = -3 - 2 = -5
  { x: 2, y: 2 - 2 },   // At x=2: g(2) = 2 - 2 = 0
];

console.log("Marking intersection points:", intersectionPoints);

// Create markers for each intersection point
intersectionPoints.forEach((point, idx) => {
  // Use FunctionGraph's API to convert math coordinates to absolute position
  const screenPos = functionGraph.mathToAbsolutePosition(point.x, point.y);
  
  console.log(`Intersection ${idx} at math coords (${point.x}, ${point.y}) -> screen coords`, screenPos);
  
  // Create a circle marker
  const marker = new Circle({
    radius: 8,
    style: {
      fill: "#ff5722",
      stroke: "#bf360c",
      strokeWidth: 3,
    },
  });
  
  marker.position({
    relativeFrom: marker.center,
    relativeTo: screenPos,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });
  
  artboard.addElement(marker);
  
  // Add label
  const label = new Latex({
    content: `(${Math.round(point.x)}, ${Math.round(point.y)})`,
    fontSize: 13,
    style: {
      fill: "#bf360c",
      fontWeight: "bold",
    },
  });
  
  label.position({
    relativeFrom: label.center,
    relativeTo: screenPos,
    x: idx === 0 ? -35 : 25,
    y: -15,
    boxReference: "contentBox",
  });
  
  artboard.addElement(label);
});

return artboard.render();

