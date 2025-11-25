/**
 * Geometric shapes module - Circle implementation.
 *
 * Provides circle primitives with radius-based or diameter-based configuration.
 *
 * @module elements
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
   * Padding around the content (CSS-like spacing).
   * Supports uniform values or individual sides.
   * @defaultValue 0
   */
  padding?: import("../core/Bounded.js").Spacing;

  /**
   * Margin around the element (CSS-like spacing).
   * Supports uniform values or individual sides.
   * @defaultValue 0
   */
  margin?: import("../core/Bounded.js").Spacing;

  /**
   * Optional background image URL.
   * The image will be used as a fill pattern for the circle.
   *
   * @example
   * ```typescript
   * {
   *   radius: 50,
   *   backgroundImage: "https://example.com/image.jpg",
   *   backgroundImageSize: "cover"
   * }
   * ```
   */
  backgroundImage?: string;

  /**
   * How the background image should be sized.
   * - "cover": Image covers entire shape, may be cropped (default)
   * - "contain": Entire image visible, may have empty space
   * - "fill": Stretch to fill, may distort
   *
   * @default "cover"
   */
  backgroundImageSize?: import("../core/Shape.js").BackgroundImageSize;

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

    // Set background image if provided
    if (config.backgroundImage) {
      this.setBackgroundImage(
        config.backgroundImage,
        config.backgroundImageSize || "cover"
      );
    }

    // Set padding and margin if provided
    if (config.padding !== undefined) {
      this.padding = config.padding;
    }
    if (config.margin !== undefined) {
      this.margin = config.margin;
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
    return this.toAbsolutePoint(0, 0, "center");
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
      this._radius * Math.sin(radians),
      `pointAt(${degrees})`
    );
  }

  /**
   * Gets the top-most point on the circle (270°).
   *
   * @returns The top point of the circle
   */
  get top(): Point {
    return this.toAbsolutePoint(0, -this._radius, "top");
  }

  /**
   * Gets the bottom-most point on the circle (90°).
   *
   * @returns The bottom point of the circle
   */
  get bottom(): Point {
    return this.toAbsolutePoint(0, this._radius, "bottom");
  }

  /**
   * Gets the left-most point on the circle (180°).
   *
   * @returns The left point of the circle
   */
  get left(): Point {
    return this.toAbsolutePoint(-this._radius, 0, "left");
  }

  /**
   * Gets the right-most point on the circle (0°).
   *
   * @returns The right point of the circle
   */
  get right(): Point {
    return this.toAbsolutePoint(this._radius, 0, "right");
  }

  // Standard reference points (matching Rectangle's 9-point system)

  /**
   * Gets the top-left point of the bounding box.
   *
   * @returns The top-left corner of the circle's bounding box
   */
  get topLeft(): Point {
    return this.toAbsolutePoint(-this._radius, -this._radius, "topLeft");
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
    return this.toAbsolutePoint(this._radius, -this._radius, "topRight");
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
    return this.toAbsolutePoint(-this._radius, this._radius, "bottomLeft");
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
    return this.toAbsolutePoint(this._radius, this._radius, "bottomRight");
  }

  /**
   * Gets the alignment point based on horizontal and vertical alignment.
   * Used by layout systems to position circle elements correctly.
   *
   * @param horizontalAlign - Horizontal alignment (left, center, right)
   * @param verticalAlign - Vertical alignment (top, center, bottom)
   * @returns The point corresponding to the specified alignment
   */
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    // Map alignment to the correct reference point
    if (horizontalAlign === "left") {
      if (verticalAlign === "top") return this.topLeft;
      if (verticalAlign === "bottom") return this.bottomLeft;
      return this.leftCenter; // center
    } else if (horizontalAlign === "right") {
      if (verticalAlign === "top") return this.topRight;
      if (verticalAlign === "bottom") return this.bottomRight;
      return this.rightCenter; // center
    } else {
      // horizontalAlign === "center"
      if (verticalAlign === "top") return this.topCenter;
      if (verticalAlign === "bottom") return this.bottomCenter;
      return this.center; // center-center
    }
  }

  /**
   * Gets the bounding box of the circle.
   *
   * Circles are rotationally symmetric, so axis-aligned and oriented bounding boxes are identical.
   *
   * @param axisAligned - Whether to return axis-aligned (true) or oriented (false) bounding box
   * @returns The bounding box
   */
  getBoundingBox(axisAligned: boolean = true): import("../core/Element.js").BoundingBox {
    return {
      topLeft: this.toAbsolutePoint(-this._radius, -this._radius),
      bottomRight: this.toAbsolutePoint(this._radius, this._radius),
      width: this._radius * 2,
      height: this._radius * 2,
      isAxisAligned: true, // Circles are always axis-aligned (rotationally symmetric)
    };
  }

  /**
   * Gets the bounding box of the circle.
   *
   * @returns Object with top-left and bottom-right points of the bounding box
   * @deprecated Use getBoundingBox() instead
   */
  get boundingBox(): { topLeft: Point; bottomRight: Point; width: number; height: number } {
    const bbox = this.getBoundingBox();
    return {
      topLeft: bbox.topLeft,
      bottomRight: bbox.bottomRight,
      width: bbox.width,
      height: bbox.height,
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
    
    // If background image is set, override fill with pattern
    if (this._backgroundImage && this._patternId) {
      style.fill = `url(#${this._patternId})`;
    }
    
    const styleAttrs = styleToSVGAttributes(style);

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const comment = this.getSVGComment();
    
    // Include pattern definition if background image is set
    const patternDef = this.getPatternDef();

    return `${patternDef}${comment}<circle cx="${cx}" cy="${cy}" r="${r}" ${styleAttrs}${transform} />`;
  }
}

