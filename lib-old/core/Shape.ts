/**
 * Base shape module providing fundamental geometric primitives.
 *
 * This module defines the base class for all geometric shapes in the library.
 * Shapes are visual elements that extend Bounded to support box model properties
 * and rendering capabilities specific to geometric primitives.
 *
 * @module core
 */

import { Bounded } from "./Bounded.js";

/**
 * Abstract base class for all geometric shapes in the library.
 *
 * This class extends {@link Bounded} to provide shape-specific functionality.
 * All visual geometric primitives (circles, rectangles, triangles, etc.)
 * inherit from this class.
 *
 * @remarks
 * Shapes in this library are immutable by default. Transformations create
 * new internal states but maintain a clean API for LLMs to work with.
 *
 * All shapes have a center point, which is used as the default reference
 * for positioning and transformations unless otherwise specified.
 *
 * Shapes support margin and padding through the Bounded class, allowing
 * for CSS-like box model layout.
 *
 * @example
 * ```typescript
 * // Subclasses implement specific shapes
 * class Circle extends Shape {
 *   constructor(radius: number) {
 *     super();
 *     // Implementation
 *   }
 * }
 * ```
 */
/**
 * Background image sizing options (similar to CSS background-size).
 */
export type BackgroundImageSize = "cover" | "contain" | "fill";

export abstract class Shape extends Bounded {
  protected _backgroundImage?: string;
  protected _backgroundImageSize: BackgroundImageSize = "cover";
  private static patternCounter = 0;
  protected _patternId?: string;

  /**
   * Constructor to pass name up to Bounded.
   */
  constructor(name?: string) {
    super(name);
  }

  /**
   * Sets a background image for the shape.
   * The image will be used as a fill pattern.
   *
   * @param url - URL or path to the background image
   * @param size - How the image should be sized (default: "cover")
   *
   * @example
   * ```typescript
   * const circle = new Circle({ radius: 50 });
   * circle.setBackgroundImage("https://example.com/image.jpg", "cover");
   * ```
   */
  setBackgroundImage(url: string, size: BackgroundImageSize = "cover"): void {
    this._backgroundImage = url;
    this._backgroundImageSize = size;
    this._patternId = `bg-pattern-${Shape.patternCounter++}`;
  }

  /**
   * Gets the background image URL if set.
   *
   * @returns The background image URL or undefined
   */
  get backgroundImage(): string | undefined {
    return this._backgroundImage;
  }

  /**
   * Gets the pattern ID for the background image.
   * @internal
   */
  get patternId(): string | undefined {
    return this._patternId;
  }

  /**
   * Generates the SVG pattern definition for the background image.
   * Subclasses can override this to customize pattern behavior.
   *
   * @returns SVG pattern element or empty string if no background image
   * @internal
   */
  getPatternDef(): string {
    if (!this._backgroundImage || !this._patternId) {
      return "";
    }

    // Map CSS background-size to SVG preserveAspectRatio
    let preserveAspectRatio: string;
    switch (this._backgroundImageSize) {
      case "cover":
        // Image covers entire shape, may be cropped
        preserveAspectRatio = "xMidYMid slice";
        break;
      case "contain":
        // Entire image visible, may have empty space
        preserveAspectRatio = "xMidYMid meet";
        break;
      case "fill":
        // Stretch to fill, may distort
        preserveAspectRatio = "none";
        break;
      default:
        preserveAspectRatio = "xMidYMid slice";
    }

    // Use objectBoundingBox for both pattern and content units
    // This makes everything scale proportionally with the shape
    return `
    <pattern id="${this._patternId}" x="0" y="0" width="1" height="1" 
             patternUnits="objectBoundingBox" patternContentUnits="objectBoundingBox">
      <image href="${this._backgroundImage}" 
             x="0" y="0"
             width="1" height="1"
             preserveAspectRatio="${preserveAspectRatio}"/>
    </pattern>`;
  }

  // Shape-specific methods and properties can be added here
  // All positioning, rotation, translation, margin, and padding are inherited from Bounded
}
