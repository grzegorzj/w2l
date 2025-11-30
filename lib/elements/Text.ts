/**
 * Text - Text with optional embedded LaTeX formulas for the new layout system.
 *
 * Supports plain text and mixed text with LaTeX formulas using $ and $$ delimiters.
 * Provides measurement capabilities and annotation support for highlighting.
 */

import { Shape } from "../core/Shape.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { parseUnit } from "../core/units.js";
import { defaultTheme } from "../core/Theme.js";
import { 
  MATHJAX_EX_TO_EM_RATIO, 
  MATHJAX_CONTAINER_WIDTH_MULTIPLIER,
  MATHJAX_UNITS_PER_EM
} from "../core/mathjax-constants.js";

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
 * Represents an annotated element within a Text formula.
 * Annotated using \cssId{id}{content} or \class{class}{content} commands in LaTeX segments.
 */
export interface AnnotatedTextElement {
  /** ID or class name of the annotation */
  identifier: string;
  /** Type of annotation: 'id' or 'class' */
  type: 'id' | 'class';
  /** Bounding box of the annotated element */
  bbox: MixedTextPartBoundingBox;
  /** The SVG element itself */
  element: SVGElement;
  
  // Reference points for positioning (absolute world coordinates)
  /** Center point of the element */
  readonly center: { x: number; y: number };
  /** Top-left corner */
  readonly topLeft: { x: number; y: number };
  /** Top-center point */
  readonly topCenter: { x: number; y: number };
  /** Top-right corner */
  readonly topRight: { x: number; y: number };
  /** Left-center point */
  readonly leftCenter: { x: number; y: number };
  /** Right-center point */
  readonly rightCenter: { x: number; y: number };
  /** Bottom-left corner */
  readonly bottomLeft: { x: number; y: number };
  /** Bottom-center point */
  readonly bottomCenter: { x: number; y: number };
  /** Bottom-right corner */
  readonly bottomRight: { x: number; y: number };
  
  // Convenient aliases
  /** Alias for topCenter */
  readonly top: { x: number; y: number };
  /** Alias for bottomCenter */
  readonly bottom: { x: number; y: number };
  /** Alias for leftCenter */
  readonly left: { x: number; y: number };
  /** Alias for rightCenter */
  readonly right: { x: number; y: number };
}

/**
 * Configuration for creating a Text element.
 */
export interface TextConfig {
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
   * Visual styling properties (fill, stroke, opacity, etc.).
   */
  style?: Partial<Style>;

  /**
   * Enable debug mode to visualize bounding box.
   * @defaultValue false
   */
  debug?: boolean;
}

/**
 * Text with optional embedded LaTeX formulas.
 *
 * The Text class allows you to render plain text or seamlessly mix regular text with
 * mathematical notation, providing measurement capabilities and annotation
 * support for highlighting specific parts of formulas.
 *
 * @example
 * Create plain text
 * ```typescript
 * const text = new Text({
 *   content: "Hello, World!",
 *   fontSize: 18
 * });
 * ```
 *
 * @example
 * Create text with inline formula
 * ```typescript
 * const text = new Text({
 *   content: "The equation $E = mc^2$ is famous.",
 *   fontSize: 18
 * });
 * ```
 *
 * @example
 * Create text with annotated formula
 * ```typescript
 * const text = new Text({
 *   content: "Equation: $E = \\cssId{power}{mc^2}$",
 *   fontSize: 20
 * });
 * const power = text.getElementById('power');
 * if (power) {
 *   // Use power.topLeft, power.center, etc. for highlighting
 * }
 * ```
 */
export class Text extends Shape {
  private config: TextConfig;
  private _fontSize: number;
  private _lineHeight: number;
  private _segments: TextSegment[];
  private _renderedLatexSegments: Map<number, string> = new Map(); // Store pre-rendered LaTeX by segment index
  
  /**
   * Cached measured dimensions from browser.
   * Populated lazily when measurement is needed.
   * @internal
   */
  private _measuredDimensions?: {
    parts: Array<MixedTextPartBoundingBox>;
    totalWidth: number;
    totalHeight: number;
  };

  /**
   * Get bounding boxes for all LaTeX segments (full segments, not annotated parts).
   * Returns absolute coordinates.
   */
  getLatexSegmentBBoxes(): Array<{ x: number; y: number; width: number; height: number; segmentIndex: number }> {
    this.ensureMeasured();
    if (!this._measuredDimensions) return [];
    
    const absPos = this.getAbsolutePosition();
    return this._measuredDimensions.parts
      .filter(part => part.type === 'latex')
      .map(part => ({
        x: absPos.x + part.x,
        y: absPos.y + part.y,
        width: part.width,
        height: part.height,
        segmentIndex: part.segmentIndex
      }));
  }

  /**
   * Creates a new Text instance.
   *
   * @param config - Configuration for the text element
   */
  constructor(config: TextConfig) {
    super();
    this.config = config;
    this._fontSize = typeof config.fontSize === 'number' ? config.fontSize : parseUnit(config.fontSize || "16px");
    this._lineHeight = config.lineHeight || 1.2;
    this._segments = this.parseContent();
    
    // Apply theme defaults, then merge with user styles
    const defaultStyle: Partial<Style> = {
      ...defaultTheme.presets.text,
    };
    
    this._style = {
      ...defaultStyle,
      ...config.style,
    };
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
   * Pre-renders LaTeX segments and stores them.
   * COPIED FROM Latex approach - ensures consistency.
   * @internal
   */
  private prerenderLatexSegments(): void {
    if (typeof window === 'undefined' || !(window as any).MathJax) {
      return;
    }

    const MathJax = (window as any).MathJax;
    if (!MathJax.tex2svg) {
      return;
    }

    this._segments.forEach((segment) => {
      if (segment.type === 'latex' && !this._renderedLatexSegments.has(segment.index)) {
        try {
          const node = MathJax.tex2svg(segment.content, {
            display: true, // Always use display mode for consistency with Latex
            em: this._fontSize,
            ex: this._fontSize * MATHJAX_EX_TO_EM_RATIO,
            containerWidth: MATHJAX_CONTAINER_WIDTH_MULTIPLIER * this._fontSize,
          });

          const svg = node.querySelector('svg');
          if (svg) {
            // SAME scaling as Latex
            svg.removeAttribute('width');
            svg.removeAttribute('height');

            const viewBox = svg.getAttribute('viewBox');
            if (viewBox) {
              const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
              const scale = this._fontSize / MATHJAX_UNITS_PER_EM;
              const scaledHeight = vbHeight * scale;
              svg.setAttribute('width', `${vbWidth * scale}px`);
              svg.setAttribute('height', `${scaledHeight}px`);
              
              // Adjust vertical-align for tall LaTeX (taller than normal line height)
              const normalHeight = this._fontSize * this._lineHeight;
              if (scaledHeight > normalHeight) {
                // For tall LaTeX, use a less aggressive vertical-align
                // Change from -1.575ex to -1.3ex for better visual centering
                const currentStyle = svg.getAttribute('style') || '';
                const adjustedStyle = currentStyle.replace(/vertical-align:\s*-?[\d.]+ex/, 'vertical-align: -1.3ex');
                if (adjustedStyle !== currentStyle) {
                  svg.setAttribute('style', adjustedStyle);
                } else {
                  // If no existing vertical-align, add it
                  svg.setAttribute('style', currentStyle + '; vertical-align: -1.3ex');
                }
              }
            }

            this._renderedLatexSegments.set(segment.index, svg.outerHTML);
          } else {
            this._renderedLatexSegments.set(segment.index, node.outerHTML);
          }
        } catch (error) {
          this._renderedLatexSegments.set(
            segment.index,
            `<text fill="red">LaTeX Error: ${segment.content}</text>`
          );
        }
      }
    });
  }

  /**
   * Perform measurement of mixed text dimensions.
   * Called automatically when dimensions are needed.
   * 
   * @internal
   */
  private ensureMeasured(): void {
    if (this._measuredDimensions) {
      return;
    }

    // Pre-render LaTeX segments first (like Latex does)
    this.prerenderLatexSegments();
    
    if (typeof document === 'undefined') {
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
          // Use pre-rendered LaTeX (SAME approach as Latex)
          const renderedSvg = this._renderedLatexSegments.get(segment.index);
          if (renderedSvg) {
            span.innerHTML = renderedSvg;
          } else {
            span.textContent = `$${segment.content}$`;
          }
        }
        
        container.appendChild(span);
      });

      // Measure the container
      const containerBbox = container.getBoundingClientRect();

      // Measure each segment
      const spans = container.querySelectorAll('[data-segment-index]');
      spans.forEach((span) => {
        const segmentType = span.getAttribute('data-segment-type') as 'text' | 'latex';
        let bbox;
        
        if (segmentType === 'latex') {
          const svg = span.querySelector('svg');
          if (svg) {
            bbox = svg.getBoundingClientRect();
          } else {
            bbox = (span as HTMLElement).getBoundingClientRect();
          }
        } else {
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
      // Silent fail
    }
  }

  /**
   * Gets the width of the mixed text.
   */
  get textWidth(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.totalWidth || 200;
  }

  /**
   * Gets the height of the mixed text.
   */
  get textHeight(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.totalHeight || this._fontSize * this._lineHeight;
  }

  /**
   * Alias for textWidth (for compatibility with layout systems).
   */
  get width(): number {
    return this.textWidth;
  }

  /**
   * Alias for textHeight (for compatibility with layout systems).
   */
  get height(): number {
    return this.textHeight;
  }

  /**
   * Gets the bounding box of this element.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const absPos = this.getAbsolutePosition();
    return {
      minX: absPos.x,
      minY: absPos.y,
      maxX: absPos.x + this.textWidth,
      maxY: absPos.y + this.textHeight,
    };
  }

  /**
   * Gets the rotation center (center of the text).
   */
  protected getRotationCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth / 2,
      y: absPos.y + this.textHeight / 2,
    };
  }

  /**
   * Gets the corners of the text box.
   */
  getCorners(): { x: number; y: number }[] {
    const absPos = this.getAbsolutePosition();
    return [
      { x: absPos.x, y: absPos.y }, // topLeft
      { x: absPos.x + this.textWidth, y: absPos.y }, // topRight
      { x: absPos.x + this.textWidth, y: absPos.y + this.textHeight }, // bottomRight
      { x: absPos.x, y: absPos.y + this.textHeight }, // bottomLeft
    ];
  }

  /**
   * Standard reference points for positioning.
   */
  get center(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth / 2,
      y: absPos.y + this.textHeight / 2,
    };
  }

  get topLeft(): { x: number; y: number } {
    return this.getAbsolutePosition();
  }

  get topCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth / 2,
      y: absPos.y,
    };
  }

  get topRight(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth,
      y: absPos.y,
    };
  }

  get leftCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x,
      y: absPos.y + this.textHeight / 2,
    };
  }

  get rightCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth,
      y: absPos.y + this.textHeight / 2,
    };
  }

  get bottomLeft(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x,
      y: absPos.y + this.textHeight,
    };
  }

  get bottomCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth / 2,
      y: absPos.y + this.textHeight,
    };
  }

  get bottomRight(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.textWidth,
      y: absPos.y + this.textHeight,
    };
  }

  // Convenient aliases
  get top(): { x: number; y: number } {
    return this.topCenter;
  }

  get bottom(): { x: number; y: number } {
    return this.bottomCenter;
  }

  get left(): { x: number; y: number } {
    return this.leftCenter;
  }

  get right(): { x: number; y: number } {
    return this.rightCenter;
  }

  // Alternative naming convention (to match Rectangle)
  get centerTop(): { x: number; y: number } {
    return this.topCenter;
  }

  get centerBottom(): { x: number; y: number } {
    return this.bottomCenter;
  }

  get centerLeft(): { x: number; y: number } {
    return this.leftCenter;
  }

  get centerRight(): { x: number; y: number } {
    return this.rightCenter;
  }

  /**
   * Creates an annotated element with reference points from a bbox.
   * IMPORTANT: Returns coordinates in ABSOLUTE world space (relative bbox + mixed text position).
   * This matches the behavior needed for positioning highlights.
   * @internal
   */
  private createAnnotatedElement(
    identifier: string,
    type: 'id' | 'class',
    bbox: MixedTextPartBoundingBox,
    element: SVGElement
  ): AnnotatedTextElement {
    // Convert bbox (relative to mixed text container) to absolute world coordinates
    // by adding the mixed text element's position
    const absPos = this.getAbsolutePosition();
    const absBbox = {
      x: absPos.x + bbox.x,
      y: absPos.y + bbox.y,
      width: bbox.width,
      height: bbox.height,
      type: bbox.type,
      segmentIndex: bbox.segmentIndex,
    };

    return {
      identifier,
      type,
      bbox: absBbox,
      element,
      // Reference points in absolute world coordinates
      get center(): { x: number; y: number } {
        return {
          x: absBbox.x + absBbox.width / 2,
          y: absBbox.y + absBbox.height / 2,
        };
      },
      get topLeft(): { x: number; y: number } {
        return { x: absBbox.x, y: absBbox.y };
      },
      get topCenter(): { x: number; y: number } {
        return {
          x: absBbox.x + absBbox.width / 2,
          y: absBbox.y,
        };
      },
      get topRight(): { x: number; y: number } {
        return {
          x: absBbox.x + absBbox.width,
          y: absBbox.y,
        };
      },
      get leftCenter(): { x: number; y: number } {
        return {
          x: absBbox.x,
          y: absBbox.y + absBbox.height / 2,
        };
      },
      get rightCenter(): { x: number; y: number } {
        return {
          x: absBbox.x + absBbox.width,
          y: absBbox.y + absBbox.height / 2,
        };
      },
      get bottomLeft(): { x: number; y: number } {
        return {
          x: absBbox.x,
          y: absBbox.y + absBbox.height,
        };
      },
      get bottomCenter(): { x: number; y: number } {
        return {
          x: absBbox.x + absBbox.width / 2,
          y: absBbox.y + absBbox.height,
        };
      },
      get bottomRight(): { x: number; y: number } {
        return {
          x: absBbox.x + absBbox.width,
          y: absBbox.y + absBbox.height,
        };
      },
      // Convenient aliases
      get top(): { x: number; y: number } {
        return this.topCenter;
      },
      get bottom(): { x: number; y: number } {
        return this.bottomCenter;
      },
      get left(): { x: number; y: number } {
        return this.leftCenter;
      },
      get right(): { x: number; y: number } {
        return this.rightCenter;
      }
    };
  }

  /**
   * Gets an annotated element by its ID within LaTeX segments.
   * Use \cssId{id}{content} in your LaTeX segments to mark elements.
   * 
   * @param id - The ID assigned using \cssId command
   * @returns The annotated element with position info, or null if not found
   * 
   * @example
   * ```typescript
   * const text = new NewMixedText({
   *   content: "The equation $E = \\cssId{power}{mc^2}$ is famous."
   * });
   * 
   * const powerElement = text.getElementById('power');
   * if (powerElement) {
   *   // Use reference points: powerElement.center, powerElement.topLeft, etc.
   * }
   * ```
   */
  getElementById(id: string): AnnotatedTextElement | null {
    this.ensureMeasured();
    
    if (typeof document === 'undefined') {
      return null;
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
      // Ensure no zoom or transforms affect measurements
      container.style.transform = 'none';
      container.style.zoom = '1';
      container.style.pointerEvents = 'none';
      
      // Render each segment using PRE-RENDERED LaTeX WITH SAME STYLING AS RENDER
      this._segments.forEach((segment) => {
        const span = document.createElement('span');
        span.style.margin = '0';
        span.style.padding = '0';
        span.style.display = 'inline-block';
        
        if (segment.type === 'text') {
          span.style.whiteSpace = 'pre';
          span.textContent = segment.content;
        } else {
          span.style.verticalAlign = 'middle';
          // Use pre-rendered LaTeX (SAME approach as Latex)
          const renderedSvg = this._renderedLatexSegments.get(segment.index);
          if (renderedSvg) {
            span.innerHTML = renderedSvg;
          }
        }
        container.appendChild(span);
      });
      
      document.body.appendChild(container);
      
      // Find element with the ID
      const svgElement = container.querySelector(`#${CSS.escape(id)}`);
      
      if (svgElement && svgElement instanceof SVGElement) {
        const bbox = svgElement.getBoundingClientRect();
        const containerBbox = container.getBoundingClientRect();
        
        console.log(`[Measurement] ID="${id}" | width=${bbox.width.toFixed(2)} height=${bbox.height.toFixed(2)} | relX=${(bbox.left - containerBbox.left).toFixed(2)} relY=${(bbox.top - containerBbox.top).toFixed(2)}`);
        
        const relativeBbox: MixedTextPartBoundingBox = {
          x: bbox.left - containerBbox.left,
          y: bbox.top - containerBbox.top,
          width: bbox.width,
          height: bbox.height,
          type: 'latex',
          segmentIndex: -1
        };
        
        const result = this.createAnnotatedElement(id, 'id', relativeBbox, svgElement);
        
        document.body.removeChild(container);
        return result;
      }
      
      document.body.removeChild(container);
    } catch (error) {
      console.warn('Failed to get element by ID:', error);
    }
    
    return null;
  }

  /**
   * Gets all annotated elements with a specific class within LaTeX segments.
   * Use \class{classname}{content} in your LaTeX segments to mark elements.
   * 
   * @param className - The class name assigned using \class command
   * @returns Array of annotated elements with position info
   * 
   * @example
   * ```typescript
   * const text = new NewMixedText({
   *   content: "Formula: $\\class{var}{x}^2 + \\class{var}{y}^2 = \\class{var}{z}^2$"
   * });
   * 
   * const variables = text.getElementsByClass('var');
   * variables.forEach(v => {
   *   // Use v.topLeft, v.center, etc. for highlighting
   * });
   * ```
   */
  getElementsByClass(className: string): AnnotatedTextElement[] {
    this.ensureMeasured();
    
    if (typeof document === 'undefined') {
      return [];
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
      // Ensure no zoom or transforms affect measurements
      container.style.transform = 'none';
      container.style.zoom = '1';
      container.style.pointerEvents = 'none';
      
      // Render each segment using PRE-RENDERED LaTeX WITH SAME STYLING AS RENDER
      this._segments.forEach((segment) => {
        const span = document.createElement('span');
        span.style.margin = '0';
        span.style.padding = '0';
        span.style.display = 'inline-block';
        
        if (segment.type === 'text') {
          span.style.whiteSpace = 'pre';
          span.textContent = segment.content;
        } else {
          span.style.verticalAlign = 'middle';
          // Use pre-rendered LaTeX (SAME approach as Latex)
          const renderedSvg = this._renderedLatexSegments.get(segment.index);
          if (renderedSvg) {
            span.innerHTML = renderedSvg;
          }
        }
        container.appendChild(span);
      });
      
      document.body.appendChild(container);
      
      // Find all elements with the class
      const elements = container.querySelectorAll(`.${CSS.escape(className)}`);
      const results: AnnotatedTextElement[] = [];
      
      const containerBbox = container.getBoundingClientRect();
      
      elements.forEach((svgElement, index) => {
        if (svgElement instanceof SVGElement) {
          const bbox = svgElement.getBoundingClientRect();
          
          console.log(`[Measurement] class="${className}"[${index}] | width=${bbox.width.toFixed(2)} height=${bbox.height.toFixed(2)} | relX=${(bbox.left - containerBbox.left).toFixed(2)} relY=${(bbox.top - containerBbox.top).toFixed(2)}`);
          
          const relativeBbox: MixedTextPartBoundingBox = {
            x: bbox.left - containerBbox.left,
            y: bbox.top - containerBbox.top,
            width: bbox.width,
            height: bbox.height,
            type: 'latex',
            segmentIndex: -1
          };
          
          results.push(this.createAnnotatedElement(className, 'class', relativeBbox, svgElement));
        }
      });
      
      document.body.removeChild(container);
      return results;
    } catch (error) {
      console.warn('Failed to get elements by class:', error);
      return [];
    }
  }

  /**
   * Renders the mixed text to SVG using foreignObject.
   */
  render(): string {
    const absPos = this.getAbsolutePosition();
    const transformStr = this.getTransformAttribute();

    const defaultStyle: Partial<Style> = {
      fill: "#000000",
    };
    const style = { ...defaultStyle, ...this._style };
    const color = style.fill || "#000000";

    // Ensure LaTeX is pre-rendered and measured
    this.ensureMeasured();
    
    // Build HTML content using PRE-RENDERED LaTeX (SAME as Latex approach)
    let htmlContent = '<div style="display: inline-flex; align-items: baseline; flex-wrap: nowrap; margin: 0; padding: 0;">';
    
    this._segments.forEach((segment) => {
      if (segment.type === 'text') {
        htmlContent += `<span style="white-space: pre; margin: 0; padding: 0; display: inline-block;">${this.escapeHtml(segment.content)}</span>`;
      } else {
        // Use pre-rendered LaTeX (SAME approach as Latex for consistency)
        const renderedSvg = this._renderedLatexSegments.get(segment.index);
        if (renderedSvg) {
          htmlContent += `<span style="margin: 0; padding: 0; display: inline-block; vertical-align: middle;">${renderedSvg}</span>`;
        } else {
          htmlContent += `<span style="margin: 0; padding: 0; display: inline-block;">$${this.escapeHtml(segment.content)}$</span>`;
        }
      }
    });
    
    htmlContent += '</div>';

    const svg = `<foreignObject x="${absPos.x}" y="${absPos.y}" width="${this.textWidth}" height="${this.textHeight}" ${transformStr} overflow="visible">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${this._fontSize}px; font-family: ${this.config.fontFamily || 'sans-serif'}; font-weight: ${this.config.fontWeight || 'normal'}; color: ${color}; margin: 0; padding: 0; line-height: ${this._lineHeight}; overflow: visible;">${htmlContent}</div>
    </foreignObject>`;

    let debugRect = '';
    if (this.config.debug) {
      debugRect = `<rect x="${absPos.x}" y="${absPos.y}" width="${this.textWidth}" height="${this.textHeight}" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="5,5" />`;
    }

    return svg + debugRect;
  }

  /**
   * Escapes HTML special characters.
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

