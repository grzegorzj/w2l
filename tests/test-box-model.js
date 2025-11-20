/**
 * Test suite for CSS Box Model implementation
 * 
 * Tests the getBorderBox(), getContentBox(), and getMarginBox() methods
 * on bounded elements (Rectangle, etc.)
 */

import { Rectangle } from '../dist/index.js';

console.log('🧪 Testing Box Model Implementation...\n');

// Test 1: Basic box model dimensions
console.log('Test 1: Basic box model dimensions');
const rect1 = new Rectangle({
  width: 200,
  height: 100,
  padding: "20px",
  margin: "10px"
});

rect1.position({
  relativeFrom: rect1.topLeft,
  relativeTo: { x: "100px", y: "100px" },
  x: 0,
  y: 0
});

const borderBox = rect1.getBorderBox();
const contentBox = rect1.getContentBox();
const marginBox = rect1.getMarginBox();

console.log('Border box dimensions:', borderBox.width, 'x', borderBox.height);
console.log('Content box dimensions:', contentBox.width, 'x', contentBox.height);
console.log('Margin box dimensions:', marginBox.width, 'x', marginBox.height);

// Verify dimensions
if (borderBox.width === 200 && borderBox.height === 100) {
  console.log('✅ Border box dimensions correct');
} else {
  console.log('❌ Border box dimensions incorrect');
}

if (contentBox.width === 160 && contentBox.height === 60) {
  console.log('✅ Content box dimensions correct (200-40 x 100-40)');
} else {
  console.log('❌ Content box dimensions incorrect');
  console.log('   Expected: 160 x 60, Got:', contentBox.width, 'x', contentBox.height);
}

if (marginBox.width === 220 && marginBox.height === 120) {
  console.log('✅ Margin box dimensions correct (200+20 x 100+20)');
} else {
  console.log('❌ Margin box dimensions incorrect');
  console.log('   Expected: 220 x 120, Got:', marginBox.width, 'x', marginBox.height);
}

console.log();

// Test 2: Box positions
console.log('Test 2: Box positions');
const rect2 = new Rectangle({
  width: 100,
  height: 100,
  padding: "10px",
  margin: "5px"
});

rect2.position({
  relativeFrom: rect2.topLeft,
  relativeTo: { x: "50px", y: "50px" },
  x: 0,
  y: 0
});

const borderBox2 = rect2.getBorderBox();
const contentBox2 = rect2.getContentBox();
const marginBox2 = rect2.getMarginBox();

console.log('Border box top-left:', borderBox2.topLeft);
console.log('Content box top-left:', contentBox2.topLeft);
console.log('Margin box top-left:', marginBox2.topLeft);

// Border box should be at (50, 50)
if (borderBox2.topLeft.x === '50px' && borderBox2.topLeft.y === '50px') {
  console.log('✅ Border box position correct');
} else {
  console.log('❌ Border box position incorrect');
}

// Content box should be at (60, 60) [50 + 10 padding]
if (contentBox2.topLeft.x === '60px' && contentBox2.topLeft.y === '60px') {
  console.log('✅ Content box position correct');
} else {
  console.log('❌ Content box position incorrect');
  console.log('   Expected: 60px, 60px, Got:', contentBox2.topLeft.x, contentBox2.topLeft.y);
}

// Margin box should be at (45, 45) [50 - 5 margin]
if (marginBox2.topLeft.x === '45px' && marginBox2.topLeft.y === '45px') {
  console.log('✅ Margin box position correct');
} else {
  console.log('❌ Margin box position incorrect');
  console.log('   Expected: 45px, 45px, Got:', marginBox2.topLeft.x, marginBox2.topLeft.y);
}

console.log();

// Test 3: All position points exist
console.log('Test 3: All position points exist');
const rect3 = new Rectangle({
  width: 100,
  height: 100,
  padding: "10px"
});

const box3 = rect3.getContentBox();
const requiredProps = [
  'topLeft', 'topRight', 'bottomLeft', 'bottomRight',
  'topCenter', 'bottomCenter', 'leftCenter', 'rightCenter',
  'center', 'width', 'height'
];

let allPropsExist = true;
for (const prop of requiredProps) {
  if (!(prop in box3)) {
    console.log(`❌ Missing property: ${prop}`);
    allPropsExist = false;
  }
}

if (allPropsExist) {
  console.log('✅ All position points exist on box model objects');
}

console.log();

// Test 4: Shorthand properties
console.log('Test 4: Shorthand properties');
const rect4 = new Rectangle({
  width: 100,
  height: 100
});

if (typeof rect4.borderBox !== 'undefined') {
  console.log('✅ borderBox shorthand property exists');
} else {
  console.log('❌ borderBox shorthand property missing');
}

if (typeof rect4.contentBox !== 'undefined') {
  console.log('✅ contentBox shorthand property exists');
} else {
  console.log('❌ contentBox shorthand property missing');
}

console.log();

// Test 5: Individual padding/margin sides
console.log('Test 5: Individual padding/margin sides');
const rect5 = new Rectangle({
  width: 200,
  height: 100,
  padding: {
    top: 5,
    right: 10,
    bottom: 15,
    left: 20
  },
  margin: {
    top: 1,
    right: 2,
    bottom: 3,
    left: 4
  }
});

const contentBox5 = rect5.getContentBox();
const marginBox5 = rect5.getMarginBox();

// Content width = 200 - 20 (left) - 10 (right) = 170
// Content height = 100 - 5 (top) - 15 (bottom) = 80
if (contentBox5.width === 170 && contentBox5.height === 80) {
  console.log('✅ Content box with individual padding calculated correctly');
} else {
  console.log('❌ Content box with individual padding incorrect');
  console.log('   Expected: 170 x 80, Got:', contentBox5.width, 'x', contentBox5.height);
}

// Margin width = 200 + 4 (left) + 2 (right) = 206
// Margin height = 100 + 1 (top) + 3 (bottom) = 104
if (marginBox5.width === 206 && marginBox5.height === 104) {
  console.log('✅ Margin box with individual margins calculated correctly');
} else {
  console.log('❌ Margin box with individual margins incorrect');
  console.log('   Expected: 206 x 104, Got:', marginBox5.width, 'x', marginBox5.height);
}

console.log();
console.log('✅ Box Model Test Suite Complete!');

