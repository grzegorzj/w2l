// Quick test to verify unit support works
import { Artboard, Triangle } from './dist/index.js';

console.log('Testing library with string units...');

try {
  const artboard = new Artboard({
    size: { width: "800px", height: "600px" },
    backgroundColor: "white"
  });
  
  console.log('✓ Artboard created with string units');
  console.log('  Center:', artboard.center);
  
  const triangle = new Triangle({
    type: "right",
    a: "300px",
    b: "400px",
    fill: "#3498db"
  });
  
  console.log('✓ Triangle created with string units');
  console.log('  Center:', triangle.center);
  
  artboard.addElement(triangle);
  const svg = artboard.render();
  
  console.log('✓ Rendering successful');
  console.log('  SVG length:', svg.length);
  console.log('  Contains <svg>:', svg.includes('<svg'));
  
  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}

