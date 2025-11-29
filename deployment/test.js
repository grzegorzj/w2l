/**
 * Test script for W2L Renderer API
 * 
 * Run with: node test.js
 */

import { executeW2LCode } from './executor.js';
import { convertSVGToImage } from './converter.js';
import fs from 'fs';

console.log('🧪 Testing W2L Renderer API\n');

// Test 1: Simple circle example
console.log('Test 1: Executing simple circle code...');
const simpleCode = `
import { Artboard, Circle } from "w2l";

const artboard = new Artboard({
  width: 400,
  height: 400,
  backgroundColor: "#f5f5f5",
  boxModel: { padding: 20 }
});

const circle = new Circle({
  radius: 100,
  style: {
    fill: "#3498db",
    stroke: "#2980b9",
    strokeWidth: 3
  }
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0
});

artboard.addElement(circle);
return artboard.render();
`;

try {
  const svg = await executeW2LCode(simpleCode);
  console.log('✅ SVG generated successfully');
  console.log(`   Length: ${svg.length} characters`);
  
  // Save SVG
  fs.writeFileSync('test-output.svg', svg);
  console.log('   Saved to: test-output.svg\n');
  
  // Test 2: Convert to PNG
  console.log('Test 2: Converting to PNG...');
  const pngBuffer = await convertSVGToImage(svg, { 
    format: 'png',
    width: 800 
  });
  console.log('✅ PNG conversion successful');
  console.log(`   Size: ${pngBuffer.length} bytes`);
  
  // Save PNG
  fs.writeFileSync('test-output.png', pngBuffer);
  console.log('   Saved to: test-output.png\n');
  
  // Test 3: Convert to JPG
  console.log('Test 3: Converting to JPG...');
  const jpgBuffer = await convertSVGToImage(svg, { 
    format: 'jpg',
    quality: 90 
  });
  console.log('✅ JPG conversion successful');
  console.log(`   Size: ${jpgBuffer.length} bytes`);
  
  // Save JPG
  fs.writeFileSync('test-output.jpg', jpgBuffer);
  console.log('   Saved to: test-output.jpg\n');
  
  console.log('🎉 All tests passed!');
  console.log('\nOutput files created:');
  console.log('  - test-output.svg');
  console.log('  - test-output.png');
  console.log('  - test-output.jpg');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

