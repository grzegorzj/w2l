# Auto-Artboard Feature

## Overview

The playground now automatically creates a default artboard if one doesn't exist in the user's code. This saves tokens when using AI agents to generate visualizations, as they don't need to waste tokens creating boilerplate artboard code.

## Implementation

### 1. Artboard Context System

The library already had an artboard context system (`lib/core/ArtboardContext.ts`) that tracks the current artboard. When elements are created, they automatically add themselves to the current artboard (if one exists) via the `Shape` constructor.

### 2. Playground Auto-Prepending

The playground's code execution (`playground/src/hooks/useCodeExecution.ts`) now:

1. **Detects if artboard is created**: Checks if the user code contains `new Artboard(`
2. **Auto-prepends if missing**: If no artboard is detected, prepends:
   ```javascript
   const artboard = new Artboard({ width: "auto", height: "auto" });
   ```
3. **Clears context before execution**: Calls `clearCurrentArtboard()` before each execution to ensure clean state

### 3. Updated Agent Instructions

The agent server guides (`agent_server/guides/00-base-instructions.md`) now emphasize:

- **Artboard is auto-created** - Agents don't need to create artboards unless custom sizing is required
- **Just create shapes** - Start with shape creation directly
- Only create explicit artboards for:
  - Custom sizing requirements
  - Multiple artboards in one visualization
  - Specific padding/styling needs

## Usage

### For Users

Just write code that creates shapes:

```javascript
const circle = new Circle({
  radius: 50,
  style: { fill: "lightblue" }
});

const square = new Square({
  size: 80,
  style: { fill: "lightcoral" }
});

square.position({
  relativeFrom: square.topLeft,
  relativeTo: circle.topRight,
  x: 20,
  y: 0
});
```

The playground automatically handles:
- Creating the artboard
- Adding shapes to it
- Rendering the result

### For Agents

The agent should:
1. Create shapes directly without worrying about artboards
2. Only create artboards when:
   - User requests specific dimensions
   - User needs multiple artboards
   - User wants custom padding/styling

## Benefits

1. **Token Efficiency**: Agents save ~50-100 tokens per visualization by not creating boilerplate artboard code
2. **Simpler Code**: User code is more concise and focused on the actual content
3. **Better DX**: New users don't need to understand artboards immediately
4. **Backward Compatible**: Existing code with explicit artboards still works perfectly

## Technical Details

### How Elements Auto-Add

1. `Shape` constructor (in `lib/core/Shape.ts`) calls `this.autoAddToArtboard()`
2. `autoAddToArtboard()` (in `lib/core/Element.ts`) gets the current artboard via `getCurrentArtboard()`
3. If an artboard exists in the context, the shape is added to it
4. The playground ensures an artboard exists by prepending creation code

### Execution Flow

```
User Code (no artboard)
  ↓
Playground detects no artboard creation
  ↓
Prepends: const artboard = new Artboard({ width: "auto", height: "auto" });
  ↓
Execute code
  ↓
Artboard constructor calls setCurrentArtboard(this)
  ↓
Each shape created calls autoAddToArtboard()
  ↓
Shapes are added to the artboard
  ↓
Auto-return artboard.render() (existing logic)
```

## Example Test

See: `/playground/examples/test-auto-artboard.js`

This example creates shapes without any artboard code and should render correctly.

## Future Enhancements

Possible improvements:
1. Support for multiple auto-artboards (when code naturally separates into groups)
2. Auto-detect when explicit artboard is needed (e.g., for complex layouts)
3. Smarter artboard sizing based on content analysis

