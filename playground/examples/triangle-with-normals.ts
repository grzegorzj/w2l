import { Artboard, Triangle, Circle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1200px", height: "800px" },
  padding: "50px",
  backgroundColor: "#2c3e50"
});

// Create a large equilateral triangle
const triangle = new Triangle({
  type: "equilateral",
  a: "400px",
  style: {
    fill: "rgba(52, 152, 219, 0.3)",
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

// Visualize the sides with their normals
triangle.sides.forEach((side, index) => {
  // Add a circle at the center of each side
  const sideCenter = new Circle({
    radius: "12px",
    style: {
      fill: "#e74c3c",
      stroke: "#c0392b",
      strokeWidth: "2px"
    }
  });
  
  sideCenter.position({
    relativeFrom: sideCenter.center,
    relativeTo: side.center,
    x: "0px",
    y: "0px"
  });
  
  artboard.addElement(sideCenter);
  
  // Create circles along the outward normal (showing outward direction)
  for (let i = 1; i <= 3; i++) {
    const outwardCircle = new Circle({
      radius: `${8 - i * 2}px`,
      style: {
        fill: "#2ecc71",
        stroke: "#27ae60",
        strokeWidth: "2px"
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
  
  // Create circles along the inward normal (showing inward direction)
  for (let i = 1; i <= 2; i++) {
    const inwardCircle = new Circle({
      radius: `${6 - i * 2}px`,
      style: {
        fill: "#9b59b6",
        stroke: "#8e44ad",
        strokeWidth: "2px"
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
      distance: `${i * 25}px`
    });
    
    artboard.addElement(inwardCircle);
  }
  
  // Add circles along the side direction
  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue; // Skip center
    const dirCircle = new Circle({
      radius: "6px",
      style: {
        fill: "#f39c12",
        stroke: "#e67e22",
        strokeWidth: "2px"
      }
    });
    
    dirCircle.position({
      relativeFrom: dirCircle.center,
      relativeTo: side.center,
      x: "0px",
      y: "0px"
    });
    
    dirCircle.translate({
      along: side.direction,
      distance: `${i * 40}px`
    });
    
    artboard.addElement(dirCircle);
  }
});

// Add legend in top-right corner
const legendItems = [
  { color: "#e74c3c", label: "Side Center" },
  { color: "#2ecc71", label: "Outward Normal" },
  { color: "#9b59b6", label: "Inward Normal" },
  { color: "#f39c12", label: "Direction Vector" }
];

legendItems.forEach((item, index) => {
  const legendCircle = new Circle({
    radius: "10px",
    style: {
      fill: item.color,
      stroke: "#ecf0f1",
      strokeWidth: "2px"
    }
  });
  
  legendCircle.position({
    relativeFrom: legendCircle.center,
    relativeTo: artboard.center,
    x: "450px",
    y: `${-300 + index * 50}px`
  });
  
  artboard.addElement(legendCircle);
});

return artboard.render();

