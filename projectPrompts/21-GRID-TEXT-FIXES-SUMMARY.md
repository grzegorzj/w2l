# Grid Text Positioning - Fixes and Improvements

## Summary

Fixed Text positioning in GridLayout and added a debugging feature to visualize grid cells.

## Issue Reported

Text elements were positioned incorrectly in GridLayout - appearing at the bottom-right of cells instead of being centered. Circles positioned correctly.

## Root Cause

GridLayout detects element types by checking for `width` and `height` properties:
- If found → treats as Rectangle (currentPosition = top-left)
- If not found → treats as Circle (currentPosition = center)

**Problem**: Text has `textWidth` and `textHeight` but not `width` and `height`
- Grid treated Text as Circle-like
- But Text's `currentPosition` is actually top-left (like Rectangle)
- Result: Text appeared in wrong position

## Fixes Implemented

### 1. Added width/height Properties to Text

**File**: `lib/geometry/Text.ts`

Added standard `width` and `height` getters that alias to `textWidth` and `textHeight`:

```typescript
get width(): number {
  return this.textWidth;
}

get height(): number {
  return this.textHeight;
}
```

**Impact**:
- GridLayout now correctly detects Text as Rectangle-like
- Text is positioned correctly (centered in cells)
- No breaking changes - purely additive

### 2. Added debugShowCells Feature (User Suggestion)

**File**: `lib/layout/GridLayout.ts`

Added optional `debugShowCells` parameter to GridLayoutConfig:

```typescript
interface GridLayoutConfig {
  // ...existing properties
  
  /**
   * Whether to show cell boundaries for debugging.
   * Renders semi-transparent rectangles for each grid cell.
   * @defaultValue false
   */
  debugShowCells?: boolean;
}
```

**Behavior**:
- When `debugShowCells: true`, renders red dashed rectangles for each cell
- Rectangles are semi-transparent and non-interactive
- Helps visualize where grid cells actually are
- Useful for debugging positioning issues

**Usage**:
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

## Examples Created

### Example 35: Text Grid Debug
**File**: `playground/examples/35-text-grid-debug.js`

Demonstrates the fix with three test cases:
1. Text-only grid (fixed)
2. Circle-only grid (reference - always worked)
3. Mixed grid (text + circles, both aligned)

### Example 36: Grid Debug Cells
**File**: `playground/examples/36-grid-debug-cells.js`

Demonstrates the `debugShowCells` feature:
1. Text grid with cell boundaries visible
2. Circle grid with cell boundaries visible
3. Mixed grid without debugging (normal appearance)

## Technical Details

### How GridLayout Positions Elements

```typescript
// Calculate cell center
cellCenterX = cell.x + cell.width / 2
cellCenterY = cell.y + cell.height / 2

// Check element type
if (element has width && height) {
  // Rectangle-like: convert center to top-left
  finalX = cellCenterX - width / 2
  finalY = cellCenterY - height / 2
} else {
  // Circle-like: use center directly
  finalX = cellCenterX
  finalY = cellCenterY
}

element.currentPosition = { x: finalX, y: finalY }
```

### Why Text Needs width/height

Different elements use different coordinate systems:

| Element | currentPosition Meaning |
|---------|------------------------|
| Circle | CENTER of circle |
| Rectangle | TOP-LEFT corner |
| Text | TOP-LEFT corner |

GridLayout needs `width`/`height` to know which system an element uses.

## Testing

### Before Fix
```
[ A ]  [ B ]  [ C ]     Expected (centered)
[   ]  [   ]  [   ]
        
[   ]  [   ]  [   ]     Actual (bottom-right)
[  A]  [  B]  [  C]
```

### After Fix
```
[ A ]  [ B ]  [ C ]     Expected (centered)
[   ]  [   ]  [   ]
        
[ A ]  [ B ]  [ C ]     Actual (centered) ✓
[   ]  [   ]  [   ]
```

### With Debug Cells
```
┌─────┐┌─────┐┌─────┐  Red dashed lines show
│  A  ││  B  ││  C  │  where cells actually are
└─────┘└─────┘└─────┘
```

## Files Modified

1. `lib/geometry/Text.ts`
   - Added `width` getter (aliases `textWidth`)
   - Added `height` getter (aliases `textHeight`)

2. `lib/layout/GridLayout.ts`
   - Added `debugShowCells` config option
   - Modified `render()` to optionally show cell boundaries

## Files Created

1. `playground/examples/35-text-grid-debug.js`
   - Test example showing the fix working

2. `playground/examples/36-grid-debug-cells.js`
   - Demo of debugShowCells feature

3. `projectPrompts/20-TEXT-GRID-FIX.md`
   - Detailed technical documentation

4. `projectPrompts/21-GRID-TEXT-FIXES-SUMMARY.md`
   - This summary document

## Usage Examples

### Basic Grid with Text (Now Fixed)
```typescript
const grid = new GridLayout({
  columns: 3,
  rows: 2,
  width: 450,
  height: 300,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center"
});

// Add text - will be centered correctly
for (let i = 0; i < 6; i++) {
  const text = new Text({
    content: String.fromCharCode(65 + i),  // A, B, C, ...
    fontSize: 32
  });
  grid.addElement(text);
}
```

### Debug Grid Positioning
```typescript
const grid = new GridLayout({
  columns: 3,
  rows: 2,
  width: 450,
  height: 300,
  debugShowCells: true,  // Show cell boundaries
  horizontalAlign: "center",
  verticalAlign: "center"
});

// Red dashed rectangles will show where cells are
```

## Benefits

1. **Text works in Grid**: Text now positions correctly, just like other shapes
2. **Better debugging**: `debugShowCells` makes it easy to see grid structure
3. **No breaking changes**: All changes are additive
4. **Consistent API**: Text now has standard `width`/`height` like other shapes

## Future Improvements

1. **Extend debug to other layouts**: Add similar debugging to SpreadLayout, StackLayout
2. **Customizable debug style**: Allow custom colors/patterns for debug visualization
3. **Type-based positioning**: Use explicit type markers instead of property duck-typing
4. **Standard dimension properties**: Ensure all elements expose consistent dimension properties

## Conclusion

Text elements now work correctly in GridLayout, and the new `debugShowCells` feature makes it easy to visualize and debug grid structures. The fix was minimal (adding two getter methods) and introduces no breaking changes.

