# CSS Box Model in W2L

W2L implements a CSS-like box model for all bounded elements (Rectangle, Circle, Text, and layouts). This provides precise control over spacing, positioning, and element boundaries.

## Overview

The box model consists of four distinct layers, from outermost to innermost:

1. **Margin Box** - Space outside the element's border
2. **Border Box** - The element's outer boundary (default positioning)
3. **Padding Box** - Same as border box (padding is inside the border)
4. **Content Box** - The content area inside the padding

```
┌─────────────────────────────────── Margin Box
│  margin
│  ┌──────────────────────────────── Border Box (default)
│  │  border
│  │  ┌────────────────────────────── Padding
│  │  │  padding
│  │  │  ┌──────────────────────────── Content Box
│  │  │  │                         │
│  │  │  │      CONTENT            │
│  │  │  │                         │
│  │  │  └─────────────────────────┘
│  │  └────────────────────────────┘
│  └──────────────────────────────┘
└─────────────────────────────────┘
```

## Setting Spacing

Use the `margin` and `padding` properties to set spacing on any bounded element:

```typescript
const box = new Rectangle({
  width: 200,
  height: 100,
  margin: "20px",      // Uniform margin on all sides
  padding: "15px"      // Uniform padding on all sides
});

// Individual sides
const box2 = new Rectangle({
  width: 200,
  height: 100,
  margin: {
    top: "10px",
    right: "20px",
    bottom: "10px",
    left: "20px"
  },
  padding: {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15
  }
});
```

## Accessing Box Layers

Each bounded element provides methods to access different box model layers:

### 1. Border Box (Default)

The border box is the default positioning system. When you access properties like `topLeft`, `center`, etc., you're accessing the border box.

```typescript
const rect = new Rectangle({ width: 200, height: 100 });

// These all refer to the border box:
rect.topLeft      // Border box top-left
rect.center       // Border box center
rect.bottomRight  // Border box bottom-right

// Explicit access:
rect.getBorderBox()  // Returns object with all position points
rect.borderBox       // Shorthand for getBorderBox()
```

### 2. Content Box

The content box is the area inside the padding. Use this to position content within a container:

```typescript
const container = new Rectangle({
  width: 300,
  height: 200,
  padding: "20px"
});

const text = new Text({ content: "Hello" });

// Position text inside the padding
text.position({
  relativeFrom: text.topLeft,
  relativeTo: container.contentBox.topLeft,  // Use contentBox
  x: 0,
  y: 0
});
```

### 3. Margin Box

The margin box includes the margin around the element. Use this when you need to respect spacing between elements:

```typescript
const box = new Rectangle({
  width: 200,
  height: 100,
  margin: "20px"
});

const nextBox = new Rectangle({
  width: 200,
  height: 100
});

// Position next box respecting the margin
nextBox.position({
  relativeFrom: nextBox.topLeft,
  relativeTo: box.marginBox.bottomLeft,  // Use marginBox
  x: 0,
  y: 0
});
```

## Box Model Properties

Each box model method returns an object with these properties:

```typescript
{
  // Corners
  topLeft: Point,
  topRight: Point,
  bottomLeft: Point,
  bottomRight: Point,
  
  // Edge centers
  topCenter: Point,
  bottomCenter: Point,
  leftCenter: Point,
  rightCenter: Point,
  
  // Center
  center: Point,
  
  // Dimensions
  width: number,
  height: number
}
```

## Practical Examples

### Example 1: Card with Padding

```typescript
const card = new Rectangle({
  width: 300,
  height: 200,
  padding: "20px",
  style: {
    fill: "#fff",
    stroke: "#ddd",
    strokeWidth: 1
  }
});

const title = new Text({
  content: "Card Title",
  fontSize: 18,
  style: { fontWeight: "bold" }
});

const body = new Text({
  content: "Card body text goes here.",
  fontSize: 14
});

// Position title at top of content box
title.position({
  relativeFrom: title.topLeft,
  relativeTo: card.contentBox.topLeft,
  x: 0,
  y: 0
});

// Position body below title, inside content box
body.position({
  relativeFrom: body.topLeft,
  relativeTo: title.bottomLeft,
  x: 0,
  y: 10
});
```

### Example 2: Stacked Boxes with Margins

```typescript
const boxes = [];
for (let i = 0; i < 3; i++) {
  const box = new Rectangle({
    width: 200,
    height: 80,
    margin: "10px",
    padding: "15px",
    style: { fill: `hsl(${i * 120}, 70%, 60%)` }
  });
  
  if (i === 0) {
    // First box
    box.position({
      relativeFrom: box.center,
      relativeTo: artboard.center,
      x: 0,
      y: -120
    });
  } else {
    // Stack subsequent boxes using marginBox
    box.position({
      relativeFrom: box.marginBox.topCenter,
      relativeTo: boxes[i - 1].marginBox.bottomCenter,
      x: 0,
      y: 0
    });
  }
  
  boxes.push(box);
  artboard.addElement(box);
}
```

### Example 3: Visualizing the Box Model

See `playground/examples/47-box-model.js` for a comprehensive visual demonstration of all box model layers.

## Artboard Padding

The Artboard also supports padding, which creates an offset for all content:

```typescript
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "40px",  // 40px padding on all sides
  backgroundColor: "#f0f0f0"
});

// All elements will be offset by the padding
// The coordinate (0, 0) will be at (40, 40) in the rendered SVG
```

This is useful for creating consistent margins around your entire composition.

### Visualizing Artboard Padding

You can enable visual guides to see the padding and content areas:

```typescript
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true  // Enable visual guides
});
```

This will render:
- **Red semi-transparent overlay** - Shows the padding areas
- **Red solid border** - Shows the artboard's outer boundary (border box)
- **Blue dashed border** - Shows the content area (where elements are positioned)
- **Labels** - "Padding" and "Content Area" text for clarity

This is especially useful when debugging layouts or understanding how the box model affects your composition.

## API Reference

### Bounded Class Methods

All bounded elements (Rectangle, Circle, containers, layouts) inherit these methods:

#### `getBorderBox(): BoxModel`
Returns the border box (outer edge of element).

#### `getContentBox(): BoxModel`
Returns the content box (area inside padding).

#### `getMarginBox(): BoxModel`
Returns the margin box (area including margins).

#### `borderBox` (getter)
Shorthand for `getBorderBox()`.

#### `contentBox` (getter)
Shorthand for `getContentBox()`.

### Properties

#### `margin: Spacing`
Gets or sets the margin spacing.

#### `padding: Spacing`
Gets or sets the padding spacing.

#### `marginBox: ParsedSpacing`
Gets the parsed margin values in pixels for all four sides.

#### `paddingBox: ParsedSpacing`
Gets the parsed padding values in pixels for all four sides.

## Migration from `paddedArea`

The old `paddedArea` property on Rectangle is now deprecated. Use `contentBox` instead:

```typescript
// Old (deprecated)
element.position({
  relativeTo: container.paddedArea.topLeft,
  // ...
});

// New (recommended)
element.position({
  relativeTo: container.contentBox.topLeft,
  // ...
});
```

## When to Use Each Box

- **Border Box (default)**: Standard positioning, element boundaries
- **Content Box**: Positioning content inside containers, respecting padding
- **Margin Box**: Positioning elements with proper spacing, respecting margins

The box model provides flexibility while maintaining the simplicity of the default positioning system.

