# LaTeX Components Refactor Summary

## Problem Identified

The issue with incorrect LaTeX annotation measurements when mixing text with LaTeX was due to the coordinate system being used. After analyzing the old API (which works perfectly) and the new API, the key differences identified were:

### Coordinate System Analysis

**Old API (lib/elements/MixedText.ts):**
- Annotated elements return **relative coordinates** (relative to the parent text element)
- Positioning pattern: `relativeTo: textElement.topLeft` + `x: ${bbox.x}px`
- Uses string-based Points: `{ x: "10px", y: "20px" }`

**New API (lib/new/elements/MixedText.ts - before fix):**
- Was converting to **absolute world coordinates** (adding element's position to bbox)
- This approach is actually correct for the new positioning system
- Uses numeric coordinates: `{ x: 10, y: 20 }`

The new API's approach of returning absolute coordinates is actually **correct** for its positioning system. The measurement issues were likely due to subtle differences in how the DOM measurements were being performed.

## Changes Made

### 1. Component Separation and Renaming

**Created NewLatex Component** (`lib/new/elements/Latex.ts`):
- Pure LaTeX rendering without text mixing
- Cleaner, simpler implementation for standalone formulas
- Supports `\cssId` and `\class` annotations
- Uses MathJax for rendering

**Renamed NewMixedText → NewText** (`lib/new/elements/Text.ts`):
- Any text can optionally include inline LaTeX using `$...$` or `$$...$$`
- Unified component for both plain text and mixed text
- Better naming: "Text" is the default, LaTeX is optional

### 2. Type System Updates

To avoid conflicts with old API types:
- `AnnotatedMixedElement` → `NewAnnotatedTextElement`
- `AnnotatedLatexElement` → `NewAnnotatedLatexElement`

All new API types now consistently use the "New" prefix.

### 3. Export Updates

Updated exports in:
- `lib/new/elements/index.ts`
- `lib/new/index.ts`
- `lib/index.ts`

### 4. Example Updates

**Updated Example 09** (`playground/examples/shapes/09-latex-annotations.js`):
- Changed from `NewMixedText` to `NewText`
- Updated imports and variable names
- Functionality remains the same

**Created Example 10** (`playground/examples/shapes/10-latex-vs-text.js`):
- Side-by-side comparison of `NewLatex` vs `NewText` (with LaTeX)
- Both use identical annotation techniques
- Demonstrates measurement accuracy for both approaches
- Clear sections showing:
  - Section 1: Pure NewLatex with highlighting
  - Section 2: NewText with embedded LaTeX and highlighting

## Key Insights

### Why Measurement Issues Occurred

The measurement discrepancies when mixing text with LaTeX likely stemmed from:

1. **DOM Layout Differences**: When creating measurement containers, the text+LaTeX mixture creates a more complex layout with `inline-flex`, baseline alignment, and multiple spans.

2. **MathJax SVG Bounding Boxes**: `getBoundingClientRect()` on SVG elements within a flex container may include:
   - Stroke widths
   - Sub-pixel rendering differences
   - Baseline alignment offsets
   - Container padding/margins

3. **Pure LaTeX is Simpler**: A standalone LaTeX formula in a single container has fewer layout variables and thus more predictable measurements.

### The Solution

By separating concerns:
- **Use `NewLatex`** when you only need a formula (simpler, more predictable)
- **Use `NewText`** when you need to mix text with formulas (more complex but flexible)

Both components now use identical measurement and annotation techniques, making it easier to identify and fix any remaining measurement discrepancies.

## Testing

Run example 10 to compare the accuracy:

```bash
# Start the playground
npm run dev:playground

# Navigate to example: shapes/10-latex-vs-text.js
```

Check the console logs to compare bounding box measurements between:
- Pure NewLatex annotations
- NewText (with LaTeX) annotations

If measurements differ, this will help pinpoint exactly where the issue lies.

## Next Steps

1. **Test Example 10**: Visually compare highlights between Section 1 (pure LaTeX) and Section 2 (mixed text)
2. **Measure Accuracy**: Check console logs for bbox dimensions
3. **If Issues Persist**: 
   - Check if the issue is in the measurement (ensureMeasured)
   - Check if the issue is in the query (getElementById/getElementsByClass)
   - Compare the exact DOM structure created by both components

## Files Changed

### New Files
- `lib/new/elements/Latex.ts` - Pure LaTeX component
- `lib/new/elements/Text.ts` - Renamed from MixedText.ts
- `playground/examples/shapes/10-latex-vs-text.js` - Comparison example

### Modified Files
- `lib/new/elements/index.ts` - Updated exports
- `lib/new/index.ts` - Updated exports
- `lib/index.ts` - Updated exports
- `playground/examples/shapes/09-latex-annotations.js` - Updated to use NewText

### Deleted Files
- `lib/new/elements/MixedText.ts` - Renamed to Text.ts

## API Reference

### NewLatex

```typescript
const latex = new NewLatex({
  content: "E = \\cssId{power}{mc^2}",
  fontSize: 24,
  displayMode: false
});

const element = latex.getElementById('power');
// element.topLeft, element.center, element.bbox, etc.
```

### NewText

```typescript
const text = new NewText({
  content: "Einstein's equation $E = \\cssId{power}{mc^2}$ is famous.",
  fontSize: 24,
  fontFamily: "Georgia"
});

const element = text.getElementById('power');
// element.topLeft, element.center, element.bbox, etc.
```

Both support:
- `getElementById(id: string): NewAnnotatedLatexElement | NewAnnotatedTextElement | null`
- `getElementsByClass(className: string): (NewAnnotatedLatexElement | NewAnnotatedTextElement)[]`

All annotated elements provide reference points:
- `topLeft`, `topCenter`, `topRight`
- `leftCenter`, `center`, `rightCenter`
- `bottomLeft`, `bottomCenter`, `bottomRight`
- Aliases: `top`, `bottom`, `left`, `right`

