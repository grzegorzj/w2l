/**
 * New layout system - Artboard class
 */

import { Container, type SizeMode } from "../layout/Container.js";
import { type Style, styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";
import { type Theme, defaultTheme } from "../core/Theme.js";
import { setCurrentArtboard } from "../core/ArtboardContext.js";

export interface ArtboardConfig {
  /**
   * Width of the artboard in pixels, or 'auto' to fit children.
   * @defaultValue 'auto'
   */
  width?: SizeMode;

  /**
   * Height of the artboard in pixels, or 'auto' to fit children.
   * @defaultValue 'auto'
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

  /**
   * Optional theme to apply to the artboard.
   * If provided, the artboard background will use theme colors.
   */
  theme?: Theme;
}

/**
 * The Artboard is the canvas where all elements are rendered.
 * By default, auto-sizes to fit children.
 *
 * Artboard extends Container with direction "freeform", which means:
 * - Children position themselves freely (like CSS absolute positioning)
 * - Can use 'auto' for width/height to fit children bounds
 * - Bounds are normalized (children shifted to positive coordinates)
 * - Layout is finalized automatically before rendering
 *
 * All layout logic is handled by the parent Container class.
 */
export class Artboard extends Container {
  private theme?: Theme;

  constructor(config: ArtboardConfig = {}) {
    const width = config.width ?? "auto";
    const height = config.height ?? "auto";
    const theme = config.theme;

    const style: Partial<Style> = { ...config.style };

    // Apply theme background if theme is provided and no explicit backgroundColor
    if (theme && !config.backgroundColor && !config.style?.fill) {
      style.fill = theme.colors.background;
    } else if (config.backgroundColor) {
      style.fill = config.backgroundColor;
    }

    // Apply default padding of 20 if not explicitly set in boxModel
    const boxModel: BoxModel = {
      ...config.boxModel,
      padding: config.boxModel?.padding ?? 20,
    };

    super({
      width,
      height,
      direction: "freeform",
      boxModel,
      style,
    });

    this.theme = theme;

    // Set this as the current artboard for auto-adding elements
    setCurrentArtboard(this);
  }

  /**
   * Get the theme used by this artboard.
   */
  getTheme(): Theme | undefined {
    return this.theme;
  }

  /**
   * Renders the artboard as an SVG element.
   * The SVG dimensions are the border box size (total size).
   * Elements are sorted by z-index before rendering.
   *
   * Overrides Container's render to provide SVG wrapper.
   */
  render(): string {
    // Ensure freeform layout is finalized before rendering
    // This is critical for artboards with auto-sizing, as they have no parent
    // to trigger finalization through position() calls
    this.ensureFreeformFinalized();

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
