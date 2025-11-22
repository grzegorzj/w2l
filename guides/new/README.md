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
**Reactive**: Parent adjusts to children (not yet implemented)

### VStack (Proactive)
```javascript
const vstack = new NewVStack({
  width: 400,
  height: 500,
  spacing: 20,
  boxModel: { padding: 30 }
});

vstack.addElement(rect1);  // Positioned immediately
vstack.addElement(rect2);  // Stacked below rect1

// Nesting: VStacks can contain other VStacks
const nested = new NewVStack({ width: 300, height: 200, spacing: 10 });
nested.addElement(item1);
vstack.addElement(nested);  // Nested layout
```

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

## See Also

- `/lib/newLayout/` - Implementation
- `/playground/examples/58-66-*.js` - Examples
- `/NEW-LAYOUT-SYSTEM.md` - Full documentation

