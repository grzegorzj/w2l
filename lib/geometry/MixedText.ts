/**
 * MixedText module - Text with embedded LaTeX formulas.
 *
 * Allows mixing regular text and LaTeX formulas in a single element,
 * with the same measurement capabilities for both text and formula parts.
 *
 * @module geometry
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import type { WordBoundingBox } from "./Text.js";
import type { LatexPartBoundingBox } from "./LatexText.js";

/**
 * Represents a segment of mixed text content.
 */
interface TextSegment {
  type: "text" | "latex";
  content: string;
  displayMode?: boolean;
  index: number;
}

/**
 * Bounding box for any part of mixed text (word or formula).
 */
export interface MixedTextPartBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "text" | "latex";
  segmentIndex: number;
}

/**
 * Result of a pattern match in mixed text.
 */
export interface MixedTextMatch {
  /** The matched text/latex content */
  match: string;
  /** Bounding box of the segment containing this match */
  bbox: MixedTextPartBoundingBox;
  /** Index of the segment containing this match */
  segmentIndex: number;
  /** Type of segment: text or latex */
  type: "text" | "latex";
  /** Character offset within the segment */
  charOffset: number;
}

/**
 * Configuration for creating a MixedText element.
 */
export interface MixedTextConfig {
  /**
   * The content with embedded LaTeX formulas.
   * Use $...$ for inline LaTeX and $$...$$ for display mode LaTeX.
   * 
   * @example
   * ```typescript
   * content: "The famous equation $E = mc^2$ was discovered by Einstein."
   * content: "The quadratic formula is $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$"
   * content: "Euler's identity: $e^{i\\pi} + 1 = 0$ is beautiful."
   * ```
   */
  content: string;

  /**
   * Font size (supports units like "16px", "1rem", or numbers).
   * @defaultValue "16px"
   */
  fontSize?: string | number;

  /**
   * Font family for text portions (CSS font-family value).
   * @defaultValue "sans-serif"
   */
  fontFamily?: string;

  /**
   * Font weight for text portions (CSS font-weight value).
   * @defaultValue "normal"
   */
  fontWeight?: string | number;

  /**
   * Line height multiplier (relative to font size).
   * @defaultValue 1.2
   */
  lineHeight?: number;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties (fill, stroke, opacity, etc.).
   */
  style?: Partial<Style>;

  /**
   * Enable debug mode to visualize bounding box.
   * Draws a red border around the measured dimensions.
   * @defaultValue false
   */
  debug?: boolean;
}

/**
 * Mixed text with embedded LaTeX formulas.
 *
 * The MixedText class allows you to seamlessly mix regular text with
 * mathematical notation, providing measurement capabilities for both.
 *
 * @example
 * Create text with inline formula
 * ```typescript
 * const text = new MixedText({
 *   content: "The equation $E = mc^2$ is famous.",
 *   fontSize: "18px"
 * });
 * ```
 *
 * @example
 * Create text with display mode formula
 * ```typescript
 * const text = new MixedText({
 *   content: "Quadratic formula: $$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$",
 *   fontSize: "20px",
 *   fontFamily: "Georgia"
 * });
 * ```
 */
export class MixedText extends Shape {
  private config: MixedTextConfig;
  private _fontSize: number;
  private _lineHeight: number;
  private _segments: TextSegment[];
  
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
    parts: Array<MixedTextPartBoundingBox>;
    totalWidth: number;
    totalHeight: number;
  };

  /**
   * Creates a new MixedText instance.
   *
   * @param config - Configuration for the mixed text element
   */
  constructor(config: MixedTextConfig) {
    super(config.name);
    this.config = config;
    this._fontSize = parseUnit(config.fontSize || "16px");
    this._lineHeight = config.lineHeight || 1.2;
    this._segments = this.parseContent();
  }

  /**
   * Parses the content to identify text and LaTeX segments.
   * 
   * @returns Array of text segments
   * @internal
   */
  private parseContent(): TextSegment[] {
    const content = this.config.content || "";
    const segments: TextSegment[] = [];
    let currentIndex = 0;
    let segmentIndex = 0;

    // Regex to match $$...$$ (display) or $...$ (inline)
    const latexRegex = /\$\$([^\$]+)\$\$|\$([^\$]+)\$/g;
    let match;
    let lastIndex = 0;

    while ((match = latexRegex.exec(content)) !== null) {
      // Add text before the LaTeX
      if (match.index > lastIndex) {
        const textContent = content.substring(lastIndex, match.index);
        if (textContent) {
          segments.push({
            type: "text",
            content: textContent,
            index: segmentIndex++
          });
        }
      }

      // Add LaTeX segment
      const latexContent = match[1] || match[2]; // match[1] for $$, match[2] for $
      const displayMode = !!match[1]; // true if $$...$$
      segments.push({
        type: "latex",
        content: latexContent,
        displayMode,
        index: segmentIndex++
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      const textContent = content.substring(lastIndex);
      if (textContent) {
        segments.push({
          type: "text",
          content: textContent,
          index: segmentIndex++
        });
      }
    }

    // If no LaTeX found, treat entire content as text
    if (segments.length === 0) {
      segments.push({
        type: "text",
        content: content,
        index: 0
      });
    }

    return segments;
  }

  /**
   * Sets the measurement container getter.
   * Called by Artboard when this element is added.
   * 
   * @param getter - Function that returns the measurement SVG container
   * @internal
   */
  setMeasurementContainer(getter: () => SVGElement): void {
    this._measurementContainerGetter = getter;
  }

  /**
   * Ensures this mixed text has been measured with actual browser metrics.
   * 
   * @internal
   */
  private ensureMeasured(): void {
    if (this._measuredDimensions) {
      return;
    }
    
    if (!this._measurementContainerGetter || typeof document === 'undefined') {
      return;
    }
    
    try {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      container.style.fontSize = `${this._fontSize}px`;
      container.style.fontFamily = this.config.fontFamily || 'sans-serif';
      container.style.fontWeight = String(this.config.fontWeight || 'normal');
      container.style.lineHeight = String(this._lineHeight);
      container.style.display = 'inline-flex';
      container.style.alignItems = 'baseline';
      container.style.flexWrap = 'nowrap';
      container.style.margin = '0';
      container.style.padding = '0';
      
      // MathJax SVG doesn't need style overrides like KaTeX
      
      document.body.appendChild(container);

      const parts: Array<MixedTextPartBoundingBox> = [];

      // Render each segment
      this._segments.forEach((segment) => {
        const span = document.createElement('span');
        span.setAttribute('data-segment-index', String(segment.index));
        span.setAttribute('data-segment-type', segment.type);
        span.style.margin = '0';
        span.style.padding = '0';
        span.style.display = 'inline-block';
        
        if (segment.type === 'text') {
          span.textContent = segment.content;
          span.style.whiteSpace = 'pre';
        } else {
          // Render LaTeX with MathJax
          if (typeof window !== 'undefined' && (window as any).MathJax) {
            const MathJax = (window as any).MathJax;
            try {
              if (MathJax.tex2svg) {
                const node = MathJax.tex2svg(segment.content, {
                  display: segment.displayMode || false,
                  em: this._fontSize,        // Set em size in pixels
                  ex: this._fontSize * 0.5,  // ex is typically half of em
                  containerWidth: 80 * this._fontSize
                });
                // Get the SVG and fix its dimensions
                const svg = node.querySelector('svg');
                if (svg) {
                  // Remove ex-based width/height, replace with pixels
                  svg.removeAttribute('width');
                  svg.removeAttribute('height');
                  
                  const viewBox = svg.getAttribute('viewBox');
                  if (viewBox) {
                    const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
                    const scale = this._fontSize / 1000;
                    svg.setAttribute('width', `${vbWidth * scale}px`);
                    svg.setAttribute('height', `${vbHeight * scale}px`);
                  }
                  
                  span.innerHTML = svg.outerHTML;
                } else {
                  span.innerHTML = node.outerHTML;
                }
              } else {
                span.textContent = `$${segment.content}$`;
              }
            } catch (error) {
              span.textContent = `[LaTeX Error: ${segment.content}]`;
              span.style.color = 'red';
            }
          } else {
            span.textContent = `$${segment.content}$`;
          }
        }
        
        container.appendChild(span);
      });

      // Measure the container first to get baseline
      const containerBbox = container.getBoundingClientRect();

      // Measure each segment - for LaTeX segments, measure the SVG inside
      const spans = container.querySelectorAll('[data-segment-index]');
      spans.forEach((span) => {
        const segmentType = span.getAttribute('data-segment-type') as 'text' | 'latex';
        let bbox;
        
        if (segmentType === 'latex') {
          // For LaTeX, measure the SVG element directly
          const svg = span.querySelector('svg');
          if (svg) {
            bbox = svg.getBoundingClientRect();
          } else {
            bbox = (span as HTMLElement).getBoundingClientRect();
          }
        } else {
          // For text, measure the span
          bbox = (span as HTMLElement).getBoundingClientRect();
        }
        
        const segmentIndex = parseInt(span.getAttribute('data-segment-index') || '0');
        
        parts.push({
          x: bbox.left - containerBbox.left,
          y: bbox.top - containerBbox.top,
          width: bbox.width,
          height: bbox.height,
          type: segmentType,
          segmentIndex
        });
      });

      this._measuredDimensions = {
        parts,
        totalWidth: containerBbox.width,
        totalHeight: containerBbox.height
      };

      document.body.removeChild(container);
    } catch (error) {
      console.warn('MixedText measurement failed:', error);
    }
  }

  /**
   * Gets the width of the mixed text.
   * 
   * @returns The width in pixels
   */
  get textWidth(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.totalWidth || 200; // fallback
  }

  /**
   * Gets the height of the mixed text.
   * 
   * @returns The height in pixels
   */
  get textHeight(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.totalHeight || this._fontSize * this._lineHeight; // fallback
  }

  /**
   * Gets the geometric center of the mixed text.
   *
   * @returns The center point
   */
  get center(): Point {
    return this.toAbsolutePoint(this.textWidth / 2, this.textHeight / 2);
  }

  /**
   * Standard reference points for positioning.
   */
  get topLeft(): Point {
    return this.toAbsolutePoint(0, 0);
  }

  get topCenter(): Point {
    return this.toAbsolutePoint(this.textWidth / 2, 0);
  }

  get topRight(): Point {
    return this.toAbsolutePoint(this.textWidth, 0);
  }

  get leftCenter(): Point {
    return this.toAbsolutePoint(0, this.textHeight / 2);
  }

  get rightCenter(): Point {
    return this.toAbsolutePoint(this.textWidth, this.textHeight / 2);
  }

  get bottomLeft(): Point {
    return this.toAbsolutePoint(0, this.textHeight);
  }

  get bottomCenter(): Point {
    return this.toAbsolutePoint(this.textWidth / 2, this.textHeight);
  }

  get bottomRight(): Point {
    return this.toAbsolutePoint(this.textWidth, this.textHeight);
  }

  /**
   * Gets all segments in the mixed text.
   * 
   * @returns Array of segments with their types and content
   */
  getSegments(): Array<{ type: string; content: string; index: number }> {
    return this._segments.map(s => ({
      type: s.type,
      content: s.content,
      index: s.index
    }));
  }

  /**
   * Gets the bounding box for a specific segment.
   * 
   * @param segmentIndex - Index of the segment
   * @returns Bounding box of the segment, or null if not available
   */
  getSegmentBoundingBox(segmentIndex: number): MixedTextPartBoundingBox | null {
    this.ensureMeasured();
    
    const part = this._measuredDimensions?.parts.find(p => p.segmentIndex === segmentIndex);
    return part || null;
  }

  /**
   * Gets the center point of a specific segment.
   * 
   * @param segmentIndex - Index of the segment
   * @returns Center point of the segment, or null if not available
   */
  getSegmentCenter(segmentIndex: number): Point | null {
    const bbox = this.getSegmentBoundingBox(segmentIndex);
    if (!bbox) {
      return null;
    }
    
    return {
      x: `${bbox.x + bbox.width / 2}px`,
      y: `${bbox.y + bbox.height / 2}px`
    };
  }

  /**
   * Finds all occurrences of a pattern in the mixed text and returns their bounding boxes.
   * Can search in text segments, latex segments, or both.
   * 
   * @param pattern - String or RegExp pattern to search for
   * @param options - Search options
   * @returns Array of matches with their bounding boxes
   * 
   * @example
   * Find power notation in LaTeX
   * ```typescript
   * const text = new MixedText({
   *   content: "Einstein's equation $E = mc^2$ relates energy and mass."
   * });
   * const matches = text.findMatches(/\^2/, { type: 'latex' });
   * matches.forEach(match => {
   *   console.log(`Found "${match.match}" in LaTeX at segment ${match.segmentIndex}`);
   *   // Use match.bbox to create highlights
   * });
   * ```
   * 
   * @example
   * Find words in text parts only
   * ```typescript
   * const matches = text.findMatches(/energy|mass/, { type: 'text' });
   * ```
   * 
   * @example
   * Search both text and latex
   * ```typescript
   * const matches = text.findMatches(/E/); // Searches everywhere by default
   * ```
   */
  findMatches(
    pattern: string | RegExp,
    options?: { type?: 'text' | 'latex' | 'both' }
  ): MixedTextMatch[] {
    this.ensureMeasured();
    
    const searchType = options?.type || 'both';
    const regex = typeof pattern === 'string' 
      ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      : new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
    
    const matches: MixedTextMatch[] = [];
    
    // Search through each segment
    this._segments.forEach((segment) => {
      // Skip if type doesn't match
      if (searchType !== 'both' && segment.type !== searchType) {
        return;
      }
      
      // Reset regex lastIndex for each segment
      regex.lastIndex = 0;
      
      let match: RegExpExecArray | null;
      while ((match = regex.exec(segment.content)) !== null) {
        const bbox = this.getSegmentBoundingBox(segment.index);
        if (bbox) {
          matches.push({
            match: match[0],
            bbox,
            segmentIndex: segment.index,
            type: segment.type,
            charOffset: match.index
          });
        }
      }
    });
    
    return matches;
  }

  /**
   * Updates the content and forces re-parsing and re-measurement.
   * 
   * @param newContent - The new content with embedded LaTeX
   */
  updateContent(newContent: string): void {
    this.config.content = newContent;
    this._segments = this.parseContent();
    this._measuredDimensions = undefined;
  }

  /**
   * Renders the mixed text to SVG using foreignObject.
   * Pre-renders LaTeX segments to avoid script execution issues in SVG.
   * 
   * @returns SVG representation
   */
  render(): string {
    const comment = this.getSVGComment();
    const absPos = this.getAbsolutePosition();
    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    const defaultStyle: Partial<Style> = {
      fill: "#000000",
    };
    const style = { ...defaultStyle, ...this.config.style };
    const color = style.fill || "#000000";

    // Pre-render all segments including LaTeX
    // This ensures LaTeX is rendered before being embedded in SVG
    this.ensureMeasured();

    // Build HTML content with pre-rendered LaTeX
    let htmlContent = '<div style="display: inline-flex; align-items: baseline; flex-wrap: nowrap; margin: 0; padding: 0;">';
    
    this._segments.forEach((segment) => {
      if (segment.type === 'text') {
        htmlContent += `<span style="white-space: pre; margin: 0; padding: 0; display: inline-block;">${this.escapeHtml(segment.content)}</span>`;
      } else {
        // LaTeX segment - render it now using MathJax
        if (typeof window !== 'undefined' && (window as any).MathJax) {
          const MathJax = (window as any).MathJax;
          try {
            if (MathJax.tex2svg) {
              const node = MathJax.tex2svg(segment.content, {
                display: segment.displayMode || false,
                em: this._fontSize,
                ex: this._fontSize * 0.5,
                containerWidth: 80 * this._fontSize
              });
              const svg = node.querySelector('svg');
              if (svg) {
                // Remove ex-based dimensions and use pixel dimensions
                svg.removeAttribute('width');
                svg.removeAttribute('height');
                
                const viewBox = svg.getAttribute('viewBox');
                if (viewBox) {
                  const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
                  const scale = this._fontSize / 1000;
                  svg.setAttribute('width', `${vbWidth * scale}px`);
                  svg.setAttribute('height', `${vbHeight * scale}px`);
                }
                
                htmlContent += `<span style="margin: 0; padding: 0; display: inline-block; vertical-align: middle;">${svg.outerHTML}</span>`;
              } else {
                htmlContent += `<span style="margin: 0; padding: 0; display: inline-block;">${node.outerHTML}</span>`;
              }
            } else {
              htmlContent += `<span style="margin: 0; padding: 0; display: inline-block;">$${this.escapeHtml(segment.content)}$</span>`;
            }
          } catch (error) {
            htmlContent += `<span style="color: red; margin: 0; padding: 0; display: inline-block;">[LaTeX Error: ${this.escapeHtml(segment.content)}]</span>`;
          }
        } else {
          // Fallback if MathJax not available
          htmlContent += `<span style="margin: 0; padding: 0; display: inline-block;">$${this.escapeHtml(segment.content)}$</span>`;
        }
      }
    });
    
    htmlContent += '</div>';

    // Use foreignObject to embed HTML in SVG
    const svg = `<foreignObject x="${absPos.x}" y="${absPos.y}" width="${this.textWidth}" height="${this.textHeight}"${transform}>
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${this._fontSize}px; font-family: ${this.config.fontFamily || 'sans-serif'}; font-weight: ${this.config.fontWeight || 'normal'}; color: ${color}; display: inline-block; margin: 0; padding: 0; line-height: 1;">
        ${htmlContent}
      </div>
    </foreignObject>`;

    // Add debug rectangle if debug mode is enabled
    let debugRect = '';
    if (this.config.debug) {
      debugRect = `<rect x="${absPos.x}" y="${absPos.y}" width="${this.textWidth}" height="${this.textHeight}" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="5,5" />`;
    }

    return comment + svg + debugRect;
  }

  /**
   * Escapes HTML special characters.
   * 
   * @param text - Text to escape
   * @returns Escaped text
   * @internal
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

