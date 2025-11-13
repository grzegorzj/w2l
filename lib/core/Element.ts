/**
 * Base element module providing fundamental transformation capabilities.
 *
 * This module defines the base class for all elements in the library, including
 * shapes, text, containers, and other visual or layout elements. It provides
 * common positioning, transformation, and rendering capabilities.
 *
 * @module core
 */

import type { Point } from "./Artboard.js";
import { parseUnit } from "./units.js";

/**
 * Represents a reference point on an element for positioning calculations.
 *
 * This interface is used to specify both the source point (relativeFrom) and
 * target point (relativeTo) in positioning operations.
 */
export interface PositionReference {
  /** The point on the current element to use as reference */
  relativeFrom: Point;
  /** The target point to align with */
  relativeTo: Point;
  /** X offset from the alignment point (supports units like "50px", "2rem", or numbers) */
  x: string | number;
  /** Y offset from the alignment point (supports units like "50px", "2rem", or numbers) */
  y: string | number;
  /**
   * Whether to respect margin when positioning.
   * When true, margins of bounded elements will be considered in the positioning calculation.
   * @defaultValue false
   */
  respectMargin?: boolean;
}

/**
 * Configuration for rotating an element.
 */
export interface RotateConfig {
  /** The reference element or point to rotate relative to */
  relativeTo: any;
  /** Rotation angle in degrees */
  deg: number;
}

/**
 * Configuration for translating (moving) an element.
 */
export interface TranslateConfig {
  /** The direction vector to move along */
  along: Point;
  /** Distance to move (supports units like "50px", "2rem", or numbers) */
  distance: string | number;
}

/**
 * Abstract base class for all elements in the library.
 *
 * This class provides the fundamental capabilities that all elements share:
 * positioning, rotation, translation, and basic geometry calculations.
 *
 * Elements can be visual (shapes, text) or invisible (containers, layout objects).
 * They all share the ability to be positioned and transformed in space.
 *
 * @remarks
 * Elements in this library are immutable by default. Transformations create
 * new internal states but maintain a clean API for LLMs to work with.
 *
 * All elements have a center point, which is used as the default reference
 * for positioning and transformations unless otherwise specified.
 *
 * @example
 * ```typescript
 * // Subclasses implement specific elements
 * class Shape extends Element {
 *   // Shape-specific implementation
 * }
 *
 * class Container extends Element {
 *   // Container-specific implementation
 * }
 * ```
 */
export abstract class Element {
  protected currentPosition: { x: number; y: number } = { x: 0, y: 0 };
  protected rotation: number = 0;

  /**
   * Gets the center point of the element.
   *
   * @returns The geometric center of the element
   *
   * @remarks
   * Subclasses must implement this to return their specific center calculation.
   */
  abstract get center(): Point;

  /**
   * Get the point on this element that should be used for alignment.
   *
   * This is the default alignment behavior used by layouts to position elements.
   * The base implementation returns the center point as a fallback.
   *
   * **Current default:** Returns center point. Subclasses (like Bounded) override
   * this to provide edge-based alignment.
   *
   * **Future:** Individual element classes will define their own alignment
   * behavior (e.g., text aligning from baseline, shapes from anchor points).
   *
   * @param horizontalAlign - The horizontal alignment: "left", "center", or "right"
   * @param verticalAlign - The vertical alignment: "top", "center", or "bottom"
   * @returns The point to use for alignment
   *
   * @example
   * ```typescript
   * // Get the alignment point for left-center alignment
   * const point = element.getAlignmentPoint("left", "center");
   * ```
   */
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    // Default fallback: return center point
    // Subclasses override to provide edge/anchor-based alignment
    return this.center;
  }

  /**
   * Positions the element relative to another point or element.
   *
   * This is the primary method for laying out elements in the visual space.
   * It allows precise alignment between any point on this element and any
   * point on another element or in absolute space.
   *
   * @param config - The positioning configuration
   *
   * @example
   * Position an element's center at the artboard center
   * ```typescript
   * element.position({
   *   relativeFrom: element.center,
   *   relativeTo: artboard.center,
   *   x: "0px",
   *   y: "0px"
   * });
   * ```
   *
   * @example
   * Position an element offset from another element
   * ```typescript
   * element2.position({
   *   relativeFrom: element2.center,
   *   relativeTo: element1.center,
   *   x: "50px",  // 50px to the right
   *   y: "-20px"  // 20px above
   * });
   * ```
   *
   * @example
   * Position with margin respect (for Bounded elements)
   * ```typescript
   * element2.position({
   *   relativeFrom: element2.center,
   *   relativeTo: element1.center,
   *   x: "0px",
   *   y: "0px",
   *   respectMargin: true  // Will account for margins of both elements
   * });
   * ```
   */
  position(config: PositionReference): void {
    const fromX = parseUnit(config.relativeFrom.x);
    const fromY = parseUnit(config.relativeFrom.y);
    const toX = parseUnit(config.relativeTo.x);
    const toY = parseUnit(config.relativeTo.y);
    const offsetXVal = parseUnit(config.x);
    const offsetYVal = parseUnit(config.y);

    let offsetX = toX - fromX + offsetXVal;
    let offsetY = toY - fromY + offsetYVal;

    // Apply margin if respectMargin is true and this is a Bounded element
    // This requires checking if the element has margin properties
    if (config.respectMargin && "marginBox" in this) {
      // Type assertion needed here since Element doesn't know about Bounded
      const marginBox = (this as any).marginBox;
      // Add margin in the direction of movement
      // This is a simplified implementation - in a real system you'd determine
      // the direction and apply appropriate margins
      if (offsetX > 0) {
        offsetX += marginBox.left;
      } else if (offsetX < 0) {
        offsetX -= marginBox.right;
      }
      if (offsetY > 0) {
        offsetY += marginBox.top;
      } else if (offsetY < 0) {
        offsetY -= marginBox.bottom;
      }
    }

    this.currentPosition = {
      x: this.currentPosition.x + offsetX,
      y: this.currentPosition.y + offsetY,
    };
  }

  /**
   * Rotates the element around a reference point or along a reference line.
   *
   * @param config - The rotation configuration
   *
   * @example
   * Rotate an element 45 degrees relative to a line
   * ```typescript
   * element.rotate({
   *   relativeTo: line,
   *   deg: 45
   * });
   * ```
   */
  rotate(config: RotateConfig): void {
    this.rotation += config.deg;
  }

  /**
   * Translates (moves) the element along a direction vector.
   *
   * This method is particularly useful for moving elements perpendicular to
   * edges or along normal vectors, which is common when positioning elements
   * adjacent to other shapes.
   *
   * @param config - The translation configuration
   *
   * @example
   * Move an element outward from a triangle's edge
   * ```typescript
   * element.translate({
   *   along: triangle.side.outwardNormal,
   *   distance: "50px"
   * });
   * ```
   */
  translate(config: TranslateConfig): void {
    // Parse the along values
    const alongX = parseUnit(config.along.x);
    const alongY = parseUnit(config.along.y);
    const distancePx = parseUnit(config.distance);

    // Normalize the direction vector
    const length = Math.sqrt(alongX ** 2 + alongY ** 2);
    const normalized = {
      x: alongX / length,
      y: alongY / length,
    };

    this.currentPosition = {
      x: this.currentPosition.x + normalized.x * distancePx,
      y: this.currentPosition.y + normalized.y * distancePx,
    };
  }

  /**
   * Renders the element to SVG.
   *
   * @returns SVG string representation of the element
   *
   * @remarks
   * Subclasses must implement this to provide their specific SVG rendering.
   * Some elements (like containers or layout objects) may return empty strings
   * if they are purely structural.
   */
  abstract render(): string;
}
