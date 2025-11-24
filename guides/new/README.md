# New Layout System

Clean rebuild of layout engine with proper architecture.

## Position Model

**Storage**: Position relative to parent  
**Getters**: Return absolute (world) positions  
**Computation**: Walk parent chain automatically

```javascript
element._position = { x: 50, y: 100 }  // Relative to parent
element.center  // Returns world position
```

## Box Model

**Size**: Width/height = border box (like CSS `box-sizing: border-box`)  
**Content**: Calculated by subtracting padding/border  
**Access**: `.contentBox.center`, `.paddingBox.topLeft`, `.borderBox.center`, `.marginBox.center`

```javascript
new NewRect({
  width: 300,     // Border box (total size)
  height: 200,
  boxModel: {
    margin: 30,
    border: 10,
    padding: 20
  }
})
// contentWidth = 300 - 10*2 - 20*2 = 240
```

## Layout Strategies

**Proactive**: Parent tells children where to be  
**Reactive**: Size adjusts to children (per-axis)

### VStack (Proactive)
```javascript
const vstack = new NewVStack({
  width: 400,
  height: 500,
  spacing: 20,
  alignment: 'center',  // left, center, right
  boxModel: { padding: 30 }
});

vstack.addElement(rect1);  // Positioned immediately
vstack.addElement(rect2);  // Stacked below rect1

// Nesting: VStacks can contain other VStacks
const nested = new NewVStack({ width: 300, height: 200, spacing: 10 });
nested.addElement(item1);
vstack.addElement(nested);  // Nested layout
```

## Alignment

Children align horizontally within VStack: `left`, `center`, `right`

```javascript
new NewVStack({
  width: 400,
  height: 'auto',
  alignment: 'center'  // Centers all children
})
```

## Reactive Sizing

Dimensions can be `auto` (grows to fit children) or fixed number:

```javascript
new NewVStack({
  width: 'auto',    // Width adjusts to widest child
  height: 'auto',   // Height adjusts to total height of children
  spacing: 10,
  boxModel: { padding: 20 }
})
```

Auto-sizing respects box model (includes padding/border in calculation).

## Hierarchy

```
NewElement
  └── NewShape (+ Stylable)
        ├── NewCircle
        └── NewRectangle (+ BoxModel)
              ├── NewArtboard
              ├── NewRect
              └── NewVStack
```

## Z-Index

Rendering order: explicit z-index > creation order

```javascript
element.zIndex = 10;  // Higher = on top
```

## Geometric Transforms

All shapes support geometric transforms that modify actual positions (not just visual).

### Rotation

```javascript
shape.rotate(45);  // Rotate 45 degrees around center
console.log(shape.rotation);  // Get current rotation
```

### Translation

```javascript
// Move along a direction vector
shape.translate({ x: 1, y: 0 }, 50);  // Move 50 units right
shape.translate({ x: 1, y: 1 }, 30);  // Move 30 units diagonally

// Direction vector is automatically normalized
shape.translate({ x: 3, y: 4 }, 100);  // Moves 100 units in direction (3,4)
```

### Query Transformed Corners

After transforms, you can query actual corner/vertex positions:

```javascript
const corners = rect.getTransformedCorners();
// Returns [topLeft, topRight, bottomRight, bottomLeft] after rotation

const vertices = triangle.getTransformedCorners();
// Returns [v1, v2, v3] after rotation

// Use for debugging or additional positioning
corners.forEach(corner => {
  const marker = new NewCircle({ radius: 3 });
  marker.position({
    relativeFrom: marker.center,
    relativeTo: corner,
    x: 0, y: 0
  });
});
```

## See Also

- `/lib/new/` - Implementation
- `/playground/examples/shapes/` - Shape examples with transforms
- `/playground/examples/58-79*.js` - Layout examples
- `/NEW-LAYOUT-SYSTEM.md` - Full documentation

