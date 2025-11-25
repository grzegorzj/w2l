const fs = require('fs');
const path = require('path');

// Same mappings
const renames = {
  'NewElement': 'Element',
  'NewShape': 'Shape',
  'NewRectangle': 'Rectangle',
  'NewArtboard': 'Artboard',
  'NewCircle': 'Circle',
  'NewRect': 'Rect',
  'NewSquare': 'Square',
  'NewTriangle': 'Triangle',
  'NewLine': 'Line',
  'NewRegularPolygon': 'RegularPolygon',
  'NewText': 'Text',
  'NewLatex': 'Latex',
  'NewFunctionGraph': 'FunctionGraph',
  'NewSide': 'Side',
  'NewImage': 'Image',
  'NewBezierCurve': 'BezierCurve',
  'NewArrow': 'Arrow',
  'NewContainer': 'Container',
  'NewArtboardConfig': 'ArtboardConfig',
  'NewCircleConfig': 'CircleConfig',
  'NewRectConfig': 'RectConfig',
  'NewSquareConfig': 'SquareConfig',
  'NewTriangleConfig': 'TriangleConfig',
  'NewLineConfig': 'LineConfig',
  'NewRegularPolygonConfig': 'RegularPolygonConfig',
  'NewTextConfig': 'TextConfig',
  'NewLatexConfig': 'LatexConfig',
  'NewFunctionGraphConfig': 'FunctionGraphConfig',
  'NewSideConfig': 'SideConfig',
  'NewImageConfig': 'ImageConfig',
  'NewBezierCurveConfig': 'BezierCurveConfig',
  'NewArrowConfig': 'ArrowConfig',
  'NewContainerConfig': 'ContainerConfig',
  'NewAnnotatedTextElement': 'AnnotatedTextElement',
  'NewAnnotatedLatexElement': 'AnnotatedLatexElement',
};

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [oldName, newName] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newName);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.basename(filePath)}`);
    return true;
  }
  return false;
}

// Process playground/examples/tests directory
const testsDir = path.join(__dirname, '../playground/examples/tests');
console.log('Updating test examples...\n');

const files = fs.readdirSync(testsDir);
let count = 0;

for (const file of files) {
  if (file.endsWith('.js')) {
    const fullPath = path.join(testsDir, file);
    if (replaceInFile(fullPath, renames)) {
      count++;
    }
  }
}

console.log(`\n✅ Updated ${count} test files`);

