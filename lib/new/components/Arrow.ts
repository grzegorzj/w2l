/**
 * New layout system - Arrow component
 * Directional arrow with customizable arrowheads
 */

import { NewElement, type Position } from "../core/Element.js";
import { NewLine } from "../elements/Line.js";
import { type Style } from "../../core/Stylable.js";

/**
 * Arrow head style options.
 */
export type ArrowHeadStyle = "triangle" | "line" | "none";

export interface NewArrowConfig {
  /**
   * Starting point of the arrow.
   */
  start: Position;

  /**
   * Ending point of the arrow (where the arrowhead is positioned).
   */
  end: Position;

  /**
   * Style of the arrowhead.
   * - "triangle": Filled triangle arrowhead (default)
   * - "line": V-shaped line arrowhead
   * - "none": No arrowhead (just a line)
   *
   * @default "triangle"
   */
  headStyle?: ArrowHeadStyle;

  /**
   * Size of the arrowhead in pixels.
   *
   * @default 10
   */
  headSize?: number;

  /**
   * Whether to show an arrowhead at the start point as well.
   *
   * @default false
   */
  doubleEnded?: boolean;

  /**
   * Visual styling properties (stroke, strokeWidth, etc.).
   */
  style?: Partial<Style>;
}

/**
 * Arrow component for creating directional indicators.
 *
 * The NewArrow class is a composite element that combines a line with
 * arrowheads. It extends NewElement since it's composed of multiple primitives.
 *
 * Arrows are useful for:
 * - Flowcharts and diagrams
 * - Annotations and labels
 * - Showing direction or flow
 * - Connecting related elements
 *
 * @remarks
 * Arrows use SVG markers for arrowheads, which are automatically
 * generated and included in the SVG output.
 *
 * @example
 * Create a basic arrow
 * ```typescript
 * const arrow = new NewArrow({
 *   start: { x: 100, y: 100 },
 *   end: { x: 300, y: 100 },
 *   style: {
 *     stroke: "#3498db",
 *     strokeWidth: 2
 *   }
 * });
 * ```
 *
 * @example
 * Create a double-ended arrow
 * ```typescript
 * const arrow = new NewArrow({
 *   start: circle1.center,
 *   end: circle2.center,
 *   doubleEnded: true,
 *   headSize: 12,
 *   style: {
 *     stroke: "#e74c3c",
 *     strokeWidth: 3
 *   }
 * });
 * ```
 */
export class NewArrow extends NewElement {
  private headStyle: ArrowHeadStyle;
  private headSize: number;
  private doubleEnded: boolean;
  private _style: Partial<Style>;
  private line: NewLine;
  private markerId: string;

  // Static counter for unique marker IDs
  private static markerCounter = 0;

  /**
   * Creates a new NewArrow instance.
   *
   * @param config - Configuration for the arrow
   */
  constructor(config: NewArrowConfig) {
    super();

    this.headStyle = config.headStyle || "triangle";
    this.headSize = config.headSize || 10;
    this.doubleEnded = config.doubleEnded || false;
    this._style = config.style || {};

    // Generate unique marker ID
    this.markerId = `arrow-marker-${NewArrow.markerCounter++}`;

    // Create the line component
    this.line = new NewLine({
      start: config.start,
      end: config.end,
      style: config.style,
    });

    // Add line as a child
    this.addElement(this.line);
  }

  /**
   * Gets the starting point of the arrow.
   *
   * @returns The start point
   */
  get start(): Position {
    return this.line.start;
  }

  /**
   * Gets the ending point of the arrow.
   *
   * @returns The end point
   */
  get end(): Position {
    return this.line.end;
  }

  /**
   * Gets the center point of the arrow.
   *
   * @returns The center point (midpoint of the line)
   */
  get center(): Position {
    return this.line.center;
  }

  /**
   * Gets the length of the arrow in pixels.
   *
   * @returns The length of the arrow
   */
  get length(): number {
    return this.line.length;
  }

  /**
   * Gets the bounding box of the arrow.
   * Uses the underlying line's bounding box.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    return this.line.getBoundingBox();
  }

  /**
   * Generate the SVG marker definition for the arrowhead.
   *
   * @returns SVG marker definition
   * @internal
   */
  private generateMarker(): string {
    const stroke = this._style.stroke || "#000000";
    const fill = this._style.fill || stroke;
    const strokeWidth = this._style.strokeWidth || 1;

    if (this.headStyle === "none") {
      return "";
    }

    if (this.headStyle === "triangle") {
      // Filled triangle arrowhead
      return `
        <marker id="${this.markerId}" markerWidth="${this.headSize}" markerHeight="${this.headSize}" 
                refX="${this.headSize * 0.8}" refY="${this.headSize / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polygon points="0,0 ${this.headSize},${this.headSize / 2} 0,${this.headSize}" 
                   fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    if (this.headStyle === "line") {
      // V-shaped line arrowhead
      return `
        <marker id="${this.markerId}" markerWidth="${this.headSize}" markerHeight="${this.headSize}" 
                refX="${this.headSize * 0.7}" refY="${this.headSize / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polyline points="0,0 ${this.headSize * 0.7},${this.headSize / 2} 0,${this.headSize}" 
                    fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    return "";
  }

  /**
   * Generate the SVG marker definition for the start arrowhead (if double-ended).
   *
   * @returns SVG marker definition
   * @internal
   */
  private generateStartMarker(): string {
    if (!this.doubleEnded) {
      return "";
    }

    const stroke = this._style.stroke || "#000000";
    const fill = this._style.fill || stroke;
    const strokeWidth = this._style.strokeWidth || 1;
    const startMarkerId = `${this.markerId}-start`;

    if (this.headStyle === "none") {
      return "";
    }

    if (this.headStyle === "triangle") {
      // Filled triangle arrowhead (pointing opposite direction)
      return `
        <marker id="${startMarkerId}" markerWidth="${this.headSize}" markerHeight="${this.headSize}" 
                refX="${this.headSize * 0.2}" refY="${this.headSize / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polygon points="${this.headSize},0 0,${this.headSize / 2} ${this.headSize},${this.headSize}" 
                   fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    if (this.headStyle === "line") {
      // V-shaped line arrowhead (pointing opposite direction)
      return `
        <marker id="${startMarkerId}" markerWidth="${this.headSize}" markerHeight="${this.headSize}" 
                refX="${this.headSize * 0.3}" refY="${this.headSize / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polyline points="${this.headSize},0 ${this.headSize * 0.3},${this.headSize / 2} ${this.headSize},${this.headSize}" 
                    fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    return "";
  }

  /**
   * Get the marker definitions that need to be added to SVG <defs>.
   *
   * @returns SVG marker definitions
   */
  getMarkerDefs(): string {
    const endMarker = this.generateMarker();
    const startMarker = this.generateStartMarker();
    return endMarker + startMarker;
  }

  /**
   * Renders the arrow to SVG.
   *
   * @returns SVG representation of the arrow
   */
  render(): string {
    // Get the marker definitions
    const markerDefs = this.getMarkerDefs();

    if (this.headStyle !== "none") {
      // Create modified line style with marker references
      const markerEnd = `url(#${this.markerId})`;
      const markerStart = this.doubleEnded
        ? `url(#${this.markerId}-start)`
        : undefined;

      // Create a modified line that includes markers
      const lineWithMarkers = new NewLine({
        start: this.line.start,
        end: this.line.end,
        style: {
          ...this._style,
          markerEnd,
          markerStart,
        },
      });

      return `${markerDefs}${lineWithMarkers.render()}`;
    }

    // No arrowhead, just render the line
    return this.line.render();
  }
}

