/**
 * Shapes Example: Mixed Composition
 * 
 * Demonstrates all shape types together in a complex composition
 * using both Grid and Columns to verify everything works correctly.
 */

import { 
  NewArtboard, 
  NewCircle, 
  NewRect, 
  NewSquare, 
  NewTriangle, 
  NewRegularPolygon,
  NewLine,
  Grid,
  NewContainer
} from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#34495e",
  boxModel: { padding: 30 },
});

// Top section: Grid of various shapes
const topGrid = new Grid({
  rows: 1,
  columns: 5,
  cellWidth: 250,
  cellHeight: 300,
  gutter: 15,
  style: {
    fill: "#2c3e50",
    stroke: "#1abc9c",
    strokeWidth: 2,
  },
  boxModel: { padding: 15 },
});

topGrid.container.position({
  relativeFrom: topGrid.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(topGrid.container);

// Cell 0: Circle with inscribed square
const cell0Circle = new NewCircle({
  radius: 80,
  style: {
    fill: "none",
    stroke: "#3498db",
    strokeWidth: 3,
  },
});

cell0Circle.position({
  relativeFrom: cell0Circle.center,
  relativeTo: topGrid.getCell(0, 0).contentBox.center,
  x: 0,
  y: 0,
});

const cell0Square = new NewSquare({
  size: 113, // 80 * sqrt(2)
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 2,
  },
});

cell0Square.position({
  relativeFrom: cell0Square.center,
  relativeTo: cell0Circle.center,
  x: 0,
  y: 0,
});

topGrid.getCell(0, 0).addElement(cell0Circle);
topGrid.getCell(0, 0).addElement(cell0Square);

// Cell 1: Triangle
const cell1Triangle = new NewTriangle({
  type: "equilateral",
  a: 150,
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: 3,
  },
});

cell1Triangle.position({
  relativeFrom: cell1Triangle.center,
  relativeTo: topGrid.getCell(0, 1).contentBox.center,
  x: 0,
  y: 0,
});

topGrid.getCell(0, 1).addElement(cell1Triangle);

// Cell 2: Pentagon
const cell2Pentagon = new NewRegularPolygon({
  sides: 5,
  radius: 75,
  style: {
    fill: "#2ecc71",
    stroke: "#27ae60",
    strokeWidth: 3,
  },
});

cell2Pentagon.position({
  relativeFrom: cell2Pentagon.center,
  relativeTo: topGrid.getCell(0, 2).contentBox.center,
  x: 0,
  y: 0,
});

topGrid.getCell(0, 2).addElement(cell2Pentagon);

// Cell 3: Hexagon
const cell3Hexagon = new NewRegularPolygon({
  sides: 6,
  radius: 75,
  rotation: 30,
  style: {
    fill: "#f39c12",
    stroke: "#e67e22",
    strokeWidth: 3,
  },
});

cell3Hexagon.position({
  relativeFrom: cell3Hexagon.center,
  relativeTo: topGrid.getCell(0, 3).contentBox.center,
  x: 0,
  y: 0,
});

topGrid.getCell(0, 3).addElement(cell3Hexagon);

// Cell 4: Octagon
const cell4Octagon = new NewRegularPolygon({
  sides: 8,
  radius: 75,
  rotation: 22.5,
  style: {
    fill: "#9b59b6",
    stroke: "#8e44ad",
    strokeWidth: 3,
  },
});

cell4Octagon.position({
  relativeFrom: cell4Octagon.center,
  relativeTo: topGrid.getCell(0, 4).contentBox.center,
  x: 0,
  y: 0,
});

topGrid.getCell(0, 4).addElement(cell4Octagon);

// Bottom section: Container with mixed shapes and lines
const bottomContainer = new NewContainer({
  width: 1340,
  height: 600,
  direction: "none",
  style: {
    fill: "#2c3e50",
    stroke: "#1abc9c",
    strokeWidth: 2,
  },
  boxModel: { padding: 30 },
});

bottomContainer.position({
  relativeFrom: bottomContainer.topLeft,
  relativeTo: topGrid.container.bottomLeft,
  x: 0,
  y: 15,
});

artboard.addElement(bottomContainer);

// Create a pattern of shapes connected by lines
const pattern = [
  { 
    shape: new NewCircle({ radius: 50, style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: 2 } }), 
    pos: { x: 200, y: 300 } 
  },
  { 
    shape: new NewSquare({ size: 90, style: { fill: "#e74c3c", stroke: "#c0392b", strokeWidth: 2 } }), 
    pos: { x: 500, y: 200 } 
  },
  { 
    shape: new NewTriangle({ type: "equilateral", a: 100, style: { fill: "#2ecc71", stroke: "#27ae60", strokeWidth: 2 } }), 
    pos: { x: 800, y: 300 } 
  },
  { 
    shape: new NewRegularPolygon({ sides: 6, radius: 50, rotation: 30, style: { fill: "#f39c12", stroke: "#e67e22", strokeWidth: 2 } }), 
    pos: { x: 1100, y: 200 } 
  },
];

// Add shapes
pattern.forEach((item) => {
  item.shape.position({
    relativeFrom: item.shape.center,
    relativeTo: bottomContainer.contentBox.topLeft,
    x: item.pos.x,
    y: item.pos.y,
  });
  bottomContainer.addElement(item.shape);
});

// Connect shapes with lines
for (let i = 0; i < pattern.length - 1; i++) {
  const startShape = pattern[i].shape;
  const endShape = pattern[i + 1].shape;
  
  const dx = endShape.center.x - startShape.center.x;
  const dy = endShape.center.y - startShape.center.y;
  
  const line = new NewLine({
    start: { x: 0, y: 0 },
    end: { x: dx, y: dy },
    style: {
      stroke: "#ecf0f1",
      strokeWidth: 2,
      strokeDasharray: "5,5",
    },
  });
  
  line.position({
    relativeFrom: line.start,
    relativeTo: startShape.center,
    x: 0,
    y: 0,
  });
  
  bottomContainer.addElement(line);
}

return artboard.render();

