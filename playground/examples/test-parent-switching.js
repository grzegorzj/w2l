/**
 * Test that elements properly remove themselves from artboard when added to containers
 * This ensures elements don't end up in multiple places
 */

// Create shapes - they auto-add to artboard
const circle = new Circle({
  radius: 30,
  style: { fill: "lightblue", stroke: "blue", strokeWidth: 2 }
});

const square = new Square({
  size: 40,
  style: { fill: "lightcoral", stroke: "red", strokeWidth: 2 }
});

const triangle = new Triangle({
  sideLength: 50,
  style: { fill: "lightgreen", stroke: "green", strokeWidth: 2 }
});

// Now create a container and add the shapes to it
// They should be removed from the artboard automatically
const container = new Container({
  direction: "horizontal",
  spacing: 20,
  boxModel: { padding: 20 },
  style: { fill: "#f0f0f0", stroke: "#999", strokeWidth: 1 }
});

// Add shapes to container - they should be removed from artboard
container.add(circle);
container.add(square);
container.add(triangle);

// Position the container on the artboard
container.position({
  relativeFrom: container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 50,
  y: 50
});

// Result: Container should be at (50, 50) with shapes inside it
// The shapes should NOT appear in the top-left corner (which would happen if they stayed in artboard root)

