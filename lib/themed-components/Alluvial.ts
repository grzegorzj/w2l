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
 * Alluvial diagram component for flow visualization
 */
export class Alluvial extends Container {
  private config: Required<AlluvialConfig>;
  private colorPalette: string[];
  private nodeLayouts: Map<string, NodeLayout> = new Map();
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

    // Layout nodes for each stage
    stages.forEach((stage, stageIndex) => {
      const x = stagePositions[stageIndex];
      let currentY = stageY;

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
        this.createNode(layout);

        currentY += nodeHeight + nodePadding;
      });
    });

    // Create flows
    flows.forEach((flow) => {
      this.createFlow(flow);
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

  private createNode(layout: NodeLayout): void {
    const { nodeWidth } = this.config;
    const { x, y, height, color, label } = layout;

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

    // Add label
    const textColor = this.getContrastColor(color);
    const nodeLabel = new Text({
      content: label,
      fontSize: 11,
      style: {
        fill: textColor,
        fontWeight: 500,
      },
    });

    // Position label at center of node
    nodeLabel.position({
      relativeTo: node.center,
      relativeFrom: nodeLabel.center,
      x: 0,
      y: 0,
    });

    this.addElement(nodeLabel);
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

