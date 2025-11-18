/**
 * Spread Layout module for distributing elements with spacing.
 *
 * This module provides the SpreadLayout class that distributes elements
 * evenly across horizontal or vertical space with various alignment options.
 *
 * @module layout
 */

import { Layout, LayoutConfig } from "./Layout.js";
import type { Element } from "../core/Element.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";

/**
 * Configuration for creating a SpreadLayout.
 */
export interface SpreadLayoutConfig extends LayoutConfig {
  /**
   * Direction to spread elements.
   * - "horizontal": Spread elements left to right
   * - "vertical": Spread elements top to bottom
   */
  direction: "horizontal" | "vertical";

  /**
   * Spacing between elements.
   * Can be:
   * - A specific value (e.g., "20px", 20)
   * - "even" to distribute remaining space evenly
   * @defaultValue "even"
   */
  spacing?: string | number | "even";

  /**
   * Alignment perpendicular to spread direction.
   * For horizontal spread: "top", "center", "bottom"
   * For vertical spread: "left", "center", "right"
   * @defaultValue "center"
   */
  align?: "start" | "center" | "end";

  /**
   * Justification along the spread direction.
   * - "start": Align to beginning
   * - "center": Center elements
   * - "end": Align to end
   * - "space-between": Distribute with space between
   * - "space-around": Distribute with space around
   * - "space-evenly": Distribute with even spacing
   * @defaultValue "space-between"
   */
  justify?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
}

/**
 * SpreadLayout distributes elements with even spacing.
 *
 * This layout automatically distributes added elements either horizontally
 * or vertically with configurable spacing and alignment. It's useful for
 * creating evenly-spaced arrangements like navigation bars, button groups,
 * or vertical lists.
 *
 * @remarks
 * SpreadLayout is useful for:
 * - Creating horizontal button groups
 * - Building vertical lists with consistent spacing
 * - Distributing icons or elements evenly
 * - Creating justified layouts
 *
 * **Important Note on Immutability:**
 * Once elements are added and the layout is positioned/rendered, the spread
 * arrangement is fixed. Adding elements after positioning may not automatically
 * re-arrange the layout. Add all elements before positioning the layout for
 * best results.
 *
 * @example
 * Horizontal spread with space-between
 * ```typescript
 * const spread = new SpreadLayout({
 *   direction: "horizontal",
 *   width: 600,
 *   height: 100,
 *   justify: "space-between",
 *   align: "center"
 * });
 *
 * // Add elements
 * const circle1 = new Circle({ radius: 30 });
 * const circle2 = new Circle({ radius: 30 });
 * const circle3 = new Circle({ radius: 30 });
 *
 * spread.addElement(circle1);
 * spread.addElement(circle2);
 * spread.addElement(circle3);
 *
 * // Position the layout
 * spread.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: spread.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 *
 * @example
 * Vertical spread with fixed spacing
 * ```typescript
 * const spread = new SpreadLayout({
 *   direction: "vertical",
 *   width: 200,
 *   height: 400,
 *   spacing: 20,
 *   justify: "start",
 *   align: "center"
 * });
 * ```
 */
export class SpreadLayout extends Layout {
  protected config: SpreadLayoutConfig;
  private arrangedElements: Element[] = [];
  private isArranged: boolean = false;

  /**
   * Creates a new SpreadLayout instance.
   *
   * @param config - Configuration for the spread layout
   */
  constructor(config: SpreadLayoutConfig) {
    super(config);
    this.config = {
      spacing: "even",
      align: "center",
      justify: "space-between",
      ...config,
    };
  }

  /**
   * Adds an element to the spread layout.
   *
   * Elements will be arranged according to the layout's configuration
   * when the layout is rendered or positioned.
   *
   * @param element - The element to add
   */
  addElement(element: Element): void {
    // Add to parent's children manager for hierarchy
    super.addElement(element);

    // Track for arrangement
    this.arrangedElements.push(element);

    // Mark that we need to re-arrange
    this.isArranged = false;
  }

  /**
   * Arranges all elements according to the spread configuration.
   * @internal
   */
  private arrangeElements(): void {
    if (this.isArranged || this.arrangedElements.length === 0) {
      return;
    }

    // TODO: Temporarily ignore padding for debugging
    const contentX = 0;
    const contentY = 0;
    const contentWidth = this.width;
    const contentHeight = this.height;

    const elements = this.arrangedElements;
    const direction = this.config.direction;

    const layoutAbsPos = this.getAbsolutePosition();
    console.log("[SpreadLayout] arrangeElements START", {
      layoutAbsPos,
      contentWidth,
      contentHeight,
      elementCount: elements.length,
      direction,
      justify: this.config.justify,
    });

    // Calculate element sizes for spacing calculations
    // Use axis-aligned bounding box to account for rotations
    const elementSizes = elements.map((el) => {
      const elem = el as any;

      const bbox = elem.getBoundingBox(true); // axis-aligned
      return direction === "horizontal" ? bbox.width : bbox.height;
    });

    const totalElementSize = elementSizes.reduce((sum, size) => sum + size, 0);

    // Calculate positions based on justify setting
    const positions = this.calculatePositions(
      elementSizes,
      totalElementSize,
      direction === "horizontal" ? contentWidth : contentHeight
    );

    // Position each element by directly setting their currentPosition
    // These coordinates are relative to the layout's origin (not absolute world coordinates)
    elements.forEach((element, index) => {
      const elem = element as any;
      const position = positions[index];
      const elementSize = elementSizes[index];

      console.log(`[SpreadLayout] Element ${index} BEFORE positioning`, {
        name: elem.name || "unnamed",
        currentPosition: { ...elem.currentPosition },
        center: element.center,
      });

      let targetX: number, targetY: number;

      if (direction === "horizontal") {
        // Horizontal spread
        // position represents left edge, add half width to get center
        targetX = contentX + position + elementSize / 2;
        targetY = this.calculateCrossAxisPosition(
          contentY,
          contentHeight,
          elem
        );
      } else {
        // Vertical spread
        targetX = this.calculateCrossAxisPosition(contentX, contentWidth, elem);
        // position represents top edge, add half height to get center
        targetY = contentY + position + elementSize / 2;
      }

      console.log(
        `[SpreadLayout] Element ${index} calculated targets (relative to layout)`,
        {
          targetX,
          targetY,
          position,
          elementSize,
        }
      );

      // Set currentPosition in RELATIVE coordinates (relative to parent layout)
      // getAbsolutePosition() will add the parent's position when rendering
      console.log(`[SpreadLayout] Element ${index} setting relative position`, {
        targetX,
        targetY,
      });

      elem.currentPosition = {
        x: targetX,
        y: targetY,
      };

      console.log(`[SpreadLayout] Element ${index} AFTER positioning`, {
        currentPosition: { ...elem.currentPosition },
        center: element.center,
      });

      // Notify dependent elements (e.g., elements positioned relative to this one)
      // This ensures reactive positioning works correctly
      if (typeof elem.notifyDependents === "function") {
        elem.notifyDependents();
      }
    });

    this.isArranged = true;
  }

  /**
   * Calculates positions along the main axis based on justify setting.
   * @internal
   */
  private calculatePositions(
    elementSizes: number[],
    totalElementSize: number,
    availableSpace: number
  ): number[] {
    const justify = this.config.justify;
    const spacing = this.config.spacing;
    const count = elementSizes.length;

    if (count === 0) return [];
    if (count === 1) {
      // Single element positioning based on justify
      if (justify === "center") {
        return [(availableSpace - elementSizes[0]) / 2];
      } else if (justify === "end") {
        return [availableSpace - elementSizes[0]];
      } else {
        return [0];
      }
    }

    const positions: number[] = [];
    let currentPos = 0;

    switch (justify) {
      case "start": {
        // Align to start with fixed or default spacing
        const gap =
          typeof spacing === "number"
            ? spacing
            : spacing !== "even" && spacing !== undefined
              ? parseUnit(spacing)
              : 0;
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + gap;
        }
        break;
      }

      case "center": {
        // Center all elements with fixed or default spacing
        const gap =
          typeof spacing === "number"
            ? spacing
            : spacing !== "even" && spacing !== undefined
              ? parseUnit(spacing)
              : 0;
        const totalSize = totalElementSize + gap * (count - 1);
        currentPos = (availableSpace - totalSize) / 2;
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + gap;
        }
        break;
      }

      case "end": {
        // Align to end with fixed or default spacing
        const gap =
          typeof spacing === "number"
            ? spacing
            : spacing !== "even" && spacing !== undefined
              ? parseUnit(spacing)
              : 0;
        const totalSize = totalElementSize + gap * (count - 1);
        currentPos = availableSpace - totalSize;
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + gap;
        }
        break;
      }

      case "space-between": {
        // Space between elements
        const gap = (availableSpace - totalElementSize) / (count - 1);
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + gap;
        }
        break;
      }

      case "space-around": {
        // Space around elements (half space at ends)
        const gap = (availableSpace - totalElementSize) / count;
        currentPos = gap / 2;
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + gap;
        }
        break;
      }

      case "space-evenly": {
        // Even space between all elements including ends
        const gap = (availableSpace - totalElementSize) / (count + 1);
        currentPos = gap;
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + gap;
        }
        break;
      }

      default:
        // Default to space-between
        const defaultGap = (availableSpace - totalElementSize) / (count - 1);
        for (let i = 0; i < count; i++) {
          positions.push(currentPos);
          currentPos += elementSizes[i] + defaultGap;
        }
    }

    return positions;
  }

  /**
   * Calculates position on the cross axis (perpendicular to spread direction).
   * @internal
   */
  private calculateCrossAxisPosition(
    start: number,
    size: number,
    element: any
  ): number {
    const align = this.config.align;

    // Get element size on the cross axis (use axis-aligned bounding box)
    let elementSize = 0;
    if (typeof element.getBoundingBox === "function") {
      const bbox = element.getBoundingBox(true); // axis-aligned
      elementSize =
        this.config.direction === "horizontal" ? bbox.height : bbox.width;
    } else if (element.boundingBox) {
      // Legacy support
      elementSize =
        this.config.direction === "horizontal"
          ? element.boundingBox.height
          : element.boundingBox.width;
    } else {
      // Fallback to direct properties
      elementSize =
        this.config.direction === "horizontal"
          ? element.height || element.radius * 2 || 0
          : element.width || element.radius * 2 || 0;
    }

    switch (align) {
      case "start":
        return start;
      case "center":
        return start + (size - elementSize) / 2;
      case "end":
        return start + size - elementSize;
      default:
        return start + size / 2;
    }
  }

  /**
   * Overrides position to arrange elements after positioning the layout.
   */
  position(config: any): void {
    console.log("[SpreadLayout] position() called BEFORE super.position", {
      layoutCurrentPos: { ...this.currentPosition },
      layoutAbsPos: this.getAbsolutePosition(),
    });

    // Move the layout first
    super.position(config);

    console.log(
      "[SpreadLayout] position() AFTER super.position, BEFORE arrange",
      {
        layoutCurrentPos: { ...this.currentPosition },
        layoutAbsPos: this.getAbsolutePosition(),
      }
    );

    // Now arrange children based on layout's new position
    this.arrangeElements();

    // Reset tracking so children's newly set positions are used as the baseline
    // for future transformations
    this.childrenManager.resetTracking();

    console.log("[SpreadLayout] position() AFTER arrange", {
      layoutCurrentPos: { ...this.currentPosition },
      layoutAbsPos: this.getAbsolutePosition(),
    });
  }

  /**
   * Overrides render to arrange elements before rendering.
   */
  render(): string {
    console.log("[SpreadLayout] render() called", {
      layoutAbsPos: this.getAbsolutePosition(),
    });
    this.arrangeElements();
    return super.render();
  }
}
