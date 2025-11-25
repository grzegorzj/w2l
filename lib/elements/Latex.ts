/**
 * Latex - Pure LaTeX formula rendering for the new layout system.
 *
 * Renders mathematical notation using MathJax with precise measurement
 * capabilities and annotation support for highlighting specific parts.
 */

import { Shape } from "../core/Shape.js";
import type { Style } from "../core/Stylable.js";
import { parseUnit } from "../core/units.js";
import {
  MATHJAX_EX_TO_EM_RATIO,
  MATHJAX_CONTAINER_WIDTH_MULTIPLIER,
  MATHJAX_UNITS_PER_EM,
} from "../core/mathjax-constants.js";

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
 * Represents an annotated element within a Latex formula.
 * Annotated using \cssId{id}{content} or \class{class}{content} commands.
 */
export interface AnnotatedLatexElement {
  /** ID or class name of the annotation */
  identifier: string;
  /** Type of annotation: 'id' or 'class' */
  type: "id" | "class";
  /** Bounding box of the annotated element */
  bbox: LatexPartBoundingBox;
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
 * Configuration for creating a Latex element.
 */
export interface LatexConfig {
  /**
   * The LaTeX content to render (without $ delimiters).
   *
   * @example
   * ```typescript
   * content: "E = mc^2"
   * content: "\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"
   * content: "\\int_0^\\infty e^{-x^2} dx"
   * ```
   */
  content: string;

  /**
   * Font size (supports units like "16px", "1rem", or numbers).
   * @defaultValue "16px"
   */
  fontSize?: string | number;

  /**
   * Display mode: false for inline math, true for display (block) math.
   * @defaultValue false
   */
  displayMode?: boolean;

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
 * Pure LaTeX formula rendering.
 *
 * The Latex class renders mathematical notation using MathJax and provides
 * measurement capabilities and annotation support for highlighting specific parts.
 *
 * @example
 * Create a simple formula
 * ```typescript
 * const formula = new Latex({
 *   content: "E = mc^2",
 *   fontSize: 24
 * });
 * ```
 *
 * @example
 * Create an annotated formula
 * ```typescript
 * const formula = new Latex({
 *   content: "E = \\cssId{power}{mc^2}",
 *   fontSize: 24
 * });
 * const power = formula.getElementById('power');
 * if (power) {
 *   // Use power.topLeft, power.center, etc. for highlighting
 * }
 * ```
 */
export class Latex extends Shape {
  private config: LatexConfig;
  private _fontSize: number;
  private _renderedSVG: string = "";

  /**
   * Cached measured dimensions from browser.
   * Populated lazily when measurement is needed.
   * @internal
   */
  private _measuredDimensions?: {
    width: number;
    height: number;
  };

  /**
   * Creates a new Latex instance.
   *
   * @param config - Configuration for the LaTeX element
   */
  constructor(config: LatexConfig) {
    super();
    this.config = config;
    this._fontSize =
      typeof config.fontSize === "number"
        ? config.fontSize
        : parseUnit(config.fontSize || "16px");

    // Apply style if provided
    if (config.style) {
      this._style = { ...config.style };
    }
  }

  /**
   * Pre-renders the LaTeX content to SVG using MathJax.
   * COPIED FROM OLD API - stores the rendered SVG for consistency.
   * @internal
   */
  private prerenderLatex(): void {
    if (typeof window === "undefined" || !(window as any).MathJax) {
      return;
    }

    try {
      const MathJax = (window as any).MathJax;
      const displayMode = this.config.displayMode || false;

      if (!MathJax.tex2svg) {
        return;
      }

      const node = MathJax.tex2svg(this.config.content, {
        display: displayMode,
        em: this._fontSize,
        ex: this._fontSize * MATHJAX_EX_TO_EM_RATIO,
        containerWidth: MATHJAX_CONTAINER_WIDTH_MULTIPLIER * this._fontSize,
      });

      const svg = node.querySelector("svg");
      if (svg) {
        // COPIED FROM OLD API - apply scaling here
        svg.removeAttribute("width");
        svg.removeAttribute("height");

        const viewBox = svg.getAttribute("viewBox");
        if (viewBox) {
          const [minX, minY, vbWidth, vbHeight] = viewBox
            .split(" ")
            .map(Number);
          const scale = this._fontSize / MATHJAX_UNITS_PER_EM;
          svg.setAttribute("width", `${vbWidth * scale}px`);
          svg.setAttribute("height", `${vbHeight * scale}px`);
        }

        this._renderedSVG = svg.outerHTML;
      } else {
        this._renderedSVG = node.outerHTML;
      }
    } catch (error) {
      this._renderedSVG = `<text fill="red">LaTeX Error: ${this.config.content}</text>`;
    }
  }

  /**
   * Perform measurement of LaTeX dimensions.
   * Called automatically when dimensions are needed.
   *
   * @internal
   */
  private ensureMeasured(): void {
    if (this._measuredDimensions) {
      return;
    }

    // Pre-render if not already done
    if (!this._renderedSVG) {
      this.prerenderLatex();
    }

    if (typeof document === "undefined") {
      return;
    }

    try {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.visibility = "hidden";
      container.innerHTML = this._renderedSVG;
      document.body.appendChild(container);

      // Measure the container
      const bbox = container.getBoundingClientRect();

      this._measuredDimensions = {
        width: bbox.width,
        height: bbox.height,
      };

      document.body.removeChild(container);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Gets the width of the LaTeX formula.
   */
  get latexWidth(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.width || 100;
  }

  /**
   * Gets the height of the LaTeX formula.
   */
  get latexHeight(): number {
    this.ensureMeasured();
    return this._measuredDimensions?.height || this._fontSize * 1.2;
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
   * Gets the bounding box of this element.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const absPos = this.getAbsolutePosition();
    return {
      minX: absPos.x,
      minY: absPos.y,
      maxX: absPos.x + this.latexWidth,
      maxY: absPos.y + this.latexHeight,
    };
  }

  /**
   * Gets the rotation center (center of the formula).
   */
  protected getRotationCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth / 2,
      y: absPos.y + this.latexHeight / 2,
    };
  }

  /**
   * Gets the corners of the formula box.
   */
  getCorners(): { x: number; y: number }[] {
    const absPos = this.getAbsolutePosition();
    return [
      { x: absPos.x, y: absPos.y }, // topLeft
      { x: absPos.x + this.latexWidth, y: absPos.y }, // topRight
      { x: absPos.x + this.latexWidth, y: absPos.y + this.latexHeight }, // bottomRight
      { x: absPos.x, y: absPos.y + this.latexHeight }, // bottomLeft
    ];
  }

  /**
   * Standard reference points for positioning.
   */
  get center(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth / 2,
      y: absPos.y + this.latexHeight / 2,
    };
  }

  get topLeft(): { x: number; y: number } {
    return this.getAbsolutePosition();
  }

  get topCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth / 2,
      y: absPos.y,
    };
  }

  get topRight(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth,
      y: absPos.y,
    };
  }

  get leftCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x,
      y: absPos.y + this.latexHeight / 2,
    };
  }

  get rightCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth,
      y: absPos.y + this.latexHeight / 2,
    };
  }

  get bottomLeft(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x,
      y: absPos.y + this.latexHeight,
    };
  }

  get bottomCenter(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth / 2,
      y: absPos.y + this.latexHeight,
    };
  }

  get bottomRight(): { x: number; y: number } {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.latexWidth,
      y: absPos.y + this.latexHeight,
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

  /**
   * Creates an annotated element with reference points from a bbox.
   * @internal
   */
  private createAnnotatedElement(
    identifier: string,
    type: "id" | "class",
    bbox: LatexPartBoundingBox,
    element: SVGElement
  ): AnnotatedLatexElement {
    // Convert bbox (relative to latex container) to absolute world coordinates
    const absPos = this.getAbsolutePosition();
    const absBbox = {
      x: absPos.x + bbox.x,
      y: absPos.y + bbox.y,
      width: bbox.width,
      height: bbox.height,
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
      },
    };
  }

  /**
   * Gets an annotated element by its ID within the LaTeX formula.
   * Use \cssId{id}{content} in your LaTeX to mark elements.
   *
   * @param id - The ID assigned using \cssId command
   * @returns The annotated element with position info, or null if not found
   *
   * @example
   * ```typescript
   * const latex = new Latex({
   *   content: "E = \\cssId{power}{mc^2}"
   * });
   *
   * const powerElement = latex.getElementById('power');
   * if (powerElement) {
   *   // Use reference points: powerElement.center, powerElement.topLeft, etc.
   * }
   * ```
   */
  getElementById(id: string): AnnotatedLatexElement | null {
    this.ensureMeasured();

    if (typeof document === "undefined") {
      return null;
    }

    try {
      // COPIED EXACTLY FROM OLD API - use pre-rendered SVG for consistency
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.visibility = "hidden";
      container.innerHTML = this._renderedSVG;
      document.body.appendChild(container);

      // Find element with the ID
      const svgElement = container.querySelector(`#${CSS.escape(id)}`);

      if (svgElement && svgElement instanceof SVGElement) {
        const bbox = svgElement.getBoundingClientRect();
        const containerBbox = container.getBoundingClientRect();

        console.log(
          `[Measurement] ID="${id}" | width=${bbox.width.toFixed(2)} height=${bbox.height.toFixed(2)} | relX=${(bbox.left - containerBbox.left).toFixed(2)} relY=${(bbox.top - containerBbox.top).toFixed(2)}`
        );

        const relativeBbox: LatexPartBoundingBox = {
          x: bbox.left - containerBbox.left,
          y: bbox.top - containerBbox.top,
          width: bbox.width,
          height: bbox.height,
        };

        const result = this.createAnnotatedElement(
          id,
          "id",
          relativeBbox,
          svgElement
        );

        document.body.removeChild(container);
        return result;
      }

      document.body.removeChild(container);
    } catch (error) {
      // Silent fail
    }

    return null;
  }

  /**
   * Gets all annotated elements with a specific class within the LaTeX formula.
   * Use \class{classname}{content} in your LaTeX to mark elements.
   *
   * @param className - The class name assigned using \class command
   * @returns Array of annotated elements with position info
   *
   * @example
   * ```typescript
   * const latex = new Latex({
   *   content: "\\class{var}{x}^2 + \\class{var}{y}^2 = \\class{var}{z}^2"
   * });
   *
   * const variables = latex.getElementsByClass('var');
   * variables.forEach(v => {
   *   // Use v.topLeft, v.center, etc. for highlighting
   * });
   * ```
   */
  getElementsByClass(className: string): AnnotatedLatexElement[] {
    this.ensureMeasured();

    if (typeof document === "undefined") {
      return [];
    }

    try {
      // COPIED EXACTLY FROM OLD API - use pre-rendered SVG for consistency
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.visibility = "hidden";
      container.innerHTML = this._renderedSVG;
      document.body.appendChild(container);

      // Find all elements with the class
      const elements = container.querySelectorAll(`.${CSS.escape(className)}`);
      const results: AnnotatedLatexElement[] = [];

      const containerBbox = container.getBoundingClientRect();

      elements.forEach((svgElement, index) => {
        if (svgElement instanceof SVGElement) {
          const bbox = svgElement.getBoundingClientRect();

          console.log(
            `[Measurement] class="${className}"[${index}] | width=${bbox.width.toFixed(2)} height=${bbox.height.toFixed(2)} | relX=${(bbox.left - containerBbox.left).toFixed(2)} relY=${(bbox.top - containerBbox.top).toFixed(2)}`
          );

          const relativeBbox: LatexPartBoundingBox = {
            x: bbox.left - containerBbox.left,
            y: bbox.top - containerBbox.top,
            width: bbox.width,
            height: bbox.height,
          };

          results.push(
            this.createAnnotatedElement(
              className,
              "class",
              relativeBbox,
              svgElement
            )
          );
        }
      });

      document.body.removeChild(container);
      return results;
    } catch (error) {
      return [];
    }
  }

  /**
   * Renders the LaTeX formula to SVG.
   * COPIED FROM OLD API - embeds SVG directly, no foreignObject wrapper!
   */
  render(): string {
    const absPos = this.getAbsolutePosition();
    const transformStr = this.getTransformAttribute();

    // Ensure LaTeX is pre-rendered and measured
    this.ensureMeasured();

    // COPIED FROM OLD API - if we have SVG, embed it directly!
    if (this._renderedSVG.startsWith("<svg")) {
      // Build transform
      let fullTransform = `translate(${absPos.x}, ${absPos.y})`;
      if (transformStr) {
        fullTransform += ` ${transformStr.replace('transform="', "").replace('"', "")}`;
      }

      // Create a positioned SVG group - NO foreignObject wrapper!
      const positionedSvg = `<g transform="${fullTransform}">${this._renderedSVG}</g>`;

      let debugRect = "";
      if (this.config.debug) {
        debugRect = `<rect x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="5,5" />`;
      }

      return positionedSvg + debugRect;
    }

    // Fallback: use foreignObject (shouldn't happen with MathJax)
    const defaultStyle: Partial<Style> = {
      fill: "#000000",
    };
    const style = { ...defaultStyle, ...this._style };
    const color = style.fill || "#000000";

    const svg = `<foreignObject x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}" ${transformStr}>
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${this._fontSize}px; color: ${color}; display: inline-block; margin: 0; padding: 0; line-height: 1;">
        ${this._renderedSVG}
      </div>
    </foreignObject>`;

    let debugRect = "";
    if (this.config.debug) {
      debugRect = `<rect x="${absPos.x}" y="${absPos.y}" width="${this.latexWidth}" height="${this.latexHeight}" fill="none" stroke="blue" stroke-width="2" stroke-dasharray="5,5" />`;
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
