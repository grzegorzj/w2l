/**
 * PeriodicElement - A component for displaying chemical elements.
 * 
 * Features:
 * - Displays element symbol, atomic number, name, and atomic mass
 * - Themeable styling
 * - Selectable/highlightable
 * - Categorized by element type
 */

import { Container } from "../layout/Container.js";
import { Text } from "../elements/Text.js";
import { type Style } from "../core/Stylable.js";
import { defaultTheme } from "../core/Theme.js";
import { type Position } from "../core/Element.js";

/**
 * Chemical element categories with associated colors
 */
export enum ElementCategory {
  ALKALI_METAL = "alkali-metal",
  ALKALINE_EARTH = "alkaline-earth",
  TRANSITION_METAL = "transition-metal",
  POST_TRANSITION = "post-transition",
  METALLOID = "metalloid",
  NONMETAL = "nonmetal",
  HALOGEN = "halogen",
  NOBLE_GAS = "noble-gas",
  LANTHANIDE = "lanthanide",
  ACTINIDE = "actinide",
  UNKNOWN = "unknown",
}

/**
 * Element data structure
 */
export interface ElementData {
  /** Atomic number */
  number: number;
  /** Element symbol (e.g., "H", "He") */
  symbol: string;
  /** Full element name */
  name: string;
  /** Atomic mass */
  mass: number;
  /** Element category */
  category: ElementCategory;
  /** Group number (1-18) */
  group?: number;
  /** Period number (1-7) */
  period?: number;
}

export interface PeriodicElementConfig {
  /** Element data */
  element: ElementData;
  /** Width of the element cell */
  width?: number;
  /** Height of the element cell */
  height?: number;
  /** Whether the element is selected */
  selected?: boolean;
  /** Whether the element is highlighted */
  highlighted?: boolean;
  /** Custom style overrides */
  style?: Partial<Style>;
  /** Whether to show the atomic mass */
  showMass?: boolean;
}

/**
 * Get category color from theme
 */
function getCategoryColor(category: ElementCategory): string {
  const colors: Record<ElementCategory, string> = {
    [ElementCategory.ALKALI_METAL]: "#ff6b6b",
    [ElementCategory.ALKALINE_EARTH]: "#ffd93d",
    [ElementCategory.TRANSITION_METAL]: "#ffa8b9",
    [ElementCategory.POST_TRANSITION]: "#c8c8c8",
    [ElementCategory.METALLOID]: "#95e1d3",
    [ElementCategory.NONMETAL]: "#a8e6cf",
    [ElementCategory.HALOGEN]: "#ffd3b6",
    [ElementCategory.NOBLE_GAS]: "#dcd6f7",
    [ElementCategory.LANTHANIDE]: "#ffaaa5",
    [ElementCategory.ACTINIDE]: "#ff8b94",
    [ElementCategory.UNKNOWN]: "#e0e0e0",
  };
  return colors[category];
}

/**
 * PeriodicElement component for displaying individual chemical elements
 */
export class PeriodicElement {
  private container: Container;
  private config: Required<PeriodicElementConfig>;

  constructor(config: PeriodicElementConfig) {
    this.config = {
      width: config.width ?? 60,
      height: config.height ?? 70,
      selected: config.selected ?? false,
      highlighted: config.highlighted ?? false,
      style: config.style ?? {},
      showMass: config.showMass ?? true,
      element: config.element,
    };

    this.container = this.buildElement();
  }

  private buildElement(): Container {
    const { element, width, height, selected, highlighted, style, showMass } = this.config;

    // Determine background color
    const categoryColor = getCategoryColor(element.category);
    const backgroundColor = selected
      ? defaultTheme.colors.primary
      : highlighted
      ? categoryColor
      : "#ffffff";

    const textColor = selected || (highlighted && this.isDark(categoryColor))
      ? "#ffffff"
      : defaultTheme.colors.foreground;

    const borderColor = selected
      ? defaultTheme.colors.primary
      : highlighted
      ? this.darkenColor(categoryColor, 0.2)
      : defaultTheme.colors.neutral[400];

    // Create main container
    const container = new Container({
      width,
      height,
      direction: "vertical",
      horizontalAlignment: "center",
      verticalAlignment: "center",
      spacing: 2,
      boxModel: {
        padding: 4,
      },
      style: {
        fill: backgroundColor,
        stroke: borderColor,
        strokeWidth: selected ? "2" : "1",
        ...style,
      },
    });

    // Set border radius using the internal property
    (container as any)._borderRadius = defaultTheme.borders.radius.sm;

    // Atomic number (top-left)
    const numberText = new Text({
      content: String(element.number),
      fontSize: 8,
      style: {
        fill: textColor,
        fontFamily: defaultTheme.typography.fontSans,
        fontWeight: "400",
      },
    });
    container.addElement(numberText);

    // Element symbol (large, centered)
    const symbolText = new Text({
      content: element.symbol,
      fontSize: 20,
      style: {
        fill: textColor,
        fontFamily: defaultTheme.typography.fontSans,
        fontWeight: "bold",
      },
    });
    container.addElement(symbolText);

    // Element name (small, bottom)
    const nameText = new Text({
      content: element.name,
      fontSize: 7,
      style: {
        fill: textColor,
        fontFamily: defaultTheme.typography.fontSans,
        fontWeight: "400",
      },
    });
    container.addElement(nameText);

    // Atomic mass (optional)
    if (showMass) {
      const massText = new Text({
        content: element.mass.toFixed(3),
        fontSize: 6,
        style: {
          fill: textColor,
          fontFamily: defaultTheme.typography.fontSans,
          fontWeight: "300",
        },
      });
      container.addElement(massText);
    }

    return container;
  }

  /**
   * Check if a color is dark (for contrast calculation)
   */
  private isDark(color: string): boolean {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  }

  /**
   * Darken a color by a percentage
   */
  private darkenColor(color: string, amount: number): string {
    const hex = color.replace("#", "");
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
    return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
  }

  // Position accessors
  get topLeft(): Position { return this.container.topLeft; }
  get topRight(): Position { return this.container.topRight; }
  get bottomLeft(): Position { return this.container.bottomLeft; }
  get bottomRight(): Position { return this.container.bottomRight; }
  get center(): Position { return this.container.center; }
  get topCenter(): Position { return this.container.topCenter; }
  get bottomCenter(): Position { return this.container.bottomCenter; }
  get centerLeft(): Position { return this.container.centerLeft; }
  get centerRight(): Position { return this.container.centerRight; }

  get width(): number { return this.container.width; }
  get height(): number { return this.container.height; }
  get element(): Container { return this.container; }
}

