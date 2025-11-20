# Layout Phase Architecture - Avoiding Circular Dependencies

## Problem Analysis

The current system has potential circular dependencies:

1. **Text measurement loops**: Accessing `.center` or `.width` on Text triggers `ensureMeasured()`, which can happen during layout calculations
2. **Box model during positioning**: `getBorderBox()`, `getContentBox()`, `getMarginBox()` call `getAbsolutePosition()` and access `width`/`height`, which for Text triggers measurement
3. **Parent-child sizing**: Layouts need child sizes to auto-size, but children might query parent during positioning
4. **Artboard auto-adjust**: Needs all element bounds, which triggers all measurements

## Root Causes

1. **Property getters with side effects**: `.width`, `.center` etc. trigger measurement
2. **No explicit phase separation**: measurement, layout, and rendering happen mixed
3. **Lazy evaluation everywhere**: everything computed on-demand creates chains
4. **No memoization guards**: same calculations repeated many times

## Architectural Solution: Explicit Layout Phases

### Phase 1: Measurement (Bottom-Up)
**What**: Determine intrinsic sizes of leaf elements
**When**: Once per element, before any positioning
**Who**: Text, Images, intrinsic-sized elements

```typescript
// Phase 1: Measure all content
element.measure();  // Explicit, idempotent, cached
```

**Rules**:
- Leaf elements compute their intrinsic size
- NO positioning queries allowed
- NO parent property access
- Results are cached until invalidated
- Safe to call multiple times (idempotent)

### Phase 2: Layout (Top-Down)
**What**: Calculate positions and sizes for elements
**When**: After measurement, before rendering
**Who**: Layouts, containers, positioned elements

```typescript
// Phase 2: Calculate layout
layout.layout();  // Arranges children, computes sizes
```

**Rules**:
- Can read measured child sizes
- Can set child positions
- Layouts compute their own size based on children
- NO reverse queries (child asking parent size during parent layout)

### Phase 3: Position (Mixed)
**What**: Apply absolute positioning, offsets
**When**: After layout
**Who**: Elements with explicit `.position()` calls

```typescript
// Phase 3: Position elements
element.position({ ... });  // Explicit positioning
```

**Rules**:
- Can query any measured/laid-out element
- Breaks element out of layout flow
- Marks element as "positioned"

### Phase 4: Render (Top-Down)
**What**: Generate SVG output
**When**: Final phase
**Who**: All elements

```typescript
// Phase 4: Render to SVG
artboard.render();
```

**Rules**:
- All measurements and positions must be final
- NO new calculations
- Pure transformation of state to SVG

## Implementation Strategy

### 1. Add Measurement Phase

```typescript
// In Element base class
export abstract class Element {
  protected _measured: boolean = false;
  protected _measuredSize?: { width: number; height: number };
  
  /**
   * Measure this element's intrinsic size.
   * Must be idempotent and have no side effects.
   */
  measure(): void {
    if (this._measured) return;
    this._measured = true;
    
    // Subclasses implement
    this.performMeasurement();
  }
  
  protected abstract performMeasurement(): void;
  
  /**
   * Invalidate measurement cache.
   * Call when properties that affect size change.
   */
  protected invalidateMeasurement(): void {
    this._measured = false;
    this._measuredSize = undefined;
  }
}
```

### 2. Text Measurement Without Recursion

```typescript
// In Text class
export class Text extends Shape {
  protected performMeasurement(): void {
    // ONLY measure size, don't access position properties
    if (this._measurementContainerGetter) {
      try {
        const dims = this.measureInBrowser();
        this._measuredSize = { 
          width: dims.totalWidth, 
          height: dims.totalHeight 
        };
      } catch (error) {
        // Fallback to estimates
        this._measuredSize = this.estimateSize();
      }
    } else {
      this._measuredSize = this.estimateSize();
    }
  }
  
  // Safe size accessors that don't trigger positioning
  get measuredWidth(): number {
    if (!this._measured) this.measure();
    return this._measuredSize?.width || 0;
  }
  
  get measuredHeight(): number {
    if (!this._measured) this.measure();
    return this._measuredSize?.height || 0;
  }
  
  // Position getters now safe - no recursive measurement
  get center(): Point {
    return this.toAbsolutePoint(
      this.measuredWidth / 2, 
      this.measuredHeight / 2, 
      "center"
    );
  }
}
```

### 3. Layout Phase in Layouts

```typescript
// In Layout base class
export class Layout extends Rectangle {
  protected _layoutDone: boolean = false;
  
  /**
   * Perform layout of children.
   * Call after all children have been measured.
   */
  layout(): void {
    if (this._layoutDone) return;
    
    // Phase 1: Ensure all children are measured
    this.getChildren().forEach(child => {
      if ('measure' in child) {
        (child as any).measure();
      }
    });
    
    // Phase 2: Arrange children (subclass implements)
    this.performLayout();
    
    this._layoutDone = true;
  }
  
  protected abstract performLayout(): void;
  
  protected invalidateLayout(): void {
    this._layoutDone = false;
  }
}
```

### 4. VStack/HStack Auto-Sizing

```typescript
// In VStack
export class VStack extends Layout {
  protected performLayout(): void {
    const children = this.getChildren();
    const padding = this.paddingBox;
    const spacing = parseUnit(this.config.spacing || 0);
    
    // Calculate total height needed (children already measured)
    let totalHeight = padding.top + padding.bottom;
    let maxWidth = 0;
    
    children.forEach((child, index) => {
      const childElem = child as any;
      const childHeight = childElem.measuredHeight || childElem.height || 0;
      const childWidth = childElem.measuredWidth || childElem.width || 0;
      
      totalHeight += childHeight;
      if (index < children.length - 1) {
        totalHeight += spacing;
      }
      maxWidth = Math.max(maxWidth, childWidth);
    });
    
    // Auto-size if needed
    if (this.config.autoHeight) {
      this._height = totalHeight;
    }
    if (this.config.autoWidth) {
      this._width = maxWidth + padding.left + padding.right;
    }
    
    // Now position children
    let currentY = padding.top;
    children.forEach(child => {
      const childElem = child as any;
      const childHeight = childElem.measuredHeight || childElem.height || 0;
      
      // Position child
      this.positionChild(child, currentY);
      
      currentY += childHeight + spacing;
    });
  }
}
```

### 5. Artboard Orchestration

```typescript
// In Artboard
export class Artboard extends Rectangle {
  render(): string {
    // Phase 1: Measure all elements
    this.measureAll();
    
    // Phase 2: Layout all containers
    this.layoutAll();
    
    // Phase 3: Auto-adjust size if needed
    if (this.artboardConfig.autoAdjust) {
      this.recalculateSize();
    }
    
    // Phase 4: Render
    return this.renderToSVG();
  }
  
  private measureAll(): void {
    const allElements = this.collectAllElements(this.elements);
    allElements.forEach(element => {
      if ('measure' in element) {
        (element as any).measure();
      }
    });
  }
  
  private layoutAll(): void {
    // Layout in order: deepest children first
    const allElements = this.collectAllElements(this.elements);
    const sorted = this.sortByDepth(allElements);
    
    sorted.forEach(element => {
      if ('layout' in element) {
        (element as any).layout();
      }
    });
  }
}
```

## Key Principles

### 1. **Idempotency**
Every phase method can be called multiple times safely:
```typescript
element.measure();
element.measure();  // No-op, already measured
```

### 2. **Explicit Invalidation**
When properties change, explicitly invalidate:
```typescript
setText(newText: string) {
  this.config.content = newText;
  this.invalidateMeasurement();  // Clear cache
}
```

### 3. **No Cross-Phase Dependencies**
- Measurement can't query positions
- Layout can't re-trigger measurement
- Render can't modify state

### 4. **Clear Responsibility**
- **Leaf elements** (Text, Circle): Provide intrinsic size
- **Layouts** (VStack, HStack): Arrange children, compute own size
- **Artboard**: Orchestrate phases

### 5. **Safe Fallbacks**
Always provide estimates if browser measurement fails:
```typescript
protected performMeasurement(): void {
  try {
    this._measuredSize = this.measureInBrowser();
  } catch {
    this._measuredSize = this.estimate();
  }
}
```

## Migration Path

### Step 1: Add measure() to base Element
- Default implementation (no-op for fixed-size elements)
- Text/Image implement actual measurement
- Cache results in `_measuredSize`

### Step 2: Update property getters
- Replace `ensureMeasured()` calls with `measure()` calls
- Move measurement logic out of getters
- Make getters pure (no side effects)

### Step 3: Add layout() to layouts
- Move `arrangeElements()` logic to `layout()`
- Call child `measure()` before sizing
- Compute auto-sizes after measuring children

### Step 4: Update Artboard.render()
- Add explicit phase orchestration
- Call `measureAll()` → `layoutAll()` → `renderToSVG()`

### Step 5: Update examples
- For auto-sizing layouts, don't need explicit sizes
- Remove workarounds for circular dependencies

## Benefits

1. ✅ **No circular dependencies** - clear phase ordering
2. ✅ **Predictable** - same inputs = same outputs
3. ✅ **Debuggable** - can inspect state after each phase
4. ✅ **Performant** - measure once, use many times
5. ✅ **Composable** - nested layouts work naturally
6. ✅ **Maintainable** - clear separation of concerns

## Example Usage

```typescript
// Auto-sizing VStack - no circular dependencies!
const vstack = new VStack({
  spacing: 20,
  autoHeight: true,  // Will calculate from children
  autoWidth: true    // Will calculate from children
});

const text1 = new Text({ content: "Hello", fontSize: 24 });
const text2 = new Text({ content: "World", fontSize: 16 });

vstack.addElement(text1);
vstack.addElement(text2);

// Under the hood:
// 1. text1.measure() → width: 120, height: 30
// 2. text2.measure() → width: 80, height: 20
// 3. vstack.layout() → width: 120, height: 70 (30 + 20 + 20 spacing)
// 4. vstack.render() → positions text1 at (0, 0), text2 at (0, 50)

artboard.addElement(vstack);
artboard.render();  // Orchestrates all phases
```

## Testing Strategy

1. **Unit tests**: Each phase method in isolation
2. **Integration tests**: Full render pipeline
3. **Circular dep detector**: Tool to detect potential loops
4. **Performance tests**: Ensure O(n) not O(n²)

## Future Enhancements

1. **Incremental layout**: Only re-layout changed subtrees
2. **Layout constraints**: Min/max sizes, aspect ratios
3. **Flexbox-like**: Grow/shrink factors
4. **Grid auto-sizing**: Based on content

