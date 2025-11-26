/**
 * Flowchart component with automatic layout and collision-free routing.
 * 
 * Manages flowchart nodes and automatically routes connectors to avoid collisions.
 */

import { Element, type Position } from "../core/Element.js";
import { FlowBox } from "./FlowBox.js";
import { type Theme, defaultTheme } from "../core/Theme.js";
import { findPath, calculateLabelPosition, type Obstacle } from "../utils/PathFinding.js";
import { calculateLayout, type LayoutNode, type LayoutConnection } from "../utils/FlowchartLayout.js";

/**
 * Layout direction for automatic positioning.
 */
export type FlowchartLayoutDirection = "vertical" | "horizontal";

/**
 * Flowchart node definition.
 */
export interface FlowchartNode {
  /**
   * Unique identifier for the node.
   */
  id: string;

  /**
   * Text content to display in the node.
   */
  text: string;

  /**
   * Position of the node.
   * If not provided, will be automatically calculated based on layout algorithm.
   */
  position?: Position;

  /**
   * Width of the node box.
   * @defaultValue 140
   */
  width?: number;

  /**
   * Height of the node box.
   * @defaultValue 60
   */
  height?: number;

  /**
   * Tint for the node (default, accent, muted, or custom color).
   * @defaultValue 'default'
   */
  tint?: "default" | "accent" | "muted" | string;
}

/**
 * Connection between flowchart nodes.
 */
export interface FlowchartConnection {
  /**
   * Source node ID.
   */
  from: string;

  /**
   * Target node ID.
   */
  to: string;

  /**
   * Label to display on the connection.
   */
  label?: string;

  /**
   * Which anchor point to use on the source node.
   * @defaultValue 'auto' (automatically determined)
   */
  fromAnchor?: "top" | "right" | "bottom" | "left" | "auto";

  /**
   * Which anchor point to use on the target node.
   * @defaultValue 'auto' (automatically determined)
   */
  toAnchor?: "top" | "right" | "bottom" | "left" | "auto";
}

/**
 * Configuration for the Flowchart component.
 */
export interface FlowchartConfig {
  /**
   * Nodes in the flowchart.
   */
  nodes: FlowchartNode[];

  /**
   * Connections between nodes.
   */
  connections: FlowchartConnection[];

  /**
   * Theme to use for styling.
   */
  theme?: Theme;

  /**
   * Minimum spacing between nodes for collision avoidance.
   * @defaultValue 30
   */
  minSpacing?: number;

  /**
   * Padding around nodes for pathfinding.
   * @defaultValue 20
   */
  nodePadding?: number;

  /**
   * Grid size for pathfinding (smaller = more precise but slower).
   * @defaultValue 10
   */
  gridSize?: number;

  /**
   * Layout direction for automatic positioning.
   * Only used if nodes don't have explicit positions.
   * @defaultValue 'vertical'
   */
  layoutDirection?: FlowchartLayoutDirection;

  /**
   * Spacing between nodes on the same level (horizontal spacing in vertical layout).
   * Only used for automatic layout.
   * @defaultValue 60
   */
  nodeSpacing?: number;

  /**
   * Spacing between levels (vertical spacing in vertical layout).
   * Only used for automatic layout.
   * @defaultValue 100
   */
  levelSpacing?: number;

  /**
   * Margin around the entire flowchart.
   * Only used for automatic layout.
   * @defaultValue 50
   */
  layoutMargin?: number;

  /**
   * Starting position for the layout.
   * Only used for automatic layout.
   * @defaultValue { x: 0, y: 0 }
   */
  startPosition?: Position;
}

/**
 * Flowchart component for creating diagrams with automatic routing.
 * 
 * The Flowchart component manages nodes and connections, automatically
 * routing connectors to avoid collisions using A* pathfinding.
 * 
 * @example
 * Basic flowchart
 * ```typescript
 * const flowchart = new Flowchart({
 *   nodes: [
 *     { id: 'start', text: 'Start', position: { x: 400, y: 100 }, tint: 'accent' },
 *     { id: 'process', text: 'Process', position: { x: 400, y: 200 } },
 *     { id: 'end', text: 'End', position: { x: 400, y: 300 }, tint: 'accent' }
 *   ],
 *   connections: [
 *     { from: 'start', to: 'process' },
 *     { from: 'process', to: 'end' }
 *   ]
 * });
 * ```
 */
export class Flowchart extends Element {
  private nodes: Map<string, FlowBox>;
  private nodeConfigs: FlowchartNode[];
  private connections: FlowchartConnection[];
  private _theme: Theme;
  private minSpacing: number;
  private nodePadding: number;
  private gridSize: number;
  private layoutDirection: FlowchartLayoutDirection;
  private nodeSpacing: number;
  private levelSpacing: number;
  private layoutMargin: number;
  private startPosition: Position;

  constructor(config: FlowchartConfig) {
    super();

    this.nodeConfigs = config.nodes;
    this.connections = config.connections;
    this._theme = config.theme ?? defaultTheme;
    this.minSpacing = config.minSpacing ?? 30;
    this.nodePadding = config.nodePadding ?? 20;
    this.gridSize = config.gridSize ?? 10;
    this.layoutDirection = config.layoutDirection ?? "vertical";
    this.nodeSpacing = config.nodeSpacing ?? 60;
    this.levelSpacing = config.levelSpacing ?? 100;
    this.layoutMargin = config.layoutMargin ?? 50;
    this.startPosition = config.startPosition ?? { x: 0, y: 0 };
    this.nodes = new Map();

    this.buildFlowchart();
  }

  /**
   * Build the flowchart by creating nodes and routing connections.
   */
  private buildFlowchart(): void {
    // Calculate automatic layout if needed
    const positions = this.calculateNodePositions();

    // Create all nodes first
    for (const nodeConfig of this.nodeConfigs) {
      const box = new FlowBox({
        width: nodeConfig.width ?? 140,
        height: nodeConfig.height ?? 60,
        text: nodeConfig.text,
        tint: nodeConfig.tint ?? "default",
        theme: this._theme,
      });

      // Position the node (use calculated position if no explicit position)
      const nodePosition = nodeConfig.position ?? positions.get(nodeConfig.id)!;
      box.position({
        relativeFrom: box.anchors.center,
        relativeTo: nodePosition,
        x: 0,
        y: 0,
      });

      this.nodes.set(nodeConfig.id, box);
      this.addElement(box);
    }

    // Create all connections with pathfinding
    for (const conn of this.connections) {
      this.createConnection(conn);
    }
  }

  /**
   * Calculate positions for nodes using automatic layout algorithm.
   */
  private calculateNodePositions(): Map<string, Position> {
    // Prepare layout nodes
    const layoutNodes: LayoutNode[] = this.nodeConfigs.map(node => ({
      id: node.id,
      width: node.width ?? 140,
      height: node.height ?? 60,
      position: node.position,
    }));

    // Prepare layout connections
    const layoutConnections: LayoutConnection[] = this.connections.map(conn => ({
      from: conn.from,
      to: conn.to,
    }));

    // Calculate layout
    return calculateLayout(layoutNodes, layoutConnections, {
      direction: this.layoutDirection,
      nodeSpacing: this.nodeSpacing,
      levelSpacing: this.levelSpacing,
      margin: this.layoutMargin,
      startPosition: this.startPosition,
    });
  }

  /**
   * Create a connection between two nodes with automatic routing.
   */
  private createConnection(conn: FlowchartConnection): void {
    const fromBox = this.nodes.get(conn.from);
    const toBox = this.nodes.get(conn.to);

    if (!fromBox || !toBox) {
      console.warn(`Flowchart: Could not find nodes for connection ${conn.from} -> ${conn.to}`);
      return;
    }

    // Determine anchor points
    const fromAnchor = this.getAnchorPoint(fromBox, toBox, conn.fromAnchor);
    const toAnchor = this.getAnchorPoint(toBox, fromBox, conn.toAnchor);

    // Get all obstacles (all nodes except the connected ones)
    const obstacles: Obstacle[] = [];
    for (const [id, box] of this.nodes) {
      if (id !== conn.from && id !== conn.to) {
        const topLeft = box.borderBox.topLeft;
        obstacles.push({
          x: topLeft.x,
          y: topLeft.y,
          width: box.width,
          height: box.height,
        });
      }
    }

    // Find path avoiding obstacles
    const path = findPath(
      fromAnchor,
      toAnchor,
      obstacles,
      this.gridSize,
      this.nodePadding
    );

    // Create connector as SVG polyline
    this.createConnectorSVG(path, conn.label);
  }

  /**
   * Determine the appropriate anchor point for a connection.
   */
  private getAnchorPoint(
    fromBox: FlowBox,
    toBox: FlowBox,
    specified?: "top" | "right" | "bottom" | "left" | "auto"
  ): Position {
    if (specified && specified !== "auto") {
      return fromBox.anchors[specified];
    }

    // Auto-determine based on relative positions
    const fromCenter = fromBox.anchors.center;
    const toCenter = toBox.anchors.center;

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;

    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal movement is primary
      return dx > 0 ? fromBox.anchors.right : fromBox.anchors.left;
    } else {
      // Vertical movement is primary
      return dy > 0 ? fromBox.anchors.bottom : fromBox.anchors.top;
    }
  }

  /**
   * Create connector SVG from path waypoints.
   */
  private createConnectorSVG(path: Position[], label?: string): void {
    if (path.length < 2) return;

    // Generate polyline path
    const pathData = path.map(p => `${p.x},${p.y}`).join(" ");

    // Create arrow marker
    const markerId = `flowchart-arrow-${Math.random().toString(36).substr(2, 9)}`;
    const stroke = this._theme.presets.connector.stroke || "#000000";
    const strokeWidth = parseFloat(String(this._theme.presets.connector.strokeWidth || "1.5"));

    const markerDef = `
      <marker id="${markerId}" markerWidth="10" markerHeight="10" 
              refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
        <polygon points="0,0 10,5 0,10" 
                 fill="${stroke}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" />
      </marker>
    `;

    // Create polyline with marker
    let polyline = `<polyline points="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" marker-end="url(#${markerId})" />`;

    // Add label if provided
    let labelSVG = "";
    if (label) {
      const labelPos = calculateLabelPosition(path, this.minSpacing);
      const textStyle = this._theme.presets.text;
      const bgPadding = 6;
      const estimatedWidth = label.length * 8;
      const labelHeight = 18;

      labelSVG = `
        <rect x="${labelPos.x - estimatedWidth / 2 - bgPadding}" y="${labelPos.y - labelHeight / 2 - bgPadding}" 
              width="${estimatedWidth + bgPadding * 2}" height="${labelHeight + bgPadding * 2}" 
              fill="${this._theme.colors.background}" stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" rx="2" />
        <text x="${labelPos.x}" y="${labelPos.y + 1}" text-anchor="middle" dominant-baseline="middle" 
              font-family="${textStyle.fontFamily}" font-size="13px" 
              fill="${textStyle.fill}" font-weight="500">${label}</text>
      `;
    }

    // Store as raw SVG element (we'll render it directly)
    const connectorElement = new RawSVGElement(markerDef + polyline + labelSVG);
    this.addElement(connectorElement);
  }

  /**
   * Get a node by ID.
   */
  getNode(id: string): FlowBox | undefined {
    return this.nodes.get(id);
  }

  /**
   * Render the flowchart.
   */
  render(): string {
    // Render all children (nodes and connectors)
    return this.children.map(child => child.render()).join("\n");
  }
}

/**
 * Helper element for rendering raw SVG.
 */
class RawSVGElement extends Element {
  private svg: string;

  constructor(svg: string) {
    super();
    this.svg = svg;
  }

  render(): string {
    return this.svg;
  }
}

