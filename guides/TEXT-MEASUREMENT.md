# Text Measurement System

## Overview

The W2L library now features a **lazy text measurement system** that provides accurate, browser-based measurements for text elements. This enables precise positioning, word-level bounding boxes, and programmatic text manipulation.

## Key Features

### 1. **Lazy Rendering**
- Text dimensions are measured on-demand when position getters are accessed
- Measurements are cached to avoid redundant calculations
- Falls back to estimates when DOM is not available (e.g., server-side)

### 2. **Accurate Dimensions**
- Uses actual browser SVG measurement APIs (`getBBox()`)
- No more character-width estimates
- Perfect for precise layouts

### 3. **Word-Level Queries**
- Get bounding boxes for individual words
- Position elements relative to specific words
- Enable highlighting and word-level interactions

## How It Works

### Architecture

```
┌─────────────┐
│  Artboard   │
└──────┬──────┘
       │ provides
       ▼
┌────────────────────┐
│ Measurement        │
│ Container          │ ← Hidden SVG element in DOM
│ (SVGElement)       │
└──────┬─────────────┘
       │ passed to
       ▼
┌────────────────────┐
│  Text Element      │
└──────┬─────────────┘
       │
       ▼
   ┌────────────────────────┐
   │ Position Getter Called │
   │ (e.g., text.center)    │
   └──────┬─────────────────┘
          │
          ▼
   ┌──────────────────┐
   │ ensureMeasured() │  ← Lazy measurement trigger
   └──────┬───────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ 1. Render to hidden SVG │
   │ 2. Call getBBox()       │
   │ 3. Cache results        │
   └─────────────────────────┘
```

### Rendering Strategy

1. **Lazy Measurement**: Text is rendered to a hidden measurement container when dimensions are first queried
2. **Word-Level Detail**: Each word is wrapped in a `<tspan>` with a `data-word-index` attribute
3. **Browser Measurements**: Actual bounding boxes are retrieved using SVG's `getBBox()` API
4. **Caching**: Measurements are cached until content changes

## API Reference

### Text Methods

#### `getWords(): string[]`
Returns all words in the text as an array.

```javascript
const text = new Text({ content: "Hello World" });
const words = text.getWords(); // ["Hello", "World"]
```

#### `getWordBoundingBox(wordIndex: number): WordBoundingBox | null`
Returns the accurate bounding box for a specific word.

```javascript
const bbox = text.getWordBoundingBox(0);
// { x: 100, y: 50, width: 45, height: 24 }
```

#### `getWordCenter(wordIndex: number): Point | null`
Returns the center point of a specific word (useful for positioning).

```javascript
const center = text.getWordCenter(0);
circle.position({
  relativeFrom: circle.center,
  relativeTo: center,
  x: "0px",
  y: "0px"
});
```

### Properties

#### `textWidth: number`
Gets the actual measured width (or estimate if DOM unavailable).

#### `textHeight: number`
Gets the actual measured height (or estimate if DOM unavailable).

## Usage Examples

### Example 1: Position Elements at Word Centers

```javascript
const text = new Text({
  content: "Hello World from W2L",
  fontSize: "36px"
});

const words = text.getWords();
words.forEach((word, index) => {
  const wordCenter = text.getWordCenter(index);
  if (wordCenter) {
    const circle = new Circle({ radius: 5 });
    circle.position({
      relativeFrom: circle.center,
      relativeTo: wordCenter,
      x: "0px",
      y: "0px"
    });
    artboard.addElement(circle);
  }
});
```

### Example 2: Highlight Specific Words

```javascript
const text = new Text({
  content: "The quick brown fox jumps",
  fontSize: "32px"
});

// Set z-index so text appears on top
text.zIndex = 10;

// Highlight the word "brown" (index 2)
const bbox = text.getWordBoundingBox(2);
if (bbox) {
  const highlight = new Rectangle({
    width: bbox.width + 4,
    height: bbox.height + 4,
    style: { fill: "yellow", opacity: 0.3 }
  });
  
  // Set lower z-index so highlight appears behind text
  highlight.zIndex = 5;
  
  highlight.position({
    relativeFrom: highlight.topLeft,
    relativeTo: { x: `${bbox.x - 2}px`, y: `${bbox.y - 2}px` },
    x: "0px",
    y: "0px"
  });
}
```

### Example 3: Accurate Layout

```javascript
const title = new Text({
  content: "My Title",
  fontSize: "48px"
});

const subtitle = new Text({
  content: "Subtitle text",
  fontSize: "24px"
});

// Position subtitle exactly below title using accurate measurements
subtitle.position({
  relativeFrom: subtitle.topCenter,
  relativeTo: title.bottomCenter,
  x: "0px",
  y: "10px" // 10px gap
});
```

## Fallback Behavior

When DOM is not available (e.g., server-side rendering or Node.js):
- Text uses character-width estimates (`fontSize * 0.5` per character)
- `getWordBoundingBox()` returns `null`
- `getWordCenter()` returns `null`
- Layout still works with estimates

This enables the library to work in both browser and server environments.

## Performance Considerations

1. **First Measurement**: Slight overhead when first querying positions (renders to hidden DOM)
2. **Cached After First Access**: Subsequent queries are instant
3. **Update Invalidation**: Calling `updateContent()` clears cache
4. **Minimal DOM Overhead**: Hidden SVG container is reused across all text elements

## Implementation Details

### Measurement Container

The `Artboard` maintains a single hidden SVG element:

```typescript
private _measurementContainer?: SVGElement;

getMeasurementContainer(): SVGElement {
  if (!this._measurementContainer) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.visibility = "hidden";
    document.body.appendChild(svg);
    this._measurementContainer = svg;
  }
  return this._measurementContainer;
}
```

### Text Rendering with Word IDs

Each word gets a unique identifier for measurement:

```html
<text ...>
  <tspan data-word-index="0">Hello</tspan>
  <tspan data-word-index="1">World</tspan>
</text>
```

## Testing

Run the test suite:

```bash
node tests/test-text-measurement.js
```

Try the examples in the playground:
- `examples/24-text-word-measurement.js` - Basic word measurement
- `examples/25-text-word-highlighting.js` - Word highlighting

## Future Enhancements

Potential additions to the text measurement system:

1. **Character-level measurements**: `getCharBoundingBox(charIndex)`
2. **Line-level queries**: `getLineBoundingBox(lineIndex)`
3. **Text paths**: Position text along curved paths
4. **Advanced typography**: Ligatures, kerning adjustments
5. **Text editing**: Interactive text with cursor positioning

## Z-Index Control

The library now supports explicit z-index values to control rendering order:

### Setting Z-Index

```javascript
const text = new Text({ content: "Hello" });
text.zIndex = 10;  // Higher values render on top

const highlight = new Rectangle({ width: 100, height: 50 });
highlight.zIndex = 5;  // Lower values render behind
```

### Z-Index Priority

Rendering order is determined by:

1. **Explicit z-index** (if set) - Higher values appear on top
2. **Nesting depth** - Deeper nested elements appear on top
3. **Creation order** - Later created elements appear on top

### Common Use Cases

**Highlights behind text:**
```javascript
text.zIndex = 10;
highlight.zIndex = 5;  // Renders behind text
```

**Overlays on top:**
```javascript
background.zIndex = 0;
content.zIndex = 5;
overlay.zIndex = 10;  // Renders on top of everything
```

## Comparison: Before vs After

### Before (Estimates Only)
```javascript
const text = new Text({ content: "Hello", fontSize: "24px" });
text.textWidth; // ~60px (estimate based on 5 chars × 12px)
// ❌ Could be wrong depending on actual font
```

### After (Lazy Measurement)
```javascript
const text = new Text({ content: "Hello", fontSize: "24px" });
artboard.addElement(text);
text.textWidth; // e.g., 53.2px (actual browser measurement)
// ✅ Accurate to the pixel
```

## Conclusion

The lazy text measurement system provides the best of both worlds:
- **Works everywhere**: Falls back gracefully without DOM
- **Accurate when needed**: Uses browser measurements for precision
- **Performance**: Lazy evaluation and caching minimize overhead
- **Developer-friendly**: Simple API for complex text queries

This enables sophisticated text-based visualizations and layouts with minimal complexity.

