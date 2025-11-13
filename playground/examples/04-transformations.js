// Rotation and translation
import { Artboard, Rectangle, Circle } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#34495e"
});

// Rotated rectangles
for (let i = 0; i < 12; i++) {
  const rect = new Rectangle({
    width: 150,
    height: 30,
    style: { 
      fill: `hsl(${i * 30}, 70%, 60%)`,
      fillOpacity: "0.8"
    }
  });
  
  rect.position({
    relativeFrom: rect.center,
    relativeTo: artboard.center,
    x: 0,
    y: 0
  });
  
  rect.rotate({ deg: i * 30 });
  
  artboard.addElement(rect);
}

// Translation example - create a pattern
const baseCircle = new Circle({
  radius: 20,
  style: { fill: "#ecf0f1" }
});

baseCircle.position({
  relativeFrom: baseCircle.center,
  relativeTo: artboard.center,
  x: -150,
  y: -150
});

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 4; col++) {
    const circle = new Circle({
      radius: 20,
      style: { fill: "#ecf0f1" }
    });
    
    circle.position({
      relativeFrom: circle.center,
      relativeTo: baseCircle.center,
      x: 0,
      y: 0
    });
    
    circle.translate({ along: { x: col * 80, y: row * 80 }, distance: 1 });
    
    artboard.addElement(circle);
  }
}

artboard.render();

