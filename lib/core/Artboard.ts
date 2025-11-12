/**
 * Core module containing fundamental entities for visual layout.
 *
 * This module provides the base canvas and positioning system that all visual elements
 * are rendered onto. It manages coordinate systems, sizing, and global layout properties.
 *
 * @module core
 */

/**
 * Represents a 2D point in space with x and y coordinates.
 * Used throughout the library for positioning and layout calculations.
 *
 * @example
 * ```typescript
 * const center: Point = { x: 100, y: 100 };
 * ```
 */
export interface Point {
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

/**
 * Size specification for artboard dimensions.
 * Can be specified in pixels (number) or as "auto" for automatic sizing.
 *
 * @example
 * ```typescript
 * const fixedSize: Size = { width: 800, height: 600 };
 * const autoSize: Size = { width: "auto", height: "auto" };
 * ```
 */
export interface Size {
  /** Width in pixels or "auto" for content-based sizing */
  width: number | "auto";
  /** Height in pixels or "auto" for content-based sizing */
  height: number | "auto";
}

/**
 * Configuration options for creating an Artboard.
 *
 * @example
 * ```typescript
 * const config: ArtboardConfig = {
 *   size: { width: 800, height: 600 },
 *   padding: "20px",
 *   backgroundColor: "#ffffff"
 * };
 * ```
 */
export interface ArtboardConfig {
  /**
   * Size of the artboard. Can be explicit dimensions or "auto" for automatic sizing.
   * When set to "auto", the artboard will expand to fit all contained elements.
   */
  size: Size | "auto";

  /**
   * Padding around the artboard content.
   * Accepts CSS-style values: "20px", "10px 20px", etc.
   * @defaultValue "0px"
   */
  padding?: string;

  /**
   * Background color of the artboard.
   * @defaultValue "transparent"
   */
  backgroundColor?: string;
}

/**
 * The Artboard represents the main canvas where all visual elements are placed.
 *
 * This is the fundamental building block of the library. Every visual composition
 * starts with an Artboard, which provides the coordinate system and bounds for all
 * shapes, text, and other elements to be positioned within.
 *
 * @remarks
 * The Artboard uses a standard Cartesian coordinate system with the origin (0,0)
 * at the top-left corner. Positive X extends to the right, positive Y extends downward.
 *
 * When size is set to "auto", the artboard will automatically calculate its dimensions
 * based on the positioned elements plus the specified padding.
 *
 * @example
 * Create a fixed-size artboard
 * ```typescript
 * const artboard = new Artboard({
 *   size: { width: 800, height: 600 },
 *   padding: "20px"
 * });
 * ```
 *
 * @example
 * Create an auto-sizing artboard
 * ```typescript
 * const artboard = new Artboard({
 *   size: "auto",
 *   padding: "20px"
 * });
 * // Artboard will expand to fit all elements added to it
 * ```
 */
export class Artboard {
  private config: ArtboardConfig;
  private elements: any[] = [];

  /**
   * Creates a new Artboard instance.
   *
   * @param config - Configuration options for the artboard
   *
   * @example
   * ```typescript
   * const artboard = new Artboard({
   *   size: { width: 1200, height: 800 },
   *   padding: "40px",
   *   backgroundColor: "#f5f5f5"
   * });
   * ```
   */
  constructor(config: ArtboardConfig) {
    this.config = config;
  }

  /**
   * Gets the center point of the artboard.
   *
   * For fixed-size artboards, returns the geometric center.
   * For auto-sized artboards, calculates the center based on current content bounds.
   *
   * @returns The center point of the artboard
   *
   * @example
   * ```typescript
   * const artboard = new Artboard({ size: { width: 800, height: 600 } });
   * const center = artboard.center; // { x: 400, y: 300 }
   * ```
   */
  get center(): Point {
    // Simplified implementation for demonstration
    if (this.config.size === "auto") {
      return { x: 0, y: 0 }; // Would calculate from elements
    }
    const size = this.config.size as Size;
    return {
      x: typeof size.width === "number" ? size.width / 2 : 0,
      y: typeof size.height === "number" ? size.height / 2 : 0,
    };
  }

  /**
   * Gets the current size of the artboard.
   *
   * @returns The dimensions of the artboard
   */
  get size(): Size {
    if (this.config.size === "auto") {
      return { width: "auto", height: "auto" };
    }
    return this.config.size;
  }

  /**
   * Adds an element to the artboard.
   *
   * @param element - The element to add
   * @internal
   */
  addElement(element: any): void {
    this.elements.push(element);
  }

  /**
   * Renders the artboard and all its elements to SVG.
   *
   * @returns SVG string representation of the artboard
   *
   * @example
   * ```typescript
   * const artboard = new Artboard({ size: { width: 800, height: 600 } });
   * const svg = artboard.render();
   * console.log(svg); // <svg width="800" height="600">...</svg>
   * ```
   */
  render(): string {
    // Simplified implementation
    return `<svg width="${this.size.width}" height="${this.size.height}"></svg>`;
  }
}
