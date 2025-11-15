/**
 * Test: Z-Index Functionality
 * 
 * Verifies that explicit z-index values control rendering order correctly.
 */

import { Artboard, Rectangle, Text } from '../dist/index.js';

console.log('🧪 Testing Z-Index Functionality\n');

// Test 1: Elements without z-index (should use creation order)
console.log('Test 1: Creation order (no explicit z-index)');
const artboard1 = new Artboard({
  size: { width: 200, height: 200 }
});

const rect1 = new Rectangle({ width: 100, height: 100, name: "rect1" });
const rect2 = new Rectangle({ width: 100, height: 100, name: "rect2" });
const rect3 = new Rectangle({ width: 100, height: 100, name: "rect3" });

artboard1.addElement(rect1);
artboard1.addElement(rect2);
artboard1.addElement(rect3);

const svg1 = artboard1.render();
const order1 = [];
const rect1Pos = svg1.indexOf('<!-- rect1 -->');
const rect2Pos = svg1.indexOf('<!-- rect2 -->');
const rect3Pos = svg1.indexOf('<!-- rect3 -->');
order1.push({ name: 'rect1', pos: rect1Pos });
order1.push({ name: 'rect2', pos: rect2Pos });
order1.push({ name: 'rect3', pos: rect3Pos });
order1.sort((a, b) => a.pos - b.pos);

console.log(`✓ Render order (creation order): ${order1.map(o => o.name).join(' → ')}`);
console.log(`  Expected: rect1 → rect2 → rect3`);
console.log(`  ${order1[0].name === 'rect1' && order1[1].name === 'rect2' && order1[2].name === 'rect3' ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 2: Elements with explicit z-index
console.log('Test 2: Explicit z-index values');
const artboard2 = new Artboard({
  size: { width: 200, height: 200 }
});

const rect4 = new Rectangle({ width: 100, height: 100, name: "rect4" });
const rect5 = new Rectangle({ width: 100, height: 100, name: "rect5" });
const rect6 = new Rectangle({ width: 100, height: 100, name: "rect6" });

rect4.zIndex = 20;
rect5.zIndex = 10;
rect6.zIndex = 30;

artboard2.addElement(rect4);
artboard2.addElement(rect5);
artboard2.addElement(rect6);

const svg2 = artboard2.render();
const order2 = [];
const rect4Pos = svg2.indexOf('<!-- rect4 -->');
const rect5Pos = svg2.indexOf('<!-- rect5 -->');
const rect6Pos = svg2.indexOf('<!-- rect6 -->');
order2.push({ name: 'rect4', pos: rect4Pos });
order2.push({ name: 'rect5', pos: rect5Pos });
order2.push({ name: 'rect6', pos: rect6Pos });
order2.sort((a, b) => a.pos - b.pos);

console.log(`✓ Render order (by z-index): ${order2.map(o => o.name).join(' → ')}`);
console.log(`  Expected: rect5(10) → rect4(20) → rect6(30)`);
console.log(`  ${order2[0].name === 'rect5' && order2[1].name === 'rect4' && order2[2].name === 'rect6' ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 3: Mixed - some with z-index, some without
console.log('Test 3: Mixed (some with z-index, some without)');
const artboard3 = new Artboard({
  size: { width: 200, height: 200 }
});

const rect7 = new Rectangle({ width: 100, height: 100, name: "rect7" });
const rect8 = new Rectangle({ width: 100, height: 100, name: "rect8" });
const rect9 = new Rectangle({ width: 100, height: 100, name: "rect9" });

rect7.zIndex = 5;  // Explicit higher z-index
// rect8 has no z-index (treated as 0, uses creation order)
rect9.zIndex = -5;  // Explicit lower z-index

artboard3.addElement(rect7);
artboard3.addElement(rect8);
artboard3.addElement(rect9);

const svg3 = artboard3.render();
const order3 = [];
const rect7Pos = svg3.indexOf('<!-- rect7 -->');
const rect8Pos = svg3.indexOf('<!-- rect8 -->');
const rect9Pos = svg3.indexOf('<!-- rect9 -->');
order3.push({ name: 'rect7', pos: rect7Pos });
order3.push({ name: 'rect8', pos: rect8Pos });
order3.push({ name: 'rect9', pos: rect9Pos });
order3.sort((a, b) => a.pos - b.pos);

console.log(`✓ Render order (mixed): ${order3.map(o => o.name).join(' → ')}`);
console.log(`  Expected: rect9(-5) → rect8(0/creation) → rect7(5)`);
console.log(`  ${order3[0].name === 'rect9' && order3[1].name === 'rect8' && order3[2].name === 'rect7' ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 4: Text and highlights (the actual use case)
console.log('Test 4: Text with highlight (text z-index > highlight z-index)');
const artboard4 = new Artboard({
  size: { width: 400, height: 200 }
});

const text = new Text({
  content: "Hello World",
  fontSize: "32px",
  name: "text"
});
text.zIndex = 10;

const highlight = new Rectangle({
  width: 150,
  height: 50,
  name: "highlight"
});
highlight.zIndex = 5;

// Add highlight first, then text - z-index should control order
artboard4.addElement(highlight);
artboard4.addElement(text);

const svg4 = artboard4.render();
const textPos = svg4.indexOf('<!-- text -->');
const highlightPos = svg4.indexOf('<!-- highlight -->');

console.log(`✓ Render order: ${highlightPos < textPos ? 'highlight → text' : 'text → highlight'}`);
console.log(`  Expected: highlight → text (text on top)`);
console.log(`  ${highlightPos < textPos ? '✓ PASS' : '✗ FAIL'}\n`);

// Test 5: Z-index getter/setter
console.log('Test 5: Z-index getter/setter');
const rect10 = new Rectangle({ width: 100, height: 100 });
console.log(`✓ Initial z-index: ${rect10.zIndex === undefined ? 'undefined' : rect10.zIndex}`);

rect10.zIndex = 42;
console.log(`✓ After setting to 42: ${rect10.zIndex}`);
console.log(`  ${rect10.zIndex === 42 ? '✓ PASS' : '✗ FAIL'}\n`);

// Summary
console.log('='.repeat(50));
console.log('✅ All z-index tests completed!');
console.log('='.repeat(50));

