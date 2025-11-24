// Circle pointAt feature
import { Artboard, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#2c3e50"
});

// Main circle
const mainCircle = new Circle({
  radius: 150,
  style: { 
    fill: "none",
    stroke: "#3498db",
    strokeWidth: "3"
  }
});

mainCircle.position({
  relativeFrom: mainCircle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

artboard.addElement(mainCircle);

// Center dot
const centerDot = new Circle({
  radius: 8,
  style: { fill: "#ecf0f1" }
});

centerDot.position({
  relativeFrom: centerDot.center,
  relativeTo: mainCircle.center,
  x: 0,
  y: 0
});

artboard.addElement(centerDot);

// Place circles around circumference using pointAt
const numPoints = 12;
for (let i = 0; i < numPoints; i++) {
  const angle = (i * 360) / numPoints;
  
  const dot = new Circle({
    radius: 12,
    style: { fill: `hsl(${angle}, 70%, 60%)` }
  });
  
  dot.position({
    relativeFrom: dot.center,
    relativeTo: mainCircle.pointAt(angle),
    x: 0,
    y: 0
  });
  
  artboard.addElement(dot);
}

// Create an inner pattern
const innerCircle = new Circle({
  radius: 80,
  style: { 
    fill: "none",
    stroke: "#e74c3c",
    strokeWidth: "2",
    strokeOpacity: "0.5"
  }
});

innerCircle.position({
  relativeFrom: innerCircle.center,
  relativeTo: mainCircle.center,
  x: 0,
  y: 0
});

artboard.addElement(innerCircle);

for (let i = 0; i < 8; i++) {
  const angle = (i * 360) / 8 + 22.5;
  
  const dot = new Circle({
    radius: 8,
    style: { fill: "#ecf0f1", fillOpacity: "0.7" }
  });
  
  dot.position({
    relativeFrom: dot.center,
    relativeTo: innerCircle.pointAt(angle),
    x: 0,
    y: 0
  });
  
  artboard.addElement(dot);
}

artboard.render();

