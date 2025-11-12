/**
 * Test to verify that triangle normals are pointing in the correct directions
 * after the counter-clockwise refactor.
 */
import { Artboard, Triangle, Circle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1000px", height: "800px" },
  padding: "80px",
  backgroundColor: "#2c3e50"
});

// Create a right triangle
const triangle = new Triangle({
  type: "right",
  a: "300px",  // horizontal leg
  b: "400px",  // vertical leg
  style: {
    fill: "rgba(52, 152, 219, 0.2)",
    stroke: "#3498db",
    strokeWidth: "4px"
  }
});

// Position at center
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

artboard.addElement(triangle);

// Get the three sides
const sides = triangle.sides;

// Colors for visualization
const colors = ["#e74c3c", "#2ecc71", "#f39c12"];

// Visualize each side's outward and inward normals
sides.forEach((side, index) => {
  const color = colors[index];
  
  // Mark the center of the side
  const centerMarker = new Circle({
    radius: "10px",
    style: {
      fill: color,
      stroke: "#ecf0f1",
      strokeWidth: "2px"
    }
  });
  
  centerMarker.position({
    relativeFrom: centerMarker.center,
    relativeTo: side.center,
    x: "0px",
    y: "0px"
  });
  
  artboard.addElement(centerMarker);
  
  // Create circles along the OUTWARD normal (should point away from triangle)
  for (let i = 1; i <= 4; i++) {
    const outwardCircle = new Circle({
      radius: `${10 - i * 2}px`,
      style: {
        fill: color,
        stroke: "#ecf0f1",
        strokeWidth: "1px"
      }
    });
    
    outwardCircle.position({
      relativeFrom: outwardCircle.center,
      relativeTo: side.center,
      x: "0px",
      y: "0px"
    });
    
    outwardCircle.translate({
      along: side.outwardNormal,
      distance: `${i * 30}px`
    });
    
    artboard.addElement(outwardCircle);
  }
  
  // Create circles along the INWARD normal (should point toward triangle interior)
  for (let i = 1; i <= 2; i++) {
    const inwardCircle = new Circle({
      radius: `${6 - i * 2}px`,
      style: {
        fill: "#9b59b6",
        stroke: "#8e44ad",
        strokeWidth: "1px"
      }
    });
    
    inwardCircle.position({
      relativeFrom: inwardCircle.center,
      relativeTo: side.center,
      x: "0px",
      y: "0px"
    });
    
    inwardCircle.translate({
      along: side.inwardNormal,
      distance: `${i * 20}px`
    });
    
    artboard.addElement(inwardCircle);
  }
  
  // Mark the start and end points of each side
  const startMarker = new Circle({
    radius: "6px",
    style: {
      fill: "#ecf0f1",
      stroke: color,
      strokeWidth: "2px"
    }
  });
  
  startMarker.position({
    relativeFrom: startMarker.center,
    relativeTo: side.start,
    x: "0px",
    y: "0px"
  });
  
  artboard.addElement(startMarker);
});

// Add legend
const legendItems = [
  { color: "#e74c3c", label: "Side 1" },
  { color: "#2ecc71", label: "Side 2" },
  { color: "#f39c12", label: "Side 3" },
  { color: "#9b59b6", label: "Inward Normal" }
];

legendItems.forEach((item, i) => {
  const legendCircle = new Circle({
    radius: "8px",
    style: {
      fill: item.color,
      stroke: "#ecf0f1",
      strokeWidth: "2px"
    }
  });
  
  legendCircle.position({
    relativeFrom: legendCircle.center,
    relativeTo: artboard.center,
    x: "400px",
    y: `${-300 + i * 40}px`
  });
  
  artboard.addElement(legendCircle);
});

return artboard.render();

