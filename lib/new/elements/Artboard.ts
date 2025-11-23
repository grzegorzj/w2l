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
 * Artboard extends NewContainer with direction "none", which means
 * children must be positioned manually (no automatic layout).
 *
 * Can use 'auto' for width/height to fit children bounds.
 */
export class NewArtboard extends NewContainer {
  private _artboardAutoWidth: boolean;
  private _artboardAutoHeight: boolean;

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
      direction: "none", // No automatic layout - manual positioning only
      boxModel: config.boxModel,
      style,
    });

    this._artboardAutoWidth = config.width === "auto";
    this._artboardAutoHeight = config.height === "auto";
  }

  /**
   * Override addElement to calculate bounds for auto-sizing.
   */
  addElement(element: any): void {
    super.addElement(element);

    if (this._artboardAutoWidth || this._artboardAutoHeight) {
      this.updateArtboardBounds();
    }
  }

  /**
   * Update artboard size based on all elements in the tree.
   * Recursively traverses the entire element tree to find all positioned elements.
   */
  private updateArtboardBounds(): void {
    if (this.children.length === 0) return;

    // Calculate the bounding box of ALL elements in the tree (recursive)
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    // Recursive function to traverse the tree and collect bounds
    const collectBounds = (element: any) => {
      // Get bounds of this element
      if (element.borderBox) {
        const tl = element.borderBox.topLeft;
        const br = element.borderBox.bottomRight;
        minX = Math.min(minX, tl.x);
        minY = Math.min(minY, tl.y);
        maxX = Math.max(maxX, br.x);
        maxY = Math.max(maxY, br.y);
      } else if (element.center && element.radius) {
        // Circle
        const center = element.center;
        const radius = element.radius;
        minX = Math.min(minX, center.x - radius);
        minY = Math.min(minY, center.y - radius);
        maxX = Math.max(maxX, center.x + radius);
        maxY = Math.max(maxY, center.y + radius);
      }

      // Recursively collect bounds from children
      if (element.children && Array.isArray(element.children)) {
        for (const child of element.children) {
          collectBounds(child);
        }
      }
    };

    // Start recursive traversal from all direct children
    for (const child of this.children) {
      collectBounds(child);
    }

    if (this._artboardAutoWidth && isFinite(minX) && isFinite(maxX)) {
      this._borderBoxWidth =
        Math.max(0, maxX - minX) +
        this._boxModel.padding.left +
        this._boxModel.padding.right +
        this._boxModel.border.left +
        this._boxModel.border.right;
    }

    if (this._artboardAutoHeight && isFinite(minY) && isFinite(maxY)) {
      this._borderBoxHeight =
        Math.max(0, maxY - minY) +
        this._boxModel.padding.top +
        this._boxModel.padding.bottom +
        this._boxModel.border.top +
        this._boxModel.border.bottom;
    }
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
