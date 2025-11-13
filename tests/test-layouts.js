/**
 * Test script for layout functionality
 * Run with: node tests/test-layouts.js
 */

import {
  Artboard,
  Container,
  Layout,
  ColumnsLayout,
  Circle,
  Rectangle,
} from "../dist/index.js";

console.log("🧪 Testing Layout System...\n");

// Test 1: Container with child transformation
console.log("Test 1: Container with child transformation");
try {
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
  });

  const container = new Container({
    size: { width: 400, height: 300 },
    padding: 20,
  });

  const circle = new Circle({ radius: 30 });
  circle.position({
    relativeTo: container.center,
    relativeFrom: circle.center,
    x: 0,
    y: 0,
  });

  container.addElement(circle);

  // Get initial positions
  const initialContainerX = container.currentPosition.x;
  const initialCircleX = circle.currentPosition.x;

  // Move container
  container.position({
    relativeTo: artboard.center,
    relativeFrom: container.center,
    x: 100,
    y: 100,
  });

  // Check if circle moved with container
  const deltaContainer = container.currentPosition.x - initialContainerX;
  const deltaCircle = circle.currentPosition.x - initialCircleX;

  if (Math.abs(deltaContainer - deltaCircle) < 0.01) {
    console.log("✅ PASS: Child moved with container");
  } else {
    console.log("❌ FAIL: Child did not move with container");
    console.log(`  Container delta: ${deltaContainer}, Circle delta: ${deltaCircle}`);
  }
} catch (error) {
  console.log("❌ FAIL: Error in test 1");
  console.error(error);
}

// Test 2: Layout creation and rendering
console.log("\nTest 2: Layout creation and rendering");
try {
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
  });

  const layout = new Layout({
    width: 400,
    height: 300,
    padding: 20,
    style: { fill: "#f0f0f0" },
  });

  const circle = new Circle({
    radius: 30,
    style: { fill: "#3498db" },
  });

  layout.addElement(circle);
  artboard.addElement(layout);

  const svg = artboard.render();

  if (svg.includes("<rect") && svg.includes("<circle")) {
    console.log("✅ PASS: Layout and child rendered correctly");
  } else {
    console.log("❌ FAIL: Layout or child not rendered");
  }
} catch (error) {
  console.log("❌ FAIL: Error in test 2");
  console.error(error);
}

// Test 3: ColumnsLayout creation
console.log("\nTest 3: ColumnsLayout creation");
try {
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
  });

  const columns = new ColumnsLayout({
    count: 3,
    gutter: 20,
    width: 600,
    height: 400,
    columnStyle: { fill: "#f0f0f0" },
  });

  // Check that columns were created
  if (columns.columns.length === 3) {
    console.log("✅ PASS: ColumnsLayout created with correct number of columns");
  } else {
    console.log(
      `❌ FAIL: Expected 3 columns, got ${columns.columns.length}`
    );
  }

  // Add elements to columns
  const circle1 = new Circle({ radius: 30 });
  const circle2 = new Circle({ radius: 30 });
  const circle3 = new Circle({ radius: 30 });

  columns.columns[0].addElement(circle1);
  columns.columns[1].addElement(circle2);
  columns.columns[2].addElement(circle3);

  if (
    columns.columns[0].children.length === 1 &&
    columns.columns[1].children.length === 1 &&
    columns.columns[2].children.length === 1
  ) {
    console.log("✅ PASS: Elements added to columns correctly");
  } else {
    console.log("❌ FAIL: Elements not added to columns correctly");
  }

  artboard.addElement(columns);
  const svg = artboard.render();

  if (svg.includes("<circle")) {
    console.log("✅ PASS: ColumnsLayout rendered correctly");
  } else {
    console.log("❌ FAIL: ColumnsLayout not rendered");
  }
} catch (error) {
  console.log("❌ FAIL: Error in test 3");
  console.error(error);
}

// Test 4: Layout-bound vs absolute positioning
console.log("\nTest 4: Layout-bound vs absolute positioning");
try {
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
  });

  const layout = new Layout({
    width: 400,
    height: 300,
  });

  layout.position({
    relativeTo: artboard.center,
    relativeFrom: layout.center,
    x: 0,
    y: 0,
  });

  const layoutBoundCircle = new Circle({ radius: 30 });
  const absoluteCircle = new Circle({ radius: 30 });

  layout.addElement(layoutBoundCircle);
  layout.addElement(absoluteCircle);

  // Position the absolute circle explicitly (breaks out of layout)
  absoluteCircle.position({
    relativeTo: artboard.topLeft,
    relativeFrom: absoluteCircle.center,
    x: 100,
    y: 100,
  });

  const initialLayoutX = layout.currentPosition.x;
  const initialBoundX = layoutBoundCircle.currentPosition.x;
  const initialAbsoluteX = absoluteCircle.currentPosition.x;

  // Move the layout
  layout.translate({
    along: { x: "1px", y: "0px" },
    distance: 50,
  });

  const layoutDelta = layout.currentPosition.x - initialLayoutX;
  const boundDelta = layoutBoundCircle.currentPosition.x - initialBoundX;
  const absoluteDelta = absoluteCircle.currentPosition.x - initialAbsoluteX;

  let passed = true;

  // Layout-bound should move with layout
  if (Math.abs(layoutDelta - boundDelta) < 0.01) {
    console.log("✅ PASS: Layout-bound element moved with layout");
  } else {
    console.log("❌ FAIL: Layout-bound element did not move with layout");
    passed = false;
  }

  // Absolute should NOT move with layout
  if (Math.abs(absoluteDelta) < 0.01) {
    console.log("✅ PASS: Absolute-positioned element stayed in place");
  } else {
    console.log(
      "❌ FAIL: Absolute-positioned element moved (should not have)"
    );
    console.log(`  Absolute delta: ${absoluteDelta}`);
    passed = false;
  }

  if (passed) {
    console.log("✅ PASS: Positioning hierarchy works correctly");
  }
} catch (error) {
  console.log("❌ FAIL: Error in test 4");
  console.error(error);
}

console.log("\n✨ Layout system tests complete!");

