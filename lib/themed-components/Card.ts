/**
 * Card - A themed container component for web-like layouts.
 * 
 * Features:
 * - Optional header
 * - Main content area
 * - Optional footer
 * - Automatic padding and borders
 * - Professional Swiss design styling
 */

import { Container, type SizeMode } from "../layout/Container.js";
import { type Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";
import { defaultTheme } from "../core/Theme.js";
import { Text } from "../elements/Text.js";
import { Element } from "../core/Element.js";

export interface CardConfig {
  /**
   * Width of the card.
   */
  width: number;

  /**
   * Height of the card, or 'auto' to fit content.
   * @default 'auto'
   */
  height?: number | "auto";

  /**
   * Optional header text.
   */
  header?: string;

  /**
   * Optional footer text.
   */
  footer?: string;

  /**
   * Additional style overrides.
   */
  style?: Partial<Style>;

  /**
   * Box model overrides.
   */
  boxModel?: BoxModel;
}

/**
 * Card component - a themed container for content with optional header and footer.
 * 
 * Automatically styled with:
 * - White background
 * - Subtle border
 * - Small border radius (2px)
 * - Comfortable padding (16px)
 * - Professional typography
 * - Vertical layout for content
 * 
 * @example
 * ```typescript
 * const card = new Card({
 *   width: 300,
 *   header: "Card Title",
 *   footer: "Learn more →",
 * });
 * 
 * // Add content - will be automatically laid out vertically
 * card.addContent(text);
 * card.addContent(chart);
 * ```
 */
export class Card extends Container {
  private _header?: Text;
  private _footer?: Text;

  constructor(config: CardConfig) {
    // Apply card styling from theme
    const cardStyle: Partial<Style> = {
      fill: defaultTheme.colors.background,
      stroke: defaultTheme.colors.border,
      strokeWidth: String(defaultTheme.borders.width),
      ...config.style,
    };

    // Apply default padding
    const cardBoxModel = config.boxModel ?? {
      padding: defaultTheme.spacing[4], // 16px
    };

    // Card uses vertical direction to stack header, content, and footer
    super({
      width: config.width,
      height: config.height === "auto" ? "auto" : (config.height ?? "auto"),
      direction: "vertical",
      spacing: defaultTheme.spacing[3], // 12px between elements
      horizontalAlignment: "left",
      verticalAlignment: "top",
      style: cardStyle,
      boxModel: cardBoxModel,
    });

    // Create header if provided
    if (config.header) {
      this._header = new Text({
        content: config.header,
        fontSize: "16px",
        style: {
          ...defaultTheme.presets.text,
          fontWeight: String(defaultTheme.typography.weights.medium),
          fill: defaultTheme.colors.foreground,
        },
      });
      super.addElement(this._header);
    }

    // Footer will be added at the end after content
    if (config.footer) {
      this._footer = new Text({
        content: config.footer,
        fontSize: "12px",
        style: {
          ...defaultTheme.presets.text,
          fill: defaultTheme.colors.neutral[500],
        },
      });
    }
  }

  /**
   * Add content to the card (between header and footer).
   * Content is automatically laid out vertically by the Container.
   */
  addContent(element: Element): void {
    // If we have a footer, we need to add content before it
    if (this._footer) {
      // Remove footer temporarily if it was added
      const footerIndex = this.children.indexOf(this._footer);
      if (footerIndex >= 0) {
        // Remove and re-add after new content
        this.children.splice(footerIndex, 1);
      }
      
      // Add the content
      super.addElement(element);
      
      // Re-add footer at the end
      super.addElement(this._footer);
    } else {
      // No footer, just add normally
      super.addElement(element);
    }
  }

  render(): string {
    // If we have a footer but haven't added it yet, add it now
    if (this._footer && !this.children.includes(this._footer)) {
      super.addElement(this._footer);
    }

    const bgAttrs = styleToSVGAttributes(this.style);
    const borderBox = this.borderBox.topLeft;
    const size = this.getBoxSize("border");
    
    // Add border radius
    const radius = defaultTheme.borders.radius.sm;
    const radiusAttr = radius > 0 ? `rx="${radius}" ry="${radius}"` : "";
    
    const bgRect = `  <rect x="${borderBox.x}" y="${borderBox.y}" width="${size.width}" height="${size.height}" ${radiusAttr} ${bgAttrs}/>\n`;
    
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");
    
    return `<g>
${bgRect}  ${childrenHTML}
</g>`;
  }
}
