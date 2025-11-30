// Demo of the new auto-labeling feature for Triangle

const artboard = new Artboard({
  width: 800,
  height: 600,
  backgroundColor: "#f8f9fa",
  boxModel: { padding: 40 },
});

// Create a triangle with auto-labeling configured
const triangle = new Triangle({
  type: "right",
  a: 150,
  b: 120,
  orientation: "bottomLeft",
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: 3 },
  
  // Enable auto-labeling
  labelSides: ["$a$", "$b$", "$c$"],
  labelAngles: ["90°", "$\\beta$", "$\\gamma$"],
  labelVertices: ["$A$", "$B$", "$C$"],
  
  // Optional: customize label appearance
  labelConfig: {
    sides: {
      fontSize: 20,
      style: { fill: "#d35400" },
      offset: 30,
    },
    angles: {
      mode: "internal",
      radius: 35,
      style: { stroke: "#e74c3c", strokeWidth: 2 },
    },
    vertices: {
      fontSize: 22,
      style: { fill: "#2c3e50" },
      offset: 20,
    }
  }
});

// Position triangle
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0,
});

artboard.addElement(triangle);

// Get all labels at once
const labels = triangle.getLabels();

// Add side labels
labels.sides.forEach(label => artboard.addElement(label));

// Add angle labels
labels.angles.forEach(angle => artboard.addElement(angle));

// Add vertex labels
labels.vertices.forEach(label => artboard.addElement(label));

// Add title
const title = new Text({
  content: "Auto-Labeling Demo",
  fontSize: 24,
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

return artboard.render();


