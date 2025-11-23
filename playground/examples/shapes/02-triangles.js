/**
 * Shapes Example: Triangle Types
 * 
 * Demonstrates different triangle types: right, equilateral, and isosceles
 * arranged in a grid to verify geometry calculations.
 */

import { NewArtboard, NewTriangle, Grid, NewCircle } from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#2c3e50",
  boxModel: { padding: 40 },
});

// Create a 2x2 grid for different triangle types
const grid = new Grid({
  rows: 2,
  columns: 2,
  cellWidth: 500,
  cellHeight: 350,
  gutter: 30,
  style: {
    fill: "#34495e",
    stroke: "#1abc9c",
    strokeWidth: 2,
  },
  boxModel: { padding: 30 },
});

grid.container.position({
  relativeFrom: grid.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(grid.container);

// Cell (0, 0): Right triangle - bottom left orientation
const rightTriangle1 = new NewTriangle({
  type: "right",
  a: 150,
  b: 200,
  orientation: "bottomLeft",
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3,
  },
});

rightTriangle1.position({
  relativeFrom: rightTriangle1.center,
  relativeTo: grid.getCell(0, 0).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(0, 0).addElement(rightTriangle1);

// Add center marker
const marker1 = new NewCircle({
  radius: 6,
  style: { fill: "#e74c3c" },
});
marker1.position({
  relativeFrom: marker1.center,
  relativeTo: rightTriangle1.center,
  x: 0,
  y: 0,
});
grid.getCell(0, 0).addElement(marker1);

// Cell (0, 1): Right triangle - top right orientation
const rightTriangle2 = new NewTriangle({
  type: "right",
  a: 180,
  b: 180,
  orientation: "topRight",
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 3,
  },
});

rightTriangle2.position({
  relativeFrom: rightTriangle2.center,
  relativeTo: grid.getCell(0, 1).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(0, 1).addElement(rightTriangle2);

const marker2 = new NewCircle({
  radius: 6,
  style: { fill: "#e74c3c" },
});
marker2.position({
  relativeFrom: marker2.center,
  relativeTo: rightTriangle2.center,
  x: 0,
  y: 0,
});
grid.getCell(0, 1).addElement(marker2);

// Cell (1, 0): Equilateral triangle
const equilateralTriangle = new NewTriangle({
  type: "equilateral",
  a: 200,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 3,
  },
});

equilateralTriangle.position({
  relativeFrom: equilateralTriangle.center,
  relativeTo: grid.getCell(1, 0).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(1, 0).addElement(equilateralTriangle);

const marker3 = new NewCircle({
  radius: 6,
  style: { fill: "#e74c3c" },
});
marker3.position({
  relativeFrom: marker3.center,
  relativeTo: equilateralTriangle.center,
  x: 0,
  y: 0,
});
grid.getCell(1, 0).addElement(marker3);

// Cell (1, 1): Isosceles triangle
const isoscelesTriangle = new NewTriangle({
  type: "isosceles",
  a: 180,
  b: 220,
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 3,
  },
});

isoscelesTriangle.position({
  relativeFrom: isoscelesTriangle.center,
  relativeTo: grid.getCell(1, 1).contentBox.center,
  x: 0,
  y: 0,
});

grid.getCell(1, 1).addElement(isoscelesTriangle);

const marker4 = new NewCircle({
  radius: 6,
  style: { fill: "#e74c3c" },
});
marker4.position({
  relativeFrom: marker4.center,
  relativeTo: isoscelesTriangle.center,
  x: 0,
  y: 0,
});
grid.getCell(1, 1).addElement(marker4);

return artboard.render();

