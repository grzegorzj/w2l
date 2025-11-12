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
    super();
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
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y}px`,
    };
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
    return {
      x: `${this.currentPosition.x + this._radius * Math.cos(radians)}px`,
      y: `${this.currentPosition.y + this._radius * Math.sin(radians)}px`,
    };
  }

  /**
   * Gets the top-most point on the circle (270°).
   *
   * @returns The top point of the circle
   */
  get top(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y - this._radius}px`,
    };
  }

  /**
   * Gets the bottom-most point on the circle (90°).
   *
   * @returns The bottom point of the circle
   */
  get bottom(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this._radius}px`,
    };
  }

  /**
   * Gets the left-most point on the circle (180°).
   *
   * @returns The left point of the circle
   */
  get left(): Point {
    return {
      x: `${this.currentPosition.x - this._radius}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the right-most point on the circle (0°).
   *
   * @returns The right point of the circle
   */
  get right(): Point {
    return {
      x: `${this.currentPosition.x + this._radius}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the bounding box of the circle.
   *
   * @returns Object with top-left and bottom-right points of the bounding box
   */
  get boundingBox(): { topLeft: Point; bottomRight: Point; width: number; height: number } {
    return {
      topLeft: {
        x: `${this.currentPosition.x - this._radius}px`,
        y: `${this.currentPosition.y - this._radius}px`,
      },
      bottomRight: {
        x: `${this.currentPosition.x + this._radius}px`,
        y: `${this.currentPosition.y + this._radius}px`,
      },
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
    const cx = this.currentPosition.x;
    const cy = this.currentPosition.y;
    const r = this._radius;

    // Default style if none provided
    const defaultStyle: Partial<Style> = {
      fill: "#000000",
      stroke: "none",
      strokeWidth: "1",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const styleAttrs = styleToSVGAttributes(style);

    let transform = "";
    if (this.rotation !== 0) {
      transform = ` transform="rotate(${this.rotation} ${cx} ${cy})"`;
    }

    return `<circle cx="${cx}" cy="${cy}" r="${r}" ${styleAttrs}${transform} />`;
  }
}

