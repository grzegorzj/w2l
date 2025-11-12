/**
 * Simple test to verify that normals are calculated correctly
 * after the counter-clockwise refactor.
 */

import { Rectangle, Triangle } from '../dist/index.js';

console.log('🧪 Testing Normal Calculations\n');

// Helper to parse unit strings to numbers
function parseValue(value) {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace('px', ''));
}

// Helper to format vector
function formatVector(point) {
  const x = parseValue(point.x);
  const y = parseValue(point.y);
  return `(${x.toFixed(3)}, ${y.toFixed(3)})`;
}

// Test 1: Rectangle normals
console.log('📐 Test 1: Rectangle Normals');
console.log('────────────────────────────────');

const rect = new Rectangle({
  width: 100,
  height: 50,
  fill: 'blue'
});

const [top, left, bottom, right] = rect.sides;

console.log('\nRectangle: 100×50 at origin');
console.log('Expected normals for counter-clockwise:');
console.log('  Top outward:    (0, -1) - points UP');
console.log('  Left outward:   (-1, 0) - points LEFT');
console.log('  Bottom outward: (0, 1)  - points DOWN');
console.log('  Right outward:  (1, 0)  - points RIGHT');

console.log('\nActual normals:');
console.log(`  Top outward:    ${formatVector(top.outwardNormal)}`);
console.log(`  Left outward:   ${formatVector(left.outwardNormal)}`);
console.log(`  Bottom outward: ${formatVector(bottom.outwardNormal)}`);
console.log(`  Right outward:  ${formatVector(right.outwardNormal)}`);

// Verify
const topNormal = { x: parseValue(top.outwardNormal.x), y: parseValue(top.outwardNormal.y) };
const leftNormal = { x: parseValue(left.outwardNormal.x), y: parseValue(left.outwardNormal.y) };
const bottomNormal = { x: parseValue(bottom.outwardNormal.x), y: parseValue(bottom.outwardNormal.y) };
const rightNormal = { x: parseValue(right.outwardNormal.x), y: parseValue(right.outwardNormal.y) };

const epsilon = 0.001;
const topOk = Math.abs(topNormal.x - 0) < epsilon && Math.abs(topNormal.y - (-1)) < epsilon;
const leftOk = Math.abs(leftNormal.x - (-1)) < epsilon && Math.abs(leftNormal.y - 0) < epsilon;
const bottomOk = Math.abs(bottomNormal.x - 0) < epsilon && Math.abs(bottomNormal.y - 1) < epsilon;
const rightOk = Math.abs(rightNormal.x - 1) < epsilon && Math.abs(rightNormal.y - 0) < epsilon;

console.log('\nResults:');
console.log(`  Top:    ${topOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Left:   ${leftOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Bottom: ${bottomOk ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Right:  ${rightOk ? '✅ PASS' : '❌ FAIL'}`);

// Test 2: Triangle normals
console.log('\n\n📐 Test 2: Right Triangle Normals');
console.log('────────────────────────────────');

const triangle = new Triangle({
  type: 'right',
  a: 3,
  b: 4
});

const [side1, side2, side3] = triangle.sides;

console.log('\nRight Triangle: a=3, b=4 (3-4-5 triangle)');
console.log('Vertices (CCW): v0(0,0) → v1(0,4) → v2(3,0)');
console.log('\nSides:');
console.log('  Side 1: v0→v1 (left edge, going down)');
console.log('  Side 2: v1→v2 (hypotenuse, going right-up)');
console.log('  Side 3: v2→v0 (top edge, going left)');

console.log('\nActual normals:');
console.log(`  Side 1 outward: ${formatVector(side1.outwardNormal)} (should point LEFT)`);
console.log(`  Side 2 outward: ${formatVector(side2.outwardNormal)} (should point DOWN-RIGHT)`);
console.log(`  Side 3 outward: ${formatVector(side3.outwardNormal)} (should point UP)`);

// Verify side 1 (left edge going down: dir=(0,4), outward should be (-1,0))
const s1Normal = { x: parseValue(side1.outwardNormal.x), y: parseValue(side1.outwardNormal.y) };
const s1Ok = Math.abs(s1Normal.x - (-1)) < epsilon && Math.abs(s1Normal.y - 0) < epsilon;

// Verify side 3 (top edge going left: dir=(-3,0), outward should be (0,-1))
const s3Normal = { x: parseValue(side3.outwardNormal.x), y: parseValue(side3.outwardNormal.y) };
const s3Ok = Math.abs(s3Normal.x - 0) < epsilon && Math.abs(s3Normal.y - (-1)) < epsilon;

console.log('\nResults:');
console.log(`  Side 1 (left):  ${s1Ok ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Side 3 (top):   ${s3Ok ? '✅ PASS' : '❌ FAIL'}`);

// Summary
console.log('\n\n═══════════════════════════════');
const allPass = topOk && leftOk && bottomOk && rightOk && s1Ok && s3Ok;
console.log(allPass ? '✅ All tests PASSED!' : '❌ Some tests FAILED');
console.log('═══════════════════════════════\n');

process.exit(allPass ? 0 : 1);

