import { Artboard, GridLayout, HStackFixed, Rectangle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true,
});

const grid = new GridLayout({
  columns: 2,
  rows: 2,
  width: 600,
  height: 400,
  gap: 20,
  horizontalAlign: "center",
  verticalAlign: "center",
  style: {
    fill: "#e7f5ff",
    stroke: "#1971c2",
    strokeWidth: 2,
  },
});

const rect1 = new Rectangle({
  width: 100,
  height: 80,
  style: {
    fill: "#1971c2",
  },
});

grid.addElement(rect1);

const hstack = new HStackFixed({
  spacing: 10,
  verticalAlign: "center",
  autoWidth: true,
  autoHeight: true,
  style: {
    fill: "#e7f5ff",
    stroke: "#e74c3c",
    strokeWidth: 2,
  },
});

const rect2 = new Rectangle({
  width: 50,
  height: 40,
  style: {
    fill: "#e74c3c",
  },
});

const rect3 = new Rectangle({
  width: 60,
  height: 35,
  style: {
    fill: "#e74c3c",
  },
});

hstack.addElement(rect2);
hstack.addElement(rect3);

grid.addElement(hstack);

artboard.addElement(grid);

const createDebugBox = (element, color) => {
  const pos = element.getAbsolutePosition();
  const width = element.width || 100;
  const height = element.height || 100;

  const debugBox = new Rectangle({
    width: width,
    height: height,
    style: {
      fill: "none",
      stroke: color,
      strokeWidth: 2,
      strokeDasharray: "5,5",
    },
  });

  debugBox.position({
    relativeFrom: debugBox.topLeft,
    relativeTo: { x: `${pos.x}px`, y: `${pos.y}px` },
    x: 0,
    y: 0,
  });

  return debugBox;
};

const debugGrid = createDebugBox(grid, "orange");
const debugRect1 = createDebugBox(rect1, "#4dabf7");
const debugHStack = createDebugBox(hstack, "#f06595");
const debugRect2 = createDebugBox(rect2, "blue");
const debugRect3 = createDebugBox(rect3, "blue");

// Create debug boxes for grid cells
const cells = grid.getCells();
const cellDebugBoxes = cells.map((cell, index) => {
  const gridPos = grid.getAbsolutePosition();

  const cellBox = new Rectangle({
    width: cell.width,
    height: cell.height,
    style: {
      fill: "none",
      stroke: "green",
      strokeWidth: 1,
      strokeDasharray: "3,3",
    },
  });

  cellBox.position({
    relativeFrom: cellBox.topLeft,
    relativeTo: { x: `${gridPos.x + cell.x}px`, y: `${gridPos.y + cell.y}px` },
    x: 0,
    y: 0,
  });

  return cellBox;
});

cellDebugBoxes.forEach((box) => artboard.addElement(box));

artboard.addElement(debugGrid);
artboard.addElement(debugRect1);
artboard.addElement(debugHStack);
artboard.addElement(debugRect2);
artboard.addElement(debugRect3);

artboard.render();
