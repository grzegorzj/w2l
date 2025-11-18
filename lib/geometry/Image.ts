/**
 * Geometric shapes module - Image implementation.
 *
 * Provides image elements for embedding raster graphics (PNG, JPG, etc.).
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Configuration for creating an Image.
 *
 * Supports intuitive parameters that are easy for LLMs to work with.
 * Visual styling is handled through the style property using CSS/SVG properties.
 */
export interface ImageConfig {
  /**
   * URL or path to the image file.
   * Supports relative paths, absolute URLs, and data URLs.
   *
   * @example
   * ```typescript
   * // Relative path
   * src: "./images/photo.jpg"
   *
   * // Absolute URL
   * src: "https://example.com/image.png"
   *
   * // Data URL
   * src: "data:image/png;base64,iVBORw0KGgo..."
   * ```
   */
  src: string;

  /**
   * Width of the image (supports units like "300px", "2rem", or numbers).
   */
  width: string | number;

  /**
   * Height of the image (supports units like "400px", "2rem", or numbers).
   */
  height: string | number;

  /**
   * How the image should be preserved in its aspect ratio.
   * Uses SVG preserveAspectRatio attribute values.
   *
   * Common values:
   * - "none" - Scale to fill the bounds, potentially distorting the image
   * - "xMidYMid meet" - Center and scale to fit (default)
   * - "xMidYMid slice" - Center and scale to cover
   * - "xMinYMin meet" - Align top-left and scale to fit
   *
   * @default "xMidYMid meet"
   */
  preserveAspectRatio?: string;

  /**
   * Optional alt text for accessibility.
   */
  alt?: string;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties (opacity, filters, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @example
   * ```typescript
   * {
   *   opacity: 0.8,
   *   filter: "blur(2px)"
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Image shape for embedding raster graphics.
 *
 * The Image class provides a high-level interface for embedding PNG, JPG,
 * and other raster image formats into SVG compositions. Images can be
 * positioned, rotated, and styled like any other shape.
 *
 * @remarks
 * Images in SVG are rendered using the `<image>` element. The image's aspect
 * ratio can be controlled using the `preserveAspectRatio` property.
 *
 * Images support all standard SVG filters and effects through the style property.
 *
 * @example
 * Create an image with fixed dimensions
 * ```typescript
 * const photo = new Image({
 *   src: "./photo.jpg",
 *   width: 300,
 *   height: 200
 * });
 * ```
 *
 * @example
 * Create an image with opacity and filters
 * ```typescript
 * const photo = new Image({
 *   src: "https://example.com/image.png",
 *   width: 400,
 *   height: 300,
 *   style: {
 *     opacity: 0.8,
 *     filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
 *   }
 * });
 * ```
 *
 * @example
 * Position an image at an artboard center
 * ```typescript
 * const photo = new Image({
 *   src: "./photo.jpg",
 *   width: 500,
 *   height: 400
 * });
 * photo.position({
 *   relativeFrom: photo.center,
 *   relativeTo: artboard.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 */
export class Image extends Shape {
  private config: ImageConfig;
  private _width: number;
  private _height: number;

  /**
   * Creates a new Image instance.
   *
   * @param config - Configuration for the image
   *
   * @throws {Error} If src is not provided
   */
  constructor(config: ImageConfig) {
    super(config.name);
    this.config = config;

    if (!config.src) {
      throw new Error("Image requires src to be specified");
    }

    this._width = parseUnit(config.width);
    this._height = parseUnit(config.height);
  }

  /**
   * Gets the width of the image in pixels.
   *
   * @returns The width value
   */
  get width(): number {
    return this._width;
  }

  /**
   * Gets the height of the image in pixels.
   *
   * @returns The height value
   */
  get height(): number {
    return this._height;
  }

  /**
   * Images should not be resized to fit content as they have fixed dimensions.
   *
   * @returns False to prevent layout-based resizing
   */
  get shouldFitContent(): boolean {
    return false;
  }

  /**
   * Gets the geometric center of the image.
   *
   * @returns The center point of the image
   */
  get center(): Point {
    return this.toAbsolutePoint(this._width / 2, this._height / 2, "center");
  }

  /**
   * Gets the top-left corner of the image.
   *
   * @returns The top-left point of the image
   */
  get topLeft(): Point {
    return this.toAbsolutePoint(0, 0, "topLeft");
  }

  /**
   * Gets the top-center point of the image.
   *
   * @returns The top-center point of the image
   */
  get topCenter(): Point {
    return this.toAbsolutePoint(this._width / 2, 0, "topCenter");
  }

  /**
   * Gets the top-right corner of the image.
   *
   * @returns The top-right point of the image
   */
  get topRight(): Point {
    return this.toAbsolutePoint(this._width, 0, "topRight");
  }

  /**
   * Gets the left-center point of the image.
   *
   * @returns The left-center point of the image
   */
  get leftCenter(): Point {
    return this.toAbsolutePoint(0, this._height / 2, "leftCenter");
  }

  /**
   * Gets the right-center point of the image.
   *
   * @returns The right-center point of the image
   */
  get rightCenter(): Point {
    return this.toAbsolutePoint(this._width, this._height / 2, "rightCenter");
  }

  /**
   * Gets the bottom-left corner of the image.
   *
   * @returns The bottom-left point of the image
   */
  get bottomLeft(): Point {
    return this.toAbsolutePoint(0, this._height, "bottomLeft");
  }

  /**
   * Gets the bottom-center point of the image.
   *
   * @returns The bottom-center point of the image
   */
  get bottomCenter(): Point {
    return this.toAbsolutePoint(this._width / 2, this._height, "bottomCenter");
  }

  /**
   * Gets the bottom-right corner of the image.
   *
   * @returns The bottom-right point of the image
   */
  get bottomRight(): Point {
    return this.toAbsolutePoint(this._width, this._height, "bottomRight");
  }

  /**
   * Gets the bounding box of the image.
   *
   * @param axisAligned - Whether to return axis-aligned (true) or oriented (false) bounding box
   * @returns The bounding box
   */
  getBoundingBox(axisAligned: boolean = true): import("../core/Element.js").BoundingBox {
    return {
      topLeft: this.toAbsolutePoint(0, 0),
      bottomRight: this.toAbsolutePoint(this._width, this._height),
      width: this._width,
      height: this._height,
      isAxisAligned: true,
    };
  }

  /**
   * Renders the image to SVG.
   *
   * @returns SVG image element representing the image
   */
  render(): string {
    // Use absolute position for rendering to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const x = absPos.x;
    const y = absPos.y;
    const width = this._width;
    const height = this._height;

    const preserveAspectRatio = this.config.preserveAspectRatio || "xMidYMid meet";

    // Style attributes
    const styleAttrs = this.config.style
      ? styleToSVGAttributes(this.config.style)
      : "";

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const comment = this.getSVGComment();

    // Add title element for accessibility if alt text is provided
    const title = this.config.alt
      ? `<title>${this.config.alt}</title>`
      : "";

    return `${comment}<image x="${x}" y="${y}" width="${width}" height="${height}" href="${this.config.src}" preserveAspectRatio="${preserveAspectRatio}" ${styleAttrs}${transform}>${title}</image>`;
  }
}

