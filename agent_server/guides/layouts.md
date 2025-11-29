# Layouts and Positioning Guide

## Overview
This guide covers the layout system in W2L for organizing and positioning multiple elements in structured arrangements.

## When to Use This Guide
- Creating organized multi-element diagrams
- Building structured layouts with rows, columns, or grids
- Managing spacing and alignment between elements
- Creating complex compositions with nested containers

## Layout Components

### Container
The Container is the primary layout component for organizing children along an axis.

**Use Cases:**
- Horizontal or vertical arrangements
- Creating rows or columns of elements
- Centering and aligning groups of elements
- Building flexible layouts with gaps

**Key Properties:**
- `direction`: 'horizontal', 'vertical', 'none', or 'freeform'
- `gap`: Space between children
- `horizontalAlign`: 'left', 'center', 'right', 'stretch'
- `verticalAlign`: 'top', 'center', 'bottom', 'stretch'
- `padding`: Internal spacing

**Example:**
```javascript
const container = new Container({
  direction: 'horizontal',
  gap: 20,
  horizontalAlign: 'center',
  verticalAlign: 'center'
});

container.addChildren(circle1, circle2, circle3);
```

### Grid
Grid layout for organizing elements in a 2D grid structure.

**Use Cases:**
- Table-like layouts
- Icon grids
- Evenly spaced elements in rows and columns
- Matrix arrangements

**Key Properties:**
- `rows`: Number of rows
- `columns`: Number of columns
- `gap`: Space between cells
- `cells`: Array of cell configurations

**Example:**
```javascript
const grid = new Grid({
  rows: 3,
  columns: 3,
  gap: 10,
  cells: [
    { row: 0, col: 0, element: shape1 },
    { row: 0, col: 1, element: shape2 },
    // ... more cells
  ]
});
```

### Columns
Specialized layout for creating column-based designs.

**Use Cases:**
- Multi-column layouts
- Side-by-side comparisons
- Dashboard-style layouts
- Document columns

**Key Properties:**
- Column configuration options
- Spacing and gap controls
- Alignment options

## Positioning Modes

W2L supports multiple positioning modes:

### 1. Absolute Positioning
Place elements at specific coordinates:
```javascript
element.setPosition({ x: 100, y: 50 });
```

### 2. Relative Positioning
Position relative to other elements:
```javascript
element.setPosition({
  relativeTo: otherElement,
  anchor: 'right',
  targetAnchor: 'left',
  offset: { x: 10, y: 0 }
});
```

### 3. Layout-based Positioning
Let containers handle positioning:
```javascript
const container = new Container({ direction: 'horizontal', gap: 20 });
container.addChildren(elem1, elem2, elem3);
// Elements automatically positioned with gaps
```

## Anchors

Elements can be positioned using anchor points:

- `top-left`, `top-center`, `top-right`
- `center-left`, `center`, `center-right`
- `bottom-left`, `bottom-center`, `bottom-right`

**Example:**
```javascript
text.setPosition({
  relativeTo: circle,
  anchor: 'bottom-center',
  targetAnchor: 'center',
  offset: { x: 0, y: 5 }
});
// Text appears 5px below circle's center
```

## Spacing and Gaps

### Gap
Space between elements in containers:
```javascript
new Container({ 
  direction: 'horizontal',
  gap: 20  // 20px between each child
});
```

### Padding
Space inside containers:
```javascript
new Container({
  padding: 10  // 10px padding on all sides
});

// Or specific sides
new Container({
  padding: { top: 10, right: 20, bottom: 10, left: 20 }
});
```

### Margin
Space outside elements (when using box model):
```javascript
new Rect({
  width: 100,
  height: 60,
  boxModel: { margin: 10 }
});
```

## Alignment

### Horizontal Alignment
- `left`: Align to left edge
- `center`: Center horizontally
- `right`: Align to right edge
- `stretch`: Stretch to fill width

### Vertical Alignment
- `top`: Align to top edge
- `center`: Center vertically
- `bottom`: Align to bottom edge
- `stretch`: Stretch to fill height

**Example:**
```javascript
const container = new Container({
  direction: 'vertical',
  horizontalAlign: 'center',
  verticalAlign: 'top',
  gap: 15
});
```

## Nesting Layouts

Containers can be nested for complex layouts:

```javascript
const mainContainer = new Container({
  direction: 'vertical',
  gap: 30
});

const row1 = new Container({
  direction: 'horizontal',
  gap: 10
});
row1.addChildren(elem1, elem2, elem3);

const row2 = new Container({
  direction: 'horizontal',
  gap: 10
});
row2.addChildren(elem4, elem5);

mainContainer.addChildren(row1, row2);
```

## Size Modes

Elements can have different sizing behaviors:

- **Fixed**: Explicit width/height values
- **Content**: Size based on content
- **Fill**: Stretch to fill available space

```javascript
new Container({
  width: 'fill',  // Fill parent width
  height: 200     // Fixed height
});
```

## Best Practices

1. **Use Containers for groups** - Don't manually position related elements
2. **Consistent gaps** - Use the same gap values for visual harmony
3. **Nested layouts** - Break complex layouts into nested containers
4. **Anchor-based positioning** - Use anchors for relative positioning
5. **Let layouts work** - Avoid absolute positioning inside containers
6. **Start simple** - Begin with basic horizontal/vertical containers
7. **Use Grid for tables** - Grid is best for evenly-spaced 2D layouts
8. **Padding vs Margin** - Padding is inside, margin is outside

## Common Patterns

### Centered Card
```javascript
const card = new Container({
  direction: 'vertical',
  gap: 10,
  padding: 20,
  horizontalAlign: 'center',
  verticalAlign: 'center',
  style: { fill: 'white', stroke: 'gray' }
});
```

### Side-by-Side Layout
```javascript
const layout = new Container({
  direction: 'horizontal',
  gap: 20,
  verticalAlign: 'center'
});
layout.addChildren(leftPanel, rightPanel);
```

### Stacked Items with Labels
```javascript
const stack = new Container({
  direction: 'vertical',
  gap: 15,
  horizontalAlign: 'left'
});

items.forEach(item => {
  const row = new Container({
    direction: 'horizontal',
    gap: 10,
    verticalAlign: 'center'
  });
  row.addChildren(item.icon, item.label);
  stack.addChild(row);
});
```

## Troubleshooting

**Elements overlapping?**
- Check if you're using absolute positioning inside a container
- Increase gap value
- Verify all elements have proper sizes

**Alignment not working?**
- Make sure container has enough space
- Check that direction matches your alignment
- Verify container has defined width/height if using stretch

**Elements not showing?**
- Check z-order (render order)
- Verify elements are added as children
- Check if elements have zero size

