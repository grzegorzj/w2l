# Double Rendering Fix - TextArea

## Issue

In example 51 (`51-textarea-highlights-latex.js`), text was being rendered twice. This was caused by TextArea creating internal `Text` objects that:

1. **Auto-added to the artboard** (via the Shape constructor's `autoAddToArtboard()` call)
2. **Were also rendered by TextArea** (via `textInstance.render()` in TextArea's render method)

Result: Text appeared twice in the output.

## Root Cause

### The Problem

`TextArea` creates `Text` objects internally in three places:

1. **Line 291**: Temporary Text for LaTeX height measurement
2. **Line 317**: Temporary Text for line width measurement  
3. **Line 351**: Actual Text objects for each line (stored in `this._textLines`)

All these Text objects inherit from `Shape`, which calls `this.autoAddToArtboard()` in its constructor. This adds them to the global artboard.

But TextArea also renders these Text objects itself:
```typescript
const textContent = this._textLines
  .map((text) => {
    return text.render();  // ← Rendering them again!
  })
  .join("\n");
```

### Why Other Components Don't Have This Issue

- **Angle**: Creates Text labels but calls `this.addElement(label)` which removes them from artboard ✅
- **FlowBox**: Creates Text elements but calls `this.addElement(textElement)` ✅  
- **Side/Line**: Create labels via `createLabel()` which return to user (intended to be on artboard) ✅
- **Arrow**: Doesn't create Shape objects internally ✅

## Solution

Add all internal Text objects as children of TextArea using `this.addElement()`. The one-parent policy ensures:

1. Text auto-adds to artboard on creation
2. `this.addElement(textInstance)` removes it from artboard  
3. Text becomes a child of TextArea
4. TextArea renders it as part of its own rendering
5. No duplicate rendering!

## Changes Made

### File: `lib/elements/TextArea.ts`

**Three locations fixed:**

#### 1. Temporary Text for LaTeX height (Line ~291)
```typescript
const tempText = new Text({...});

// Add as child to prevent it from being rendered on artboard
// (TextArea uses this only for measurement)
this.addElement(tempText);

const latexHeight = tempText.textHeight;
```

#### 2. Temporary Text for line width (Line ~317)
```typescript
const tempText = new Text({...});

// Add as child to prevent it from being rendered on artboard
// (TextArea uses this only for measurement)
this.addElement(tempText);

const measuredWidth = tempText.textWidth;
```

#### 3. Actual Text lines (Line ~351)
```typescript
const textInstance = new Text({...});

// Add as child to prevent it from being rendered on artboard
// TextArea will render this Text as part of its own rendering
this.addElement(textInstance);

this._textLines.push(textInstance);
```

## Benefits

1. ✅ **No more double rendering** - Text appears only once
2. ✅ **Cleaner hierarchy** - Text objects are children of TextArea, not orphans on artboard
3. ✅ **Better memory management** - Parent-child relationships are explicit
4. ✅ **Consistent with other components** - Follows same pattern as Angle, FlowBox, etc.

## Additional Fix: Text Positioning

### The Problem

After adding Text objects as children, they weren't being positioned! They all defaulted to position (0, 0) relative to TextArea. This broke:

1. **Text rendering** - All lines appeared at Y=0 (overlapping)
2. **Highlighting** - `getHighlightedWord()` returned wrong positions (all at 0,0)

### The Solution

Position each Text instance at its proper Y offset within the TextArea:

```typescript
// Position the text at its proper Y offset within the TextArea
textInstance.position({
  relativeFrom: textInstance.topLeft,
  relativeTo: this.contentBox.topLeft,
  x: 0,
  y: yOffset,
  boxReference: "contentBox",
});
```

Now:
- ✅ Each line is positioned at the correct Y offset
- ✅ `getHighlightedWord()` returns correct absolute positions
- ✅ Highlighting works correctly

## Testing

To verify the fix:

1. Run example 51: `playground/examples/tests/51-textarea-highlights-latex.js`
2. Check that text appears only once per line (no double rendering)
3. Verify lines are at correct Y positions (not all overlapping at Y=0)
4. Verify highlighting works and Rects appear at correct positions
5. Check that LaTeX rendering is not duplicated

## Lessons Learned

### When to Use Auto-Add to Artboard

**✅ Good Use Cases:**
- Top-level elements created by user code
- Elements returned from helper methods (like `createLabel()`)
- Components that should be independently positioned on artboard

**❌ Bad Use Cases:**
- Internal helper elements for measurement
- Elements that will be rendered by their parent
- Child elements of compound components

### Best Practice for Compound Components

If your component creates internal Shape objects:

1. **Always add them as children**: `this.addElement(internalShape)`
2. **This removes them from artboard** (one-parent policy)
3. **Render them yourself** in your `render()` method
4. **Don't rely on artboard to render your internals**

## Related

- See `ONE-PARENT-POLICY.md` for details on parent switching
- See `AUTO-ARTBOARD.md` for auto-artboard feature documentation

