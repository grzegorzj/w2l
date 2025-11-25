/**
 * Angle annotation component for marking angles in geometric diagrams.
 *
 * Draws an arc between two rays emanating from a vertex, with an optional label.
 */

import { Element, type Position } from "../core/Element.js";
import { type Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { Text } from "../elements/Text.js";

/**
 * Configuration for creating an Angle annotation.
 */
export interface AngleConfig {
  /**
   * The vertex (corner point) where the angle is formed
   */
  vertex: Position;

  /**
   * Starting angle in degrees (0° = horizontal right, 90° = down)
   */
  startAngle: number;

  /**
   * Ending angle in degrees (0° = horizontal right, 90° = down)
   */
  endAngle: number;

  /**
   * Radius of the arc in pixels (distance from vertex to the arc)
   * @defaultValue 40
   */
  radius?: number;

  /**
   * Optional label for the angle (e.g., "$\\alpha$", "90°")
   */
  label?: string;

  /**
   * Font size for the label
   * @defaultValue 14
   */
  labelFontSize?: number;

  /**
   * Distance from vertex to label (multiplier of radius)
   * Values < 1.0 position the label inside the arc (between vertex and arc)
   * Values > 1.0 position the label outside the arc
   * @defaultValue 0.6
   */
  labelDistance?: number;

  /**
   * Visual styling for the arc
   */
  style?: Partial<Style>;

  /**
   * Whether to draw the arc in the reflex (larger) direction
   * @defaultValue false
   */
  reflex?: boolean;

  /**
   * Style for marking right angles (90°).
   * - 'square': Small square at vertex (hides label)
   * - 'dot': Small dot inside the arc (keeps label)
   * - 'arc': Regular arc (keeps label)
   * @defaultValue 'square'
   */
  rightAngleMarker?: 'square' | 'dot' | 'arc';
}

/**
 * Angle annotation component that draws an arc between two rays.
 *
 * The Angle component draws a circular arc to mark an angle, with optional
 * labeling. It's useful for annotating triangles, polygons, and other
 * geometric shapes.
 *
 * @example
 * Create a right angle marker
 * ```typescript
 * const rightAngle = new Angle({
 *   vertex: { x: 0, y: 0 },
 *   startAngle: 0,   // horizontal right
 *   endAngle: 90,    // vertical down
 *   radius: 20,
 *   label: "90°",
 *   style: { stroke: "blue", strokeWidth: 2, fill: "none" }
 * });
 * artboard.addElement(rightAngle);
 * ```
 *
 * @example
 * Create an angle at a triangle vertex
 * ```typescript
 * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
 * const vertices = triangle.absoluteVertices;
 * 
 * const angle = new Angle({
 *   vertex: vertices[0],
 *   startAngle: 0,
 *   endAngle: 45,
 *   label: "$\\alpha$",
 *   style: { stroke: "red", fill: "rgba(255,0,0,0.1)" }
 * });
 * ```
 */
export class Angle extends Element {
  private config: AngleConfig;
  private _label?: Text;

  constructor(config: AngleConfig) {
    super();
    this.config = {
      radius: 40,
      labelFontSize: 14,
      labelDistance: 0.6, // Inside the arc (< 1.0 means between vertex and arc)
      reflex: false,
      rightAngleMarker: 'square',
      ...config,
    };

    // Check if this is a right angle (90°)
    let angleDiff = this.config.endAngle - this.config.startAngle;
    if (angleDiff < 0) angleDiff += 360;
    const isRightAngle = Math.abs(angleDiff - 90) < 1;

    // Create label if specified (but skip for square marker on right angles)
    const shouldShowLabel = this.config.label && 
      !(isRightAngle && this.config.rightAngleMarker === 'square');
    
    if (shouldShowLabel) {
      this._label = this.createLabelElement();
      this.addElement(this._label);
    }
  }

  /**
   * Creates the label element positioned at the angle's bisector.
   */
  private createLabelElement(): Text {
    const { vertex, startAngle, endAngle, radius, labelDistance, labelFontSize, reflex } = this.config;

    // Calculate the bisector angle
    let midAngle: number;
    if (reflex) {
      // For reflex angles, bisect the larger arc
      const span = ((endAngle - startAngle + 360) % 360) || 360;
      midAngle = startAngle + span / 2;
    } else {
      // For regular angles, bisect the smaller arc
      let span = endAngle - startAngle;
      if (span < 0) span += 360;
      if (span > 180) span -= 360;
      midAngle = startAngle + span / 2;
    }

    // Convert to radians (negate to flip vertically for SVG's inverted Y-axis)
    const midRad = (-midAngle * Math.PI) / 180;

    // Calculate label position
    const labelRadius = radius! * labelDistance!;
    const labelX = vertex.x + labelRadius * Math.cos(midRad);
    const labelY = vertex.y + labelRadius * Math.sin(midRad);

    const label = new Text({
      content: this.config.label!,
      fontSize: labelFontSize,
    });

    label.position({
      relativeTo: { x: labelX, y: labelY },
      relativeFrom: label.center,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });

    return label;
  }

  /**
   * Gets the vertex position (absolute).
   */
  get vertex(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this.config.vertex.x,
      y: absPos.y + this.config.vertex.y,
    };
  }

  /**
   * Gets the label element if one was created.
   */
  get label(): Text | undefined {
    return this._label;
  }

  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const { vertex, radius } = this.config;
    const absPos = this.getAbsolutePosition();
    const r = radius!;

    return {
      minX: absPos.x + vertex.x - r,
      minY: absPos.y + vertex.y - r,
      maxX: absPos.x + vertex.x + r,
      maxY: absPos.y + vertex.y + r,
    };
  }

  render(): string {
    const { vertex, startAngle, endAngle, radius, style, reflex, rightAngleMarker } = this.config;
    const absPos = this.getAbsolutePosition();

    // Absolute vertex position
    const vx = absPos.x + vertex.x;
    const vy = absPos.y + vertex.y;

    // Check if this is a right angle (90°)
    let angleDiff = endAngle - startAngle;
    if (angleDiff < 0) angleDiff += 360;
    const isRightAngle = Math.abs(angleDiff - 90) < 1; // Within 1° tolerance

    // Default style
    const defaultStyle: Partial<Style> = {
      stroke: "#000000",
      strokeWidth: "1.5",
      fill: "none",
    };
    const finalStyle = { ...defaultStyle, ...style };
    const attrs = styleToSVGAttributes(finalStyle);

    let svg = '';

    // Convert angles to radians (negate for SVG coordinate system)
    const startRad = (-startAngle * Math.PI) / 180;
    const endRad = (-endAngle * Math.PI) / 180;

    // Render right angle marker (small square) if applicable
    if (isRightAngle && rightAngleMarker === 'square') {
      // Use a smaller size for the square marker (about 40% of radius)
      const markerSize = radius! * 0.4;

      // Calculate the two points along the angle rays
      const p1x = vx + markerSize * Math.cos(startRad);
      const p1y = vy + markerSize * Math.sin(startRad);
      const p2x = vx + markerSize * Math.cos(endRad);
      const p2y = vy + markerSize * Math.sin(endRad);

      // The fourth corner is at the sum of the two vectors
      const p3x = vx + markerSize * Math.cos(startRad) + markerSize * Math.cos(endRad);
      const p3y = vy + markerSize * Math.sin(startRad) + markerSize * Math.sin(endRad);

      // Draw the square
      const squarePath = `M ${vx} ${vy} L ${p1x} ${p1y} L ${p3x} ${p3y} L ${p2x} ${p2y} Z`;
      svg = `<path d="${squarePath}" ${attrs}/>`;
    } else {
      // Render normal arc
      // Calculate arc endpoints
      const x1 = vx + radius! * Math.cos(startRad);
      const y1 = vy + radius! * Math.sin(startRad);
      const x2 = vx + radius! * Math.cos(endRad);
      const y2 = vy + radius! * Math.sin(endRad);

      // Determine arc sweep direction
      const largeArcFlag = reflex ? (angleDiff <= 180 ? 1 : 0) : angleDiff > 180 ? 1 : 0;
      const sweepFlag = 0; // Counter-clockwise (negated angles require flipped sweep)

      // Build path
      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
      svg = `<path d="${pathData}" ${attrs}/>`;

      // Add dot marker for right angles if specified
      if (isRightAngle && rightAngleMarker === 'dot') {
        // Calculate the bisector angle for dot placement
        let midAngle = startAngle + angleDiff / 2;
        const midRad = (-midAngle * Math.PI) / 180;
        
        // Place dot at about 50% of radius
        const dotDistance = radius! * 0.5;
        const dotX = vx + dotDistance * Math.cos(midRad);
        const dotY = vy + dotDistance * Math.sin(midRad);
        const dotRadius = radius! * 0.08; // Small dot, 8% of radius

        // Draw filled circle for the dot
        svg += `<circle cx="${dotX}" cy="${dotY}" r="${dotRadius}" fill="${finalStyle.stroke}" stroke="none"/>`;
      }
    }

    // Render label if present
    if (this._label) {
      svg += this._label.render();
    }

    return svg;
  }
}

