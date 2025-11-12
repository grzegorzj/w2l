/**
 * Stylable module for CSS-like styling capabilities.
 *
 * This module provides interfaces and types for elements that can have
 * CSS-like visual styling properties such as fill, stroke, opacity, etc.
 *
 * @module core
 */

/**
 * CSS-like style properties for visual elements.
 *
 * This interface defines common visual styling properties that can be
 * applied to shapes and other renderable elements.
 */
export interface Style {
  /**
   * Fill color (CSS color value).
   * @example "#3498db", "rgb(52, 152, 219)", "blue"
   */
  fill?: string;

  /**
   * Stroke (outline) color (CSS color value).
   * @example "#e74c3c", "rgb(231, 76, 60)", "red"
   */
  stroke?: string;

  /**
   * Stroke width (supports units).
   * @example "2px", 2, "0.5rem"
   */
  strokeWidth?: string | number;

  /**
   * Opacity (0 to 1).
   * @example 0.5, 1, 0
   */
  opacity?: number;

  /**
   * Fill opacity (0 to 1).
   * @example 0.8, 1, 0
   */
  fillOpacity?: number;

  /**
   * Stroke opacity (0 to 1).
   * @example 0.8, 1, 0
   */
  strokeOpacity?: number;

  /**
   * Stroke dash array for dashed lines.
   * @example "5,5", "10,5,2,5"
   */
  strokeDasharray?: string;

  /**
   * Stroke line cap style.
   */
  strokeLinecap?: "butt" | "round" | "square";

  /**
   * Stroke line join style.
   */
  strokeLinejoin?: "miter" | "round" | "bevel";
}

/**
 * Interface for elements that can be styled.
 *
 * Implementing this interface indicates that an element supports
 * CSS-like visual styling properties.
 *
 * @example
 * ```typescript
 * class StyledShape extends Shape implements Stylable {
 *   private _style: Style = {};
 *
 *   get style(): Style {
 *     return this._style;
 *   }
 *
 *   set style(value: Style) {
 *     this._style = value;
 *   }
 *
 *   applyStyle(additionalStyle: Partial<Style>): void {
 *     this._style = { ...this._style, ...additionalStyle };
 *   }
 * }
 * ```
 */
export interface Stylable {
  /**
   * Gets the current style of the element.
   */
  style: Style;

  /**
   * Applies additional style properties to the element.
   *
   * This method merges the provided styles with existing styles,
   * allowing for incremental style updates.
   *
   * @param style - Partial style properties to apply
   */
  applyStyle(style: Partial<Style>): void;
}

/**
 * Helper function to convert a Style object to SVG attributes string.
 *
 * @param style - The style object to convert
 * @returns SVG attribute string
 *
 * @example
 * ```typescript
 * const style = {
 *   fill: "#3498db",
 *   stroke: "#2c3e50",
 *   strokeWidth: 2,
 *   opacity: 0.8
 * };
 * const attrs = styleToSVGAttributes(style);
 * // Returns: 'fill="#3498db" stroke="#2c3e50" stroke-width="2" opacity="0.8"'
 * ```
 */
export function styleToSVGAttributes(style: Style): string {
  const attrs: string[] = [];

  if (style.fill !== undefined) {
    attrs.push(`fill="${style.fill}"`);
  }
  if (style.stroke !== undefined) {
    attrs.push(`stroke="${style.stroke}"`);
  }
  if (style.strokeWidth !== undefined) {
    attrs.push(`stroke-width="${style.strokeWidth}"`);
  }
  if (style.opacity !== undefined) {
    attrs.push(`opacity="${style.opacity}"`);
  }
  if (style.fillOpacity !== undefined) {
    attrs.push(`fill-opacity="${style.fillOpacity}"`);
  }
  if (style.strokeOpacity !== undefined) {
    attrs.push(`stroke-opacity="${style.strokeOpacity}"`);
  }
  if (style.strokeDasharray !== undefined) {
    attrs.push(`stroke-dasharray="${style.strokeDasharray}"`);
  }
  if (style.strokeLinecap !== undefined) {
    attrs.push(`stroke-linecap="${style.strokeLinecap}"`);
  }
  if (style.strokeLinejoin !== undefined) {
    attrs.push(`stroke-linejoin="${style.strokeLinejoin}"`);
  }

  return attrs.join(" ");
}

