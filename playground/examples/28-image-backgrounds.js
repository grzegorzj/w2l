/**
 * Image Backgrounds Example
 *
 * Demonstrates how to use images as backgrounds for shapes using CSS patterns in SVG.
 * Shows various techniques including:
 * - Direct image backgrounds on rectangles and circles
 * - Pattern fills for triangles and complex shapes
 * - Using the new Image component
 * - Creating bezier curve paths
 */

import {
  Artboard,
  Rectangle,
  Circle,
  Triangle,
  RegularPolygon,
  Image,
  BezierCurve,
  Text,
} from "w2l";

// Create artboard
const artboard = new Artboard({
  size: { width: 1200, height: 800 },
  padding: "40px",
  style: {
    fill: "#f0f0f0",
  },
});

// Title
const title = new Text({
  content: "Image Backgrounds & New Components",
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

// --- IMAGE COMPONENT DEMO ---
const sectionTitle1 = new Text({
  content: "1. Image Component",
  style: {
    fontSize: "20px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
sectionTitle1.position({
  relativeFrom: sectionTitle1.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 80,
});
artboard.addElement(sectionTitle1);

// Using placeholder image service for demo
const demoImage = new Image({
  src: "https://via.placeholder.com/200x150/3498db/ffffff?text=Demo+Image",
  width: 200,
  height: 150,
  style: {
    opacity: 1,
  },
});
demoImage.position({
  relativeFrom: demoImage.topLeft,
  relativeTo: sectionTitle1.bottomLeft,
  x: 0,
  y: 20,
});
artboard.addElement(demoImage);

const imageLabel = new Text({
  content: "Basic Image",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
imageLabel.position({
  relativeFrom: imageLabel.topCenter,
  relativeTo: demoImage.bottomCenter,
  x: 0,
  y: 5,
});
artboard.addElement(imageLabel);

// Image with filters
const filteredImage = new Image({
  src: "https://via.placeholder.com/200x150/e74c3c/ffffff?text=Filtered",
  width: 200,
  height: 150,
  style: {
    opacity: 0.8,
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
  },
});
filteredImage.position({
  relativeFrom: filteredImage.topLeft,
  relativeTo: demoImage.topRight,
  x: 30,
  y: 0,
});
artboard.addElement(filteredImage);

const filteredLabel = new Text({
  content: "With Shadow Filter",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
filteredLabel.position({
  relativeFrom: filteredLabel.topCenter,
  relativeTo: filteredImage.bottomCenter,
  x: 0,
  y: 5,
});
artboard.addElement(filteredLabel);

// --- BEZIER CURVES DEMO ---
const sectionTitle2 = new Text({
  content: "2. Bezier Curves",
  style: {
    fontSize: "20px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
sectionTitle2.position({
  relativeFrom: sectionTitle2.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 350,
});
artboard.addElement(sectionTitle2);

// Quadratic Bezier Curve
const quadCurve = new BezierCurve({
  start: { x: 50, y: 400 },
  end: { x: 250, y: 400 },
  controlPoint1: { x: 150, y: 320 },
  style: {
    stroke: "#3498db",
    strokeWidth: 3,
    fill: "none",
  },
});
artboard.addElement(quadCurve);

// Draw control point indicator
const cp1Circle = new Circle({
  radius: 4,
  style: {
    fill: "#3498db",
    fillOpacity: 0.5,
  },
});
cp1Circle.position({
  relativeFrom: cp1Circle.center,
  relativeTo: { x: "150px", y: "320px" },
  x: 0,
  y: 0,
});
artboard.addElement(cp1Circle);

const quadLabel = new Text({
  content: "Quadratic (1 control point)",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
quadLabel.position({
  relativeFrom: quadLabel.topLeft,
  relativeTo: { x: "50px", y: "410px" },
  x: 0,
  y: 0,
});
artboard.addElement(quadLabel);

// Cubic Bezier Curve
const cubicCurve = new BezierCurve({
  start: { x: 300, y: 400 },
  end: { x: 550, y: 400 },
  controlPoint1: { x: 375, y: 320 },
  controlPoint2: { x: 475, y: 480 },
  style: {
    stroke: "#e74c3c",
    strokeWidth: 3,
    fill: "none",
  },
});
artboard.addElement(cubicCurve);

// Draw control point indicators
const cp2Circle1 = new Circle({
  radius: 4,
  style: {
    fill: "#e74c3c",
    fillOpacity: 0.5,
  },
});
cp2Circle1.position({
  relativeFrom: cp2Circle1.center,
  relativeTo: { x: "375px", y: "320px" },
  x: 0,
  y: 0,
});
artboard.addElement(cp2Circle1);

const cp2Circle2 = new Circle({
  radius: 4,
  style: {
    fill: "#e74c3c",
    fillOpacity: 0.5,
  },
});
cp2Circle2.position({
  relativeFrom: cp2Circle2.center,
  relativeTo: { x: "475px", y: "480px" },
  x: 0,
  y: 0,
});
artboard.addElement(cp2Circle2);

const cubicLabel = new Text({
  content: "Cubic (2 control points)",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
cubicLabel.position({
  relativeFrom: cubicLabel.topLeft,
  relativeTo: { x: "300px", y: "410px" },
  x: 0,
  y: 0,
});
artboard.addElement(cubicLabel);

// S-Curve connecting two circles
const circle1 = new Circle({
  radius: 20,
  style: {
    fill: "#2ecc71",
  },
});
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: { x: "650px", y: "360px" },
  x: 0,
  y: 0,
});
artboard.addElement(circle1);

const circle2 = new Circle({
  radius: 20,
  style: {
    fill: "#9b59b6",
  },
});
circle2.position({
  relativeFrom: circle2.center,
  relativeTo: { x: "850px", y: "440px" },
  x: 0,
  y: 0,
});
artboard.addElement(circle2);

const connectionCurve = new BezierCurve({
  start: circle1.rightCenter,
  end: circle2.leftCenter,
  controlPoint1: { x: 720, y: 340 },
  controlPoint2: { x: 780, y: 460 },
  style: {
    stroke: "#34495e",
    strokeWidth: 2,
    fill: "none",
    strokeDasharray: "5,5",
  },
});
artboard.addElement(connectionCurve);

const connectionLabel = new Text({
  content: "Connecting elements",
  style: {
    fontSize: "14px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
connectionLabel.position({
  relativeFrom: connectionLabel.topLeft,
  relativeTo: { x: "680px", y: "460px" },
  x: 0,
  y: 0,
});
artboard.addElement(connectionLabel);

// --- PATTERN FILLS FOR COMPLEX SHAPES ---
const sectionTitle3 = new Text({
  content: "3. Pattern Fills (for image backgrounds on any shape)",
  style: {
    fontSize: "20px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
sectionTitle3.position({
  relativeFrom: sectionTitle3.topLeft,
  relativeTo: artboard.topLeft,
  x: 0,
  y: 550,
});
artboard.addElement(sectionTitle3);

const patternNote = new Text({
  content:
    "Note: SVG patterns with images can be used to fill any shape (triangles, polygons, etc.)",
  style: {
    fontSize: "12px",
    fill: "#95a5a6",
    fontFamily: "Arial, sans-serif",
    fontStyle: "italic",
  },
  maxWidth: 800,
});
patternNote.position({
  relativeFrom: patternNote.topLeft,
  relativeTo: sectionTitle3.bottomLeft,
  x: 0,
  y: 10,
});
artboard.addElement(patternNote);

// Example: Triangle with gradient (simulating texture)
const texturedTriangle = new Triangle({
  type: "equilateral",
  a: 100,
  style: {
    fill: "url(#gradient1)",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});
texturedTriangle.position({
  relativeFrom: texturedTriangle.center,
  relativeTo: { x: "100px", y: "680px" },
  x: 0,
  y: 0,
});
artboard.addElement(texturedTriangle);

const triangleLabel = new Text({
  content: "Gradient-filled triangle",
  style: {
    fontSize: "12px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
triangleLabel.position({
  relativeFrom: triangleLabel.topCenter,
  relativeTo: texturedTriangle.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(triangleLabel);

// Example: Pentagon with gradient
const texturedPentagon = new RegularPolygon({
  sides: 5,
  radius: 50,
  style: {
    fill: "url(#gradient2)",
    stroke: "#c0392b",
    strokeWidth: 2,
  },
});
texturedPentagon.position({
  relativeFrom: texturedPentagon.center,
  relativeTo: { x: "280px", y: "680px" },
  x: 0,
  y: 0,
});
artboard.addElement(texturedPentagon);

const pentagonLabel = new Text({
  content: "Gradient-filled pentagon",
  style: {
    fontSize: "12px",
    fill: "#7f8c8d",
    fontFamily: "Arial, sans-serif",
  },
});
pentagonLabel.position({
  relativeFrom: pentagonLabel.topCenter,
  relativeTo: texturedPentagon.bottomCenter,
  x: 0,
  y: 10,
});
artboard.addElement(pentagonLabel);

// Add gradients to defs section (these will be added manually to the SVG)
const defsContent = `
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2ecc71;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e74c3c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f39c12;stop-opacity:1" />
    </linearGradient>
  </defs>
`;

// Instructions for using image patterns
const instructionsTitle = new Text({
  content: "Using Image Patterns (Advanced):",
  style: {
    fontSize: "14px",
    fontWeight: "bold",
    fill: "#34495e",
    fontFamily: "Arial, sans-serif",
  },
});
instructionsTitle.position({
  relativeFrom: instructionsTitle.topLeft,
  relativeTo: { x: "450px", y: "600px" },
  x: 0,
  y: 0,
});
artboard.addElement(instructionsTitle);

const instructions = new Text({
  content: `To use images as backgrounds on complex shapes:
  
1. Define a pattern in SVG <defs>:
   <pattern id="imgPattern" patternUnits="userSpaceOnUse" 
            width="100" height="100">
     <image href="image.jpg" width="100" height="100"/>
   </pattern>

2. Reference it in shape style:
   style: { fill: "url(#imgPattern)" }

This works for triangles, polygons, and any SVG shape!`,
  style: {
    fontSize: "11px",
    fill: "#7f8c8d",
    fontFamily: "monospace",
    whiteSpace: "pre",
  },
  maxWidth: 500,
});
instructions.position({
  relativeFrom: instructions.topLeft,
  relativeTo: instructionsTitle.bottomLeft,
  x: 0,
  y: 10,
});
artboard.addElement(instructions);

// Generate SVG with custom defs
artboard.render();
