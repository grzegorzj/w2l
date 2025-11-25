/**
 * New layout system - Image
 * Raster image element with width and height
 */

import { NewRectangle } from "../core/Rectangle.js";
import { type Style } from "../../core/Stylable.js";
import { styleToSVGAttributes } from "../../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

export interface NewImageConfig {
  /**
   * URL or path to the image file.
   * Supports relative paths, absolute URLs, and data URLs.
   */
  src: string;

  /**
   * Width of the image in pixels.
   */
  width: number;

  /**
   * Height of the image in pixels.
   */
  height: number;

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
   * Optional box model for padding, border, margin.
   */
  boxModel?: BoxModel;

  /**
   * Visual styling properties (opacity, filters, etc.).
   */
  style?: Partial<Style>;
}

/**
 * Image element for embedding raster graphics (PNG, JPG, etc.).
 *
 * The NewImage class provides a high-level interface for embedding raster
 * image formats into SVG compositions. Images can be positioned, rotated,
 * and styled like any other shape.
 *
 * @remarks
 * Images in SVG are rendered using the `<image>` element. The image's aspect
 * ratio can be controlled using the `preserveAspectRatio` property.
 *
 * @example
 * Create an image with fixed dimensions
 * ```typescript
 * const photo = new NewImage({
 *   src: "./photo.jpg",
 *   width: 300,
 *   height: 200
 * });
 * ```
 *
 * @example
 * Create an image with opacity and filters
 * ```typescript
 * const photo = new NewImage({
 *   src: "https://example.com/image.png",
 *   width: 400,
 *   height: 300,
 *   style: {
 *     opacity: 0.8,
 *     filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
 *   }
 * });
 * ```
 */
export class NewImage extends NewRectangle {
  private src: string;
  private preserveAspectRatio: string;
  private alt?: string;

  /**
   * Creates a new NewImage instance.
   *
   * @param config - Configuration for the image
   *
   * @throws {Error} If src is not provided
   */
  constructor(config: NewImageConfig) {
    if (!config.src) {
      throw new Error("Image requires src to be specified");
    }

    super(config.width, config.height, config.boxModel, config.style);

    this.src = config.src;
    this.preserveAspectRatio = config.preserveAspectRatio || "xMidYMid meet";
    this.alt = config.alt;
  }

  /**
   * Renders the image to SVG.
   *
   * @returns SVG image element representing the image
   */
  render(): string {
    const absPos = this.getAbsolutePosition();
    const borderPos = this.getPositionForBox("border");
    const borderSize = this.getBoxSize("border");

    const x = absPos.x + borderPos.x;
    const y = absPos.y + borderPos.y;
    const width = borderSize.width;
    const height = borderSize.height;

    // Style attributes
    const styleAttrs = styleToSVGAttributes(this._style);

    const transform = this.getTransformAttribute();

    // Add title element for accessibility if alt text is provided
    const title = this.alt ? `<title>${this.alt}</title>` : "";

    return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${this.src}" preserveAspectRatio="${this.preserveAspectRatio}" ${styleAttrs} ${transform}>${title}</image>`;
  }
}

