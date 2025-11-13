/**
 * Text module - Text and TextArea implementation.
 *
 * Provides text primitives with typography support including word wrapping,
 * alignment, and comprehensive styling options.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Text alignment options.
 */
export type TextAlign = "left" | "center" | "right";

/**
 * Vertical alignment options for text.
 */
export type TextVerticalAlign = "top" | "middle" | "bottom";

/**
 * Configuration for creating a Text element.
 *
 * Supports comprehensive typography options that are easy for LLMs to work with.
 * Visual styling is handled through the style property using CSS/SVG properties.
 */
export interface TextConfig {
  /**
   * The text content to display.
   * Can include newlines for multi-line text.
   */
  content: string;

  /**
   * Maximum width for text wrapping (supports units like "300px", "20rem", or numbers).
   * If not specified, text will not wrap.
   */
  maxWidth?: string | number;

  /**
   * Font size (supports units like "16px", "1rem", or numbers).
   * @defaultValue "16px"
   */
  fontSize?: string | number;

  /**
   * Font family (CSS font-family value).
   * @defaultValue "sans-serif"
   */
  fontFamily?: string;

  /**
   * Font weight (CSS font-weight value).
   * @defaultValue "normal"
   */
  fontWeight?: string | number;

  /**
   * Horizontal text alignment.
   * @defaultValue "left"
   */
  textAlign?: TextAlign;

  /**
   * Vertical text alignment.
   * @defaultValue "top"
   */
  verticalAlign?: TextVerticalAlign;

  /**
   * Line height multiplier (relative to font size).
   * @defaultValue 1.2
   */
  lineHeight?: number;

  /**
   * Letter spacing (supports units like "0.5px", "0.05em", or numbers).
   * @defaultValue 0
   */
  letterSpacing?: string | number;

  /**
   * Visual styling properties (fill, stroke, opacity, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @example
   * ```typescript
   * {
   *   fill: "#2c3e50",
   *   stroke: "#ecf0f1",
   *   strokeWidth: "0.5px",
   *   opacity: 0.9
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Text shape with word wrapping and comprehensive typography support.
 *
 * The Text class provides a high-level interface for creating and
 * manipulating text elements. It automatically handles word wrapping,
 * line breaks, and provides flexible alignment options.
 *
 * @remarks
 * This implementation uses SVG `<text>` and `<tspan>` elements to render text.
 * Word wrapping is calculated based on character count estimates since SVG
 * doesn't have native text wrapping. For precise wrapping, font metrics
 * would be needed (future enhancement).
 *
 * @example
 * Create simple text
 * ```typescript
 * const text = new Text({
 *   content: "Hello, World!",
 *   fontSize: "24px",
 *   fontFamily: "Arial",
 *   fill: "#2c3e50"
 * });
 * ```
 *
 * @example
 * Create text with word wrapping
 * ```typescript
 * const paragraph = new Text({
 *   content: "This is a long paragraph that will wrap to multiple lines.",
 *   maxWidth: "300px",
 *   fontSize: "16px",
 *   lineHeight: 1.5,
 *   textAlign: "left"
 * });
 * ```
 *
 * @example
 * Create multi-line text with custom styling
 * ```typescript
 * const title = new Text({
 *   content: "Main Title\nSubtitle",
 *   fontSize: "32px",
 *   fontWeight: "bold",
 *   textAlign: "center",
 *   fill: "#3498db",
 *   stroke: "#2980b9",
 *   strokeWidth: "1px"
 * });
 * ```
 */
export class Text extends Shape {
  private config: TextConfig;
  private _fontSize: number;
  private _maxWidth: number | null;
  private _lineHeight: number;
  private _lines: string[];

  /**
   * Creates a new Text instance.
   *
   * @param config - Configuration for the text element
   */
  constructor(config: TextConfig) {
    super();
    this.config = config;

    this._fontSize = parseUnit(config.fontSize || "16px");
    this._maxWidth = config.maxWidth ? parseUnit(config.maxWidth) : null;
    this._lineHeight = config.lineHeight || 1.2;

    this._lines = this.calculateLines();
  }

  /**
   * Calculates the lines of text based on content and wrapping constraints.
   *
   * @returns Array of text lines
   * @internal
   */
  private calculateLines(): string[] {
    const content = this.config.content || "";

    // Split by explicit line breaks first
    const explicitLines = content.split("\n");

    // If no max width, return explicit lines as-is
    if (!this._maxWidth) {
      return explicitLines;
    }

    // Perform word wrapping
    const wrappedLines: string[] = [];

    for (const line of explicitLines) {
      if (line.trim() === "") {
        wrappedLines.push("");
        continue;
      }

      // Estimate characters per line based on average character width
      // This is a rough approximation; precise wrapping requires font metrics
      const avgCharWidth = this._fontSize * 0.5; // Rough estimate
      const maxCharsPerLine = Math.floor(this._maxWidth / avgCharWidth);

      if (line.length <= maxCharsPerLine) {
        wrappedLines.push(line);
        continue;
      }

      // Word wrapping
      const words = line.split(/\s+/);
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;

        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            wrappedLines.push(currentLine);
          }
          // If single word is too long, just add it anyway
          currentLine = word;
        }
      }

      if (currentLine) {
        wrappedLines.push(currentLine);
      }
    }

    return wrappedLines;
  }

  /**
   * Gets the font size in pixels.
   *
   * @returns The font size value
   */
  get fontSize(): number {
    return this._fontSize;
  }

  /**
   * Gets the line height in pixels.
   *
   * @returns The line height value (fontSize * lineHeight multiplier)
   */
  get lineHeight(): number {
    return this._fontSize * this._lineHeight;
  }

  /**
   * Gets the number of lines in the text.
   *
   * @returns The number of lines
   */
  get lineCount(): number {
    return this._lines.length;
  }

  /**
   * Gets the total height of the text block in pixels.
   *
   * @returns The height of all lines combined
   */
  get textHeight(): number {
    return this._lines.length * this.lineHeight;
  }

  /**
   * Gets the estimated width of the text block in pixels.
   *
   * This is a rough approximation based on average character width.
   * For precise measurements, font metrics would be needed.
   *
   * @returns The estimated width
   */
  get textWidth(): number {
    if (this._maxWidth) {
      return this._maxWidth;
    }

    // Estimate width based on longest line
    const longestLine = this._lines.reduce(
      (max, line) => (line.length > max.length ? line : max),
      ""
    );
    const avgCharWidth = this._fontSize * 0.5;
    return longestLine.length * avgCharWidth;
  }

  /**
   * Gets the geometric center of the text block.
   *
   * @returns The center point of the text
   */
  get center(): Point {
    return {
      x: `${this.currentPosition.x + this.textWidth / 2}px`,
      y: `${this.currentPosition.y + this.textHeight / 2}px`,
    };
  }

  /**
   * Standard reference points for positioning.
   */

  get topLeft(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  get topCenter(): Point {
    return {
      x: `${this.currentPosition.x + this.textWidth / 2}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  get topRight(): Point {
    return {
      x: `${this.currentPosition.x + this.textWidth}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  get leftCenter(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this.textHeight / 2}px`,
    };
  }

  get rightCenter(): Point {
    return {
      x: `${this.currentPosition.x + this.textWidth}px`,
      y: `${this.currentPosition.y + this.textHeight / 2}px`,
    };
  }

  get bottomLeft(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this.textHeight}px`,
    };
  }

  get bottomCenter(): Point {
    return {
      x: `${this.currentPosition.x + this.textWidth / 2}px`,
      y: `${this.currentPosition.y + this.textHeight}px`,
    };
  }

  get bottomRight(): Point {
    return {
      x: `${this.currentPosition.x + this.textWidth}px`,
      y: `${this.currentPosition.y + this.textHeight}px`,
    };
  }

  /**
   * Gets the bounding box of the text.
   *
   * @returns Object with bounding box properties
   */
  get boundingBox(): {
    topLeft: Point;
    bottomRight: Point;
    width: number;
    height: number;
  } {
    return {
      topLeft: this.topLeft,
      bottomRight: this.bottomRight,
      width: this.textWidth,
      height: this.textHeight,
    };
  }

  /**
   * Updates the text content and recalculates lines.
   *
   * @param newContent - The new text content
   *
   * @example
   * Update text dynamically
   * ```typescript
   * const text = new Text({ content: "Original text", fontSize: "16px" });
   * text.updateContent("New text content");
   * ```
   */
  updateContent(newContent: string): void {
    this.config.content = newContent;
    this._lines = this.calculateLines();
  }

  /**
   * Renders the text to SVG.
   *
   * @returns SVG text element representing the text
   */
  render(): string {
    const x = this.currentPosition.x;
    const y = this.currentPosition.y;

    const fontSize = this._fontSize;
    const fontFamily = this.config.fontFamily || "sans-serif";
    const fontWeight = this.config.fontWeight || "normal";
    const textAlign = this.config.textAlign || "left";
    const letterSpacing = this.config.letterSpacing
      ? parseUnit(this.config.letterSpacing)
      : 0;

    // Default style if none provided
    const defaultStyle: Partial<Style> = {
      fill: "#000000",
      stroke: "none",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const styleAttrs = styleToSVGAttributes(style);

    // Calculate text anchor based on alignment
    let textAnchor: "start" | "middle" | "end" = "start";
    let xOffset = 0;

    if (textAlign === "center") {
      textAnchor = "middle";
      xOffset = this.textWidth / 2;
    } else if (textAlign === "right") {
      textAnchor = "end";
      xOffset = this.textWidth;
    }

    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    // Build SVG text element with tspan for each line
    let svgText = `<text x="${x + xOffset}" y="${y + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" text-anchor="${textAnchor}" letter-spacing="${letterSpacing}" ${styleAttrs}${transform}>`;

    this._lines.forEach((line, index) => {
      const dy = index === 0 ? 0 : this.lineHeight;
      svgText += `<tspan x="${x + xOffset}" dy="${dy}">${this.escapeXml(line)}</tspan>`;
    });

    svgText += "</text>";

    return svgText;
  }

  /**
   * Escapes XML special characters in text content.
   *
   * @param text - The text to escape
   * @returns The escaped text
   * @internal
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

