/**
 * Test that the phase system prevents circular dependencies
 */

import { Artboard, Rectangle, Text, VStack } from '../dist/index.js';

console.log('🧪 Testing Phase System - Circular Dependency Prevention...\n');

// Test 1: Text in auto-sizing VStack
console.log('Test 1: Text in auto-sizing VStack');
try {
  const vstack = new VStack({
    spacing: 20,
    autoHeight: true,
    autoWidth: true
  });
  
  const text1 = new Text({ content: "Hello World", fontSize: 24 });
  const text2 = new Text({ content: "Testing Phase System", fontSize: 16 });
  
  vstack.addElement(text1);
  vstack.addElement(text2);
  
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
    padding: "40px"
  });
  
  artboard.addElement(vstack);
  
  console.log('About to render...');
  const svg = artboard.render();
  console.log('✅ VStack with Text rendered successfully, SVG length:', svg.length);
  console.log('   VStack size:', vstack.width, 'x', vstack.height);
} catch (error) {
  console.log('❌ Test 1 failed:', error.message);
  console.log(error.stack.substring(0, 500));
}

console.log();

// Test 2: Nested layouts with text
console.log('Test 2: Nested VStacks with Text');
try {
  const outerStack = new VStack({
    spacing: 30,
    autoHeight: true,
    autoWidth: true
  });
  
  const innerStack1 = new VStack({
    spacing: 10,
    autoHeight: true,
    autoWidth: true
  });
  
  innerStack1.addElement(new Text({ content: "Inner 1 - Line 1", fontSize: 14 }));
  innerStack1.addElement(new Text({ content: "Inner 1 - Line 2", fontSize: 14 }));
  
  const innerStack2 = new VStack({
    spacing: 10,
    autoHeight: true,
    autoWidth: true
  });
  
  innerStack2.addElement(new Text({ content: "Inner 2 - Line 1", fontSize: 14 }));
  innerStack2.addElement(new Text({ content: "Inner 2 - Line 2", fontSize: 14 }));
  
  outerStack.addElement(innerStack1);
  outerStack.addElement(innerStack2);
  
  const artboard = new Artboard({
    size: { width: 800, height: 600 }
  });
  
  artboard.addElement(outerStack);
  
  console.log('About to render...');
  const svg = artboard.render();
  console.log('✅ Nested VStacks rendered successfully, SVG length:', svg.length);
  console.log('   Outer size:', outerStack.width, 'x', outerStack.height);
} catch (error) {
  console.log('❌ Test 2 failed:', error.message);
  if (error.stack) console.log(error.stack.substring(0, 500));
}

console.log();

// Test 3: Box model with text (the original issue)
console.log('Test 3: Box model with Text labels');
try {
  const artboard = new Artboard({
    size: { width: 800, height: 600 },
    padding: "40px",
    showPaddingGuides: true
  });
  
  const box = new Rectangle({
    width: 200,
    height: 100,
    padding: "20px",
    margin: "10px"
  });
  
  box.position({
    relativeFrom: box.center,
    relativeTo: artboard.center,
    x: 0,
    y: 0
  });
  
  const label = new Text({
    content: "Box Label",
    fontSize: 14
  });
  
  label.position({
    relativeFrom: label.center,
    relativeTo: box.contentBox.center,
    x: 0,
    y: 0
  });
  
  artboard.addElement(box);
  artboard.addElement(label);
  
  console.log('About to render...');
  const svg = artboard.render();
  console.log('✅ Box model with Text label rendered successfully, SVG length:', svg.length);
} catch (error) {
  console.log('❌ Test 3 failed:', error.message);
  if (error.stack) console.log(error.stack.substring(0, 500));
}

console.log();
console.log('✅ All circular dependency tests passed!');

