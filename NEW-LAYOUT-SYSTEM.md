# New Layout System

A clean, hierarchical rebuild of the layout engine starting from basic principles.

## Position Model

All elements use a **relative positioning model**:

- **Storage**: Elements store their position **relative to their parent** (or world coordinates if no parent)
- **Getters**: Position getters (`.topLeft`, `.center`, `.borderBox.center`, etc.) return **absolute** world positions
- **Computation**: Absolute positions are computed by walking up the parent chain
- **No flags**: No "absolutely positioned" flag needed - it's always relative storage with absolute getters
- **Translation**: Future feature for visual movement without layout changes

This matches CSS/HTML semantics where children are positioned relative to parents but render in world space.

## Architecture

The new layout system follows a clean hierarchy:

```
NewElement (base)
  └── NewShape (stylable shapes)
        ├── NewCircle (circle shape)
        └── NewRectangle (rectangular base)
              ├── NewArtboard (canvas/artboard)
              └── NewVStack (vertical stack layout)
```

## Layout Strategies

The layout system uses two types of strategies for positioning children:

### **Proactive Strategy** (Parent-Driven)
- **Control**: Parent tells children where to position themselves
- **Timing**: Children positioned immediately when added to parent
- **Use case**: When parent knows the layout (VStack, HStack, Grid, etc.)
- **Example**: `NewVStack` - parent calculates positions and tells children where to be

### **Reactive Strategy** (Child-Driven)
- **Control**: Parent recalculates after children are positioned/sized
- **Timing**: Parent adjusts to fit children
- **Use case**: When parent size depends on children (auto-sizing containers)
- **Example**: Container that grows to fit its content

**Rule**: An element can never be both proactive and reactive.

## Classes

### NewElement
- **Purpose**: Base class for all elements
- **Position Model**:
  - `_position`: Always relative to parent (or world if no parent)
  - Position getters (`.topLeft`, `.center`, etc.) return **absolute** (world) positions
  - `getAbsolutePosition()`: Computes world position by walking up parent chain
- **Properties**: 
  - `children`: Array of child elements
  - `_parent`: Reference to parent element
  - `_position`: Position relative to parent
  - `zIndex`: Optional z-index for rendering order (higher = on top)
- **Methods**:
  - `position(config)`: Set position (stores as relative to parent)
  - `addElement(element)`: Add a child element
  - `getAbsolutePosition()`: Get world position
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

### NewVStack
- **Purpose**: Vertical stack layout
- **Extends**: `NewRectangle`
- **Layout Strategy**: **PROACTIVE** - Parent tells children where to position themselves
- **Properties**:
  - `width`: Border box width (or `'auto'` for reactive width)
  - `height`: Border box height (or `'auto'` for reactive height)
  - `spacing`: Space between children (in pixels)
  - `alignment`: Horizontal alignment (`'left'`, `'center'`, `'right'`)
  - `boxModel`: Optional box model (padding, border, margin)
- **Behavior**:
  - Children positioned vertically with spacing
  - Children positioned in **content area** (respects padding)
  - Children positioned immediately when added (proactive)
  - Parent controls all child positioning
  - **Alignment**: Children can be aligned left, center, or right within the content area
  - **Reactive Sizing**: Dimensions can be `'auto'` to grow/shrink based on children:
    - `width: 'auto'`: Width adjusts to widest child (+ padding + border)
    - `height: 'auto'`: Height adjusts to total children height + spacing (+ padding + border)
  - Auto-sizing updates immediately when children are added

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

### Positioning to Different Box Layers

```javascript
import { NewArtboard, NewRect, NewCircle } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#ecf0f1'
});

// Element with full box model
const element = new NewRect({
  width: 200,
  height: 150,
  boxModel: {
    margin: 40,
    border: 8,
    padding: 25
  },
  style: { fill: '#34495e' }
});

element.position({
  relativeFrom: element.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Position satellites at different box layers
// Red circle at margin box corner
const marginCorner = new NewCircle({
  radius: 15,
  style: { fill: '#e74c3c' }
});
marginCorner.position({
  relativeFrom: marginCorner.center,
  relativeTo: element.marginBox.topLeft,  // Explicit margin box
  x: 0,
  y: 0
});

// Orange circle at border box corner
const borderCorner = new NewCircle({
  radius: 15,
  style: { fill: '#e67e22' }
});
borderCorner.position({
  relativeFrom: borderCorner.center,
  relativeTo: element.borderBox.topRight,  // Explicit border box
  x: 0,
  y: 0
});

// Yellow circle at padding box edge
const paddingEdge = new NewCircle({
  radius: 15,
  style: { fill: '#f39c12' }
});
paddingEdge.position({
  relativeFrom: paddingEdge.center,
  relativeTo: element.paddingBox.centerTop,  // Padding box center-top
  x: 0,
  y: 0
});

// Green circle at content box edge
const contentEdge = new NewCircle({
  radius: 15,
  style: { fill: '#2ecc71' }
});
contentEdge.position({
  relativeFrom: contentEdge.center,
  relativeTo: element.contentBox.centerLeft,  // Content box center-left
  x: 0,
  y: 0
});

// Purple circle at semantic center (same as content box center)
const centerMark = new NewCircle({
  radius: 20,
  style: { fill: '#9b59b6' }
});
centerMark.position({
  relativeFrom: centerMark.center,
  relativeTo: element.center,  // Semantic = content box
  x: 0,
  y: 0
});

artboard.addElement(element);
artboard.addElement(marginCorner);
artboard.addElement(borderCorner);
artboard.addElement(paddingEdge);
artboard.addElement(contentEdge);
artboard.addElement(centerMark);

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

### VStack Layout (Proactive Strategy)

```javascript
import { NewArtboard, NewVStack, NewRect } from 'w2l';

const artboard = new NewArtboard({
  width: 800,
  height: 600,
  backgroundColor: '#f0f0f0'
});

// Create a vertical stack with spacing and padding
const vstack = new NewVStack({
  width: 400,
  height: 500,
  spacing: 20,  // 20px between children
  boxModel: {
    padding: 30  // 30px padding around content
  },
  style: {
    fill: '#ecf0f1',
    stroke: '#95a5a6',
    strokeWidth: 2
  }
});

// Position VStack at artboard center
vstack.position({
  relativeFrom: vstack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add rectangles to VStack
// PROACTIVE: They're positioned immediately when added
const rect1 = new NewRect({
  width: 340,  // Fits in content area (400 - 30*2)
  height: 60,
  style: { fill: '#3498db' }
});

const rect2 = new NewRect({
  width: 340,
  height: 80,
  style: { fill: '#e74c3c' }
});

const rect3 = new NewRect({
  width: 340,
  height: 50,
  style: { fill: '#2ecc71' }
});

// Children positioned automatically with spacing
vstack.addElement(rect1);
vstack.addElement(rect2);
vstack.addElement(rect3);

artboard.addElement(vstack);

return artboard.render();
```

## Current Status

✅ **Completed (Step 1 & 2)**:

### Core Architecture
- ✅ Clean hierarchy: Element → Shape → Rectangle/Circle
- ✅ Stylable interface integrated at Shape level
- ✅ All classes prefixed with "New" to avoid conflicts

### Positioning System
- ✅ Relative positioning model: `position({ relativeFrom, relativeTo, x, y })`
- ✅ Elements store position **relative to parent** (like HTML/CSS)
- ✅ Position getters return **absolute** (world) positions
- ✅ Position computation walks up parent chain automatically
- ✅ Clean semantic model - no "absolute positioned" flag needed

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
- ✅ NewRect: Rectangle shape for drawing
- ✅ NewVStack: Vertical stack layout (PROACTIVE strategy)

### Layout System
- ✅ Proactive strategy implemented (parent-driven positioning)
- ✅ VStack positions children vertically with spacing
- ✅ Children positioned in content area (respects padding)
- ✅ Strategy documented in code
- ✅ **Alignment system**: VStack supports horizontal alignment (left, center, right)
- ✅ **Reactive sizing**: Dimensions can be `'auto'` to adjust to children
  - Width can be auto (fits widest child)
  - Height can be auto (fits total children height + spacing)
  - Per-axis control (width fixed, height auto, or vice versa)

### Rendering
- ✅ Z-index support (explicit z-index > creation order)
- ✅ Elements sorted before rendering

### Build & Testing
- ✅ Compiled and exported in main library
- ✅ Playground examples demonstrating all features
- ✅ No linter errors

## Next Steps

Future enhancements:
- More layout elements (HStack, Grid, ZStack, etc.)
- More shapes (NewSquare, NewPolygon, NewEllipse, etc.)
- Text elements with proper layout sizing
- Advanced layout features (distribution, flex-like behavior, etc.)
- Constraints system (min/max width/height)
- Vertical alignment for VStack (top, center, bottom)
- Advanced positioning helpers

## Files

Core:
- `/lib/newLayout/NewElement.ts` - Base with positioning and children
- `/lib/newLayout/NewShape.ts` - Stylable shape base
- `/lib/newLayout/NewRectangle.ts` - Rectangular base with box model
- `/lib/newLayout/NewArtboard.ts` - Canvas with box model
- `/lib/newLayout/NewCircle.ts` - Circle shape
- `/lib/newLayout/NewRect.ts` - Rectangle shape
- `/lib/newLayout/NewVStack.ts` - Vertical stack layout (PROACTIVE)
- `/lib/newLayout/BoxModel.ts` - Box model types and utilities
- `/lib/newLayout/BoxReference.ts` - Box accessor helper
- `/lib/newLayout/index.ts` - Exports

Examples:
- `/playground/examples/58-new-layout-basic.js` - Basic positioning
- `/playground/examples/59-new-layout-positioning.js` - Advanced positioning
- `/playground/examples/60-new-layout-box-model.js` - Box model demonstration
- `/playground/examples/61-new-layout-children.js` - Children and hierarchy
- `/playground/examples/62-new-layout-box-debug.js` - Box model debug with visualizations
- `/playground/examples/63-new-layout-all-boxes.js` - All box layers visualized (margin, border, padding, content)
- `/playground/examples/64-new-layout-positioning-boxes.js` - Positioning to different box layers
- `/playground/examples/65-new-layout-vstack.js` - VStack layout with spacing
- `/playground/examples/66-new-layout-vstack-debug.js` - VStack with box model visualization
- `/playground/examples/67-new-layout-zindex.js` - Z-index layering demonstration
- `/playground/examples/68-new-layout-nested-vstacks.js` - Nested VStacks with debug markers
- `/playground/examples/69-new-layout-deep-nesting.js` - Deep nesting (3 levels, advanced)
- `/playground/examples/70-new-layout-alignment.js` - **VStack alignment** (left, center, right)
- `/playground/examples/71-new-layout-reactive-size.js` - **Reactive sizing** (auto width/height)

