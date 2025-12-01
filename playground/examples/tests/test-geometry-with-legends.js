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

// Card 1: Circle
const card1 = new Card({
  width: 630,
  height: 380,
  boxModel: { padding: 20 },
});

const card1Container = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 15,
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

const legend1 = new Legend({
  items: [
    { color: "#3b82f6", label: "Area: πr²" },
    { color: "#1e40af", label: "Circumference: 2πr" },
    { color: "#60a5fa", label: "Radius: 80" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 8,
});

card1Container.add(title1);
card1Container.add(shapeContainer1);
card1Container.add(legend1.container);
card1.add(card1Container);
grid.getCell(0, 0).addElement(card1);

// Card 2: Equilateral Triangle
const card2 = new Card({
  width: 630,
  height: 380,
  boxModel: { padding: 20 },
});

const card2Container = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 15,
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

const legend2 = new Legend({
  items: [
    { color: "#10b981", label: "All sides equal" },
    { color: "#047857", label: "All angles 60°" },
    { color: "#34d399", label: "Side length: 160" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 8,
});

card2Container.add(title2);
card2Container.add(shapeContainer2);
card2Container.add(legend2.container);
card2.add(card2Container);
grid.getCell(0, 1).addElement(card2);

// Card 3: Right Triangle
const card3 = new Card({
  width: 630,
  height: 380,
  boxModel: { padding: 20 },
});

const card3Container = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 15,
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

const legend3 = new Legend({
  items: [
    { color: "#ef4444", label: "90° angle at corner" },
    { color: "#b91c1c", label: "Leg a: 120" },
    { color: "#f87171", label: "Leg b: 160" },
    { color: "#dc2626", label: "Hypotenuse: ~200" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 8,
});

card3Container.add(title3);
card3Container.add(shapeContainer3);
card3Container.add(legend3.container);
card3.add(card3Container);
grid.getCell(1, 0).addElement(card3);

// Card 4: Regular Pentagon
const card4 = new Card({
  width: 630,
  height: 380,
  boxModel: { padding: 20 },
});

const card4Container = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 15,
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

const legend4 = new Legend({
  items: [
    { color: "#8b5cf6", label: "5 equal sides" },
    { color: "#6d28d9", label: "5 equal angles (108° each)" },
    { color: "#a78bfa", label: "Radius: 80" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 8,
});

card4Container.add(title4);
card4Container.add(shapeContainer4);
card4Container.add(legend4.container);
card4.add(card4Container);
grid.getCell(1, 1).addElement(card4);

// Card 5: Square (Quadrilateral)
const card5 = new Card({
  width: 630,
  height: 380,
  boxModel: { padding: 20 },
});

const card5Container = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 15,
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

const square = new Rect({
  width: 140,
  height: 140,
  style: {
    fill: "#f59e0b",
    stroke: "#d97706",
    strokeWidth: 3,
  },
});

square.position({
  relativeTo: shapeContainer5.contentBox.center,
  relativeFrom: square.center,
  x: 0,
  y: 0,
});

shapeContainer5.add(square);

const legend5 = new Legend({
  items: [
    { color: "#f59e0b", label: "4 equal sides" },
    { color: "#d97706", label: "4 right angles (90°)" },
    { color: "#fbbf24", label: "Perpendicular diagonals" },
    { color: "#f59e0b", label: "Side: 140" },
  ],
  direction: "vertical",
  indicatorShape: "square",
  itemSpacing: 8,
});

card5Container.add(title5);
card5Container.add(shapeContainer5);
card5Container.add(legend5.container);
card5.add(card5Container);
grid.getCell(2, 0).addElement(card5);

// Card 6: Regular Hexagon
const card6 = new Card({
  width: 630,
  height: 380,
  boxModel: { padding: 20 },
});

const card6Container = new Container({
  width: 590,
  height: "auto",
  direction: "vertical",
  spacing: 15,
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

const legend6 = new Legend({
  items: [
    { color: "#06b6d4", label: "6 equal sides" },
    { color: "#0891b2", label: "6 equal angles (120° each)" },
    { color: "#22d3ee", label: "Tessellates perfectly" },
    { color: "#06b6d4", label: "Radius: 80" },
  ],
  direction: "vertical",
  indicatorShape: "circle",
  itemSpacing: 8,
});

card6Container.add(title6);
card6Container.add(shapeContainer6);
card6Container.add(legend6.container);
card6.add(card6Container);
grid.getCell(2, 1).addElement(card6);

return artboard.render();

