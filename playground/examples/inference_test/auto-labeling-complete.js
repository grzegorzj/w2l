// Complete auto-labeling demo for Triangle and Quadrilateral

const artboard = new Artboard({
  width: 1000,
  height: 700,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 50 },
});

// Create a Triangle with auto-labeling
const triangle = new Triangle({
  type: "right",
  a: 120,
  b: 90,
  orientation: "bottomLeft",
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: 2 },
  
  labelSides: ["$a$", "$b$", "$c$"],
  labelAngles: ["90°", "$\\beta$", "$\\gamma$"],
  labelVertices: ["$A$", "$B$", "$C$"],
  
  labelConfig: {
    sides: {
      fontSize: 18,
      style: { fill: "#d35400" },
    },
    angles: {
      mode: "internal",
      radius: 30,
      style: { stroke: "#e74c3c", strokeWidth: 2 },
    },
    vertices: {
      fontSize: 20,
      style: { fill: "#2c3e50" },
    }
  }
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 200,
  y: 150,
});

artboard.addElement(triangle);

const triangleLabels = triangle.getLabels();
triangleLabels.sides.forEach(label => artboard.addElement(label));
triangleLabels.angles.forEach(angle => artboard.addElement(angle));
triangleLabels.vertices.forEach(label => artboard.addElement(label));

// Create a Quadrilateral (rectangle) with auto-labeling
const quad = new Quadrilateral({
  type: "rectangle",
  a: 140,
  b: 100,
  style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: 2 },
  
  labelSides: ["$a$", "$b$", "$a$", "$b$"],
  labelAngles: ["90°", "90°", "90°", "90°"],
  labelVertices: ["$A$", "$B$", "$C$", "$D$"],
  
  labelConfig: {
    sides: {
      fontSize: 18,
      style: { fill: "#6a1b9a" },
    },
    angles: {
      mode: "internal",
      radius: 25,
      style: { stroke: "#7b1fa2", strokeWidth: 2 },
    },
    vertices: {
      fontSize: 20,
      style: { fill: "#2c3e50" },
    }
  }
});

quad.position({
  relativeFrom: quad.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 200,
  y: 450,
});

artboard.addElement(quad);

const quadLabels = quad.getLabels();
quadLabels.sides.forEach(label => artboard.addElement(label));
quadLabels.angles.forEach(angle => artboard.addElement(angle));
quadLabels.vertices.forEach(label => artboard.addElement(label));

// Create a Quadrilateral (parallelogram) with auto-labeling
const parallelogram = new Quadrilateral({
  type: "parallelogram",
  a: 120,
  b: 80,
  angle: 65,
  style: { fill: "#f3e5f5", stroke: "#9c27b0", strokeWidth: 2 },
  
  labelSides: ["$a$", "$b$", "$a$", "$b$"],
  labelAngles: ["$\\alpha$", "$\\beta$", "$\\alpha$", "$\\beta$"],
  labelVertices: ["$P$", "$Q$", "$R$", "$S$"],
  
  labelConfig: {
    sides: {
      fontSize: 18,
      style: { fill: "#388e3c" },
    },
    angles: {
      mode: "internal",
      radius: 28,
      style: { stroke: "#4caf50", strokeWidth: 2 },
    },
    vertices: {
      fontSize: 20,
      style: { fill: "#2c3e50" },
    }
  }
});

parallelogram.position({
  relativeFrom: parallelogram.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 650,
  y: 280,
});

artboard.addElement(parallelogram);

const paraLabels = parallelogram.getLabels();
paraLabels.sides.forEach(label => artboard.addElement(label));
paraLabels.angles.forEach(angle => artboard.addElement(angle));
paraLabels.vertices.forEach(label => artboard.addElement(label));

// Add title
const title = new Text({
  content: "Auto-Labeling: Triangle & Quadrilaterals",
  fontSize: 28,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

title.position({
  relativeFrom: title.bottom,
  relativeTo: artboard.contentBox.top,
  x: 0,
  y: 30,
});

artboard.addElement(title);

// Add descriptions
const triangleDesc = new Text({
  content: "Right Triangle",
  fontSize: 16,
  style: { fill: "#1976d2", fontWeight: "bold" },
});

triangleDesc.position({
  relativeFrom: triangleDesc.center,
  relativeTo: triangle.boundingBoxCenter,
  x: 0,
  y: -100,
});

artboard.addElement(triangleDesc);

const rectDesc = new Text({
  content: "Rectangle",
  fontSize: 16,
  style: { fill: "#f57c00", fontWeight: "bold" },
});

rectDesc.position({
  relativeFrom: rectDesc.center,
  relativeTo: quad.center,
  x: 0,
  y: -80,
});

artboard.addElement(rectDesc);

const paraDesc = new Text({
  content: "Parallelogram",
  fontSize: 16,
  style: { fill: "#9c27b0", fontWeight: "bold" },
});

paraDesc.position({
  relativeFrom: paraDesc.center,
  relativeTo: parallelogram.center,
  x: 0,
  y: -70,
});

artboard.addElement(paraDesc);

return artboard.render();

