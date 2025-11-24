/**
 * Image Fill Patterns Example
 *
 * Demonstrates how to use SVG patterns to fill complex shapes with images.
 * This technique works with triangles, polygons, and any other shape.
 */

import {
  Artboard,
  Triangle,
  RegularPolygon,
  Rectangle,
  Text,
} from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 1200, height: 800 },
  padding: "40px",
  style: {
    fill: "#ffffff",
  },
});

// Title
const title = new Text({
  content: "Image Pattern Fills for Complex Shapes",
  style: {
    fontSize: "32px",
    fontWeight: "bold",
    fill: "#2c3e50",
    fontFamily: "Arial, sans-serif",
  },
});
title.position({
  relativeFrom: title.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 20,
});
artboard.addElement(title);

const subtitle = new Text({
  content: "Using SVG <pattern> elements to fill shapes with images",
  style: {
    fontSize: "16px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
    fontStyle: "italic",
  },
});
subtitle.position({
  relativeFrom: subtitle.topCenter,
  relativeTo: title.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(subtitle);

// --- GRADIENT FILLS (as a substitute for demo purposes) ---
const section1Title = new Text({
  content: "1. Gradient Fills (Available Now)",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
section1Title.position({
  relativeFrom: section1Title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 120,
});
artboard.addElement(section1Title);

// Triangle with gradient
const gradientTriangle1 = new Triangle({
  type: "equilateral",
  a: 150,
  style: {
    fill: "url(#blueGradient)",
    stroke: "#2980b9",
    strokeWidth: 3,
  },
});
gradientTriangle1.position({
  relativeFrom: gradientTriangle1.center,
  relativeTo: { x: "150px", y: "250px" },
  x: 0,
  y: 0,
});
artboard.addElement(gradientTriangle1);

const label1 = new Text({
  content: "Triangle",
  style: {
    fontSize: "14px",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
    textAnchor: "middle",
  },
});
label1.position({
  relativeFrom: label1.topCenter,
  relativeTo: gradientTriangle1.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(label1);

// Pentagon with gradient
const gradientPentagon = new RegularPolygon({
  sides: 5,
  radius: 70,
  style: {
    fill: "url(#redGradient)",
    stroke: "#c0392b",
    strokeWidth: 3,
  },
});
gradientPentagon.position({
  relativeFrom: gradientPentagon.center,
  relativeTo: { x: "380px", y: "250px" },
  x: 0,
  y: 0,
});
artboard.addElement(gradientPentagon);

const label2 = new Text({
  content: "Pentagon",
  style: {
    fontSize: "14px",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
    textAnchor: "middle",
  },
});
label2.position({
  relativeFrom: label2.topCenter,
  relativeTo: gradientPentagon.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(label2);

// Hexagon with gradient
const gradientHexagon = new RegularPolygon({
  sides: 6,
  radius: 70,
  style: {
    fill: "url(#greenGradient)",
    stroke: "#27ae60",
    strokeWidth: 3,
  },
});
gradientHexagon.position({
  relativeFrom: gradientHexagon.center,
  relativeTo: { x: "580px", y: "250px" },
  x: 0,
  y: 0,
});
artboard.addElement(gradientHexagon);

const label3 = new Text({
  content: "Hexagon",
  style: {
    fontSize: "14px",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
    textAnchor: "middle",
  },
});
label3.position({
  relativeFrom: label3.topCenter,
  relativeTo: gradientHexagon.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(label3);

// Octagon with gradient
const gradientOctagon = new RegularPolygon({
  sides: 8,
  radius: 70,
  style: {
    fill: "url(#purpleGradient)",
    stroke: "#8e44ad",
    strokeWidth: 3,
  },
});
gradientOctagon.position({
  relativeFrom: gradientOctagon.center,
  relativeTo: { x: "780px", y: "250px" },
  x: 0,
  y: 0,
});
artboard.addElement(gradientOctagon);

const label4 = new Text({
  content: "Octagon",
  style: {
    fontSize: "14px",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
    textAnchor: "middle",
  },
});
label4.position({
  relativeFrom: label4.topCenter,
  relativeTo: gradientOctagon.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(label4);

// --- HOW TO USE IMAGE PATTERNS ---
const section2Title = new Text({
  content: "2. Image Pattern Fills (How To)",
  style: {
    fontSize: "22px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
section2Title.position({
  relativeFrom: section2Title.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 380,
});
artboard.addElement(section2Title);

// Code example box
const codeBox = new Rectangle({
  width: 1000,
  height: 320,
  cornerRadius: 8,
  style: {
    fill: "#f8f9fa",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});
codeBox.position({
  relativeFrom: codeBox.topLeft,
  relativeTo: section2Title.bottomLeft,
  x: 0,
  y: 20,
});
artboard.addElement(codeBox);

const codeText = new Text({
  content: `// Step 1: Define a pattern in SVG <defs>
const imagePattern = \`
  <pattern id="myImagePattern" patternUnits="userSpaceOnUse" 
           width="200" height="200">
    <image href="your-image.jpg" width="200" height="200"/>
  </pattern>
\`;

// Step 2: Use the pattern in a shape's style
const triangle = new Triangle({
  type: "equilateral",
  a: 200,
  style: {
    fill: "url(#myImagePattern)",  // Reference the pattern
    stroke: "#2c3e50",
    strokeWidth: 2
  }
});

// Step 3: Inject the pattern into the SVG
const baseSvg = artboard.render();
const svgWithPattern = baseSvg.replace(
  /<svg([^>]*)>/,
  \`<svg$1><defs>\${imagePattern}</defs>\`
);

// This works for ANY shape: triangles, polygons, circles, etc!`,
  style: {
    fontSize: "12px",
    fill: "#2c3e50",
    fontFamily: "Consolas, Monaco, monospace",
    whiteSpace: "pre",
  },
  maxWidth: 980,
});
codeText.position({
  relativeFrom: codeText.topLeft,
  relativeTo: codeBox.topLeft,
  x: 15,
  y: 15,
});
artboard.addElement(codeText);

// --- NOTES ---
const notesTitle = new Text({
  content: "💡 Notes:",
  style: {
    fontSize: "18px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
notesTitle.position({
  relativeFrom: notesTitle.topLeft,
  relativeTo: codeBox.bottomLeft,
  x: 0,
  y: 30,
});
artboard.addElement(notesTitle);

const notes = new Text({
  content: `• Pattern fills work with any SVG shape - triangles, polygons, paths, etc.
• Adjust patternUnits and patternTransform for different tiling behaviors
• Use patternTransform="rotate(45)" to rotate the pattern
• Set preserveAspectRatio on the <image> to control scaling
• Multiple patterns can be defined and referenced by different shapes
• This technique is standard SVG - works in all modern browsers`,
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
  maxWidth: 1000,
});
notes.position({
  relativeFrom: notes.topLeft,
  relativeTo: notesTitle.bottomLeft,
  x: 0,
  y: 10,
});
artboard.addElement(notes);

// Define gradients (we'll use these instead of actual images for the demo)
const defsContent = `
  <defs>
    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f39c12;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1abc9c;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#9b59b6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3498db;stop-opacity:1" />
    </linearGradient>
    
    <!-- Example image pattern (commented out - replace with your image URL) -->
    <!--
    <pattern id="exampleImagePattern" patternUnits="userSpaceOnUse" 
             width="200" height="200">
      <image href="https://picsum.photos/200" width="200" height="200"/>
    </pattern>
    -->
  </defs>
`;

// Generate SVG with defs
// Note: The playground will inject the defs automatically when rendering
artboard.render();

