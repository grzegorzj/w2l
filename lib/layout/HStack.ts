/**
 * HStack Layout module for horizontal stacking.
 *
 * This module provides the HStack class that arranges elements horizontally
 * side by side, similar to a horizontal list.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import { parseUnit } from "../core/units.js";

/**
 * Configuration for creating an HStack.
 */
export interface HStackConfig extends Omit<LayoutConfig, "width" | "height"> {
  /**
   * Spacing between stacked elements.
   * @defaultValue 0
   */
  spacing?: string | number;

  /**
   * Vertical alignment of elements.
   * - "top": Align to top edge
   * - "center": Center vertically
   * - "bottom": Align to bottom edge
   * @defaultValue "center"
   */
  verticalAlign?: "top" | "center" | "bottom";

  /**
   * Width of the stack container.
   * If not specified, behavior depends on fillWidth.
   */
  width?: string | number;

  /**
   * Height of the stack container.
   * If not specified, behavior depends on fillHeight.
   */
  height?: string | number;

  /**
   * Whether the stack should fill available width when placed in a container.
   * If true, the stack will expand to fill its parent's width.
   * If false, will auto-size to total width of elements.
   * @defaultValue false
   */
  fillWidth?: boolean;

  /**
   * Whether the stack should fill available height when placed in a container.
   * If true, the stack will expand to fill its parent's height.
   * If false, will auto-size to the tallest element.
   * @defaultValue false
   */
  fillHeight?: boolean;

  /**
   * Whether to auto-size width to fit all elements.
   * @defaultValue true if width not specified and fillWidth is false
   * @deprecated Use fillWidth instead
   */
  autoWidth?: boolean;

  /**
   * Whether to auto-size height to fit the tallest element.
   * @defaultValue true if height not specified and fillHeight is false
   * @deprecated Use fillHeight instead
   */
  autoHeight?: boolean;
}

/**
 * HStack arranges elements horizontally side by side.
 *
 * This is a simpler alternative to SpreadLayout for basic horizontal
 * arrangements without complex justification options.
 *
 * @remarks
 * HStack is useful for:
 * - Creating horizontal button groups
 * - Arranging icons in a row
 * - Building horizontal navigation
 * - Side-by-side layout of elements
 *
 * @example
 * Simple horizontal stack
 * ```typescript
 * const hstack = new HStack({
 *   spacing: 15,
 *   verticalAlign: "center"
 * });
 *
 * const icon1 = new Circle({ radius: 20 });
 * const icon2 = new Circle({ radius: 20 });
 * const icon3 = new Circle({ radius: 20 });
 *
 * hstack.addElement(icon1);
 * hstack.addElement(icon2);
 * hstack.addElement(icon3);
 * ```
 */
export class HStack extends Layout {
  private hstackConfig: HStackConfig;
  private stackedElements: Element[] = [];
  private isArranged: boolean = false;

  /**
   * Creates a new HStack instance.
   *
   * @param config - Configuration for the horizontal stack
   */
  constructor(config: HStackConfig = {}) {
    // Calculate dimensions based on auto-sizing
    // fillWidth/fillHeight take precedence over autoWidth/autoHeight
    const shouldAutoWidth = config.fillWidth
      ? false
      : config.autoWidth !== false && !config.width;
    const shouldAutoHeight = config.fillHeight
      ? false
      : config.autoHeight !== false && !config.height;

    super({
      ...config,
      width: config.width || 100,
      height: config.height || 100,
    });

    this.hstackConfig = {
      spacing: 0,
      verticalAlign: "center",
      fillWidth: false,
      fillHeight: false,
      autoWidth: shouldAutoWidth,
      autoHeight: shouldAutoHeight,
      ...config,
    };
  }

  /**
   * Indicates whether this HStack should fit to its container's dimensions.
   * Returns true if fillWidth or fillHeight is enabled.
   */
  get shouldFitContent(): boolean {
    return (
      this.hstackConfig.fillWidth === true ||
      this.hstackConfig.fillHeight === true
    );
  }

  /**
   * Override width getter to ensure elements are arranged before returning dimensions.
   */
  get width(): number {
    // Ensure elements are arranged so we have correct dimensions
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout();  // Use new layout() method
    }
    return this._width;
  }

  /**
   * Override height getter to ensure elements are arranged before returning dimensions.
   */
  get height(): number {
    // Ensure elements are arranged so we have correct dimensions
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout();  // Use new layout() method
    }
    return this._height;
  }

  /**
   * Adds an element to the horizontal stack.
   *
   * @param element - The element to add
   */
  addElement(element: Element): void {
    super.addElement(element);
    this.stackedElements.push(element);
    this.isArranged = false;
  }

  /**
   * Calculates the required dimensions for the stack.
   * @internal
   */
  private calculateDimensions(): { width: number; height: number } {
    if (this.stackedElements.length === 0) {
      return { width: this._width, height: this._height };
    }

    const spacing = parseUnit(this.hstackConfig.spacing || 0);
    let totalWidth = 0;
    let maxHeight = 0;

    this.stackedElements.forEach((element, index) => {
      const elem = element as any;

      const bbox =
        typeof elem.getBoundingBox === "function"
          ? elem.getBoundingBox(true)
          : {
              width: elem.width || elem.textWidth || elem.radius * 2 || 0,
              height: elem.height || elem.textHeight || elem.radius * 2 || 0,
            };

      totalWidth += bbox.width;
      maxHeight = Math.max(maxHeight, bbox.height);

      if (index < this.stackedElements.length - 1) {
        totalWidth += spacing;
      }
    });

    return {
      width: this.hstackConfig.autoWidth ? totalWidth : this._width,
      height: this.hstackConfig.autoHeight ? maxHeight : this._height,
    };
  }

  /**
   * Arranges all elements horizontally.
   * Can be called by parent layouts to ensure dimensions are calculated.
   * @internal
   */
  arrangeElements(): void {
    if (this.isArranged || this.stackedElements.length === 0) {
      return;
    }

    // IMPORTANT: Arrange child layouts first so they know their dimensions
    // This ensures nested VStack/HStack/ZStack children calculate their size before we position them
    this.stackedElements.forEach((element) => {
      const elem = element as any;
      if (typeof elem.arrangeElements === "function") {
        elem.arrangeElements();
      }
    });

    // Update dimensions if auto-sizing
    // Only auto-size dimensions if fill options are false
    if (this.hstackConfig.autoWidth || this.hstackConfig.autoHeight) {
      const dims = this.calculateDimensions();
      
      // Get padding values
      const padding = this.paddingBox;
      const paddingHorizontal = padding.left + padding.right;
      const paddingVertical = padding.top + padding.bottom;
      
      // Add padding to dimensions (box model: padding adds to total size)
      if (this.hstackConfig.autoWidth && !this.hstackConfig.fillWidth) {
        this._width = dims.width + paddingHorizontal;
      }
      if (this.hstackConfig.autoHeight && !this.hstackConfig.fillHeight) {
        this._height = dims.height + paddingVertical;
      }
    }

    const spacing = parseUnit(this.hstackConfig.spacing || 0);
    
    // Get padding to position elements within the content area
    const padding = this.paddingBox;
    const contentHeight = this._height - padding.top - padding.bottom;
    let currentX = padding.left;  // Start from padding left

    this.stackedElements.forEach((element, index) => {
      const elem = element as any;

      if (elem._isAbsolutePositioned) {
        return;
      }

      const bbox =
        typeof elem.getBoundingBox === "function"
          ? elem.getBoundingBox(true)
          : {
              width: elem.width || elem.textWidth || elem.radius * 2 || 0,
              height: elem.height || elem.textHeight || elem.radius * 2 || 0,
            };

      const elementWidth = bbox.width;
      const elementHeight = bbox.height;

      // Calculate the target point where we want to align the element
      // For HStack: vertical position varies by alignment, horizontal is stacked from currentX
      let containerTargetX: number;
      let containerTargetY: number;

      // Horizontal position: left edge of the element starts at currentX
      containerTargetX = currentX;

      // Vertical alignment within the content area (accounting for padding)
      switch (this.hstackConfig.verticalAlign) {
        case "top":
          containerTargetY = padding.top;
          break;
        case "bottom":
          containerTargetY = padding.top + contentHeight;
          break;
        case "center":
        default:
          containerTargetY = padding.top + contentHeight / 2;
          break;
      }

      // Get element's alignment point (respects edge-to-edge semantics)
      // For "left" align, this returns the element's LEFT edge
      // For "top" align, this returns the element's TOP edge
      const elementPoint = elem.getAlignmentPoint(
        "left", // HStack always aligns elements by their left edge in horizontal direction
        this.hstackConfig.verticalAlign || "center"
      );

      // Calculate offset: where element's alignment point is relative to its currentPosition
      const absPos = elem.getAbsolutePosition();
      const elementPointX = parseFloat(String(elementPoint.x));
      const elementPointY = parseFloat(String(elementPoint.y));
      const offsetX = elementPointX - absPos.x;
      const offsetY = elementPointY - absPos.y;

      console.log(`[HStack] Element ${index} alignment:`, {
        name: elem.name || elem.constructor.name,
        elementWidth,
        elementHeight,
        elementPoint: { x: elementPoint.x, y: elementPoint.y },
        elementPointParsed: { x: elementPointX, y: elementPointY },
        absPos: { x: absPos.x, y: absPos.y },
        offset: { x: offsetX, y: offsetY },
        containerTarget: { x: containerTargetX, y: containerTargetY },
      });

      // Set currentPosition so that elementPoint aligns with containerTarget
      const finalX = containerTargetX - offsetX;
      const finalY = containerTargetY - offsetY;
      
      console.log(`[HStack] Element ${index} final position:`, {
        finalX,
        finalY,
      });

      elem.currentPosition = {
        x: finalX,
        y: finalY,
      };

      currentX += elementWidth + spacing;

      if (typeof elem.notifyDependents === "function") {
        elem.notifyDependents();
      }
    });

    this.isArranged = true;
  }

  /**
   * Overrides position to arrange elements after positioning the stack.
   */
  position(config: any): void {
    this.arrangeElements();
    super.position(config);
    this.childrenManager.resetTracking();
  }

  /**
   * Overrides render to arrange elements before rendering.
   */
  render(): string {
    this.arrangeElements();
    return super.render();
  }
}

