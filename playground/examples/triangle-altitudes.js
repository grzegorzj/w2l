/**
 * Triangle Altitudes Example
 * 
 * Demonstrates the altitude API for triangles:
 * - Accessing side.altitude properties
 * - Drawing altitudes
 * - Labeling altitude heights
 * - Showing all three altitudes at once
 */

// Create a scalene triangle
const triangle = new Triangle({
  type: "right",
  a: 200,
  b: 150,
  orientation: "bottomLeft",
  style: { 
    fill: "rgba(100, 150, 255, 0.15)", 
    stroke: "navy", 
    strokeWidth: 3 
  }
});

artboard.add(triangle);

// Get the sides
const sides = triangle.sides;

// Draw all three altitudes
sides.forEach((side, index) => {
  // Add the altitude line
  const altitude = side.altitude.line;
  
  // Customize style per altitude
  const colors = ["#e74c3c", "#27ae60", "#3498db"];
  altitude.style = {
    stroke: colors[index],
    strokeWidth: 2,
    strokeDasharray: "6,3"
  };
  
  artboard.add(altitude);
  
  // Mark the foot with a small circle
  const footMarker = new Circle({
    radius: 4,
    style: { fill: colors[index] }
  });
  
  footMarker.position({
    relativeFrom: footMarker.center,
    relativeTo: side.altitude.foot,
    x: 0,
    y: 0
  });
  
  artboard.add(footMarker);
  
  // Label the altitude height
  const heightLabel = new Text({
    content: `$h_${index} = ${side.altitude.height.toFixed(1)}$`,
    fontSize: 14,
    style: { fill: colors[index], fontWeight: "bold" }
  });
  
  // Position label near the midpoint of the altitude
  const midX = (side.altitude.vertex.x + side.altitude.foot.x) / 2;
  const midY = (side.altitude.vertex.y + side.altitude.foot.y) / 2;
  
  heightLabel.position({
    relativeFrom: heightLabel.center,
    relativeTo: { x: midX, y: midY },
    x: index === 0 ? 20 : index === 1 ? -25 : 15,
    y: index === 0 ? 0 : index === 1 ? 10 : 0
  });
  
  artboard.add(heightLabel);
});

// Label the vertices
const vertexLabels = triangle.createVertexLabels(["$A$", "$B$", "$C$"], 25, 16);
vertexLabels.forEach(label => artboard.add(label));

// Label the sides
const sideLabels = triangle.createSideLabels(
  ["$a$", "$b$", "$c$"],
  { offset: 20, fontSize: 16 }
);
sideLabels.forEach(label => artboard.add(label));

// Add title
const title = new Text({
  content: "Triangle Altitudes",
  fontSize: 24,
  style: { fontWeight: "bold", fill: "navy" }
});

title.position({
  relativeFrom: title.centerBottom,
  relativeTo: artboard.contentBox.topLeft,
  x: artboard.contentBox.width / 2,
  y: -40
});

artboard.add(title);

// Add description
const description = new Text({
  content: "Each side's altitude is perpendicular from the opposite vertex",
  fontSize: 14,
  style: { fill: "#666" }
});

description.position({
  relativeFrom: description.centerTop,
  relativeTo: artboard.contentBox.bottomLeft,
  x: artboard.contentBox.width / 2,
  y: 30
});

artboard.add(description);

