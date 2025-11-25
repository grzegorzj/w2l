/**
 * Shapes Example: Regular Polygons
 *
 * Demonstrates regular polygons from pentagon to nonagon
 * arranged in columns.
 */

import { Artboard, RegularPolygon, Columns, Circle } from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 40 },
});

// Create 5 columns for different polygons
const columns = new Columns({
  count: 5,
  columnWidth: 240,
  height: 500,
  gutter: 20,
  // alignment: "center",
  verticalAlignment: "center",
  horizontalAlignment: "center",
  style: {
    fill: "#bdc3c7",
    stroke: "#95a5a6",
    strokeWidth: 2,
  },
  boxModel: { padding: 20 },
});

columns.container.position({
  relativeFrom: columns.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(columns.container);

const colors = [
  { fill: "#e74c3c", stroke: "#c0392b" },
  { fill: "#3498db", stroke: "#2980b9" },
  { fill: "#2ecc71", stroke: "#27ae60" },
  { fill: "#f39c12", stroke: "#e67e22" },
  { fill: "#9b59b6", stroke: "#8e44ad" },
];

// Create polygons from pentagon (5) to nonagon (9)
for (let i = 0; i < 5; i++) {
  const sides = 5 + i;
  const polygon = new RegularPolygon({
    sides: sides,
    radius: 90,
    rotation: sides % 2 === 0 ? 22.5 : 0, // Rotate even-sided polygons for flat bottom
    style: {
      fill: colors[i].fill,
      stroke: colors[i].stroke,
      strokeWidth: 3,
    },
  });

  polygon.position({
    relativeFrom: polygon.center,
    relativeTo: columns.getColumn(i).contentBox.center,
    x: 0,
    y: 0,
  });

  columns.getColumn(i).addElement(polygon);

  // Add center marker
  const marker = new Circle({
    radius: 5,
    style: { fill: "#34495e" },
  });
  marker.position({
    relativeFrom: marker.center,
    relativeTo: polygon.center,
    x: 0,
    y: 0,
  });

  artboard.addElement(marker);

  // Add circumscribed circle for reference
  const circumCircle = new Circle({
    radius: 90,
    style: {
      fill: "none",
      stroke: "#7f8c8d",
      strokeWidth: 1,
      strokeDasharray: "5,5",
    },
  });
  circumCircle.position({
    relativeFrom: circumCircle.center,
    relativeTo: polygon.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(circumCircle);
}

return artboard.render();
