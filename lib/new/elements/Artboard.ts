/**
 * New layout system - Artboard class
 */

import { NewContainer, type SizeMode } from "../layout/Container.js";
import { type Style, styleToSVGAttributes } from "../../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";

export interface NewArtboardConfig {
  /**
   * Width of the artboard in pixels, or 'auto' to fit children.
   * @defaultValue 800
   */
  width?: SizeMode;

  /**
   * Height of the artboard in pixels, or 'auto' to fit children.
   * @defaultValue 600
   */
  height?: SizeMode;

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
 *
 * Artboard extends NewContainer with direction "none", which means:
 * - Children must be positioned manually (no automatic layout)
 * - Can use 'auto' for width/height to fit children bounds
 * - Bounds are normalized (children shifted to positive coordinates)
 * 
 * All layout logic is handled by the parent NewContainer class.
 */
export class NewArtboard extends NewContainer {
  constructor(config: NewArtboardConfig = {}) {
    const width = config.width ?? 800;
    const height = config.height ?? 600;

    const style: Partial<Style> = { ...config.style };
    if (config.backgroundColor) {
      style.fill = config.backgroundColor;
    }

    super({
      width,
      height,
      direction: "none", // Artboard uses "none" mode from Container
      boxModel: config.boxModel,
      style,
    });
  }

  /**
   * Renders the artboard as an SVG element.
   * The SVG dimensions are the border box size (total size).
   * Elements are sorted by z-index before rendering.
   *
   * Overrides NewContainer's render to provide SVG wrapper.
   */
  render(): string {
    const bgAttrs = styleToSVGAttributes(this.style);
    const bgRect = bgAttrs
      ? `  <rect width="${this.width}" height="${this.height}" ${bgAttrs}/>\n`
      : "";

    // Sort children by z-index (explicit z-index > creation order)
    const sortedChildren = [...this.children].sort((a, b) => {
      const zIndexA = (a as any).zIndex;
      const zIndexB = (b as any).zIndex;

      // If both have explicit z-index, compare them
      if (zIndexA !== undefined && zIndexB !== undefined) {
        return zIndexA - zIndexB;
      }

      // If only one has z-index, it takes priority
      if (zIndexA !== undefined) return zIndexA - 0;
      if (zIndexB !== undefined) return 0 - zIndexB;

      // Neither has z-index: use creation order
      const indexA = (a as any)._creationIndex || 0;
      const indexB = (b as any)._creationIndex || 0;
      return indexA - indexB;
    });

    const elementsHTML = sortedChildren
      .map((element) => element.render())
      .join("\n  ");

    return `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
${bgRect}  ${elementsHTML}
</svg>`;
  }
}
