/**
 * Angle annotation component for marking angles in geometric diagrams.
 *
 * Draws an arc between two rays emanating from a vertex, with an optional label.
 */

import { Element, type Position } from "../core/Element.js";
import { type Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { Text } from "../elements/Text.js";
import { Line } from "../elements/Line.js";
import { Side } from "../elements/Side.js";

/**
 * Base interface for figures that support angle queries.
 */
export interface AngleFigure {
  getAngleMarkerAt(vertexIndex: number, external: boolean): {
    vertex: Position;
    startAngle: number;
    endAngle: number;
    angleDegrees: number;
  };
}

/**
 * Configuration for creating an Angle annotation.
 */
export interface AngleConfig {
  /**
   * Optional figure (Triangle, Quadrilateral, etc.) to get angle from.
   * If provided with vertexIndex, automatically calculates angle at that vertex.
   */
  figure?: AngleFigure;

  /**
   * Vertex index in the figure (0-based).
   * Only used when figure is provided.
   */
  vertexIndex?: number;

  /**
   * Type of angle to draw:
   * - 'inward': Internal angle (inside the figure)
   * - 'outward': External angle (outside the figure)
   * @defaultValue 'inward'
   */
  type?: 'inward' | 'outward';

  /**
   * Two lines/sides forming the angle.
   * Required if figure and vertexIndex are not provided.
   * The angle is measured from line1 to line2 in counter-clockwise direction.
   */
  between?: [Line | Side, Line | Side];

  /**
   * Explicit vertex position (used with between, or for manual placement)
   */
  vertex?: Position;

  /**
   * Explicit start angle in degrees (for manual angle specification)
   */
  startAngle?: number;

  /**
   * Explicit end angle in degrees (for manual angle specification)
   */
  endAngle?: number;

  /**
   * Radius of the arc in pixels
   * @defaultValue 40
   */
  radius?: number;

  /**
   * Optional label for the angle
   */
  label?: string;

  /**
   * Font size for the label
   * @defaultValue 14
   */
  labelFontSize?: number;

  /**
   * Distance from vertex to label (multiplier of radius)
   * @defaultValue 0.6
   */
  labelDistance?: number;

  /**
   * Visual styling for the arc
   */
  style?: Partial<Style>;

  /**
   * Style for marking right angles (90°)
   * @defaultValue 'square'
   */
  rightAngleMarker?: 'square' | 'dot' | 'arc';

  /**
   * Debug mode: Show start and end points of the arc
   * @defaultValue false
   */
  debug?: boolean;
}

/**
 * Internal resolved configuration.
 */
interface ResolvedAngleConfig {
  vertex: Position;
  startAngle: number;
  endAngle: number;
  radius: number;
  label?: string;
  labelFontSize: number;
  labelDistance: number;
  style?: Partial<Style>;
  rightAngleMarker: 'square' | 'dot' | 'arc';
}

/**
 * Angle annotation component.
 *
 * @example
 * Using with a figure
 * ```typescript
 * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
 * const angle = new Angle({
 *   figure: triangle,
 *   vertexIndex: 0,
 *   type: 'inward',
 *   label: "$\\alpha$"
 * });
 * ```
 *
 * @example
 * Using with two lines
 * ```typescript
 * const angle = new Angle({
 *   between: [line1, line2],
 *   type: 'inward',
 *   label: "45°"
 * });
 * ```
 */
export class Angle extends Element {
  private config: AngleConfig;
  private resolved: ResolvedAngleConfig;
  private _label?: Text;

  constructor(config: AngleConfig) {
    super();
    
    this.config = config;
    
    // Resolve the configuration
    this.resolved = this.resolveConfig(config);

    // Check if this is a right angle (90°)
    let angleDiff = this.resolved.endAngle - this.resolved.startAngle;
    if (angleDiff < 0) angleDiff += 360;
    const isRightAngle = Math.abs(angleDiff - 90) < 1;

    // Create label if specified (but skip for square marker on right angles)
    const shouldShowLabel = this.resolved.label && 
      !(isRightAngle && this.resolved.rightAngleMarker === 'square');
    
    if (shouldShowLabel) {
      this._label = this.createLabelElement();
      this.addElement(this._label);
    }
  }

  /**
   * Resolves the angle configuration from various input formats.
   */
  private resolveConfig(config: AngleConfig): ResolvedAngleConfig {
    const radius = config.radius ?? 40;
    const labelFontSize = config.labelFontSize ?? 14;
    const labelDistance = config.labelDistance ?? 0.6;
    const rightAngleMarker = config.rightAngleMarker ?? 'square';
    const type = config.type ?? 'inward';

    // Mode 1: Figure + vertex index
    if (config.figure && config.vertexIndex !== undefined) {
      const angleInfo = config.figure.getAngleMarkerAt(
        config.vertexIndex,
        type === 'outward'
      );

      return {
        vertex: angleInfo.vertex,
        startAngle: angleInfo.startAngle,
        endAngle: angleInfo.endAngle,
        radius,
        label: config.label,
        labelFontSize,
        labelDistance,
        style: config.style,
        rightAngleMarker,
      };
    }

    // Mode 2: Between two lines/sides
    if (config.between) {
      return this.resolveFromLines(config.between, type, {
        radius,
        label: config.label,
        labelFontSize,
        labelDistance,
        style: config.style,
        rightAngleMarker,
      });
    }

    // Mode 3: Explicit angles
    if (config.vertex && config.startAngle !== undefined && config.endAngle !== undefined) {
      return {
        vertex: config.vertex,
        startAngle: config.startAngle,
        endAngle: config.endAngle,
        radius,
        label: config.label,
        labelFontSize,
        labelDistance,
        style: config.style,
        rightAngleMarker,
      };
    }

    // Fallback
    console.warn('Angle: Invalid configuration, using default');
    return {
      vertex: { x: 0, y: 0 },
      startAngle: 0,
      endAngle: 90,
      radius,
      label: config.label,
      labelFontSize,
      labelDistance,
      style: config.style,
      rightAngleMarker,
    };
  }

  /**
   * Resolves angle from two lines/sides.
   * 
   * When two lines cross, there are 4 possible angles to draw.
   * We need to identify which quadrant to draw based on 'type'.
   */
  private resolveFromLines(
    between: [Line | Side, Line | Side],
    type: 'inward' | 'outward',
    opts: Omit<ResolvedAngleConfig, 'vertex' | 'startAngle' | 'endAngle'>
  ): ResolvedAngleConfig {
    const [line1, line2] = between;

    // Get line endpoints and direction vectors
    const l1 = { start: line1.start, end: line1.end };
    const l2 = { start: line2.start, end: line2.end };

    // Get the direction vectors of the lines (from their definition, not from intersection)
    const dir1 = { x: l1.end.x - l1.start.x, y: l1.end.y - l1.start.y };
    const dir2 = { x: l2.end.x - l2.start.x, y: l2.end.y - l2.start.y };

    // Find intersection
    const side1 = new Side({ start: l1.start, end: l1.end });
    const side2 = new Side({ start: l2.start, end: l2.end });
    const intersections = side1.getIntersections(side2, true);

    if (intersections.length === 0) {
      console.warn('Angle: Lines are parallel');
      return { vertex: l1.start, startAngle: 0, endAngle: 90, ...opts };
    }

    const intersection = intersections[0];

    // Calculate angles of the direction vectors
    // These are the angles of the lines themselves, not to specific endpoints
    const angle1 = (Math.atan2(dir1.y, dir1.x) * 180) / Math.PI;
    const angle2 = (Math.atan2(dir2.y, dir2.x) * 180) / Math.PI;

    // Normalize to 0-360
    const norm1 = (angle1 + 360) % 360;
    const norm2 = (angle2 + 360) % 360;

    // When lines cross, we have 4 possible angles (4 quadrants)
    // Each line defines two rays from the intersection (forward and backward)
    // We have: line1-forward, line1-backward, line2-forward, line2-backward
    
    // The 4 angles are between:
    // 1. line1-forward to line2-forward (CCW)
    // 2. line2-forward to line1-backward (CCW) = 180° - angle1
    // 3. line1-backward to line2-backward (CCW) = same as angle1
    // 4. line2-backward to line1-forward (CCW) = 360° - angle1

    // Calculate all 4 possible angle configurations
    const configs = [
      { start: norm1, end: norm2, desc: 'line1→ to line2→' },
      { start: norm2, end: (norm1 + 180) % 360, desc: 'line2→ to line1←' },
      { start: (norm1 + 180) % 360, end: (norm2 + 180) % 360, desc: 'line1← to line2←' },
      { start: (norm2 + 180) % 360, end: norm1, desc: 'line2← to line1→' },
    ];

    // Calculate the size of each angle (going CCW from start to end)
    const angleSizes = configs.map(cfg => {
      let diff = cfg.end - cfg.start;
      if (diff < 0) diff += 360;
      return { ...cfg, size: diff };
    });

    // For 'inward', we typically want the smaller angle (< 180°)
    // For 'outward', we want the larger angle (> 180°)
    // BUT: Due to the 180° correction in rendering, the logic is flipped
    
    let chosenConfig;
    if (type === 'inward') {
      // Choose the largest angle (flipped due to 180° correction)
      chosenConfig = angleSizes.reduce((max, cfg) => cfg.size > max.size ? cfg : max);
    } else {
      // Choose the smallest angle (flipped due to 180° correction)
      chosenConfig = angleSizes.reduce((min, cfg) => cfg.size < min.size ? cfg : min);
    }

    return {
      vertex: intersection,
      startAngle: chosenConfig.start,
      endAngle: chosenConfig.end,
      ...opts,
    };
  }

  /**
   * Creates the label element positioned at the angle's bisector.
   */
  private createLabelElement(): Text {
    const { vertex, startAngle, endAngle, radius, labelDistance, labelFontSize } = this.resolved;

    // Calculate the bisector angle
    let span = endAngle - startAngle;
    if (span < 0) span += 360;
    const midAngle = startAngle + span / 2;

    // Convert to radians using the same 180° correction as the arc rendering
    const midRad = (-(180 - midAngle) * Math.PI) / 180;

    // Calculate label position along the bisector
    const labelRadius = radius * labelDistance;
    const labelX = vertex.x + labelRadius * Math.cos(midRad);
    const labelY = vertex.y + labelRadius * Math.sin(midRad);

    const label = new Text({
      content: this.resolved.label!,
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
      x: absPos.x + this.resolved.vertex.x,
      y: absPos.y + this.resolved.vertex.y,
    };
  }

  /**
   * Gets the label element if one was created.
   */
  get label(): Text | undefined {
    return this._label;
  }

  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const { vertex, radius } = this.resolved;
    const absPos = this.getAbsolutePosition();

    return {
      minX: absPos.x + vertex.x - radius,
      minY: absPos.y + vertex.y - radius,
      maxX: absPos.x + vertex.x + radius,
      maxY: absPos.y + vertex.y + radius,
    };
  }

  render(): string {
    const { vertex, startAngle, endAngle, radius, style, rightAngleMarker } = this.resolved;
    const absPos = this.getAbsolutePosition();

    // Absolute vertex position
    const vx = absPos.x + vertex.x;
    const vy = absPos.y + vertex.y;

    // Check angle difference
    let angleDiff = endAngle - startAngle;
    if (angleDiff < 0) angleDiff += 360;
    
    const isRightAngle = Math.abs(angleDiff - 90) < 1;
    const isFullCircle = Math.abs(angleDiff - 360) < 1;

    // Default style
    const defaultStyle: Partial<Style> = {
      stroke: "#000000",
      strokeWidth: "1.5",
      fill: "none",
    };
    const finalStyle = { ...defaultStyle, ...style };
    const attrs = styleToSVGAttributes(finalStyle);

    let svg = '';

    // Handle full circle (360°)
    if (isFullCircle) {
      svg = `<circle cx="${vx}" cy="${vy}" r="${radius}" ${attrs}/>`;
      if (this._label) {
        svg += this._label.render();
      }
      return svg;
    }

    // Convert angles to radians (negate for SVG coordinate system)
    // Fix: Use 180 - angle to get the correct position on the circle
    const startRad = (-(180 - startAngle) * Math.PI) / 180;
    const endRad = (-(180 - endAngle) * Math.PI) / 180;

    // Calculate arc start and end points (for debugging and rendering)
    const x1 = vx + radius * Math.cos(startRad);
    const y1 = vy + radius * Math.sin(startRad);
    const x2 = vx + radius * Math.cos(endRad);
    const y2 = vy + radius * Math.sin(endRad);

    // Render right angle marker (square)
    if (isRightAngle && rightAngleMarker === 'square') {
      const markerSize = radius * 0.4;

      const p1x = vx + markerSize * Math.cos(startRad);
      const p1y = vy + markerSize * Math.sin(startRad);
      const p2x = vx + markerSize * Math.cos(endRad);
      const p2y = vy + markerSize * Math.sin(endRad);

      const p3x = vx + markerSize * Math.cos(startRad) + markerSize * Math.cos(endRad);
      const p3y = vy + markerSize * Math.sin(startRad) + markerSize * Math.sin(endRad);

      const squarePath = `M ${vx} ${vy} L ${p1x} ${p1y} L ${p3x} ${p3y} L ${p2x} ${p2y} Z`;
      svg = `<path d="${squarePath}" ${attrs}/>`;
    } else {
      // Render normal arc
      const largeArcFlag = angleDiff > 180 ? 1 : 0;
      const sweepFlag = 1; // Clockwise (to match the corrected arc endpoints)

      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
      svg = `<path d="${pathData}" ${attrs}/>`;

      // Add dot marker for right angles if specified
      if (isRightAngle && rightAngleMarker === 'dot') {
        const midAngle = startAngle + angleDiff / 2;
        const midRad = (-midAngle * Math.PI) / 180;
        
        const dotDistance = radius * 0.5;
        const dotX = vx + dotDistance * Math.cos(midRad);
        const dotY = vy + dotDistance * Math.sin(midRad);
        const dotRadius = radius * 0.08;

        svg += `<circle cx="${dotX}" cy="${dotY}" r="${dotRadius}" fill="${finalStyle.stroke}" stroke="none"/>`;
      }
    }

    // Debug mode: Show start and end points of the arc, and bisector line
    if (this.config.debug) {
      // Start point (red)
      svg += `<circle cx="${x1}" cy="${y1}" r="4" fill="#ff0000" stroke="none"/>`;
      // End point (blue)
      svg += `<circle cx="${x2}" cy="${y2}" r="4" fill="#0000ff" stroke="none"/>`;
      // Line from vertex to start (red, dashed)
      svg += `<line x1="${vx}" y1="${vy}" x2="${x1}" y2="${y1}" stroke="#ff0000" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>`;
      // Line from vertex to end (blue, dashed)
      svg += `<line x1="${vx}" y1="${vy}" x2="${x2}" y2="${y2}" stroke="#0000ff" stroke-width="1" stroke-dasharray="2,2" opacity="0.5"/>`;
      
      // Show bisector line where label is positioned (green)
      const { startAngle, endAngle, radius: r, labelDistance } = this.resolved;
      let span = endAngle - startAngle;
      if (span < 0) span += 360;
      const midAngle = startAngle + span / 2;
      const midRad = (-(180 - midAngle) * Math.PI) / 180;
      
      const bisectorEndX = vx + r * 1.5 * Math.cos(midRad);
      const bisectorEndY = vy + r * 1.5 * Math.sin(midRad);
      const labelX = vx + r * labelDistance * Math.cos(midRad);
      const labelY = vy + r * labelDistance * Math.sin(midRad);
      
      svg += `<line x1="${vx}" y1="${vy}" x2="${bisectorEndX}" y2="${bisectorEndY}" stroke="#00ff00" stroke-width="1" stroke-dasharray="2,2" opacity="0.7"/>`;
      svg += `<circle cx="${labelX}" cy="${labelY}" r="3" fill="#00ff00" stroke="none" opacity="0.7"/>`;
    }

    // Render label if present
    if (this._label) {
      svg += this._label.render();
    }

    return svg;
  }
}
