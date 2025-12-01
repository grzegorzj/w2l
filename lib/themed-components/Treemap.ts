/**
 * Treemap - Hierarchical data visualization using nested rectangles.
 *
 * Features:
 * - Visualizes hierarchical data with nested rectangles
 * - Size represents value/weight
 * - Automatic color coding using Swiss theme
 * - Labels with automatic contrast adjustment
 * - Interactive highlighting support
 */

import { Container } from "../layout/Container.js";
import { Rect } from "../elements/Rect.js";
import { Text } from "../elements/Text.js";
import { type Position } from "../core/Element.js";
import { defaultTheme } from "../core/Theme.js";

export interface TreemapNode {
  /** Node label */
  label: string;
  /** Node value (determines size) */
  value: number;
  /** Optional children nodes */
  children?: TreemapNode[];
  /** Optional custom color (otherwise auto-assigned from theme) */
  color?: string;
  /** Whether this node is highlighted */
  highlighted?: boolean;
}

export interface TreemapConfig {
  /** Root node of the tree hierarchy */
  data: TreemapNode;
  /** Width of the treemap */
  width: number;
  /** Height of the treemap */
  height: number;
  /** Padding between rectangles */
  padding?: number;
  /** Minimum font size for labels */
  minFontSize?: number;
  /** Whether to show values alongside labels */
  showValues?: boolean;
}

interface LayoutRect {
  x: number;
  y: number;
  width: number;
  height: number;
  node: TreemapNode;
  depth: number;
}

/**
 * Treemap component for hierarchical data visualization
 */
export class Treemap extends Container {
  private config: Required<TreemapConfig>;
  private colorPalette: string[];
  private rectangles: Map<string, Rect> = new Map();

  constructor(config: TreemapConfig) {
    super({
      direction: "freeform",
      width: config.width,
      height: config.height,
    });

    // Set defaults
    this.config = {
      ...config,
      padding: config.padding ?? 2,
      minFontSize: config.minFontSize ?? 10,
      showValues: config.showValues ?? false,
    };

    // Swiss theme color palette - using variations of primary and neutral
    this.colorPalette = [
      defaultTheme.colors.primary, // Swiss Red
      "#3B82F6", // Blue
      "#10B981", // Green
      "#F59E0B", // Orange
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#14B8A6", // Teal
      "#F97316", // Bright Orange
    ];

    this.buildTreemap();
  }

  private buildTreemap(): void {
    const { data, width, height, padding } = this.config;

    // Calculate layout using squarified treemap algorithm
    const layout = this.squarify(data, 0, 0, width, height, 0);

    // Create rectangles and labels
    layout.forEach((rect, index) => {
      this.createRectangle(rect, index);
    });
  }

  /**
   * Squarified treemap layout algorithm
   * Attempts to create rectangles with aspect ratios close to 1
   */
  private squarify(
    node: TreemapNode,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number
  ): LayoutRect[] {
    const result: LayoutRect[] = [];

    // If leaf node, return single rectangle
    if (!node.children || node.children.length === 0) {
      result.push({ x, y, width, height, node, depth });
      return result;
    }

    // Calculate total value
    const total = node.children.reduce((sum, child) => sum + child.value, 0);

    // Apply padding
    const { padding } = this.config;
    const innerX = x + padding;
    const innerY = y + padding;
    const innerWidth = width - 2 * padding;
    const innerHeight = height - 2 * padding;

    // Sort children by value (descending)
    const sortedChildren = [...node.children].sort((a, b) => b.value - a.value);

    // Layout children using squarified algorithm
    let currentX = innerX;
    let currentY = innerY;
    const horizontal = innerWidth >= innerHeight;

    for (const child of sortedChildren) {
      const ratio = child.value / total;

      if (horizontal) {
        const childWidth = innerWidth * ratio;
        const rects = this.squarify(
          child,
          currentX,
          currentY,
          childWidth,
          innerHeight,
          depth + 1
        );
        result.push(...rects);
        currentX += childWidth;
      } else {
        const childHeight = innerHeight * ratio;
        const rects = this.squarify(
          child,
          currentX,
          currentY,
          innerWidth,
          childHeight,
          depth + 1
        );
        result.push(...rects);
        currentY += childHeight;
      }
    }

    return result;
  }

  private createRectangle(rect: LayoutRect, index: number): void {
    const { node, x, y, width, height, depth } = rect;
    const { minFontSize, showValues } = this.config;

    // Determine color
    let fillColor = node.color;
    if (!fillColor) {
      // Auto-assign color from palette based on depth and index
      const colorIndex = (depth * 3 + index) % this.colorPalette.length;
      fillColor = this.colorPalette[colorIndex];
    }

    // Adjust opacity based on depth
    const opacity = 1 - depth * 0.15;

    // Create rectangle
    const rectangle = new Rect({
      width,
      height,
      style: {
        fill: fillColor,
        fillOpacity: opacity.toString(),
        stroke: "#ffffff",
        strokeWidth: "1",
      },
    });

    // Position the rectangle relative to this container's content box
    // The x, y from the layout algorithm are relative to the treemap's 0,0
    rectangle.position({
      relativeTo: this.contentBox.topLeft,
      relativeFrom: rectangle.topLeft,
      x,
      y,
    });

    this.rectangles.set(node.label, rectangle);
    this.addElement(rectangle);

    // Add label if rectangle is large enough
    const labelFontSize = Math.min(16, Math.max(minFontSize, height / 4));
    const labelText = showValues ? `${node.label} (${node.value})` : node.label;

    if (width > 40 && height > 20 && labelFontSize >= minFontSize) {
      // Determine text color based on background brightness
      const textColor = this.getContrastColor(fillColor);

      const label = new Text({
        content: labelText,
        fontSize: labelFontSize,
        style: {
          fill: textColor,
          fontWeight: node.highlighted ? 700 : 400,
        },
      });

      // Center the label in the rectangle
      label.position({
        relativeTo: rectangle.center,
        relativeFrom: label.center,
        x: 0,
        y: 0,
      });

      this.addElement(label);
    }
  }

  /**
   * Get contrasting text color (black or white) based on background
   */
  private getContrastColor(backgroundColor: string): string {
    // Simple luminance calculation
    let r = 0,
      g = 0,
      b = 0;

    if (backgroundColor.startsWith("#")) {
      const hex = backgroundColor.slice(1);
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    }

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  /**
   * Get the rectangle element for a specific node by label
   */
  getRectangle(label: string): Rect | undefined {
    return this.rectangles.get(label);
  }

  /**
   * Get all rectangles
   */
  getAllRectangles(): Rect[] {
    return Array.from(this.rectangles.values());
  }

  // Standard position accessors (inherited from Container, but redeclaring for clarity)
  get topLeft(): Position {
    return this.borderBox.topLeft;
  }
  get topRight(): Position {
    return this.borderBox.topRight;
  }
  get bottomLeft(): Position {
    return this.borderBox.bottomLeft;
  }
  get bottomRight(): Position {
    return this.borderBox.bottomRight;
  }
  get center(): Position {
    return this.borderBox.center;
  }
  get topCenter(): Position {
    return { x: this.borderBox.center.x, y: this.borderBox.topLeft.y };
  }
  get bottomCenter(): Position {
    return { x: this.borderBox.center.x, y: this.borderBox.bottomLeft.y };
  }
  get centerLeft(): Position {
    return { x: this.borderBox.topLeft.x, y: this.borderBox.center.y };
  }
  get centerRight(): Position {
    return { x: this.borderBox.topRight.x, y: this.borderBox.center.y };
  }
  get top(): Position {
    return this.topCenter;
  }
  get bottom(): Position {
    return this.bottomCenter;
  }
  get left(): Position {
    return this.centerLeft;
  }
  get right(): Position {
    return this.centerRight;
  }
}
