# New Layout System Examples

This folder contains examples exclusively using the **new layout system** from `/lib/new`.

## What's Different?

The new layout system is a complete rewrite with:
- Clean architecture and proper hierarchy
- Box model support (margin, border, padding, content)
- Multiple layout strategies (proactive and reactive)
- Better positioning model (relative storage, absolute getters)
- Geometric transforms (rotate, translate)
- Auto-sizing with bounds normalization

## Import Pattern

All examples here use:
```javascript
import { NewArtboard, NewContainer, NewRect, NewCircle, ... } from "w2l";
```

**Note:** Only use elements with the `New` prefix from `/lib/new`. Old elements from `/lib/elements` are not compatible.

## Layout Modes

### Container Directions
- `"horizontal"` - Stack children left-to-right (proactive)
- `"vertical"` - Stack children top-to-bottom (proactive)
- `"none"` - Artboard mode: auto-positions, normalizes bounds (semi-reactive)
- `"freeform"` - Pure reactive: children position themselves, parent only sizes

### Examples in This Folder
- `freeform-layout.js` - Demonstrates the new "freeform" mode vs "none" mode

## See Also
- `/guides/new/README.md` - Documentation for new layout system
- `/lib/new/` - Implementation

