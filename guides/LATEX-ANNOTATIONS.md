# LaTeX Annotation-Based Querying

This guide explains how to use LaTeX annotation commands to mark and query specific parts of mathematical formulas.

## Overview

Instead of trying to reverse-engineer which rendered element corresponds to which part of your LaTeX source, you can **explicitly annotate** parts of your formulas using LaTeX commands. This provides a clean, reliable way to:

- Mark specific formula components for later reference
- Highlight particular parts of equations
- Position elements relative to formula components
- Query and manipulate annotated elements programmatically

## Annotation Commands

W2L uses MathJax's `html` extension, which provides two annotation commands:

### `\cssId{id}{content}` - Assign Unique IDs

Marks content with a unique identifier for precise querying.

```latex
E = \cssId{mass-energy}{mc^2}
```

### `\class{classname}{content}` - Assign Classes

Marks content with a class name to identify similar elements.

```latex
\class{variable}{x}^2 + \class{variable}{y}^2 = \class{variable}{r}^2
```

## Querying Annotated Elements

Both `LatexText` and `MixedText` provide methods to query annotated elements:

### `getElementById(id: string)`

Returns a single element with the specified ID, or `null` if not found.

```typescript
const latex = new LatexText({
  content: "E = \\cssId{mass-energy}{mc^2}"
});

const element = latex.getElementById('mass-energy');
if (element) {
  console.log('Found at:', element.bbox);
  // element.bbox contains: { x, y, width, height }
}
```

### `getElementsByClass(className: string)`

Returns an array of all elements with the specified class.

```typescript
const latex = new LatexText({
  content: "\\class{var}{x}^2 + \\class{var}{y}^2 = \\class{var}{r}^2"
});

const variables = latex.getElementsByClass('var');
// Returns array of 3 elements (x, y, r)
variables.forEach(v => {
  console.log('Variable at:', v.bbox);
});
```

## Return Type

Both methods return `AnnotatedLatexElement` or `AnnotatedMixedElement` objects with the **same positioning API as other elements**:

```typescript
interface AnnotatedLatexElement {
  identifier: string;        // The ID or class name
  type: 'id' | 'class';      // Type of annotation
  bbox: {                    // Bounding box for positioning
    x: number;               // Position relative to formula's topLeft
    y: number;
    width: number;
    height: number;
  };
  element: SVGElement;       // The actual SVG element
  
  // Reference points (same as Bounded elements)
  center: Point;             // Center of the element
  topLeft: Point;            // Top-left corner
  topCenter: Point;          // Top-center
  topRight: Point;           // Top-right corner
  leftCenter: Point;         // Left-center
  rightCenter: Point;        // Right-center
  bottomLeft: Point;         // Bottom-left corner
  bottomCenter: Point;       // Bottom-center
  bottomRight: Point;        // Bottom-right corner
  
  // Convenient aliases
  top: Point;                // Alias for topCenter
  bottom: Point;             // Alias for bottomCenter
  left: Point;               // Alias for leftCenter
  right: Point;              // Alias for rightCenter
}
```

## Usage Examples

### Example 1: Highlight Specific Part

```typescript
const equation = new LatexText({
  content: "x = \\frac{-\\cssId{coefficient}{b} \\pm \\sqrt{b^2-4ac}}{2a}",
  fontSize: "36px"
});

artboard.addElement(equation);

// Query the annotated coefficient
const coef = equation.getElementById('coefficient');

if (coef) {
  // Create highlight rectangle
  const highlight = new Rectangle({
    width: coef.bbox.width + 8,
    height: coef.bbox.height + 4,
    style: {
      fill: "#fff3cd",
      opacity: 0.5
    }
  });
  
  // Use reference point for cleaner positioning
  highlight.position({
    relativeFrom: highlight.center,
    relativeTo: equation.topLeft,
    x: coef.center.x,
    y: coef.center.y
  });
  
  artboard.addElement(highlight);
}
```

### Example 2: Mark All Similar Elements

```typescript
const formula = new LatexText({
  content: "\\class{term}{a}x^2 + \\class{term}{b}x + \\class{term}{c} = 0"
});

artboard.addElement(formula);

// Query all terms
const terms = formula.getElementsByClass('term');

// Highlight each term with different colors
const colors = ['#d4edda', '#fff3cd', '#f8d7da'];

terms.forEach((term, index) => {
  const highlight = new Rectangle({
    width: term.bbox.width + 6,
    height: term.bbox.height + 4,
    style: {
      fill: colors[index],
      opacity: 0.5
    }
  });
  
  // Position using term's center reference point
  highlight.position({
    relativeFrom: highlight.center,
    relativeTo: formula.topLeft,
    x: term.center.x,
    y: term.center.y
  });
  
  artboard.addElement(highlight);
});
```

### Example 3: Mixed Text with Annotations

```typescript
const sentence = new MixedText({
  content: "Einstein's $E = \\cssId{power}{mc^2}$ relates energy and mass."
});

artboard.addElement(sentence);

// Query the power notation
const power = sentence.getElementById('power');

if (power) {
  // Highlight just the mc^2 part
  const highlight = new Rectangle({
    width: power.bbox.width + 8,
    height: power.bbox.height + 4,
    style: { fill: "#ffe4b5", opacity: 0.5 }
  });
  
  // Position using power's center reference point
  highlight.position({
    relativeFrom: highlight.center,
    relativeTo: sentence.topLeft,
    x: power.center.x,
    y: power.center.y
  });
  
  artboard.addElement(highlight);
}
```

### Example 4: Complex Formula with Multiple Annotations

```typescript
const quadratic = new LatexText({
  content: `\\cssId{result}{x} = \\frac{
    -\\cssId{coef-b}{b} \\pm \\sqrt{\\cssId{discriminant}{b^2-4ac}}
  }{\\cssId{denom}{2a}}`,
  fontSize: "40px",
  displayMode: "display"
});

artboard.addElement(quadratic);

// Define annotations with colors
const annotations = [
  { id: 'result', color: '#d4edda', label: 'Result' },
  { id: 'coef-b', color: '#fff3cd', label: 'Coefficient' },
  { id: 'discriminant', color: '#f8d7da', label: 'Discriminant' },
  { id: 'denom', color: '#d1ecf1', label: 'Denominator' }
];

// Highlight each annotated part
annotations.forEach(anno => {
  const element = quadratic.getElementById(anno.id);
  
  if (element) {
    const highlight = new Rectangle({
      width: element.bbox.width + 8,
      height: element.bbox.height + 4,
      style: {
        fill: anno.color,
        opacity: 0.5
      }
    });
    
    // Use element's center reference point
    highlight.position({
      relativeFrom: highlight.center,
      relativeTo: quadratic.topLeft,
      x: element.center.x,
      y: element.center.y
    });
    
    artboard.addElement(highlight);
  }
});
```

## Best Practices

### 1. Use Meaningful Names

```typescript
// ✅ Good
\cssId{discriminant}{b^2-4ac}
\class{coefficient}{a}

// ❌ Bad
\cssId{x1}{b^2-4ac}
\class{thing}{a}
```

### 2. IDs Must Be Unique

```typescript
// ✅ Good - each ID used once
E = \cssId{energy}{E}
m = \cssId{mass}{m}

// ❌ Bad - duplicate ID
E = \cssId{var}{E}
m = \cssId{var}{m}  // Use \class instead!
```

### 3. Classes for Similar Elements

```typescript
// ✅ Good - class for all variables
\class{variable}{x} + \class{variable}{y} + \class{variable}{z}

// ❌ Bad - separate IDs for similar elements
\cssId{x}{x} + \cssId{y}{y} + \cssId{z}{z}
```

### 4. Use Reference Points

Annotated elements provide the same reference points as other elements:

```typescript
// ✅ Good - use reference points
highlight.position({
  relativeFrom: highlight.center,
  relativeTo: formula.topLeft,
  x: element.center.x,
  y: element.center.y
});

// ⚠️ Less clean - manual calculation
highlight.position({
  relativeFrom: highlight.topLeft,
  relativeTo: formula.topLeft,
  x: `${element.bbox.x}px`,
  y: `${element.bbox.y}px`
});
```

### 5. Position with Reference Points

Annotated element reference points are coordinates relative to the parent formula. Use them with the parent as `relativeTo`:

```typescript
const element = formula.getElementById('power');
const marker = new Circle({ radius: 5 });

// Position relative to parent formula, using element's reference point with offset
// Using the convenient 'top' alias instead of 'topCenter'
marker.position({
  relativeFrom: marker.center,
  relativeTo: formula.topLeft,
  x: element.top.x,
  y: `${parseFloat(element.top.y) - 10}px`  // 10px above
});
```

For centered highlights, it's even simpler:

```typescript
const highlight = new Rectangle({
  width: element.bbox.width + 8,
  height: element.bbox.height + 4
});

// Center on the element
highlight.position({
  relativeFrom: highlight.center,
  relativeTo: formula.topLeft,
  x: element.center.x,
  y: element.center.y
});
```

You can also use convenient aliases like `top`, `bottom`, `left`, `right` for cleaner code:

```typescript
// Position marker at the top of the formula
marker.position({
  relativeFrom: marker.center,
  relativeTo: formula.top,
  x: 0,
  y: 0,
});

// Position indicator to the right of an annotated element
indicator.position({
  relativeFrom: indicator.left,
  relativeTo: formula.topLeft,
  x: `${parseFloat(element.right.x) + 5}px`,  // 5px to the right
  y: element.right.y
});
```

### 6. Set z-index Correctly

```typescript
formula.zIndex = 10;      // Formula on top
highlight.zIndex = 5;     // Highlight behind formula
```

## Limitations

1. **LaTeX Segments Only**: Annotations only work in LaTeX segments (not in plain text parts of MixedText)

2. **MathJax Required**: The `html` extension must be loaded (already configured in the playground)

3. **Browser-Side Only**: Querying happens in the browser after rendering

4. **CSS Escape**: IDs and classes must be valid CSS identifiers (use letters, numbers, hyphens, underscores)

## Comparison with Pattern Matching

| Feature | Annotations (`\cssId`, `\class`) | Pattern Matching (`findMatches`) |
|---------|----------------------------------|----------------------------------|
| **Precision** | Exact, element-level | Approximate, segment-level |
| **Control** | Explicit marking required | Automatic search |
| **Reliability** | 100% reliable | Best-effort |
| **Use Case** | Known parts to highlight | Search for patterns |
| **Setup** | Requires source modification | Works with any source |

**Recommendation**: Use annotations when you know what parts you want to highlight. Use pattern matching for exploratory searching.

## Complete Example

See `/playground/examples/30-latex-annotations.js` for a comprehensive demonstration including:

- Single ID annotation with highlighting
- Multiple class annotations
- Complex formula with multiple IDs
- MixedText with annotations
- Different highlight styles

## Related Guides

- [LaTeX Support](./LATEX-SUPPORT.md) - LaTeX rendering system
- [Pattern Matching](./PATTERN-MATCHING.md) - Alternative querying approach
- [Positioning System](./POSITIONING-SYSTEM.md) - Relative positioning for highlights

