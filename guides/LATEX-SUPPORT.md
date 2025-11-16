# LaTeX Support in W2L

W2L now includes comprehensive support for rendering LaTeX mathematical notation with the same measurement and positioning capabilities as regular text.

## Overview

The LaTeX support follows the same philosophy as the complex text features:
- **Lazy measurement**: LaTeX is rendered and measured only when needed
- **Browser-accurate**: Uses actual browser rendering for precise measurements
- **Part-level access**: Can query coordinates of individual formula components
- **Seamless integration**: Works with the existing positioning system

## Components

### 1. LatexText

Renders standalone LaTeX formulas with measurement capabilities.

#### Basic Usage

```typescript
import { Artboard, LatexText } from "w2l";

const artboard = new Artboard({
  size: { width: 800, height: 600 }
});

// Create a LaTeX formula
const formula = new LatexText({
  content: "E = mc^2",
  fontSize: "36px",
  displayMode: "inline"
});

// Position it
formula.position({
  relativeFrom: formula.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

artboard.addElement(formula);
artboard.render();
```

#### Configuration Options

- **content**: The LaTeX string (e.g., `"\\frac{a}{b}"`, `"\\sum_{i=1}^n x_i"`)
- **fontSize**: Size of the formula (default: `"16px"`)
- **displayMode**: `"inline"` for smaller inline math, `"display"` for larger block math (default: `"inline"`)
- **name**: Optional identifier for debugging
- **style**: Visual styling properties

#### Measurement Methods

```typescript
// Get dimensions
const width = formula.latexWidth;
const height = formula.latexHeight;

// Get reference points
const center = formula.center;
const topLeft = formula.topLeft;
// ... (all standard positioning points)

// Query formula parts
const parts = formula.getAvailableParts(); // ["mord-0", "mbin-1", ...]
const bbox = formula.getPartBoundingBox("mord-0");
const partCenter = formula.getPartCenter("mord-0");
```

### 2. MixedText

Embeds LaTeX formulas within regular text using `$...$` (inline) or `$$...$$` (display mode) markers.

#### Basic Usage

```typescript
import { Artboard, MixedText } from "w2l";

const artboard = new Artboard({
  size: { width: 900, height: 600 }
});

// Create text with embedded formulas
const text = new MixedText({
  content: "Einstein's equation $E = mc^2$ relates energy and mass.",
  fontSize: "20px",
  fontFamily: "Georgia"
});

text.position({
  relativeFrom: text.topLeft,
  relativeTo: artboard.topLeft,
  x: "50px",
  y: "100px"
});

artboard.addElement(text);
artboard.render();
```

#### Configuration Options

- **content**: Text with embedded LaTeX markers (`$...$` or `$$...$$`)
- **fontSize**: Size of the text (default: `"16px"`)
- **fontFamily**: Font for text portions (default: `"sans-serif"`)
- **fontWeight**: Weight for text portions (default: `"normal"`)
- **lineHeight**: Line height multiplier (default: `1.2`)
- **name**: Optional identifier
- **style**: Visual styling properties

#### Measurement Methods

```typescript
// Get dimensions
const width = text.textWidth;
const height = text.textHeight;

// Get reference points
const center = text.center;

// Query segments
const segments = text.getSegments();
// Returns: [{ type: "text", content: "...", index: 0 }, 
//           { type: "latex", content: "E = mc^2", index: 1 }, ...]

const bbox = text.getSegmentBoundingBox(1); // Get bbox of second segment
const segmentCenter = text.getSegmentCenter(1);
```

## Examples

### Example 26: Basic LaTeX Rendering

Demonstrates various mathematical formulas:
- Einstein's equation: `E = mc^2`
- Quadratic formula: `x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}`
- Euler's identity: `e^{i\pi} + 1 = 0`
- Gaussian integral: `\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}`
- Basel problem: `\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}`

### Example 27: LaTeX with Part Highlighting

Shows how to:
- Query available formula parts
- Get bounding boxes for parts
- Highlight specific components
- Position elements relative to formula parts

### Example 28: Mixed Text with Embedded LaTeX

Demonstrates:
- Inline formulas within sentences
- Multiple formulas in one text block
- Display mode formulas embedded in text
- Highlighting individual segments
- Natural language with mathematical notation

## Implementation Details

### KaTeX Integration

The LaTeX rendering uses KaTeX, a fast math typesetting library:
- Loaded via CDN in the playground HTML
- Renders to HTML/MathML that can be embedded in SVG using `foreignObject`
- Provides accurate browser-level measurements

### Measurement Process

1. When a LaTeX element is added to an artboard, it receives a measurement container getter
2. On first dimension/position query, the element:
   - Renders the LaTeX using KaTeX
   - Creates a temporary DOM element
   - Measures using `getBoundingClientRect()`
   - Caches the measurements
3. Subsequent queries use cached measurements

### Part Identification

For `LatexText`, parts are identified by KaTeX's internal CSS classes:
- `mord`: Ordinary symbols (letters, numbers)
- `mbin`: Binary operators (+, -, ×, ÷)
- `mrel`: Relational operators (=, <, >)
- `mop`: Large operators (∑, ∫, ∏)
- `mfrac`: Fractions
- `msqrt`: Square roots

For `MixedText`, segments are numbered sequentially and identified as "text" or "latex" type.

## Best Practices

### 1. Use Inline for Sentences

```typescript
const text = new MixedText({
  content: "The formula $a^2 + b^2 = c^2$ is fundamental.",
  fontSize: "18px"
});
```

### 2. Use Display Mode for Emphasis

```typescript
const text = new MixedText({
  content: "The quadratic formula: $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$",
  fontSize: "18px"
});
```

### 3. Escape Backslashes Properly

LaTeX commands need double backslashes in JavaScript strings:
```typescript
// Correct
content: "\\frac{a}{b}"
content: "\\sum_{i=1}^n"

// Incorrect
content: "\frac{a}{b}"  // Escape sequence interpreted by JS
```

### 4. Use Raw Strings When Available

If your environment supports template literals:
```typescript
const latex = String.raw`\int_0^\infty e^{-x^2} dx`;
```

### 5. Check Part Availability

Not all formulas will have queryable parts:
```typescript
const parts = formula.getAvailableParts();
if (parts.length > 0) {
  const bbox = formula.getPartBoundingBox(parts[0]);
  // ... use bbox
}
```

## Limitations

1. **Browser Environment**: LaTeX rendering requires a browser with KaTeX loaded
2. **Font Consistency**: LaTeX uses its own fonts, which may not match surrounding text perfectly
3. **Part Granularity**: Part identification depends on KaTeX's internal structure
4. **No Line Breaking**: LaTeX formulas don't automatically break across lines in `MixedText`

## Future Enhancements

Potential improvements:
- Custom part annotations for more precise highlighting
- Line-breaking support for long formulas in mixed text
- Chemistry notation support (mhchem)
- Better integration with text baseline alignment
- SVG-native rendering option (without foreignObject)

## See Also

- [Complex Text Guide](./COMPLEX-TEXT.md) - Philosophy and approach to text measurement
- [Positioning System](./POSITIONING-SYSTEM.md) - How positioning works in W2L
- [Text Measurement Guide](./TEXT-MEASUREMENT.md) - Details on text measurement system

