/**
 * Geometric shapes module - Circle implementation.
 *
 * Provides circle primitives with radius-based or diameter-based configuration.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Configuration for creating a Circle.
 *
 * Supports intuitive parameters that are easy for LLMs to work with.
 * Visual styling is handled through the style property using CSS/SVG properties.
 */
export interface CircleConfig {
  /**
   * Radius of the circle (supports units like "50px", "2rem", or numbers).
   * Either radius or diameter must be specified.
   */
  radius?: string | number;

  /**
   * Diameter of the circle (supports units like "100px", "4rem", or numbers).
   * Either radius or diameter must be specified.
   */
  diameter?: string | number;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties (fill, stroke, opacity, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @example
   * ```typescript
   * {
   *   fill: "#3498db",
   *   stroke: "#2980b9",
   *   strokeWidth: 2,
   *   fillOpacity: 0.8
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Circle shape with comprehensive geometric properties.
 *
 * The Circle class provides a high-level interface for creating and
 * manipulating circular shapes. It automatically calculates geometric
 * properties and provides convenient access points around the circumference.
 *
 * @remarks
 * Circles can be created using either radius or diameter. The center point
 * is automatically calculated and can be used for positioning.
 *
 * @example
 * Create a circle with radius
 * ```typescript
 * const circle = new Circle({
 *   radius: 50,
 *   fill: "#3498db"
 * });
 * ```
 *
 * @example
 * Create a circle with diameter
 * ```typescript
 * const circle = new Circle({
 *   diameter: "100px",
 *   stroke: "#e74c3c",
 *   strokeWidth: 2
 * });
 * ```
 *
 * @example
 * Position a circle at an artboard center
 * ```typescript
 * const circle = new Circle({ radius: 30 });
 * circle.position({
 *   relativeFrom: circle.center,
 *   relativeTo: artboard.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 */
export class Circle extends Shape {
  private config: CircleConfig;
  private _radius: number;

  /**
   * Creates a new Circle instance.
   *
   * @param config - Configuration for the circle
   *
   * @throws {Error} If neither radius nor diameter is provided
   */
  constructor(config: CircleConfig) {
    super(config.name);
    this.config = config;

    if (config.radius !== undefined) {
      this._radius = parseUnit(config.radius);
    } else if (config.diameter !== undefined) {
      this._radius = parseUnit(config.diameter) / 2;
    } else {
      throw new Error("Circle requires either radius or diameter to be specified");
    }
  }

  /**
   * Gets the radius of the circle in pixels.
   *
   * @returns The radius value
   */
  get radius(): number {
    return this._radius;
  }

  /**
   * Circles should not be resized to fit content as they have a constrained aspect ratio.
   *
   * @returns False to prevent layout-based resizing
   */
  get shouldFitContent(): boolean {
    return false;
  }

  /**
   * Gets the diameter of the circle in pixels.
   *
   * @returns The diameter value (2 × radius)
   */
  get diameter(): number {
    return this._radius * 2;
  }

  /**
   * Gets the circumference of the circle in pixels.
   *
   * @returns The circumference value (2π × radius)
   */
  get circumference(): number {
    return 2 * Math.PI * this._radius;
  }

  /**
   * Gets the area of the circle in square pixels.
   *
   * @returns The area value (π × radius²)
   */
  get area(): number {
    return Math.PI * this._radius * this._radius;
  }

  /**
   * Gets the geometric center of the circle.
   *
   * @returns The center point of the circle
   */
  get center(): Point {
    // Use absolute position to account for parent hierarchy
    return this.toAbsolutePoint(0, 0);
  }

  /**
   * Gets a point on the circle's circumference at a specific angle.
   *
   * @param degrees - Angle in degrees (0° = right, 90° = down, 180° = left, 270° = up)
   * @returns A point on the circumference
   *
   * @example
   * Get the top point of a circle
   * ```typescript
   * const topPoint = circle.pointAt(270);
   * ```
   *
   * @example
   * Position elements around a circle
   * ```typescript
   * for (let i = 0; i < 8; i++) {
   *   const angle = i * 45;
   *   const point = circle.pointAt(angle);
   *   // Position element at point
   * }
   * ```
   */
  pointAt(degrees: number): Point {
    const radians = (degrees * Math.PI) / 180;
    // Use absolute position to account for parent hierarchy
    return this.toAbsolutePoint(
      this._radius * Math.cos(radians),
      this._radius * Math.sin(radians)
    );
  }

  /**
   * Gets the top-most point on the circle (270°).
   *
   * @returns The top point of the circle
   */
  get top(): Point {
    return this.toAbsolutePoint(0, -this._radius);
  }

  /**
   * Gets the bottom-most point on the circle (90°).
   *
   * @returns The bottom point of the circle
   */
  get bottom(): Point {
    return this.toAbsolutePoint(0, this._radius);
  }

  /**
   * Gets the left-most point on the circle (180°).
   *
   * @returns The left point of the circle
   */
  get left(): Point {
    return this.toAbsolutePoint(-this._radius, 0);
  }

  /**
   * Gets the right-most point on the circle (0°).
   *
   * @returns The right point of the circle
   */
  get right(): Point {
    return this.toAbsolutePoint(this._radius, 0);
  }

  // Standard reference points (matching Rectangle's 9-point system)

  /**
   * Gets the top-left point of the bounding box.
   *
   * @returns The top-left corner of the circle's bounding box
   */
  get topLeft(): Point {
    return this.toAbsolutePoint(-this._radius, -this._radius);
  }

  /**
   * Gets the top-center point (same as top).
   *
   * @returns The top-most point of the circle
   */
  get topCenter(): Point {
    return this.top;
  }

  /**
   * Gets the top-right point of the bounding box.
   *
   * @returns The top-right corner of the circle's bounding box
   */
  get topRight(): Point {
    return this.toAbsolutePoint(this._radius, -this._radius);
  }

  /**
   * Gets the left-center point (same as left).
   *
   * @returns The left-most point of the circle
   */
  get leftCenter(): Point {
    return this.left;
  }

  /**
   * Gets the right-center point (same as right).
   *
   * @returns The right-most point of the circle
   */
  get rightCenter(): Point {
    return this.right;
  }

  /**
   * Gets the bottom-left point of the bounding box.
   *
   * @returns The bottom-left corner of the circle's bounding box
   */
  get bottomLeft(): Point {
    return this.toAbsolutePoint(-this._radius, this._radius);
  }

  /**
   * Gets the bottom-center point (same as bottom).
   *
   * @returns The bottom-most point of the circle
   */
  get bottomCenter(): Point {
    return this.bottom;
  }

  /**
   * Gets the bottom-right point of the bounding box.
   *
   * @returns The bottom-right corner of the circle's bounding box
   */
  get bottomRight(): Point {
    return this.toAbsolutePoint(this._radius, this._radius);
  }

  /**
   * Gets the bounding box of the circle.
   *
   * @returns Object with top-left and bottom-right points of the bounding box
   */
  get boundingBox(): { topLeft: Point; bottomRight: Point; width: number; height: number } {
    return {
      topLeft: this.toAbsolutePoint(-this._radius, -this._radius),
      bottomRight: this.toAbsolutePoint(this._radius, this._radius),
      width: this._radius * 2,
      height: this._radius * 2,
    };
  }

  /**
   * Renders the circle to SVG.
   *
   * @returns SVG circle element representing the circle
   */
  render(): string {
    // Use absolute position for rendering to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const cx = absPos.x;
    const cy = absPos.y;
    const r = this._radius;

    // Default style if none provided
    const defaultStyle: Partial<Style> = {
      fill: "#000000",
      stroke: "none",
      strokeWidth: "1",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const styleAttrs = styleToSVGAttributes(style);

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const comment = this.getSVGComment();

    return `${comment}<circle cx="${cx}" cy="${cy}" r="${r}" ${styleAttrs}${transform} />`;
  }
}

