/**
 * Components module - Arrow implementation.
 *
 * Provides arrow components composed of multiple geometric primitives.
 * Arrows are compound shapes useful for diagrams, flowcharts, and annotations.
 *
 * @module components
 */

import { Element } from "../core/Element.js";
import type { Point } from "../core/Artboard.js";
import { Line } from "../elements/Line.js";
import type { Style } from "../core/Stylable.js";

/**
 * Arrow head style options.
 */
export type ArrowHeadStyle = "triangle" | "line" | "none";

/**
 * Configuration for creating an Arrow.
 *
 * Arrows are composite elements consisting of a line and an optional arrowhead.
 * They support various styling options through CSS/SVG properties.
 */
export interface ArrowConfig {
  /**
   * Starting point of the arrow.
   */
  start: Point;

  /**
   * Ending point of the arrow (where the arrowhead is positioned).
   */
  end: Point;

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
   * Optional name for debugging and SVG comments.
   */
  name?: string;

  /**
   * Visual styling properties (stroke, strokeWidth, etc.).
   * Uses standard CSS/SVG property names.
   *
   * @example
   * ```typescript
   * {
   *   stroke: "#3498db",
   *   strokeWidth: 2,
   *   fill: "#3498db"
   * }
   * ```
   */
  style?: Partial<Style>;
}

/**
 * Arrow component for creating directional indicators.
 *
 * The Arrow class is a composite element that combines a line with
 * arrowheads. It extends Element rather than Shape since it's composed
 * of multiple primitives.
 *
 * Arrows are useful for:
 * - Flowcharts and diagrams
 * - Annotations and labels
 * - Showing direction or flow
 * - Connecting related elements
 *
 * @remarks
 * Arrows use SVG markers for arrowheads, which are automatically
 * generated and included in the SVG output. The marker definition
 * is created once per unique arrow style.
 *
 * @example
 * Create a basic arrow
 * ```typescript
 * const arrow = new Arrow({
 *   start: { x: "100px", y: "100px" },
 *   end: { x: "300px", y: "100px" },
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
 * const arrow = new Arrow({
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
 *
 * @example
 * Create an arrow with line-style head
 * ```typescript
 * const arrow = new Arrow({
 *   start: { x: "100px", y: "200px" },
 *   end: { x: "400px", y: "200px" },
 *   headStyle: "line",
 *   headSize: 15,
 *   style: {
 *     stroke: "#2ecc71",
 *     strokeWidth: 2
 *   }
 * });
 * ```
 */
export class Arrow extends Element {
  private config: ArrowConfig;
  private line: Line;
  private markerId: string;

  // Static counter for unique marker IDs
  private static markerCounter = 0;

  /**
   * Creates a new Arrow instance.
   *
   * @param config - Configuration for the arrow
   */
  constructor(config: ArrowConfig) {
    super(config.name);
    this.config = {
      headStyle: "triangle",
      headSize: 10,
      doubleEnded: false,
      ...config,
    };

    // Generate unique marker ID
    this.markerId = `arrow-marker-${Arrow.markerCounter++}`;

    // Create the line component
    this.line = new Line({
      start: config.start,
      end: config.end,
      style: config.style,
    });
  }

  /**
   * Gets the starting point of the arrow.
   *
   * @returns The start point
   */
  get start(): Point {
    return this.line.start;
  }

  /**
   * Gets the ending point of the arrow.
   *
   * @returns The end point
   */
  get end(): Point {
    return this.line.end;
  }

  /**
   * Gets the center point of the arrow.
   *
   * @returns The center point (midpoint of the line)
   */
  get center(): Point {
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
   *
   * @param axisAligned - Whether to return axis-aligned (true) or oriented (false) bounding box
   * @returns The bounding box
   */
  getBoundingBox(axisAligned: boolean = true): import("../core/Element.js").BoundingBox {
    return this.line.getBoundingBox(axisAligned);
  }

  /**
   * Gets the width of the arrow's bounding box.
   * @returns The width in pixels
   */
  get width(): number {
    const bbox = this.getBoundingBox(true);
    return bbox.width;
  }

  /**
   * Gets the height of the arrow's bounding box.
   * @returns The height in pixels
   */
  get height(): number {
    const bbox = this.getBoundingBox(true);
    return bbox.height;
  }

  /**
   * Gets the alignment point for positioning within layout containers.
   * Arrow aligns based on its bounding box edges.
   */
  getAlignmentPoint(
    horizontalAlign: "left" | "center" | "right",
    verticalAlign: "top" | "center" | "bottom"
  ): Point {
    const bbox = this.getBoundingBox(true);
    
    // Parse bounding box coordinates
    const topLeftX = parseFloat(String(bbox.topLeft.x));
    const topLeftY = parseFloat(String(bbox.topLeft.y));
    
    // Calculate the alignment point based on bounding box
    let x = topLeftX;
    let y = topLeftY;

    // Horizontal alignment
    if (horizontalAlign === "center") {
      x = topLeftX + bbox.width / 2;
    } else if (horizontalAlign === "right") {
      x = topLeftX + bbox.width;
    }
    // "left" uses x = topLeftX (already set)

    // Vertical alignment
    if (verticalAlign === "center") {
      y = topLeftY + bbox.height / 2;
    } else if (verticalAlign === "bottom") {
      y = topLeftY + bbox.height;
    }
    // "top" uses y = topLeftY (already set)

    return { x: `${x}px`, y: `${y}px` };
  }

  /**
   * Generate the SVG marker definition for the arrowhead.
   *
   * @returns SVG marker definition
   * @internal
   */
  private generateMarker(): string {
    const { headStyle, headSize } = this.config;
    const style = this.config.style || {};
    const stroke = style.stroke || "#000000";
    const fill = style.fill || stroke;
    const strokeWidth = style.strokeWidth || 1;

    if (headStyle === "none") {
      return "";
    }

    if (headStyle === "triangle") {
      // Filled triangle arrowhead
      return `
        <marker id="${this.markerId}" markerWidth="${headSize}" markerHeight="${headSize}" 
                refX="${headSize! * 0.8}" refY="${headSize! / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polygon points="0,0 ${headSize},${headSize! / 2} 0,${headSize}" 
                   fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    if (headStyle === "line") {
      // V-shaped line arrowhead
      return `
        <marker id="${this.markerId}" markerWidth="${headSize}" markerHeight="${headSize}" 
                refX="${headSize! * 0.7}" refY="${headSize! / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polyline points="0,0 ${headSize! * 0.7},${headSize! / 2} 0,${headSize}" 
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
    if (!this.config.doubleEnded) {
      return "";
    }

    const { headStyle, headSize } = this.config;
    const style = this.config.style || {};
    const stroke = style.stroke || "#000000";
    const fill = style.fill || stroke;
    const strokeWidth = style.strokeWidth || 1;
    const startMarkerId = `${this.markerId}-start`;

    if (headStyle === "none") {
      return "";
    }

    if (headStyle === "triangle") {
      // Filled triangle arrowhead (pointing opposite direction)
      return `
        <marker id="${startMarkerId}" markerWidth="${headSize}" markerHeight="${headSize}" 
                refX="${headSize! * 0.2}" refY="${headSize! / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polygon points="${headSize},0 0,${headSize! / 2} ${headSize},${headSize}" 
                   fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    if (headStyle === "line") {
      // V-shaped line arrowhead (pointing opposite direction)
      return `
        <marker id="${startMarkerId}" markerWidth="${headSize}" markerHeight="${headSize}" 
                refX="${headSize! * 0.3}" refY="${headSize! / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polyline points="${headSize},0 ${headSize! * 0.3},${headSize! / 2} ${headSize},${headSize}" 
                    fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
        </marker>
      `;
    }

    return "";
  }

  /**
   * Get the marker definitions that need to be added to SVG <defs>.
   * This should be called by the artboard to collect all marker definitions.
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

    // Create modified line style with marker references
    const lineStyle = { ...this.config.style };
    
    if (this.config.headStyle !== "none") {
      // Add marker-end attribute
      const markerEnd = `url(#${this.markerId})`;
      
      // For double-ended arrows, also add marker-start
      const markerStart = this.config.doubleEnded
        ? `url(#${this.markerId}-start)`
        : undefined;

      // Create a modified line that includes markers
      const lineWithMarkers = new Line({
        start: this.config.start,
        end: this.config.end,
        style: {
          ...lineStyle,
          markerEnd,
          markerStart,
        },
      });

      const comment = this.getSVGComment();
      return `${comment}${markerDefs}${lineWithMarkers.render()}`;
    }

    // No arrowhead, just render the line
    const comment = this.getSVGComment();
    return `${comment}${this.line.render()}`;
  }
}

