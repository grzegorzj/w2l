# Stack Naming Clarification - VStack, HStack, ZStack

## Issue

Initial confusion about "StackLayout": I implemented z-axis stacking (elements layered on top of each other), but the user wanted vertical stacking (elements one under another like a list).

Both are useful, so we need clear naming to distinguish them.

## Solution

Following SwiftUI naming conventions for clarity:

1. **VStack** - Vertical Stack (elements one under another) ⬇️
2. **HStack** - Horizontal Stack (elements side by side) ➡️
3. **ZStack** - Z-axis Stack (elements layered on top) 📚

## Implementations

### VStack - Vertical Stacking

Arranges elements vertically, one under another.

```typescript
const vstack = new VStack({
  spacing: 20,
  horizontalAlign: "center"  // "left" | "center" | "right"
});

vstack.addElement(title);
vstack.addElement(subtitle);
vstack.addElement(paragraph);
// Elements stack vertically with 20px spacing
```

**Features:**
- Auto-sizing (width/height adapt to content)
- Configurable spacing between elements
- Horizontal alignment (left, center, right)
- Perfect for text paragraphs, cards, lists

**Use Cases:**
- Document layouts (title, subtitle, body)
- Vertical lists
- Card stacks
- Form fields
- Navigation menus

### HStack - Horizontal Stacking

Arranges elements horizontally, side by side.

```typescript
const hstack = new HStack({
  spacing: 15,
  verticalAlign: "center"  // "top" | "center" | "bottom"
});

hstack.addElement(icon1);
hstack.addElement(icon2);
hstack.addElement(icon3);
// Elements arranged horizontally with 15px spacing
```

**Features:**
- Auto-sizing (width/height adapt to content)
- Configurable spacing between elements
- Vertical alignment (top, center, bottom)
- Perfect for horizontal groups

**Use Cases:**
- Button groups
- Icon rows
- Horizontal navigation
- Side-by-side layouts

### ZStack - Z-Axis Layering

Layers elements on top of each other (same position, different z-index).

```typescript
const zstack = new ZStack({
  width: 200,
  height: 200,
  horizontalAlign: "center",
  verticalAlign: "center",
  layerOffset: 5  // Optional offset for card deck effect
});

zstack.addElement(background);
zstack.addElement(icon);
zstack.addElement(badge);
// All elements centered on top of each other
```

**Features:**
- Fixed or auto size
- Alignment for all layers
- Optional layer offset (card deck effect)
- Elements render in order (later = on top)

**Use Cases:**
- Badges on icons
- Overlays
- Card decks
- Layered compositions
- Modal backgrounds

## Naming Comparison

| Name | Direction | Elements | Similar To |
|------|-----------|----------|------------|
| VStack | Vertical (↓) | One under another | CSS flex-direction: column |
| HStack | Horizontal (→) | Side by side | CSS flex-direction: row |
| ZStack | Z-axis (📚) | Stacked on top | CSS position: absolute |

## Relationship to Existing Layouts

### VStack vs SpreadLayout
- **VStack**: Simple vertical list with spacing
- **SpreadLayout**: More complex with justify options (space-between, space-around, etc.)

VStack is simpler for basic vertical lists. SpreadLayout offers more control for distribution.

### HStack vs SpreadLayout
- **HStack**: Simple horizontal row with spacing
- **SpreadLayout**: More complex justification options

HStack is simpler for basic horizontal groups. SpreadLayout offers space-between, space-around, etc.

### When to Use What

**Use VStack when:**
- You want a simple vertical list
- Elements should be one under another with consistent spacing
- You want auto-sizing based on content

**Use HStack when:**
- You want a simple horizontal row
- Elements should be side by side with consistent spacing
- You want auto-sizing based on content

**Use SpreadLayout when:**
- You need complex justification (space-between, center, etc.)
- You want precise control over element distribution
- You need to fill a specific width/height

**Use ZStack when:**
- You want to layer elements on top of each other
- You need overlays or badges
- You want to create depth effects

## Files Created

1. `lib/layout/VStack.ts` - Vertical stack implementation
2. `lib/layout/HStack.ts` - Horizontal stack implementation
3. `lib/layout/ZStack.ts` - Renamed from StackLayout.ts

## Files Modified

1. `lib/layout/index.ts` - Export VStack, HStack, ZStack
2. `lib/index.ts` - Export VStack, HStack, ZStack

## Examples

- `playground/examples/37-vstack-hstack.js` - VStack and HStack demonstrations
- `playground/examples/33-stack-layout.js` - Now uses ZStack (needs updating)
- `playground/examples/34-comprehensive-layouts.js` - Needs updating to use new names

## Migration

### Old Code (if using StackLayout)
```typescript
import { StackLayout } from "w2l";

const stack = new StackLayout({
  // z-axis stacking
});
```

### New Code
```typescript
import { ZStack } from "w2l";

const stack = new ZStack({
  // z-axis stacking
});
```

## Summary

**Three distinct stack types:**
- **VStack** ⬇️ = Vertical list (one under another)
- **HStack** ➡️ = Horizontal row (side by side)
- **ZStack** 📚 = Z-axis layers (stacked on top)

Clear, intuitive naming that matches industry standards (SwiftUI, Flutter) and eliminates confusion about what "stack" means.

