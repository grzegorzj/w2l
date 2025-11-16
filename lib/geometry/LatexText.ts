/**
 * LatexText module - LaTeX/mathematical notation rendering.
 *
 * Provides LaTeX rendering with the same measurement capabilities as Text,
 * allowing you to query coordinates of formula parts for positioning and highlighting.
 *
 * @module geometry
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
   * Pre-renders the LaTeX content to SVG using KaTeX.
   * This needs to be done in a browser environment.
   * 
   * @internal
   */
  private prerenderLatex(): void {
    if (typeof window === 'undefined' || !(window as any).katex) {
      console.warn('KaTeX not available, LaTeX rendering will be skipped');
      return;
    }

    try {
      const katex = (window as any).katex;
      const displayMode = this.config.displayMode === "display";
      
      // Render LaTeX to MathML which can be embedded in SVG
      const html = katex.renderToString(this.config.content, {
        displayMode,
        output: 'mathml',
        throwOnError: false,
        fontSize: this._fontSize
      });
      
      // Convert MathML to something we can embed in SVG
      // KaTeX also has an HTML output which we'll need to convert
      const htmlOutput = katex.renderToString(this.config.content, {
        displayMode,
        output: 'html',
        throwOnError: false
      });
      
      // Store the HTML for measurement and create SVG foreignObject
      this._renderedSVG = htmlOutput;
    } catch (error) {
      console.error('Failed to render LaTeX:', error);
      this._renderedSVG = `<text fill="red">LaTeX Error: ${this.config.content}</text>`;
    }
  }

  /**
   * Ensures this LaTeX has been measured with actual browser metrics.
   * Called automatically when any dimension or position getter is accessed.
   * 
   * @internal
   */
  private ensureMeasured(): void {
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
      
      // Create temporary group to hold our LaTeX
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      tempDiv.style.fontSize = `${this._fontSize}px`;
      tempDiv.style.display = 'inline-block';
      tempDiv.style.margin = '0';
      tempDiv.style.padding = '0';
      tempDiv.innerHTML = this._renderedSVG;
      document.body.appendChild(tempDiv);
      
      // Measure dimensions
      const bbox = tempDiv.getBoundingClientRect();
      
      // Measure parts (individual elements with classes or tags)
      const parts = new Map<string, LatexPartBoundingBox>();
      
      // Find all measurable parts (spans with specific classes)
      const elements = tempDiv.querySelectorAll('.mord, .mbin, .mrel, .mop, .mfrac, .msqrt');
      elements.forEach((el, index) => {
        const partBbox = (el as HTMLElement).getBoundingClientRect();
        const className = el.className.split(' ')[0] || `part-${index}`;
        parts.set(className + `-${index}`, {
          x: partBbox.left - bbox.left,
          y: partBbox.top - bbox.top,
          width: partBbox.width,
          height: partBbox.height
        });
      });
      
      this._measuredDimensions = {
        totalWidth: bbox.width,
        totalHeight: bbox.height,
        parts
      };
      
      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.warn('LaTeX measurement failed:', error);
    }
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

    // Use foreignObject to embed HTML/MathML in SVG
    const svg = `<foreignObject x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}"${transform}>
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${this._fontSize}px; display: inline-block; margin: 0; padding: 0; line-height: 1;">
        ${this._renderedSVG}
      </div>
    </foreignObject>`;

    return comment + svg;
  }
}

