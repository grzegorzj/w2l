import { Artboard, Rectangle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "1400px", height: "800px" },
  padding: "60px",
  backgroundColor: "#2c3e50"
});

// Sharp corners rectangle (left)
const sharpRect = new Rectangle({
  width: "300px",
  height: "200px",
  cornerStyle: "sharp",
  fill: "#3498db",
  stroke: "#2980b9",
  strokeWidth: "3px"
});

sharpRect.position({
  relativeFrom: sharpRect.center,
  relativeTo: artboard.center,
  x: "-400px",
  y: "-100px"
});

artboard.addElement(sharpRect);

// Rounded corners rectangle (center)
const roundedRect = new Rectangle({
  width: "300px",
  height: "200px",
  cornerStyle: "rounded",
  cornerRadius: "30px",
  fill: "#e74c3c",
  stroke: "#c0392b",
  strokeWidth: "3px"
});

roundedRect.position({
  relativeFrom: roundedRect.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "-100px"
});

artboard.addElement(roundedRect);

// Squircle rectangle (right)
const squircleRect = new Rectangle({
  width: "300px",
  height: "200px",
  cornerStyle: "squircle",
  cornerRadius: "50px",
  fill: "#2ecc71",
  stroke: "#27ae60",
  strokeWidth: "3px"
});

squircleRect.position({
  relativeFrom: squircleRect.center,
  relativeTo: artboard.center,
  x: "400px",
  y: "-100px"
});

artboard.addElement(squircleRect);

// Bottom row - different aspect ratios with squircle
const wideSquircle = new Rectangle({
  width: "450px",
  height: "120px",
  cornerStyle: "squircle",
  cornerRadius: "35px",
  fill: "#9b59b6",
  stroke: "#8e44ad",
  strokeWidth: "3px"
});

wideSquircle.position({
  relativeFrom: wideSquircle.center,
  relativeTo: artboard.center,
  x: "-250px",
  y: "200px"
});

artboard.addElement(wideSquircle);

// Tall rounded rectangle
const tallRect = new Rectangle({
  width: "120px",
  height: "280px",
  cornerStyle: "rounded",
  cornerRadius: "25px",
  fill: "#f39c12",
  stroke: "#e67e22",
  strokeWidth: "3px"
});

tallRect.position({
  relativeFrom: tallRect.center,
  relativeTo: artboard.center,
  x: "250px",
  y: "180px"
});

artboard.addElement(tallRect);

// Small accent squircles showing modern UI pattern
const accentColors = ["#1abc9c", "#e67e22", "#95a5a6"];
for (let i = 0; i < 3; i++) {
  const accent = new Rectangle({
    width: "80px",
    height: "80px",
    cornerStyle: "squircle",
    cornerRadius: "20px",
    fill: accentColors[i],
    stroke: "#2c3e50",
    strokeWidth: "2px"
  });
  
  accent.position({
    relativeFrom: accent.center,
    relativeTo: artboard.center,
    x: `${-100 + i * 100}px`,
    y: "-320px"
  });
  
  artboard.addElement(accent);
}

return artboard.render();

