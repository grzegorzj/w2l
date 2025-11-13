---
title: Positioning System
category: Documentation
---

# Positioning and Layout System

This document describes W2L's positioning and layout system, including how elements are positioned, transformed, and organized within layouts.

## Core Concepts

### Element Base Class

All visual and layout elements in W2L inherit from the `Element` base class, which provides core positioning and transformation methods:

- **`position(x, y)`**: Set absolute position
- **`translate(dx, dy)`**: Move relative to current position
- **`rotate(angle, pivot?)`**: Rotate around a pivot point

###Bounded Elements

The `Bounded` class extends `Element` and adds:
- CSS-like box model (margin, padding)
- Content area calculation
- Alignment point system

### Shapes and Containers

- **Shapes** (`Rectangle`, `Circle`, `Square`, etc.): Visible elements that render to SVG
- **Containers**: Invisible grouping elements with padding but no fill/stroke
- **Layouts**: Containers with positioning logic for their children

## Positioning Methods

### Absolute Positioning: `position(x, y)`

Sets an element's position to specific coordinates:

```typescript
const rect = new Rectangle({ width: "100px", height: "50px" });
rect.position("100px", "200px");
// Rectangle is now at (100, 200)
```

### Relative Movement: `translate(dx, dy)`

Moves an element relative to its current position:

```typescript
rect.translate("20px", "10px");
// Rectangle moves right 20px and down 10px from current position
```

### Rotation: `rotate(angle, pivot?)`

Rotates an element around a pivot point:

```typescript
// Rotate around center (default)
rect.rotate(45);

// Rotate around specific point
rect.rotate(45, { x: "50px", y: "50px" });
```

## Layout System

### Container

The `Container` class provides invisible grouping with padding:

```typescript
const container = new Container({
  width: "400px",
  height: "300px",
  padding: "20px",
});

// Add elements
container.addElement(rect1);
container.addElement(rect2);

// When container moves, children move too
container.translate("50px", "50px");
```

### Layout

The `Layout` class extends container functionality with visible rendering:

```typescript
const layout = new Layout({
  width: "500px",
  height: "400px",
  padding: "30px",
  fill: "#f0f0f0",
  stroke: "#333",
  strokeWidth: "2px"
});
```

### ColumnsLayout

Automatically organizes elements into columns:

```typescript
const columns = new ColumnsLayout({
  count: 3,                    // 3 columns
  gutter: "20px",              // Space between columns
  width: "900px",
  height: "500px",
  padding: "40px",
  horizontalAlign: "center",    // How to align elements horizontally
  verticalAlign: "top",        // How to align elements vertically
});

// Add to specific column
columns.columns[0].addElement(element1);
columns.columns[1].addElement(element2);
columns.columns[2].addElement(element3);

// Or iterate
columns.columns.forEach((column, index) => {
  column.addElement(elements[index]);
});
```

#### Column Alignment

Elements within columns use intelligent alignment (see [INTELLIGENT-ALIGNMENT.md](./INTELLIGENT-ALIGNMENT.md)):

- **`horizontalAlign: "left"`**: Elements align their left edges to the column's left edge
- **`horizontalAlign: "center"`**: Elements align their centers to the column's center
- **`horizontalAlign: "right"`**: Elements align their right edges to the column's right edge
- **`verticalAlign: "top/center/bottom"`**: Similar behavior for vertical positioning

## Positioning Hierarchy

W2L uses a hierarchical positioning system with two modes:

### 1. Layout-Bound Positioning (Default)

When an element is added to a layout, it becomes "layout-bound":

```typescript
const layout = new ColumnsLayout({ ... });
const rect = new Rectangle({ width: "100px", height: "50px" });

layout.columns[0].addElement(rect);
// rect is now layout-bound

// Moving the layout moves the rectangle
layout.translate("50px", "50px");
// rect moves with the layout
```

**Characteristics:**
- Element position is relative to parent layout
- Moving/transforming the layout moves the element
- Layout controls element positioning

### 2. Absolute Positioning (Break-Out)

Calling `position()` on a layout-bound element "breaks it out" to absolute positioning:

```typescript
const rect = new Rectangle({ width: "100px", height: "50px" });

// Add to layout (becomes layout-bound)
layout.columns[0].addElement(rect);

// Break out to absolute positioning
rect.position("300px", "400px");
// rect is now absolute, independent of layout

// Moving the layout no longer affects this element
layout.translate("50px", "50px");
// rect stays at (300, 400)
```

**Characteristics:**
- Element position is independent of layout
- Layout transformations don't affect the element
- Element is responsible for its own positioning
- Still renders as part of the layout's SVG

### When to Use Each Mode

**Use Layout-Bound (default)** when:
- Elements should move with their container
- Creating responsive layouts
- Building hierarchical compositions

**Use Absolute Positioning** when:
- Element needs fixed position regardless of layout changes
- Creating overlays or annotations
- Positioning elements relative to the artboard rather than layout

## Child Transformation

Layouts use a `ChildrenManager` to handle child elements. When a layout is transformed:

### Position Changes

```typescript
layout.position("100px", "100px");
// All layout-bound children shift by the difference
```

### Translation

```typescript
layout.translate("50px", "30px");
// All layout-bound children move the same amount
```

### Rotation

```typescript
layout.rotate(45);
// All layout-bound children rotate around the same pivot
```

## Box Model

Elements support CSS-like margin and padding:

```typescript
const container = new Container({
  width: "400px",
  height: "300px",
  padding: "20px",           // All sides
  // OR
  padding: {
    top: "10px",
    right: "15px",
    bottom: "10px",
    left: "15px"
  }
});

// Margin works similarly
const rect = new Rectangle({
  width: "100px",
  height: "50px",
  margin: "10px"
});
```

### Content Area

The `contentArea` property returns the usable space inside padding:

```typescript
const container = new Container({
  width: "400px",
  height: "300px",
  padding: "20px"
});

const area = container.contentArea;
// {
//   x: 20,
//   y: 20,
//   width: 360,    // 400 - 40 (padding left + right)
//   height: 260    // 300 - 40 (padding top + bottom)
// }
```

## Coordinate System

W2L uses a standard SVG coordinate system:
- Origin (0, 0) is at the top-left
- X increases to the right
- Y increases downward
- All units are in pixels (px) by default

For more details on mathematical conventions, see [CONVENTIONS.md](./CONVENTIONS.md).

## Best Practices

### 1. Use Layouts for Organization

```typescript
// Good: Organized with layouts
const layout = new ColumnsLayout({ count: 3, ... });
layout.columns[0].addElement(element1);
layout.columns[1].addElement(element2);

// Avoid: Manual positioning
element1.position("100px", "100px");
element2.position("200px", "100px");
```

### 2. Keep Related Elements in Containers

```typescript
// Good: Group related elements
const group = new Container({ ... });
group.addElement(title);
group.addElement(content);
group.addElement(footer);

artboard.addElement(group);
```

### 3. Use Intelligent Alignment

```typescript
// The system handles alignment automatically
const columns = new ColumnsLayout({
  horizontalAlign: "left",  // Elements align their left edges
  verticalAlign: "center"   // At vertical center
});
// No manual position calculations needed!
```

### 4. Break Out Sparingly

Only use absolute positioning when necessary:

```typescript
// Layout-bound by default
layout.addElement(element);

// Only break out if truly needed
if (needsFixedPosition) {
  element.position(absoluteX, absoluteY);
}
```

## Examples

### Simple Layout

```typescript
const artboard = new Artboard({ width: "800px", height: "600px" });

const layout = new Layout({
  width: "700px",
  height: "500px",
  padding: "50px",
  fill: "#f9f9f9"
});

layout.position("50px", "50px");
artboard.addElement(layout);

const rect = new Rectangle({
  width: "200px",
  height: "100px",
  fill: "#3498db"
});

layout.addElement(rect);
// rect is positioned within layout's content area
```

### Column-Based Layout

```typescript
const columns = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "900px",
  height: "400px",
  padding: "40px",
  horizontalAlign: "center",
  verticalAlign: "top"
});

columns.position("50px", "100px");

// Add different shapes to each column
columns.columns[0].addElement(new Rectangle({ width: "150px", height: "100px" }));
columns.columns[1].addElement(new Circle({ radius: "50px" }));
columns.columns[2].addElement(new Square({ size: "120px" }));

artboard.addElement(columns);
```

### Breaking Out Example

```typescript
const layout = new ColumnsLayout({ ... });
const overlay = new Rectangle({
  width: "100px",
  height: "50px",
  fill: "rgba(255, 0, 0, 0.5)"
});

// Add to layout first
layout.columns[0].addElement(overlay);

// Then break out to fixed position
overlay.position("700px", "50px");
// overlay now ignores layout transformations
```

## See Also

- [INTELLIGENT-ALIGNMENT.md](./INTELLIGENT-ALIGNMENT.md) - Alignment system details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [CONVENTIONS.md](./CONVENTIONS.md) - Mathematical conventions
- `lib/core/Element.ts` - Element base class
- `lib/layout/Container.ts` - Container and Layout classes
- `lib/layout/ColumnsLayout.ts` - Column layout implementation

