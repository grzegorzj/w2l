# Advanced Layouts

This guide covers the advanced layout capabilities in w2l, including SpreadLayout and GridLayout, which provide powerful tools for arranging multiple elements with consistent spacing and alignment.

## Overview

W2L provides several layout types for organizing elements:

1. **ColumnsLayout** - Divides space into vertical columns
2. **SpreadLayout** - Distributes elements with flexible spacing (horizontal or vertical)
3. **GridLayout** - Arranges elements in a grid pattern
4. **Container** - Invisible bounded container for grouping

All layouts support the **immutability principle**: once elements are arranged and the layout is positioned, the arrangement becomes fixed. This allows you to selectively move individual elements without disrupting the overall layout structure.

## SpreadLayout

SpreadLayout distributes elements evenly along a horizontal or vertical axis with various spacing and justification options.

### Basic Usage

```javascript
import { Artboard, SpreadLayout, Circle } from "w2l";

const spread = new SpreadLayout({
  direction: "horizontal",  // or "vertical"
  width: 600,
  height: 100,
  justify: "space-between",
  align: "center"
});

// Add elements
for (let i = 0; i < 5; i++) {
  const circle = new Circle({ radius: 30 });
  spread.addElement(circle);
}

// Position the layout
spread.position({
  relativeTo: artboard.center,
  relativeFrom: spread.center,
  x: 0,
  y: 0
});
```

### Justification Options

The `justify` property controls how elements are distributed along the main axis:

#### `"space-between"` (default)
Elements are evenly distributed with space between them. First and last elements are at the edges.

```javascript
const spread = new SpreadLayout({
  direction: "horizontal",
  width: 600,
  height: 100,
  justify: "space-between"
});
```

Result: `[●----●----●----●----●]`

#### `"space-around"`
Elements are evenly distributed with equal space around each element (half space at edges).

```javascript
const spread = new SpreadLayout({
  direction: "horizontal",
  width: 600,
  height: 100,
  justify: "space-around"
});
```

Result: `[-●---●---●---●---●-]`

#### `"space-evenly"`
Elements are evenly distributed with equal space between all gaps (including edges).

```javascript
const spread = new SpreadLayout({
  direction: "horizontal",
  width: 600,
  height: 100,
  justify: "space-evenly"
});
```

Result: `[--●--●--●--●--●--]`

#### `"start"`, `"center"`, `"end"`
Elements are grouped at the start, center, or end with fixed spacing.

```javascript
const spread = new SpreadLayout({
  direction: "horizontal",
  width: 600,
  height: 100,
  justify: "start",
  spacing: 20  // Fixed 20px between elements
});
```

### Alignment Options

The `align` property controls alignment perpendicular to the spread direction:

#### Horizontal Spread
- `"start"` - Align to top
- `"center"` - Center vertically (default)
- `"end"` - Align to bottom

#### Vertical Spread
- `"start"` - Align to left
- `"center"` - Center horizontally (default)
- `"end"` - Align to right

### Fixed Spacing

Instead of using justification, you can specify exact spacing:

```javascript
const spread = new SpreadLayout({
  direction: "vertical",
  width: 200,
  height: 500,
  spacing: 30,  // Exactly 30px between elements
  justify: "center"  // Centers the whole group
});
```

### Examples

See playground examples:
- `27-spread-layout-horizontal.js` - Horizontal spread with different justify modes
- `28-spread-layout-vertical.js` - Vertical spread with different alignments
- `30-layout-absolute-positioning.js` - Moving elements out of spreads

## GridLayout

GridLayout arranges elements in a grid with configurable rows, columns, and gaps.

### Basic Usage

```javascript
import { Artboard, GridLayout, Circle } from "w2l";

const grid = new GridLayout({
  columns: 4,
  rows: 3,
  width: 500,
  height: 400,
  gap: 10,
  horizontalAlign: "center",
  verticalAlign: "center"
});

// Add 12 elements (4 columns × 3 rows)
for (let i = 0; i < 12; i++) {
  const circle = new Circle({ radius: 30 });
  grid.addElement(circle);
}

grid.position({
  relativeTo: artboard.center,
  relativeFrom: grid.center,
  x: 0,
  y: 0
});
```

### Grid Dimensions

You can specify dimensions in three ways:

#### 1. Fixed Columns and Rows
```javascript
const grid = new GridLayout({
  columns: 4,
  rows: 3,
  // Creates exactly 4×3 grid
});
```

#### 2. Auto-Calculate Rows
```javascript
const grid = new GridLayout({
  columns: 5,
  // Rows calculated from element count
  // 13 elements → 5×3 grid
});
```

#### 3. Auto-Calculate Both (Square Grid)
```javascript
const grid = new GridLayout({
  // Both calculated to be square-ish
  // 16 elements → 4×4 grid
  // 15 elements → 4×4 grid (last cell empty)
});
```

### Gap Configuration

Control spacing between grid cells:

```javascript
// Uniform gap
const grid = new GridLayout({
  columns: 3,
  rows: 3,
  gap: 10  // 10px between all cells
});

// Different horizontal and vertical gaps
const grid = new GridLayout({
  columns: 3,
  rows: 3,
  columnGap: 15,  // 15px between columns
  rowGap: 20      // 20px between rows
});
```

### Cell Alignment

Control how elements are positioned within their cells:

```javascript
const grid = new GridLayout({
  columns: 4,
  rows: 3,
  horizontalAlign: "left",    // "left", "center", "right"
  verticalAlign: "top",       // "top", "center", "bottom"
});
```

### Fixed Cell Sizes

Specify exact cell dimensions:

```javascript
const grid = new GridLayout({
  columns: 5,
  cellWidth: 80,   // Each cell is 80px wide
  cellHeight: 80,  // Each cell is 80px tall
  gap: 5
});
```

### Cell Fitting

Make elements resize to fit their cells:

```javascript
const grid = new GridLayout({
  columns: 3,
  rows: 3,
  fitCells: true,  // Elements resize to fill cells
  gap: 10
});
```

### Getting Grid Information

Access grid structure after arrangement:

```javascript
// Get calculated dimensions
const { columns, rows } = grid.getGridDimensions();
console.log(`Grid is ${columns}×${rows}`);

// Get specific cell information
const cell = grid.getCell(0, 0);  // Top-left cell
console.log(`Cell at (0,0): x=${cell.x}, y=${cell.y}`);
```

### Examples

See playground examples:
- `29-grid-layout.js` - Various grid configurations
- `30-layout-absolute-positioning.js` - Moving elements out of grids

## Layout Immutability

All layouts follow an **immutability principle** once arranged:

### How It Works

1. **Default Behavior**: Elements added to a layout are positioned according to the layout's rules (columns, spread, grid, etc.)

2. **Absolute Positioning**: When you explicitly call `position()` on an element that's inside a layout, it switches to "absolute positioning mode" and breaks free from the layout

3. **Other Elements Stay Fixed**: Moving one element doesn't affect the positions of other elements in the layout

### Example

```javascript
const grid = new GridLayout({
  columns: 3,
  rows: 3,
  width: 400,
  height: 400,
  gap: 10
});

// Add 9 circles
const circles = [];
for (let i = 0; i < 9; i++) {
  const circle = new Circle({ radius: 30 });
  grid.addElement(circle);
  circles.push(circle);
}

// Position the grid
grid.position({
  relativeTo: artboard.center,
  relativeFrom: grid.center,
  x: 0,
  y: 0
});

// NOW: Move just the center circle
circles[4].position({
  relativeFrom: circles[4].center,
  relativeTo: circles[4].center,
  x: 50,  // Move 50px right
  y: 50   // Move 50px down
});

// Result:
// - The center circle moves
// - All other 8 circles stay in their grid positions
// - The grid structure remains intact
```

### Why This Matters

This design enables two important use cases:

1. **Consistent Layouts**: Create structured arrangements where elements stay in place
2. **Selective Adjustments**: Fine-tune individual element positions without disrupting the overall layout

### Column Immutability

The same principle applies to ColumnsLayout:

```javascript
const columns = new ColumnsLayout({
  count: 3,
  width: 600,
  height: 400,
  gutter: 20
});

// Add elements to columns
columns.columns[0].addElement(circle1);
columns.columns[0].addElement(circle2);
columns.columns[0].addElement(circle3);

// Move just circle2
circle2.position({
  relativeFrom: circle2.center,
  relativeTo: circle2.center,
  x: 20,  // Nudge 20px to the right
  y: 0
});

// Result: circle1 and circle3 stay in place
```

Furthermore, **the number of columns is fixed at creation time**. There's no API to add or remove columns after a ColumnsLayout is created. This ensures the layout structure remains stable and predictable.

### Testing

See `26-column-absolute-positioning.js` and `30-layout-absolute-positioning.js` for complete examples demonstrating this behavior.

## Common Patterns

### Navigation Bar

```javascript
const navbar = new SpreadLayout({
  direction: "horizontal",
  width: 800,
  height: 60,
  justify: "space-around",
  align: "center",
  style: { fill: "#333" }
});

["Home", "About", "Services", "Contact"].forEach(text => {
  const button = new Text({ content: text, fontSize: 18 });
  navbar.addElement(button);
});
```

### Icon Grid

```javascript
const iconGrid = new GridLayout({
  columns: 6,
  rows: 4,
  width: 600,
  height: 400,
  gap: 20,
  horizontalAlign: "center",
  verticalAlign: "center"
});

// Add 24 icons
for (let i = 0; i < 24; i++) {
  const icon = new Circle({ radius: 25 });
  iconGrid.addElement(icon);
}
```

### Vertical List

```javascript
const list = new SpreadLayout({
  direction: "vertical",
  width: 300,
  height: 500,
  justify: "start",
  align: "start",
  spacing: 15
});

items.forEach(item => {
  list.addElement(item);
});
```

### Dashboard Layout

```javascript
// Create grid for dashboard widgets
const dashboard = new GridLayout({
  columns: 3,
  rows: 2,
  width: 1200,
  height: 800,
  columnGap: 20,
  rowGap: 20
});

// Add 6 widget panels
for (let i = 0; i < 6; i++) {
  const widget = new Rectangle({
    width: 380,
    height: 380,
    cornerStyle: "rounded",
    cornerRadius: 10
  });
  dashboard.addElement(widget);
}
```

## Tips and Best Practices

### 1. Add Elements Before Positioning

For best results, add all elements to a layout before positioning the layout itself:

```javascript
// ✅ Good
const grid = new GridLayout({ columns: 3, rows: 3 });
grid.addElement(element1);
grid.addElement(element2);
grid.addElement(element3);
grid.position({ ... });

// ⚠️ May not work as expected
const grid = new GridLayout({ columns: 3, rows: 3 });
grid.position({ ... });
grid.addElement(element1);  // May not arrange properly
```

### 2. Use Appropriate Layouts

- **ColumnsLayout**: When you need defined vertical columns with individual control
- **SpreadLayout**: When distributing elements with flexible spacing along one axis
- **GridLayout**: When arranging elements in a 2D grid pattern
- **Container**: When you just need grouping without automatic arrangement

### 3. Alignment vs. Justification

- **Justify**: Controls distribution along the main axis (the spread direction)
- **Align**: Controls position perpendicular to the main axis

### 4. Responsive Sizing

Layouts calculate element positions based on their current sizes. If elements have dynamic sizes, arrange them after sizing:

```javascript
const circle = new Circle({ radius: 30 });
// Resize if needed
circle._radius = 40;
// Then add to layout
grid.addElement(circle);
```

### 5. Nested Layouts

You can nest layouts for complex arrangements:

```javascript
const mainGrid = new GridLayout({ columns: 2, rows: 2 });

const subSpread = new SpreadLayout({
  direction: "horizontal",
  width: 300,
  height: 100,
  justify: "space-evenly"
});

// Add elements to subSpread
for (let i = 0; i < 3; i++) {
  subSpread.addElement(new Circle({ radius: 20 }));
}

// Add subSpread as one element in mainGrid
mainGrid.addElement(subSpread);
```

## See Also

- [POSITIONING-SYSTEM.md](./POSITIONING-SYSTEM.md) - Core positioning concepts
- [INTELLIGENT-ALIGNMENT.md](./INTELLIGENT-ALIGNMENT.md) - Element alignment behavior
- [POSITIONING.md](./POSITIONING.md) - General positioning guide
- Playground examples 26-30 - Layout demonstrations

