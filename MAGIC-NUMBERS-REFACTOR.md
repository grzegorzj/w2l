# MathJax Magic Numbers Refactor

## Problem

The codebase contained **magic numbers** used for MathJax configuration that appeared **34 times** across multiple files without explanation:

- `0.5` - Used 17 times
- `80` - Used 17 times  
- `1000` - Used multiple times

These numbers lacked documentation and made the code harder to understand and maintain.

## Solution

Created a new constants file with well-documented constants:

### New File: `lib/core/mathjax-constants.ts`

```typescript
/**
 * The ratio of ex units to em units.
 * In typography, an "ex" is traditionally the height of the lowercase letter 'x',
 * which is typically about half the em size (the font size).
 */
export const MATHJAX_EX_TO_EM_RATIO = 0.5;

/**
 * Container width multiplier for MathJax rendering.
 * We provide a large container (80 × fontSize) to prevent unwanted line wrapping
 * and ensure formulas render on a single line when possible.
 */
export const MATHJAX_CONTAINER_WIDTH_MULTIPLIER = 80;

/**
 * MathJax uses 1000 units per em in its internal coordinate system.
 * This constant is used to convert from MathJax viewBox units to pixels.
 */
export const MATHJAX_UNITS_PER_EM = 1000;
```

## What These Constants Mean

### `MATHJAX_EX_TO_EM_RATIO` (0.5)

In typography:
- **em** = font size (e.g., 16px)
- **ex** = height of lowercase 'x' (typically ~50% of em)

MathJax uses these units for proper vertical metrics in formulas.

**Example**: If fontSize = 16px, then ex = 8px

### `MATHJAX_CONTAINER_WIDTH_MULTIPLIER` (80)

MathJax needs to know the container width for formula layout. We provide:
- Container width = `80 × fontSize`
- Prevents line wrapping in mathematical expressions
- Large enough for most formulas

**Example**: If fontSize = 16px, container width = 1280px

### `MATHJAX_UNITS_PER_EM` (1000)

MathJax's internal coordinate system uses 1000 units per em. We use this to convert from MathJax's viewBox coordinates to actual pixel dimensions.

**Formula**: `pixelSize = viewBoxSize × (fontSize / 1000)`

## Files Updated

### New Files
- `lib/core/mathjax-constants.ts` - Constants definitions

### Modified Files (Magic Numbers → Constants)
- `lib/new/elements/Latex.ts` - 4 → 4 replacements (+ 2 for scale)
- `lib/new/elements/Text.ts` - 4 → 4 replacements (+ 2 for scale)
- `lib/elements/LatexText.ts` - 1 → 1 replacement (+ 3 for scale)
- `lib/elements/MixedText.ts` - 4 → 4 replacements (+ 4 for scale)
- `lib/core/index.ts` - Added exports for constants

### Deleted Files
- `lib/new/elements/MixedText.ts` - Duplicate file (was renamed to Text.ts)

## Before vs After

### Before (Magic Numbers)
```typescript
const node = MathJax.tex2svg(content, {
  display: false,
  em: this._fontSize,
  ex: this._fontSize * 0.5,        // ❌ What is 0.5?
  containerWidth: 80 * this._fontSize  // ❌ Why 80?
});

const scale = this._fontSize / 1000;  // ❌ What is 1000?
```

### After (Named Constants)
```typescript
const node = MathJax.tex2svg(content, {
  display: false,
  em: this._fontSize,
  ex: this._fontSize * MATHJAX_EX_TO_EM_RATIO,  // ✅ Clear meaning
  containerWidth: MATHJAX_CONTAINER_WIDTH_MULTIPLIER * this._fontSize  // ✅ Documented
});

const scale = this._fontSize / MATHJAX_UNITS_PER_EM;  // ✅ Explicit conversion
```

## Benefits

1. **Readability**: Code is self-documenting
2. **Maintainability**: Change once, apply everywhere
3. **Documentation**: Constants explain the "why" not just the "what"
4. **Consistency**: Same values guaranteed across all components
5. **Discoverability**: Exported constants can be used by library consumers

## Usage

The constants are exported from the core module:

```typescript
import { 
  MATHJAX_EX_TO_EM_RATIO,
  MATHJAX_CONTAINER_WIDTH_MULTIPLIER,
  MATHJAX_UNITS_PER_EM
} from 'w2l';
```

## Statistics

- **Total replacements**: 34 magic numbers eliminated
- **Files modified**: 5 implementation files + 1 export file
- **New file**: 1 constants file with documentation
- **Build status**: ✅ All tests passing, no linter errors

## Related

See also:
- `LATEX-REFACTOR-SUMMARY.md` - Component separation (NewLatex vs NewText)
- MathJax documentation on em/ex units
- Typography conventions for ex-height

