/**
 * TextArea - A text component that wraps text within a specified width
 *
 * Unlike Text which renders as a single line, TextArea breaks text into multiple
 * lines to fit within the specified width. Uses Text components internally for
 * proper LaTeX rendering and measurement.
 */

import { Rectangle } from "../core/Rectangle.js";
import { Text } from "./Text.js";
import { Line } from "./Line.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { parseUnit } from "../core/units.js";
import { type BoxModel } from "../utils/BoxModel.js";

/**
 * Represents a highlighted word element.
 */
export interface HighlightedWord {
  /** The ID of the highlighted word */
  id: string;
  /** Bounding box in absolute coordinates */
  bbox: { x: number; y: number; width: number; height: number };
  /** The word content */
  content: string;
  /** The Text instance containing this word */
  textInstance: Text;

  // Reference points for positioning (absolute world coordinates)
  readonly center: { x: number; y: number };
  readonly topLeft: { x: number; y: number };
  readonly topCenter: { x: number; y: number };
  readonly topRight: { x: number; y: number };
  readonly leftCenter: { x: number; y: number };
  readonly rightCenter: { x: number; y: number };
  readonly bottomLeft: { x: number; y: number };
  readonly bottomCenter: { x: number; y: number };
  readonly bottomRight: { x: number; y: number };
  readonly top: { x: number; y: number };
  readonly bottom: { x: number; y: number };
  readonly left: { x: number; y: number };
  readonly right: { x: number; y: number };
}

/**
 * Configuration for creating a TextArea element.
 */
export interface TextAreaConfig {
  /**
   * The text content to display. Supports:
   * - Inline LaTeX: $E = mc^2$
   * - Word highlighting: {highlight:id}word{/highlight}
   */
  content: string;

  /**
   * The width of the text area (border box).
   */
  width: number;

  /**
   * Font size (supports units like "16px", "1rem", or numbers).
   * @defaultValue "16px"
   */
  fontSize?: string | number;

  /**
   * Font family for text (CSS font-family value).
   * @defaultValue "sans-serif"
   */
  fontFamily?: string;

  /**
   * Font weight for text (CSS font-weight value).
   * @defaultValue "normal"
   */
  fontWeight?: string | number;

  /**
   * Line height multiplier (relative to font size).
   * Only used if smartLineHeight is false.
   * @defaultValue 1.2
   */
  lineHeight?: number;

  /**
   * Enable smart line height calculation.
   * When true, line height adjusts per line based on content (including tall LaTeX).
   * Elements exceeding maxInlineHeight will be moved to their own line.
   * @defaultValue true
   */
  smartLineHeight?: boolean;

  /**
   * Maximum height multiplier for inline elements (relative to font size).
   * Elements taller than this will be broken to a new line.
   * Only used when smartLineHeight is true.
   * @defaultValue 2.5
   */
  maxInlineHeight?: number;

  /**
   * Text color (CSS color value).
   * @defaultValue "#000000"
   */
  textColor?: string;

  /**
   * Visual styling properties for the background (fill, stroke, opacity, etc.).
   * Use textColor for the text color.
   */
  style?: Partial<Style>;

  /**
   * Box model configuration (padding, margin, border).
   */
  boxModel?: BoxModel;

  /**
   * Enable debug mode to visualize bounding box.
   * @defaultValue false
   */
  debug?: boolean;

  /**
   * Show baseline markers for debugging text alignment.
   * Draws red lines at text baselines to visualize LaTeX alignment.
   * @defaultValue false
   */
  showBaselines?: boolean;
}

/**
 * TextArea element that wraps text within a specified width.
 * Uses Text components internally for proper LaTeX rendering.
 */
export class TextArea extends Rectangle {
  private config: TextAreaConfig;
  private _fontSize: number;
  private _lineHeight: number;
  private _textLines: Text[] = [];
  private _lineContents: string[] = []; // Store line content for highlight annotation
  private _highlightMap: Map<
    string,
    {
      lineIndex: number;
      highlightId: string;
      highlightText: string;
      startInLine: number; // Position within the line (relative to trimmed line content)
      endInLine: number;
    }
  > = new Map();
  private _lineYPositions: number[] = [];
  private _lineHeights: number[] = []; // Actual height of each line (for smart line height)
  private _baselineMarkers: Line[] = []; // Debug: baseline visualization

  constructor(config: TextAreaConfig) {
    const fontSize =
      typeof config.fontSize === "number"
        ? config.fontSize
        : parseUnit(config.fontSize || "16px");

    const lineHeight = config.lineHeight || 1.2;

    // Initialize with width and placeholder height
    super(config.width, fontSize * lineHeight, config.boxModel, config.style);

    this.config = config;
    this._fontSize = fontSize;
    this._lineHeight = lineHeight;

    // Break content into lines and create Text instances
    this.wrapContent();

    // Update height based on actual line heights (sum of all lines)
    const totalTextHeight = this._lineHeights.reduce((sum, h) => sum + h, 0);
    const totalHeight =
      totalTextHeight +
      this._boxModel.padding.top +
      this._boxModel.padding.bottom +
      this._boxModel.border.top +
      this._boxModel.border.bottom;

    this._borderBoxHeight = totalHeight;
  }

  /**
   * Extracts highlight markers and returns clean content with marker positions.
   */
  private extractHighlights(content: string): {
    cleanContent: string;
    highlights: Array<{ id: string; start: number; end: number; text: string }>;
  } {
    // Safety check for undefined content
    if (!content) {
      return { cleanContent: "", highlights: [] };
    }

    const highlights: Array<{
      id: string;
      start: number;
      end: number;
      text: string;
    }> = [];
    let cleanContent = "";
    let offset = 0;

    const regex = /\{highlight:([^}]+)\}(.*?)\{\/highlight\}/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      // Add text before highlight
      cleanContent += content.substring(lastIndex, match.index);

      const id = match[1];
      const text = match[2];
      const start = cleanContent.length;
      cleanContent += text;
      const end = cleanContent.length;

      highlights.push({ id, start, end, text });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    cleanContent += content.substring(lastIndex);

    return { cleanContent, highlights };
  }

  /**
   * Wraps content into multiple lines using Text measurement.
   * With smart line height, also considers element heights.
   */
  private wrapContent(): void {
    const contentWidth = this.contentWidth;
    const contentPos = this.getPositionForBox("content");
    const smartLineHeight = this.config.smartLineHeight !== false; // Default true
    const maxInlineHeight =
      (this.config.maxInlineHeight || 2.5) * this._fontSize;

    // Extract highlights from content
    const { cleanContent, highlights } = this.extractHighlights(
      this.config.content
    );

    // Split content by spaces to get wrappable units
    // But preserve LaTeX formulas as atomic units
    const units: Array<{
      content: string;
      type: "text" | "latex" | "space";
      highlightId?: string;
    }> = [];

    // First pass: extract LaTeX formulas
    const latexRegex = /\$\$[^\$]+\$\$|\$[^\$]+\$/g;
    let lastIndex = 0;
    let match;

    while ((match = latexRegex.exec(cleanContent)) !== null) {
      // Add text before latex
      if (match.index > lastIndex) {
        const textBefore = cleanContent.substring(lastIndex, match.index);
        // Split by spaces
        const words = textBefore.split(/(\s+)/);
        words.forEach((word) => {
          if (word) {
            units.push({
              content: word,
              type: word.trim() ? "text" : "space",
            });
          }
        });
      }

      // Add latex as atomic unit
      units.push({ content: match[0], type: "latex" });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < cleanContent.length) {
      const textAfter = cleanContent.substring(lastIndex);
      const words = textAfter.split(/(\s+)/);
      words.forEach((word) => {
        if (word) {
          units.push({
            content: word,
            type: word.trim() ? "text" : "space",
          });
        }
      });
    }

    // Now wrap into lines by measuring with Text
    // If smartLineHeight is enabled, also check heights
    const lines: string[] = [];
    let currentLine = "";
    let currentLineStart = 0;

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];

      // If smart line height and this is a LaTeX unit, check if it's too tall for inline
      if (smartLineHeight && unit.type === "latex") {
        const tempText = new Text({
          content: unit.content,
          fontSize: this._fontSize,
          fontFamily: this.config.fontFamily,
          fontWeight: this.config.fontWeight,
          lineHeight: this._lineHeight,
        });

        // Add as child to prevent it from being rendered on artboard
        // (TextArea uses this only for measurement)
        this.addElement(tempText);

        const latexHeight = tempText.textHeight;

        // If LaTeX is too tall, put it on its own line
        if (latexHeight > maxInlineHeight) {
          // Push current line if any
          if (currentLine.trim()) {
            lines.push(currentLine);
            currentLine = "";
          }
          // Add LaTeX as its own line
          lines.push(unit.content);
          continue;
        }
      }

      const testLine = currentLine + unit.content;

      // Create a temporary Text to measure
      const tempText = new Text({
        content: testLine,
        fontSize: this._fontSize,
        fontFamily: this.config.fontFamily,
        fontWeight: this.config.fontWeight,
        lineHeight: this._lineHeight,
      });

      // Add as child to prevent it from being rendered on artboard
      // (TextArea uses this only for measurement)
      this.addElement(tempText);

      const measuredWidth = tempText.textWidth;

      if (measuredWidth > contentWidth && currentLine.trim()) {
        // Line too long, break here
        lines.push(currentLine);
        currentLine = unit.type === "space" ? "" : unit.content;
        currentLineStart = cleanContent.indexOf(currentLine, currentLineStart);
      } else {
        currentLine = testLine;
      }
    }

    // Add last line
    if (currentLine.trim()) {
      lines.push(currentLine);
    }

    // Create Text instances for each line (position them later in render)
    // With smart line height, measure actual height of each line (use variable from above)

    this._textLines = [];
    this._lineContents = [];
    this._lineYPositions = [];
    this._lineHeights = [];
    let yOffset = 0;
    let cleanContentSearchStart = 0; // Track where to start searching in cleanContent

    lines.forEach((lineContent, lineIndex) => {
      // Store the TRIMMED line content for later use in highlighting
      // (must match what's actually rendered in the Text instance)
      const trimmedContent = lineContent.trim();
      this._lineContents.push(trimmedContent);
      const textInstance = new Text({
        content: trimmedContent,
        fontSize: this._fontSize,
        fontFamily: this.config.fontFamily,
        fontWeight: this.config.fontWeight,
        lineHeight: this._lineHeight,
        style: { fill: this.config.textColor || "#000000" },
      });

      // Add as child to prevent it from being rendered on artboard
      // TextArea will render this Text as part of its own rendering
      this.addElement(textInstance);

      // Position the text at its proper Y offset within the TextArea
      textInstance.position({
        relativeFrom: textInstance.topLeft,
        relativeTo: this.contentBox.topLeft,
        x: 0,
        y: yOffset,
        boxReference: "contentBox",
      });

      this._textLines.push(textInstance);
      this._lineYPositions.push(yOffset);

      // Calculate actual line height
      let actualLineHeight: number;
      if (smartLineHeight) {
        // Measure the actual height of this line's content
        const measuredHeight = textInstance.textHeight;
        // Use measured height with a small minimum (at least base line height)
        const minHeight = this._fontSize * this._lineHeight;
        actualLineHeight = Math.max(measuredHeight, minHeight);
        // Add a small spacing buffer (10% of font size)
        actualLineHeight += this._fontSize * 0.1;
      } else {
        // Use fixed line height
        actualLineHeight = this._fontSize * this._lineHeight;
      }

      this._lineHeights.push(actualLineHeight);

      // Track highlights in this line
      // Find where this trimmed line content actually appears in cleanContent
      const lineStart = cleanContent.indexOf(trimmedContent, cleanContentSearchStart);
      const lineEnd = lineStart + trimmedContent.length;

      highlights.forEach((highlight) => {
        // Check if this line contains the highlight
        // Only process if the highlight actually overlaps with this line
        if (lineStart <= highlight.end && lineEnd >= highlight.start) {
          // Calculate position within the trimmed line
          const startInLine = Math.max(0, highlight.start - lineStart);
          const endInLine = Math.min(
            trimmedContent.length,
            highlight.end - lineStart
          );

          this._highlightMap.set(highlight.id, {
            lineIndex,
            highlightId: highlight.id,
            highlightText: highlight.text,
            startInLine,
            endInLine,
          });
        }
      });

      // Move search start forward (to the end of this line + any whitespace)
      // This ensures we don't find the same content again if it repeats
      cleanContentSearchStart = lineEnd;

      yOffset += actualLineHeight;
    });
  }

  /**
   * Gets a highlighted word element by its ID.
   */
  getHighlightedWord(id: string): HighlightedWord | null {
    const highlightInfo = this._highlightMap.get(id);
    if (!highlightInfo) {
      return null;
    }

    const textInstance = this._textLines[highlightInfo.lineIndex];
    if (!textInstance) {
      return null;
    }

    // Get the original line content and highlighted text
    const lineContent = this._lineContents[highlightInfo.lineIndex];
    const highlightText = highlightInfo.highlightText;
    const startInLine = highlightInfo.startInLine;
    const endInLine = highlightInfo.endInLine;

    if (
      !highlightText ||
      startInLine === undefined ||
      endInLine === undefined
    ) {
      // Fallback to full line if no highlight info stored
      const bbox = textInstance.getBoundingBox();
      const topLeft = textInstance.topLeft;

      return {
        id,
        bbox: {
          x: topLeft.x,
          y: topLeft.y,
          width: textInstance.textWidth,
          height: textInstance.textHeight,
        },
        content: "",
        textInstance,
        get center() {
          return {
            x: this.bbox.x + this.bbox.width / 2,
            y: this.bbox.y + this.bbox.height / 2,
          };
        },
        get topLeft() {
          return { x: this.bbox.x, y: this.bbox.y };
        },
        get topCenter() {
          return { x: this.bbox.x + this.bbox.width / 2, y: this.bbox.y };
        },
        get topRight() {
          return { x: this.bbox.x + this.bbox.width, y: this.bbox.y };
        },
        get leftCenter() {
          return { x: this.bbox.x, y: this.bbox.y + this.bbox.height / 2 };
        },
        get rightCenter() {
          return {
            x: this.bbox.x + this.bbox.width,
            y: this.bbox.y + this.bbox.height / 2,
          };
        },
        get bottomLeft() {
          return { x: this.bbox.x, y: this.bbox.y + this.bbox.height };
        },
        get bottomCenter() {
          return {
            x: this.bbox.x + this.bbox.width / 2,
            y: this.bbox.y + this.bbox.height,
          };
        },
        get bottomRight() {
          return {
            x: this.bbox.x + this.bbox.width,
            y: this.bbox.y + this.bbox.height,
          };
        },
        get top() {
          return this.topCenter;
        },
        get bottom() {
          return this.bottomCenter;
        },
        get left() {
          return this.leftCenter;
        },
        get right() {
          return this.rightCenter;
        },
      };
    }

    // To get precise bounding box of the highlighted word, we need to:
    // 1. Measure the text before the highlight (to get x offset)
    // 2. Measure the highlighted text itself (to get width)

    const beforeHighlight = lineContent.substring(0, startInLine);
    const highlightedPart = lineContent.substring(startInLine, endInLine);

    // Check if we can measure (requires DOM)
    const canMeasure = typeof document !== "undefined";

    let xOffset: number;
    let highlightWidth: number;
    let highlightHeight: number;

    if (canMeasure) {
      // Let these auto-add to artboard for measurement, we'll track them for cleanup
      const tempTexts: Text[] = [];
      
      // Measure text before highlight to get x offset
      // Special case: empty string has 0 width
      if (beforeHighlight === "") {
        xOffset = 0;
      } else {
        const beforeText = new Text({
          content: beforeHighlight,
          fontSize: this._fontSize,
          fontFamily: this.config.fontFamily,
          fontWeight: this.config.fontWeight,
          lineHeight: this._lineHeight,
        });
        tempTexts.push(beforeText);
        xOffset = beforeText.textWidth;
      }

      // Measure the highlighted text itself to get width
      const highlightTextMeasure = new Text({
        content: highlightedPart,
        fontSize: this._fontSize,
        fontFamily: this.config.fontFamily,
        fontWeight: this.config.fontWeight,
        lineHeight: this._lineHeight,
      });
      tempTexts.push(highlightTextMeasure);
      highlightWidth = highlightTextMeasure.textWidth;
      highlightHeight = highlightTextMeasure.textHeight;
      
      // Clean up: Make them children of TextArea so they don't render on artboard
      // This happens AFTER measurement when they've already measured themselves
      tempTexts.forEach(t => this.addElement(t));
    } else {
      // Fallback: use character-based estimation
      // This is a rough approximation for when DOM is not available (e.g., tests)
      const totalChars = lineContent.length;
      const lineWidth = textInstance.textWidth;
      const avgCharWidth = lineWidth / totalChars;

      xOffset = startInLine * avgCharWidth;
      highlightWidth = (endInLine - startInLine) * avgCharWidth;
      highlightHeight = textInstance.textHeight;
    }

    // Store measurement data for lazy position calculation
    // Positions must be calculated lazily because the TextArea might not be positioned yet
    // (Containers position their children during render())
    const storedXOffset = xOffset;
    const storedHighlightWidth = highlightWidth;
    const storedHighlightHeight = highlightHeight;
    const storedLineIndex = highlightInfo.lineIndex;
    const self = this; // Capture 'this' for closures

    // Return the precisely measured highlight with lazy position calculation
    return {
      id,
      get bbox() {
        // Calculate position NOW (when bbox is accessed), not when getHighlightedWord was called
        const contentPos = self.getPositionForBox("content");
        const yOffset = self._lineYPositions[storedLineIndex];
        const lineHeight = self._lineHeights[storedLineIndex];
        const verticalCenterOffset = (lineHeight - storedHighlightHeight) / 2;
        
        const result = {
          x: contentPos.x + storedXOffset,
          y: contentPos.y + yOffset + verticalCenterOffset,
          width: storedHighlightWidth,
          height: storedHighlightHeight,
        };
        
        console.log(`[bbox] "${id}": contentPos=(${contentPos.x.toFixed(1)}, ${contentPos.y.toFixed(1)}) + xOff=${storedXOffset.toFixed(1)} + yOff=${yOffset.toFixed(1)} = result=(${result.x.toFixed(1)}, ${result.y.toFixed(1)}) [${storedHighlightWidth.toFixed(1)}x${storedHighlightHeight.toFixed(1)}]`);
        
        return result;
      },
      content: highlightText,
      textInstance,
      // All position getters use the lazy bbox
      get center() {
        const b = this.bbox;
        return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      },
      get topLeft() {
        const b = this.bbox;
        return { x: b.x, y: b.y };
      },
      get topCenter() {
        const b = this.bbox;
        return { x: b.x + b.width / 2, y: b.y };
      },
      get topRight() {
        const b = this.bbox;
        return { x: b.x + b.width, y: b.y };
      },
      get leftCenter() {
        const b = this.bbox;
        return { x: b.x, y: b.y + b.height / 2 };
      },
      get rightCenter() {
        const b = this.bbox;
        return { x: b.x + b.width, y: b.y + b.height / 2 };
      },
      get bottomLeft() {
        const b = this.bbox;
        return { x: b.x, y: b.y + b.height };
      },
      get bottomCenter() {
        const b = this.bbox;
        return { x: b.x + b.width / 2, y: b.y + b.height };
      },
      get bottomRight() {
        const b = this.bbox;
        return { x: b.x + b.width, y: b.y + b.height };
      },
      get top() {
        return this.topCenter;
      },
      get bottom() {
        return this.bottomCenter;
      },
      get left() {
        return this.leftCenter;
      },
      get right() {
        return this.rightCenter;
      },
    };
  }

  /**
   * Gets all highlighted word IDs.
   */
  getHighlightedWordIds(): string[] {
    return Array.from(this._highlightMap.keys());
  }

  /**
   * Gets the wrapped lines of text.
   */
  get lines(): string[] {
    return this._textLines.map((text, i) => {
      // Access the private config to get content
      return (text as any).config.content || "";
    });
  }

  /**
   * Renders the text area to SVG.
   */
  render(): string {
    const pos = this.getPositionForBox("border");
    const contentPos = this.getPositionForBox("content");
    const size = this.getBoxSize("border");
    const transform = this.getTransformAttribute();

    // Background rectangle
    let backgroundRect = "";
    if (this._style && (this._style.fill || this._style.stroke)) {
      const attrs = styleToSVGAttributes(this._style);
      backgroundRect = `<rect x="${pos.x}" y="${pos.y}" width="${size.width}" height="${size.height}" ${attrs} ${transform}/>`;
    }

    // Position and render all text lines
    this._baselineMarkers = []; // Clear previous baseline markers

    const textContent = this._textLines
      .map((text, index) => {
        const yOffset = this._lineYPositions[index];
        const lineHeight = this._lineHeights[index];
        const textHeight = text.textHeight;

        // Vertically center the text within its line height
        // This prevents LaTeX from sitting too low (on baseline) compared to normal text
        const verticalCenterOffset = (lineHeight - textHeight) / 2;

        // Position the text instance at render time (when we know TextArea's position)
        text.position({
          relativeFrom: text.topLeft,
          relativeTo: {
            x: contentPos.x,
            y: contentPos.y + yOffset + verticalCenterOffset,
          },
          x: 0,
          y: 0,
        });

        // If showBaselines is enabled, create baseline markers
        if (this.config.showBaselines) {
          // Put baseline at the bottom of the text
          const textTopY = contentPos.y + yOffset + verticalCenterOffset;
          const baselineY = textTopY + textHeight;

          const baselineLine = new Line({
            start: { x: contentPos.x, y: baselineY },
            end: { x: contentPos.x + this.contentWidth, y: baselineY },
            style: {
              stroke: "#ff0000",
              strokeWidth: "1px",
              strokeDasharray: "3,3",
            },
          });

          this._baselineMarkers.push(baselineLine);
        }

        return text.render();
      })
      .join("\n");

    // Debug visualization
    let debugRect = "";
    if (this.config.debug) {
      debugRect = `
  <rect x="${pos.x}" y="${pos.y}" width="${size.width}" height="${size.height}" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="5,5" />
  <rect x="${contentPos.x}" y="${contentPos.y}" width="${this.contentWidth}" height="${this.contentHeight}" fill="none" stroke="red" stroke-width="1" stroke-dasharray="3,3" />`;
    }

    // Baseline markers
    const baselineContent = this._baselineMarkers
      .map((line) => line.render())
      .join("\n");

    return `<g>
  ${backgroundRect}
  ${textContent}${debugRect}
  ${baselineContent}
</g>`;
  }
}
