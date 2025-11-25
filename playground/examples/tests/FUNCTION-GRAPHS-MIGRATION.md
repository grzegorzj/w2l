# Function Graphs Migration Summary

## Overview

Successfully migrated the FunctionGraph component and its examples from the old positioning system to the new layout system.

## Components Created

### 1. NewFunctionGraph (`lib/new/elements/FunctionGraph.ts`)

A complete port of the FunctionGraph component to the new system with the following features:

- **Mathematical Function Plotting**: Supports plotting single or multiple functions with customizable styles
- **Remarkable Points Detection**: Automatically detects and highlights:
  - Roots (x-intercepts)
  - Y-intercepts
  - Local maxima and minima
  - Inflection points
  - Vertical asymptotes
  - Discontinuities
- **Auto-calculated Grid Spacing**: Intelligently calculates optimal grid spacing based on pixel density
- **Customizable Styling**: Separate styles for grid, axes, and remarkable points
- **Position Queries**: Methods to get absolute positions of remarkable points for annotation

### Key Differences from Old System

1. **Extends NewShape** instead of Shape
2. **Uses Position type** (`{x: string, y: string}`) instead of Point
3. **Simplified positioning** - no DOM queries needed for remarkable points
4. **Debug mode** - optional bounding box visualization

## Examples Migrated

### 15-function-graphs.js (from old/40-function-graphs.js)

Comprehensive showcase of function graphing capabilities:
- 9 different function types across 3 columns
- Quadratic, trigonometric, cubic, exponential, logarithmic, rational, piecewise, absolute value, and quintic functions
- Uses **Columns layout** (replaces old GridLayout)
- Uses **NewContainer with vertical direction** (replaces old VStack)
- Demonstrates remarkable points detection and annotation

**Key Changes:**
- `GridLayout` → `Columns` (3 columns)
- `VStack` → `NewContainer` with `direction: "vertical"`
- `FunctionGraph` → `NewFunctionGraph`
- `Artboard` → `NewArtboard` with `boxModel` padding
- Positioning uses `contentBox` references

### 16-remarkable-points-debug.js (from old/43-remarkable-points-debug.js)

Debug example to verify remarkable point positioning:
- Tests coordinate retrieval accuracy
- Draws crosshairs and bounding boxes at remarkable point locations
- Uses **Columns layout** with 2 columns
- Shows how to position elements relative to remarkable points

**Key Changes:**
- `GridLayout` → `Columns` (2 columns)
- `Rectangle` → `NewRect` for crosshairs
- `Circle` → `NewCircle`
- Manual position debugging with console logs

### 17-remarkable-points-layouts.js (from old/44-remarkable-points-layouts.js)

Tests remarkable points in nested layouts:
- Horizontal container with vertical sub-containers
- Multiple graphs in different layout contexts
- Demonstrates crosshair positioning in complex layouts

**Key Changes:**
- `HStack` → `NewContainer` with `direction: "horizontal"`
- `VStack` → `NewContainer` with `direction: "vertical"`
- Nested layout composition
- Debug borders with `strokeDasharray`

## Layout System Changes

### Old System → New System

| Old Component | New Component | Notes |
|--------------|---------------|-------|
| `GridLayout` | `Columns` | Simplified column-based layout |
| `VStack` | `NewContainer` (direction: "vertical") | Unified container with direction |
| `HStack` | `NewContainer` (direction: "horizontal") | Unified container with direction |
| `Artboard` | `NewArtboard` | Uses boxModel for padding |
| `Rectangle` | `NewRect` | Simplified rectangle |
| `Circle` | `NewCircle` | Simplified circle |
| `Text` | `NewText` | Enhanced text with layout support |

## Styling Differences

### Old System
```javascript
{
  debugShowCells: true,
  style: { fill: "transparent", stroke: "#ff0000" }
}
```

### New System
```javascript
{
  style: {
    fill: "transparent",
    stroke: "#ff0000",
    strokeWidth: 2,
    strokeDasharray: "5,5"
  },
  boxModel: { padding: 20 }
}
```

## Position References

### Old System
```javascript
relativeFrom: element.topLeft,
relativeTo: parent.bottomLeft,
```

### New System
```javascript
relativeFrom: element.topLeft,
relativeTo: parent.contentBox.topLeft, // or just parent.bottomLeft
```

## Usage Example

```javascript
import { NewArtboard, NewFunctionGraph, NewText, Columns } from "w2l";

const artboard = new NewArtboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

const graph = new NewFunctionGraph({
  functions: {
    fn: (x) => x * x - 4,
    color: "#e74c3c",
  },
  width: 400,
  height: 300,
  domain: [-5, 5],
  showRemarkablePoints: true,
  debug: true,
});

artboard.addElement(graph);

// Get remarkable point positions
const roots = graph.getRemarkablePoints("root");
const rootPos = graph.getRemarkablePoint("root", 0);

// Position label relative to root
const label = new NewText({
  content: "Root",
  fontSize: 10,
});

label.position({
  relativeFrom: label.bottomCenter,
  relativeTo: rootPos,
  x: 0,
  y: -20,
});

artboard.addElement(label);
artboard.render();
```

## Testing

All three examples can be tested in the playground:
1. Navigate to the playground
2. Select examples 15, 16, or 17
3. Verify that graphs render correctly with proper axes, grids, and function curves
4. Check that remarkable points (red dots) appear at correct positions
5. Verify that crosshairs and labels align with remarkable points

## Future Enhancements

Potential improvements for the NewFunctionGraph component:
- Add support for parametric curves
- Implement polar coordinate plotting
- Add animation support for dynamic functions
- Support for multiple y-axes (dual-axis plots)
- Export to data arrays for external analysis
- Interactive point selection/highlighting
- Bezier curve fitting for smoother paths

