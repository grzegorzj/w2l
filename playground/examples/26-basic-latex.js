/**
 * Example 26: Basic LaTeX Rendering
 *
 * Demonstrates basic LaTeX/mathematical notation rendering:
 * - Inline and display mode LaTeX
 * - Various mathematical formulas
 * - Positioning LaTeX elements
 */

import { Artboard, LatexText, Text, Rectangle } from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 900, height: 700 },
  backgroundColor: "#f5f5f5",
});

// Title
const title = new Text({
  content: "LaTeX Mathematical Notation",
  fontSize: "32px",
  fontFamily: "Arial",
  fontWeight: "bold",
  name: "title",
  style: {
    fill: "#2c3e50",
  },
});

title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: "0px",
  y: "30px",
});

artboard.addElement(title);

// Example 1: Famous equation
const einstein = new LatexText({
  content: "E = mc^2",
  fontSize: "36px",
  displayMode: "inline",
  name: "einstein-equation",
  debug: true, // Enable debug to see bounding box
});

einstein.position({
  relativeFrom: einstein.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "100px",
});

artboard.addElement(einstein);

const einsteinLabel = new Text({
  content: "Einstein's Mass-Energy Equivalence",
  fontSize: "14px",
  fontFamily: "sans-serif",
  style: {
    fill: "#666",
  },
});

einsteinLabel.position({
  relativeFrom: einsteinLabel.topLeft,
  relativeTo: einstein.bottomLeft,
  x: "0px",
  y: "5px",
});

artboard.addElement(einsteinLabel);

// Example 2: Quadratic formula
const quadratic = new LatexText({
  content: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
  fontSize: "32px",
  displayMode: "display",
  name: "quadratic-formula",
  debug: true, // Enable debug to see bounding box
});

quadratic.position({
  relativeFrom: quadratic.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "200px",
});

artboard.addElement(quadratic);

const quadraticLabel = new Text({
  content: "Quadratic Formula",
  fontSize: "14px",
  fontFamily: "sans-serif",
  style: {
    fill: "#666",
  },
});

quadraticLabel.position({
  relativeFrom: quadraticLabel.topLeft,
  relativeTo: quadratic.bottomLeft,
  x: "0px",
  y: "10px",
});

artboard.addElement(quadraticLabel);

// Example 3: Euler's identity
const euler = new LatexText({
  content: "e^{i\\pi} + 1 = 0",
  fontSize: "36px",
  displayMode: "inline",
  name: "euler-identity",
  debug: true, // Enable debug to see bounding box
});

euler.position({
  relativeFrom: euler.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "350px",
});

artboard.addElement(euler);

const eulerLabel = new Text({
  content: "Euler's Identity",
  fontSize: "14px",
  fontFamily: "sans-serif",
  style: {
    fill: "#666",
  },
});

eulerLabel.position({
  relativeFrom: eulerLabel.topLeft,
  relativeTo: euler.bottomLeft,
  x: "0px",
  y: "5px",
});

artboard.addElement(eulerLabel);

// Example 4: Integral
const integral = new LatexText({
  content: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}",
  fontSize: "28px",
  displayMode: "inline",
  name: "gaussian-integral",
  debug: true, // Enable debug to see bounding box
});

integral.position({
  relativeFrom: integral.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "450px",
});

artboard.addElement(integral);

const integralLabel = new Text({
  content: "Gaussian Integral",
  fontSize: "14px",
  fontFamily: "sans-serif",
  style: {
    fill: "#666",
  },
});

integralLabel.position({
  relativeFrom: integralLabel.topLeft,
  relativeTo: integral.bottomLeft,
  x: "0px",
  y: "5px",
});

artboard.addElement(integralLabel);

// Example 5: Summation
const summation = new LatexText({
  content: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
  fontSize: "28px",
  displayMode: "inline",
  name: "basel-problem",
  debug: true, // Enable debug to see bounding box
});

summation.position({
  relativeFrom: summation.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "550px",
});

artboard.addElement(summation);

const summationLabel = new Text({
  content: "Basel Problem (Solved by Euler)",
  fontSize: "14px",
  fontFamily: "sans-serif",
  style: {
    fill: "#666",
  },
});

summationLabel.position({
  relativeFrom: summationLabel.topLeft,
  relativeTo: summation.bottomLeft,
  x: "0px",
  y: "5px",
});

artboard.addElement(summationLabel);

// Add background boxes for visual organization
const box1 = new Rectangle({
  width: 800,
  height: 80,
  style: {
    fill: "#ffffff",
    stroke: "#ddd",
    strokeWidth: "1px",
  },
});

box1.position({
  relativeFrom: box1.topLeft,
  relativeTo: artboard.topLeft,
  x: "40px",
  y: "90px",
});

box1.zIndex = -1;
artboard.addElement(box1);

// Display the result
artboard.render();

