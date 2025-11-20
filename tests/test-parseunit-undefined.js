/**
 * Test parseUnit handles undefined/null gracefully
 */

import { parseUnit } from '../dist/core/units.js';

console.log('🧪 Testing parseUnit with edge cases...\n');

const tests = [
  { input: undefined, expected: 0, desc: 'undefined' },
  { input: null, expected: 0, desc: 'null' },
  { input: 0, expected: 0, desc: 'zero' },
  { input: 50, expected: 50, desc: 'number' },
  { input: '20px', expected: 20, desc: 'px string' },
  { input: '2rem', expected: 32, desc: 'rem string' },
];

let passed = 0;
let failed = 0;

tests.forEach(({ input, expected, desc }) => {
  try {
    const result = parseUnit(input);
    if (result === expected) {
      console.log(`✅ parseUnit(${desc}): ${result} === ${expected}`);
      passed++;
    } else {
      console.log(`❌ parseUnit(${desc}): ${result} !== ${expected}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ parseUnit(${desc}) threw error: ${error.message}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✅ All edge case tests passed!');
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}

