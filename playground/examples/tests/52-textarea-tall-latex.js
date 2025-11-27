/**
 * TextArea Example: Tall LaTeX Formulas
 * 
 * Demonstrates TextArea handling of really tall LaTeX formulas like fractions,
 * square roots, and nested expressions. Tests the vertical-align adjustments.
 */

import { Artboard, TextArea, Container, Text } from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

// Main container
const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 30,
  boxModel: { padding: 20 },
  style: {
    fill: "#f8f9fa",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer);

// ========================================
// EXAMPLE 1: Simple Fraction
// ========================================

const example1Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label1 = new Text({
  content: "Example 1: Simple Fractions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea1 = new TextArea({
  content: "The simple fraction $\\frac{a}{b}$ should align nicely with surrounding text on the same line.",
  width: 500,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 2,
  },
  showBaselines: true, // Show red baseline markers for debugging
});

example1Container.addElement(label1);
example1Container.addElement(textArea1);
mainContainer.addElement(example1Container);

// ========================================
// EXAMPLE 2: Complex Fractions
// ========================================

const example2Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label2 = new Text({
  content: "Example 2: Complex Nested Fractions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea2 = new TextArea({
  content: "The quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ is used to solve equations like $ax^2 + bx + c = 0$.",
  width: 550,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#fff3cd",
    stroke: "#ffc107",
    strokeWidth: 2,
  },
  showBaselines: true, // Show baseline markers
});

example2Container.addElement(label2);
example2Container.addElement(textArea2);
mainContainer.addElement(example2Container);

// ========================================
// EXAMPLE 3: Very Tall Fractions (Should Break to New Line)
// ========================================

const example3Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label3 = new Text({
  content: "Example 3: Very Tall - Breaks to Separate Line",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea3 = new TextArea({
  content: "This nested fraction $\\frac{\\frac{a+b}{c+d}}{\\frac{e+f}{g+h}}$ is so tall it gets its own line automatically.",
  width: 450,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 2,
  },
});

example3Container.addElement(label3);
example3Container.addElement(textArea3);
mainContainer.addElement(example3Container);

// ========================================
// EXAMPLE 4: Square Roots
// ========================================

const example4Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label4 = new Text({
  content: "Example 4: Square Roots",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea4 = new TextArea({
  content: "The distance formula $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ calculates the distance between two points.",
  width: 500,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
  showBaselines: true, // Show baseline markers to debug square root alignment
});

example4Container.addElement(label4);
example4Container.addElement(textArea4);
mainContainer.addElement(example4Container);

// ========================================
// EXAMPLE 5: Multiple Fractions in Sequence
// ========================================

const example5Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label5 = new Text({
  content: "Example 5: Multiple Fractions",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea5 = new TextArea({
  content: "Compare $\\frac{1}{2}$ with $\\frac{3}{4}$ and $\\frac{5}{6}$ to see consistent alignment across multiple fractions.",
  width: 500,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#ffebee",
    stroke: "#f44336",
    strokeWidth: 2,
  },
});

example5Container.addElement(label5);
example5Container.addElement(textArea5);
mainContainer.addElement(example5Container);

// ========================================
// EXAMPLE 6: Mixed Heights
// ========================================

const example6Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label6 = new Text({
  content: "Example 6: Mixed Small and Tall",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea6 = new TextArea({
  content: "Small formula $a+b$ next to tall formula $\\frac{x+y}{z}$ and then normal text again shows smart spacing.",
  width: 500,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#fce4ec",
    stroke: "#e91e63",
    strokeWidth: 2,
  },
});

example6Container.addElement(label6);
example6Container.addElement(textArea6);
mainContainer.addElement(example6Container);

// ========================================
// EXAMPLE 7: Summation and Integrals
// ========================================

const example7Container = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label7 = new Text({
  content: "Example 7: Summations and Integrals",
  fontSize: 16,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea7 = new TextArea({
  content: "The sum $\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$ and integral $\\int_{0}^{1} x^2 dx = \\frac{1}{3}$ are fundamental formulas.",
  width: 550,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#e0f2f1",
    stroke: "#009688",
    strokeWidth: 2,
  },
});

example7Container.addElement(label7);
example7Container.addElement(textArea7);
mainContainer.addElement(example7Container);

console.log("=== Tall LaTeX Debug Info ===");
console.log("Example 2 lines:", textArea2.lines);
console.log("Example 3 lines (should break tall formula):", textArea3.lines);

return artboard.render();

