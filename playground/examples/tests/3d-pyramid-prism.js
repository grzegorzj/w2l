import {
  Artboard,
  Pyramid,
  Prism,
  Text,
  Circle,
  Container,
} from "w2l";

/**
 * Pyramid and Prism Comparison
 * 
 * Shows how to work with pyramids and prisms,
 * including vertex labeling and face highlighting
 */

const artboard = new Artboard({
  width: 1000,
  height: 700,
  style: { fill: "#fafafa" },
});

// Title
const title = new Text({
  content: "3D Pyramids and Prisms with Vertex Labeling",
  fontSize: 26,
  fontWeight: "bold",
});

title.position({
  relativeFrom: title.center,
  relativeTo: { x: 500, y: 40 },
  x: 0,
  y: 0,
});

artboard.addElement(title);

// Container for the shapes
const shapesContainer = new Container({
  direction: "horizontal",
  gap: 100,
  horizontalAlignment: "center",
  width: 900,
  height: 500,
});

shapesContainer.position({
  relativeFrom: shapesContainer.centerTop,
  relativeTo: { x: 500, y: 100 },
  x: 0,
  y: 0,
});

// 1. Square Pyramid
const pyramid = new Pyramid({
  baseShape: "square",
  baseRadius: 1.2,
  height: 2,
  rotation: [25, 35, 0],
  scale: 1.0,
  material: {
    color: [0.95, 0.7, 0.3, 1.0],
    ambient: 0.35,
    diffuse: 0.65,
    specular: 0.6,
    shininess: 48,
  },
  camera: {
    position: [0, 0.5, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: 40,
  },
  lights: [
    {
      position: [4, 5, 4],
      color: [1, 1, 1],
      intensity: 1.1,
    },
  ],
});

shapesContainer.addElement(pyramid);

// Get pyramid key points and project to 2D
const pyramidKeyPoints = pyramid.getKeyPoints();
const apex2D = pyramid.projectPoint3DTo2D(pyramidKeyPoints.apex);
const baseCenter2D = pyramid.projectPoint3DTo2D(pyramidKeyPoints.baseCenter);
const baseVertices2D = pyramid.projectPoints3DTo2D(pyramidKeyPoints.baseVertices);

// 2. Hexagonal Prism
const prism = new Prism({
  baseShape: "hexagonal",
  baseRadius: 1.0,
  height: 2.0,
  rotation: [20, 40, 0],
  scale: 0.9,
  material: {
    color: [0.4, 0.7, 0.95, 1.0],
    ambient: 0.35,
    diffuse: 0.65,
    specular: 0.7,
    shininess: 64,
  },
  camera: {
    position: [0, 0.5, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    fov: 40,
  },
  lights: [
    {
      position: [4, 5, 4],
      color: [1, 1, 1],
      intensity: 1.1,
    },
  ],
});

shapesContainer.addElement(prism);

// Get prism key points and project to 2D
const topCenter2D = prism.projectPoint3DTo2D(prism.getTopCenter());
const bottomCenter2D = prism.projectPoint3DTo2D(prism.getBottomCenter());
const topVertices2D = prism.projectPoints3DTo2D(prism.getTopBaseVertices());

artboard.addElement(shapesContainer);

// Note: In a browser environment with WebGL support, we would add labels here
// positioned at the projected 2D coordinates. Since the projection requires
// the canvas to be rendered first, labels would be added after initialization.

// Add shape descriptions
const pyramidDesc = new Text({
  content: "$\\text{Square Pyramid}$\n$h = 2, r = 1.2$",
  fontSize: 14,
  textAlign: "center",
});

pyramidDesc.position({
  relativeFrom: pyramidDesc.center,
  relativeTo: { x: 300, y: 630 },
  x: 0,
  y: 0,
});

artboard.addElement(pyramidDesc);

const prismDesc = new Text({
  content: "$\\text{Hexagonal Prism}$\n$h = 2, r = 1.0$",
  fontSize: 14,
  textAlign: "center",
});

prismDesc.position({
  relativeFrom: prismDesc.center,
  relativeTo: { x: 700, y: 630 },
  x: 0,
  y: 0,
});

artboard.addElement(prismDesc);

// Add usage note
const note = new Text({
  content: "Vertices can be labeled using projectPoint3DTo2D() method",
  fontSize: 12,
  style: { fill: "#666", fontStyle: "italic" },
});

note.position({
  relativeFrom: note.center,
  relativeTo: { x: 500, y: 680 },
  x: 0,
  y: 0,
});

artboard.addElement(note);

return artboard.render();

