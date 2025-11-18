# Pattern-Based Querying and Highlighting

This guide explains how to find and highlight specific content in text and LaTeX elements using pattern matching.

## Overview

All text-based elements (`Text`, `LatexText`, `MixedText`) now support pattern-based querying using regular expressions or simple strings. This allows you to:

- Find specific words or phrases
- Locate LaTeX notation (powers, fractions, etc.)
- Highlight matched content dynamically
- Search case-insensitively
- Use complex regex patterns

## API Methods

### Text.findMatches(pattern)

Searches regular text content and returns all matches with their bounding boxes.

```typescript
const text = new Text({
  content: "The quick brown fox jumps over the lazy dog"
});

// Find specific words
const matches = text.findMatches(/fox|dog/);

matches.forEach(match => {
  console.log(`Found "${match.match}" at word index ${match.wordIndex}`);
  // match.bbox contains x, y, width, height for highlighting
});
```

**Returns:** `TextMatch[]`
- `match`: The matched text
- `bbox`: Bounding box `{ x, y, width, height }`
- `wordIndex`: Index of the word containing the match
- `charOffset`: Character offset in the full text

### MixedText.findMatches(pattern, options?)

Searches mixed text with embedded LaTeX. Can search in text, LaTeX, or both.

```typescript
const text = new MixedText({
  content: "Einstein's equation $E = mc^2$ relates energy and mass."
});

// Find in LaTeX only
const latexMatches = text.findMatches(/\^2/, { type: 'latex' });

// Find in text only
const textMatches = text.findMatches(/energy|mass/, { type: 'text' });

// Find in both (default)
const allMatches = text.findMatches(/E/);
```

**Options:**
- `type?: 'text' | 'latex' | 'both'` - Where to search (default: `'both'`)

**Returns:** `MixedTextMatch[]`
- `match`: The matched content
- `bbox`: Bounding box of the segment containing the match
- `segmentIndex`: Index of the segment
- `type`: 'text' or 'latex'
- `charOffset`: Character offset within the segment

### LatexText.findMatches(pattern)

Searches LaTeX source code for patterns.

```typescript
const latex = new LatexText({
  content: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
});

// Find all fraction commands
const fractions = latex.findMatches(/\\frac/);

// Find powers
const powers = latex.findMatches(/\^/);
```

**Returns:** `LatexMatch[]`
- `match`: The matched LaTeX source
- `bbox`: Bounding box of the entire formula
- `charOffset`: Character offset in the LaTeX source

**Note:** Currently returns the full formula bbox. Fine-grained part-level bboxes may be added in the future.

## Common Use Cases

### 1. Highlighting Specific Mathematical Notation

Find and highlight all power notations in LaTeX:

```typescript
const text = new MixedText({
  content: "Equations: $x^2 + y^2 = r^2$ and $E = mc^2$"
});

const powers = text.findMatches(/\^2/, { type: 'latex' });

powers.forEach(match => {
  const highlight = new Rectangle({
    width: match.bbox.width + 8,
    height: match.bbox.height + 4,
    style: { fill: "#fff3cd", opacity: 0.5 }
  });
  
  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: text.topLeft,
    x: `${match.bbox.x - 4}px`,
    y: `${match.bbox.y - 2}px`
  });
  
  artboard.addElement(highlight);
});
```

### 2. Highlighting Keywords

Highlight specific words in a paragraph:

```typescript
const text = new Text({
  content: "Machine learning uses neural networks to process data."
});

const keywords = text.findMatches(/learning|neural|data/);

keywords.forEach(match => {
  // Create highlight rectangle...
});
```

### 3. Case-Insensitive Search

Use regex flags for flexible matching:

```typescript
const text = new MixedText({
  content: "Energy is measured in Joules or JOULES"
});

// Find all variations of "joules"
const matches = text.findMatches(/joules/i);
```

### 4. Finding LaTeX Commands

Locate specific LaTeX commands in formulas:

```typescript
const latex = new LatexText({
  content: "\\frac{\\sqrt{a}}{\\sqrt{b}}"
});

// Find all square roots
const sqrts = latex.findMatches(/\\sqrt/);

// Find fractions
const fracs = latex.findMatches(/\\frac/);
```

### 5. Complex Patterns

Use regex features for advanced matching:

```typescript
// Find all variables with subscripts
text.findMatches(/[a-z]_\{[0-9]+\}/);

// Find all integrals with limits
text.findMatches(/\\int_\{.*?\}\^\{.*?\}/);

// Find numbers in text
text.findMatches(/\d+(\.\d+)?/);
```

## Pattern Syntax

Patterns can be:

1. **Strings** - Automatically escaped, matched literally
   ```typescript
   text.findMatches("energy")  // Finds exact word "energy"
   ```

2. **Regular Expressions** - Full regex power
   ```typescript
   text.findMatches(/energy|mass/i)  // Case-insensitive OR
   text.findMatches(/\^[0-9]+/)      // Powers with numbers
   ```

## Tips and Best Practices

### 1. LaTeX Escaping

Remember to escape backslashes in LaTeX patterns:

```typescript
// ✅ Correct
text.findMatches(/\\frac/)

// ❌ Wrong
text.findMatches(/\frac/)  // Matches literal "frac"
```

### 2. Segment-Level Bounding Boxes

For `MixedText`, bounding boxes are at the segment level (entire text or LaTeX block). To get more precise positioning:

- Use `type: 'latex'` to isolate LaTeX segments
- Consider splitting complex mixed text into separate elements

### 3. Performance

Pattern matching requires measurement, which happens in the browser DOM:

- Results are cached after first measurement
- Multiple searches on the same element are fast
- Avoid searching in very long texts repeatedly

### 4. Highlighting z-index

When creating highlights, set appropriate z-index values:

```typescript
text.zIndex = 10;          // Text on top
highlight.zIndex = 5;      // Highlight behind text
```

## When to Use Pattern Matching

Pattern matching with `findMatches()` is useful for:

- **Exploratory searching** - Finding patterns without modifying source
- **Unknown content** - Searching in user-generated or dynamic text
- **Quick prototyping** - Testing ideas without annotating

However, for **precise, reliable highlighting** of known formula parts, consider using [LaTeX Annotations](./LATEX-ANNOTATIONS.md) with `\cssId` and `\class` commands instead. Annotations provide:

- Element-level precision (not segment-level)
- 100% reliability (no fuzzy matching)
- Better performance (direct queries, no regex)
- Reference points for positioning

See `/playground/examples/30-latex-annotations.js` for the annotation-based approach.

## Future Enhancements

Planned improvements:

1. **Fine-grained LaTeX matching**: Character-level bounding boxes within formulas
2. **Context aware matching**: Find patterns only in specific contexts
3. **Match grouping**: Capture groups in regex patterns
4. **Span selection**: Select ranges of text/latex for highlighting

## Related Guides

- [Text Measurement](./TEXT-MEASUREMENT.md) - Understanding text bounding boxes
- [LaTeX Support](./LATEX-SUPPORT.md) - LaTeX rendering system
- [Positioning System](./POSITIONING-SYSTEM.md) - Relative positioning for highlights

