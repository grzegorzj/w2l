# Positioning Patterns

Quick reference for common positioning scenarios in W2L.

## 1. Vertical Stack

Stack elements one below another with spacing.

```javascript
const container = new Container({
  direction: "vertical",
  spacing: 20,
});

container.addElement(rect1);
container.addElement(rect2);
container.addElement(rect3);
```

## 2. Horizontal Row

Place elements side-by-side with spacing.

```javascript
const row = new Container({
  direction: "horizontal",
  spacing: 15,
});

row.addElement(circle1);
row.addElement(circle2);
row.addElement(circle3);
```

## 3. Centered Element

Center an element on the artboard.

```javascript
const rect = new Rectangle({ width: 100, height: 100 });

rect.position({
  relativeFrom: rect.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});
```

## 4. Absolute Positioning (Artboard)

Position element at specific coordinates on artboard.

```javascript
const circle = new Circle({ radius: 50 });

circle.position({
  relativeFrom: circle.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 100,
  y: 50,
});
```

## 5. Relative to Another Element

Position one element relative to another.

```javascript
const label = new Text({ content: "Label" });

label.position({
  relativeFrom: label.bottomLeft,
  relativeTo: rect.topLeft,
  x: 0,
  y: -10, // 10px above the rect
});
```

## 6. Freeform Container

Auto-sizing container for absolute-positioned children.

```javascript
const container = new Container({
  direction: "freeform",
});

// Children use absolute positioning
const rect = new Rectangle({ width: 100, height: 100 });
rect.position({
  relativeFrom: rect.topLeft,
  relativeTo: container.contentBox.topLeft,
  x: 50,
  y: 50,
});

container.addElement(rect);
// Container auto-sizes to fit all children
```

## Common Anchor Points

Available on all elements:

- `topLeft`, `topCenter`, `topRight`
- `centerLeft`, `center`, `centerRight`
- `bottomLeft`, `bottomCenter`, `bottomRight`

## Box Model References

Available on artboard and containers:

- `contentBox` - inside padding
- `paddingBox` - includes padding
- `borderBox` - includes border

Example:

```javascript
element.position({
  relativeFrom: element.center,
  relativeTo: artboard.contentBox.center, // center within padding
  x: 0,
  y: 0,
});
```
