/**
 * Geometry Figures with Legends Test
 * Demonstrates different types of geometric figures with legends in a grid layout
 * Each card contains a figure with a legend underneath showing its properties
 */

import {
  Artboard,
  Card,
  Container,
  Text,
  Circle,
  Triangle,
  RegularPolygon,
  Quadrilateral,
  Rect,
  Legend,
  Grid,
  Line,
} from "w2l";

const artboard = new Artboard({
  width: 1400,
  height: "auto",
  boxModel: { padding: 40 },
});

// Main container
const mainContainer = new Container({
  width: 1320,
  height: "auto",
  direction: "vertical",
  spacing: 30,
});

mainContainer.position({
  relativeTo: artboard.contentBox.center,
  relativeFrom: mainContainer.center,
  x: 0,
  y: 0,
});

artboard.add(mainContainer);

// Title
const title = new Text({
  content: "Geometric Figures with Property Legends",
  fontSize: 24,
  style: { fontWeight: "bold" },
});
mainContainer.add(title);

// Create a grid layout for cards (2x3 = 6 figures)
const grid = new Grid({
  rows: 3,
  columns: 2,
  cellWidth: 630,
  cellHeight: 400,
  gutter: 30,
  style: {
    fill: "none",
  },
});

grid.container.position({
  relativeFrom: grid.container.topLeft,
  relativeTo: mainContainer.bottomLeft,
  x: 0,
  y: 30,
});

mainContainer.add(grid.container);

// Cell 1: Circle - Vertical container with two cards
const cell1Container = new Container({
  width: 630,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

// Figure card
const figureCard1 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const figureContainer1 = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const title1 = new Text({
  content: "Circle",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

// Shape container with fixed height for consistent layout
const shapeContainer1 = new Container({
  width: 590,
  height: 200,
  direction: "freeform",
  style: { fill: "none" },
});

const circle = new Circle({
  radius: 80,
  style: {
    fill: "#3b82f6",
    fillOpacity: 0.3,
    stroke: "#1e40af",
    strokeWidth: 3,
  },
});

circle.position({
  relativeTo: shapeContainer1.contentBox.center,
  relativeFrom: circle.center,
  x: 0,
  y: 0,
});

shapeContainer1.add(circle);

// Add radius lines
const radius1 = new Line({
  start: circle.center,
  end: { x: circle.center.x + 80, y: circle.center.y },
  style: {
    stroke: "#ef4444",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
});
shapeContainer1.add(radius1);

const radius2 = new Line({
  start: circle.center,
  end: { x: circle.center.x, y: circle.center.y - 80 },
  style: {
    stroke: "#10b981",
    strokeWidth: 2,
    strokeDasharray: "5,5",
  },
});
shapeContainer1.add(radius2);

// Add diameter line
const diameter = new Line({
  start: { x: circle.center.x - 80, y: circle.center.y },
  end: { x: circle.center.x + 80, y: circle.center.y },
  style: {
    stroke: "#8b5cf6",
    strokeWidth: 2,
  },
});
shapeContainer1.add(diameter);

// Add center point
const centerPoint = new Circle({
  radius: 4,
  style: {
    fill: "#dc2626",
    stroke: "none",
  },
});
centerPoint.position({
  relativeTo: circle.center,
  relativeFrom: centerPoint.center,
  x: 0,
  y: 0,
});
shapeContainer1.add(centerPoint);

// Add labels
const radiusLabel = new Text({
  content: "r",
  fontSize: 14,
  style: { fill: "#ef4444", fontWeight: "bold" },
});
radiusLabel.position({
  relativeTo: { x: circle.center.x + 40, y: circle.center.y },
  relativeFrom: radiusLabel.center,
  x: 0,
  y: -12,
});
shapeContainer1.add(radiusLabel);

const diameterLabel = new Text({
  content: "d = 2r",
  fontSize: 12,
  style: { fill: "#8b5cf6", fontWeight: "bold" },
});
diameterLabel.position({
  relativeTo: { x: circle.center.x, y: circle.center.y },
  relativeFrom: diameterLabel.center,
  x: 0,
  y: 12,
});
shapeContainer1.add(diameterLabel);

figureContainer1.add(title1);
figureContainer1.add(shapeContainer1);
figureCard1.add(figureContainer1);

// Legend card
const legendCard1 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend1 = new Legend({
  items: [
    { color: "#1e40af", label: "Circumference (blue)" },
    { color: "#ef4444", label: "Radius (red dashed)" },
    { color: "#8b5cf6", label: "Diameter (purple)" },
    { color: "#dc2626", label: "Center point (red dot)" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard1.add(legend1.container);

cell1Container.add(figureCard1);
cell1Container.add(legendCard1);
grid.getCell(0, 0).addElement(cell1Container);

// Cell 2: Equilateral Triangle - Vertical container with two cards
const cell2Container = new Container({
  width: 630,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

// Figure card
const figureCard2 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const figureContainer2 = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const title2 = new Text({
  content: "Equilateral Triangle",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

// Shape container with fixed height for consistent layout
const shapeContainer2 = new Container({
  width: 590,
  height: 200,
  direction: "freeform",
  style: { fill: "none" },
});

const equilateralTriangle = new Triangle({
  type: "equilateral",
  a: 160,
  style: {
    fill: "#10b981",
    fillOpacity: 0.3,
    stroke: "#047857",
    strokeWidth: 3,
  },
});

equilateralTriangle.position({
  relativeTo: shapeContainer2.contentBox.center,
  relativeFrom: equilateralTriangle.center,
  x: 0,
  y: 0,
});

shapeContainer2.add(equilateralTriangle);

// Mark all three angles (60° each)
const angles2 = equilateralTriangle.showAngles({
  A: { color: "#ef4444", radius: 20, label: "60°" },
  B: { color: "#3b82f6", radius: 20, label: "60°" },
  C: { color: "#8b5cf6", radius: 20, label: "60°" },
});
for (const angle of angles2) {
  shapeContainer2.add(angle);
}

// Label all sides
const sides2 = equilateralTriangle.sides;
const sideLabels2 = ["a = 160", "b = 160", "c = 160"];
for (let i = 0; i < 3; i++) {
  const side = sides2[i];
  const label = new Text({
    content: sideLabels2[i],
    fontSize: 12,
    style: { fill: "#047857", fontWeight: "bold" },
  });
  const offset = side.outwardNormal;
  label.position({
    relativeTo: side.center,
    relativeFrom: label.center,
    x: offset.x * 20,
    y: offset.y * 20,
  });
  shapeContainer2.add(label);
}

// Add all three altitudes
const altitudes2 = equilateralTriangle.getAltitudes();
altitudes2.forEach(alt => shapeContainer2.add(alt.line));

figureContainer2.add(title2);
figureContainer2.add(shapeContainer2);
figureCard2.add(figureContainer2);

// Legend card
const legendCard2 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend2 = new Legend({
  items: [
    { color: "#047857", label: "Equal sides: a = b = c" },
    { color: "#ef4444", label: "Angle A: 60° (red)" },
    { color: "#3b82f6", label: "Angle B: 60° (blue)" },
    { color: "#8b5cf6", label: "Angle C: 60° (purple)" },
    { color: "#666", label: "Three altitudes shown" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard2.add(legend2.container);

cell2Container.add(figureCard2);
cell2Container.add(legendCard2);
grid.getCell(0, 1).addElement(cell2Container);

// Cell 3: Right Triangle - Vertical container with two cards
const cell3Container = new Container({
  width: 630,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

// Figure card
const figureCard3 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const figureContainer3 = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const title3 = new Text({
  content: "Right Triangle",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

// Shape container with fixed height for consistent layout
const shapeContainer3 = new Container({
  width: 590,
  height: 200,
  direction: "freeform",
  style: { fill: "none" },
});

const rightTriangle = new Triangle({
  type: "right",
  a: 120,
  b: 160,
  orientation: "bottomLeft",
  style: {
    fill: "#ef4444",
    fillOpacity: 0.3,
    stroke: "#b91c1c",
    strokeWidth: 3,
  },
});

rightTriangle.position({
  relativeTo: shapeContainer3.contentBox.center,
  relativeFrom: rightTriangle.center,
  x: 0,
  y: 0,
});

shapeContainer3.add(rightTriangle);

// Add altitudes
const altitudes3 = rightTriangle.getAltitudes();
altitudes3.forEach(alt => shapeContainer3.add(alt.line));

const sides3 = rightTriangle.sides;

// Mark all angles with right angle prominently shown
const angles3 = rightTriangle.showAngles({
  A: { color: "#10b981", radius: 15, label: "" },
  B: { color: "#3b82f6", radius: 15, label: "" },
  C: { color: "#dc2626", radius: 15, label: "90°", type: "right" },
});
for (const angle of angles3) {
  shapeContainer3.add(angle);
}

// Label sides
const sideLabels3 = [
  { text: "a = 120", color: "#b91c1c" },
  { text: "b = 160", color: "#b91c1c" },
  { text: "c = 200", color: "#8b5cf6" },
];
for (let i = 0; i < 3; i++) {
  const side = sides3[i];
  const label = new Text({
    content: sideLabels3[i].text,
    fontSize: 12,
    style: { fill: sideLabels3[i].color, fontWeight: "bold" },
  });
  const offset = side.outwardNormal;
  label.position({
    relativeTo: side.center,
    relativeFrom: label.center,
    x: offset.x * 20,
    y: offset.y * 20,
  });
  shapeContainer3.add(label);
}

// Label the altitude to hypotenuse
const altLabel3 = new Text({
  content: "h",
  fontSize: 11,
  style: { fill: "#f59e0b", fontWeight: "bold" },
});
altLabel3.position({
  relativeTo: sides3[2].altitude.foot,
  relativeFrom: altLabel3.center,
  x: 8,
  y: 0,
});
shapeContainer3.add(altLabel3);

figureContainer3.add(title3);
figureContainer3.add(shapeContainer3);
figureCard3.add(figureContainer3);

// Legend card
const legendCard3 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend3 = new Legend({
  items: [
    { color: "#dc2626", label: "Right angle (90°, red)" },
    { color: "#b91c1c", label: "Legs: a, b (dark red)" },
    { color: "#8b5cf6", label: "Hypotenuse: c (purple)" },
    { color: "#666", label: "Three altitudes shown" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard3.add(legend3.container);

cell3Container.add(figureCard3);
cell3Container.add(legendCard3);
grid.getCell(1, 0).addElement(cell3Container);

// Cell 4: Regular Pentagon - Vertical container with two cards
const cell4Container = new Container({
  width: 630,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

// Figure card
const figureCard4 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const figureContainer4 = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const title4 = new Text({
  content: "Regular Pentagon",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

// Shape container with fixed height for consistent layout
const shapeContainer4 = new Container({
  width: 590,
  height: 200,
  direction: "freeform",
  style: { fill: "none" },
});

const pentagon = new RegularPolygon({
  sides: 5,
  radius: 80,
  style: {
    fill: "#8b5cf6",
    fillOpacity: 0.3,
    stroke: "#6d28d9",
    strokeWidth: 3,
  },
});

pentagon.position({
  relativeTo: shapeContainer4.contentBox.center,
  relativeFrom: pentagon.center,
  x: 0,
  y: 0,
});

shapeContainer4.add(pentagon);

// Mark angles
const angles4 = pentagon.showAngles({
  indices: [0, 1, 2],
  color: "#ef4444",
  radius: 18,
  label: "108°",
});
for (const angle of angles4) {
  shapeContainer4.add(angle);
}

// Label sides
const sides4 = pentagon.getSides();
for (let i = 0; i < 3; i++) {
  const side = sides4[i];
  const label = new Text({
    content: "s",
    fontSize: 12,
    style: { fill: "#6d28d9", fontWeight: "bold" },
  });
  const offset = side.outwardNormal;
  label.position({
    relativeTo: side.center,
    relativeFrom: label.center,
    x: offset.x * 20,
    y: offset.y * 20,
  });
  shapeContainer4.add(label);
}

// Add radii to show regular structure
const radii4 = [0, 2, 4];
for (const idx of radii4) {
  const vertex = pentagon.getVertex(idx);
  const radius = new Line({
    start: pentagon.center,
    end: vertex,
    style: {
      stroke: "#10b981",
      strokeWidth: 1.5,
      strokeDasharray: "4,4",
    },
  });
  shapeContainer4.add(radius);
}

figureContainer4.add(title4);
figureContainer4.add(shapeContainer4);
figureCard4.add(figureContainer4);

// Legend card
const legendCard4 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend4 = new Legend({
  items: [
    { color: "#6d28d9", label: "5 equal sides (purple)" },
    { color: "#ef4444", label: "Interior angles: 108° (red)" },
    { color: "#10b981", label: "Radii from center (green)" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard4.add(legend4.container);

cell4Container.add(figureCard4);
cell4Container.add(legendCard4);
grid.getCell(1, 1).addElement(cell4Container);

// Cell 5: Square - Vertical container with two cards
const cell5Container = new Container({
  width: 630,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

// Figure card
const figureCard5 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const figureContainer5 = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const title5 = new Text({
  content: "Square",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

// Shape container with fixed height for consistent layout
const shapeContainer5 = new Container({
  width: 590,
  height: 200,
  direction: "freeform",
  style: { fill: "none" },
});

const squareQuad = new Quadrilateral({
  type: "square",
  a: 140,
  style: {
    fill: "#f59e0b",
    fillOpacity: 0.3,
    stroke: "#d97706",
    strokeWidth: 3,
  },
});

squareQuad.position({
  relativeTo: shapeContainer5.contentBox.center,
  relativeFrom: squareQuad.center,
  x: 0,
  y: 0,
});

shapeContainer5.add(squareQuad);

// Mark all right angles
const angles5 = squareQuad.showAngles({
  A: { color: "#dc2626", radius: 12, type: "right" },
  B: { color: "#dc2626", radius: 12, type: "right" },
  C: { color: "#dc2626", radius: 12, type: "right" },
  D: { color: "#dc2626", radius: 12, type: "right" },
});
for (const angle of angles5) {
  shapeContainer5.add(angle);
}

// Label two sides
const sides5 = squareQuad.sides;
for (let i = 0; i < 2; i++) {
  const side = sides5[i];
  const label = new Text({
    content: "s",
    fontSize: 12,
    style: { fill: "#d97706", fontWeight: "bold" },
  });
  const offset = side.outwardNormal;
  label.position({
    relativeTo: side.center,
    relativeFrom: label.center,
    x: offset.x * 20,
    y: offset.y * 20,
  });
  shapeContainer5.add(label);
}

// Add diagonals
const diagonals5 = squareQuad.getDiagonals();
diagonals5[0].line.style = {
  stroke: "#8b5cf6",
  strokeWidth: 2,
  strokeDasharray: "5,5",
};
diagonals5[1].line.style = {
  stroke: "#8b5cf6",
  strokeWidth: 2,
  strokeDasharray: "5,5",
};
shapeContainer5.add(diagonals5[0].line);
shapeContainer5.add(diagonals5[1].line);

// Add diagonal label
const diagLabel = new Text({
  content: "d = s√2",
  fontSize: 11,
  style: { fill: "#8b5cf6", fontWeight: "bold" },
});
diagLabel.position({
  relativeTo: squareQuad.center,
  relativeFrom: diagLabel.center,
  x: 25,
  y: 0,
});
shapeContainer5.add(diagLabel);

figureContainer5.add(title5);
figureContainer5.add(shapeContainer5);
figureCard5.add(figureContainer5);

// Legend card
const legendCard5 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend5 = new Legend({
  items: [
    { color: "#d97706", label: "4 equal sides (brown)" },
    { color: "#dc2626", label: "4 right angles 90° (red)" },
    { color: "#8b5cf6", label: "Equal diagonals (purple)" },
  ],
  direction: "vertical",
  indicatorShape: "square",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard5.add(legend5.container);

cell5Container.add(figureCard5);
cell5Container.add(legendCard5);
grid.getCell(2, 0).addElement(cell5Container);

// Cell 6: Regular Hexagon - Vertical container with two cards
const cell6Container = new Container({
  width: 630,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

// Figure card
const figureCard6 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const figureContainer6 = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const title6 = new Text({
  content: "Regular Hexagon",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

// Shape container with fixed height for consistent layout
const shapeContainer6 = new Container({
  width: 590,
  height: 200,
  direction: "freeform",
  style: { fill: "none" },
});

const hexagon = new RegularPolygon({
  sides: 6,
  radius: 80,
  rotation: 30,
  style: {
    fill: "#06b6d4",
    fillOpacity: 0.3,
    stroke: "#0891b2",
    strokeWidth: 3,
  },
});

hexagon.position({
  relativeTo: shapeContainer6.contentBox.center,
  relativeFrom: hexagon.center,
  x: 0,
  y: 0,
});

shapeContainer6.add(hexagon);

// Mark angles at top vertices
const angles6 = hexagon.showAngles({
  indices: [0, 1, 5],
  color: "#ef4444",
  radius: 18,
  label: "120°",
});
for (const angle of angles6) {
  shapeContainer6.add(angle);
}

// Label some sides
const sides6 = hexagon.getSides();
for (let i = 0; i < 3; i++) {
  const side = sides6[i];
  const label = new Text({
    content: "s",
    fontSize: 12,
    style: { fill: "#0891b2", fontWeight: "bold" },
  });
  const offset = side.outwardNormal;
  label.position({
    relativeTo: side.center,
    relativeFrom: label.center,
    x: offset.x * 20,
    y: offset.y * 20,
  });
  shapeContainer6.add(label);
}

// Add radii to show regular structure
for (let i = 0; i < 6; i += 2) {
  const vertex = hexagon.getVertex(i);
  const radius = new Line({
    start: hexagon.center,
    end: vertex,
    style: {
      stroke: "#8b5cf6",
      strokeWidth: 1.5,
      strokeDasharray: "4,4",
    },
  });
  shapeContainer6.add(radius);
}

// Add center point
const center6 = new Circle({
  radius: 3,
  style: {
    fill: "#8b5cf6",
    stroke: "none",
  },
});
center6.position({
  relativeTo: hexagon.center,
  relativeFrom: center6.center,
  x: 0,
  y: 0,
});
shapeContainer6.add(center6);

figureContainer6.add(title6);
figureContainer6.add(shapeContainer6);
figureCard6.add(figureContainer6);

// Legend card
const legendCard6 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend6 = new Legend({
  items: [
    { color: "#0891b2", label: "6 equal sides (cyan)" },
    { color: "#ef4444", label: "Interior angles: 120° (red)" },
    { color: "#8b5cf6", label: "Radii = side length (purple)" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard6.add(legend6.container);

cell6Container.add(figureCard6);
cell6Container.add(legendCard6);
grid.getCell(2, 1).addElement(cell6Container);

return artboard.render();

