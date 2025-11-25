/**
 * Stylable module for CSS-like styling capabilities.
 *
 * This module provides interfaces and types for elements that can have
 * CSS-like visual styling properties such as fill, stroke, opacity, etc.
 *
 * Uses the csstype library for comprehensive SVG presentation attribute types.
 *
 * @module core
 */

import type * as CSS from "csstype";

/**
 * SVG style properties for visual elements.
 *
 * This type uses the csstype library's SVG properties, providing comprehensive
 * type safety for all SVG presentation attributes. It includes properties like
 * fill, stroke, opacity, and many more.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation
 *
 * @example
 * ```typescript
 * const style: Style = {
 *   fill: "#3498db",
 *   stroke: "#2c3e50",
 *   strokeWidth: 2,
 *   opacity: 0.8,
 *   strokeDasharray: "5,5"
 * };
 * ```
 */
export type Style = CSS.Properties & CSS.SvgProperties;

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
 * Converts camelCase property names to kebab-case SVG attribute names
 * and formats them as an attribute string suitable for SVG elements.
 *
 * @param style - The style object to convert
 * @returns SVG attribute string
 *
 * @example
 * ```typescript
 * const style: Style = {
 *   fill: "#3498db",
 *   stroke: "#2c3e50",
 *   strokeWidth: 2,
 *   opacity: 0.8,
 *   strokeDasharray: "5,5"
 * };
 * const attrs = styleToSVGAttributes(style);
 * // Returns: 'fill="#3498db" stroke="#2c3e50" stroke-width="2" opacity="0.8" stroke-dasharray="5,5"'
 * ```
 */
export function styleToSVGAttributes(style: Partial<Style>): string {
  if (!style || Object.keys(style).length === 0) {
    return "";
  }

  const attrs: string[] = [];

  // Helper to convert camelCase to kebab-case
  const toKebabCase = (str: string): string => {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  };

  // Iterate through all style properties
  for (const [key, value] of Object.entries(style)) {
    if (value !== undefined && value !== null) {
      const attrName = toKebabCase(key);
      attrs.push(`${attrName}="${value}"`);
    }
  }

  return attrs.join(" ");
}
