// Matrix Multiplication Example - Simplified
import { Artboard, Rectangle, Text, GridLayout } from "w2l";

const artboard = new Artboard({
  size: { width: 1000, height: 700 },
  backgroundColor: "#F8FAFC",
});

// Title
const title = new Text({
  content: "Matrix Multiplication: 2×2 Example",
  style: {
    fontSize: 32,
    fontWeight: "700",
    fill: "#1E293B",
    textAlign: "center",
  },
});

title.position({
  relativeFrom: title.center,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 60,
});

artboard.addElement(title);

// Function to create a simple matrix - just add rectangles directly
const createSimpleMatrix = (values, label, highlightColor = null) => {
  const rows = values.length;
  const cols = values[0].length;
  const cellSize = 70;
  const gap = 8;
  
  const matrixGrid = new GridLayout({
    columns: cols,
    rows: rows,
    width: cols * cellSize + (cols - 1) * gap,
    height: rows * cellSize + (rows - 1) * gap,
    gap: gap,
    horizontalAlign: "center",
    verticalAlign: "center",
    style: { fill: "transparent" }
  });

  // Just add rectangles directly - no containers, no text positioning
  values.forEach((row) => {
    row.forEach((value) => {
      const cell = new Rectangle({
        width: cellSize,
        height: cellSize,
        cornerStyle: "rounded",
        cornerRadius: 8,
        style: {
          fill: highlightColor || "#FFFFFF",
          stroke: highlightColor ? "#3B82F6" : "#CBD5E1",
          strokeWidth: highlightColor ? 2 : 1.5,
        },
      });
      
      artboard.addElement(cell);
      matrixGrid.addElement(cell);
    });
  });

  // Label
  const labelText = new Text({
    content: label,
    style: {
      fontSize: 20,
      fontWeight: "600",
      fill: "#64748B",
      textAlign: "center",
    },
  });

  return { grid: matrixGrid, label: labelText };
};

// Matrix A
const matrixA = createSimpleMatrix(
  [
    [2, 3],
    [1, 4]
  ],
  "Matrix A"
);

matrixA.grid.position({
  relativeFrom: matrixA.grid.center,
  relativeTo: artboard.center,
  x: -240,
  y: -50,
});

artboard.addElement(matrixA.grid);

matrixA.label.position({
  relativeFrom: matrixA.label.center,
  relativeTo: matrixA.grid.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(matrixA.label);

// × symbol
const multSymbol = new Text({
  content: "×",
  style: {
    fontSize: 48,
    fontWeight: "700",
    fill: "#64748B",
  },
});

multSymbol.position({
  relativeFrom: multSymbol.center,
  relativeTo: artboard.center,
  x: -120,
  y: -50,
});

artboard.addElement(multSymbol);

// Matrix B
const matrixB = createSimpleMatrix(
  [
    [5, 1],
    [2, 3]
  ],
  "Matrix B"
);

matrixB.grid.position({
  relativeFrom: matrixB.grid.center,
  relativeTo: artboard.center,
  x: 0,
  y: -50,
});

artboard.addElement(matrixB.grid);

matrixB.label.position({
  relativeFrom: matrixB.label.center,
  relativeTo: matrixB.grid.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(matrixB.label);

// = symbol
const equalsSymbol = new Text({
  content: "=",
  style: {
    fontSize: 48,
    fontWeight: "700",
    fill: "#64748B",
  },
});

equalsSymbol.position({
  relativeFrom: equalsSymbol.center,
  relativeTo: artboard.center,
  x: 120,
  y: -50,
});

artboard.addElement(equalsSymbol);

// Result Matrix
const matrixResult = createSimpleMatrix(
  [
    [16, 11],
    [13, 13]
  ],
  "Result = A × B",
  "#DBEAFE"
);

matrixResult.grid.position({
  relativeFrom: matrixResult.grid.center,
  relativeTo: artboard.center,
  x: 240,
  y: -50,
});

artboard.addElement(matrixResult.grid);

matrixResult.label.position({
  relativeFrom: matrixResult.label.center,
  relativeTo: matrixResult.grid.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(matrixResult.label);

// Bottom explanation
const explanation = new Text({
  content: "First cell: (2×5) + (3×2) = 16",
  style: {
    fontSize: 18,
    fontWeight: "500",
    fill: "#475569",
    textAlign: "center",
  },
});

explanation.position({
  relativeFrom: explanation.center,
  relativeTo: artboard.bottomCenter,
  x: 0,
  y: -50,
});

artboard.addElement(explanation);

artboard.render();

