/**
 * VStack Layout module for vertical stacking.
 *
 * This module provides the VStack class that arranges elements vertically
 * one under another (not layered), similar to a vertical list.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import { parseUnit } from "../core/units.js";

/**
 * Configuration for creating a VStack.
 */
export interface VStackConfig extends Omit<LayoutConfig, "width" | "height"> {
  /**
   * Spacing between stacked elements.
   * @defaultValue 0
   */
  spacing?: string | number;

  /**
   * Horizontal alignment of elements.
   * - "left": Align to left edge
   * - "center": Center horizontally
   * - "right": Align to right edge
   * @defaultValue "center"
   */
  horizontalAlign?: "left" | "center" | "right";

  /**
   * Width of the stack container.
   * If not specified, behavior depends on fillWidth.
   */
  width?: string | number;

  /**
   * Height of the stack container.
   * If not specified, will auto-size to total height of stacked elements.
   */
  height?: string | number;

  /**
   * Whether the stack should fill available width when placed in a container.
   * If true, the stack will expand to fill its parent's width.
   * If false, will auto-size to the widest element.
   * @defaultValue false
   */
  fillWidth?: boolean;

  /**
   * Whether to auto-size width to fit the widest element.
   * @defaultValue true if width not specified and fillWidth is false
   * @deprecated Use fillWidth instead
   */
  autoWidth?: boolean;

  /**
   * Whether to auto-size height to fit all elements.
   * @defaultValue true if height not specified
   */
  autoHeight?: boolean;
}

/**
 * VStack arranges elements vertically one under another.
 *
 * Unlike StackLayout (z-stack) which layers elements on top of each other,
 * VStack places elements in a vertical list with configurable spacing.
 * This is useful for arranging text paragraphs, lists, or any vertical sequences.
 *
 * @remarks
 * VStack is useful for:
 * - Creating vertical lists
 * - Arranging text paragraphs
 * - Building vertical navigation menus
 * - Stacking cards or boxes vertically
 * - Creating vertical forms
 *
 * @example
 * Simple vertical stack
 * ```typescript
 * const vstack = new VStack({
 *   spacing: 20,
 *   horizontalAlign: "center"
 * });
 *
 * const title = new Text({ content: "Title", fontSize: 24 });
 * const subtitle = new Text({ content: "Subtitle", fontSize: 16 });
 * const body = new Text({ content: "Body text", fontSize: 14 });
 *
 * vstack.addElement(title);
 * vstack.addElement(subtitle);
 * vstack.addElement(body);
 *
 * // Stack auto-sizes to fit content
 * vstack.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: vstack.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 *
 * @example
 * Fixed-width vertical stack
 * ```typescript
 * const vstack = new VStack({
 *   width: 400,
 *   spacing: 15,
 *   horizontalAlign: "left"
 * });
 *
 * // Add multiple text elements
 * for (let i = 0; i < 5; i++) {
 *   const text = new Text({
 *     content: `Item ${i + 1}`,
 *     fontSize: 18
 *   });
 *   vstack.addElement(text);
 * }
 * ```
 */
export class VStack extends Layout {
  private vstackConfig: VStackConfig;
  private stackedElements: Element[] = [];
  private isArranged: boolean = false;

  /**
   * Creates a new VStack instance.
   *
   * @param config - Configuration for the vertical stack
   */
  constructor(config: VStackConfig = {}) {
    // Calculate dimensions based on auto-sizing
    // fillWidth takes precedence over autoWidth
    const shouldAutoWidth = config.fillWidth
      ? false
      : config.autoWidth !== false && !config.width;
    const shouldAutoHeight = config.autoHeight !== false && !config.height;

    super({
      ...config,
      width: config.width || 100, // Temporary, will be updated
      height: config.height || 100, // Temporary, will be updated
    });

    this.vstackConfig = {
      spacing: 0,
      horizontalAlign: "center",
      fillWidth: false,
      autoWidth: shouldAutoWidth,
      autoHeight: shouldAutoHeight,
      ...config,
    };
  }

  /**
   * Indicates whether this VStack should fit to its container's width.
   * Returns true if fillWidth is enabled.
   */
  get shouldFitContent(): boolean {
    return this.vstackConfig.fillWidth === true;
  }

  /**
   * Override width getter to ensure elements are arranged before returning dimensions.
   */
  get width(): number {
    // Ensure elements are arranged so we have correct dimensions
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout(); // Use new layout() method
    }
    return this._width;
  }

  /**
   * Override height getter to ensure elements are arranged before returning dimensions.
   */
  get height(): number {
    // Ensure elements are arranged so we have correct dimensions
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout(); // Use new layout() method
    }
    return this._height;
  }

  /**
   * Adds an element to the vertical stack.
   *
   * Elements will be arranged vertically when the stack is rendered or positioned.
   *
   * @param element - The element to add
   */
  addElement(element: Element): void {
    // Add to parent's children manager for hierarchy
    super.addElement(element);

    // Track for stacking
    this.stackedElements.push(element);

    // Mark that we need to re-arrange
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

    const spacing = parseUnit(this.vstackConfig.spacing || 0);
    let maxWidth = 0;
    let totalHeight = 0;

    this.stackedElements.forEach((element, index) => {
      const elem = element as any;

      // Get element dimensions
      const bbox =
        typeof elem.getBoundingBox === "function"
          ? elem.getBoundingBox(true)
          : {
              width: elem.width || elem.textWidth || elem.radius * 2 || 0,
              height: elem.height || elem.textHeight || elem.radius * 2 || 0,
            };

      maxWidth = Math.max(maxWidth, bbox.width);
      totalHeight += bbox.height;

      // Add spacing between elements (not after last)
      if (index < this.stackedElements.length - 1) {
        totalHeight += spacing;
      }
    });

    return {
      width: this.vstackConfig.autoWidth ? maxWidth : this._width,
      height: this.vstackConfig.autoHeight ? totalHeight : this._height,
    };
  }

  /**
   * Arranges all elements vertically.
   * Can be called by parent layouts to ensure dimensions are calculated.
   * @internal
   */
  arrangeElements(): void {
    if (this.isArranged || this.stackedElements.length === 0) {
      return;
    }

    // IMPORTANT: Arrange child layouts first so they know their dimensions
    // This ensures HStack/VStack children calculate their size before we position them
    this.stackedElements.forEach((element) => {
      const elem = element as any;
      if (typeof elem.arrangeElements === "function") {
        elem.arrangeElements();
      }
    });

    // Update dimensions if auto-sizing
    // Only auto-size width if fillWidth is false
    if (this.vstackConfig.autoWidth || this.vstackConfig.autoHeight) {
      const dims = this.calculateDimensions();

      // Get padding values
      const padding = this.paddingBox;
      const paddingHorizontal = padding.left + padding.right;
      const paddingVertical = padding.top + padding.bottom;

      // Add padding to dimensions (box model: padding adds to total size)
      if (this.vstackConfig.autoWidth && !this.vstackConfig.fillWidth) {
        this._width = dims.width + paddingHorizontal;
      }
      if (this.vstackConfig.autoHeight) {
        this._height = dims.height + paddingVertical;
      }
    }

    const spacing = parseUnit(this.vstackConfig.spacing || 0);

    // Get padding to position elements within the content area
    const padding = this.paddingBox;
    const contentWidth = this._width - padding.left - padding.right;
    let currentY = padding.top; // Start from padding top

    // Position each element vertically
    this.stackedElements.forEach((element, index) => {
      const elem = element as any;

      // Skip elements that have been explicitly positioned (absolute mode)
      if (elem._isAbsolutePositioned) {
        return;
      }

      // Get element dimensions
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
      // For VStack: horizontal position varies by alignment, vertical is stacked from currentY
      let containerTargetX: number;
      let containerTargetY: number;

      // Horizontal alignment within the content area (accounting for padding)
      switch (this.vstackConfig.horizontalAlign) {
        case "left":
          containerTargetX = padding.left;
          break;
        case "right":
          containerTargetX = padding.left + contentWidth;
          break;
        case "center":
        default:
          containerTargetX = padding.left + contentWidth / 2;
          break;
      }

      // Vertical position: top of the element starts at currentY
      containerTargetY = currentY;

      // Get element's alignment point (respects edge-to-edge semantics)
      // For "top" align, this returns the element's TOP edge
      // For "left" align, this returns the element's LEFT edge
      const elementPoint = elem.getAlignmentPoint(
        this.vstackConfig.horizontalAlign || "center",
        "top" // VStack always aligns elements by their top edge in vertical direction
      );

      // Calculate offset: where element's alignment point is relative to its currentPosition
      const absPos = elem.getAbsolutePosition();
      const elementPointX = parseFloat(String(elementPoint.x));
      const elementPointY = parseFloat(String(elementPoint.y));
      const offsetX = elementPointX - absPos.x;
      const offsetY = elementPointY - absPos.y;

      // Set currentPosition so that elementPoint aligns with containerTarget
      let finalX = containerTargetX - offsetX;
      let finalY = containerTargetY - offsetY;

      // finalX and finalY are already calculated above
      elem.currentPosition = {
        x: finalX,
        y: finalY,
      };

      // Move current Y position for next element
      currentY += elementHeight + spacing;

      // Notify dependent elements
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
    // Arrange first to get correct dimensions
    this.arrangeElements();

    // Now position the stack
    super.position(config);

    // Reset tracking
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
