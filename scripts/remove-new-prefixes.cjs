const fs = require('fs');
const path = require('path');

// Mappings of old names to new names
const classRenames = {
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
};

const typeRenames = {
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
    // Match whole words only using word boundaries
    const regex = new RegExp(`\\b${oldName}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newName);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const allRenames = { ...classRenames, ...typeRenames };
      if (replaceInFile(fullPath, allRenames)) {
        count++;
      }
    }
  }
  
  return count;
}

// Process /lib directory
const libDir = path.join(__dirname, '../lib');
console.log('Removing "New" prefixes from /lib...\n');
const count = processDirectory(libDir);
console.log(`\n✅ Updated ${count} files`);

