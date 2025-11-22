# Inspector User Guide

## What is the Inspector?

The Inspector is a debugging tool that shows you the complete state of your artboard and all its elements in a JSON tree format. When you hover over elements in the tree, they highlight on the canvas - making it easy to understand your scene's structure.

## Quick Start

### 1. Open the Inspector

Look for a **🔍 (magnifying glass) button** in the **bottom-right corner** of the playground. Click it to open the inspector panel.

### 2. Explore the Tree

The inspector shows your artboard and all its children:

```
▶ Artboard "artboard"
  ├─ id: "Artboard_1234567890_abc123_0"
  ├─ size: { width: 800, height: 600 }
  ├─ config: { autoAdjust: false, ... }
  ├─ padding: { top: 40, right: 40, ... }
  └─ children: Array(3)
      ├─ [0]: Container "root-container"
      │   └─ children: Array(1)
      │       └─ [0]: VStack "main-stack"
      │           └─ children: Array(3)
      │               ├─ [0]: Text "title"
      │               ├─ [1]: HStack "circle-stack"
      │               └─ [2]: HStack "rectangle-stack"
      ├─ [1]: Circle "blue-circle"
      └─ [2]: Rectangle "green-rectangle"
```

### 3. Navigate the Tree

- Click **▶** to expand a node
- Click **▼** to collapse a node
- Scroll to see more content

### 4. Hover to Highlight

Move your mouse over any element in the JSON tree. The corresponding element in the SVG canvas will be **highlighted with a blue outline**.

This makes it easy to:
- Find elements on the canvas
- Understand which element is which
- Debug positioning issues
- Verify parent-child relationships

## What Information is Shown?

For each element, you'll see:

### Basic Info
- **id**: Unique identifier (e.g., `Circle_1234567890_abc123_5`)
- **type**: Element class name (e.g., `Circle`, `Text`, `VStack`)
- **name**: Your custom name (if you provided one)

### Position & Layout
- **position**: Relative position `{ x, y }`
- **absolutePosition**: Final position in world space
- **isAbsolutePositioned**: Whether `.position()` was called
- **hasParent**: If element is inside a container
- **parentId**: ID of the parent element

### Visual Properties
- **size**: Dimensions `{ width, height }` (if applicable)
- **style**: Fill, stroke, opacity, etc. (if set)
- **transforms**: Rotations, scales, etc. (if applied)

### Hierarchy
- **children**: Nested elements (for containers and layouts)
- **zIndex**: Explicit rendering order (if set)
- **creationIndex**: Automatic ordering

## Tips for Better Inspection

### 1. Name Your Elements

Without names:
```javascript
const circle = new Circle({ radius: 50 });
```
Inspector shows: `Circle "undefined"`

With names:
```javascript
const circle = new Circle({ 
  radius: 50,
  name: "profile-picture"
});
```
Inspector shows: `Circle "profile-picture"` ✅ Much clearer!

### 2. Use Meaningful Names

Good names tell you what the element is for:
```javascript
name: "header-title"
name: "submit-button"
name: "user-avatar"
name: "price-label"
```

Bad names don't help:
```javascript
name: "thing1"
name: "element"
name: "temp"
```

### 3. Name Containers and Layouts

This helps understand the structure:
```javascript
const header = new HStack({
  children: [logo, nav, userMenu],
  name: "app-header"
});

const content = new VStack({
  children: [title, body, footer],
  name: "page-content"
});
```

### 4. Check Positions When Debugging

If an element isn't where you expect:
1. Open the inspector
2. Find the element by name
3. Check its `position` and `absolutePosition`
4. Check `isAbsolutePositioned` - if true, it's using explicit `.position()`
5. Check `hasParent` and `parentId` to see its container

### 5. Verify Parent-Child Relationships

If layout isn't working:
1. Expand the parent container/layout in the inspector
2. Check its `children` array
3. Verify all expected children are listed
4. Hover on each child to confirm their positions

## Example: Debugging a Misaligned Element

**Problem**: A circle isn't showing up where you expect.

**Solution using Inspector**:

1. Open inspector (click 🔍)
2. Search for your circle by name (e.g., expand tree to find "profile-circle")
3. Check the circle's properties:
   ```json
   {
     "id": "Circle_...",
     "type": "Circle",
     "name": "profile-circle",
     "position": { "x": 0, "y": 0 },
     "absolutePosition": { "x": 100, "y": 50 },
     "isAbsolutePositioned": false,
     "hasParent": true,
     "parentId": "Container_..."
   }
   ```
4. Hover on the circle in the inspector to highlight it on canvas
5. Now you can see:
   - It's inside a Container (hasParent: true)
   - Its relative position is (0, 0)
   - Its absolute position is (100, 50) - that's where the container placed it!
   - It hasn't been explicitly positioned (isAbsolutePositioned: false)

**Fix**: Either move the container, or explicitly position the circle.

## Inspector Keyboard Shortcuts

Currently, the inspector responds to:
- **Click** anywhere outside to keep it open (it won't auto-close)
- **X button** in top-right to close
- **🔍 button** to re-open

## Known Behaviors

### Multiple Artboards
If you have multiple artboards, each gets its own section in the inspector:
```
Artboard 1
  └─ ... (tree for first artboard)
Artboard 2
  └─ ... (tree for second artboard)
```

### Performance
The inspector serializes the entire object tree when opened. For complex scenes with 100+ elements, there may be a brief delay (< 1 second).

### Auto-scroll
When you hover on an element in the inspector, if it's offscreen in the canvas, the canvas will automatically scroll to show it.

## Troubleshooting

### "Inspector button doesn't appear"
- Make sure your code successfully created an artboard
- Check the console for errors
- Refresh the page and try again

### "Hover doesn't highlight anything"
- Make sure you're hovering on an element node (not a property)
- Elements without the `data-element-id` attribute won't highlight (some complex elements like BezierCurve, Image, etc. might not support highlighting yet)
- Check browser console for errors

### "Inspector is empty"
- Your code might have an error - check the error message in the renderer
- Make sure you're returning `artboard.render()` from your code
- Try running one of the example files (like `57-inspector-test.js`)

## Example Code to Test Inspector

Try this simple example:
```javascript
const { Artboard, Circle, Text, VStack } = w2l;

const artboard = new Artboard({
  size: { width: 600, height: 400 },
  padding: "20px"
});

const title = new Text({
  content: "Test Inspector",
  fontSize: 24,
  name: "title"
});

const circle = new Circle({
  radius: 50,
  style: { fill: "#3498db" },
  name: "test-circle"
});

const stack = new VStack({
  children: [title, circle],
  spacing: 20,
  name: "main-stack"
});

artboard.addElement(stack);

stack.position({
  relativeFrom: stack.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

artboard.render();
```

Then:
1. Click the 🔍 button
2. Expand "Artboard" → "children" → "[0]" → "VStack 'main-stack'"
3. Hover over the Text or Circle in the tree
4. Watch them highlight on the canvas!

Enjoy debugging! 🐛🔍

