/**
 * FlowBox component for flowcharts.
 * 
 * A styled container designed for flowchart nodes, with support for:
 * - Theme-based styling with tints
 * - Anchor points for connecting to other boxes
 * - Text content
 * - Double borders for Swiss design aesthetic
 */

import { Rectangle } from "../core/Rectangle.js";
import { Text, type TextConfig } from "../elements/Text.js";
import { type Style } from "../core/Stylable.js";
import { type Theme, defaultTheme } from "../core/Theme.js";
import { type BoxModel, parseBoxModel } from "../utils/BoxModel.js";
import { Element, type Position } from "../core/Element.js";

export interface FlowBoxConfig {
  /**
   * Width of the box in pixels.
   */
  width: number;

  /**
   * Height of the box in pixels.
   */
  height: number;

  /**
   * Text content to display in the box.
   */
  text?: string;

  /**
   * Theme to use for styling. If not provided, uses default theme.
   */
  theme?: Theme;

  /**
   * Tint to apply to the box (modifies the theme colors).
   * Can be 'default', 'accent', 'muted', or a custom color string.
   * @defaultValue 'default'
   */
  tint?: "default" | "accent" | "muted" | string;

  /**
   * Whether to use double border style (Swiss design).
   * @defaultValue true
   */
  doubleBorder?: boolean;

  /**
   * Custom style overrides.
   */
  style?: Partial<Style>;

  /**
   * Box model for padding and borders.
   */
  boxModel?: BoxModel;
}

/**
 * FlowBox component for creating flowchart nodes.
 * 
 * FlowBox is a themed container designed specifically for flowcharts.
 * It supports:
 * - Automatic theme-based styling
 * - Color tints for categorization
 * - Double borders for Swiss design aesthetic
 * - Rich anchor points for connecting to other boxes
 * - Text content with automatic centering
 * 
 * @example
 * Basic flowbox
 * ```typescript
 * const box = new FlowBox({
 *   width: 120,
 *   height: 60,
 *   text: "Start"
 * });
 * ```
 * 
 * @example
 * Accented flowbox
 * ```typescript
 * const box = new FlowBox({
 *   width: 120,
 *   height: 60,
 *   text: "Process",
 *   tint: "accent"
 * });
 * ```
 */
export class FlowBox extends Rectangle {
  private textElement?: Text;
  private _theme: Theme;
  private _tint: string;
  private _doubleBorder: boolean;

  constructor(config: FlowBoxConfig) {
    const theme = config.theme ?? defaultTheme;
    const tint = config.tint ?? "default";
    const doubleBorder = config.doubleBorder ?? true;

    // Create box model with default padding if not specified
    const boxModel = config.boxModel ?? parseBoxModel({
      padding: theme.spacing.small,
      border: 0, // We'll handle borders differently for double border effect
    });

    // Determine style based on theme and tint
    const boxStyle = FlowBox.createBoxStyle(theme, tint, doubleBorder, config.style);

    super(config.width, config.height, boxModel, boxStyle);

    this._theme = theme;
    this._tint = tint;
    this._doubleBorder = doubleBorder;

    // Add text if provided
    if (config.text) {
      const textStyle: Partial<Style> = {
        ...theme.presets.text,
        fill: theme.colors.foreground,
      };

      this.textElement = new Text({
        content: config.text,
        style: textStyle,
      });

      // Position text at center of box
      this.addElement(this.textElement);
      this.textElement.position({
        relativeFrom: this.textElement.center,
        relativeTo: this.contentBox.center,
        x: 0,
        y: 0,
        boxReference: "contentBox",
      });
    }
  }

  /**
   * Create style for the box based on theme and tint.
   */
  private static createBoxStyle(
    theme: Theme,
    tint: string,
    doubleBorder: boolean,
    customStyle?: Partial<Style>
  ): Partial<Style> {
    let fillColor = theme.colors.background;
    let strokeColor = theme.colors.border;

    // Apply tint
    if (tint === "accent") {
      fillColor = theme.presets.accent.fill as string || fillColor;
      strokeColor = theme.presets.accent.stroke as string || strokeColor;
    } else if (tint === "muted") {
      fillColor = "#F5F5F5";
      strokeColor = theme.colors.muted;
    } else if (tint !== "default") {
      // Custom color
      fillColor = tint;
    }

    const baseStyle: Partial<Style> = {
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: theme.borders.width.toString(),
    };

    return { ...baseStyle, ...customStyle };
  }

  /**
   * Update the text content of the box.
   */
  setText(text: string): void {
    if (this.textElement) {
      // Update existing text
      (this.textElement as any)._text = text;
    } else {
      // Create new text element
      const textStyle: Partial<Style> = {
        ...this._theme.presets.text,
        fill: this._theme.colors.foreground,
      };

      this.textElement = new Text({
        content: text,
        style: textStyle,
      });

      this.addElement(this.textElement);
      this.textElement.position({
        relativeFrom: this.textElement.center,
        relativeTo: this.contentBox.center,
        x: 0,
        y: 0,
        boxReference: "contentBox",
      });
    }
  }

  /**
   * Get the text content of the box.
   */
  getText(): string | undefined {
    return this.textElement ? (this.textElement as any)._text : undefined;
  }

  /**
   * Get anchor points for connecting to other boxes.
   * Returns named anchor points at the cardinal directions and corners.
   */
  get anchors(): {
    top: Position;
    right: Position;
    bottom: Position;
    left: Position;
    topLeft: Position;
    topRight: Position;
    bottomLeft: Position;
    bottomRight: Position;
    center: Position;
  } {
    return {
      top: this.borderBox.centerTop,
      right: this.borderBox.centerRight,
      bottom: this.borderBox.centerBottom,
      left: this.borderBox.centerLeft,
      topLeft: this.borderBox.topLeft,
      topRight: this.borderBox.topRight,
      bottomLeft: this.borderBox.bottomLeft,
      bottomRight: this.borderBox.bottomRight,
      center: this.borderBox.center,
    };
  }

  /**
   * Render the FlowBox.
   * If double border is enabled, renders two nested rectangles.
   */
  render(): string {
    // Render base rectangle manually since we need custom rendering
    const bgRect = `<rect x="${this.borderBox.topLeft.x}" y="${this.borderBox.topLeft.y}" width="${this.width}" height="${this.height}" fill="${this._style.fill || 'white'}" stroke="${this._style.stroke || 'black'}" stroke-width="${this._style.strokeWidth || 1}" />`;

    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");

    // If double border is enabled, add an inner border
    if (this._doubleBorder) {
      const innerOffset = this._theme.spacing.small * 0.5;
      const innerX = this.borderBox.topLeft.x + innerOffset;
      const innerY = this.borderBox.topLeft.y + innerOffset;
      const innerWidth = this.width - innerOffset * 2;
      const innerHeight = this.height - innerOffset * 2;

      const innerBorder = `<rect x="${innerX}" y="${innerY}" width="${innerWidth}" height="${innerHeight}" fill="none" stroke="${this._theme.colors.border}" stroke-width="${this._theme.borders.width * 0.75}" />`;

      return `<g>
  ${bgRect}
  ${innerBorder}
  ${childrenHTML}
</g>`;
    }

    return `<g>
  ${bgRect}
  ${childrenHTML}
</g>`;
  }
}

