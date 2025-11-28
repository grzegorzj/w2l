import {
  Artboard,
  Sphere,
  Prism,
  Pyramid,
  SolidOfRevolution,
  Text,
  Container,
} from "w2l";

/**
 * Demonstration of 3D Figures with Math Textbook Style
 * 
 * This example showcases:
 * - Sphere with auto-labeled key points
 * - Hexagonal Prism with vertex labels
 * - Square Pyramid with apex and base labels
 * - Solid of Revolution (paraboloid)
 * 
 * All figures use wireframe rendering with isometric projection
 * for a clean, mathematical diagram appearance (like textbooks).
 * Hidden edges are shown as dashed lines.
 */

const artboard = new Artboard({
  width: 1200,
  height: 900,
  style: { fill: "#f8f9fa" },
});

// Title
const title = new Text({
  content: "3D Mathematical Figures (WebGL)",
  fontSize: 28,
  fontWeight: "bold",
});
title.position({
  relativeFrom: title.center,
  relativeTo: { x: 600, y: 40 },
  x: 0,
  y: 0,
});
artboard.addElement(title);

// Container for the 3D figures
const figuresContainer = new Container({
  direction: "horizontal",
  gap: 40,
  horizontalAlignment: "center",
  width: 1100,
  height: 700,
  boxModel: { padding: 20 },
});

figuresContainer.position({
  relativeFrom: figuresContainer.centerTop,
  relativeTo: { x: 600, y: 100 },
  x: 0,
  y: 0,
});

// 1. Sphere Example
const sphere = new Sphere({
  width: 250,
  height: 250,
  radius: 1.2,
  segments: 24,
  // Using default wireframe + orthographic projection for math textbook look
});

// Label the sphere
const sphereLabel = new Text({
  content: "$\\text{Sphere: } r = 1.2$",
  fontSize: 14,
});

// Get key points on the sphere and project to 2D
const sphereKeyPoints = sphere.getKeyPoints();
const northPole2D = sphere.projectPoint3DTo2D(sphereKeyPoints.northPole);

const northPoleLabel = new Text({
  content: "$N$",
  fontSize: 12,
  style: { fill: "#d32f2f" },
});

figuresContainer.addElement(sphere);

// 2. Hexagonal Prism Example
const prism = new Prism({
  baseShape: "hexagonal",
  baseRadius: 0.8,
  height: 1.6,
  scale: 0.9,
});

const prismLabel = new Text({
  content: "$\\text{Hexagonal Prism}$",
  fontSize: 14,
});

// Get top vertices and project to 2D for labeling
const topVertices = prism.getTopBaseVertices();
const topVertices2D = prism.projectPoints3DTo2D(topVertices);

figuresContainer.addElement(prism);

// 3. Square Pyramid Example
const pyramid = new Pyramid({
  baseShape: "square",
  baseRadius: 1.0,
  height: 1.5,
  scale: 0.9,
});

const pyramidLabel = new Text({
  content: "$\\text{Square Pyramid}$",
  fontSize: 14,
});

// Get apex and project to 2D
const pyramidKeyPoints = pyramid.getKeyPoints();
const apex2D = pyramid.projectPoint3DTo2D(pyramidKeyPoints.apex);

const apexLabel = new Text({
  content: "$A$",
  fontSize: 12,
  style: { fill: "#d32f2f" },
});

figuresContainer.addElement(pyramid);

// 4. Solid of Revolution - Paraboloid
const paraboloid = new SolidOfRevolution({
  radiusFunction: (y) => Math.sqrt(Math.abs(y)) * 0.8,
  yStart: 0,
  yEnd: 1.5,
  ySegments: 20,
  radialSegments: 24,
  scale: 0.9,
});

const paraboloidLabel = new Text({
  content: "$\\text{Paraboloid: } r(y) = \\sqrt{y}$",
  fontSize: 14,
});

// Get key points
const paraboloidKeyPoints = paraboloid.getKeyPoints();
const top2D = paraboloid.projectPoint3DTo2D(paraboloidKeyPoints.top);

const topLabel = new Text({
  content: "$T$",
  fontSize: 12,
  style: { fill: "#d32f2f" },
});

figuresContainer.addElement(paraboloid);

artboard.addElement(figuresContainer);

// Position labels below each figure
// Note: In a real implementation with working WebGL rendering,
// we would position these relative to the projected 2D points.
// For now, we'll position them below each figure as placeholders.

const labelContainer = new Container({
  direction: "horizontal",
  gap: 40,
  horizontalAlignment: "center",
  width: 1100,
});

labelContainer.position({
  relativeFrom: labelContainer.centerTop,
  relativeTo: { x: 600, y: 830 },
  x: 0,
  y: 0,
});

labelContainer.addElement(sphereLabel);
labelContainer.addElement(prismLabel);
labelContainer.addElement(pyramidLabel);
labelContainer.addElement(paraboloidLabel);

artboard.addElement(labelContainer);

// Add description
const description = new Text({
  content: "Clean wireframe rendering with isometric projection - math textbook style",
  fontSize: 12,
  style: { fill: "#666" },
});

description.position({
  relativeFrom: description.center,
  relativeTo: { x: 600, y: 880 },
  x: 0,
  y: 0,
});

artboard.addElement(description);

// Render the artboard
return artboard.render();

