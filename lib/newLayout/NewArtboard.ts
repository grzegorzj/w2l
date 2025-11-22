/**
 * New layout system - Artboard class
 */

import { NewRectangle } from "./NewRectangle.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "./BoxModel.js";

export interface NewArtboardConfig {
  /**
   * Width of the artboard in pixels.
   * @defaultValue 800
   */
  width?: number;

  /**
   * Height of the artboard in pixels.
   * @defaultValue 600
   */
  height?: number;

  /**
   * SVG styling for the artboard background.
   */
  style?: Partial<Style>;

  /**
   * Background color of the artboard.
   */
  backgroundColor?: string;

  /**
   * Box model for the artboard (margin, border, padding).
   */
  boxModel?: BoxModel;
}

/**
 * The Artboard is the canvas where all elements are rendered.
 * By default, creates an 800x600px SVG.
 */
export class NewArtboard extends NewRectangle {
  constructor(config: NewArtboardConfig = {}) {
    const width = config.width ?? 800;
    const height = config.height ?? 600;

    const style: Partial<Style> = { ...config.style };
    if (config.backgroundColor) {
      style.fill = config.backgroundColor;
    }

    super(width, height, config.boxModel, style);
  }

  /**
   * Renders the artboard as an SVG element.
   * The SVG dimensions are the border box size (total size).
   */
  render(): string {
    const bgAttrs = styleToSVGAttributes(this._style);
    const bgRect = bgAttrs
      ? `  <rect width="${this.width}" height="${this.height}" ${bgAttrs}/>\n`
      : "";

    const elementsHTML = this.children
      .map((element) => element.render())
      .join("\n  ");

    return `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
${bgRect}  ${elementsHTML}
</svg>`;
  }
}
