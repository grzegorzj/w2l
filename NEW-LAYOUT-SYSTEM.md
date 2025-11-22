# New Layout System

A clean, hierarchical rebuild of the layout engine starting from basic principles.

## Architecture

The new layout system follows a clean hierarchy:

```
NewElement (base)
  └── NewShape (stylable shapes)
        ├── NewCircle (circle shape)
        └── NewRectangle (rectangular base)
              └── NewArtboard (canvas/artboard)
```

## Classes

### NewElement
- **Purpose**: Base class for all elements
- **Properties**: 
  - `children`: Array of child elements
  - `_parent`: Reference to parent element
  - `_position`: Internal position
  - `_absolutePositioned`: Whether positioned absolutely or relative to parent
- **Methods**:
  - `position(config)`: Position relative to another point
  - `addElement(element)`: Add a child element
  - `getAbsolutePosition()`: Get position accounting for parent hierarchy
  - `render()`: Abstract method to render to SVG

### NewShape
- **Purpose**: Base class for all visual shapes
- **Extends**: `NewElement`
- **Implements**: `Stylable`
- **Properties**:
  - `style`: SVG styling (fill, stroke, etc.)
- **Methods**:
  - `applyStyle(style)`: Apply additional styles

### NewRectangle
- **Purpose**: Base class for rectangular elements
- **Extends**: `NewShape`
- **Box Model Interpretation**: Width and height parameters represent the **border box** (total size). Content size is calculated by subtracting padding and border.
- **Properties**:
  - `width`: Border box width (total width)
  - `height`: Border box height (total height)
  - `contentWidth`: Content width (calculated)
  - `contentHeight`: Content height (calculated)
  - `boxModel`: Parsed box model (margin, border, padding)
  - **Semantic position getters** (always refer to **content box**):
    - `topLeft`: Top-left corner
    - `topRight`: Top-right corner
    - `bottomLeft`: Bottom-left corner
    - `bottomRight`: Bottom-right corner
    - `center`: Center position
  - **Explicit box accessors**:
    - `borderBox`: Access border box positions
    - `paddingBox`: Access padding box positions
    - `contentBox`: Access content box positions
    - `marginBox`: Access margin box positions
- **Methods**:
  - `getBoxOffset(reference)`: Get offset for box reference
  - `getPositionForBox(reference)`: Get position for specific box
  - `getBoxSize(reference)`: Get size for specific box

#### Box Model Convention

**Size interpretation**: Width and height parameters represent the **border box** (total size), like in CSS box-sizing: border-box. The content area is calculated by subtracting padding and border:

```javascript
// Create 800x600 artboard with 40px padding
const artboard = new NewArtboard({
  width: 800,      // Border box width (total SVG width)
  height: 600,     // Border box height (total SVG height)
  boxModel: { padding: 40 }
});

// The content area is automatically calculated:
// contentWidth = 800 - 40*2 = 720
// contentHeight = 600 - 40*2 = 520
```

**Semantic meaning**: By default, position getters (`.center`, `.topLeft`, etc.) always refer to the **content box**. This means `.center` is always the center of the content, regardless of padding, border, or margin.

**Explicit access**: Use box accessors for explicit control:
```javascript
artboard.center              // Content box center (semantic)
artboard.contentBox.center   // Content box center (explicit)
artboard.paddingBox.center   // Padding box center
artboard.borderBox.center    // Border box center
artboard.marginBox.center    // Margin box center

artboard.paddingBox.topLeft  // Padding box top-left
artboard.borderBox.centerRight // Border box center-right
```

### NewCircle
- **Purpose**: Circle shape
- **Extends**: `NewShape`
- **Properties**:
  - `radius`: Circle radius
  - `center`: Center position
- **Features**:
  - Can have children
  - Children rendered in a group with parent

### NewArtboard
- **Purpose**: Canvas for rendering elements
- **Extends**: `NewRectangle`
- **Default size**: 800x600px
- **Features**:
  - Customizable width and height
  - Background color support
  - Box model support (padding, margin, border)
  - Manages child elements
  - Renders to SVG string

## Usage Examples

### Basic Positioning

```javascript
import { NewArtboard, NewCircle } from 'w2l';

// Create artboard with background color
const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5'
});

// Create a center circle
const centerCircle = new NewCircle({
  radius: 40,
  style: { fill: '#3498db' }
});

// Position relative to artboard center
centerCircle.position({
  relativeFrom: centerCircle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Create another circle positioned relative to the first
const leftCircle = new NewCircle({
  radius: 30,
  style: { fill: '#e74c3c' }
});

// Position relative to center circle
leftCircle.position({
  relativeFrom: leftCircle.center,
  relativeTo: centerCircle.center,
  x: -100,  // 100px to the left
  y: 0
});

// Add elements to artboard
artboard.addElement(centerCircle);
artboard.addElement(leftCircle);

// Render and return
return artboard.render();
```

### Box Model

```javascript
import { NewArtboard, NewCircle } from 'w2l';

// Artboard with padding (box model)
const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5',
  boxModel: {
    padding: 40  // 40px padding on all sides
  }
});

// Create a circle at center
const circle = new NewCircle({
  radius: 50,
  style: { fill: '#3498db' }
});

// Position uses content box by default (respects padding)
circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.center,  // Content box center
  x: 0,
  y: 0
});

// Position at content box corners
const topLeft = new NewCircle({
  radius: 20,
  style: { fill: '#e74c3c' }
});

topLeft.position({
  relativeFrom: topLeft.center,
  relativeTo: artboard.topLeft,  // Content box top-left (inside padding)
  x: 0,
  y: 0
});

artboard.addElement(circle);
artboard.addElement(topLeft);

return artboard.render();
```

### Children and Hierarchy

```javascript
import { NewArtboard, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#ecf0f1'
});

// Parent circle
const parent = new NewCircle({
  radius: 80,
  style: { fill: '#34495e' }
});

parent.position({
  relativeFrom: parent.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Child circles - will be rendered with parent
const child1 = new NewCircle({
  radius: 15,
  style: { fill: '#e74c3c' }
});

child1.position({
  relativeFrom: child1.center,
  relativeTo: parent.center,
  x: -50,
  y: 0
});

const child2 = new NewCircle({
  radius: 15,
  style: { fill: '#3498db' }
});

child2.position({
  relativeFrom: child2.center,
  relativeTo: parent.center,
  x: 50,
  y: 0
});

// Add children to parent
parent.addElement(child1);
parent.addElement(child2);

// Add parent to artboard
artboard.addElement(parent);

return artboard.render();
```

## Current Status

✅ **Completed (Step 1 & 2)**:

### Core Architecture
- ✅ Clean hierarchy: Element → Shape → Rectangle/Circle
- ✅ Stylable interface integrated at Shape level
- ✅ All classes prefixed with "New" to avoid conflicts

### Positioning System
- ✅ Relative positioning: `position({ relativeFrom, relativeTo, x, y })`
- ✅ Elements positioned relative to parent by default (like HTML/CSS)
- ✅ Explicit `.position()` call marks element as absolutely positioned
- ✅ Position getters account for parent hierarchy

### Box Model
- ✅ Full box model support: margin, border, padding, content
- ✅ Configurable via `boxModel` config option
- ✅ Positioning uses **content box by default**
- ✅ Support for different box references (margin, border, padding, content)
- ✅ All rectangular position getters respect box model

### Children Support
- ✅ All elements can have children via `addElement()`
- ✅ Children positioned relative to parent automatically
- ✅ Proper rendering hierarchy (parent wraps children)

### Elements
- ✅ NewArtboard: Canvas with box model support
- ✅ NewCircle: Circle shape with children support
- ✅ Both properly render children

### Build & Testing
- ✅ Compiled and exported in main library
- ✅ Playground examples demonstrating all features
- ✅ No linter errors

## Next Steps

Future enhancements:
- Layout elements (VStack, HStack, etc.)
- Auto-sizing behavior
- More shapes (NewRectangle shape, NewSquare, NewPolygon, etc.)
- Grid and flex-like layouts
- Advanced box model features (different box reference modes in positioning)

## Files

Core:
- `/lib/newLayout/NewElement.ts` - Base with positioning and children
- `/lib/newLayout/NewShape.ts` - Stylable shape base
- `/lib/newLayout/NewRectangle.ts` - Rectangular base with box model
- `/lib/newLayout/NewArtboard.ts` - Canvas with box model
- `/lib/newLayout/NewCircle.ts` - Circle shape
- `/lib/newLayout/NewRect.ts` - Rectangle shape
- `/lib/newLayout/BoxModel.ts` - Box model types and utilities
- `/lib/newLayout/BoxReference.ts` - Box accessor helper
- `/lib/newLayout/index.ts` - Exports

Examples:
- `/playground/examples/58-new-layout-basic.js` - Basic positioning
- `/playground/examples/59-new-layout-positioning.js` - Advanced positioning
- `/playground/examples/60-new-layout-box-model.js` - Box model demonstration
- `/playground/examples/61-new-layout-children.js` - Children and hierarchy
- `/playground/examples/62-new-layout-box-debug.js` - Box model debug with visualizations

