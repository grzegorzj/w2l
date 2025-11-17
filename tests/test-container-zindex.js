/**
 * Test: Container Z-Index
 * 
 * Verifies that elements inside containers are properly sorted
 * with elements outside containers based on creation order and nesting depth.
 */

import { Artboard, Container, Circle, Rectangle } from '../dist/index.js';

console.log('🧪 Testing Container Z-Index\n');

// Test 1: Container children should appear above earlier-created direct artboard elements
console.log('Test 1: Container children vs direct artboard elements (nesting depth)');
const artboard1 = new Artboard({
  size: { width: 400, height: 300 }
});

// Create a background rectangle (added directly to artboard)
const background = new Rectangle({
  width: 200,
  height: 200,
  name: "background"
});
background.position({
  relativeFrom: background.center,
  relativeTo: artboard1.center,
  x: 0,
  y: 0
});
artboard1.addElement(background);

// Create a container
const container = new Container({
  size: { width: 200, height: 200 },
  name: "container"
});
container.position({
  relativeFrom: container.center,
  relativeTo: artboard1.center,
  x: 0,
  y: 0
});

// Add a circle inside the container (should appear ABOVE background due to nesting depth)
const circle = new Circle({
  radius: 50,
  name: "circle-in-container"
});
circle.position({
  relativeFrom: circle.center,
  relativeTo: container.center,
  x: 0,
  y: 0
});
container.addElement(circle);

// Add container to artboard
artboard1.addElement(container);

const svg1 = artboard1.render();
const backgroundPos = svg1.indexOf('<!-- background -->');
const circlePos = svg1.indexOf('<!-- circle-in-container -->');

console.log(`✓ Background position in SVG: ${backgroundPos}`);
console.log(`✓ Circle position in SVG: ${circlePos}`);
console.log(`  Expected: background renders before circle (circle on top)`);
console.log(`  ${backgroundPos < circlePos && backgroundPos !== -1 && circlePos !== -1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 2: Multiple containers with their children
console.log('Test 2: Multiple containers with children');
const artboard2 = new Artboard({
  size: { width: 400, height: 300 }
});

// Add a background that should be behind everything
const bg2 = new Rectangle({
  width: 400,
  height: 300,
  name: "background2"
});
artboard2.addElement(bg2);

// Container 1 with a rectangle
const container1 = new Container({
  size: { width: 100, height: 100 },
  name: "container1"
});
const rect1 = new Rectangle({
  width: 50,
  height: 50,
  name: "rect-in-container1"
});
container1.addElement(rect1);
artboard2.addElement(container1);

// Container 2 with a circle
const container2 = new Container({
  size: { width: 100, height: 100 },
  name: "container2"
});
const circle2 = new Circle({
  radius: 25,
  name: "circle-in-container2"
});
container2.addElement(circle2);
artboard2.addElement(container2);

const svg2 = artboard2.render();
const bg2Pos = svg2.indexOf('<!-- background2 -->');
const rect1Pos = svg2.indexOf('<!-- rect-in-container1 -->');
const circle2Pos = svg2.indexOf('<!-- circle-in-container2 -->');

console.log(`✓ Render order: background2(${bg2Pos}) < rect-in-container1(${rect1Pos}) < circle-in-container2(${circle2Pos})`);
console.log(`  Expected: background < container1-children < container2-children`);
const test2Pass = bg2Pos < rect1Pos && rect1Pos < circle2Pos && bg2Pos !== -1 && rect1Pos !== -1 && circle2Pos !== -1;
console.log(`  ${test2Pass ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 3: Explicit z-index should override nesting depth
console.log('Test 3: Explicit z-index overrides nesting depth');
const artboard3 = new Artboard({
  size: { width: 400, height: 300 }
});

// Background with high z-index (should be on top)
const bg3 = new Rectangle({
  width: 200,
  height: 200,
  name: "background-high-zindex"
});
bg3.zIndex = 100;
artboard3.addElement(bg3);

// Container with circle (nested, but lower z-index)
const container3 = new Container({
  size: { width: 200, height: 200 }
});
const circle3 = new Circle({
  radius: 50,
  name: "circle-low-zindex"
});
circle3.zIndex = 50;
container3.addElement(circle3);
artboard3.addElement(container3);

const svg3 = artboard3.render();
const bg3Pos = svg3.indexOf('<!-- background-high-zindex -->');
const circle3Pos = svg3.indexOf('<!-- circle-low-zindex -->');

console.log(`✓ Background (z:100) at ${bg3Pos}, Circle (z:50) at ${circle3Pos}`);
console.log(`  Expected: Circle renders before background (background on top due to higher z-index)`);
console.log(`  ${circle3Pos < bg3Pos && bg3Pos !== -1 && circle3Pos !== -1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 4: Container itself should not render (invisible)
console.log('Test 4: Containers are invisible (no visual output)');
const artboard4 = new Artboard({
  size: { width: 200, height: 200 }
});

const container4 = new Container({
  size: { width: 100, height: 100 },
  name: "invisible-container"
});
artboard4.addElement(container4);

const svg4 = artboard4.render();
// The container name should NOT appear in the SVG (containers don't render themselves)
const containerCommentPos = svg4.indexOf('<!-- invisible-container -->');

console.log(`✓ Container comment in SVG: ${containerCommentPos === -1 ? 'not found (correct)' : 'found at ' + containerCommentPos}`);
console.log(`  Expected: Container itself does not render (only its children do)`);
console.log(`  ${containerCommentPos === -1 ? '✓ PASS' : '✗ FAIL'}\n`);

// Summary
console.log('='.repeat(50));
console.log('✅ All container z-index tests completed!');
console.log('='.repeat(50));

