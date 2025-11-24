/**
 * Compare fixed size vs auto-size container for blue square corner positioning
 */

import { NewContainer, NewTriangle, NewRect, NewCircle } from "./dist/index.js";

console.log("=== Fixed vs Auto-Size Comparison ===\n");

// Helper function to create and test a container
function testContainer(width, height, label) {
  console.log(`\n${label}:`);
  console.log("=".repeat(50));
  
  const container = new NewContainer({
    width,
    height,
    direction: "freeform",
    boxModel: { padding: 20 },
  });

  // Triangle
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

  // Add all squares
  const squares = [];
  sides.forEach((side, index) => {
    const square = new NewRect({
      width: side.length,
      height: side.length,
      style: {
        fill: colors[index],
        fillOpacity: 0.7,
      },
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

  console.log("After adding all squares:");
  console.log("  Container size:", container.width, "x", container.height);

  // Get blue square (index 1 - hypotenuse)
  const blueSquare = squares[1];
  const cornersBeforeCircles = blueSquare.getCorners();
  
  console.log("\nBlue square corners BEFORE adding debug circles:");
  cornersBeforeCircles.forEach((corner, i) => {
    console.log(`  Corner ${i}: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
  });

  // Add debug circles for blue square only
  cornersBeforeCircles.forEach((corner, cornerIndex) => {
    const debugCircle = new NewCircle({
      radius: 4,
      style: { fill: "white", stroke: "#3498db", strokeWidth: 2 },
    });
    
    debugCircle.position({
      relativeFrom: debugCircle.center,
      relativeTo: corner,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });
    
    container.addElement(debugCircle);
  });

  console.log("\nAfter adding debug circles:");
  console.log("  Container size:", container.width, "x", container.height);

  const cornersAfterCircles = blueSquare.getCorners();
  console.log("\nBlue square corners AFTER adding debug circles:");
  cornersAfterCircles.forEach((corner, i) => {
    console.log(`  Corner ${i}: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
  });

  // Check which circles moved
  console.log("\nCorner position changes:");
  cornersBeforeCircles.forEach((cornerBefore, i) => {
    const cornerAfter = cornersAfterCircles[i];
    const dx = cornerAfter.x - cornerBefore.x;
    const dy = cornerAfter.y - cornerBefore.y;
    const moved = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
    
    console.log(`  Corner ${i}: ${moved ? '❌ MOVED' : '✅ STABLE'} (Δx: ${dx.toFixed(1)}, Δy: ${dy.toFixed(1)})`);
  });

  // Verify circles are at corners
  console.log("\nCircle-to-corner distances:");
  for (let i = 0; i < 4; i++) {
    const circle = container.children[4 + i]; // Skip triangle + 3 squares
    const circleCenter = circle.center;
    const corner = cornersAfterCircles[i];
    
    const distance = Math.sqrt(
      (circleCenter.x - corner.x) ** 2 + 
      (circleCenter.y - corner.y) ** 2
    );
    
    const status = distance < 1 ? '✅' : '❌';
    console.log(`  Circle ${i}: ${status} ${distance.toFixed(2)}px from corner`);
    
    if (distance >= 1) {
      console.log(`    Circle at: (${circleCenter.x.toFixed(1)}, ${circleCenter.y.toFixed(1)})`);
      console.log(`    Corner at: (${corner.x.toFixed(1)}, ${corner.y.toFixed(1)})`);
    }
  }
  
  return container;
}

// Test 1: Auto-sizing (freeform mode)
testContainer("auto", "auto", "TEST 1: AUTO-SIZING");

// Test 2: Fixed sizing
testContainer(500, 500, "TEST 2: FIXED SIZE (500x500)");

console.log("\n" + "=".repeat(50));
console.log("Summary: Compare the corner changes and circle distances above");
console.log("=".repeat(50));

