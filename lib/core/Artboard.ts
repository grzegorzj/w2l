/**
 * Core module containing fundamental entities for visual layout.
 *
 * This module provides the base canvas and positioning system that all visual elements
 * are rendered onto. It manages coordinate systems, sizing, and global layout properties.
 *
 * @module core
 */

import { parseUnit } from "./units.js";
import { Rectangle, type RectangleSize } from "../elements/Rectangle.js";

/**
 * Binding information for reactive positioning.
 * Allows points to maintain references to their source elements.
 */
export interface PointBinding {
  /** The source element this point is bound to */
  element: any;
  /** The property name on the source element (e.g., 'center', 'topLeft') */
  property: string;
}

/**
 * Represents a 2D point in space with x and y coordinates.
 * Used throughout the library for positioning and layout calculations.
 *
 * @remarks
 * Points can optionally include binding metadata for reactive positioning.
 * When a point includes a binding, it maintains a relationship with the source
 * element, allowing it to update automatically when the source moves.
 *
 * @example
 * ```typescript
 * const center: Point = { x: "100px", y: "100px" };
 * const centerNumeric: Point = { x: 100, y: 100 }; // Also supported
 * 
 * // Point with binding (created internally by position getters)
 * const boundPoint: Point = {
 *   x: 100,
 *   y: 100,
 *   _binding: { element: someElement, property: 'center' }
 * };
 * ```
 */
export interface Point {
  /** X coordinate (supports units like "100px", "2rem", or numbers) */
  x: string | number;
  /** Y coordinate (supports units like "100px", "2rem", or numbers) */
  y: string | number;
  /** Optional binding information for reactive positioning */
  _binding?: PointBinding;
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
  size: RectangleSize | "auto";

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
 * The Artboard extends Rectangle to inherit positioning and sizing capabilities.
 * It is always positioned at (0,0) and provides the root coordinate system.
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
export class Artboard extends Rectangle {
  private artboardConfig: ArtboardConfig;
  private elements: any[] = [];
  
  /**
   * Hidden DOM container for accurate text measurements.
   * Created lazily when first text element needs measurement.
   * @internal
   */
  private _measurementContainer?: SVGElement;

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
    // Convert Artboard config to Rectangle config
    const size = config.size === "auto" ? { width: 0, height: 0 } : config.size;
    
    super({
      width: size.width,
      height: size.height,
      name: "artboard",
      style: {
        fill: config.backgroundColor || "transparent"
      }
    });
    
    this.artboardConfig = config;
    
    // Set padding if provided
    if (config.padding) {
      this.padding = config.padding;
    }
  }

  /**
   * Gets the current size of the artboard.
   *
   * @returns The dimensions of the artboard
   */
  get size(): RectangleSize {
    if (this.artboardConfig.size === "auto") {
      return { width: "auto", height: "auto" };
    }
    return this.artboardConfig.size;
  }
  
  // Position getters (center, topLeft, etc.) are inherited from Rectangle

  /**
   * Gets or creates the measurement DOM container.
   * This is a hidden SVG element used for accurate text measurements.
   * 
   * @returns The measurement container SVG element
   * @internal
   */
  getMeasurementContainer(): SVGElement {
    if (this._measurementContainer) {
      return this._measurementContainer;
    }
    
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      throw new Error('Measurement container requires browser environment');
    }
    
    // Create hidden SVG for measurements
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.visibility = "hidden";
    svg.style.pointerEvents = "none";
    document.body.appendChild(svg);
    
    this._measurementContainer = svg;
    return svg;
  }

  /**
   * Adds an element to the artboard.
   *
   * @param element - The element to add
   * @internal
   */
  addElement(element: any): void {
    this.elements.push(element);
    
    // If element supports measurement (like Text), provide measurement container
    if (element.setMeasurementContainer) {
      element.setMeasurementContainer(() => this.getMeasurementContainer());
    }
  }

  /**
   * Gets the nesting depth of an element (how many parents it has).
   * @internal
   */
  private getNestingDepth(element: any): number {
    let depth = 0;
    let current = element;
    while (current.parent) {
      depth++;
      current = current.parent;
    }
    return depth;
  }

  /**
   * Recursively collects all elements including those inside containers and layouts.
   * For containers (invisible elements), we collect their children but not the container itself.
   * @internal
   */
  private collectAllElements(elements: any[]): any[] {
    const allElements: any[] = [];
    
    for (const element of elements) {
      // Check if this is a Container (invisible element with children)
      const isContainer = element.children && Array.isArray(element.children) && 
                          element.constructor.name === 'Container';
      
      if (isContainer) {
        // For invisible containers, skip the container itself and only collect children
        const childElements = this.collectAllElements(element.children);
        allElements.push(...childElements);
      } else if (element.children && Array.isArray(element.children)) {
        // For visible elements with children (like Layout), add the element AND collect children
        allElements.push(element);
        const childElements = this.collectAllElements(element.children);
        allElements.push(...childElements);
      } else {
        // Leaf element (no children)
        allElements.push(element);
      }
    }
    
    return allElements;
  }

  /**
   * Sorts elements by z-index (explicit z-index > nesting depth > creation order).
   * 
   * Sorting priority:
   * 1. Explicit z-index (if set) - higher values on top
   * 2. Nesting depth - deeper nested elements on top
   * 3. Creation order - later created elements on top
   * 
   * @internal
   */
  private sortElementsByZIndex(elements: any[]): any[] {
    return [...elements].sort((a, b) => {
      // First priority: explicit z-index (if set on either element)
      const zIndexA = a.zIndex;
      const zIndexB = b.zIndex;
      
      // If both have explicit z-index, compare them
      if (zIndexA !== undefined && zIndexB !== undefined) {
        return zIndexA - zIndexB;
      }
      
      // If only one has z-index, it takes priority based on its value
      // Elements without z-index are treated as z-index: 0
      if (zIndexA !== undefined) {
        return zIndexA - 0;
      }
      if (zIndexB !== undefined) {
        return 0 - zIndexB;
      }
      
      // Second priority: nesting depth (more nested = higher z-index)
      const depthA = this.getNestingDepth(a);
      const depthB = this.getNestingDepth(b);
      if (depthA !== depthB) {
        return depthA - depthB;
      }
      
      // Third priority: creation order (later = higher z-index)
      const indexA = a.creationIndex !== undefined ? a.creationIndex : 0;
      const indexB = b.creationIndex !== undefined ? b.creationIndex : 0;
      return indexA - indexB;
    });
  }

  /**
   * Renders the artboard and all its elements to SVG.
   *
   * Elements are sorted by z-index before rendering:
   * - Creation order: Later created elements appear on top
   * - Nesting: Deeper nested elements appear on top of their parents
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
    const bgColor = this.artboardConfig.backgroundColor || "transparent";

    // Recursively collect ALL elements (including those inside containers/layouts)
    const allElements = this.collectAllElements(this.elements);
    
    // Sort ALL elements by z-index (creation order + nesting depth)
    const sortedElements = this.sortElementsByZIndex(allElements);

    // Render all elements in z-index order
    const elementsHTML = sortedElements
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
