# One-Parent Policy

## Overview

In w2l, **every element can have only ONE parent at a time**. This is a fundamental rule that prevents elements from appearing in multiple places and ensures clean layout hierarchy.

## How It Works

### Automatic Parent Switching

When you add an element to a new parent, it's automatically removed from its old parent:

```javascript
// Shape is created and auto-adds to artboard
const circle = new Circle({ radius: 50 });
// circle._parent = artboard (implicit)

// Adding to container removes it from artboard
const container = new Container({ direction: "horizontal" });
container.add(circle);
// circle._parent = container (artboard no longer has circle)
```

### With Auto-Artboard Feature

This is especially important with the new auto-artboard feature:

```javascript
// No explicit artboard creation - auto-created
// Shapes automatically add to the default artboard
const shape1 = new Circle({ radius: 30 });
const shape2 = new Square({ size: 40 });
const shape3 = new Triangle({ sideLength: 50 });

// Create a container and add shapes
const container = new Container({
  direction: "horizontal",
  spacing: 20
});

// These calls remove shapes from artboard and add to container
container.add(shape1);
container.add(shape2);
container.add(shape3);

// Position the container on the artboard
container.position({
  relativeFrom: container.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 50,
  y: 50
});

// Result: Container at (50,50) with shapes inside
// Shapes do NOT appear at (0,0) on artboard root
```

## Implementation Details

### The `addElement` Method

Located in `lib/core/Element.ts`, the `addElement` method enforces the one-parent policy:

```typescript
addElement(element: Element): void {
  // 1. Remove from previous parent if it has one
  if (element._parent) {
    const oldParent = element._parent;
    const index = oldParent.children.indexOf(element);
    if (index > -1) {
      oldParent.children.splice(index, 1);
    }
  }
  
  // 2. Add to new parent
  this.children.push(element);
  element._parent = this;
}
```

### Execution Flow

```
1. Shape Constructor
   ↓
2. autoAddToArtboard() called
   ↓
3. artboard.addElement(shape)
   ↓
4. shape._parent = artboard
   ↓
5. User calls: container.add(shape)
   ↓
6. container.addElement(shape)
   ↓
7. Detect shape._parent exists (artboard)
   ↓
8. Remove from artboard.children
   ↓
9. Add to container.children
   ↓
10. shape._parent = container
```

## Common Patterns

### Pattern 1: Inline Creation and Addition

```javascript
const container = new Container({ direction: "vertical" });

// Shape is created, auto-adds to artboard, then immediately moved to container
container.add(new Circle({ radius: 50 }));
container.add(new Square({ size: 60 }));
```

**Result**: Shapes end up in container only, not artboard.

### Pattern 2: Create First, Add Later

```javascript
// All shapes auto-add to artboard on creation
const circle = new Circle({ radius: 50 });
const square = new Square({ size: 60 });

// Later, move them into a container
const container = new Container({ direction: "horizontal" });
container.add(circle);
container.add(square);
```

**Result**: Shapes are removed from artboard and added to container.

### Pattern 3: Moving Between Containers

```javascript
const container1 = new Container({ direction: "horizontal" });
const container2 = new Container({ direction: "vertical" });

const circle = new Circle({ radius: 50 });
container1.add(circle); // circle in container1

// Move to different container
container2.add(circle); // circle removed from container1, now in container2
```

## Why This Matters

### Without One-Parent Policy

If elements could have multiple parents, you'd get:

```
Artboard
├─ Circle (at 0, 0)
├─ Square (at 0, 0)
└─ Container (at 50, 50)
   ├─ Circle (at 0, 0 relative to container)
   └─ Square (at 0, 0 relative to container)
```

Result: Shapes appear twice! 😱

### With One-Parent Policy

```
Artboard
└─ Container (at 50, 50)
   ├─ Circle (at 0, 0 relative to container)
   └─ Square (at 40, 0 relative to container)
```

Result: Clean hierarchy, no duplicates! ✅

## Debugging Parent Relationships

Use the new `getParent()` method to check an element's parent:

```javascript
const circle = new Circle({ radius: 50 });
console.log(circle.getParent()); // artboard

const container = new Container({ direction: "horizontal" });
container.add(circle);
console.log(circle.getParent()); // container
```

## Test Example

See: `/playground/examples/test-parent-switching.js`

This example demonstrates:
- Shapes auto-adding to artboard
- Moving shapes to a container
- Verifying they don't appear in both places

## Benefits

1. **No Duplicate Rendering**: Elements only appear once in the scene
2. **Predictable Layout**: Clear parent-child hierarchy
3. **Memory Efficient**: No duplicate references
4. **Easy Refactoring**: Move elements between containers without worrying about cleanup

## Edge Cases

### What if I want an element in multiple places?

Create multiple instances:

```javascript
// Don't do this:
const circle = new Circle({ radius: 50 });
container1.add(circle);
container2.add(circle); // circle moves from container1 to container2

// Do this instead:
const circle1 = new Circle({ radius: 50 });
const circle2 = new Circle({ radius: 50 });
container1.add(circle1);
container2.add(circle2);
```

### What about cloning?

If you need to clone an element (not yet implemented):

```javascript
// Future API:
const circle = new Circle({ radius: 50 });
const circleCopy = circle.clone();
container1.add(circle);
container2.add(circleCopy);
```

## Summary

- ✅ **One element = One parent**
- ✅ **Adding to new parent automatically removes from old parent**
- ✅ **Works seamlessly with auto-artboard feature**
- ✅ **Prevents duplicate rendering**
- ✅ **Enforced by `addElement()` method**

