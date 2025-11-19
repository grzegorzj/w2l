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
      if (this.hstackConfig.autoWidth && !this.hstackConfig.fillWidth) {
        this._width = dims.width;
      }
      if (this.hstackConfig.autoHeight && !this.hstackConfig.fillHeight) {
        this._height = dims.height;
      }
    }

    const spacing = parseUnit(this.hstackConfig.spacing || 0);
    const stackHeight = this._height;
    let currentX = 0;

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

      // Horizontal position
      const targetX = currentX + elementWidth / 2;

      // Calculate vertical position based on alignment
      let targetY: number;

      switch (this.hstackConfig.verticalAlign) {
        case "top":
          targetY = elementHeight / 2;
          break;
        case "bottom":
          targetY = stackHeight - elementHeight / 2;
          break;
        case "center":
        default:
          targetY = stackHeight / 2;
          break;
      }

      // Convert to appropriate coordinate system
      let finalX = targetX;
      let finalY = targetY;

      if (elem._width !== undefined && elem._height !== undefined) {
        finalX = targetX - elem._width / 2;
        finalY = targetY - elem._height / 2;
      } else if (elem.width !== undefined && elem.height !== undefined) {
        finalX = targetX - elem.width / 2;
        finalY = targetY - elem.height / 2;
      }

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

