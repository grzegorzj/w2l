/**
 * New layout system - Box Model
 */

export interface BoxModel {
  /**
   * Margin (space outside the border)
   */
  margin?: number | { top: number; right: number; bottom: number; left: number };
  
  /**
   * Border width
   */
  border?: number | { top: number; right: number; bottom: number; left: number };
  
  /**
   * Padding (space inside the border)
   */
  padding?: number | { top: number; right: number; bottom: number; left: number };
}

export interface ParsedBoxModel {
  margin: { top: number; right: number; bottom: number; left: number };
  border: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
}

/**
 * Parse a box model value (number or object) into a full object with all sides.
 */
export function parseBoxValue(
  value: number | { top: number; right: number; bottom: number; left: number } | undefined
): { top: number; right: number; bottom: number; left: number } {
  if (value === undefined) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  if (typeof value === "number") {
    return { top: value, right: value, bottom: value, left: value };
  }
  
  return value;
}

/**
 * Parse a full box model configuration.
 */
export function parseBoxModel(boxModel?: BoxModel): ParsedBoxModel {
  return {
    margin: parseBoxValue(boxModel?.margin),
    border: parseBoxValue(boxModel?.border),
    padding: parseBoxValue(boxModel?.padding),
  };
}

/**
 * Box model reference type for positioning.
 */
export type BoxReference = "margin" | "border" | "padding" | "content";

