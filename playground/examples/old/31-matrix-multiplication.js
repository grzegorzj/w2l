// Matrix Multiplication Example
import { Artboard, Rectangle, Text, GridLayout, Container } from "w2l";

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

// Function to create a matrix with values
const createMatrix = (values, label, highlightColor = null) => {
  const rows = values.length;
  const cols = values[0].length;
  const cellSize = 70;
  const gap = 8;
  
  // Create grid - NOW WITH AUTO-CALCULATED WIDTH/HEIGHT! 
  const matrixGrid = new GridLayout({
    columns: cols,
    rows: rows,
    cellWidth: cellSize,
    cellHeight: cellSize,
    gap: gap,
    horizontalAlign: "center",
    verticalAlign: "center",
    style: { fill: "transparent" }
  });

  // Store cells and texts for later
  const cells = [];
  const texts = [];

  // Add cells with values
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

      const text = new Text({
        content: String(value),
        style: {
          fontSize: 26,
          fontWeight: "600",
          fill: highlightColor ? "#1E40AF" : "#334155",
          textAlign: "center",
        },
      });

      cells.push(cell);
      texts.push(text);
      
      artboard.addElement(cell);
      matrixGrid.addElement(cell);
    });
  });
  
  // Return grid, cells, and texts so we can position texts later
  return { grid: matrixGrid, cells, texts, labelText: new Text({
    content: label,
    style: {
      fontSize: 20,
      fontWeight: "600",
      fill: "#64748B",
      textAlign: "center",
    },
  })};
};

// Matrix A (2x2)
const matrixAResult = createMatrix(
  [
    [2, 3],
    [1, 4]
  ],
  "Matrix A"
);

matrixAResult.grid.position({
  relativeFrom: matrixAResult.grid.center,
  relativeTo: artboard.center,
  x: -240,
  y: -50,
});

artboard.addElement(matrixAResult.grid);

// Position texts on top of cells
matrixAResult.cells.forEach((cell, i) => {
  const text = matrixAResult.texts[i];
  text.position({
    relativeFrom: text.center,
    relativeTo: cell.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(text);
});

matrixAResult.labelText.position({
  relativeFrom: matrixAResult.labelText.center,
  relativeTo: matrixAResult.grid.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(matrixAResult.labelText);

// Multiplication symbol
const multSymbol = new Text({
  content: "×",
  style: {
    fontSize: 48,
    fontWeight: "700",
    fill: "#64748B",
    textAlign: "center",
  },
});

multSymbol.position({
  relativeFrom: multSymbol.center,
  relativeTo: artboard.center,
  x: -120,
  y: -50,
});

artboard.addElement(multSymbol);

// Matrix B (2x2)
const matrixBResult = createMatrix(
  [
    [5, 1],
    [2, 3]
  ],
  "Matrix B"
);

matrixBResult.grid.position({
  relativeFrom: matrixBResult.grid.center,
  relativeTo: artboard.center,
  x: 0,
  y: -50,
});

artboard.addElement(matrixBResult.grid);

// Position texts on top of cells
matrixBResult.cells.forEach((cell, i) => {
  const text = matrixBResult.texts[i];
  text.position({
    relativeFrom: text.center,
    relativeTo: cell.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(text);
});

matrixBResult.labelText.position({
  relativeFrom: matrixBResult.labelText.center,
  relativeTo: matrixBResult.grid.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(matrixBResult.labelText);

// Equals symbol
const equalsSymbol = new Text({
  content: "=",
  style: {
    fontSize: 48,
    fontWeight: "700",
    fill: "#64748B",
    textAlign: "center",
  },
});

equalsSymbol.position({
  relativeFrom: equalsSymbol.center,
  relativeTo: artboard.center,
  x: 120,
  y: -50,
});

artboard.addElement(equalsSymbol);

// Result Matrix (2x2) - with highlight
const matrixResultResult = createMatrix(
  [
    [16, 11],
    [13, 13]
  ],
  "Result = A × B",
  "#DBEAFE"
);

matrixResultResult.grid.position({
  relativeFrom: matrixResultResult.grid.center,
  relativeTo: artboard.center,
  x: 240,
  y: -50,
});

artboard.addElement(matrixResultResult.grid);

// Position texts on top of cells
matrixResultResult.cells.forEach((cell, i) => {
  const text = matrixResultResult.texts[i];
  text.position({
    relativeFrom: text.center,
    relativeTo: cell.center,
    x: 0,
    y: 0,
  });
  artboard.addElement(text);
});

matrixResultResult.labelText.position({
  relativeFrom: matrixResultResult.labelText.center,
  relativeTo: matrixResultResult.grid.bottomCenter,
  x: 0,
  y: 30,
});

artboard.addElement(matrixResultResult.labelText);

// Calculation explanation
const explanation = new Text({
  content: "First cell calculation: (2×5) + (3×2) = 10 + 6 = 16",
  style: {
    fontSize: 18,
    fontWeight: "500",
    fill: "#475569",
    textAlign: "center",
  },
});

explanation.position({
  relativeFrom: explanation.center,
  relativeTo: artboard.center,
  x: 0,
  y: 180,
});

artboard.addElement(explanation);

// Add formula box
const formulaBox = new Rectangle({
  width: 700,
  height: 140,
  cornerStyle: "rounded",
  cornerRadius: 12,
  style: {
    fill: "#F1F5F9",
    stroke: "#CBD5E1",
    strokeWidth: 2,
  },
});

formulaBox.position({
  relativeFrom: formulaBox.center,
  relativeTo: artboard.bottomCenter,
  x: 0,
  y: -100,
});

artboard.addElement(formulaBox);

// Formula steps
const steps = [
  "For each cell (i,j) in the result:",
  "• Multiply row i of Matrix A by column j of Matrix B",
  "• Sum the products to get the result value",
  "Example: cell(0,0) = (2×5) + (3×2) = 16"
];

steps.forEach((step, index) => {
  const stepText = new Text({
    content: step,
    style: {
      fontSize: 15,
      fontWeight: index === 0 ? "600" : "400",
      fill: "#334155",
      textAlign: "center",
    },
  });

  stepText.position({
    relativeFrom: stepText.center,
    relativeTo: formulaBox.center,
    x: 0,
    y: -50 + index * 28,
  });

  artboard.addElement(stepText);
});

artboard.render();

