/**
 * TextArea - A text component that wraps text within a specified width
 * 
 * Unlike Text which renders as a single line, TextArea breaks text into multiple
 * lines to fit within the specified width. Uses Text components internally for
 * proper LaTeX rendering and measurement.
 */

import { Rectangle } from "../core/Rectangle.js";
import { Text } from "./Text.js";
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
   * @defaultValue 1.2
   */
  lineHeight?: number;

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
  private _highlightMap: Map<string, { lineIndex: number, highlightId: string }> = new Map();
  private _lineYPositions: number[] = [];

  constructor(config: TextAreaConfig) {
    const fontSize = typeof config.fontSize === 'number' 
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
    
    // Update height based on actual lines
    const totalHeight = this._textLines.length * this._fontSize * this._lineHeight +
      this._boxModel.padding.top + this._boxModel.padding.bottom +
      this._boxModel.border.top + this._boxModel.border.bottom;
    
    this._borderBoxHeight = totalHeight;
  }

  /**
   * Extracts highlight markers and returns clean content with marker positions.
   */
  private extractHighlights(content: string): { 
    cleanContent: string; 
    highlights: Array<{ id: string; start: number; end: number; }> 
  } {
    const highlights: Array<{ id: string; start: number; end: number; }> = [];
    let cleanContent = '';
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
      
      highlights.push({ id, start, end });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    cleanContent += content.substring(lastIndex);
    
    return { cleanContent, highlights };
  }

  /**
   * Wraps content into multiple lines using Text measurement.
   */
  private wrapContent(): void {
    const contentWidth = this.contentWidth;
    const contentPos = this.getPositionForBox("content");
    
    // Extract highlights from content
    const { cleanContent, highlights } = this.extractHighlights(this.config.content);
    
    // Split content by spaces to get wrappable units
    // But preserve LaTeX formulas as atomic units
    const units: Array<{ content: string; type: 'text' | 'latex' | 'space'; highlightId?: string }> = [];
    
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
        words.forEach(word => {
          if (word) {
            units.push({ 
              content: word, 
              type: word.trim() ? 'text' : 'space' 
            });
          }
        });
      }
      
      // Add latex as atomic unit
      units.push({ content: match[0], type: 'latex' });
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < cleanContent.length) {
      const textAfter = cleanContent.substring(lastIndex);
      const words = textAfter.split(/(\s+)/);
      words.forEach(word => {
        if (word) {
          units.push({ 
            content: word, 
            type: word.trim() ? 'text' : 'space' 
          });
        }
      });
    }
    
    // Now wrap into lines by measuring with Text
    const lines: string[] = [];
    let currentLine = '';
    let currentLineStart = 0;
    
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      const testLine = currentLine + unit.content;
      
      // Create a temporary Text to measure
      const tempText = new Text({
        content: testLine,
        fontSize: this._fontSize,
        fontFamily: this.config.fontFamily,
        fontWeight: this.config.fontWeight,
        lineHeight: this._lineHeight,
      });
      
      const measuredWidth = tempText.textWidth;
      
      if (measuredWidth > contentWidth && currentLine.trim()) {
        // Line too long, break here
        lines.push(currentLine);
        currentLine = unit.type === 'space' ? '' : unit.content;
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
    this._textLines = [];
    this._lineYPositions = [];
    let yOffset = 0;
    
    lines.forEach((lineContent, lineIndex) => {
      const textInstance = new Text({
        content: lineContent.trim(),
        fontSize: this._fontSize,
        fontFamily: this.config.fontFamily,
        fontWeight: this.config.fontWeight,
        lineHeight: this._lineHeight,
        style: { fill: this.config.textColor || "#000000" },
      });
      
      this._textLines.push(textInstance);
      this._lineYPositions.push(yOffset);
      
      // Track highlights in this line
      const lineStart = this.config.content.indexOf(lineContent.trim());
      highlights.forEach(highlight => {
        if (lineStart >= highlight.start && lineStart <= highlight.end) {
          this._highlightMap.set(highlight.id, { lineIndex, highlightId: highlight.id });
        }
      });
      
      yOffset += this._fontSize * this._lineHeight;
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
    
    // For now, return the full text bounding box
    // (Could be enhanced to find specific word position within the line)
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
      content: '', // Placeholder
      textInstance,
      get center() { return { x: this.bbox.x + this.bbox.width / 2, y: this.bbox.y + this.bbox.height / 2 }; },
      get topLeft() { return { x: this.bbox.x, y: this.bbox.y }; },
      get topCenter() { return { x: this.bbox.x + this.bbox.width / 2, y: this.bbox.y }; },
      get topRight() { return { x: this.bbox.x + this.bbox.width, y: this.bbox.y }; },
      get leftCenter() { return { x: this.bbox.x, y: this.bbox.y + this.bbox.height / 2 }; },
      get rightCenter() { return { x: this.bbox.x + this.bbox.width, y: this.bbox.y + this.bbox.height / 2 }; },
      get bottomLeft() { return { x: this.bbox.x, y: this.bbox.y + this.bbox.height }; },
      get bottomCenter() { return { x: this.bbox.x + this.bbox.width / 2, y: this.bbox.y + this.bbox.height }; },
      get bottomRight() { return { x: this.bbox.x + this.bbox.width, y: this.bbox.y + this.bbox.height }; },
      get top() { return this.topCenter; },
      get bottom() { return this.bottomCenter; },
      get left() { return this.leftCenter; },
      get right() { return this.rightCenter; },
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
      return (text as any).config.content || '';
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
    let backgroundRect = '';
    if (this._style && (this._style.fill || this._style.stroke)) {
      const attrs = styleToSVGAttributes(this._style);
      backgroundRect = `<rect x="${pos.x}" y="${pos.y}" width="${size.width}" height="${size.height}" ${attrs} ${transform}/>`;
    }
    
    // Position and render all text lines
    const textContent = this._textLines.map((text, index) => {
      const yOffset = this._lineYPositions[index];
      
      // Position the text instance at render time (when we know TextArea's position)
      text.position({
        relativeFrom: text.topLeft,
        relativeTo: { x: contentPos.x, y: contentPos.y + yOffset },
        x: 0,
        y: 0,
      });
      
      return text.render();
    }).join('\n');
    
    // Debug visualization
    let debugRect = '';
    if (this.config.debug) {
      debugRect = `
  <rect x="${pos.x}" y="${pos.y}" width="${size.width}" height="${size.height}" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="5,5" />
  <rect x="${contentPos.x}" y="${contentPos.y}" width="${this.contentWidth}" height="${this.contentHeight}" fill="none" stroke="red" stroke-width="1" stroke-dasharray="3,3" />`;
    }
    
    return `<g>
  ${backgroundRect}
  ${textContent}${debugRect}
</g>`;
  }
}
