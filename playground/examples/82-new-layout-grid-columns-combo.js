/**
 * Example: Grid & Columns Combined Layout
 * 
 * Demonstrates using both Grid and Columns utilities together
 * to create a complex dashboard-like layout.
 */

import { NewArtboard, Grid, Columns, NewRect, NewCircle, NewContainer } from "w2l";

const artboard = new NewArtboard({
  width: 1200,
  height: 900,
  backgroundColor: "#2c3e50",
  boxModel: { padding: 30 },
});

// Top section: 3 columns for header cards
const headerColumns = new Columns({
  count: 3,
  columnWidth: 360,
  height: 150,
  gutter: 20,
  alignment: "center",
  style: {
    fill: "#34495e",
    stroke: "#1abc9c",
    strokeWidth: 2,
  },
  boxModel: { padding: 15 },
});

headerColumns.container.position({
  relativeFrom: headerColumns.container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(headerColumns.container);

// Add content to header columns
const headerColors = ["#e74c3c", "#3498db", "#2ecc71"];
const headerSizes = [80, 100, 90];

for (let i = 0; i < 3; i++) {
  const circle = new NewCircle({
    radius: headerSizes[i] / 2,
    style: {
      fill: headerColors[i],
      stroke: "#ecf0f1",
      strokeWidth: 3,
    },
  });
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: headerColumns.getColumn(i).contentBox.center,
    x: 0,
    y: 0,
  });
  
  headerColumns.getColumn(i).addElement(circle);
}

// Main section: 2 columns
const mainColumns = new Columns({
  count: 2,
  columnWidth: 560,
  height: 650,
  gutter: 20,
  alignment: "start",
  style: {
    fill: "#34495e",
    stroke: "#95a5a6",
    strokeWidth: 2,
  },
  boxModel: { padding: 20 },
});

mainColumns.container.position({
  relativeFrom: mainColumns.container.topLeft,
  relativeTo: headerColumns.container.bottomLeft,
  x: 0,
  y: 20,
});

artboard.addElement(mainColumns.container);

// Left column: Grid of cards (2x3)
const leftGrid = new Grid({
  rows: 2,
  columns: 3,
  cellWidth: 160,
  cellHeight: 280,
  gutter: 15,
  style: {
    fill: "#16a085",
    stroke: "#1abc9c",
    strokeWidth: 2,
  },
  boxModel: { padding: 10 },
});

mainColumns.getColumn(0).addElement(leftGrid.container);

// Fill grid cells with different patterns
const gridColors = [
  "#e74c3c", "#3498db", "#2ecc71",
  "#f39c12", "#9b59b6", "#e67e22"
];

for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 3; col++) {
    const idx = row * 3 + col;
    const cell = leftGrid.getCell(row, col);
    
    // Add rectangles or circles alternating
    if ((row + col) % 2 === 0) {
      const rect = new NewRect({
        width: 120,
        height: 80,
        style: {
          fill: gridColors[idx],
          stroke: "#ecf0f1",
          strokeWidth: 2,
        },
      });
      
      rect.position({
        relativeFrom: rect.center,
        relativeTo: cell.contentBox.center,
        x: 0,
        y: 0,
      });
      
      cell.addElement(rect);
    } else {
      const circle = new NewCircle({
        radius: 40,
        style: {
          fill: gridColors[idx],
          stroke: "#ecf0f1",
          strokeWidth: 2,
        },
      });
      
      circle.position({
        relativeFrom: circle.center,
        relativeTo: cell.contentBox.center,
        x: 0,
        y: 0,
      });
      
      cell.addElement(circle);
    }
  }
}

// Right column: Vertical stack with various elements
const rightStack = new NewContainer({
  width: 520,
  height: "auto",
  direction: "vertical",
  spacing: 20,
  alignment: "center",
});

mainColumns.getColumn(1).addElement(rightStack);

// Add nested columns to the right stack
const nestedColumns = new Columns({
  count: 2,
  columnWidth: 240,
  height: 180,
  gutter: 15,
  alignment: "center",
  style: {
    fill: "#8e44ad",
    stroke: "#9b59b6",
    strokeWidth: 2,
  },
  boxModel: { padding: 15 },
});

rightStack.addElement(nestedColumns.container);

// Fill nested columns
for (let i = 0; i < 2; i++) {
  const stack = new NewContainer({
    width: "auto",
    height: "auto",
    direction: "vertical",
    spacing: 10,
    alignment: "center",
  });
  
  for (let j = 0; j < 2; j++) {
    const rect = new NewRect({
      width: 180,
      height: 60,
      style: {
        fill: i === 0 ? "#3498db" : "#e74c3c",
        stroke: "#ecf0f1",
        strokeWidth: 2,
      },
    });
    stack.addElement(rect);
  }
  
  nestedColumns.getColumn(i).addElement(stack);
}

// Add a small grid to the right stack
const smallGrid = new Grid({
  rows: 2,
  columns: 4,
  cellWidth: 120,
  cellHeight: 90,
  gutter: 10,
  style: {
    fill: "#c0392b",
    stroke: "#e74c3c",
    strokeWidth: 2,
  },
  boxModel: { padding: 8 },
});

rightStack.addElement(smallGrid.container);

// Fill small grid with circles
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 4; col++) {
    const circle = new NewCircle({
      radius: 25,
      style: {
        fill: "#ecf0f1",
        stroke: "#95a5a6",
        strokeWidth: 2,
      },
    });
    
    circle.position({
      relativeFrom: circle.center,
      relativeTo: smallGrid.getCell(row, col).contentBox.center,
      x: 0,
      y: 0,
    });
    
    smallGrid.getCell(row, col).addElement(circle);
  }
}

// Add a final spread container
const spreadContainer = new NewContainer({
  width: 500,
  height: 120,
  direction: "horizontal",
  spread: true,
  alignment: "center",
  style: {
    fill: "#27ae60",
    stroke: "#2ecc71",
    strokeWidth: 2,
  },
  boxModel: { padding: 15 },
});

rightStack.addElement(spreadContainer);

// Add 3 elements to spread
for (let i = 0; i < 3; i++) {
  const rect = new NewRect({
    width: 80,
    height: 80,
    style: {
      fill: "#f39c12",
      stroke: "#e67e22",
      strokeWidth: 2,
    },
  });
  spreadContainer.addElement(rect);
}

return artboard.render();

