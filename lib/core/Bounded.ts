/**
 * Bounded element module providing layout box model capabilities.
 *
 * This module defines the Bounded class for elements that occupy rectangular
 * space and support CSS-like box model properties (margin, padding).
 *
 * @module core
 */

import { Element } from "./Element.js";
import type { Point } from "./Artboard.js";
import { parseUnit } from "./units.js";

/**
 * Represents spacing values for margin or padding.
 * Supports CSS-style shorthand notation.
 *
 * @example
 * ```typescript
 * // All sides equal
 * const spacing1: Spacing = "20px";
 * const spacing2: Spacing = 20;
 *
 * // Individual sides
 * const spacing3: Spacing = {
 *   top: "10px",
 *   right: "20px",
 *   bottom: "10px",
 *   left: "20px"
 * };
 * ```
 */
export type Spacing =
  | string
  | number
  | {
      top?: string | number;
      right?: string | number;
      bottom?: string | number;
      left?: string | number;
    };

/**
 * Parsed spacing values in pixels for all four sides.
 */
export interface ParsedSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Abstract base class for elements that occupy bounded rectangular space.
 *
 * Bounded extends Element to add CSS-like box model properties including
 * margin and padding. This makes it suitable for elements that need layout
 * awareness, such as shapes, containers, and other visual components.
 *
 * @remarks
 * The name "Bounded" reflects that these elements have defined boundaries
 * in space and support spacing properties. This is a better term than
 * "layoutable" as it describes what the element *is* rather than what it *does*.
 *
 * Margin affects positioning when using position() with respectMargin option.
 * Padding affects the internal content area of container-like elements.
 *
 * @example
 * ```typescript
 * class MyBoundedElement extends Bounded {
 *   constructor() {
 *     super();
 *     this.margin = "20px";
 *     this.padding = { top: 10, left: 10, right: 10, bottom: 10 };
 *   }
 *
 *   get center(): Point {
 *     return { x: "0px", y: "0px" };
 *   }
 *
 *   render(): string {
 *     return "";
 *   }
 * }
 * ```
 */
export abstract class Bounded extends Element {
  protected _margin: Spacing = 0;
  protected _padding: Spacing = 0;

  /**
   * Gets the margin spacing for this element.
   *
   * @returns The current margin value
   */
  get margin(): Spacing {
    return this._margin;
  }

  /**
   * Sets the margin spacing for this element.
   *
   * Margin creates space around the element's outer edge.
   * It affects positioning when using position() with respectMargin: true.
   *
   * @param value - The margin value (supports CSS-like shorthand)
   *
   * @example
   * Set uniform margin
   * ```typescript
   * element.margin = "20px";
   * element.margin = 20;
   * ```
   *
   * @example
   * Set individual sides
   * ```typescript
   * element.margin = {
   *   top: "10px",
   *   right: "20px",
   *   bottom: "10px",
   *   left: "20px"
   * };
   * ```
   */
  set margin(value: Spacing) {
    this._margin = value;
  }

  /**
   * Gets the padding spacing for this element.
   *
   * @returns The current padding value
   */
  get padding(): Spacing {
    return this._padding;
  }

  /**
   * Sets the padding spacing for this element.
   *
   * Padding creates space between the element's content and its border.
   * For containers, this affects where child elements are positioned.
   *
   * @param value - The padding value (supports CSS-like shorthand)
   *
   * @example
   * Set uniform padding
   * ```typescript
   * container.padding = "20px";
   * container.padding = 20;
   * ```
   *
   * @example
   * Set individual sides
   * ```typescript
   * container.padding = {
   *   top: "10px",
   *   right: "20px",
   *   bottom: "10px",
   *   left: "20px"
   * };
   * ```
   */
  set padding(value: Spacing) {
    this._padding = value;
  }

  /**
   * Parses a spacing value into individual side values in pixels.
   *
   * @param spacing - The spacing value to parse
   * @returns Parsed spacing values for all four sides
   * @internal
   */
  protected parseSpacing(spacing: Spacing): ParsedSpacing {
    if (typeof spacing === "string" || typeof spacing === "number") {
      const value = parseUnit(spacing);
      return { top: value, right: value, bottom: value, left: value };
    }

    return {
      top: parseUnit(spacing.top || 0),
      right: parseUnit(spacing.right || 0),
      bottom: parseUnit(spacing.bottom || 0),
      left: parseUnit(spacing.left || 0),
    };
  }

  /**
   * Gets the parsed margin values in pixels.
   *
   * @returns The margin for each side in pixels
   */
  get marginBox(): ParsedSpacing {
    return this.parseSpacing(this._margin);
  }

  /**
   * Gets the parsed padding values in pixels.
   *
   * @returns The padding for each side in pixels
   */
  get paddingBox(): ParsedSpacing {
    return this.parseSpacing(this._padding);
  }

  /**
   * Gets the content area bounds (accounting for padding).
   *
   * @returns The content area point, offset by padding
   *
   * @remarks
   * For containers, this is where child elements should be positioned.
   * Subclasses should override this if they have specific content areas.
   */
  get contentArea(): Point {
    const padding = this.paddingBox;
    return {
      x: `${this.currentPosition.x + padding.left}px`,
      y: `${this.currentPosition.y + padding.top}px`,
    };
  }

  /**
   * Gets the appropriate alignment point based on alignment direction.
   *
   * For bounded elements, this returns edge centers or corners depending
   * on the alignment configuration.
   *
   * @param horizontalAlign - Horizontal alignment: "left", "center", or "right"
   * @param verticalAlign - Vertical alignment: "top", "center", or "bottom"
   * @returns The point to use for alignment
   *
   * @remarks
   * This method is used by layouts to determine where to position elements.
   *
   * Alignment mappings:
   * - left + top: topLeft
   * - left + center: leftCenter (center of left edge)
   * - left + bottom: bottomLeft
   * - center + top: topCenter (center of top edge)
   * - center + center: center
   * - center + bottom: bottomCenter (center of bottom edge)
   * - right + top: topRight
   * - right + center: rightCenter (center of right edge)
   * - right + bottom: bottomRight
   *
   * @example
   * ```typescript
   * // Get the center of the left edge for left-aligned content
   * const point = element.getAlignmentPoint("left", "center");
   * ```
   */
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    // For Bounded elements, we need access to width/height
    // These should be available in subclasses (Rectangle, Circle, etc.)
    const width = (this as any).width || 0;
    const height = (this as any).height || 0;
    const radius = (this as any).radius || 0;

    // For circles, use radius-based calculations
    // Note: Circle's currentPosition is already at the center
    if (radius > 0) {
      let x = this.currentPosition.x;
      let y = this.currentPosition.y;

      // Horizontal positioning
      if (horizontalAlign === "left") {
        x = this.currentPosition.x - radius;
      } else if (horizontalAlign === "right") {
        x = this.currentPosition.x + radius;
      }
      // "center" uses x = this.currentPosition.x (already set)

      // Vertical positioning
      if (verticalAlign === "top") {
        y = this.currentPosition.y - radius;
      } else if (verticalAlign === "bottom") {
        y = this.currentPosition.y + radius;
      }
      // "center" uses y = this.currentPosition.y (already set)

      return { x: `${x}px`, y: `${y}px` };
    }

    // For rectangular elements
    let x = this.currentPosition.x;
    let y = this.currentPosition.y;

    // Horizontal positioning
    if (horizontalAlign === "center") {
      x = this.currentPosition.x + width / 2;
    } else if (horizontalAlign === "right") {
      x = this.currentPosition.x + width;
    }
    // "left" uses x = this.currentPosition.x (already set)

    // Vertical positioning
    if (verticalAlign === "center") {
      y = this.currentPosition.y + height / 2;
    } else if (verticalAlign === "bottom") {
      y = this.currentPosition.y + height;
    }
    // "top" uses y = this.currentPosition.y (already set)

    return { x: `${x}px`, y: `${y}px` };
  }
}
