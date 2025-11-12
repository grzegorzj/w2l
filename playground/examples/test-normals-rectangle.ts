/**
 * Test to verify that normals are pointing in the correct directions
 * after the counter-clockwise refactor.
 */
import { Artboard, Rectangle, Circle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1000px", height: "800px" },
  padding: "80px",
  backgroundColor: "#ecf0f1"
});

// Create a simple rectangle
const rect = new Rectangle({
  width: "400px",
  height: "300px",
  fill: "rgba(52, 152, 219, 0.3)",
  stroke: "#2c3e50",
  strokeWidth: "3px"
});

// Position at center
rect.position({
  relativeFrom: rect.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

artboard.addElement(rect);

// Get the four sides: [top, left, bottom, right]
const [top, left, bottom, right] = rect.sides;

// Test data: each side should have its outward normal pointing away
const sideTests = [
  { 
    side: top, 
    name: "TOP", 
    color: "#e74c3c",
    expectedDirection: "UP (negative Y)" 
  },
  { 
    side: left, 
    name: "LEFT", 
    color: "#9b59b6",
    expectedDirection: "LEFT (negative X)" 
  },
  { 
    side: bottom, 
    name: "BOTTOM", 
    color: "#2ecc71",
    expectedDirection: "DOWN (positive Y)" 
  },
  { 
    side: right, 
    name: "RIGHT", 
    color: "#f39c12",
    expectedDirection: "RIGHT (positive X)" 
  }
];

// Visualize each side's outward normal
sideTests.forEach((test) => {
  const side = test.side;
  
  // Mark the center of the side
  const centerMarker = new Circle({
    radius: "8px",
    fill: test.color,
    stroke: "#2c3e50",
    strokeWidth: "2px"
  });
  
  centerMarker.position({
    relativeFrom: centerMarker.center,
    relativeTo: side.center,
    x: "0px",
    y: "0px"
  });
  
  artboard.addElement(centerMarker);
  
  // Create 5 circles along the outward normal to show direction
  for (let i = 1; i <= 5; i++) {
    const normalCircle = new Circle({
      radius: `${10 - i}px`,
      fill: test.color,
      stroke: "#2c3e50",
      strokeWidth: "1px"
    });
    
    normalCircle.position({
      relativeFrom: normalCircle.center,
      relativeTo: side.center,
      x: "0px",
      y: "0px"
    });
    
    normalCircle.translate({
      along: side.outwardNormal,
      distance: `${i * 25}px`
    });
    
    artboard.addElement(normalCircle);
  }
});

// Add legend
const legendY = -320;
sideTests.forEach((test, i) => {
  const legendCircle = new Circle({
    radius: "10px",
    fill: test.color,
    stroke: "#2c3e50",
    strokeWidth: "2px"
  });
  
  legendCircle.position({
    relativeFrom: legendCircle.center,
    relativeTo: artboard.center,
    x: "-400px",
    y: `${legendY + i * 40}px`
  });
  
  artboard.addElement(legendCircle);
});

return artboard.render();

