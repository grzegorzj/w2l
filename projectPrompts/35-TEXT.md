# Comment

We need more sophisticated text

# Prompt

We have a text component right now that serves more or less like a "span", except it can't break itself at any point. I would like you to create - based off our existing text - a new component called TextArea that is capable of doing so. Initially, let's just give it one dimension (width). We'll continue from there. It should inherit from Rectangle too, and alow for padding.

Create relevant example in playground/tests

# Implementation Summary

✅ **Created TextArea Component** (`lib/elements/TextArea.ts`)

- Inherits from `Rectangle` for box model support (padding, margin, border)
- Takes a `width` parameter and wraps text to fit
- Auto-calculates height based on wrapped content
- Uses canvas measurement for accurate text width calculation
- Supports all standard font properties (size, family, weight, lineHeight)
- Separates `textColor` from `style` (style is for background, textColor is for text)
- Can render with or without background fill/stroke
- Includes debug mode to visualize boxes

✅ **Key Features**

- Text wrapping based on word boundaries
- Padding support via box model
- Background styling (fill, stroke) independent of text color
- Proper inheritance from Rectangle for positioning and transformations
- Works seamlessly with Container layouts

✅ **Test Example** (`playground/examples/tests/50-textarea-wrapping.js`)

- Demonstrates 9 different use cases
- Uses proper Container-based layout (no overlapping)
- Shows various widths, font sizes, padding configurations
- Includes examples with and without backgrounds
- All tests passing ✓

✅ **Exports Updated**

- Added to `lib/elements/index.ts`
- Added to main `lib/index.ts`
- Type definitions generated for playground

---

# Follow-up: LaTeX and Highlighting

✅ **Refactored to Use Text Component Internally**

**Problem**: Initial implementation tried to manually handle LaTeX rendering and positioning, leading to:

- LaTeX not rendering properly
- Incorrect highlight positions
- Complex, error-prone code

**Solution**: Refactored TextArea to use Text components under the hood:

- TextArea handles wrapping logic (where to break lines)
- Each line is a Text instance (handles LaTeX rendering perfectly)
- Proper measurement and positioning automatically
- Clean separation of concerns

✅ **LaTeX Support**

- Inline LaTeX using `$E = mc^2$` syntax
- Delegates to Text component for rendering (proven to work well)
- Wraps mixed text and LaTeX together seamlessly
- Accurate measurement using Text's measurement system

✅ **Word Highlighting API**

- Mark words/phrases: `{highlight:id}word{/highlight}`
- Access via `getHighlightedWord(id)` method
- Returns bounding box with reference points (topLeft, center, etc.)
- Works across wrapped lines
- `getHighlightedWordIds()` lists all highlights
- (Note: Currently returns full line bbox, could be enhanced for word-level precision)

✅ **Example Usage**

```javascript
const textArea = new TextArea({
  content: "The {highlight:formula}formula{/highlight} $E = mc^2$ is famous.",
  width: 250,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
});

// Get highlighted word position
const word = textArea.getHighlightedWord("formula");

// Create visual highlight
const highlight = new Rect({
  width: word.bbox.width,
  height: word.bbox.height,
  style: { fill: "#fff3cd", opacity: 0.5 },
});
highlight.position({
  relativeFrom: highlight.topLeft,
  relativeTo: word.topLeft,
  x: 0,
  y: 0,
});
```

✅ **New Test Example** (`playground/examples/tests/51-textarea-highlights-latex.js`)

- 7 comprehensive examples
- Shows LaTeX rendering in wrapped text
- Demonstrates word highlighting
- Combines both features
- Different widths and styling
- All tests passing ✓
