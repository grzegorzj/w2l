/**
 * Test auto-artboard creation
 * This example creates shapes without explicitly creating an artboard.
 * The playground should automatically prepend artboard creation.
 */

// Just create shapes directly - no artboard needed!
const circle = new Circle({
  radius: 50,
  style: { fill: "lightblue", stroke: "blue", strokeWidth: 2 }
});

const square = new Square({
  size: 80,
  style: { fill: "lightcoral", stroke: "red", strokeWidth: 2 }
});

// Position the square to the right of the circle
square.position({
  relativeFrom: square.topLeft,
  relativeTo: circle.topRight,
  x: 20,
  y: 0
});

// The artboard should be auto-created and these shapes should render

