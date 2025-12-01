# Angle and Label Timing Issue & Solution

## The Problem

When shapes are placed inside layout containers, angles and labels must be created **AFTER** the shape is added to the container, not before. This is because:

1. **Angles/labels read positions at creation time**: When you call `triangle.showAngles()`, it reads `triangle.absoluteVertices` **at that moment** and creates `Side` objects with those coordinates baked in.

2. **Containers position children after addition**: When you call `container.add(triangle)`, the triangle gets positioned by the container's layout system.

3. **Timing mismatch**: If you create angles before adding the triangle to the container, the angles will have the old (pre-layout) coordinates.

## Example of the Problem

```javascript
// ❌ WRONG: Angles created before triangle is positioned
const container = new Container({ direction: "vertical" });
const triangle = new Triangle({ type: "right", a: 100, b: 80 });

// Angles created here - triangle is at (0,0)
const angles = triangle.showAngles();

// Triangle moved to new position by container
container.add(triangle);

// Angles still positioned at old (0,0) coordinates! ❌
angles.forEach(angle => artboard.add(angle));
```

**Result**: Angles appear far away from the triangle vertices.

## The Solution

Create angles and labels **AFTER** adding the shape to its parent container:

```javascript
// ✅ CORRECT: Angles created after triangle is positioned
const container = new Container({ direction: "vertical" });
const triangle = new Triangle({ type: "right", a: 100, b: 80 });

// Add triangle first - it gets positioned by container
container.add(triangle);

// Now create angles - triangle is at final position
const angles = triangle.showAngles();
angles.forEach(angle => artboard.add(angle)); // Correctly positioned! ✅
```

## Why This Happens

### Inside `Triangle.showAngle()`:

```typescript
showAngle(vertexIndex: number, options?: {...}): Angle {
  // Line 751: Reads vertices RIGHT NOW
  const verts = this.absoluteVertices;
  
  // Creates Side objects with current positions
  const incomingSide = new Side({
    start: verts[prevVertexIdx],  // Position baked in!
    end: verts[vertexIndex],       // Position baked in!
  });
  
  // Angle created with these fixed positions
  return new Angle({
    from: "vertex",
    segments: [incomingSide, outgoingSide],
    // ... these segments have fixed coordinates
  });
}
```

The positions are **captured and frozen** when the `Side` objects are created. When the triangle moves later, the `Side` objects (and thus the `Angle`) don't update.

## Best Practices

### ✅ Always Do This:

```javascript
// 1. Create shape
const triangle = new Triangle({ type: "right", a: 100, b: 80 });

// 2. Add to parent (shape gets positioned)
container.add(triangle);

// 3. Create annotations AFTER positioning
const angles = triangle.showAngles();
const labels = triangle.createSideLabels();
```

### ❌ Never Do This:

```javascript
// 1. Create shape
const triangle = new Triangle({ type: "right", a: 100, b: 80 });

// 2. Create annotations BEFORE adding to parent ❌
const angles = triangle.showAngles();
const labels = triangle.createSideLabels();

// 3. Add to parent (shape moves, but annotations don't)
container.add(triangle);
```

## When It Matters

This timing issue only matters when shapes are inside **layout containers** (horizontal, vertical):

- ✅ **No issue**: Shapes added directly to artboard (direction: "none")
- ✅ **No issue**: Shapes in freeform containers
- ❌ **Issue**: Shapes in horizontal/vertical containers
- ❌ **Issue**: Shapes in auto-sized containers

## Full Working Example

See `playground/examples/tests/test-cards-layout.js`:

```javascript
const container = new Container({
  direction: "vertical",
  horizontalAlignment: "center",
});

const triangle = new Triangle({
  type: "right",
  a: 120,
  b: 80,
});

// Add triangle to container FIRST
container.add(triangle);
card.add(container);
artboard.add(card);

// Create angles AFTER triangle is positioned
const angles = triangle.showAngles({
  mode: "internal",
  rightAngleMarker: "square",
});
angles.forEach(angle => artboard.add(angle)); // ✅ Correct!

const labels = triangle.createSideLabels(["$a$", "$b$", "$c$"]);
labels.forEach(label => artboard.add(label)); // ✅ Correct!
```

## Technical Details

### Why Angles Need This Pattern

1. **Angle calculation requires vertex positions**: Angles need to know where vertices are to calculate arc positions
2. **Positions are computed at construction time**: The `resolveConfig()` method runs in the constructor
3. **No position tracking**: Angles don't track the source shape and don't update when it moves
4. **Static annotation**: Angles are designed as static annotations, not dynamic followers

### Alternative Solutions Considered

1. **❌ Make angles track source shape**: Would require continuous position updates, expensive
2. **❌ Delay angle calculation until render**: Would break the construction/render separation
3. **✅ Document timing requirement**: Simplest, clearest, most explicit

## Summary

**Rule**: Always create shape annotations (angles, labels) **AFTER** adding the shape to its parent container.

**Why**: Annotations read and freeze positions at creation time. If the shape moves later, annotations don't follow.

**Impact**: Only affects shapes in layout containers (horizontal/vertical). Direct artboard additions are fine anytime.

