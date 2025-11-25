/**
 * Test: Angle Debugging
 * 
 * Demonstrates angle calculation and rendering for quadrilaterals.
 * Includes visual debugging markers (circles at vertices) to verify anchoring.
 */

import { Artboard, Quadrilateral, Angle, Circle, Text } from "w2l";

const artboard = new Artboard({
  width: 900,
  height: 700,
  style: { fill: "#ffffff" },
  boxModel: { padding: 40 },
});

// Main title
const title = new Text({
  content: "Angle Debugging - Internal & External Angles",
  fontSize: 20,
  fontWeight: "bold",
});
title.position({
  relativeFrom: title.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});
artboard.addElement(title);

// Create a parallelogram for testing
const parallelogram = new Quadrilateral({
  type: "parallelogram",
  a: 200,
  b: 120,
  angle: 70,
  style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: "2" },
});

parallelogram.position({
  relativeFrom: parallelogram.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 150,
  y: 150,
});

artboard.addElement(parallelogram);

// Get vertices
const verts = parallelogram.absoluteVertices;

// Draw circles at each vertex to visualize exact vertex positions
for (let i = 0; i < 4; i++) {
  const circle = new Circle({
    radius: 6,
    style: { fill: "#f44336", stroke: "none" },
  });
  circle.position({
    relativeTo: verts[i],
    relativeFrom: circle.center,
  });
  artboard.addElement(circle);
}

// Draw internal angles at each vertex
for (let i = 0; i < 4; i++) {
  const internalAngle = new Angle({
    figure: parallelogram,
    vertexIndex: i,
    type: 'inward',
    radius: 30,
    label: `${parallelogram.getInternalAngleAt(i).toFixed(0)}°`,
    style: { stroke: "#2ecc71", strokeWidth: "1.5" },
    rightAngleMarker: 'arc', // Show arc even for 90° angles
  });
  artboard.addElement(internalAngle);
}

// Draw external angles at each vertex
for (let i = 0; i < 4; i++) {
  const externalAngle = new Angle({
    figure: parallelogram,
    vertexIndex: i,
    type: 'outward',
    radius: 50,
    label: `${parallelogram.getExternalAngleAt(i).toFixed(0)}°`,
    style: { stroke: "#e74c3c", strokeWidth: "1.5" },
    rightAngleMarker: 'arc', // Show arc even for 90° angles
  });
  artboard.addElement(externalAngle);
}

// Add vertex labels
const vertexLabels = parallelogram.createVertexLabels(["$A$", "$B$", "$C$", "$D$"], 75, 18);
vertexLabels.forEach(label => artboard.addElement(label));

// Add legend
const legend = new Text({
  content: "🔴 Red circles: vertex positions | 🟢 Green: internal angles | 🔴 Red: external angles",
  fontSize: 14,
});
legend.position({
  relativeFrom: legend.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 600,
});
artboard.addElement(legend);

// Second example: Rectangle for 90° angle verification
const rect = new Quadrilateral({
  type: "rectangle",
  a: 150,
  b: 100,
  style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: "2" },
});

rect.position({
  relativeFrom: rect.boundingBoxTopLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 600,
  y: 250,
});

artboard.addElement(rect);

// Draw 360° circles at two vertices to verify anchoring
const rectVerts = rect.absoluteVertices;
const debugCircle1 = new Angle({
  vertex: rectVerts[0],
  startAngle: 0,
  endAngle: 360,
  radius: 40,
  label: "360°",
  style: { stroke: "#9b59b6", strokeWidth: "1", strokeDasharray: "3,3" },
});

const debugCircle2 = new Angle({
  vertex: rectVerts[2],
  startAngle: 0,
  endAngle: 360,
  radius: 40,
  label: "360°",
  style: { stroke: "#9b59b6", strokeWidth: "1", strokeDasharray: "3,3" },
});

artboard.addElement(debugCircle1);
artboard.addElement(debugCircle2);

// Draw internal right angles
for (let i = 0; i < 4; i++) {
  const angle = new Angle({
    figure: rect,
    vertexIndex: i,
    type: 'inward',
    radius: 20,
    style: { stroke: "#f57c00", strokeWidth: "2" },
  });
  artboard.addElement(angle);
}

return artboard.render();
