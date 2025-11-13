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
 * Types of transformations that can be applied to an element.
 */
export type TransformType = "rotation" | "scale" | "skew";

/**
 * Represents a single transformation applied to an element.
 */
export interface Transform {
  /** Type of transformation */
  type: TransformType;
  /** Parameters specific to the transformation type */
  params: any;
  /** The pivot point for this transformation (defaults to element center) */
  pivot?: Point;
}

/**
 * Configuration for rotating an element.
 */
export interface RotateConfig {
  /** 
   * The reference element or point to rotate relative to.
   * If the reference has an .angle property, it will be used.
   * Optional - defaults to rotating around the element's own center.
   */
  relativeTo?: any;
  /** 
   * Rotation angle in degrees. 
   * If relativeTo has an .angle property and deg is not provided, uses that angle.
   */
  deg?: number;
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
  protected transforms: Transform[] = [];
  
  /**
   * @deprecated Use transforms array instead. This property is kept for backward compatibility.
   * @internal
   */
  protected get rotation(): number {
    // Calculate cumulative rotation from transforms array
    return this.transforms
      .filter((t) => t.type === "rotation")
      .reduce((sum, t) => sum + (t.params.deg || 0), 0);
  }
  
  /**
   * @deprecated Use transforms array instead. This property is kept for backward compatibility.
   * @internal
   */
  protected set rotation(value: number) {
    // Clear all rotation transforms and set a single one
    this.transforms = this.transforms.filter((t) => t.type !== "rotation");
    if (value !== 0) {
      this.transforms.push({
        type: "rotation",
        params: { deg: value },
      });
    }
  }

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
   * Indicates whether this element should be resized to fit within layout columns.
   *
   * Elements return true by default, allowing layouts to resize them.
   * Elements with constrained aspect ratios (Circle, Square) override this to return false.
   *
   * @returns True if the element can be resized to fit content, false otherwise
   *
   * @example
   * ```typescript
   * // Rectangle can be resized
   * rectangle.shouldFitContent // true
   *
   * // Square maintains aspect ratio
   * square.shouldFitContent // false
   * ```
   */
  get shouldFitContent(): boolean {
    return true;
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
   * By default, rotation occurs around the element's own center.
   * You can optionally specify a reference object with an .angle property,
   * or provide a custom pivot point.
   *
   * Multiple rotations can be applied and they will be stored in order.
   *
   * @param config - The rotation configuration
   *
   * @example
   * Rotate an element 45 degrees around its center
   * ```typescript
   * element.rotate({ deg: 45 });
   * ```
   *
   * @example
   * Rotate an element to align with a side's angle
   * ```typescript
   * element.rotate({
   *   relativeTo: triangle.side,
   *   deg: triangle.side.angle
   * });
   * // Or shorthand - if relativeTo has .angle, it's used automatically:
   * element.rotate({ relativeTo: triangle.side });
   * ```
   *
   * @example
   * Rotate around a custom pivot point
   * ```typescript
   * element.rotate({
   *   deg: 90,
   *   relativeTo: { x: "100px", y: "100px" }
   * });
   * ```
   */
  rotate(config: RotateConfig): void {
    let angle = 0;
    let pivot: Point | undefined;

    // Determine the rotation angle
    if (config.deg !== undefined) {
      angle = config.deg;
    } else if (config.relativeTo && "angle" in config.relativeTo) {
      // If relativeTo has an angle property, use it
      angle = config.relativeTo.angle;
    } else {
      // No angle provided and no angle on relativeTo
      console.warn(
        "rotate() called without deg parameter and relativeTo does not have an angle property"
      );
      return;
    }

    // Determine the pivot point
    if (config.relativeTo) {
      // Check if relativeTo is a Point (has x and y)
      if ("x" in config.relativeTo && "y" in config.relativeTo) {
        pivot = config.relativeTo as Point;
      }
      // If relativeTo has a center property (like shapes), use it
      else if ("center" in config.relativeTo) {
        pivot = config.relativeTo.center;
      }
      // Otherwise, don't set a pivot - will default to element's center during render
    }

    // Add the rotation transform to the array
    this.transforms.push({
      type: "rotation",
      params: { deg: angle },
      pivot: pivot,
    });
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
   * Gets the SVG transform attribute string for this element.
   *
   * Transforms are applied in the order they were added.
   * If no pivot is specified for a rotation, the element's center is used.
   *
   * @returns SVG transform attribute string, or empty string if no transforms
   *
   * @example
   * ```typescript
   * const transformStr = element.getTransformString();
   * // Returns something like: "rotate(45 100 100) rotate(30 150 150)"
   * ```
   */
  protected getTransformString(): string {
    if (this.transforms.length === 0) {
      return "";
    }

    const transformStrings: string[] = [];

    for (const transform of this.transforms) {
      if (transform.type === "rotation") {
        const deg = transform.params.deg || 0;
        if (deg === 0) continue;

        // Determine pivot point
        let pivotX: number, pivotY: number;
        if (transform.pivot) {
          pivotX = parseUnit(transform.pivot.x);
          pivotY = parseUnit(transform.pivot.y);
        } else {
          // Default to element's center
          const center = this.center;
          pivotX = parseUnit(center.x);
          pivotY = parseUnit(center.y);
        }

        transformStrings.push(`rotate(${deg} ${pivotX} ${pivotY})`);
      }
      // Future: add support for scale, skew, etc.
    }

    return transformStrings.join(" ");
  }

  /**
   * Gets the cumulative rotation angle of the element.
   *
   * @returns Total rotation in degrees
   */
  protected getTotalRotation(): number {
    return this.transforms
      .filter((t) => t.type === "rotation")
      .reduce((sum, t) => sum + (t.params.deg || 0), 0);
  }

  /**
   * Clears all transforms of a specific type.
   *
   * @param type - The type of transform to clear
   */
  protected clearTransforms(type?: TransformType): void {
    if (type) {
      this.transforms = this.transforms.filter((t) => t.type !== type);
    } else {
      this.transforms = [];
    }
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
