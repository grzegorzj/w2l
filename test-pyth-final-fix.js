/**
 * Final test of Pythagorean example with bbox fix
 */

import { NewArtboard, NewContainer, NewTriangle, NewRect, NewCircle } from "./dist/index.js";

console.log("=== Pythagorean Final Fix Test ===\n");

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: "#2c3e50",
  boxModel: { padding: 50 },
});

const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform",
  boxModel: { padding: 20 },
});

const triangle = new NewTriangle({
  type: "right",
  a: 120,
  b: 90,
  orientation: "bottomLeft",
  style: { fill: "#34495e" },
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: container.contentBox.center,
  x: 0,
  y: 0,
  boxReference: "contentBox",
});

container.addElement(triangle);

const sides = triangle.sides;
const colors = ["#e74c3c", "#3498db", "#2ecc71"];
const squares = [];

sides.forEach((side, index) => {
  const square = new NewRect({
    width: side.length,
    height: side.length,
    style: { fill: colors[index], fillOpacity: 0.7 },
  });

  square.position({
    relativeFrom: square.center,
    relativeTo: side.center,
    x: 0,
    y: 0,
    boxReference: "contentBox",
  });

  square.rotate(side.angle);
  square.translate(side.outwardNormal, side.length / 2);

  container.addElement(square);
  squares.push(square);
});

console.log("1. All squares added");
console.log("   Container size:", container.width, "x", container.height);

// Get blue square corners BEFORE adding circles
const blueSquare = squares[1];
const cornersBeforeCircles = blueSquare.getCorners();

console.log("\n2. Blue square corners BEFORE adding debug circles:");
cornersBeforeCircles.forEach((corner, i) => {
  console.log(`   Corner ${i}: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
});

// Add ALL debug circles for ALL squares
let totalCircles = 0;
squares.forEach((square, squareIndex) => {
  const corners = square.getCorners();
  corners.forEach((corner) => {
    const debugCircle = new NewCircle({
      radius: 4,
      style: { fill: "white", stroke: colors[squareIndex], strokeWidth: 2 },
    });
    
    debugCircle.position({
      relativeFrom: debugCircle.center,
      relativeTo: corner,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });
    
    container.addElement(debugCircle);
    totalCircles++;
  });
});

console.log("\n3. All debug circles added");
console.log("   Container size:", container.width, "x", container.height);
console.log("   Total circles:", totalCircles);

// Check blue square corners AFTER adding circles
const cornersAfterCircles = blueSquare.getCorners();

console.log("\n4. Blue square corners AFTER adding debug circles:");
cornersAfterCircles.forEach((corner, i) => {
  console.log(`   Corner ${i}: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
});

// Calculate corner shifts
console.log("\n5. Corner shifts:");
let maxShift = 0;
for (let i = 0; i < 4; i++) {
  const dx = cornersAfterCircles[i].x - cornersBeforeCircles[i].x;
  const dy = cornersAfterCircles[i].y - cornersBeforeCircles[i].y;
  const shift = Math.sqrt(dx * dx + dy * dy);
  maxShift = Math.max(maxShift, shift);
  
  const status = shift < 1 ? '✅ STABLE' : `❌ MOVED ${shift.toFixed(1)}px`;
  console.log(`   Corner ${i}: ${status}`);
}

// Verify all circles are at corners
let correctCircles = 0;
squares.forEach((square, squareIndex) => {
  const corners = square.getCorners();
  corners.forEach((corner, cornerIndex) => {
    const circleIndex = 1 + squares.length + (squareIndex * 4) + cornerIndex;
    const circle = container.children[circleIndex];
    
    if (circle) {
      const distance = Math.sqrt(
        (circle.center.x - corner.x) ** 2 + 
        (circle.center.y - corner.y) ** 2
      );
      
      if (distance < 1) correctCircles++;
    }
  });
});

console.log(`\n6. Circle accuracy: ${correctCircles}/${totalCircles} correct`);

if (maxShift < 1 && correctCircles === totalCircles) {
  console.log("\n✅ PERFECT! All corners stable and all debug circles correctly positioned!");
} else {
  console.log("\n⚠️  Results:");
  if (maxShift >= 1) console.log(`   - Max corner shift: ${maxShift.toFixed(1)}px`);
  if (correctCircles < totalCircles) console.log(`   - ${totalCircles - correctCircles} circles mispositioned`);
}

