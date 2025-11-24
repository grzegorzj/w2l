/**
 * Example: Grid Layout Utility - Simple Test
 * 
 * Simple 4x4 grid with equal cell sizes and a circle in each cell.
 */

import { NewArtboard, Grid, NewCircle } from "w2l";

const artboard = new NewArtboard({
  width: 1000,
  height: 1000,
  backgroundColor: "#ecf0f1",
  boxModel: { padding: 50 },
});

// Create a simple 4x4 grid
const grid = new Grid({
  rows: 4,
  columns: 4,
  cellWidth: 150,
  cellHeight: 150,
  gutter: 20,
  style: {
    fill: "#95a5a6",
    stroke: "#7f8c8d",
    strokeWidth: 2,
  },
  boxModel: { padding: 10 },
});

// Position the grid on the artboard
grid.container.position({
  relativeFrom: grid.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(grid.container);

// Add a circle to each cell - the ORIGINAL pattern
for (let row = 0; row < 4; row++) {
  for (let col = 0; col < 4; col++) {
    const cell = grid.getCell(row, col);
    
    const circle = new NewCircle({
      radius: 40,
      style: {
        fill: "#3498db",
        stroke: "#2980b9",
        strokeWidth: 2,
      },
    });
    
    // Position THEN add (should work with the fix)
    circle.position({
      relativeFrom: circle.center,
      relativeTo: cell.contentBox.center,
      x: 0,
      y: 0,
    });
    
    cell.addElement(circle);
  }
}

return artboard.render();
