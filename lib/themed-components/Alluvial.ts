/**
 * Alluvial - Flow diagram showing changes in categorical data over time/stages.
 * Also known as Sankey diagram.
 * 
 * Features:
 * - Visualizes flows between categories across multiple stages
 * - Width of flows represents magnitude
 * - Automatic color coding using Swiss theme
 * - Labels for nodes and optional flow values
 * - Interactive highlighting support
 */

import { Container } from "../layout/Container.js";
import { Path } from "../elements/Path.js";
import { Rect } from "../elements/Rect.js";
import { Text } from "../elements/Text.js";
import { type Position } from "../core/Element.js";
import { defaultTheme } from "../core/Theme.js";

export interface AlluvialNode {
  /** Node identifier */
  id: string;
  /** Node label */
  label: string;
  /** Optional color (otherwise auto-assigned) */
  color?: string;
}

export interface AlluvialFlow {
  /** Source node id */
  from: string;
  /** Target node id */
  to: string;
  /** Flow value (determines width) */
  value: number;
}

export interface AlluvialStage {
  /** Stage label */
  label: string;
  /** Nodes in this stage */
  nodes: AlluvialNode[];
}

export interface AlluvialConfig {
  /** Stages from left to right */
  stages: AlluvialStage[];
  /** Flows between nodes */
  flows: AlluvialFlow[];
  /** Width of the diagram */
  width: number;
  /** Height of the diagram */
  height: number;
  /** Width of node bars */
  nodeWidth?: number;
  /** Padding between nodes */
  nodePadding?: number;
  /** Whether to show flow values */
  showFlowValues?: boolean;
  /** Whether to show stage labels */
  showStageLabels?: boolean;
  /** Margin between node block and label */
  labelMargin?: number;
}

/**
 * Node block with position accessors
 */
export interface AlluvialNodeBlock {
  /** Node ID */
  id: string;
  /** Node label */
  label: string;
  /** Rectangle element representing the node */
  rect: Rect;
  /** Color of the node */
  color: string;
  /** Get top-left position */
  get topLeft(): Position;
  /** Get top-right position */
  get topRight(): Position;
  /** Get bottom-left position */
  get bottomLeft(): Position;
  /** Get bottom-right position */
  get bottomRight(): Position;
  /** Get center position */
  get center(): Position;
  /** Get center-left position */
  get centerLeft(): Position;
  /** Get center-right position */
  get centerRight(): Position;
  /** Get top-center position */
  get topCenter(): Position;
  /** Get bottom-center position */
  get bottomCenter(): Position;
}

interface NodeLayout {
  id: string;
  label: string;
  x: number;
  y: number;
  height: number;
  color: string;
  stage: number;
}

interface FlowLayout {
  from: NodeLayout;
  to: NodeLayout;
  value: number;
  color: string;
}

/**
 * Internal class for node blocks with position accessors
 */
class NodeBlock implements AlluvialNodeBlock {
  id: string;
  label: string;
  rect: Rect;
  color: string;

  constructor(id: string, label: string, rect: Rect, color: string) {
    this.id = id;
    this.label = label;
    this.rect = rect;
    this.color = color;
  }

  get topLeft(): Position { return this.rect.topLeft; }
  get topRight(): Position { return this.rect.topRight; }
  get bottomLeft(): Position { return this.rect.bottomLeft; }
  get bottomRight(): Position { return this.rect.bottomRight; }
  get center(): Position { return this.rect.center; }
  get centerLeft(): Position { return this.rect.centerLeft; }
  get centerRight(): Position { return this.rect.centerRight; }
  get topCenter(): Position { return this.rect.topCenter; }
  get bottomCenter(): Position { return this.rect.bottomCenter; }
}

/**
 * Alluvial diagram component for flow visualization
 */
export class Alluvial extends Container {
  private config: Required<AlluvialConfig>;
  private colorPalette: string[];
  private nodeLayouts: Map<string, NodeLayout> = new Map();
  private nodeBlocks: Map<string, AlluvialNodeBlock> = new Map();
  private flowPaths: Path[] = [];

  constructor(config: AlluvialConfig) {
    super({ 
      direction: "freeform",
      width: config.width,
      height: config.height,
    });

    // Set defaults
    this.config = {
      ...config,
      nodeWidth: config.nodeWidth ?? 20,
      nodePadding: config.nodePadding ?? 10,
      showFlowValues: config.showFlowValues ?? false,
      showStageLabels: config.showStageLabels ?? true,
      labelMargin: config.labelMargin ?? defaultTheme.spacing[2], // 8px
    };

    // Swiss theme color palette - using variations
    this.colorPalette = [
      defaultTheme.colors.primary,         // Swiss Red
      "#3B82F6",                           // Blue
      "#10B981",                           // Green
      "#F59E0B",                           // Orange
      "#8B5CF6",                           // Purple
      "#EC4899",                           // Pink
      "#14B8A6",                           // Teal
      "#F97316",                           // Bright Orange
    ];

    this.buildAlluvial();
  }

  private buildAlluvial(): void {
    const { stages, flows, width, height, nodeWidth, nodePadding, showStageLabels } = this.config;

    // Calculate available height for nodes
    const stageHeight = showStageLabels ? height - 40 : height;
    const stageY = showStageLabels ? 30 : 0;

    // Calculate stage positions
    const stageSpacing = (width - nodeWidth * stages.length) / (stages.length - 1 || 1);
    const stagePositions = stages.map((_, i) => nodeWidth / 2 + i * (nodeWidth + stageSpacing));

    // Calculate node heights based on total flow through each node
    const nodeValues = this.calculateNodeValues(flows);

    // Calculate total value for scaling
    let maxStageValue = 0;
    stages.forEach((stage) => {
      const stageValue = stage.nodes.reduce((sum, node) => sum + (nodeValues.get(node.id) || 0), 0);
      maxStageValue = Math.max(maxStageValue, stageValue);
    });

    // First pass: Calculate all node layouts (without creating elements yet)
    stages.forEach((stage, stageIndex) => {
      const x = stagePositions[stageIndex];
      let currentY = stageY;

      // Layout nodes
      stage.nodes.forEach((node, nodeIndex) => {
        const nodeValue = nodeValues.get(node.id) || 0;
        const nodeHeight = Math.max(10, (nodeValue / maxStageValue) * stageHeight * 0.8);

        const color = node.color || this.colorPalette[nodeIndex % this.colorPalette.length];

        const layout: NodeLayout = {
          id: node.id,
          label: node.label,
          x,
          y: currentY,
          height: nodeHeight,
          color,
          stage: stageIndex,
        };

        this.nodeLayouts.set(node.id, layout);

        currentY += nodeHeight + nodePadding;
      });
    });

    // Second pass: Create flows first (so they render behind nodes and tooltips)
    flows.forEach((flow) => {
      this.createFlow(flow);
    });

    // Third pass: Create stage labels, nodes, and tooltips (so they render on top)
    stages.forEach((stage, stageIndex) => {
      const x = stagePositions[stageIndex];

      // Add stage label
      if (showStageLabels) {
        const stageLabel = new Text({
          content: stage.label,
          fontSize: 12,
          style: {
            fill: defaultTheme.colors.neutral[600],
            fontWeight: 600,
          },
        });
        stageLabel.position({
          relativeTo: this.contentBox.topLeft,
          relativeFrom: stageLabel.topCenter,
          x,
          y: 10,
        });
        this.addElement(stageLabel);
      }

      // Create nodes and tooltips
      stage.nodes.forEach((node) => {
        const layout = this.nodeLayouts.get(node.id);
        if (layout) {
          const nodeValue = nodeValues.get(node.id) || 0;
          this.createNode(layout, nodeValue, maxStageValue);
        }
      });
    });
  }

  private calculateNodeValues(flows: AlluvialFlow[]): Map<string, number> {
    const values = new Map<string, number>();

    flows.forEach((flow) => {
      const fromValue = values.get(flow.from) || 0;
      const toValue = values.get(flow.to) || 0;
      values.set(flow.from, fromValue + flow.value);
      values.set(flow.to, toValue + flow.value);
    });

    return values;
  }

  private createNode(layout: NodeLayout, nodeValue: number, maxStageValue: number): void {
    const { nodeWidth, labelMargin } = this.config;
    const { id, x, y, height, color, label } = layout;

    // Create node rectangle
    const node = new Rect({
      width: nodeWidth,
      height,
      style: {
        fill: color,
        stroke: "#ffffff",
        strokeWidth: "1",
      },
    });
    
    // Position the node relative to this container's content box
    node.position({
      relativeTo: this.contentBox.topLeft,
      relativeFrom: node.topLeft,
      x: x - nodeWidth / 2,
      y,
    });

    this.addElement(node);

    // Store node block with position accessors
    const nodeBlock = new NodeBlock(id, label, node, color);
    this.nodeBlocks.set(id, nodeBlock);

    // Calculate percentage
    const percentage = Math.round((nodeValue / maxStageValue) * 100);

    // Create tooltip-style container for the label (matching Timeline tooltip styling)
    const tooltipContainer = new Container({
      width: "auto",
      height: "auto",
      direction: "horizontal",
      spacing: 0,
      boxModel: { padding: 8 },
      style: {
        fill: defaultTheme.colors.background,
        stroke: defaultTheme.colors.border,
        strokeWidth: "1",
      },
    });

    // Set border radius (matching Timeline)
    (tooltipContainer as any)._borderRadius = defaultTheme.borders.radius.sm;

    // Add label text with percentage
    const nodeLabel = new Text({
      content: `${label} (${percentage}%)`,
      fontSize: 11,
      style: {
        fill: defaultTheme.colors.foreground,
        fontWeight: 500,
      },
    });

    tooltipContainer.add(nodeLabel);

    // Position tooltip to the right of the node, vertically centered
    tooltipContainer.position({
      relativeTo: node.centerRight,
      relativeFrom: tooltipContainer.centerLeft,
      x: labelMargin,
      y: 0,
    });

    this.addElement(tooltipContainer);
  }

  /**
   * Get contrasting text color (black or white) based on background
   */
  private getContrastColor(backgroundColor: string): string {
    // Simple luminance calculation
    let r = 0, g = 0, b = 0;
    
    if (backgroundColor.startsWith('#')) {
      const hex = backgroundColor.slice(1);
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    }
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  private createFlow(flow: AlluvialFlow): void {
    const fromNode = this.nodeLayouts.get(flow.from);
    const toNode = this.nodeLayouts.get(flow.to);

    if (!fromNode || !toNode) {
      console.warn(`Flow references unknown node: ${flow.from} -> ${flow.to}`);
      return;
    }

    const { nodeWidth } = this.config;

    // Calculate flow positions (from right edge of source to left edge of target)
    const x1 = fromNode.x + nodeWidth / 2;
    const y1 = fromNode.y + fromNode.height / 2;
    const x2 = toNode.x - nodeWidth / 2;
    const y2 = toNode.y + toNode.height / 2;

    // Calculate flow height based on value
    const flowHeight = Math.max(2, flow.value / 10); // Adjust scaling as needed

    // Create curved flow path (Bézier curve)
    const controlX = (x1 + x2) / 2;
    
    // Create path with gradient effect (top and bottom curves)
    const pathData = `
      M ${x1},${y1 - flowHeight / 2}
      C ${controlX},${y1 - flowHeight / 2} ${controlX},${y2 - flowHeight / 2} ${x2},${y2 - flowHeight / 2}
      L ${x2},${y2 + flowHeight / 2}
      C ${controlX},${y2 + flowHeight / 2} ${controlX},${y1 + flowHeight / 2} ${x1},${y1 + flowHeight / 2}
      Z
    `.trim().replace(/\s+/g, ' ');

    const flowPath = new Path({
      d: pathData,
      style: {
        fill: fromNode.color,
        fillOpacity: "0.4",
        stroke: "none",
      },
    });

    // Position the path at the content box origin since path coordinates are relative to content box
    flowPath.position({
      relativeTo: this.contentBox.topLeft,
      relativeFrom: flowPath.topLeft,
      x: 0,
      y: 0,
    });

    this.flowPaths.push(flowPath);
    this.addElement(flowPath);
  }

  /**
   * Get the layout for a specific node by id
   */
  getNode(id: string): NodeLayout | undefined {
    return this.nodeLayouts.get(id);
  }

  /**
   * Get all node layouts
   */
  getAllNodes(): NodeLayout[] {
    return Array.from(this.nodeLayouts.values());
  }

  /**
   * Get all flow paths
   */
  getAllFlows(): Path[] {
    return this.flowPaths;
  }

  /**
   * Get a node block by id with position accessors
   */
  getNodeBlock(id: string): AlluvialNodeBlock | undefined {
    return this.nodeBlocks.get(id);
  }

  /**
   * Get all node blocks with position accessors
   */
  getAllNodeBlocks(): AlluvialNodeBlock[] {
    return Array.from(this.nodeBlocks.values());
  }

  // Standard position accessors (inherited from Container, but redeclaring for clarity)
  get topLeft(): Position { return this.borderBox.topLeft; }
  get topRight(): Position { return this.borderBox.topRight; }
  get bottomLeft(): Position { return this.borderBox.bottomLeft; }
  get bottomRight(): Position { return this.borderBox.bottomRight; }
  get center(): Position { return this.borderBox.center; }
  get topCenter(): Position { return { x: this.borderBox.center.x, y: this.borderBox.topLeft.y }; }
  get bottomCenter(): Position { return { x: this.borderBox.center.x, y: this.borderBox.bottomLeft.y }; }
  get centerLeft(): Position { return { x: this.borderBox.topLeft.x, y: this.borderBox.center.y }; }
  get centerRight(): Position { return { x: this.borderBox.topRight.x, y: this.borderBox.center.y }; }
  get top(): Position { return this.topCenter; }
  get bottom(): Position { return this.bottomCenter; }
  get left(): Position { return this.centerLeft; }
  get right(): Position { return this.centerRight; }
}

