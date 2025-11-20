# Function Graph Improvements - Label Density & Coordinate Retrieval

## Summary

Improved the `FunctionGraph` component with better default rendering and enhanced coordinate retrieval capabilities.

## Changes Made

### 1. Automatic Grid Spacing Calculation

**Problem:** The default `gridSpacing` of `[1, 1]` created cramped labels for many graph configurations, especially with larger domains or smaller graph sizes.

**Solution:** Implemented automatic grid spacing calculation based on pixel density:

- Added `minLabelDensity` config option (default: 50 pixels)
- Algorithm calculates optimal spacing using "nice numbers" (1, 2, 2.5, 5, 10, 20, 50, etc.)
- Ensures labels are readable with appropriate spacing
- Users can still manually override with `gridSpacing` when needed

**Implementation:**
- New method `calculateOptimalGridSpacing()` in `FunctionGraph.ts`
- Considers both domain/range and graph dimensions
- Selects spacing values that are multiples of nice numbers at appropriate magnitudes

### 2. Label Coordinate Retrieval

**Problem:** Users couldn't easily retrieve coordinates of specific labels for positioning annotations or custom elements.

**Solution:** Added six new public methods (both relative and absolute coordinate variants):

#### Relative Coordinate Methods
These return positions relative to the graph's top-left corner:
- `getLabelPosition(axis, value)` - Get specific label position
- `getAllLabelPositions(axis)` - Get all label positions
- `coordinateToPosition(x, y)` - Convert math coordinates to SVG

#### Absolute Coordinate Methods (Recommended)
These return absolute positions in artboard space, working correctly even when the graph is inside layouts:
- `getLabelPositionAbsolute(axis, value)` - Get specific label absolute position
- `getAllLabelPositionsAbsolute(axis)` - Get all label absolute positions
- `coordinateToPositionAbsolute(x, y)` - Convert math coordinates to absolute SVG

**Why absolute methods?** When graphs are inside VStack, HStack, or other layouts, relative positions need to be offset by the graph's position. Absolute methods handle this automatically.

### 3. Updated Examples

**Modified:** `playground/examples/40-function-graphs.js`
- Removed manual `gridSpacing` from trigonometric example to demonstrate auto-calculation
- Added demonstration of label coordinate retrieval

**New:** `playground/examples/41-graph-label-density.js`
- Comprehensive example demonstrating all new features
- Side-by-side comparison of different label densities
- Multiple examples of coordinate retrieval methods using absolute positions
- Annotated graph showing practical usage

**New:** `playground/examples/42-graph-coordinate-test.js`
- Simple test case for verifying coordinate system
- Corner markers and center point markers
- Console logging for debugging
- Useful for understanding the coordinate system

### 4. Documentation

**New:** `guides/FUNCTION-GRAPHS.md`
- Complete guide to label density configuration
- API reference for new methods
- Practical examples and use cases
- Design rationale

## Technical Details

### Grid Spacing Algorithm

```typescript
calculateOptimalGridSpacing(): [number, number] {
  // For each axis:
  // 1. Calculate how many labels can fit: maxLabels = pixels / minLabelDensity
  // 2. Calculate rough spacing: roughSpacing = range / maxLabels
  // 3. Find magnitude: 10^floor(log10(roughSpacing))
  // 4. Normalize and select nearest nice number (1, 2, 2.5, 5)
  // 5. Return spacing = niceNumber * magnitude
}
```

### Nice Numbers Selection

The algorithm uses these multipliers: `[1, 2, 2.5, 5]` at various magnitudes:
- For small ranges: 0.1, 0.2, 0.5, 1, 2, 5
- For medium ranges: 1, 2, 5, 10, 20, 50
- For large ranges: 10, 20, 50, 100, 200, 500

This ensures labels always appear at human-friendly values.

## Configuration Options

### New Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minLabelDensity` | `number` | `50` | Minimum pixels between axis labels |

### Existing Options (behavior unchanged)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gridSpacing` | `[number, number]` | auto-calculated | Manual override for grid spacing |

## Examples

### Default Auto-Calculated Spacing

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => Math.sin(x) },
  width: 600,
  height: 400,
  domain: [-10, 10]
  // gridSpacing auto-calculated, typically results in [2, 1] or [5, 1]
});
```

### Custom Label Density

```javascript
// More labels
const dense = new FunctionGraph({
  functions: { fn: (x) => x * x },
  width: 600,
  height: 400,
  domain: [-10, 10],
  minLabelDensity: 30  // Labels closer together
});

// Fewer labels
const sparse = new FunctionGraph({
  functions: { fn: (x) => x * x },
  width: 600,
  height: 400,
  domain: [-10, 10],
  minLabelDensity: 80  // Labels farther apart
});
```

### Label Coordinate Retrieval

```javascript
const graph = new FunctionGraph({
  functions: { fn: (x) => x * x - 4 },
  width: 600,
  height: 400,
  domain: [-5, 5]
});

// Get absolute position of x=2 label (recommended)
const x2Pos = graph.getLabelPositionAbsolute('x', 2);
marker.position({
  relativeFrom: marker.center,
  relativeTo: x2Pos,  // Direct positioning
  x: 0,
  y: 0
});

// Get all x-axis labels (absolute)
const allXLabels = graph.getAllLabelPositionsAbsolute('x');
console.log(allXLabels); // [{value: -4, position: {...}, label: "-4"}, ...]

// Convert math coordinate to absolute SVG position
const mathPos = graph.coordinateToPositionAbsolute(-3, 5);

// Or use relative methods (must reference graph.topLeft)
const x2PosRel = graph.getLabelPosition('x', 2);
marker.position({
  relativeFrom: marker.center,
  relativeTo: graph.topLeft,
  x: x2PosRel.x,
  y: x2PosRel.y
});
```

## Testing

To test the changes:

1. Build the library: `cd /path/to/w2l && npm run build`
2. Build playground: `cd playground && npm run build`
3. Start server: `npm start`
4. View examples:
   - Example 40: Function Graphs (updated with auto-spacing demo)
   - Example 41: Label Density & Coordinate Retrieval (comprehensive demo with absolute positions)
   - Example 42: Graph Coordinate Test (simple test case with console logging)

**Check browser console** in examples 41 and 42 to see detailed coordinate calculations and debugging information.

## Backwards Compatibility

✅ **Fully backwards compatible**

- Existing code with manual `gridSpacing` continues to work unchanged
- Existing code without `gridSpacing` now gets better defaults
- No breaking changes to API

## Benefits

1. **Better Defaults**: Graphs look professional without manual tuning
2. **Readable Labels**: No more cramped or overlapping labels
3. **Easier Annotations**: Simple API for positioning custom elements
4. **Flexible**: Can still manually override when needed
5. **Configurable**: `minLabelDensity` allows fine-tuning

## Future Enhancements

Potential future improvements:
- Smart label rotation for very dense graphs
- Logarithmic scale support with appropriate label spacing
- Label collision detection and adjustment
- Custom label formatting functions
- Interactive label tooltips

## Files Modified

### Library (`/lib`)
- `lib/elements/FunctionGraph.ts` - Core implementation

### Playground (`/playground`)
- `playground/examples/40-function-graphs.js` - Updated example
- `playground/examples/41-graph-label-density.js` - New comprehensive example
- `playground/examples/42-graph-coordinate-test.js` - New simple test case

### Documentation (`/guides`)
- `guides/FUNCTION-GRAPHS.md` - New comprehensive guide

### Project Prompts (`/projectPrompts`)
- `projectPrompts/24-FUNCTION-GRAPH-IMPROVEMENTS.md` - This summary

