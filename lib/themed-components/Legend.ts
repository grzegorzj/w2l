/**
 * Legend - A color-coded legend for charts and visualizations.
 *
 * Features:
 * - Color indicator (dot or square)
 * - Text label
 * - Horizontal or vertical layout
 * - Auto-sizing based on content
 * - Professional styling from theme
 */

import { Container } from "../layout/Container.js";
import { Circle } from "../elements/Circle.js";
import { Rect } from "../elements/Rect.js";
import { Text } from "../elements/Text.js";
import { Element } from "../core/Element.js";
import { type Style } from "../core/Stylable.js";
import { defaultTheme } from "../core/Theme.js";

export interface LegendItem {
  /**
   * Color for the indicator.
   */
  color: string;

  /**
   * Label text for this item.
   */
  label: string;
}

export interface LegendConfig {
  /**
   * Array of legend items to display.
   */
  items: LegendItem[];

  /**
   * Layout direction for the legend items.
   * @default "vertical"
   */
  direction?: "horizontal" | "vertical";

  /**
   * Shape of the color indicator.
   * @default "circle"
   */
  indicatorShape?: "circle" | "square";

  /**
   * Size of the indicator (radius for circle, side length for square).
   * @default 6
   */
  indicatorSize?: number;

  /**
   * Spacing between indicator and label.
   * @default 8
   */
  itemSpacing?: number;

  /**
   * Spacing between legend items.
   * @default 12
   */
  spacing?: number;

  /**
   * Font size for labels.
   * @default 14
   */
  fontSize?: number;

  /**
   * Additional style overrides for labels.
   */
  labelStyle?: Partial<Style>;
}

/**
 * Legend component for displaying color-coded items.
 *
 * Useful for charts, graphs, and any visualization that uses colors
 * to represent different categories or data series.
 *
 * @example
 * ```typescript
 * const legend = new Legend({
 *   items: [
 *     { color: "#3b82f6", label: "Series A" },
 *     { color: "#ef4444", label: "Series B" },
 *     { color: "#10b981", label: "Series C" },
 *   ],
 *   direction: "vertical",
 * });
 * artboard.add(legend.container);
 * ```
 */
export class Legend {
  private mainContainer: Container;
  private items: LegendItem[];
  private config: Required<Omit<LegendConfig, "items" | "labelStyle">> & {
    labelStyle?: Partial<Style>;
  };

  constructor(config: LegendConfig) {
    this.items = config.items;
    this.config = {
      direction: config.direction ?? "vertical",
      indicatorShape: config.indicatorShape ?? "circle",
      indicatorSize: config.indicatorSize ?? 6,
      itemSpacing: config.itemSpacing ?? 8,
      spacing: config.spacing ?? 12,
      fontSize: config.fontSize ?? 14,
      labelStyle: config.labelStyle,
    };

    // Create main container
    this.mainContainer = new Container({
      width: "auto",
      height: "auto",
      direction: this.config.direction,
      spacing: this.config.spacing,
      horizontalAlignment: "left",
      verticalAlignment: "top",
    });

    // Create legend items
    for (const item of this.items) {
      const itemContainer = this.createLegendItem(item);
      this.mainContainer.addElement(itemContainer);
    }
  }

  /**
   * Create a single legend item (indicator + label).
   */
  private createLegendItem(item: LegendItem): Container {
    // Container for indicator + label (always horizontal)
    const itemContainer = new Container({
      width: "auto",
      height: "auto",
      direction: "horizontal",
      spacing: this.config.itemSpacing,
      horizontalAlignment: "left",
      verticalAlignment: "center",
    });

    // Create indicator
    const indicator = this.createIndicator(item.color);
    itemContainer.addElement(indicator);

    // Create label
    const label = new Text({
      content: item.label,
      fontSize: this.config.fontSize,
      style: {
        fill: defaultTheme.colors.foreground,
        fontFamily: defaultTheme.typography.fontSans,
        ...this.config.labelStyle,
      },
    });
    itemContainer.addElement(label);

    return itemContainer;
  }

  /**
   * Create the color indicator (circle or square).
   */
  private createIndicator(color: string): Element {
    if (this.config.indicatorShape === "circle") {
      return new Circle({
        radius: this.config.indicatorSize,
        style: {
          fill: color,
          stroke: "none",
        },
      });
    } else {
      // Square
      const size = this.config.indicatorSize * 2;
      return new Rect({
        width: size,
        height: size,
        style: {
          fill: color,
          stroke: "none",
        },
      });
    }
  }

  /**
   * Get the main container to add to the artboard or parent.
   */
  get container(): Container {
    return this.mainContainer;
  }

  /**
   * Get the width of the legend.
   */
  get width(): number {
    return this.mainContainer.width;
  }

  /**
   * Get the height of the legend.
   */
  get height(): number {
    return this.mainContainer.height;
  }

  /**
   * Position the legend at a specific location.
   *
   * @example
   * ```typescript
   * legend.position({
   *   relativeTo: chart.borderBox.topRight,
   *   relativeFrom: legend.container.borderBox.topLeft,
   *   x: 20,
   *   y: 0,
   * });
   * ```
   */
  position(config: {
    relativeTo: { x: number; y: number };
    relativeFrom: { x: number; y: number };
    x: number;
    y: number;
  }): void {
    this.mainContainer.position(config);
  }
}

