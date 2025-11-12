import { Artboard, Circle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1200px", height: "800px" },
  padding: "40px",
  backgroundColor: "#ecf0f1"
});

// Create a large circle with radius
const circle1 = new Circle({
  radius: "120px",
  fill: "#3498db",
  stroke: "#2980b9",
  strokeWidth: "4px"
});

// Position at center
circle1.position({
  relativeFrom: circle1.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

// Create smaller circles around the main circle using pointAt()
const colors = ["#e74c3c", "#f39c12", "#2ecc71", "#9b59b6", "#1abc9c", "#e67e22", "#95a5a6", "#34495e"];

for (let i = 0; i < 8; i++) {
  const angle = i * 45;
  const outerCircle = new Circle({
    radius: "40px",
    fill: colors[i],
    stroke: "#2c3e50",
    strokeWidth: "2px"
  });
  
  // Get point on the main circle's circumference
  const point = circle1.pointAt(angle);
  
  // Position the small circle at that point
  outerCircle.position({
    relativeFrom: outerCircle.center,
    relativeTo: point,
    x: "80px", // Additional offset outward
    y: "0px"
  });
  
  artboard.addElement(outerCircle);
}

// Add the main circle last so it's on top
artboard.addElement(circle1);

// Create a circle with diameter (bottom center)
const circle2 = new Circle({
  diameter: "100px",
  fill: "rgba(231, 76, 60, 0.7)",
  stroke: "#c0392b",
  strokeWidth: "3px"
});

circle2.position({
  relativeFrom: circle2.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "250px"
});

artboard.addElement(circle2);

// Title text annotation (using a filled circle as a decorative element)
const titleDot = new Circle({
  radius: "15px",
  fill: "#34495e"
});

titleDot.position({
  relativeFrom: titleDot.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "-300px"
});

artboard.addElement(titleDot);

return artboard.render();

