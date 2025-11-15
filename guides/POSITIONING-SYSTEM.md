# Positioning System

This document explains how the positioning system works in w2l, including parent-child relationships, absolute vs. relative positioning, and how transformations propagate through hierarchies.

## Overview

The w2l library implements a hierarchical positioning system where:
- Elements can have parent-child relationships
- Position getters automatically account for parent positions
- Transformations (translations, rotations) propagate to children
- Elements support both relative and absolute positioning modes

## Core Concepts

### 1. Parent-Child Relationships

Elements can be added to containers, creating a parent-child relationship:

```javascript
const container = new Container({ size: { width: 300, height: 200 } });
const circle = new Circle({ radius: 30 });

// Add circle to container - establishes parent-child relationship
container.addElement(circle);
```

When an element has a parent:
- Its position is relative to the parent by default
- Moving the parent moves all its children
- Parent transformations affect children

### 2. Internal Position Storage

Each element stores:
- `currentPosition`: Internal position (relative to parent if parented, absolute if not)
- `_parent`: Reference to parent element (if any)
- `_isAbsolutePositioned`: Flag indicating positioning mode

### 3. Absolute Position Calculation

All position getters (`.center`, `.topLeft`, etc.) use the `getAbsolutePosition()` method internally:

```typescript
protected getAbsolutePosition(): { x: number; y: number } {
  // If no parent, current position is absolute
  if (!this._parent) {
    return { ...this.currentPosition };
  }

  // If explicitly positioned as absolute, use current position
  if (this._isAbsolutePositioned) {
    return { ...this.currentPosition };
  }

  // Otherwise, add our relative position to parent's absolute position
  const parentAbsPos = this._parent.getAbsolutePosition();
  return {
    x: parentAbsPos.x + this.currentPosition.x,
    y: parentAbsPos.y + this.currentPosition.y,
  };
}
```

This means:
- Position getters always return world coordinates
- The system handles parent hierarchies automatically
- No manual position tracking needed

### 4. Relative vs. Absolute Positioning

#### Relative Positioning (Default)

When an element is added to a container without explicit positioning:

```javascript
const container = new Container({ size: { width: 300, height: 200 } });
const circle = new Circle({ radius: 30 });

container.addElement(circle);
// circle is in relative positioning mode
// Moving container will move circle
```

#### Absolute Positioning

When `position()` is explicitly called on an element:

```javascript
const circle = new Circle({ radius: 30 });

// Calling position() switches to absolute positioning
circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

container.addElement(circle);
// circle is now in absolute positioning mode
// Moving container will NOT move circle
```

This behavior is similar to CSS positioning:
- Relative = stays with parent (like `position: relative` or default flow)
- Absolute = positioned independently (like `position: absolute`)

### 5. Transformations

Transformations propagate through the hierarchy:

```javascript
container.translate({ along: { x: 1, y: 0 }, distance: 50 });
// All children move with the container

container.rotate({ deg: 15 });
// All children rotate around the container
```

The `ChildrenManager` handles this automatically by:
1. Tracking position/rotation deltas
2. Applying the same deltas to all relative-positioned children
3. Skipping absolute-positioned children

## Implementation Details

### Updated Classes

All primitive classes have been updated to use absolute positioning:

1. **Rectangle, Circle, Text**: All position getters use `toAbsolutePoint()`
2. **Triangle, RegularPolygon**: Updated to account for parent hierarchy
3. **Container, Layout**: Updated to use absolute positioning and properly set parent relationships
4. **ChildrenManager**: Calls `setParent()` when adding children

### Helper Methods

Elements have access to:

```typescript
// Get absolute world position
protected getAbsolutePosition(): { x: number; y: number }

// Create a Point from relative coordinates
protected toAbsolutePoint(relativeX: number, relativeY: number): Point

// Set/get parent element
setParent(parent: any): void
get parent(): any

// Check positioning mode
get isAbsolutePositioned(): boolean
```

## Examples

### Example 1: Nested Containers

See `playground/examples/19-nested-positioning.js` for a complete example of containers within containers.

```javascript
const outer = new Container({ size: { width: 400, height: 350 } });
const inner = new Container({ size: { width: 200, height: 150 } });

outer.addElement(inner);
// inner moves with outer

const circle = new Circle({ radius: 25 });
inner.addElement(circle);
// circle moves with both inner AND outer
```

### Example 2: Container Transformations

See `playground/examples/20-container-transformations.js` for transformation examples.

```javascript
const container = new Container({ size: { width: 300, height: 200 } });
const circle = new Circle({ radius: 40 });

container.addElement(circle);

// Move the container - circle moves too
container.translate({ along: { x: 1, y: 0 }, distance: 100 });

// Rotate the container - circle rotates too
container.rotate({ deg: 15 });
```

### Example 3: Absolute vs. Relative

See `playground/examples/21-absolute-vs-relative.js` for positioning mode examples.

```javascript
const container = new Container({ size: { width: 300, height: 400 } });

// Relative positioning - moves with container
const relativeCircle = new Circle({ radius: 40 });
relativeCircle.position({
  relativeFrom: relativeCircle.center,
  relativeTo: container.center,
  x: 0, y: 0
});
container.addElement(relativeCircle);

// Absolute positioning - stays in place
const absoluteCircle = new Circle({ radius: 40 });
absoluteCircle.position({
  relativeFrom: absoluteCircle.center,
  relativeTo: artboard.center,
  x: 200, y: 100
});
container.addElement(absoluteCircle);

// Move container
container.translate({ along: { x: 0, y: 1 }, distance: 50 });
// relativeCircle moves, absoluteCircle stays
```

### Example 4: Deep Nesting

See `playground/examples/22-deep-nesting.js` for deep hierarchy examples.

## Backwards Compatibility

All existing code continues to work because:
- Position getters use the same API
- The new system is transparent to users
- `currentPosition` is still used internally
- Parent relationships are optional

## Benefits

1. **Reliable Positioning**: Position getters always return correct world coordinates
2. **Automatic Hierarchy**: Parent-child relationships handled automatically
3. **Flexible Modes**: Support both relative and absolute positioning
4. **Transformation Propagation**: Transformations automatically affect children
5. **Backwards Compatible**: Existing code works without changes

## Implementation Notes

- `currentPosition` stores relative position when parented
- `getAbsolutePosition()` recursively calculates world position
- `toAbsolutePoint()` helper simplifies position getter implementation
- `setParent()` establishes parent-child relationships
- `position()` switches to absolute positioning mode
- `ChildrenManager` handles transformation propagation

