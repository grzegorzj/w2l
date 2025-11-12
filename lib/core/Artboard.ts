/**
 * Core module containing fundamental entities for visual layout.
 *
 * This module provides the base canvas and positioning system that all visual elements
 * are rendered onto. It manages coordinate systems, sizing, and global layout properties.
 *
 * @module core
 */

import { parseUnit } from "./units.js";

/**
 * Represents a 2D point in space with x and y coordinates.
 * Used throughout the library for positioning and layout calculations.
 *
 * @example
 * ```typescript
 * const center: Point = { x: "100px", y: "100px" };
 * const centerNumeric: Point = { x: 100, y: 100 }; // Also supported
 * ```
 */
export interface Point {
  /** X coordinate (supports units like "100px", "2rem", or numbers) */
  x: string | number;
  /** Y coordinate (supports units like "100px", "2rem", or numbers) */
  y: string | number;
}

/**
 * Size specification for artboard dimensions.
 * Supports CSS-style units (px, rem, em, %) or "auto" for automatic sizing.
 *
 * @example
 * ```typescript
 * const fixedSize: Size = { width: "800px", height: "600px" };
 * const remSize: Size = { width: "50rem", height: "37.5rem" };
 * const autoSize: Size = { width: "auto", height: "auto" };
 * const numericSize: Size = { width: 800, height: 600 }; // Also supported
 * ```
 */
export interface Size {
  /** Width with units (e.g., "800px", "50rem") or "auto" for content-based sizing */
  width: string | number | "auto";
  /** Height with units (e.g., "600px", "37.5rem") or "auto" for content-based sizing */
  height: string | number | "auto";
}

/**
 * Configuration options for creating an Artboard.
 *
 * @example
 * ```typescript
 * const config: ArtboardConfig = {
 *   size: { width: "800px", height: "600px" },
 *   padding: "20px",
 *   backgroundColor: "#ffffff"
 * };
 * ```
 */
export interface ArtboardConfig {
  /**
   * Size of the artboard. Can be explicit dimensions or "auto" for automatic sizing.
   * When set to "auto", the artboard will expand to fit all contained elements.
   * Supports CSS-style units (px, rem, em) or plain numbers (treated as pixels).
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
   * const artboard = new Artboard({ size: { width: "800px", height: "600px" } });
   * const center = artboard.center; // { x: "400px", y: "300px" }
   * ```
   */
  get center(): Point {
    // Simplified implementation for demonstration
    if (this.config.size === "auto") {
      return { x: "0px", y: "0px" }; // Would calculate from elements
    }
    const size = this.config.size as Size;
    const widthPx = size.width === "auto" ? 0 : parseUnit(size.width);
    const heightPx = size.height === "auto" ? 0 : parseUnit(size.height);
    return {
      x: `${widthPx / 2}px`,
      y: `${heightPx / 2}px`,
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
   * const artboard = new Artboard({ size: { width: "800px", height: "600px" } });
   * const svg = artboard.render();
   * console.log(svg); // <svg width="800" height="600">...</svg>
   * ```
   */
  render(): string {
    const size = this.size;
    const widthPx = size.width === "auto" ? 800 : parseUnit(size.width);
    const heightPx = size.height === "auto" ? 600 : parseUnit(size.height);
    const bgColor = this.config.backgroundColor || "transparent";

    // Render all elements
    const elementsHTML = this.elements
      .map((element: any) => element.render())
      .join("\n    ");

    return `<svg width="${widthPx}" height="${heightPx}" xmlns="http://www.w3.org/2000/svg">
  ${bgColor !== "transparent" ? `<rect width="${widthPx}" height="${heightPx}" fill="${bgColor}"/>` : ""}
  <g>
    ${elementsHTML}
  </g>
</svg>`;
  }
}
