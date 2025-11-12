import { Artboard, Circle, Rectangle, Square, Triangle } from 'w2l';

// Create an artboard with a gradient-like background
const artboard = new Artboard({
  size: { width: "1400px", height: "900px" },
  padding: "60px",
  backgroundColor: "#1a1a2e"
});

// Create a large central circle
const centerCircle = new Circle({
  radius: "150px",
  style: {
    fill: "rgba(52, 152, 219, 0.2)",
    stroke: "#3498db",
    strokeWidth: "4px"
  }
});

centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

artboard.addElement(centerCircle);

// Create triangles pointing outward at cardinal directions
const trianglePositions = [
  { x: "0px", y: "-250px", rotation: 0 },     // Top
  { x: "250px", y: "0px", rotation: 90 },     // Right
  { x: "0px", y: "250px", rotation: 180 },    // Bottom
  { x: "-250px", y: "0px", rotation: 270 }    // Left
];

const triangleColors = ["#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"];

trianglePositions.forEach((pos, i) => {
  const tri = new Triangle({
    type: "equilateral",
    a: "120px",
    style: {
      fill: `rgba(${i === 0 ? '231, 76, 60' : i === 1 ? '243, 156, 18' : i === 2 ? '46, 204, 113' : '155, 89, 182'}, 0.8)`,
      stroke: triangleColors[i],
      strokeWidth: "3px"
    }
  });
  
  tri.position({
    relativeFrom: tri.center,
    relativeTo: artboard.center,
    x: pos.x,
    y: pos.y
  });
  
  tri.rotate({
    relativeTo: artboard.center,
    deg: pos.rotation
  });
  
  artboard.addElement(tri);
});

// Create squares at diagonal positions
const squarePositions = [
  { x: "-200px", y: "-200px" },  // Top-left
  { x: "200px", y: "-200px" },   // Top-right
  { x: "200px", y: "200px" },    // Bottom-right
  { x: "-200px", y: "200px" }    // Bottom-left
];

const squareColors = ["#1abc9c", "#e67e22", "#95a5a6", "#34495e"];

squarePositions.forEach((pos, i) => {
  const sq = new Square({
    size: "80px",
    cornerStyle: "squircle",
    cornerRadius: "20px",
    style: {
      fill: squareColors[i],
      stroke: "#ecf0f1",
      strokeWidth: "3px"
    }
  });
  
  sq.position({
    relativeFrom: sq.center,
    relativeTo: artboard.center,
    x: pos.x,
    y: pos.y
  });
  
  artboard.addElement(sq);
});

// Create small circles in a ring around the center
const ringRadius = 220;
const numCircles = 12;

for (let i = 0; i < numCircles; i++) {
  const angle = (i * 360) / numCircles;
  const circle = new Circle({
    radius: "15px",
    style: {
      fill: "#ecf0f1",
      stroke: "none"
    }
  });
  
  // Use the center circle's pointAt to position around it
  const point = centerCircle.pointAt(angle);
  
  circle.position({
    relativeFrom: circle.center,
    relativeTo: point,
    x: "70px",  // Additional offset
    y: "0px"
  });
  
  artboard.addElement(circle);
}

// Create rectangles in corners as decorative frames
const cornerRects = [
  { x: "-550px", y: "-350px", width: "150px", height: "80px" },
  { x: "550px", y: "-350px", width: "150px", height: "80px" },
  { x: "-550px", y: "350px", width: "150px", height: "80px" },
  { x: "550px", y: "350px", width: "150px", height: "80px" }
];

cornerRects.forEach((rect, i) => {
  const r = new Rectangle({
    width: rect.width,
    height: rect.height,
    cornerStyle: "rounded",
    cornerRadius: "15px",
    style: {
      fill: "rgba(236, 240, 241, 0.1)",
      stroke: "#ecf0f1",
      strokeWidth: "2px"
    }
  });
  
  r.position({
    relativeFrom: r.center,
    relativeTo: artboard.center,
    x: rect.x,
    y: rect.y
  });
  
  artboard.addElement(r);
});

// Add a small accent circle in the very center
const accentCircle = new Circle({
  radius: "25px",
  style: {
    fill: "#e74c3c",
    stroke: "#c0392b",
    strokeWidth: "3px"
  }
});

accentCircle.position({
  relativeFrom: accentCircle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

artboard.addElement(accentCircle);

return artboard.render();

