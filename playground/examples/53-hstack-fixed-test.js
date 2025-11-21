// HStackFixed Test - Testing the new positioning approach
// Combines ColumnsLayout's position() API with HStack's child arrangement logic

import { Artboard, Circle, Rectangle, Text, HStackFixed } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true
});

// Test 1: Simple HStackFixed with circles
const stack1 = new HStackFixed({
  spacing: 20,
  verticalAlign: "center",
  autoWidth: true,
  autoHeight: true,
  padding: "20px",
  style: {
    fill: "#e7f5ff",
    stroke: "#1971c2",
    strokeWidth: 2
  }
});

const circle1 = new Circle({ radius: 25, style: { fill: "#1971c2" } });
const circle2 = new Circle({ radius: 30, style: { fill: "#1864ab" } });
const circle3 = new Circle({ radius: 20, style: { fill: "#1e40af" } });

stack1.addElement(circle1);
stack1.addElement(circle2);
stack1.addElement(circle3);

// Position in center - THIS SHOULD WORK NOW!
stack1.position({
  relativeFrom: stack1.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

artboard.addElement(stack1);

// No manual positioning needed! HStackFixed should handle it automatically

// Add visual markers
const centerMarker = new Circle({
  radius: 10,
  style: {
    fill: "#ff00ff",
    stroke: "#000",
    strokeWidth: 3
  }
});

centerMarker.position({
  relativeFrom: centerMarker.center,
  relativeTo: stack1.center,
  x: 0,
  y: 0
});

artboard.addElement(centerMarker);

// Add reference crosshairs at artboard center
const artboardCenterMarker = new Circle({
  radius: 8,
  style: {
    fill: "#00ff00",
    stroke: "#000",
    strokeWidth: 2
  }
});

artboardCenterMarker.position({
  relativeFrom: artboardCenterMarker.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

artboard.addElement(artboardCenterMarker);

// Add title
const title = new Text({
  content: "HStackFixed Test - Should be centered!",
  fontSize: 18,
  fontWeight: "bold",
  style: { fill: "#1971c2" }
});

title.position({
  relativeFrom: title.bottomCenter,
  relativeTo: stack1.topCenter,
  x: 0,
  y: -20
});

artboard.addElement(title);

// Debug logging
console.log("=== HSTACK FIXED TEST ===");
console.log("Artboard center:", artboard.center);
console.log("Stack1 center:", stack1.center);
console.log("Stack1 currentPosition:", stack1.currentPosition);
console.log("Stack1 dimensions:", stack1.width, "×", stack1.height);

return artboard.render();

