/**
 * Unit handling utilities for the W2L library.
 * 
 * This module provides functions to parse and convert various CSS-style
 * unit strings to pixel values for internal calculations.
 * 
 * @module core
 */

/**
 * Parses a unit string (e.g., "100px", "2rem", "50%") and converts it to pixels.
 * 
 * @param value - The unit string to parse
 * @param baseValue - Base value for relative units (%, rem, em)
 * @returns The value in pixels
 * 
 * @example
 * ```typescript
 * parseUnit("100px") // 100
 * parseUnit("2rem", 16) // 32
 * parseUnit("50%", 800) // 400
 * ```
 */
export function parseUnit(value: string | number, baseValue: number = 16): number {
  // Handle undefined or null
  if (value === undefined || value === null) {
    return 0;
  }

  // If it's already a number, return it
  if (typeof value === 'number') {
    return value;
  }

  // Remove whitespace
  const trimmed = value.trim();

  // Handle "auto"
  if (trimmed === 'auto') {
    return 0; // Will be handled separately
  }

  // Parse the numeric part and unit
  const match = trimmed.match(/^(-?[\d.]+)([a-z%]*)$/i);
  if (!match) {
    throw new Error(`Invalid unit value: ${value}`);
  }

  const [, numStr, unit] = match;
  const num = parseFloat(numStr);

  // Convert based on unit type
  switch (unit) {
    case '':
    case 'px':
      return num;
    
    case 'rem':
      return num * baseValue;
    
    case 'em':
      return num * baseValue;
    
    case '%':
      return (num / 100) * baseValue;
    
    case 'pt':
      return num * (4 / 3); // 1pt = 4/3 px
    
    case 'cm':
      return num * 37.8; // 1cm ≈ 37.8px
    
    case 'mm':
      return num * 3.78; // 1mm ≈ 3.78px
    
    case 'in':
      return num * 96; // 1in = 96px
    
    default:
      console.warn(`Unknown unit "${unit}", treating as pixels`);
      return num;
  }
}

/**
 * Validates that a value is a valid unit string.
 * 
 * @param value - The value to validate
 * @returns True if valid, false otherwise
 */
export function isValidUnit(value: string | number): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'number') {
    return !isNaN(value);
  }

  if (value === 'auto') {
    return true;
  }

  const match = value.trim().match(/^(-?[\d.]+)([a-z%]*)$/i);
  return match !== null;
}

/**
 * Formats a pixel value as a string with units.
 * 
 * @param pixels - The pixel value
 * @param unit - The desired unit (default: "px")
 * @returns Formatted string with units
 */
export function formatUnit(pixels: number, unit: string = 'px'): string {
  return `${pixels}${unit}`;
}

