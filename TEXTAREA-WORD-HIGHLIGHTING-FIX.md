# TextArea Word-Level Highlighting Fix

## Problem

The `TextArea.getHighlightedWord()` method was returning bounding boxes for entire lines instead of specific highlighted words. This caused highlight rectangles to cover the entire line rather than just the marked words.

## Root Cause

The highlighting system had several issues:

1. **Line Content Tracking**: The code was storing untrimmed line content but creating Text instances with trimmed content, causing a mismatch.

2. **Position Tracking Across Lines**: When content wrapped across multiple lines, the position tracking in `cleanContent` wasn't properly synchronized with the actual line start positions.

3. **Measurement Approach**: The initial attempt to use `\cssId` LaTeX annotations for measurement failed because:
   - `\cssId` only works within LaTeX formulas (`$...$`), not in plain text
   - `Text.getElementById()` only finds annotated elements within LaTeX, not plain text

4. **DOM Dependency**: The measurement system requires a DOM (`document` object) to calculate text widths, which isn't available in Node.js test environments.

## Solution

### 1. Fixed Line Content Storage
```typescript
// Store the TRIMMED line content (matching what's rendered)
const trimmedContent = lineContent.trim();
this._lineContents.push(trimmedContent);
```

### 2. Enhanced Highlight Tracking
Added precise position tracking within each line:
```typescript
private _highlightMap: Map<
  string,
  {
    lineIndex: number;
    highlightId: string;
    highlightText: string;
    startInLine: number;  // Position within the trimmed line
    endInLine: number;
  }
> = new Map();
```

### 3. Direct Text Measurement
Instead of using LaTeX annotations, the code now:
1. Creates temporary `Text` instances for the text before and after the highlight
2. Measures their widths to calculate the precise x-offset and highlight width
3. Uses these measurements to construct an accurate bounding box

### 4. Fallback for Non-DOM Environments
When `document` is undefined (e.g., in Node.js tests):
```typescript
// Character-based estimation fallback
const totalChars = lineContent.length;
const lineWidth = textInstance.textWidth;
const avgCharWidth = lineWidth / totalChars;

xOffset = startInLine * avgCharWidth;
highlightWidth = (endInLine - startInLine) * avgCharWidth;
```

This provides approximate positioning in test environments while maintaining precise measurements in browser environments.

## Result

- ✅ Highlights now target specific words/phrases, not entire lines
- ✅ Works with both plain text and LaTeX content
- ✅ Accurate in browser environments (playground)
- ✅ Reasonable approximations in test environments (Node.js)
- ✅ Multiple highlights on the same line work correctly
- ✅ Highlights across different lines are independently positioned

## Example

```javascript
const textArea = new TextArea({
  content: "The {highlight:quick}quick{/highlight} brown fox jumps over the {highlight:lazy}lazy{/highlight} dog.",
  width: 400,
  fontSize: 16,
});

// Get bounding boxes for specific highlighted words
const quickBox = textArea.getHighlightedWord('quick');
const lazyBox = textArea.getHighlightedWord('lazy');

// quickBox.bbox will be the exact dimensions of "quick"
// lazyBox.bbox will be the exact dimensions of "lazy"
// NOT the entire line!
```

## Files Modified

- `lib/elements/TextArea.ts`: Complete rewrite of `getHighlightedWord()` method and highlight tracking logic
- `playground/examples/tests/51-textarea-highlights-latex.js`: Added debug circles to visualize highlight bounding boxes

## Testing

To verify the fix:
1. Run example 51 in the playground
2. Check that highlight rectangles only cover the marked words
3. Look at the debug circles at the corners of each highlight bbox
4. Compare with examples 09 and 10 which show LaTeX-level word highlighting

