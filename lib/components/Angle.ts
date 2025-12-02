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
 * Quadrant selection for crossing lines.
 * Specifies which of the four angles at an intersection to mark.
 */
export type AngleQuadrant =
  | "upper-right"
  | "upper-left"
  | "lower-left"
  | "lower-right";

/**
 * Mode selection for angle at a vertex.
 * - "internal": The smaller angle (< 180°) between the segments
 * - "external": The larger angle (> 180°) between the segments
 */
export type AngleMode = "internal" | "external";

/**
 * Configuration for creating an Angle from crossing lines (intersection).
 */
export interface AngleFromIntersection {
  from: "intersection";
  lines: [Line | Side, Line | Side];
  quadrant: AngleQuadrant;
  mode?: AngleMode;
  radius?: number;
  label?: string | ((degrees: number) => string);
  showDegrees?: boolean;
  labelFontSize?: number;
  labelDistance?: number;
  style?: Partial<Style>;
  rightAngleMarker?: "square" | "dot" | "arc";
  debug?: boolean;
}

/**
 * Configuration for creating an Angle from segments meeting at a vertex.
 */
export interface AngleFromVertex {
  from: "vertex";
  segments: [Side, Side];
  mode?: AngleMode;
  radius?: number;
  label?: string | ((degrees: number) => string);
  showDegrees?: boolean;
  labelFontSize?: number;
  labelDistance?: number;
  style?: Partial<Style>;
  rightAngleMarker?: "square" | "dot" | "arc";
  debug?: boolean;
}

/**
 * Configuration for creating an Angle with explicit angles.
 */
export interface AngleExplicit {
  vertex: Position;
  startAngle: number;
  endAngle: number;
  radius?: number;
  label?: string | ((degrees: number) => string);
  showDegrees?: boolean;
  labelFontSize?: number;
  labelDistance?: number;
  style?: Partial<Style>;
  rightAngleMarker?: "square" | "dot" | "arc";
  debug?: boolean;
}

/**
 * Union type of all angle configurations.
 */
export type AngleConfig =
  | AngleFromIntersection
  | AngleFromVertex
  | AngleExplicit;

/**
 * Internal resolved configuration.
 */
interface ResolvedAngleConfig {
  vertex: Position;
  startAngle: number;
  endAngle: number;
  radius: number;
  label?: string | ((degrees: number) => string);
  showDegrees?: boolean;
  labelFontSize: number;
  labelDistance: number;
  style?: Partial<Style>;
  rightAngleMarker: "square" | "dot" | "arc";
}

/**
 * Angle annotation component.
 *
 * @example
 * Marking an angle at line intersection
 * ```typescript
 * const angle = new Angle({
 *   from: "intersection",
 *   lines: [line1, line2],
 *   quadrant: "upper-right",
 *   label: "α"
 * });
 * ```
 *
 * @example
 * Marking an angle at a vertex between segments
 * ```typescript
 * const angle = new Angle({
 *   from: "vertex",
 *   segments: [segment1, segment2],
 *   mode: "internal",
 *   label: "β"
 * });
 * ```
 *
 * @example
 * Explicit angle specification
 * ```typescript
 * const angle = new Angle({
 *   vertex: { x: 100, y: 100 },
 *   startAngle: 0,
 *   endAngle: 90,
 *   label: "90°"
 * });
 * ```
 */
export class Angle extends Element {
  private config: AngleConfig;
  private resolved: ResolvedAngleConfig;
  private _label?: Text;

  constructor(config: AngleConfig) {
    super();

    // Mark this element to escape container layouts
    // Angles must be positioned absolutely based on global geometry
    this._escapeContainerLayout = true;

    this.config = config;

    // Resolve the configuration
    this.resolved = this.resolveConfig(config);

    // Check if this is a right angle (90°)
    let angleDiff = this.resolved.endAngle - this.resolved.startAngle;
    if (angleDiff < 0) angleDiff += 360;
    const isRightAngle = Math.abs(angleDiff - 90) < 1;

    // Create label if specified or if showDegrees is enabled
    // (but skip for square marker on right angles)
    const shouldShowLabel =
      (this.resolved.label || this.resolved.showDegrees !== false) &&
      !(isRightAngle && this.resolved.rightAngleMarker === "square");

    if (shouldShowLabel) {
      this._label = this.createLabelElement();
      this.addElement(this._label);
    }

    // Auto-add to current artboard
    this.autoAddToArtboard();
  }

  /**
   * Resolves the angle configuration from various input formats.
   */
  private resolveConfig(config: AngleConfig): ResolvedAngleConfig {
    const radius = config.radius ?? 40;
    const labelFontSize = config.labelFontSize ?? 14;
    const labelDistance = config.labelDistance ?? 0.6;
    const rightAngleMarker = config.rightAngleMarker ?? "square";

    // Mode 1: From intersection of two lines
    if ("from" in config && config.from === "intersection") {
      return this.resolveFromIntersection(
        config.lines,
        config.quadrant,
        config.mode ?? "internal",
        {
          radius,
          label: config.label,
          showDegrees: config.showDegrees,
          labelFontSize,
          labelDistance,
          style: config.style,
          rightAngleMarker,
        }
      );
    }

    // Mode 2: From segments at a vertex
    if ("from" in config && config.from === "vertex") {
      return this.resolveFromVertexSegments(
        config.segments,
        config.mode ?? "internal",
        {
          radius,
          label: config.label,
          showDegrees: config.showDegrees,
          labelFontSize,
          labelDistance,
          style: config.style,
          rightAngleMarker,
        }
      );
    }

    // Mode 3: Explicit angles
    if ("vertex" in config && "startAngle" in config && "endAngle" in config) {
      return {
        vertex: config.vertex,
        startAngle: config.startAngle,
        endAngle: config.endAngle,
        radius,
        label: config.label,
        showDegrees: config.showDegrees,
        labelFontSize,
        labelDistance,
        style: config.style,
        rightAngleMarker,
      };
    }

    // Fallback
    console.warn("Angle: Invalid configuration, using default");
    return {
      vertex: { x: 0, y: 0 },
      startAngle: 0,
      endAngle: 90,
      radius,
      label: undefined,
      showDegrees: undefined,
      labelFontSize,
      labelDistance,
      style: undefined,
      rightAngleMarker,
    };
  }

  /**
   * Resolves angle from two lines at their intersection using quadrant selection.
   *
   * The quadrant determines which of the 4 angles at the intersection to mark:
   * - "upper-right": Angle in the upper-right region
   * - "upper-left": Angle in the upper-left region
   * - "lower-left": Angle in the lower-left region
   * - "lower-right": Angle in the lower-right region
   *
   * The mode further refines the selection:
   * - "internal": The acute angle in that quadrant (< 180°)
   * - "external": The reflex angle in that quadrant (> 180°)
   */
  private resolveFromIntersection(
    lines: [Line | Side, Line | Side],
    quadrant: AngleQuadrant,
    mode: AngleMode,
    opts: Omit<ResolvedAngleConfig, "vertex" | "startAngle" | "endAngle">
  ): ResolvedAngleConfig {
    const [line1, line2] = lines;

    // Get line endpoints
    const l1 = { start: line1.start, end: line1.end };
    const l2 = { start: line2.start, end: line2.end };

    // Find intersection (extended lines)
    const side1 = new Side({ start: l1.start, end: l1.end });
    const side2 = new Side({ start: l2.start, end: l2.end });
    const intersections = side1.getIntersections(side2, true);

    if (intersections.length === 0) {
      console.warn("Angle: Lines are parallel or do not intersect");
      return { vertex: l1.start, startAngle: 0, endAngle: 90, ...opts };
    }

    const vertex = intersections[0];

    // Get direction vectors
    const dir1 = { x: l1.end.x - l1.start.x, y: l1.end.y - l1.start.y };
    const dir2 = { x: l2.end.x - l2.start.x, y: l2.end.y - l2.start.y };

    // Calculate angles of direction vectors (in degrees, SVG coordinate system)
    let angle1 = (Math.atan2(dir1.y, dir1.x) * 180) / Math.PI;
    let angle2 = (Math.atan2(dir2.y, dir2.x) * 180) / Math.PI;

    // Normalize to 0-360
    angle1 = ((angle1 % 360) + 360) % 360;
    angle2 = ((angle2 % 360) + 360) % 360;

    // Get all 4 ray directions at the intersection
    const ray1Forward = angle1;
    const ray1Backward = (angle1 + 180) % 360;
    const ray2Forward = angle2;
    const ray2Backward = (angle2 + 180) % 360;

    // Sort all 4 rays to identify the 4 angle regions
    const sortedRays = [
      ray1Forward,
      ray1Backward,
      ray2Forward,
      ray2Backward,
    ].sort((a, b) => a - b);

    // Map each quadrant to a specific pair of adjacent rays
    // The quadrant determines which of the 4 angles we want
    const { startAngle, endAngle } = this.selectAngleInQuadrant(
      vertex,
      sortedRays,
      { ray1Forward, ray1Backward, ray2Forward, ray2Backward },
      quadrant,
      mode
    );

    return {
      vertex,
      startAngle,
      endAngle,
      ...opts,
    };
  }

  /**
   * Selects the appropriate angle based on quadrant and mode.
   *
   * When two lines cross, they create 4 distinct angles at 4 distinct locations.
   * We need to map each quadrant name to one of these 4 angles.
   */
  private selectAngleInQuadrant(
    vertex: Position,
    sortedRays: number[],
    rays: {
      ray1Forward: number;
      ray1Backward: number;
      ray2Forward: number;
      ray2Backward: number;
    },
    quadrant: AngleQuadrant,
    mode: AngleMode
  ): { startAngle: number; endAngle: number } {
    // The 4 sorted rays create 4 angle regions
    // We need to map each quadrant to one of these 4 regions

    // Calculate the midpoint of each of the 4 angle regions
    const regionMidpoints: number[] = [];
    for (let i = 0; i < 4; i++) {
      const start = sortedRays[i];
      const end = sortedRays[(i + 1) % 4];

      let mid: number;
      if (end > start) {
        mid = (start + end) / 2;
      } else {
        // Wraparound case
        mid = (start + (end + 360)) / 2;
        if (mid >= 360) mid -= 360;
      }
      regionMidpoints.push(mid);
    }

    // Define which region each quadrant should use
    // We map quadrants to the region whose midpoint is closest to the quadrant's ideal direction
    const quadrantDirections: Record<AngleQuadrant, number> = {
      "upper-right": 315, // -45° (up-right in screen coords)
      "upper-left": 225, // -135° (up-left in screen coords)
      "lower-left": 135, // 135° (down-left in screen coords)
      "lower-right": 45, // 45° (down-right in screen coords)
    };

    const targetDirection = quadrantDirections[quadrant];

    // Find which region's midpoint is closest to the target direction
    let bestRegionIndex = 0;
    let smallestDiff = 360;

    for (let i = 0; i < regionMidpoints.length; i++) {
      const mid = regionMidpoints[i];

      // Calculate angular difference (shortest path)
      let diff = Math.abs(mid - targetDirection);
      if (diff > 180) diff = 360 - diff;

      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestRegionIndex = i;
      }
    }

    // Get the start and end rays for the selected region
    const startAngle = sortedRays[bestRegionIndex];
    const endAngle = sortedRays[(bestRegionIndex + 1) % 4];

    if (mode === "external") {
      // Swap to get the reflex angle (go the other way around)
      return { startAngle: endAngle, endAngle: startAngle };
    }

    return { startAngle, endAngle };
  }

  /**
   * Resolves angle from two segments meeting at a shared vertex.
   *
   * Automatically finds the shared endpoint and calculates the angle.
   * - "internal": The smaller angle (< 180°)
   * - "external": The larger angle (> 180°)
   */
  private resolveFromVertexSegments(
    segments: [Side, Side],
    mode: AngleMode,
    opts: Omit<ResolvedAngleConfig, "vertex" | "startAngle" | "endAngle">
  ): ResolvedAngleConfig {
    const [seg1, seg2] = segments;

    // Find shared vertex
    const s1Start = seg1.start;
    const s1End = seg1.end;
    const s2Start = seg2.start;
    const s2End = seg2.end;

    let vertex: Position;
    let ray1End: Position;
    let ray2End: Position;

    // Check all possible connections
    const dist = (p1: Position, p2: Position) =>
      Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    if (dist(s1Start, s2Start) < 0.01) {
      vertex = s1Start;
      ray1End = s1End;
      ray2End = s2End;
    } else if (dist(s1Start, s2End) < 0.01) {
      vertex = s1Start;
      ray1End = s1End;
      ray2End = s2Start;
    } else if (dist(s1End, s2Start) < 0.01) {
      vertex = s1End;
      ray1End = s1Start;
      ray2End = s2End;
    } else if (dist(s1End, s2End) < 0.01) {
      vertex = s1End;
      ray1End = s1Start;
      ray2End = s2Start;
    } else {
      console.warn("Angle: Segments do not share a common vertex");
      return {
        vertex: s1Start,
        startAngle: 0,
        endAngle: 90,
        ...opts,
      };
    }

    // Calculate direction vectors from vertex to the other endpoints
    const dir1 = { x: ray1End.x - vertex.x, y: ray1End.y - vertex.y };
    const dir2 = { x: ray2End.x - vertex.x, y: ray2End.y - vertex.y };

    // Calculate angles
    const angle1 = (Math.atan2(dir1.y, dir1.x) * 180) / Math.PI;
    const angle2 = (Math.atan2(dir2.y, dir2.x) * 180) / Math.PI;

    // Normalize to 0-360
    const norm1 = ((angle1 % 360) + 360) % 360;
    const norm2 = ((angle2 % 360) + 360) % 360;

    // Calculate the angle between them (always go counterclockwise from angle1 to angle2)
    let diff = norm2 - norm1;
    if (diff < 0) diff += 360;

    let startAngle = norm1;
    let endAngle = norm2;

    // If mode is "internal", ensure we take the smaller angle
    if (mode === "internal" && diff > 180) {
      // Swap to get the smaller angle
      startAngle = norm2;
      endAngle = norm1;
    }

    // If mode is "external", ensure we take the larger angle
    if (mode === "external" && diff <= 180) {
      // Swap to get the larger angle
      startAngle = norm2;
      endAngle = norm1;
    }

    return {
      vertex,
      startAngle,
      endAngle,
      ...opts,
    };
  }

  /**
   * Creates the label element positioned at the angle's bisector.
   */
  private createLabelElement(): Text {
    const {
      vertex,
      startAngle,
      endAngle,
      radius,
      labelDistance,
      labelFontSize,
      label,
      showDegrees,
    } = this.resolved;

    // Calculate the bisector angle
    let span = endAngle - startAngle;
    if (span < 0) span += 360;
    const midAngle = startAngle + span / 2;

    // Calculate angle in degrees
    const angleDegrees = Math.round(span * 10) / 10; // Round to 1 decimal

    // Determine label content
    let labelContent: string;
    if (typeof label === "function") {
      const result = label(angleDegrees);
      labelContent = String(result); // Ensure it's a string
    } else if (typeof label === "string") {
      labelContent = label;
    } else if (showDegrees !== false) {
      // Default: show degrees
      labelContent = `${angleDegrees}°`;
    } else {
      labelContent = "";
    }

    // Don't create a label if content is empty
    if (!labelContent) {
      return new Text({ content: "", fontSize: labelFontSize });
    }

    // Convert to radians (for SVG coordinate system where +Y is down)
    const midRad = (midAngle * Math.PI) / 180;

    // Calculate label position along the bisector
    const labelRadius = radius * labelDistance;
    const labelX = vertex.x + labelRadius * Math.cos(midRad);
    const labelY = vertex.y + labelRadius * Math.sin(midRad);

    const textLabel = new Text({
      content: labelContent,
      fontSize: labelFontSize,
    });

    textLabel.position({
      relativeTo: { x: labelX, y: labelY },
      relativeFrom: textLabel.center,
      x: 0,
      y: 0,
      boxReference: "contentBox",
    });

    return textLabel;
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

  /**
   * Sets or updates the style of the angle marker.
   * Merges with existing style properties.
   * 
   * @param style - Style properties to apply
   * 
   * @example
   * ```typescript
   * const angle = triangle.showAngle(0);
   * angle.setStyle({ stroke: "#ef4444", strokeWidth: 2 });
   * ```
   */
  setStyle(style: Partial<Style>): void {
    this.resolved.style = { ...this.resolved.style, ...style };
  }

  /**
   * Gets the current style of the angle marker.
   * 
   * @returns Current style object
   */
  getStyle(): Partial<Style> | undefined {
    return this.resolved.style;
  }

  render(): string {
    const { vertex, startAngle, endAngle, radius, style, rightAngleMarker } =
      this.resolved;
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

    let svg = "";

    // Handle full circle (360°)
    if (isFullCircle) {
      svg = `<circle cx="${vx}" cy="${vy}" r="${radius}" ${attrs}/>`;
      if (this._label) {
        svg += this._label.render();
      }
      return svg;
    }

    // Convert angles to radians (for SVG coordinate system where +Y is down)
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Calculate arc start and end points
    const x1 = vx + radius * Math.cos(startRad);
    const y1 = vy + radius * Math.sin(startRad);
    const x2 = vx + radius * Math.cos(endRad);
    const y2 = vy + radius * Math.sin(endRad);

    // Render right angle marker (square)
    if (isRightAngle && rightAngleMarker === "square") {
      const markerSize = radius * 0.4;

      const p1x = vx + markerSize * Math.cos(startRad);
      const p1y = vy + markerSize * Math.sin(startRad);
      const p2x = vx + markerSize * Math.cos(endRad);
      const p2y = vy + markerSize * Math.sin(endRad);

      const p3x =
        vx + markerSize * Math.cos(startRad) + markerSize * Math.cos(endRad);
      const p3y =
        vy + markerSize * Math.sin(startRad) + markerSize * Math.sin(endRad);

      const squarePath = `M ${vx} ${vy} L ${p1x} ${p1y} L ${p3x} ${p3y} L ${p2x} ${p2y} Z`;
      svg = `<path d="${squarePath}" ${attrs}/>`;
    } else {
      // Render normal arc
      const largeArcFlag = angleDiff > 180 ? 1 : 0;
      const sweepFlag = 1; // Clockwise in SVG coords (where +Y is down)

      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;
      svg = `<path d="${pathData}" ${attrs}/>`;

      // Add dot marker for right angles if specified
      if (isRightAngle && rightAngleMarker === "dot") {
        const midAngle = startAngle + angleDiff / 2;
        const midRad = (midAngle * Math.PI) / 180;

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
      const midRad = (midAngle * Math.PI) / 180;

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
