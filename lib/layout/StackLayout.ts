/**
 * Stack Layout module for stacking elements on top of each other.
 *
 * This module provides the StackLayout class that stacks elements
 * on top of each other with various alignment options, similar to
 * CSS position: absolute with stacking context.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";

/**
 * Configuration for creating a StackLayout.
 */
export interface StackLayoutConfig extends LayoutConfig {
  /**
   * Horizontal alignment of stacked elements.
   * - "left": Align to left edge
   * - "center": Center horizontally
   * - "right": Align to right edge
   * @defaultValue "center"
   */
  horizontalAlign?: "left" | "center" | "right";

  /**
   * Vertical alignment of stacked elements.
   * - "top": Align to top edge
   * - "center": Center vertically
   * - "bottom": Align to bottom edge
   * @defaultValue "center"
   */
  verticalAlign?: "top" | "center" | "bottom";

  /**
   * Optional spacing/offset between stacked layers for visual effect.
   * Can be used to create a "card deck" appearance.
   * @defaultValue 0
   */
  layerOffset?: number;
}

/**
 * StackLayout stacks elements on top of each other.
 *
 * This layout places all added elements at the same position (aligned according
 * to configuration), creating a stacking effect. Elements are rendered in the
 * order they're added, with later elements appearing on top (higher z-index).
 *
 * @remarks
 * StackLayout is useful for:
 * - Creating layered compositions
 * - Building card decks or stacked cards
 * - Creating badges or overlays on elements
 * - Implementing modal/dialog backgrounds
 * - Creating shadow/highlight effects
 *
 * **Important Note on Immutability:**
 * Once elements are added and the layout is positioned/rendered, the stack
 * arrangement is fixed. Adding elements after positioning may not automatically
 * re-arrange the layout. Add all elements before positioning the layout for
 * best results.
 *
 * @example
 * Stack circles on top of each other
 * ```typescript
 * const stack = new StackLayout({
 *   width: 200,
 *   height: 200,
 *   horizontalAlign: "center",
 *   verticalAlign: "center"
 * });
 *
 * // Add elements - they'll all be centered on top of each other
 * const circle1 = new Circle({ 
 *   radius: 60, 
 *   style: { fill: "#e74c3c", opacity: 0.7 } 
 * });
 * const circle2 = new Circle({ 
 *   radius: 45, 
 *   style: { fill: "#3498db", opacity: 0.7 } 
 * });
 * const circle3 = new Circle({ 
 *   radius: 30, 
 *   style: { fill: "#2ecc71", opacity: 0.7 } 
 * });
 *
 * stack.addElement(circle1);
 * stack.addElement(circle2);
 * stack.addElement(circle3);
 *
 * // Position the stack
 * stack.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: stack.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 *
 * @example
 * Create a card deck effect with layer offset
 * ```typescript
 * const deck = new StackLayout({
 *   width: 150,
 *   height: 200,
 *   horizontalAlign: "left",
 *   verticalAlign: "top",
 *   layerOffset: 5  // Each card offset by 5px
 * });
 *
 * for (let i = 0; i < 5; i++) {
 *   const card = new Rectangle({
 *     width: 150,
 *     height: 200,
 *     cornerRadius: 10,
 *     style: { fill: "#fff", stroke: "#000", strokeWidth: 2 }
 *   });
 *   deck.addElement(card);
 * }
 * ```
 */
export class StackLayout extends Layout {
  protected config: StackLayoutConfig;
  private stackedElements: Element[] = [];
  private isArranged: boolean = false;

  /**
   * Creates a new StackLayout instance.
   *
   * @param config - Configuration for the stack layout
   */
  constructor(config: StackLayoutConfig) {
    super(config);
    this.config = {
      horizontalAlign: "center",
      verticalAlign: "center",
      layerOffset: 0,
      ...config,
    };
  }

  /**
   * Adds an element to the stack layout.
   *
   * Elements will be stacked according to the layout's configuration
   * when the layout is rendered or positioned.
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
   * Arranges all elements in a stack according to the configuration.
   * @internal
   */
  private arrangeElements(): void {
    if (this.isArranged || this.stackedElements.length === 0) {
      return;
    }

    const contentX = 0;
    const contentY = 0;
    const contentWidth = this.width;
    const contentHeight = this.height;

    const elements = this.stackedElements;
    const layerOffset = this.config.layerOffset || 0;

    const layoutAbsPos = this.getAbsolutePosition();
    console.log("[StackLayout] arrangeElements START", {
      layoutAbsPos,
      contentWidth,
      contentHeight,
      elementCount: elements.length,
      horizontalAlign: this.config.horizontalAlign,
      verticalAlign: this.config.verticalAlign,
      layerOffset,
    });

    // Position each element at the same aligned position (with optional offset)
    elements.forEach((element, index) => {
      const elem = element as any;

      // Skip elements that have been explicitly positioned (absolute mode)
      if (elem._isAbsolutePositioned) {
        console.log(
          `[StackLayout] Element ${index} SKIPPED (absolute positioned)`,
          {
            name: elem.name || "unnamed",
          }
        );
        return;
      }

      console.log(`[StackLayout] Element ${index} BEFORE positioning`, {
        name: elem.name || "unnamed",
        currentPosition: { ...elem.currentPosition },
        center: element.center,
      });

      // Get element size using axis-aligned bounding box to account for rotations
      const bbox = typeof elem.getBoundingBox === "function"
        ? elem.getBoundingBox(true)
        : {
            width: elem.width || elem.radius * 2 || 0,
            height: elem.height || elem.radius * 2 || 0,
          };

      const elementWidth = bbox.width;
      const elementHeight = bbox.height;

      let targetX: number, targetY: number;

      // Calculate horizontal position
      switch (this.config.horizontalAlign) {
        case "left":
          targetX = contentX + elementWidth / 2 + index * layerOffset;
          break;
        case "right":
          targetX = contentX + contentWidth - elementWidth / 2 - index * layerOffset;
          break;
        case "center":
        default:
          targetX = contentX + contentWidth / 2 + index * layerOffset;
          break;
      }

      // Calculate vertical position
      switch (this.config.verticalAlign) {
        case "top":
          targetY = contentY + elementHeight / 2 + index * layerOffset;
          break;
        case "bottom":
          targetY = contentY + contentHeight - elementHeight / 2 - index * layerOffset;
          break;
        case "center":
        default:
          targetY = contentY + contentHeight / 2 + index * layerOffset;
          break;
      }

      console.log(
        `[StackLayout] Element ${index} calculated targets (relative to layout)`,
        {
          targetX,
          targetY,
          elementWidth,
          elementHeight,
          offset: index * layerOffset,
        }
      );

      // Set currentPosition in RELATIVE coordinates (relative to parent layout)
      // IMPORTANT: currentPosition has different meanings for different shapes:
      // - Circle: currentPosition is the CENTER
      // - Rectangle: currentPosition is the TOP-LEFT corner
      // We calculated targetX/targetY as CENTER positions, so we need to convert

      let finalX = targetX;
      let finalY = targetY;

      // For rectangles, convert center to top-left
      if (elem._width !== undefined && elem._height !== undefined) {
        finalX = targetX - elem._width / 2;
        finalY = targetY - elem._height / 2;
      } else if (elem.width !== undefined && elem.height !== undefined) {
        finalX = targetX - elem.width / 2;
        finalY = targetY - elem.height / 2;
      }
      // For circles, targetX/targetY are already center positions

      console.log(`[StackLayout] Element ${index} setting relative position`, {
        targetX,
        targetY,
        finalX,
        finalY,
        isRect: elem._width !== undefined || elem.width !== undefined,
      });

      elem.currentPosition = {
        x: finalX,
        y: finalY,
      };

      console.log(`[StackLayout] Element ${index} AFTER positioning`, {
        currentPosition: { ...elem.currentPosition },
        center: element.center,
      });

      // Notify dependent elements
      if (typeof elem.notifyDependents === "function") {
        elem.notifyDependents();
      }
    });

    this.isArranged = true;
  }

  /**
   * Overrides position to arrange elements after positioning the layout.
   */
  position(config: any): void {
    console.log("[StackLayout] position() called BEFORE super.position", {
      layoutCurrentPos: { ...this.currentPosition },
      layoutAbsPos: this.getAbsolutePosition(),
    });

    // Move the layout first
    super.position(config);

    console.log(
      "[StackLayout] position() AFTER super.position, BEFORE arrange",
      {
        layoutCurrentPos: { ...this.currentPosition },
        layoutAbsPos: this.getAbsolutePosition(),
      }
    );

    // Now arrange children based on layout's new position
    this.arrangeElements();

    // Reset tracking so children's newly set positions are used as the baseline
    this.childrenManager.resetTracking();

    console.log("[StackLayout] position() AFTER arrange", {
      layoutCurrentPos: { ...this.currentPosition },
      layoutAbsPos: this.getAbsolutePosition(),
    });
  }

  /**
   * Overrides render to arrange elements before rendering.
   */
  render(): string {
    console.log("[StackLayout] render() called", {
      layoutAbsPos: this.getAbsolutePosition(),
    });
    this.arrangeElements();
    return super.render();
  }
}

