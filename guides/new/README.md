# New Layout System

Clean rebuild of layout engine with proper architecture.

**Key Architectural Improvements:**
- `NewArtboard` extends `NewContainer` (unified container abstraction)
- All auto-sizing logic handled by `NewContainer` (no duplicate code)
- CSS-like sizing: containers grow from (0,0) to max child extent
- Bounds normalization: `direction: "none"` shifts children to positive coordinates

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

Containers support different layout modes via the `direction` property:

### Proactive Layouts (Parent Controls Positioning)

**Horizontal/Vertical Stacks**:
```javascript
const vstack = new NewContainer({
  width: 400,
  height: 500,
  direction: "vertical",
  spacing: 20,
  horizontalAlignment: 'center',  // left, center, right
  boxModel: { padding: 30 }
});

vstack.addElement(rect1);  // Positioned immediately
vstack.addElement(rect2);  // Stacked below rect1
```

### Reactive Layouts (Parent Sizes to Children)

**Artboard Mode** (`direction: "none"`):
```javascript
const artboard = new NewArtboard({  // Extends Container with direction: "none"
  width: "auto",
  height: "auto",
  boxModel: { padding: 20 }
});

// Children positioned at content top-left by default (if not explicitly positioned)
// Auto-sizes from (0,0) to max child extent (CSS-like)
// Normalizes bounds: shifts children if they're in negative space
artboard.addElement(rect);
```

**Freeform Mode** (`direction: "freeform"`):
```javascript
const container = new NewContainer({
  width: "auto",
  height: "auto",
  direction: "freeform",
  boxModel: { padding: 20 }
});

// Two-phase approach: Position all children first, then finalize
// Phase 1: Children position themselves (container stays 0x0)
rect.position({ 
  relativeTo: container.contentBox.center,  // Can position relative to center
  x: 0,
  y: 0
});
container.addElement(rect);  // Container stays at 0x0

// Add more elements...
container.addElement(anotherElement);

// Phase 2: Finalize layout (calculate size, normalize to positive coords)
container.finalizeFreeformLayout();  // NOW container sizes to fit all children

// This two-phase approach avoids the chicken-egg problem of incremental sizing
```

| Mode | Auto-position? | How it sizes? | Normalization | Use case |
|------|----------------|---------------|---------------|----------|
| `"horizontal"` | ✅ Yes | Stacked children | N/A | Horizontal stack |
| `"vertical"` | ✅ Yes | Stacked children | N/A | Vertical stack |
| `"none"` | ✅ If not positioned | From (0,0) to max extent | ✅ Shifts to positive coords | Artboard (bounded canvas) |
| `"freeform"` | ❌ No | From (0,0) to max extent | ✅ Shifts to positive coords | CSS-like reactive container |

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

### Query Corners

Get actual corner/vertex positions (already includes any transforms):

```javascript
const corners = rect.getCorners();
// Returns [topLeft, topRight, bottomRight, bottomLeft]

const vertices = triangle.getCorners();
// Returns [v1, v2, v3]

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

