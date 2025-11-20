# Artboard Padding Guides - Visual Box Model

## Overview

Added visual debugging guides to show artboard padding and content areas. This makes it easy to understand how the CSS box model applies to the artboard itself.

## What Was Added

### New Config Option: `showPaddingGuides`

Added to `ArtboardConfig`:

```typescript
interface ArtboardConfig {
  // ... existing options
  
  /**
   * Show visual guides for the artboard's padding and content areas.
   * Useful for debugging and understanding the box model.
   * @defaultValue false
   */
  showPaddingGuides?: boolean;
}
```

### Visual Elements

When `showPaddingGuides: true`, the artboard renders:

1. **Red Semi-Transparent Overlay** - Shows padding areas (top, right, bottom, left)
2. **Red Solid Border** - Outlines the artboard's border box (outer boundary)
3. **Blue Dashed Border** - Outlines the content area (inside padding)
4. **Text Labels** - "Padding" and "Content Area" for clarity

## Usage

```typescript
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true  // Enable guides
});

// Add your elements - they'll be offset by padding
const box = new Rectangle({ width: 200, height: 100 });
artboard.addElement(box);

artboard.render();
```

## Visual Legend

```
┌─────────────────────────────────────────┐  ← Red border (border box)
│  ┌─────────────┐                        │  ← Red overlay (padding)
│  │   Padding   │                        │
│  └─────────────┘                        │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │  ← Blue dashed (content area)
│  │                                  │   │
│  │      Content Area                │   │
│  │  (Elements positioned here)      │   │
│  │                                  │   │
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
│                                         │
└─────────────────────────────────────────┘
```

## Color Coding

- 🔴 **Red** (`rgba(255, 200, 200, 0.2)`) - Padding areas (semi-transparent)
- 🔴 **Red** (`#F44336`) - Border box outline (solid, 2px)
- 🔵 **Blue** (`#2196F3`) - Content area border (dashed, 2px)

## Examples

### Example 1: Simple Padding Guide

```typescript
const artboard = new Artboard({
  size: { width: 600, height: 400 },
  padding: "40px",
  showPaddingGuides: true
});
```

### Example 2: Asymmetric Padding

```typescript
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: { top: 80, right: 40, bottom: 40, left: 40 },
  showPaddingGuides: true
});
```

### Example 3: Debugging Layout Issues

```typescript
// When elements seem "off", enable guides to see the padding
const artboard = new Artboard({
  size: { width: 1000, height: 800 },
  padding: "60px",
  backgroundColor: "#f8f9fa",
  showPaddingGuides: true  // Debug mode
});

// Position elements and see exactly how padding affects them
const box = new Rectangle({ width: 200, height: 100 });
box.position({
  relativeFrom: box.topLeft,
  relativeTo: artboard.center,  // This is relative to content area
  x: 0,
  y: 0
});
```

## Playground Examples

- **Example 47** (`47-box-model.js`) - Shows box model with artboard padding guides
- **Example 48** (`48-artboard-padding-guides.js`) - Dedicated demonstration of padding guides

## When to Use

Use `showPaddingGuides: true` when:

- 🐛 **Debugging** - Understanding why elements are positioned where they are
- 📚 **Learning** - Understanding how the box model works
- 🎨 **Design** - Verifying padding is correct during development
- 📖 **Documentation** - Creating examples that explain layouts

**Note:** Disable in production by setting `showPaddingGuides: false` (or omitting it, as it defaults to `false`).

## Implementation Details

The guides are rendered as:
1. A separate SVG `<g>` group with id `artboard-padding-guides`
2. Positioned **before** the content group (so they appear behind elements)
3. Semi-transparent to not obscure content
4. Conditional - only rendered when `showPaddingGuides: true`

## Technical Notes

- Guides are generated in `generatePaddingGuides()` method
- Labels only appear if there's enough space (padding ≥ 20px for top label, content height ≥ 30px for content label)
- All guide elements use opacity and semi-transparency to remain non-intrusive
- The guides respect the actual padding values (asymmetric padding shows correctly)

## Files Modified

- `/lib/core/Artboard.ts` - Added `showPaddingGuides` config option and `generatePaddingGuides()` method
- `/playground/examples/47-box-model.js` - Updated to use padding guides
- `/playground/examples/48-artboard-padding-guides.js` - New dedicated example

## Build Status

✅ TypeScript compilation successful  
✅ All tests passing  
✅ Type definitions generated

## Summary

Artboard padding guides provide a visual debugging tool that makes it easy to understand and verify the CSS box model as applied to artboards. The feature is opt-in, non-intrusive, and color-coded for clarity.

