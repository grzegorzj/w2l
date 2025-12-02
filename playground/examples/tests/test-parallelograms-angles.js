/**
 * Parallelogram Construction with Known Angles
 * Demonstrates how to construct parallelograms with specified angles
 * Shows various angle configurations and their properties
 */

import {
  Artboard,
  Card,
  Container,
  Text,
  Quadrilateral,
  Legend,
  Grid,
  Line,
  Circle,
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
  content: "Parallelogram Construction with Known Angles",
  fontSize: 24,
  style: { fontWeight: "bold" },
});
mainContainer.add(title);

const subtitle = new Text({
  content: "Demonstrating parallelograms with different angle configurations",
  fontSize: 14,
  style: { fill: "#666666" },
});
mainContainer.add(subtitle);

// Create a grid layout for cards (2x3 = 6 parallelograms)
const grid = new Grid({
  rows: 3,
  columns: 2,
  cellWidth: 630,
  cellHeight: 420,
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

// Cell 1: 45° Parallelogram - Vertical container with two cards
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
  spacing: 15,
});

const title1 = new Text({
  content: "45° Angle Parallelogram",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const shapeContainer1 = new Container({
  width: 590,
  height: 220,
  direction: "freeform",
  style: { fill: "none" },
});

const para1 = new Quadrilateral({
  type: "parallelogram",
  a: 160,
  b: 100,
  angle: 45,
  style: {
    fill: "#3b82f6",
    fillOpacity: 0.3,
    stroke: "#1e40af",
    strokeWidth: 3,
  },
});

para1.position({
  relativeTo: shapeContainer1.contentBox.center,
  relativeFrom: para1.center,
  x: 0,
  y: 0,
});

shapeContainer1.add(para1);

// Add diagonals and altitudes
const diagonals1 = para1.getDiagonals();
shapeContainer1.add(diagonals1[0].line);
shapeContainer1.add(diagonals1[1].line);

const altitudes1 = para1.getAltitudes();
shapeContainer1.add(altitudes1[0].line);

// Mark angles
const angles1 = para1.showAngles({
  A: { color: "#ef4444", radius: 20, label: "45°" },
  B: { color: "#10b981", radius: 20, label: "135°" },
  C: { color: "#ef4444", radius: 20, label: "45°" },
  D: { color: "#10b981", radius: 20, label: "135°" },
});
for (const angle of angles1) {
  shapeContainer1.add(angle);
}

// Label sides
const sides1 = para1.sides;
const sideLabel1_0 = new Text({
  content: "base = 160",
  fontSize: 12,
  style: { fill: "#1e40af", fontWeight: "bold" },
});
const offset1_0 = sides1[0].outwardNormal;
sideLabel1_0.position({
  relativeTo: sides1[0].center,
  relativeFrom: sideLabel1_0.center,
  x: offset1_0.x * 20,
  y: offset1_0.y * 20,
});
shapeContainer1.add(sideLabel1_0);

const sideLabel1_1 = new Text({
  content: "side = 100",
  fontSize: 12,
  style: { fill: "#1e40af", fontWeight: "bold" },
});
const offset1_1 = sides1[1].outwardNormal;
sideLabel1_1.position({
  relativeTo: sides1[1].center,
  relativeFrom: sideLabel1_1.center,
  x: offset1_1.x * 20,
  y: offset1_1.y * 20,
});
shapeContainer1.add(sideLabel1_1);

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
    { color: "#ef4444", label: "Acute angles: 45° (red)" },
    { color: "#10b981", label: "Obtuse angles: 135° (green)" },
    { color: "#1e40af", label: "Base: 160, Side: 100" },
    { color: "#666", label: "Diagonals & altitude shown" },
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

// Cell 2: 60° Parallelogram - Vertical container with two cards
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
  spacing: 15,
});

const title2 = new Text({
  content: "60° Angle Parallelogram",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const shapeContainer2 = new Container({
  width: 590,
  height: 220,
  direction: "freeform",
  style: { fill: "none" },
});

const para2 = new Quadrilateral({
  type: "parallelogram",
  a: 150,
  b: 110,
  angle: 60,
  style: {
    fill: "#10b981",
    fillOpacity: 0.3,
    stroke: "#047857",
    strokeWidth: 3,
  },
});

para2.position({
  relativeTo: shapeContainer2.contentBox.center,
  relativeFrom: para2.center,
  x: 0,
  y: 0,
});

shapeContainer2.add(para2);

// Mark angles
const angles2 = para2.showAngles({
  A: { color: "#ef4444", radius: 20, label: "60°" },
  B: { color: "#3b82f6", radius: 20, label: "120°" },
  C: { color: "#ef4444", radius: 20, label: "60°" },
  D: { color: "#3b82f6", radius: 20, label: "120°" },
});
for (const angle of angles2) {
  shapeContainer2.add(angle);
}

// Label sides
const sides2 = para2.sides;
const sideLabel2_0 = new Text({
  content: "150",
  fontSize: 12,
  style: { fill: "#047857", fontWeight: "bold" },
});
const offset2_0 = sides2[0].outwardNormal;
sideLabel2_0.position({
  relativeTo: sides2[0].center,
  relativeFrom: sideLabel2_0.center,
  x: offset2_0.x * 20,
  y: offset2_0.y * 20,
});
shapeContainer2.add(sideLabel2_0);

const sideLabel2_1 = new Text({
  content: "110",
  fontSize: 12,
  style: { fill: "#047857", fontWeight: "bold" },
});
const offset2_1 = sides2[1].outwardNormal;
sideLabel2_1.position({
  relativeTo: sides2[1].center,
  relativeFrom: sideLabel2_1.center,
  x: offset2_1.x * 20,
  y: offset2_1.y * 20,
});
shapeContainer2.add(sideLabel2_1);

// Add both diagonals and altitudes
const diagonals2 = para2.getDiagonals();
shapeContainer2.add(diagonals2[0].line);
shapeContainer2.add(diagonals2[1].line);

const altitudes2 = para2.getAltitudes();
shapeContainer2.add(altitudes2[0].line);

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
    { color: "#ef4444", label: "Acute: 60° (red)" },
    { color: "#3b82f6", label: "Obtuse: 120° (blue)" },
    { color: "#047857", label: "Opposite sides equal" },
    { color: "#666", label: "Diagonals & altitude shown" },
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

// Cell 3: 30° Parallelogram - Vertical container with two cards
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
  spacing: 15,
});

const title3 = new Text({
  content: "30° Angle Parallelogram (Acute)",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const shapeContainer3 = new Container({
  width: 590,
  height: 220,
  direction: "freeform",
  style: { fill: "none" },
});

const para3 = new Quadrilateral({
  type: "parallelogram",
  a: 180,
  b: 90,
  angle: 30,
  style: {
    fill: "#ef4444",
    fillOpacity: 0.3,
    stroke: "#b91c1c",
    strokeWidth: 3,
  },
});

para3.position({
  relativeTo: shapeContainer3.contentBox.center,
  relativeFrom: para3.center,
  x: 0,
  y: 0,
});

shapeContainer3.add(para3);

// Mark all angles
const angles3 = para3.showAngles({
  A: { color: "#dc2626", radius: 18, label: "30°" },
  B: { color: "#8b5cf6", radius: 20, label: "150°" },
  C: { color: "#dc2626", radius: 18, label: "30°" },
  D: { color: "#8b5cf6", radius: 20, label: "150°" },
});
for (const angle of angles3) {
  shapeContainer3.add(angle);
}

// Label sides
const sides3 = para3.sides;
const sideLabel3_0 = new Text({
  content: "180",
  fontSize: 12,
  style: { fill: "#b91c1c", fontWeight: "bold" },
});
const offset3_0 = sides3[0].outwardNormal;
sideLabel3_0.position({
  relativeTo: sides3[0].center,
  relativeFrom: sideLabel3_0.center,
  x: offset3_0.x * 20,
  y: offset3_0.y * 20,
});
shapeContainer3.add(sideLabel3_0);

const sideLabel3_1 = new Text({
  content: "90",
  fontSize: 12,
  style: { fill: "#b91c1c", fontWeight: "bold" },
});
const offset3_1 = sides3[1].outwardNormal;
sideLabel3_1.position({
  relativeTo: sides3[1].center,
  relativeFrom: sideLabel3_1.center,
  x: offset3_1.x * 20,
  y: offset3_1.y * 20,
});
shapeContainer3.add(sideLabel3_1);

// Add diagonals and altitudes
const diagonals3 = para3.getDiagonals();
shapeContainer3.add(diagonals3[0].line);
shapeContainer3.add(diagonals3[1].line);

const altitudes3 = para3.getAltitudes();
shapeContainer3.add(altitudes3[0].line);

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
    { color: "#dc2626", label: "Very acute: 30° (dark red)" },
    { color: "#8b5cf6", label: "Very obtuse: 150° (purple)" },
    { color: "#b91c1c", label: "Base: 180, Side: 90" },
    { color: "#666", label: "Height: 45 (h = side × sin30°)" },
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

// Cell 4: 75° Parallelogram - Vertical container with two cards
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
  spacing: 15,
});

const title4 = new Text({
  content: "75° Angle Parallelogram",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const shapeContainer4 = new Container({
  width: 590,
  height: 220,
  direction: "freeform",
  style: { fill: "none" },
});

const para4 = new Quadrilateral({
  type: "parallelogram",
  a: 140,
  b: 120,
  angle: 75,
  style: {
    fill: "#8b5cf6",
    fillOpacity: 0.3,
    stroke: "#6d28d9",
    strokeWidth: 3,
  },
});

para4.position({
  relativeTo: shapeContainer4.contentBox.center,
  relativeFrom: para4.center,
  x: 0,
  y: 0,
});

shapeContainer4.add(para4);

// Mark angles
const angles4 = para4.showAngles({
  A: { color: "#ef4444", radius: 20, label: "75°" },
  B: { color: "#10b981", radius: 20, label: "105°" },
  C: { color: "#ef4444", radius: 20, label: "75°" },
  D: { color: "#10b981", radius: 20, label: "105°" },
});
for (const angle of angles4) {
  shapeContainer4.add(angle);
}

// Label all sides
const sides4 = para4.sides;
const sideLabels4 = ["140", "120", "140", "120"];
for (let i = 0; i < 4; i++) {
  const side = sides4[i];
  const label = new Text({
    content: sideLabels4[i],
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

// Add diagonals and altitudes
const diagonals4 = para4.getDiagonals();
shapeContainer4.add(diagonals4[0].line);
shapeContainer4.add(diagonals4[1].line);

const altitudes4 = para4.getAltitudes();
shapeContainer4.add(altitudes4[0].line);

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
    { color: "#ef4444", label: "Angle A & C: 75° (red)" },
    { color: "#10b981", label: "Angle B & D: 105° (green)" },
    { color: "#6d28d9", label: "Opposite sides equal" },
    { color: "#666", label: "Diagonals & altitude shown" },
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

// Cell 5: 85° Parallelogram - Vertical container with two cards
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
  spacing: 15,
});

const title5 = new Text({
  content: "85° Angle (Near-Rectangle)",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const shapeContainer5 = new Container({
  width: 590,
  height: 220,
  direction: "freeform",
  style: { fill: "none" },
});

const para5 = new Quadrilateral({
  type: "parallelogram",
  a: 160,
  b: 100,
  angle: 85,
  style: {
    fill: "#f59e0b",
    fillOpacity: 0.3,
    stroke: "#d97706",
    strokeWidth: 3,
  },
});

para5.position({
  relativeTo: shapeContainer5.contentBox.center,
  relativeFrom: para5.center,
  x: 0,
  y: 0,
});

shapeContainer5.add(para5);

// Mark angles - showing they're close to 90°
const angles5 = para5.showAngles({
  A: { color: "#dc2626", radius: 20, label: "85°" },
  B: { color: "#3b82f6", radius: 20, label: "95°" },
  C: { color: "#dc2626", radius: 20, label: "85°" },
  D: { color: "#3b82f6", radius: 20, label: "95°" },
});
for (const angle of angles5) {
  shapeContainer5.add(angle);
}

// Show both diagonals and altitude (nearly equal in near-rectangle)
const diagonals5 = para5.getDiagonals();
shapeContainer5.add(diagonals5[0].line);
shapeContainer5.add(diagonals5[1].line);

const altitudes5 = para5.getAltitudes();
shapeContainer5.add(altitudes5[0].line);

// Label diagonals
const diagLabel5_0 = new Text({
  content: `d₁`,
  fontSize: 11,
  style: { fill: "#8b5cf6", fontWeight: "bold" },
});
diagLabel5_0.position({
  relativeTo: diagonals5[0].center,
  relativeFrom: diagLabel5_0.center,
  x: -15,
  y: 0,
});
shapeContainer5.add(diagLabel5_0);

const diagLabel5_1 = new Text({
  content: `d₂`,
  fontSize: 11,
  style: { fill: "#8b5cf6", fontWeight: "bold" },
});
diagLabel5_1.position({
  relativeTo: diagonals5[1].center,
  relativeFrom: diagLabel5_1.center,
  x: 15,
  y: 0,
});
shapeContainer5.add(diagLabel5_1);

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
    { color: "#dc2626", label: "Nearly 90°: 85° (red)" },
    { color: "#3b82f6", label: "Nearly 90°: 95° (blue)" },
    { color: "#8b5cf6", label: "Diagonals nearly equal" },
    { color: "#d97706", label: "Approaches rectangle" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 6,
  fontSize: 12,
});

legendCard5.add(legend5.container);

cell5Container.add(figureCard5);
cell5Container.add(legendCard5);
grid.getCell(2, 0).addElement(cell5Container);

// Cell 6: Comparison Chart - Vertical container with two cards
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
  spacing: 15,
});

const title6 = new Text({
  content: "Parallelogram API Summary",
  fontSize: 16,
  style: { fontWeight: "bold" },
});

const apiExample = new Text({
  content: "Construction Syntax:",
  fontSize: 14,
  style: { fontWeight: "600", fill: "#374151" },
});

const codeBlock = new Container({
  width: 550,
  height: "auto",
  direction: "vertical",
  spacing: 8,
  boxModel: { padding: 12 },
  style: {
    fill: "#f3f4f6",
    stroke: "#d1d5db",
    strokeWidth: 1,
  },
});

const code1 = new Text({
  content: "new Quadrilateral({",
  fontSize: 12,
  style: { fontFamily: "monospace", fill: "#1f2937" },
});

const code2 = new Text({
  content: "  type: 'parallelogram',",
  fontSize: 12,
  style: { fontFamily: "monospace", fill: "#1f2937" },
});

const code3 = new Text({
  content: "  a: 150,        // base length",
  fontSize: 12,
  style: { fontFamily: "monospace", fill: "#1f2937" },
});

const code4 = new Text({
  content: "  b: 100,        // side length",
  fontSize: 12,
  style: { fontFamily: "monospace", fill: "#1f2937" },
});

const code5 = new Text({
  content: "  angle: 60,     // angle in degrees",
  fontSize: 12,
  style: { fontFamily: "monospace", fill: "#1f2937" },
});

const code6 = new Text({
  content: "});",
  fontSize: 12,
  style: { fontFamily: "monospace", fill: "#1f2937" },
});

codeBlock.add(code1);
codeBlock.add(code2);
codeBlock.add(code3);
codeBlock.add(code4);
codeBlock.add(code5);
codeBlock.add(code6);

const propertiesTitle = new Text({
  content: "Key Properties:",
  fontSize: 14,
  style: { fontWeight: "600", fill: "#374151" },
});

figureContainer6.add(title6);
figureContainer6.add(apiExample);
figureContainer6.add(codeBlock);
figureContainer6.add(propertiesTitle);
figureCard6.add(figureContainer6);

// Legend card
const legendCard6 = new Card({
  width: 630,
  height: "auto",
  boxModel: { padding: 20 },
});

const legend6 = new Legend({
  items: [
    { color: "#3b82f6", label: "Opposite sides are parallel & equal" },
    { color: "#10b981", label: "Opposite angles are equal" },
    { color: "#8b5cf6", label: "Adjacent angles are supplementary" },
    { color: "#f59e0b", label: "Diagonals bisect each other" },
    { color: "#ef4444", label: "Sum of all angles = 360°" },
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

