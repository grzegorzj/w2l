# Text Grid Positioning Fix

## Problem

Text elements were positioned incorrectly in GridLayout - appearing at the bottom-right of cells instead of being centered. Circles and other shapes positioned correctly.

## Root Cause

The issue was in how GridLayout detects element types to position them:

```typescript
// GridLayout.positionElementInCell()
if (elem._width !== undefined && elem._height !== undefined) {
  // Rectangle-like: currentPosition is TOP-LEFT
  finalX = cellTargetX - elem._width / 2;
  finalY = cellTargetY - elem._height / 2;
} else if (elem.width !== undefined && elem.height !== undefined) {
  // Rectangle-like: currentPosition is TOP-LEFT
  finalX = cellTargetX - elem.width / 2;
  finalY = cellTargetY - elem.height / 2;
} else {
  // Circle-like: currentPosition is CENTER
  finalX = cellTargetX;
  finalY = cellTargetY;
}
```

**The Problem:**
- Text has `textWidth` and `textHeight` properties
- But GridLayout looks for `width` and `height` properties
- Without these properties, Grid treats Text like a Circle
- But Text's `currentPosition` is actually the TOP-LEFT (like Rectangle)
- This mismatch caused Text to appear in the wrong position

## Solution

Added `width` and `height` getters to the Text class that alias to `textWidth` and `textHeight`:

```typescript
// lib/geometry/Text.ts
get width(): number {
  return this.textWidth;
}

get height(): number {
  return this.textHeight;
}
```

Now GridLayout can properly detect Text as a Rectangle-like element and position it correctly.

## Technical Details

### Element Positioning Modes

Different elements have different coordinate systems for `currentPosition`:

1. **Circle**: `currentPosition` is the CENTER
   - Makes sense because circles are defined by center + radius
   
2. **Rectangle/Text**: `currentPosition` is the TOP-LEFT
   - Makes sense for rectangular shapes with width/height

GridLayout needs to know which mode an element uses to convert from cell-center coordinates to the element's `currentPosition`.

### Why The Bug Occurred

1. Grid calculates cell center: `(cellX + cellWidth/2, cellY + cellHeight/2)`
2. For Rectangle-like elements, Grid converts: `finalPos = cellCenter - (width/2, height/2)`
3. For Circle-like elements, Grid uses: `finalPos = cellCenter` (no conversion)
4. Text was detected as Circle-like (no `width`/`height` found)
5. So Grid set `currentPosition = cellCenter`
6. But Text interprets `currentPosition` as top-left!
7. Result: Text appeared offset to the bottom-right

### The Fix

By adding `width` and `height` properties to Text:
1. Grid detects Text as Rectangle-like ✓
2. Grid converts cell-center to top-left ✓
3. Text interprets position as top-left ✓
4. Text appears centered in cell ✓

## Testing

### Before Fix
```
Grid Cell: [     ]
Expected:  [  T  ]  (centered)
Actual:    [     ]
           [    T]  (bottom-right)
```

### After Fix
```
Grid Cell: [     ]
Expected:  [  T  ]  (centered)
Actual:    [  T  ]  (centered) ✓
```

### Test Examples

- `playground/examples/32-text-in-grid.js` - Original test (now fixed)
- `playground/examples/35-text-grid-debug.js` - Debug visualization

## Files Changed

- `lib/geometry/Text.ts` - Added `width` and `height` getters

## Impact

- **Breaking**: None - this only adds new properties
- **Fixes**: Text now positions correctly in GridLayout
- **Side effects**: Text now works properly with any layout that checks for `width`/`height`

## Future Improvements

### 1. Cell Visualization (User Suggestion)

Add debug option to GridLayout to show cell boundaries:

```typescript
const grid = new GridLayout({
  columns: 3,
  rows: 2,
  width: 400,
  height: 300,
  debugShowCells: true,  // Show cell boundaries
  style: { fill: "#f0f0f0" }
});
```

This would render semi-transparent rectangles for each cell to help debug positioning.

### 2. Consistent Property Names

Consider standardizing dimension properties across all elements:
- All elements should have `width` and `height` (or equivalent)
- Specialized names (like `textWidth`, `radius`) can remain as aliases

### 3. Type-Based Positioning

Instead of duck-typing (`width` property check), use explicit type markers:

```typescript
interface PositioningMode {
  anchorPoint: "topLeft" | "center";
}
```

Each element declares its positioning mode explicitly.

## Conclusion

Text now positions correctly in GridLayout by exposing standard `width`/`height` properties. This allows GridLayout's type detection to work properly and apply the correct coordinate conversion for Text elements.

