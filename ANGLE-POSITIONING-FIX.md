# Angle and Label Absolute Positioning Fix

## Problem

Angles and side labels were not correctly positioned when shapes (Triangle, Quadrilateral, etc.) were placed inside layout containers. The container's layout system would try to position these annotation elements, breaking their absolute positioning relative to the shape's geometry.

**Example Issue:**
```typescript
const container = new Container({ direction: "vertical" });
const triangle = new Triangle({ type: "right", a: 100, b: 80 });
container.add(triangle);

// These would be incorrectly positioned by the container's layout
const angles = triangle.showAngles();
angles.forEach(angle => container.add(angle));
```

The angles would be stacked vertically by the container instead of being positioned around the triangle's vertices.

## Solution

Implemented a "container layout escape" mechanism that allows certain elements to bypass container layout systems and position themselves absolutely at the artboard level.

### Changes Made

#### 1. **Element Base Class** (`lib/core/Element.ts`)
- Added `_escapeContainerLayout` protected property
- Added `escapeContainerLayout` getter to check if element should escape
- Added `markEscapeContainerLayout()` protected method to flag elements

#### 2. **Container** (`lib/layout/Container.ts`)
Modified `addElement()` to check for escape flag:
- If element has `escapeContainerLayout = true` and parent is a layout container
- Find the nearest artboard or freeform/none container
- Add the element there instead of to the current container

#### 3. **Angle Component** (`lib/components/Angle.ts`)
- Set `_escapeContainerLayout = true` in constructor
- Angles now always position themselves absolutely regardless of parent container

#### 4. **Side Labels** (`lib/elements/Side.ts`)
- Modified `createLabel()` to mark labels with `markEscapeContainerLayout()`
- Side labels now escape container layout

#### 5. **Triangle** (`lib/elements/Triangle.ts`)
- Modified `createVertexLabels()` to mark labels with `markEscapeContainerLayout()`
- Vertex labels now escape container layout

#### 6. **Quadrilateral** (`lib/elements/Quadrilateral.ts`)
- Modified `createVertexLabels()` to mark labels with `markEscapeContainerLayout()`
- Vertex labels now escape container layout

#### 7. **Rect** (`lib/elements/Rect.ts`)
- Modified `createCornerLabels()` to mark labels with `markEscapeContainerLayout()`
- Corner labels now escape container layout

### How It Works

1. **Element Creation**: When an angle or label is created, it's marked to escape container layout
2. **Auto-add to Artboard**: Element initially auto-adds to the artboard (default behavior)
3. **Explicit Add Interception**: If someone tries to add it to a layout container:
   - Container checks the `escapeContainerLayout` flag
   - Instead of adding to itself, finds the artboard or freeform ancestor
   - Adds the element there instead
4. **Result**: Angle/label is positioned absolutely at artboard level, using global coordinates

### Container Direction Modes

- **`horizontal`/`vertical`**: Layout containers that position children - angles/labels escape these
- **`freeform`**: Children position themselves - angles/labels can stay here
- **`none`**: Artboard mode - angles/labels can stay here

### Test Case

Created `playground/examples/tests/test-cards-layout.js` demonstrating:
- Cards in a vertical container with auto-height
- Triangle with angles and labels inside a card
- Angles and labels correctly positioned despite being inside layout containers

## Benefits

1. **Correct Positioning**: Angles and labels always positioned correctly relative to shape geometry
2. **Simplified API**: Users don't need to worry about where to add annotation elements
3. **Flexible**: Works with any nesting level of containers
4. **Consistent**: Same behavior whether shape is in container or artboard

## Usage Example

```typescript
// Before: Had to be careful about where to add angles
const artboard = new Artboard({ width: 800, height: 600 });
const container = new Container({ direction: "vertical" });
const triangle = new Triangle({ type: "right", a: 100, b: 80 });

container.add(triangle);
artboard.add(container);

// Had to add angles to artboard, not container
const angles = triangle.showAngles();
angles.forEach(angle => artboard.add(angle)); // ❌ Error-prone

// After: Works correctly regardless of where you add them
const container = new Container({ direction: "vertical" });
const triangle = new Triangle({ type: "right", a: 100, b: 80 });

container.add(triangle);

// Can add to container, they'll escape to artboard automatically
const angles = triangle.showAngles();
angles.forEach(angle => container.add(angle)); // ✅ Works perfectly!

// Or even simpler - angles auto-add to artboard on creation
triangle.showAngles(); // ✅ Just works!
```

## Related Files

- `/Users/grzegorzjanik/Development/w2l/lib/core/Element.ts`
- `/Users/grzegorzjanik/Development/w2l/lib/layout/Container.ts`
- `/Users/grzegorzjanik/Development/w2l/lib/components/Angle.ts`
- `/Users/grzegorzjanik/Development/w2l/lib/elements/Side.ts`
- `/Users/grzegorzjanik/Development/w2l/lib/elements/Triangle.ts`
- `/Users/grzegorzjanik/Development/w2l/lib/elements/Quadrilateral.ts`
- `/Users/grzegorzjanik/Development/w2l/lib/elements/Rect.ts`
- `/Users/grzegorzjanik/Development/w2l/playground/examples/tests/test-cards-layout.js`

## Testing

All tests passing:
- ✅ 36 tests passing
- ✅ New test: `test-cards-layout` with triangle in vertical container
- ✅ All existing geometry tests still work
- ✅ Angles position correctly in all scenarios

