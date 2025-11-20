# Guide to Creating Examples for Playground

## Basic Structure

- Always import from `"w2l"` - the playground has it available globally
- Render by calling `.render()` on each artboard
- Use `backgroundColor:` on the artboard, default to white unless asked otherwise
- Place examples in `/playground/examples/` with descriptive names

## Example Naming Convention

Use numbered prefixes for organization:

- `00-19`: Basic primitives and shapes
- `20-29`: Text and typography examples
- `30-39`: Layout examples (VStack, HStack, GridLayout)
- `40-49`: Advanced features (FunctionGraph, nested layouts)
- `50+`: Complex demonstrations and showcases

## Artboard Setup

```javascript
const artboard = new Artboard({
  size: { width: 1200, height: 900 },
  padding: "40px", // Use padding for visual breathing room
  backgroundColor: "#f8f9fa", // Light background works well
  showPaddingGuides: true, // Optional: shows padding area
});
```

## Box Model: Padding Behavior

**Important:** Padding follows CSS box model (content-box) behavior:

- `width` and `height` specify the **content area** size
- `padding` is **added** to create the total element size
- Children are positioned **within** the padded area

```javascript
const layout = new VStack({
  width: 200, // Content area: 200px wide
  height: 150, // Content area: 150px tall
  padding: "25px", // Padding adds 50px to each dimension
  // → Total size: 250px × 200px
});
```

This means:

- Content fits in 200×150
- Total element occupies 250×200
- Children start 25px from edges

## Layout Best Practices

### Auto-Sizing Layouts

With the phase system, layouts can auto-size based on their content:

```javascript
const vstack = new VStack({
  spacing: 20,
  autoHeight: true, // Sizes based on children
  autoWidth: true, // No circular dependencies!
  padding: "20px",
  style: { fill: "#fff", stroke: "#ddd", strokeWidth: 1 },
});
```

### Nested Layouts

You can nest layouts freely - the phase system handles measurement correctly:

```javascript
// VStack containing HStacks
const container = new VStack({ spacing: 15 });
const row1 = new HStack({ spacing: 10 });
const row2 = new HStack({ spacing: 10 });

row1.addElement(element1);
row1.addElement(element2);
container.addElement(row1);
container.addElement(row2);
```

### GridLayout

Use GridLayout for structured arrangements. GridLayout requires **either**:

- Explicit `width` and `height` (content area), **OR**
- `cellWidth` and `cellHeight` with `columns` and `rows`

```javascript
// Option 1: Explicit content dimensions
const grid = new GridLayout({
  width: 800, // Content area: 800px
  height: 600, // Content area: 600px
  columns: 2,
  rows: 2,
  columnGap: "20px",
  rowGap: "20px",
  padding: "20px", // Total size: 840×640
});

// Option 2: Cell-based sizing (auto-calculates content size)
const grid = new GridLayout({
  cellWidth: 200, // Each cell 200×150
  cellHeight: 150,
  columns: 2, // 2×2 grid
  rows: 2,
  columnGap: "20px", // 20px between cells
  rowGap: "20px",
  padding: "20px", // Padding added to total
  // Content: (200×2 + 20) × (150×2 + 20) = 420×320
  // Total: 460×360 (with padding)
});

// Elements are added in order, filling columns first
grid.addElement(cell1);
grid.addElement(cell2);
grid.addElement(cell3);
grid.addElement(cell4);
```

## Positioning

### Relative Positioning

Use relative positioning for precise control:

```javascript
element.position({
  relativeFrom: element.center,
  relativeTo: artboard.center,
  x: 0,
  y: -50, // 50px above center
});
```

### Layout Positioning

Layouts handle child positioning automatically:

```javascript
// VStack automatically positions children vertically with spacing
vstack.addElement(item1);
vstack.addElement(item2);
vstack.addElement(item3);
```

## Text Elements

Text elements are measured automatically in Phase 1:

```javascript
const text = new Text({
  content: "Hello World",
  fontSize: 18,
  lineHeight: 1.5,
  style: { fill: "#212529", fontWeight: "bold" },
});
```

Multi-line text:

```javascript
const multiline = new Text({
  content: "Line 1\nLine 2\nLine 3",
  fontSize: 14,
  lineHeight: 1.5,
  textAlign: "center",
});
```

## Color Schemes

Use cohesive color schemes for visual appeal:

```javascript
// Blue theme
const blueTheme = {
  bg: "#e7f5ff",
  border: "#1971c2",
  text: "#1864ab",
};

// Green theme
const greenTheme = {
  bg: "#d3f9d8",
  border: "#2f9e44",
  text: "#2b8a3e",
};

// Orange theme
const orangeTheme = {
  bg: "#fff3bf",
  border: "#f59f00",
  text: "#e67700",
};
```

## Complete Example Template

```javascript
import {
  Artboard,
  Rectangle,
  Circle,
  Text,
  VStack,
  HStack,
  GridLayout,
} from "w2l";

// 1. Create artboard
const artboard = new Artboard({
  size: { width: 1200, height: 900 },
  padding: "40px",
  backgroundColor: "#f8f9fa",
});

// 2. Create main container
const container = new VStack({
  spacing: 20,
  padding: "20px",
  autoHeight: true,
  autoWidth: true,
  style: { fill: "#fff", stroke: "#dee2e6", strokeWidth: 2 },
});

// 3. Add title
const title = new Text({
  content: "Example Title",
  fontSize: 24,
  style: { fill: "#212529", fontWeight: "bold" },
});
container.addElement(title);

// 4. Add content
const content = new Rectangle({
  width: 200,
  height: 100,
  style: { fill: "#e7f5ff", stroke: "#1971c2", strokeWidth: 2 },
});
container.addElement(content);

// 5. Position container
container.position({
  relativeFrom: container.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0,
});

// 6. Add to artboard and render
artboard.addElement(container);
artboard.render();
```

## Phase System Notes

The rendering happens in three phases:

1. **Measure Phase**: All text elements and self-measuring elements determine their size
2. **Layout Phase**: All layout containers calculate positions and sizes (bottom-up, deepest first)
3. **Render Phase**: Final SVG is generated

This means:

- ✅ Text in auto-sizing layouts works perfectly
- ✅ Nested layouts work without circular dependencies
- ✅ Complex hierarchies are handled correctly
- ✅ All existing positioning features still work

## Example Reference

See `49-nested-layouts-comprehensive.js` for a complete demonstration of:

- GridLayout with multiple cells
- VStack with auto-sizing
- HStack with mixed elements
- Nested layouts (VStack containing HStacks)
- Grid inside VStack
- Text elements throughout
- Color-coded sections
- Legends and annotations
