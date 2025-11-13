---
title: Default Alignment Behavior
category: Documentation
---

# Default Alignment Behavior

This document describes W2L's default alignment behavior where elements use edge-based alignment points based on the alignment direction.

## Overview

When elements are aligned within a layout (like `ColumnsLayout`), the system determines which point on their surface should be used for alignment based on the requested alignment direction.

### Current Default Behavior

Elements have a `getAlignmentPoint()` method that returns the **appropriate edge point** based on alignment direction:
- **Left align**: Uses the center of the left edge
- **Right align**: Uses the center of the right edge  
- **Top align**: Uses the center of the top edge
- **Bottom align**: Uses the center of the bottom edge
- **Center align**: Uses the geometric center

**Note:** This is the current default implementation. In the future, individual element classes will be able to define their own custom alignment behavior (e.g., a label might align from its baseline, a shape from a specific anchor point, etc.).

## How It Works

### Element Base Class

The `Element` base class provides a default fallback implementation:

```typescript
getAlignmentPoint(
  horizontalAlign: "left" | "center" | "right",
  verticalAlign: "top" | "center" | "bottom"
): Point {
  // Default fallback: return center point
  return this.center;
}
```

### Bounded Class Override

The `Bounded` class (parent of `Rectangle`, `Circle`, etc.) overrides this to provide edge-based alignment:

```typescript
getAlignmentPoint(
  horizontalAlign: "left" | "center" | "right",
  verticalAlign: "top" | "center" | "bottom"
): Point {
  const width = this.width || 0;
  const height = this.height || 0;
  
  let x = this.currentPosition.x;
  let y = this.currentPosition.y;
  
  // Horizontal positioning
  if (horizontalAlign === "center") {
    x = this.currentPosition.x + width / 2;
  } else if (horizontalAlign === "right") {
    x = this.currentPosition.x + width;
  }
  // "left" uses x = this.currentPosition.x
  
  // Vertical positioning
  if (verticalAlign === "center") {
    y = this.currentPosition.y + height / 2;
  } else if (verticalAlign === "bottom") {
    y = this.currentPosition.y + height;
  }
  // "top" uses y = this.currentPosition.y
  
  return { x: `${x}px`, y: `${y}px` };
}
```

## Alignment Point Mapping

For rectangular elements:

| Horizontal | Vertical | Point Used |
|------------|----------|------------|
| left | top | Top-left corner |
| left | center | Left edge center |
| left | bottom | Bottom-left corner |
| center | top | Top edge center |
| center | center | Geometric center |
| center | bottom | Bottom edge center |
| right | top | Top-right corner |
| right | center | Right edge center |
| right | bottom | Bottom-right corner |

For circular elements, the system calculates appropriate edge points based on the radius.

## Usage in ColumnsLayout

The `ColumnsLayout` system calls `getAlignmentPoint()` on each element to determine positioning:

```typescript
const columns = new ColumnsLayout({
  count: 3,
  gutter: "20px",
  width: "600px",
  height: "400px",
  horizontalAlign: "left",  // Elements will align their LEFT edges
  verticalAlign: "center",   // At the CENTER height
});

// Add different-width rectangles
const rect1 = new Rectangle({ width: "100px", height: "40px" });
const rect2 = new Rectangle({ width: "150px", height: "40px" });
const rect3 = new Rectangle({ width: "80px", height: "40px" });

// All rectangles will align their left edges to the column's left edge
columns.columns[0].addElement(rect1);
columns.columns[0].addElement(rect2);
columns.columns[0].addElement(rect3);
```

### How Column Positioning Works

1. **Get element's alignment point**: `element.getAlignmentPoint("left", "center")`
   - For left+center alignment, returns the center of the left edge

2. **Calculate column target point**:
   - For left alignment: column's left edge (x = column.x)
   - For center alignment: column's center (x = column.x + column.width / 2)
   - For right alignment: column's right edge (x = column.x + column.width)

3. **Calculate offset**: `targetPoint - elementPoint`

4. **Position element**: Move element by offset amount

## Visual Examples

### Left Alignment
```
Column bounds: |                    |
               |                    |
Element 1:     [====]              |  ← Left edge aligned
Element 2:     [==========]        |  ← Left edge aligned
Element 3:     [======]            |  ← Left edge aligned
               |                    |
```

### Right Alignment
```
Column bounds: |                    |
               |                    |
Element 1:     |              [====]  ← Right edge aligned
Element 2:     |        [==========]  ← Right edge aligned
Element 3:     |            [======]  ← Right edge aligned
               |                    |
```

### Center Alignment
```
Column bounds: |                    |
               |                    |
Element 1:     |      [====]        |  ← Centers aligned
Element 2:     |   [==========]     |  ← Centers aligned
Element 3:     |     [======]       |  ← Centers aligned
               |                    |
```

## Benefits

1. **Intuitive Behavior**: Alignment works as expected visually
2. **Consistent**: All element types align the same way by default
3. **Extensible**: The system is designed to support custom alignment behavior per element class
4. **Zero Configuration**: Works automatically with existing code

## Future: Custom Alignment Behavior (To Be Implemented)

In the future, individual element classes will be able to define their own alignment behavior:

```typescript
// Example: Future implementation
class Label extends Bounded {
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    // Labels might align from baseline for vertical alignment
    // Custom logic per element type
    return this.baselinePoint;
  }
}
```

**Planned Features:**
- Text elements aligning from baseline instead of edge
- Shapes with custom anchor points
- Icons aligning from visual center (not geometric center)
- Connectors aligning from connection points

This will allow layouts to automatically position different types of elements in the most natural way for each element type.

## Migration

No code changes needed! The system is backward compatible:
- Existing code continues to work
- Alignment behavior is improved automatically
- No breaking changes

## See Also

- [POSITIONING.md](./POSITIONING.md) - General positioning guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- `playground/examples/intelligent-alignment-demo.ts` - Visual demonstration
- `playground/examples/columns-alignment-demo.ts` - Alignment options showcase

