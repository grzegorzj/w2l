import { Artboard, Square } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1200px", height: "900px" },
  padding: "50px",
  backgroundColor: "#34495e"
});

// Create a checkerboard pattern
const colors = ["#ecf0f1", "#bdc3c7"];
const squareSize = 60;
const rows = 6;
const cols = 8;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const square = new Square({
      size: squareSize,
      fill: colors[(row + col) % 2],
      stroke: "none"
    });
    
    square.position({
      relativeFrom: square.center,
      relativeTo: artboard.center,
      x: `${(col - cols / 2) * squareSize + squareSize / 2}px`,
      y: `${(row - rows / 2) * squareSize + squareSize / 2 - 150}px`
    });
    
    artboard.addElement(square);
  }
}

// Create rounded squares showcase (bottom)
const roundedSquare1 = new Square({
  size: "120px",
  cornerStyle: "rounded",
  cornerRadius: "20px",
  fill: "#3498db",
  stroke: "#2980b9",
  strokeWidth: "3px"
});

roundedSquare1.position({
  relativeFrom: roundedSquare1.center,
  relativeTo: artboard.center,
  x: "-300px",
  y: "280px"
});

artboard.addElement(roundedSquare1);

// Squircle square (modern iOS-style)
const squircleSquare = new Square({
  a: "120px", // Using mathematical notation
  cornerStyle: "squircle",
  cornerRadius: "30px",
  fill: "#e74c3c",
  stroke: "#c0392b",
  strokeWidth: "3px"
});

squircleSquare.position({
  relativeFrom: squircleSquare.center,
  relativeTo: artboard.center,
  x: "-150px",
  y: "280px"
});

artboard.addElement(squircleSquare);

// Sharp square
const sharpSquare = new Square({
  size: "120px",
  cornerStyle: "sharp",
  fill: "#2ecc71",
  stroke: "#27ae60",
  strokeWidth: "3px"
});

sharpSquare.position({
  relativeFrom: sharpSquare.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "280px"
});

artboard.addElement(sharpSquare);

// Highly rounded square (almost circular)
const circularSquare = new Square({
  size: "120px",
  cornerStyle: "rounded",
  cornerRadius: "60px",
  fill: "#9b59b6",
  stroke: "#8e44ad",
  strokeWidth: "3px"
});

circularSquare.position({
  relativeFrom: circularSquare.center,
  relativeTo: artboard.center,
  x: "150px",
  y: "280px"
});

artboard.addElement(circularSquare);

// Gradient effect with decreasing size squircles
const gradientColors = ["#e74c3c", "#e67e22", "#f39c12", "#f1c40f", "#2ecc71"];
for (let i = 0; i < 5; i++) {
  const size = 140 - i * 20;
  const gradSquare = new Square({
    size: `${size}px`,
    cornerStyle: "squircle",
    cornerRadius: `${size * 0.25}px`,
    fill: "none",
    stroke: gradientColors[i],
    strokeWidth: "4px"
  });
  
  gradSquare.position({
    relativeFrom: gradSquare.center,
    relativeTo: artboard.center,
    x: "300px",
    y: "280px"
  });
  
  artboard.addElement(gradSquare);
}

return artboard.render();

