/**
 * FlowConnector component for connecting flowchart boxes.
 * 
 * A smart connector that routes between boxes with:
 * - Automatic path generation
 * - Support for waypoints and guides
 * - Branching (splitting into multiple paths)
 * - Labels along the path
 * - Arrow heads
 * - Theme-based styling
 */

import { Element, type Position } from "../core/Element.js";
import { Line } from "../elements/Line.js";
import { Text } from "../elements/Text.js";
import { type Style } from "../core/Stylable.js";
import { type Theme, defaultTheme } from "../core/Theme.js";

export interface FlowConnectorConfig {
  /**
   * Starting point or position of the connector.
   */
  from: Position;

  /**
   * Ending point or position of the connector.
   */
  to: Position;

  /**
   * Optional waypoints to guide the connector path.
   * The connector will route through these points.
   */
  waypoints?: Position[];

  /**
   * Type of connector routing.
   * - 'straight': Direct line from start to end
   * - 'orthogonal': Right-angle routing (Manhattan routing)
   * - 'curved': Smooth curved path
   * @defaultValue 'straight'
   */
  routing?: "straight" | "orthogonal" | "curved";

  /**
   * Whether to show an arrow head at the end.
   * @defaultValue true
   */
  arrow?: boolean;

  /**
   * Whether to show an arrow head at the start.
   * @defaultValue false
   */
  doubleEnded?: boolean;

  /**
   * Label to display on the connector.
   */
  label?: string;

  /**
   * Position of the label along the path (0 = start, 1 = end).
   * @defaultValue 0.5
   */
  labelPosition?: number;

  /**
   * Minimum distance from path ends for label placement.
   * Helps prevent labels from overlapping with nodes.
   * @defaultValue 30
   */
  labelMinDistanceFromEnds?: number;

  /**
   * Theme to use for styling.
   */
  theme?: Theme;

  /**
   * Custom style overrides.
   */
  style?: Partial<Style>;
}

/**
 * FlowConnector component for connecting flowchart elements.
 * 
 * FlowConnector creates smart connections between flowchart boxes with:
 * - Multiple routing algorithms (straight, orthogonal, curved)
 * - Waypoint support for guided routing
 * - Arrow heads (single or double-ended)
 * - Labels positioned along the path
 * - Theme-based styling
 * 
 * @example
 * Simple straight connector
 * ```typescript
 * const connector = new FlowConnector({
 *   from: box1.anchors.right,
 *   to: box2.anchors.left
 * });
 * ```
 * 
 * @example
 * Orthogonal connector with label
 * ```typescript
 * const connector = new FlowConnector({
 *   from: box1.anchors.bottom,
 *   to: box2.anchors.top,
 *   routing: 'orthogonal',
 *   label: 'Yes'
 * });
 * ```
 * 
 * @example
 * Connector with waypoints
 * ```typescript
 * const connector = new FlowConnector({
 *   from: box1.anchors.right,
 *   to: box2.anchors.left,
 *   waypoints: [
 *     { x: 250, y: 100 },
 *     { x: 250, y: 200 }
 *   ],
 *   routing: 'orthogonal'
 * });
 * ```
 */
export class FlowConnector extends Element {
  private _from: Position;
  private _to: Position;
  private waypoints: Position[];
  private routing: "straight" | "orthogonal" | "curved";
  private arrow: boolean;
  private doubleEnded: boolean;
  private label?: string;
  private labelPosition: number;
  private labelMinDistance: number;
  private _theme: Theme;
  private _style: Partial<Style>;
  private markerId: string;
  
  private static markerCounter = 0;

  constructor(config: FlowConnectorConfig) {
    super();

    this._from = config.from;
    this._to = config.to;
    this.waypoints = config.waypoints || [];
    this.routing = config.routing || "straight";
    this.arrow = config.arrow ?? true;
    this.doubleEnded = config.doubleEnded ?? false;
    this.label = config.label;
    this.labelPosition = config.labelPosition ?? 0.5;
    this.labelMinDistance = config.labelMinDistanceFromEnds ?? 30;
    this._theme = config.theme ?? defaultTheme;

    // Generate unique marker ID for arrows
    this.markerId = `flow-arrow-${FlowConnector.markerCounter++}`;

    // Create style
    this._style = {
      ...this._theme.presets.connector,
      ...config.style,
    };
  }

  /**
   * Get the starting point of the connector.
   */
  get from(): Position {
    return this._from;
  }

  /**
   * Get the ending point of the connector.
   */
  get to(): Position {
    return this._to;
  }

  /**
   * Get the center point of the connector (midpoint).
   */
  get center(): Position {
    return {
      x: (this._from.x + this._to.x) / 2,
      y: (this._from.y + this._to.y) / 2,
    };
  }

  /**
   * Calculate the path points based on routing algorithm.
   */
  private calculatePath(): Position[] {
    if (this.routing === "straight") {
      return [this._from, ...this.waypoints, this._to];
    } else if (this.routing === "orthogonal") {
      return this.calculateOrthogonalPath();
    } else if (this.routing === "curved") {
      return this.calculateCurvedPath();
    }
    return [this._from, this._to];
  }

  /**
   * Calculate orthogonal (Manhattan) routing path.
   * Creates right-angle connections between points.
   */
  private calculateOrthogonalPath(): Position[] {
    const points: Position[] = [this._from];

    // If we have waypoints, route through them orthogonally
    if (this.waypoints.length > 0) {
      let current = this._from;
      for (const waypoint of this.waypoints) {
        // Add intermediate point to create right angle
        const midX = (current.x + waypoint.x) / 2;
        const midY = (current.y + waypoint.y) / 2;
        
        // Determine if we should go horizontal then vertical, or vice versa
        const dx = Math.abs(waypoint.x - current.x);
        const dy = Math.abs(waypoint.y - current.y);
        
        if (dx > dy) {
          // Go horizontal first
          points.push({ x: midX, y: current.y });
          points.push({ x: midX, y: waypoint.y });
        } else {
          // Go vertical first
          points.push({ x: current.x, y: midY });
          points.push({ x: waypoint.x, y: midY });
        }
        
        points.push(waypoint);
        current = waypoint;
      }
      
      // Route from last waypoint to end
      const last = this.waypoints[this.waypoints.length - 1];
      const midX = (last.x + this._to.x) / 2;
      const midY = (last.y + this._to.y) / 2;
      
      const dx = Math.abs(this._to.x - last.x);
      const dy = Math.abs(this._to.y - last.y);
      
      if (dx > dy) {
        points.push({ x: midX, y: last.y });
        points.push({ x: midX, y: this._to.y });
      } else {
        points.push({ x: last.x, y: midY });
        points.push({ x: this._to.x, y: midY });
      }
    } else {
      // Simple orthogonal routing without waypoints
      const midX = (this._from.x + this._to.x) / 2;
      const midY = (this._from.y + this._to.y) / 2;
      
      // Determine routing direction based on relative positions
      const dx = Math.abs(this._to.x - this._from.x);
      const dy = Math.abs(this._to.y - this._from.y);
      
      if (dx > dy) {
        // Horizontal routing
        points.push({ x: midX, y: this._from.y });
        points.push({ x: midX, y: this._to.y });
      } else {
        // Vertical routing
        points.push({ x: this._from.x, y: midY });
        points.push({ x: this._to.x, y: midY });
      }
    }

    points.push(this._to);
    return points;
  }

  /**
   * Calculate curved path using waypoints.
   * Returns points for a smooth curve (simplified Bezier).
   */
  private calculateCurvedPath(): Position[] {
    // For now, return straight path with waypoints
    // In a more advanced implementation, this would use Bezier curves
    return [this._from, ...this.waypoints, this._to];
  }

  /**
   * Calculate position of label along the path.
   * Places label on the longest segment, with minimum distance from ends.
   */
  private calculateLabelPosition(path: Position[]): Position {
    if (path.length === 2) {
      // Simple case: straight line with padding from ends
      const dx = path[1].x - path[0].x;
      const dy = path[1].y - path[0].y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // If line is long enough, place label with padding from ends
      if (length > this.labelMinDistance * 2) {
        const t = this.labelMinDistance / length;
        const adjustedPosition = t + (1 - 2 * t) * this.labelPosition;
        return {
          x: path[0].x + dx * adjustedPosition,
          y: path[0].y + dy * adjustedPosition,
        };
      }
      
      // Otherwise use simple midpoint
      const t = this.labelPosition;
      return {
        x: path[0].x + dx * t,
        y: path[0].y + dy * t,
      };
    }

    // For multi-segment paths, find the longest segment
    let longestSegmentIndex = 0;
    let longestLength = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const dx = path[i + 1].x - path[i].x;
      const dy = path[i + 1].y - path[i].y;
      const length = Math.sqrt(dx * dx + dy * dy);

      if (length > longestLength) {
        longestLength = length;
        longestSegmentIndex = i;
      }
    }

    // Place label on the longest segment
    const start = path[longestSegmentIndex];
    const end = path[longestSegmentIndex + 1];

    // If segment is long enough, place label with padding from segment ends
    if (longestLength > this.labelMinDistance * 2) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const t = this.labelMinDistance / longestLength;
      const adjustedPosition = t + (1 - 2 * t) * 0.5; // Place in middle of available space

      return {
        x: start.x + dx * adjustedPosition,
        y: start.y + dy * adjustedPosition,
      };
    }

    // Otherwise, place at midpoint of segment
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }

  /**
   * Generate SVG marker for arrow head.
   */
  private generateArrowMarker(isStart: boolean = false): string {
    const stroke = this._style.stroke || "#000000";
    const strokeWidth = parseFloat(String(this._style.strokeWidth || 1));
    const size = 10;
    
    const id = isStart ? `${this.markerId}-start` : this.markerId;
    const refX = isStart ? size * 0.2 : size * 0.8;
    
    if (isStart) {
      return `
        <marker id="${id}" markerWidth="${size}" markerHeight="${size}" 
                refX="${refX}" refY="${size / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polygon points="${size},0 0,${size / 2} ${size},${size}" 
                   fill="${stroke}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" />
        </marker>
      `;
    } else {
      return `
        <marker id="${id}" markerWidth="${size}" markerHeight="${size}" 
                refX="${refX}" refY="${size / 2}" orient="auto" markerUnits="userSpaceOnUse">
          <polygon points="0,0 ${size},${size / 2} 0,${size}" 
                   fill="${stroke}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" />
        </marker>
      `;
    }
  }

  /**
   * Generate path data for SVG polyline.
   */
  private generatePathData(points: Position[]): string {
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }

  /**
   * Render the connector.
   */
  render(): string {
    const path = this.calculatePath();
    const pathData = this.generatePathData(path);

    // Generate markers
    let markerDefs = "";
    let markerEnd = "";
    let markerStart = "";

    if (this.arrow) {
      markerDefs += this.generateArrowMarker(false);
      markerEnd = `marker-end="url(#${this.markerId})"`;
    }

    if (this.doubleEnded) {
      markerDefs += this.generateArrowMarker(true);
      markerStart = `marker-start="url(#${this.markerId}-start)"`;
    }

    // Create polyline
    const stroke = this._style.stroke || "#000000";
    const strokeWidth = this._style.strokeWidth || "1";
    const polyline = `<polyline points="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" ${markerEnd} ${markerStart} />`;

    // Add label if provided
    let labelSVG = "";
    if (this.label) {
      const labelPos = this.calculateLabelPosition(path);
      const textStyle = {
        ...this._theme.presets.text,
        fontSize: "12px",
      };
      
      // Create a text element for the label with background
      const bgPadding = 4;
      const labelText = this.label;
      const estimatedWidth = labelText.length * 7; // Rough estimate
      const labelHeight = 16;
      
      labelSVG = `
        <rect x="${labelPos.x - estimatedWidth / 2 - bgPadding}" y="${labelPos.y - labelHeight / 2 - bgPadding}" 
              width="${estimatedWidth + bgPadding * 2}" height="${labelHeight + bgPadding * 2}" 
              fill="${this._theme.colors.background}" stroke="${stroke}" stroke-width="${parseFloat(String(strokeWidth)) * 0.5}" />
        <text x="${labelPos.x}" y="${labelPos.y}" text-anchor="middle" dominant-baseline="middle" 
              font-family="${textStyle.fontFamily}" font-size="${textStyle.fontSize}" 
              fill="${textStyle.fill}">${labelText}</text>
      `;
    }

    return `${markerDefs}
<g>
  ${polyline}
  ${labelSVG}
</g>`;
  }
}

