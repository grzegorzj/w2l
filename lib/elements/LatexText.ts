/**
 * LatexText module - LaTeX/mathematical notation rendering.
 *
 * Provides LaTeX rendering with the same measurement capabilities as Text,
 * allowing you to query coordinates of formula parts for positioning and highlighting.
 *
 * @module elements
 */

import { Shape } from "../core/Shape.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import type { Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";

/**
 * Bounding box for a LaTeX element part.
 */
export interface LatexPartBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Result of a pattern match in LaTeX content.
 */
export interface LatexMatch {
  /** The matched LaTeX source */
  match: string;
  /** Bounding box of the entire formula (part-level matching not yet supported) */
  bbox: LatexPartBoundingBox;
  /** Character offset within the LaTeX source */
  charOffset: number;
}

/**
 * Represents an annotated element within a LaTeX formula.
 * Annotated using \cssId{id}{content} or \class{class}{content} commands.
 * Provides the same positioning API as other elements.
 */
export interface AnnotatedLatexElement {
  /** ID or class name of the annotation */
  identifier: string;
  /** Type of annotation: 'id' or 'class' */
  type: 'id' | 'class';
  /** Bounding box of the annotated element */
  bbox: LatexPartBoundingBox;
  /** The SVG element itself */
  element: SVGElement;
  
  // Reference points for positioning (same as Bounded elements)
  /** Center point of the element */
  readonly center: Point;
  /** Top-left corner */
  readonly topLeft: Point;
  /** Top-center point */
  readonly topCenter: Point;
  /** Top-right corner */
  readonly topRight: Point;
  /** Left-center point */
  readonly leftCenter: Point;
  /** Right-center point */
  readonly rightCenter: Point;
  /** Bottom-left corner */
  readonly bottomLeft: Point;
  /** Bottom-center point */
  readonly bottomCenter: Point;
  /** Bottom-right corner */
  readonly bottomRight: Point;
  
  // Convenient aliases
  /** Alias for topCenter */
  readonly top: Point;
  /** Alias for bottomCenter */
  readonly bottom: Point;
  /** Alias for leftCenter */
  readonly left: Point;
  /** Alias for rightCenter */
  readonly right: Point;
}

/**
 * Configuration for creating a LatexText element.
 */
export interface LatexTextConfig {
  /**
   * The LaTeX content to render.
   * 
   * @example
   * ```typescript
   * content: "E = mc^2"
   * content: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
   * content: "\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}"
   * ```
   */
  content: string;

  /**
   * Font size for the LaTeX (supports units like "16px", "1rem", or numbers).
   * @defaultValue "16px"
   */
  fontSize?: string | number;

  /**
   * Display style: inline for smaller inline math, display for larger block math.
   * @defaultValue "inline"
   */
  displayMode?: "inline" | "display";

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties for the container.
   * Note: LaTeX rendering uses its own styling, this applies to the container.
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
 * LaTeX text rendering with measurement capabilities.
 *
 * The LatexText class renders mathematical notation using KaTeX and provides
 * the same measurement and positioning capabilities as regular Text.
 *
 * @example
 * Create a simple formula
 * ```typescript
 * const formula = new LatexText({
 *   content: "E = mc^2",
 *   fontSize: "24px",
 *   displayMode: "inline"
 * });
 * ```
 *
 * @example
 * Create a complex equation
 * ```typescript
 * const equation = new LatexText({
 *   content: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}",
 *   fontSize: "32px",
 *   displayMode: "display"
 * });
 * ```
 */
export class LatexText extends Shape {
  private config: LatexTextConfig;
  private _fontSize: number;
  private _renderedSVG: string = "";
  
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
    totalWidth: number;
    totalHeight: number;
    parts: Map<string, LatexPartBoundingBox>;
  };

  /**
   * Creates a new LatexText instance.
   *
   * @param config - Configuration for the LaTeX element
   */
  constructor(config: LatexTextConfig) {
    super(config.name);
    this.config = config;
    this._fontSize = parseUnit(config.fontSize || "16px");
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
    // Pre-render the LaTeX to SVG
    this.prerenderLatex();
  }

  /**
   * Pre-renders the LaTeX content to SVG using MathJax.
   * This needs to be done in a browser environment.
   * 
   * @internal
   */
  private prerenderLatex(): void {
    if (typeof window === 'undefined' || !(window as any).MathJax) {
      console.warn('MathJax not available, LaTeX rendering will be skipped');
      return;
    }

    try {
      const MathJax = (window as any).MathJax;
      const displayMode = this.config.displayMode === "display";
      
      // Wait for MathJax to be ready
      if (!MathJax.tex2svg) {
        console.warn('MathJax not fully loaded yet');
        return;
      }
      
      // Render LaTeX to SVG using MathJax
      // Pass em and ex sizes to ensure pixel-accurate rendering
      const node = MathJax.tex2svg(this.config.content, {
        display: displayMode,
        em: this._fontSize,        // Set em size to our font size in pixels
        ex: this._fontSize * 0.5,  // ex is typically half of em
        containerWidth: 80 * this._fontSize  // Large container width for proper layout
      });
      
      // Extract the SVG element and convert to string
      const svg = node.querySelector('svg');
      if (svg) {
        // Remove width and height attributes with ex units - they cause scaling issues
        // Keep viewBox for proper scaling
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        
        // Set explicit width/height in pixels based on viewBox
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
          const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          // MathJax uses 1000 units per em
          const scale = this._fontSize / 1000;
          svg.setAttribute('width', `${vbWidth * scale}px`);
          svg.setAttribute('height', `${vbHeight * scale}px`);
        }
        
        // Store the SVG with pixel dimensions
        this._renderedSVG = svg.outerHTML;
      } else {
        this._renderedSVG = node.outerHTML;
      }
    } catch (error) {
      console.error('Failed to render LaTeX:', error);
      this._renderedSVG = `<text fill="red">LaTeX Error: ${this.config.content}</text>`;
    }
  }

  /**
   * Perform measurement of LaTeX dimensions.
   * Overrides Element.performMeasurement().
   * 
   * @internal
   */
  protected performMeasurement(): void {
    // Already measured?
    if (this._measuredDimensions) {
      return;
    }
    
    // No DOM access available?
    if (!this._measurementContainerGetter || typeof document === 'undefined') {
      return;
    }
    
    try {
      const container = this._measurementContainerGetter();
      
      // Create temporary group to hold our LaTeX SVG
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.fontSize = `${this._fontSize}px`;
      tempDiv.style.display = 'inline-block';
      tempDiv.style.margin = '0';
      tempDiv.style.padding = '0';
      tempDiv.innerHTML = this._renderedSVG;
      
      document.body.appendChild(tempDiv);
      
      // Measure the actual SVG element, not the wrapper
      const svgElement = tempDiv.querySelector('svg');
      let bbox;
      let browserRenderedSize: { width: number; height: number } | null = null;
      let viewBoxCalculatedSize: { width: number; height: number } | null = null;
      
      if (svgElement) {
        // Get what the browser actually renders (with ex units)
        const browserBbox = svgElement.getBoundingClientRect();
        browserRenderedSize = { width: browserBbox.width, height: browserBbox.height };
        
        // Also calculate from viewBox for comparison
        const viewBox = svgElement.getAttribute('viewBox');
        
        if (viewBox) {
          // Parse viewBox: "minX minY width height"
          const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          
          // MathJax uses 1000 units per em
          const scale = this._fontSize / 1000;
          viewBoxCalculatedSize = {
            width: vbWidth * scale,
            height: vbHeight * scale
          };
          
          // Use viewBox calculation for dimensions, but keep browser position for part offsets
          bbox = {
            width: vbWidth * scale,
            height: vbHeight * scale,
            left: browserBbox.left,  // Use actual screen position for offset calculations
            top: browserBbox.top,    // Use actual screen position for offset calculations
            right: browserBbox.left + vbWidth * scale,
            bottom: browserBbox.top + vbHeight * scale,
            x: browserBbox.x,
            y: browserBbox.y
          } as DOMRect;
        } else {
          // No viewBox, use browser measurement
          bbox = browserBbox;
        }
      } else {
        // Fallback to div if no SVG found
        bbox = tempDiv.getBoundingClientRect();
      }
      
      // Measure parts (individual elements with MathJax structure)
      const parts = new Map<string, LatexPartBoundingBox>();
      
      // Find all measurable parts - MathJax uses <g> elements with data-mml-node attributes
      const searchRoot = svgElement || tempDiv;
      const elements = searchRoot.querySelectorAll('g[data-mml-node]');
      elements.forEach((el, index) => {
        const partBbox = (el as SVGElement).getBoundingClientRect();
        const mmlNode = el.getAttribute('data-mml-node') || `part`;
        
        // Only include parts with reasonable size (filter out tiny structural elements)
        if (partBbox.width > 1 && partBbox.height > 1) {
          parts.set(`${mmlNode}-${index}`, {
            x: partBbox.left - bbox.left,
            y: partBbox.top - bbox.top,
            width: partBbox.width,
            height: partBbox.height
          });
        }
      });
      
      this._measuredDimensions = {
        totalWidth: bbox.width,
        totalHeight: bbox.height,
        parts
      };
      
      // Debug logging if debug mode enabled
      if (this.config.debug) {
        let svgUnits = { width: 'unknown', height: 'unknown' };
        let viewBoxInfo = 'none';
        let calculationMethod = 'unknown';
        
        if (svgElement) {
          svgUnits = {
            width: svgElement.getAttribute('width') || 'unknown',
            height: svgElement.getAttribute('height') || 'unknown'
          };
          
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            const scale = this._fontSize / 1000;
            viewBoxInfo = `${vbWidth} x ${vbHeight} (scaled: ${vbWidth * scale} x ${vbHeight * scale})`;
            calculationMethod = 'viewBox with scale';
          } else {
            calculationMethod = 'getBoundingClientRect';
          }
        }
        
        console.log(`[LatexText Debug] ${this.config.name || 'unnamed'}:`, {
          content: this.config.content,
          finalDimensions: { width: bbox.width, height: bbox.height },
          browserRendered: browserRenderedSize,
          viewBoxCalculated: viewBoxCalculatedSize,
          calculationMethod,
          viewBox: viewBoxInfo,
          svgUnits: svgUnits,
          fontSize: this._fontSize,
          emSize: this._fontSize,
          exSize: this._fontSize * 0.5,
          scale: this._fontSize / 1000,
          displayMode: this.config.displayMode,
          svgFound: !!svgElement,
          partsFound: this._measuredDimensions.parts.size,
          partSample: Array.from(this._measuredDimensions.parts.keys()).slice(0, 5)
        });
      }
      
      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.warn('LaTeX measurement failed:', error);
    }
  }

  /**
   * Ensures this LaTeX has been measured with actual browser metrics.
   * Backward compatibility wrapper - calls measure().
   * 
   * @internal
   * @deprecated Use measure() instead
   */
  private ensureMeasured(): void {
    this.measure();
  }

  /**
   * Gets the width of the LaTeX element.
   * 
   * @returns The width in pixels
   */
  get latexWidth(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.totalWidth || 100; // fallback estimate
  }

  /**
   * Gets the height of the LaTeX element.
   * 
   * @returns The height in pixels
   */
  get latexHeight(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.totalHeight || 30; // fallback estimate
  }

  /**
   * Alias for latexWidth (for compatibility with layout systems).
   */
  get width(): number {
    return this.latexWidth;
  }

  /**
   * Alias for latexHeight (for compatibility with layout systems).
   */
  get height(): number {
    return this.latexHeight;
  }

  /**
   * Gets the geometric center of the LaTeX element.
   *
   * @returns The center point
   */
  get center(): Point {
    return this.toAbsolutePoint(this.latexWidth / 2, this.latexHeight / 2);
  }

  /**
   * Standard reference points for positioning.
   */
  get topLeft(): Point {
    return this.toAbsolutePoint(0, 0);
  }

  get topCenter(): Point {
    return this.toAbsolutePoint(this.latexWidth / 2, 0);
  }

  get topRight(): Point {
    return this.toAbsolutePoint(this.latexWidth, 0);
  }

  get leftCenter(): Point {
    return this.toAbsolutePoint(0, this.latexHeight / 2);
  }

  get rightCenter(): Point {
    return this.toAbsolutePoint(this.latexWidth, this.latexHeight / 2);
  }

  get bottomLeft(): Point {
    return this.toAbsolutePoint(0, this.latexHeight);
  }

  get bottomCenter(): Point {
    return this.toAbsolutePoint(this.latexWidth / 2, this.latexHeight);
  }

  get bottomRight(): Point {
    return this.toAbsolutePoint(this.latexWidth, this.latexHeight);
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
   * Gets the bounding box for a specific part of the LaTeX formula.
   * Parts are identified by their CSS class and index.
   * 
   * @param partId - Identifier for the part (e.g., "mord-0", "mfrac-1")
   * @returns Bounding box of the part, or null if not available
   */
  getPartBoundingBox(partId: string): LatexPartBoundingBox | null {
    this.ensureMeasured();
    return this._measuredDimensions?.parts.get(partId) || null;
  }

  /**
   * Gets the center point of a specific part of the formula.
   * 
   * @param partId - Identifier for the part
   * @returns Center point of the part, or null if not available
   */
  getPartCenter(partId: string): Point | null {
    const bbox = this.getPartBoundingBox(partId);
    if (!bbox) {
      return null;
    }
    
    return {
      x: `${bbox.x + bbox.width / 2}px`,
      y: `${bbox.y + bbox.height / 2}px`
    };
  }

  /**
   * Gets all available part IDs that can be queried.
   * 
   * @returns Array of part identifiers
   */
  getAvailableParts(): string[] {
    this.ensureMeasured();
    return Array.from(this._measuredDimensions?.parts.keys() || []);
  }

  /**
   * Finds all occurrences of a pattern in the LaTeX source and returns their bounding boxes.
   * Note: Currently returns the bounding box of the entire formula for each match.
   * Fine-grained part-level bounding boxes may be added in the future.
   * 
   * @param pattern - String or RegExp pattern to search for in the LaTeX source
   * @returns Array of matches with their bounding boxes
   * 
   * @example
   * Find power notation
   * ```typescript
   * const latex = new LatexText({
   *   content: "E = mc^2"
   * });
   * const matches = latex.findMatches(/\^2/);
   * matches.forEach(match => {
   *   console.log(`Found "${match.match}" at offset ${match.charOffset}`);
   *   // Use match.bbox to create highlights
   * });
   * ```
   * 
   * @example
   * Find all fractions
   * ```typescript
   * const matches = latex.findMatches(/\\frac/);
   * ```
   */
  findMatches(pattern: string | RegExp): LatexMatch[] {
    this.ensureMeasured();
    
    const content = this.config.content || '';
    const regex = typeof pattern === 'string' 
      ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      : new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
    
    const matches: LatexMatch[] = [];
    let match: RegExpExecArray | null;
    
    // Get the bounding box of the entire latex element
    const bbox = {
      x: 0,
      y: 0,
      width: this.latexWidth,
      height: this.latexHeight
    };
    
    // Find all matches in the source
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        match: match[0],
        bbox,
        charOffset: match.index
      });
    }
    
    return matches;
  }

  /**
   * Creates an annotated element with reference points from a bbox.
   * @internal
   */
  private createAnnotatedElement(
    identifier: string,
    type: 'id' | 'class',
    bbox: LatexPartBoundingBox,
    element: SVGElement
  ): AnnotatedLatexElement {
    return {
      identifier,
      type,
      bbox,
      element,
      // Reference points
      get center(): Point {
        return {
          x: `${bbox.x + bbox.width / 2}px`,
          y: `${bbox.y + bbox.height / 2}px`
        };
      },
      get topLeft(): Point {
        return {
          x: `${bbox.x}px`,
          y: `${bbox.y}px`
        };
      },
      get topCenter(): Point {
        return {
          x: `${bbox.x + bbox.width / 2}px`,
          y: `${bbox.y}px`
        };
      },
      get topRight(): Point {
        return {
          x: `${bbox.x + bbox.width}px`,
          y: `${bbox.y}px`
        };
      },
      get leftCenter(): Point {
        return {
          x: `${bbox.x}px`,
          y: `${bbox.y + bbox.height / 2}px`
        };
      },
      get rightCenter(): Point {
        return {
          x: `${bbox.x + bbox.width}px`,
          y: `${bbox.y + bbox.height / 2}px`
        };
      },
      get bottomLeft(): Point {
        return {
          x: `${bbox.x}px`,
          y: `${bbox.y + bbox.height}px`
        };
      },
      get bottomCenter(): Point {
        return {
          x: `${bbox.x + bbox.width / 2}px`,
          y: `${bbox.y + bbox.height}px`
        };
      },
      get bottomRight(): Point {
        return {
          x: `${bbox.x + bbox.width}px`,
          y: `${bbox.y + bbox.height}px`
        };
      },
      // Convenient aliases
      get top(): Point {
        return this.topCenter;
      },
      get bottom(): Point {
        return this.bottomCenter;
      },
      get left(): Point {
        return this.leftCenter;
      },
      get right(): Point {
        return this.rightCenter;
      }
    };
  }

  /**
   * Gets an annotated element by its ID.
   * Use \cssId{id}{content} in your LaTeX source to mark elements.
   * 
   * @param id - The ID assigned using \cssId command
   * @returns The annotated element with position info, or null if not found
   * 
   * @example
   * ```typescript
   * const latex = new LatexText({
   *   content: "E = \\cssId{mass-energy}{mc^2}"
   * });
   * 
   * const element = latex.getElementById('mass-energy');
   * if (element) {
   *   // Use reference points like other elements
   *   circle.position({
   *     relativeFrom: circle.center,
   *     relativeTo: element.center,
   *     x: "0px",
   *     y: "0px"
   *   });
   * }
   * ```
   */
  getElementById(id: string): AnnotatedLatexElement | null {
    this.ensureMeasured();
    
    if (!this._measurementContainerGetter || typeof document === 'undefined') {
      return null;
    }
    
    try {
      // Create a temporary container to query the rendered SVG
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      container.innerHTML = this._renderedSVG;
      document.body.appendChild(container);
      
      // Find element with the ID
      const svgElement = container.querySelector(`#${CSS.escape(id)}`);
      
      if (svgElement && svgElement instanceof SVGElement) {
        const bbox = svgElement.getBoundingClientRect();
        const containerBbox = container.getBoundingClientRect();
        
        const relativeBbox: LatexPartBoundingBox = {
          x: bbox.left - containerBbox.left,
          y: bbox.top - containerBbox.top,
          width: bbox.width,
          height: bbox.height
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
   * Gets all annotated elements with a specific class.
   * Use \class{classname}{content} in your LaTeX source to mark elements.
   * 
   * @param className - The class name assigned using \class command
   * @returns Array of annotated elements with position info
   * 
   * @example
   * ```typescript
   * const latex = new LatexText({
   *   content: "\\class{variable}{x}^2 + \\class{variable}{y}^2 = \\class{variable}{r}^2"
   * });
   * 
   * const variables = latex.getElementsByClass('variable');
   * variables.forEach(v => {
   *   console.log(`Variable at (${v.bbox.x}, ${v.bbox.y})`);
   * });
   * ```
   */
  getElementsByClass(className: string): AnnotatedLatexElement[] {
    this.ensureMeasured();
    
    if (!this._measurementContainerGetter || typeof document === 'undefined') {
      return [];
    }
    
    try {
      // Create a temporary container to query the rendered SVG
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.visibility = 'hidden';
      container.innerHTML = this._renderedSVG;
      document.body.appendChild(container);
      
      // Find all elements with the class
      const elements = container.querySelectorAll(`.${CSS.escape(className)}`);
      const results: AnnotatedLatexElement[] = [];
      
      const containerBbox = container.getBoundingClientRect();
      
      elements.forEach(svgElement => {
        if (svgElement instanceof SVGElement) {
          const bbox = svgElement.getBoundingClientRect();
          
          const relativeBbox: LatexPartBoundingBox = {
            x: bbox.left - containerBbox.left,
            y: bbox.top - containerBbox.top,
            width: bbox.width,
            height: bbox.height
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
   * Updates the LaTeX content and forces re-rendering.
   * 
   * @param newContent - The new LaTeX content
   */
  updateContent(newContent: string): void {
    this.config.content = newContent;
    this._measuredDimensions = undefined;
    this.prerenderLatex();
  }

  /**
   * Renders the LaTeX to SVG using foreignObject.
   * 
   * @returns SVG representation of the LaTeX
   */
  render(): string {
    const comment = this.getSVGComment();
    const absPos = this.getAbsolutePosition();
    const transformStr = this.getTransformString();
    const transform = transformStr ? ` transform="${transformStr}"` : "";

    // MathJax renders to SVG, so we can embed it more directly
    // We'll still use foreignObject for consistent positioning, or extract the SVG directly
    if (this._renderedSVG.startsWith('<svg')) {
      // MathJax SVG - extract and position it
      // Parse the SVG to adjust its position
      const svgMatch = this._renderedSVG.match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
      if (svgMatch) {
        const svgAttrs = svgMatch[1];
        const svgContent = svgMatch[2];
        
        // Build full transform
        let fullTransform = `translate(${absPos.x}, ${absPos.y})`;
        if (transformStr) {
          const match = transformStr.match(/transform="([^"]*)"/);
          if (match) {
            fullTransform += ` ${match[1]}`;
          }
        }
        
        // Create a positioned SVG group
        const positionedSvg = `<g transform="${fullTransform}">${this._renderedSVG}</g>`;
        
        // Add debug rectangle if debug mode is enabled
        let debugRect = '';
        if (this.config.debug) {
          debugRect = `<rect x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}" fill="none" stroke="red" stroke-width="2" stroke-dasharray="5,5" />`;
        }
        
        return comment + positionedSvg + debugRect;
      }
    }
    
    // Fallback: use foreignObject
    const svg = `<foreignObject x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}"${transform}>
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${this._fontSize}px; display: inline-block; margin: 0; padding: 0; line-height: 1;">
        ${this._renderedSVG}
      </div>
    </foreignObject>`;

    // Add debug rectangle if debug mode is enabled
    let debugRect = '';
    if (this.config.debug) {
      debugRect = `<rect x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}" fill="none" stroke="red" stroke-width="2" stroke-dasharray="5,5" />`;
    }

    return comment + svg + debugRect;
  }
}

