/**
 * Text module - Text and TextArea implementation.
 *
 * Provides text primitives with typography support including word wrapping,
 * alignment, and comprehensive styling options.
 *
 * @module elements
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
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Padding around the content (CSS-like spacing).
   * Supports uniform values or individual sides.
   * @defaultValue 0
   */
  padding?: import("../core/Bounded.js").Spacing;

  /**
   * Margin around the element (CSS-like spacing).
   * Supports uniform values or individual sides.
   * @defaultValue 0
   */
  margin?: import("../core/Bounded.js").Spacing;

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

  /**
   * Show visual debug guides for alignment points.
   * Useful for debugging text positioning issues.
   * @defaultValue false
   */
  debug?: boolean;
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
/**
 * Bounding box for a word or text element.
 */
export interface WordBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Result of a pattern match in text.
 */
export interface TextMatch {
  /** The matched text content */
  match: string;
  /** Bounding box of the match */
  bbox: WordBoundingBox;
  /** Index of the word containing this match */
  wordIndex: number;
  /** Character offset within the full text */
  charOffset: number;
}

export class Text extends Shape {
  private config: TextConfig;
  private _fontSize: number;
  private _maxWidth: number | null;
  private _lineHeight: number;
  private _lines: string[];

  /**
   * Function to get the measurement container from the parent artboard.
   * Set by artboard when element is added.
   * @internal
   */
  private _measurementContainerGetter?: () => SVGElement;

  /**
   * Cached measured dimensions from browser.
   * Populated lazily when positions are queried.
   * @internal
   */
  private _measuredDimensions?: {
    words: Array<WordBoundingBox>;
    totalWidth: number;
    totalHeight: number;
  };

  /**
   * Creates a new Text instance.
   *
   * @param config - Configuration for the text element
   */
  constructor(config: TextConfig) {
    super(config.name);
    this.config = config;

    this._fontSize = parseUnit(config.fontSize || "16px");
    this._maxWidth = config.maxWidth ? parseUnit(config.maxWidth) : null;
    this._lineHeight = config.lineHeight || 1.2;

    this._lines = this.calculateLines();

    // Set padding and margin if provided
    if (config.padding !== undefined) {
      this.padding = config.padding;
    }
    if (config.margin !== undefined) {
      this.margin = config.margin;
    }
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
   * Sets the measurement container getter.
   * Called by Artboard when this text element is added.
   *
   * @param getter - Function that returns the measurement SVG container
   * @internal
   */
  setMeasurementContainer(getter: () => SVGElement): void {
    this._measurementContainerGetter = getter;
  }

  /**
   * Perform measurement of text dimensions.
   * Overrides Element.performMeasurement().
   *
   * @internal
   */
  protected performMeasurement(): void {
    // Already have cached dimensions?
    if (this._measuredDimensions) {
      return;
    }

    // No DOM access available? Will use estimate-based dimensions
    if (!this._measurementContainerGetter || typeof document === "undefined") {
      return;
    }

    try {
      // Get the hidden measurement container
      const container = this._measurementContainerGetter();

      // Create temporary group to hold our text
      const tempGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      tempGroup.innerHTML = this.renderTextElement();
      container.appendChild(tempGroup);

      // Measure actual dimensions
      const textElement = tempGroup.querySelector("text");
      if (textElement) {
        const bbox = textElement.getBBox();

        // Use getComputedTextLength() for more accurate width measurement
        // This is especially important for special glyphs (arrows, emoji, etc.)
        // that may render wider than their logical bounding box
        let totalWidth = bbox.width;
        try {
          const computedLength = (
            textElement as SVGTextElement
          ).getComputedTextLength();
          // Use the maximum of both measurements to ensure we don't clip content
          totalWidth = Math.max(bbox.width, computedLength);
        } catch (e) {
          // Fall back to bbox.width if getComputedTextLength fails
        }

        // For height, also check getBoundingClientRect for actual rendered pixels
        let totalHeight = bbox.height;
        try {
          const clientRect = textElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          // Convert client rect to SVG coordinates (rough approximation)
          // Take max to avoid clipping
          if (clientRect.height > 0) {
            totalHeight = Math.max(bbox.height, clientRect.height);
          }
        } catch (e) {
          // Fall back to bbox.height
        }

        // Measure each word (each tspan has an ID)
        const wordBBoxes: Array<WordBoundingBox> = [];
        const tspans = textElement.querySelectorAll("tspan[data-word-index]");
        tspans.forEach((tspan) => {
          const wordBBox = (tspan as SVGTSpanElement).getBBox();
          wordBBoxes.push({
            x: wordBBox.x,
            y: wordBBox.y,
            width: wordBBox.width,
            height: wordBBox.height,
          });
        });

        this._measuredDimensions = {
          words: wordBBoxes,
          totalWidth: totalWidth,
          totalHeight: totalHeight,
        };
      }

      // Clean up temporary element
      container.removeChild(tempGroup);
    } catch (error) {
      // If measurement fails, fall back to estimates
      console.warn("Text measurement failed, using estimates:", error);
    }
  }

  /**
   * Ensures this text has been measured with actual browser metrics.
   * Backward compatibility wrapper - calls measure().
   *
   * @internal
   * @deprecated Use measure() instead
   */
  private ensureMeasured(): void {
    this.measure();
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
   * Uses accurate browser measurements when available, estimates otherwise.
   *
   * @returns The height of all lines combined
   */
  get textHeight(): number {
    // Try to get accurate measurement
    this.ensureMeasured();

    if (this._measuredDimensions) {
      return this._measuredDimensions.totalHeight;
    }

    // Fallback to estimate
    return this._lines.length * this.lineHeight;
  }

  /**
   * Gets the width of the text block in pixels.
   * Uses accurate browser measurements when available, estimates otherwise.
   *
   * @returns The text width
   */
  get textWidth(): number {
    // Try to get accurate measurement
    this.ensureMeasured();

    if (this._measuredDimensions) {
      return this._measuredDimensions.totalWidth;
    }

    // Fallback to estimate
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
   * Gets the width of the text block (alias for textWidth).
   * Provided for compatibility with layout systems that expect width/height properties.
   *
   * @returns The text width
   */
  get width(): number {
    return this.textWidth;
  }

  /**
   * Gets the height of the text block (alias for textHeight).
   * Provided for compatibility with layout systems that expect width/height properties.
   *
   * @returns The text height
   */
  get height(): number {
    return this.textHeight;
  }

  /**
   * Gets the geometric center of the text block.
   *
   * @returns The center point of the text
   */
  get center(): Point {
    const absPos = this.getAbsolutePosition();
    return {
      x: `${absPos.x + this.textWidth / 2}px`,
      y: `${absPos.y + this.textHeight / 2}px`,
    };
  }

  /**
   * Standard reference points for positioning.
   */

  get topLeft(): Point {
    const absPos = this.getAbsolutePosition();
    // Don't use bound points - they cache stale coordinates
    const point = { x: `${absPos.x}px`, y: `${absPos.y}px` };
    if (this.config.debug) {
      console.log(
        `[Text "${this.config.content?.substring(0, 20)}..."] GET topLeft: ${point.x}, ${point.y} | absPos: (${absPos.x}, ${absPos.y}) | currentPos: (${this.currentPosition.x}, ${this.currentPosition.y})`
      );
    }
    return point;
  }

  get topCenter(): Point {
    const absPos = this.getAbsolutePosition();
    return { x: `${absPos.x + this.textWidth / 2}px`, y: `${absPos.y}px` };
  }

  get topRight(): Point {
    const absPos = this.getAbsolutePosition();
    return { x: `${absPos.x + this.textWidth}px`, y: `${absPos.y}px` };
  }

  get leftCenter(): Point {
    const absPos = this.getAbsolutePosition();
    // Don't use bound points - they cache stale coordinates
    const point = {
      x: `${absPos.x}px`,
      y: `${absPos.y + this.textHeight / 2}px`,
    };
    if (this.config.debug) {
      console.log(
        `[Text "${this.config.content?.substring(0, 20)}..."] GET leftCenter: ${point.x}, ${point.y} | absPos: (${absPos.x}, ${absPos.y}) | textHeight/2: ${this.textHeight / 2}`
      );
    }
    return point;
  }

  get rightCenter(): Point {
    const absPos = this.getAbsolutePosition();
    return {
      x: `${absPos.x + this.textWidth}px`,
      y: `${absPos.y + this.textHeight / 2}px`,
    };
  }

  get bottomLeft(): Point {
    const absPos = this.getAbsolutePosition();
    return { x: `${absPos.x}px`, y: `${absPos.y + this.textHeight}px` };
  }

  get bottomCenter(): Point {
    const absPos = this.getAbsolutePosition();
    return {
      x: `${absPos.x + this.textWidth / 2}px`,
      y: `${absPos.y + this.textHeight}px`,
    };
  }

  get bottomRight(): Point {
    const absPos = this.getAbsolutePosition();
    return {
      x: `${absPos.x + this.textWidth}px`,
      y: `${absPos.y + this.textHeight}px`,
    };
  }

  /**
   * Convenient alias for topCenter.
   */
  get top(): Point {
    return this.topCenter;
  }

  /**
   * Convenient alias for bottomCenter.
   */
  get bottom(): Point {
    return this.bottomCenter;
  }

  /**
   * Convenient alias for leftCenter.
   */
  get left(): Point {
    return this.leftCenter;
  }

  /**
   * Convenient alias for rightCenter.
   */
  get right(): Point {
    return this.rightCenter;
  }

  /**
   * Gets the alignment point based on horizontal and vertical alignment.
   * Used by layout systems to position text elements correctly.
   *
   * @param horizontalAlign - Horizontal alignment (left, center, right)
   * @param verticalAlign - Vertical alignment (top, center, bottom)
   * @returns The point corresponding to the specified alignment
   */
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    // Map alignment to the correct reference point
    if (horizontalAlign === "left") {
      if (verticalAlign === "top") return this.topLeft;
      if (verticalAlign === "bottom") return this.bottomLeft;
      return this.leftCenter; // center
    } else if (horizontalAlign === "right") {
      if (verticalAlign === "top") return this.topRight;
      if (verticalAlign === "bottom") return this.bottomRight;
      return this.rightCenter; // center
    } else {
      // horizontalAlign === "center"
      if (verticalAlign === "top") return this.topCenter;
      if (verticalAlign === "bottom") return this.bottomCenter;
      return this.center; // center-center
    }
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
   * Gets all words in the text as an array.
   * Splits text by whitespace across all lines.
   *
   * @returns Array of words
   *
   * @example
   * Get all words
   * ```typescript
   * const text = new Text({ content: "Hello World\nFoo Bar" });
   * const words = text.getWords(); // ["Hello", "World", "Foo", "Bar"]
   * ```
   */
  getWords(): string[] {
    const allWords: string[] = [];
    for (const line of this._lines) {
      const words = line.split(/\s+/).filter((w) => w.length > 0);
      allWords.push(...words);
    }
    return allWords;
  }

  /**
   * Gets the accurate bounding box for a specific word.
   * Requires browser environment for measurement.
   *
   * @param wordIndex - Index of the word (0-based, across all lines)
   * @returns Bounding box of the word, or null if not available
   *
   * @example
   * Get bounding box for the first word
   * ```typescript
   * const text = new Text({ content: "Hello World" });
   * const bbox = text.getWordBoundingBox(0); // Bounding box for "Hello"
   * ```
   */
  getWordBoundingBox(wordIndex: number): WordBoundingBox | null {
    this.ensureMeasured();

    if (this._measuredDimensions && this._measuredDimensions.words[wordIndex]) {
      return this._measuredDimensions.words[wordIndex];
    }

    return null;
  }

  /**
   * Gets the center point of a specific word.
   * Useful for positioning elements relative to individual words.
   *
   * @param wordIndex - Index of the word (0-based)
   * @returns Center point of the word, or null if not available
   *
   * @example
   * Position a circle at the center of a word
   * ```typescript
   * const text = new Text({ content: "Hello World" });
   * const wordCenter = text.getWordCenter(0);
   * if (wordCenter) {
   *   circle.position({
   *     relativeFrom: circle.center,
   *     relativeTo: wordCenter,
   *     x: "0px",
   *     y: "0px"
   *   });
   * }
   * ```
   */
  getWordCenter(wordIndex: number): Point | null {
    const bbox = this.getWordBoundingBox(wordIndex);
    if (!bbox) {
      return null;
    }

    return {
      x: `${bbox.x + bbox.width / 2}px`,
      y: `${bbox.y + bbox.height / 2}px`,
    };
  }

  /**
   * Finds all occurrences of a pattern in the text and returns their bounding boxes.
   *
   * @param pattern - String or RegExp pattern to search for
   * @returns Array of matches with their bounding boxes
   *
   * @example
   * Find and highlight specific words
   * ```typescript
   * const text = new Text({ content: "The quick brown fox jumps over the lazy dog" });
   * const matches = text.findMatches(/fox|dog/);
   * matches.forEach(match => {
   *   console.log(`Found "${match.match}" at word index ${match.wordIndex}`);
   *   // Use match.bbox to create highlights
   * });
   * ```
   *
   * @example
   * Case-insensitive search
   * ```typescript
   * const matches = text.findMatches(/ENERGY/i);
   * ```
   */
  findMatches(pattern: string | RegExp): TextMatch[] {
    this.ensureMeasured();

    const content = this.config.content || "";
    const regex =
      typeof pattern === "string"
        ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
        : new RegExp(
            pattern.source,
            pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"
          );

    const matches: TextMatch[] = [];
    let match: RegExpExecArray | null;

    // Build a map of character offset to word index
    const words = this._lines.join(" ").split(/\s+/);
    const charToWordMap: number[] = [];
    let currentOffset = 0;

    words.forEach((word, wordIndex) => {
      for (let i = 0; i < word.length; i++) {
        charToWordMap[currentOffset + i] = wordIndex;
      }
      currentOffset += word.length + 1; // +1 for space
    });

    // Find all matches
    while ((match = regex.exec(content)) !== null) {
      const matchText = match[0];
      const charOffset = match.index;

      // Find which word this match belongs to
      let wordIndex = charToWordMap[charOffset];
      if (wordIndex === undefined) {
        // Match might be in whitespace or at boundary, find nearest word
        for (let i = charOffset; i >= 0; i--) {
          if (charToWordMap[i] !== undefined) {
            wordIndex = charToWordMap[i];
            break;
          }
        }
      }

      // Get bounding box for the word containing this match
      const bbox = this.getWordBoundingBox(wordIndex);
      if (bbox) {
        matches.push({
          match: matchText,
          bbox,
          wordIndex,
          charOffset,
        });
      }
    }

    return matches;
  }

  /**
   * Updates the text content and recalculates lines.
   * Clears cached measurements to force re-measurement on next access.
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
    // Clear cached measurements since content changed
    this._measuredDimensions = undefined;
  }

  /**
   * Generates the SVG text element with word-level detail for measurements.
   * Each word gets a data-word-index attribute for accurate bounding box queries.
   *
   * @returns SVG text element string
   * @internal
   */
  private renderTextElement(): string {
    // Use absolute position for rendering to account for parent hierarchy
    const absPos = this.getAbsolutePosition();
    const x = absPos.x;
    const y = absPos.y;

    if (this.config.debug) {
      console.log(
        `[Text "${this.config.content?.substring(0, 20)}..."] RENDER at absPos (${x}, ${y}), SVG baseline y=${y + this._fontSize}, dimensions: ${this.textWidth}x${this.textHeight}`
      );
    }

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

    // Build SVG text element with tspan for each word
    let svgText = `<text x="${x + xOffset}" y="${y + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" text-anchor="${textAnchor}" letter-spacing="${letterSpacing}" ${styleAttrs}${transform}>`;

    let wordIndex = 0;
    this._lines.forEach((line, lineIndex) => {
      const dy = lineIndex === 0 ? 0 : this.lineHeight;

      // Split line into words for individual measurement
      const words = line.split(/(\s+)/); // Keep whitespace in array

      if (words.length === 0 || (words.length === 1 && words[0] === "")) {
        // Empty line
        svgText += `<tspan x="${x + xOffset}" dy="${dy}"></tspan>`;
      } else {
        // First word/space in the line needs dy attribute
        let isFirstInLine = true;

        for (const part of words) {
          if (part.match(/^\s+$/)) {
            // Whitespace - render as-is without word index
            svgText += this.escapeXml(part);
          } else if (part.length > 0) {
            // Actual word - give it an index for measurement
            const dyAttr = isFirstInLine ? ` dy="${dy}"` : "";
            const xAttr = isFirstInLine ? ` x="${x + xOffset}"` : "";
            svgText += `<tspan${xAttr}${dyAttr} data-word-index="${wordIndex}">${this.escapeXml(part)}</tspan>`;
            wordIndex++;
            isFirstInLine = false;
          }
        }
      }
    });

    svgText += "</text>";
    return svgText;
  }

  render(): string {
    const comment = this.getSVGComment();
    let svg = comment + this.renderTextElement();
    if (this.config.debug) {
      svg += this.generateDebugMarkers();
    }
    return svg;
  }

  private generateDebugMarkers(): string {
    const markers = [];
    const absPos = this.getAbsolutePosition();

    // Log all alignment points during render
    console.log(
      `[Text "${this.config.content?.substring(0, 20)}..."] DEBUG MARKERS:`
    );
    console.log(`  absPos: (${absPos.x}, ${absPos.y})`);
    console.log(`  dimensions: ${this.textWidth} x ${this.textHeight}`);

    // Get all 9 alignment points
    const points = {
      topLeft: this.topLeft,
      topCenter: this.topCenter,
      topRight: this.topRight,
      leftCenter: this.leftCenter,
      center: this.center,
      rightCenter: this.rightCenter,
      bottomLeft: this.bottomLeft,
      bottomCenter: this.bottomCenter,
      bottomRight: this.bottomRight,
    };

    // Draw a small circle at each alignment point with different colors
    const colors: Record<string, string> = {
      topLeft: "#ff0000", // red
      topCenter: "#ff8800", // orange
      topRight: "#ffff00", // yellow
      leftCenter: "#00ff00", // green
      center: "#00ffff", // cyan
      rightCenter: "#0088ff", // light blue
      bottomLeft: "#0000ff", // blue
      bottomCenter: "#8800ff", // purple
      bottomRight: "#ff00ff", // magenta
    };

    for (const [name, point] of Object.entries(points)) {
      const px = parseFloat(String(point.x));
      const py = parseFloat(String(point.y));
      const color = colors[name] || "#ff0000";

      console.log(`  ${name}: (${px}, ${py})`);

      // Draw circle marker
      markers.push(
        `<circle cx="${px}" cy="${py}" r="3" fill="${color}" stroke="#000" stroke-width="0.5" opacity="0.8"/>`
      );

      // Add label if there's space
      markers.push(
        `<text x="${px + 5}" y="${py - 5}" font-family="monospace" font-size="8" fill="${color}" opacity="0.8">${name}</text>`
      );
    }

    // Draw bounding box
    markers.push(
      `<rect x="${absPos.x}" y="${absPos.y}" width="${this.textWidth}" height="${this.textHeight}" ` +
        `fill="none" stroke="#ff00ff" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>`
    );

    return markers.join("\n");
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
