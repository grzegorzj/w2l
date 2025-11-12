/**
 * Geometric shapes module - Square implementation.
 *
 * Provides square primitives as a specialized case of Rectangle
 * where width equals height.
 *
 * @module geometry
 */

import { Rectangle, type RectangleConfig, type CornerStyle } from "./Rectangle.js";

/**
 * Configuration for creating a Square.
 *
 * Squares use a single size parameter instead of separate width and height.
 */
export interface SquareConfig {
  /**
   * Side length of the square (supports units like "100px", "2rem", or numbers).
   * This is used for both width and height.
   * Either 'size' or 'a' must be provided.
   */
  size?: string | number;

  /**
   * Alternatively, specify side length using 'a' (common mathematical notation).
   * Either 'size' or 'a' must be provided.
   */
  a?: string | number;

  /**
   * Corner style for the square.
   * @defaultValue "sharp"
   */
  cornerStyle?: CornerStyle;

  /**
   * Corner radius for rounded or squircle corners (supports units).
   * @defaultValue 0
   */
  cornerRadius?: string | number;

  /**
   * Fill color of the square.
   * @defaultValue "#000000"
   */
  fill?: string;

  /**
   * Stroke color for the square outline.
   * @defaultValue "none"
   */
  stroke?: string;

  /**
   * Stroke width (supports units like "2px" or numbers).
   * @defaultValue 1
   */
  strokeWidth?: string | number;
}

/**
 * Square shape with comprehensive geometric properties.
 *
 * The Square class extends Rectangle, providing a specialized interface for
 * squares where width equals height. It supports all corner styles including
 * sharp, rounded, and squircle corners.
 *
 * @remarks
 * This class inherits all Rectangle functionality but provides a simpler
 * API focused on squares. It accepts either 'size' or 'a' as the side length
 * parameter, making it intuitive for LLMs to work with.
 *
 * @example
 * Create a basic square
 * ```typescript
 * const square = new Square({
 *   size: 100,
 *   fill: "#3498db"
 * });
 * ```
 *
 * @example
 * Create a square using mathematical notation
 * ```typescript
 * const square = new Square({
 *   a: "150px",
 *   fill: "#e74c3c"
 * });
 * ```
 *
 * @example
 * Create a rounded square
 * ```typescript
 * const square = new Square({
 *   size: 120,
 *   cornerStyle: "rounded",
 *   cornerRadius: 20,
 *   fill: "#2ecc71"
 * });
 * ```
 *
 * @example
 * Position squares along a triangle's sides (Pythagorean theorem visualization)
 * ```typescript
 * const triangle = new Triangle({ type: "right", a: 3, b: 4 });
 *
 * triangle.sides.forEach(side => {
 *   const square = new Square({ size: side.length });
 *   square.position({
 *     relativeTo: side.center,
 *     relativeFrom: square.center,
 *     x: 0,
 *     y: 0
 *   });
 *   square.translate({
 *     along: side.outwardNormal,
 *     distance: side.length / 2
 *   });
 * });
 * ```
 */
export class Square extends Rectangle {
  /**
   * Creates a new Square instance.
   *
   * @param config - Configuration for the square
   *
   * @throws {Error} If neither size nor 'a' is provided
   */
  constructor(config: SquareConfig) {
    const sideLength = config.size ?? config.a;

    if (sideLength === undefined) {
      throw new Error("Square requires either 'size' or 'a' to be specified");
    }

    const rectangleConfig: RectangleConfig = {
      width: sideLength,
      height: sideLength,
      cornerStyle: config.cornerStyle,
      cornerRadius: config.cornerRadius,
      fill: config.fill,
      stroke: config.stroke,
      strokeWidth: config.strokeWidth,
    };

    super(rectangleConfig);
  }

  /**
   * Gets the side length of the square in pixels.
   *
   * @returns The side length (same as width or height)
   */
  get sideLength(): number {
    return this._width;
  }

  /**
   * Gets the diagonal length of the square in pixels.
   *
   * @returns The diagonal length (side × √2)
   */
  get diagonal(): number {
    return this._width * Math.sqrt(2);
  }
}

