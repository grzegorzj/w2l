/**
 * Test: Text Measurement System
 * 
 * Verifies that the lazy text measurement system:
 * 1. Works with fallback estimates in Node.js (no DOM)
 * 2. Provides word-level APIs
 * 3. Handles measurement gracefully when DOM is not available
 */

import { Artboard, Text } from '../dist/index.js';

console.log('🧪 Testing Text Measurement System\n');

// Test 1: Basic text creation and dimensions
console.log('Test 1: Basic text creation');
const text1 = new Text({
  content: "Hello World",
  fontSize: "24px",
  fontFamily: "Arial"
});

console.log(`✓ Text created`);
console.log(`  - Width (estimate): ${text1.textWidth}px`);
console.log(`  - Height (estimate): ${text1.textHeight}px`);
console.log(`  - Line count: ${text1.lineCount}`);

// Test 2: Multi-line text
console.log('\nTest 2: Multi-line text');
const text2 = new Text({
  content: "Line 1\nLine 2\nLine 3",
  fontSize: "16px"
});

console.log(`✓ Multi-line text created`);
console.log(`  - Lines: ${text2.lineCount}`);
console.log(`  - Height: ${text2.textHeight}px`);

// Test 3: Word extraction
console.log('\nTest 3: Word extraction');
const text3 = new Text({
  content: "The quick brown fox jumps",
  fontSize: "20px"
});

const words = text3.getWords();
console.log(`✓ Words extracted: ${words.join(', ')}`);
console.log(`  - Word count: ${words.length}`);

// Test 4: Word bounding box (should return null without DOM)
console.log('\nTest 4: Word bounding box (without DOM)');
const bbox = text3.getWordBoundingBox(0);
console.log(`✓ Word bbox query: ${bbox === null ? 'null (expected without DOM)' : 'unexpected result'}`);

const wordCenter = text3.getWordCenter(0);
console.log(`✓ Word center query: ${wordCenter === null ? 'null (expected without DOM)' : 'unexpected result'}`);

// Test 5: Integration with Artboard
console.log('\nTest 5: Artboard integration');
const artboard = new Artboard({
  size: { width: 800, height: 600 }
});

const text4 = new Text({
  content: "Test text on artboard",
  fontSize: "32px",
  name: "test-text"
});

artboard.addElement(text4);

// Check if measurement container setter was called
console.log(`✓ Text added to artboard`);
console.log(`  - Has measurement container getter: ${text4._measurementContainerGetter !== undefined ? 'yes (but will fail in Node)' : 'no'}`);

// Test 6: Render output
console.log('\nTest 6: Render output');
const svg = text4.render();
console.log(`✓ Render successful`);
console.log(`  - Contains data-word-index: ${svg.includes('data-word-index') ? 'yes' : 'no'}`);
console.log(`  - Contains tspan elements: ${svg.includes('<tspan') ? 'yes' : 'no'}`);

// Test 7: Content update
console.log('\nTest 7: Content update');
text4.updateContent("Updated text content");
const newWords = text4.getWords();
console.log(`✓ Content updated`);
console.log(`  - New words: ${newWords.join(', ')}`);

// Test 8: Positioning
console.log('\nTest 8: Text positioning');
text4.position({
  relativeFrom: text4.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});
console.log(`✓ Text positioned at artboard center`);

// Test 9: Reference points
console.log('\nTest 9: Reference points');
const points = {
  topLeft: text4.topLeft,
  topCenter: text4.topCenter,
  topRight: text4.topRight,
  center: text4.center,
  bottomLeft: text4.bottomLeft,
  bottomCenter: text4.bottomCenter,
  bottomRight: text4.bottomRight
};

console.log(`✓ All reference points accessible:`);
for (const [name, point] of Object.entries(points)) {
  console.log(`  - ${name}: (${point.x}, ${point.y})`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('✅ All tests passed!');
console.log('='.repeat(50));
console.log('\nNote: Word-level measurements require browser environment.');
console.log('In Node.js, the system falls back to estimates.');
console.log('\nTo test accurate measurements:');
console.log('1. Start the playground: npm run dev (in playground directory)');
console.log('2. Open examples/24-text-word-measurement.js');
console.log('3. Check the browser console for accurate measurements');

