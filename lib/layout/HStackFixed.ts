/**
 * HStackFixed - Temporary fixed version of HStack
 * Uses position() API like ColumnsLayout instead of direct currentPosition manipulation
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import { parseUnit } from "../core/units.js";

export interface HStackFixedConfig
  extends Omit<LayoutConfig, "width" | "height"> {
  spacing?: string | number;
  verticalAlign?: "top" | "center" | "bottom";
  width?: string | number;
  height?: string | number;
  autoWidth?: boolean;
  autoHeight?: boolean;
}

export class HStackFixed extends Layout {
  private hstackConfig: HStackFixedConfig;
  private stackedElements: Element[] = [];
  private isArranged: boolean = false;
  private childrenArranged: boolean = false;

  constructor(config: HStackFixedConfig = {}) {
    const shouldAutoWidth = config.autoWidth !== false && !config.width;
    const shouldAutoHeight = config.autoHeight !== false && !config.height;

    super({
      ...config,
      width: config.width || 100,
      height: config.height || 100,
    });

    this.hstackConfig = {
      spacing: 0,
      verticalAlign: "center",
      autoWidth: shouldAutoWidth,
      autoHeight: shouldAutoHeight,
      ...config,
    };
  }

  get width(): number {
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout();
    }
    return this._width;
  }

  get height(): number {
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout();
    }
    return this._height;
  }

  protected performLayout(): void {
    // Only calculate dimensions and store relative positions
    // Don't position children yet - parent might not be positioned
    this.arrangeElements();
  }

  addElement(element: Element): void {
    super.addElement(element);
    this.stackedElements.push(element);
    this.isArranged = false;
  }

  /**
   * Override position to ensure children are positioned after parent
   */
  position(config: any): void {
    // Ensure layout has happened (dimensions are calculated)
    if (!this.isArranged && this.stackedElements.length > 0) {
      this.layout();
    }
    
    // Position the HStack itself
    super.position(config);
    
    // NOW position children based on HStack's final position
    this.positionChildrenForRendering();
  }

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
      if (index < this.stackedElements.length - 1) {
        totalWidth += spacing;
      }
      maxHeight = Math.max(maxHeight, bbox.height);
    });

    return {
      width: this.hstackConfig.autoWidth ? totalWidth : this._width,
      height: this.hstackConfig.autoHeight ? maxHeight : this._height,
    };
  }

  arrangeElements(): void {
    if (this.isArranged || this.stackedElements.length === 0) {
      return;
    }

    // Arrange child layouts first
    this.stackedElements.forEach((element) => {
      const elem = element as any;
      if (typeof elem.arrangeElements === "function") {
        elem.arrangeElements();
      }
    });

    // Update dimensions if auto-sizing
    if (this.hstackConfig.autoWidth || this.hstackConfig.autoHeight) {
      const dims = this.calculateDimensions();

      const padding = this.paddingBox;
      const paddingHorizontal = padding.left + padding.right;
      const paddingVertical = padding.top + padding.bottom;

      if (this.hstackConfig.autoWidth) {
        this._width = dims.width + paddingHorizontal;
      }
      if (this.hstackConfig.autoHeight) {
        this._height = dims.height + paddingVertical;
      }
    }

    const spacing = parseUnit(this.hstackConfig.spacing || 0);
    const padding = this.paddingBox;
    const contentHeight = this._height - padding.top - padding.bottom;
    let currentX = padding.left;

    // KEY DIFFERENCE: Use position() API instead of setting currentPosition directly!
    this.stackedElements.forEach((element, index) => {
      const elem = element as any;

      if (elem._isAbsolutePositioned) {
        return;
      }

      const bbox =
        typeof elem.getBoundingBox === "function"
          ? elem.getBoundingBox(true)
          : {
              width: elem.width || elem.radius * 2 || 0,
              height: elem.height || elem.radius * 2 || 0,
            };

      const elementWidth = bbox.width;
      const elementHeight = bbox.height;

      // Calculate container target position (where we want the element to align to)
      let containerTargetX: number = currentX; // Left edge for horizontal stacking
      let containerTargetY: number;

      // Vertical alignment within the content area
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

      // Store the target position and alignment info for later positioning
      // We can't calculate final positions now because children haven't been positioned yet
      (elem as any)._hstackTargetX = containerTargetX;
      (elem as any)._hstackTargetY = containerTargetY;
      (elem as any)._hstackAlignH = "left";
      (elem as any)._hstackAlignV = this.hstackConfig.verticalAlign || "center";

      currentX += elementWidth + spacing;

      if (typeof elem.notifyDependents === "function") {
        elem.notifyDependents();
      }
    });

    this.isArranged = true;
  }

  /**
   * Position children using absolute coordinates after this HStack has been positioned
   * This should only be called once, right before rendering, when currentPosition is final
   */
  private positionChildrenForRendering(): void {
    if (this.childrenArranged) {
      return;
    }

    // Get ABSOLUTE position (accounts for parent hierarchy)
    const absPos = this.getAbsolutePosition();
    const stackX = absPos.x;
    const stackY = absPos.y;

    console.log(
      `[HStackFixed] Positioning children with stack at absolute (${stackX}, ${stackY}), currentPosition was (${this.currentPosition.x}, ${this.currentPosition.y})`
    );

    this.stackedElements.forEach((element, index) => {
      const elem = element as any;

      if (elem._isAbsolutePositioned || elem._hstackTargetX === undefined) {
        return;
      }

      // Calculate absolute target: HStack's position + relative target
      const absoluteTargetX = stackX + elem._hstackTargetX;
      const absoluteTargetY = stackY + elem._hstackTargetY;

      // Get the element's alignment point for this alignment
      const alignmentPoint = elem.getAlignmentPoint(
        elem._hstackAlignH,
        elem._hstackAlignV
      );

      console.log(
        `[HStackFixed] Positioning child ${index} (${elem.constructor.name}) - aligning ${elem._hstackAlignH}/${elem._hstackAlignV} to (${absoluteTargetX}, ${absoluteTargetY}), alignmentPoint:`,
        alignmentPoint
      );

      // Use position() API like the manual example - this handles all the offset calculations
      element.position({
        relativeFrom: alignmentPoint,
        relativeTo: {
          x: `${absoluteTargetX}px`,
          y: `${absoluteTargetY}px`,
        },
        x: 0,
        y: 0,
      });

      console.log(
        `[HStackFixed] After positioning child ${index}: currentPosition = (${elem.currentPosition.x}, ${elem.currentPosition.y}), absPos = (${elem.getAbsolutePosition().x}, ${elem.getAbsolutePosition().y})`
      );
    });

    this.childrenArranged = true;
  }

  render(): string {
    this.arrangeElements();
    // Position children right before rendering, when currentPosition is final
    this.positionChildrenForRendering();
    return super.render();
  }
}
