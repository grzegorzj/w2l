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
   * Initial size of the artboard.
   * Supports CSS-style units (px, rem, em) or plain numbers (treated as pixels).
   */
  size: RectangleSize;

  /**
   * Whether to automatically adjust artboard size to fit content.
   * When true, artboard recalculates its size after each element is added,
   * sizing to the furthest bounds of all elements plus padding.
   * @defaultValue false
   */
  autoAdjust?: boolean;

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
 * When `autoAdjust` is enabled, the artboard automatically resizes to fit all
 * contained elements as they are added.
 *
 * @example
 * Create a fixed-size artboard (clips content)
 * ```typescript
 * const artboard = new Artboard({
 *   size: { width: 800, height: 600 },
 *   padding: "20px"
 * });
 * ```
 *
 * @example
 * Create an auto-adjusting artboard
 * ```typescript
 * const artboard = new Artboard({
 *   size: { width: 800, height: 600 }, // Initial size
 *   autoAdjust: true,
 *   padding: "20px"
 * });
 * // Artboard will resize to fit all elements as they're added
 * ```
 */
export class Artboard extends Rectangle {
  private artboardConfig: ArtboardConfig;
  private elements: any[] = [];
  private currentWidth: number;
  private currentHeight: number;
  
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
    if (!config.size) {
      throw new Error("Artboard requires a 'size' property with { width, height }.");
    }
    
    super({
      width: config.size.width,
      height: config.size.height,
      name: "artboard",
      style: {
        fill: config.backgroundColor || "transparent"
      }
    });
    
    this.artboardConfig = config;
    this.currentWidth = parseUnit(config.size.width);
    this.currentHeight = parseUnit(config.size.height);
    
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
    return {
      width: `${this.currentWidth}px`,
      height: `${this.currentHeight}px`
    };
  }

  /**
   * Recalculates artboard size to fit all content if autoAdjust is enabled.
   * Takes the furthest bounds of all elements and applies padding.
   * @internal
   */
  private recalculateSize(): void {
    if (!this.artboardConfig.autoAdjust) return;
    
    const allElements = this.collectAllElements(this.elements);
    const padding = this.paddingBox;
    
    let maxX = 0;
    let maxY = 0;
    
    // Find the furthest extent of all elements
    allElements.forEach(element => {
      if (element && typeof element.getBoundingBox === 'function') {
        try {
          const bbox = element.getBoundingBox();
          // BoundingBox has topLeft, bottomRight, width, height
          const right = parseFloat(String(bbox.bottomRight.x));
          const bottom = parseFloat(String(bbox.bottomRight.y));
          
          if (isFinite(right) && isFinite(bottom)) {
            maxX = Math.max(maxX, right);
            maxY = Math.max(maxY, bottom);
          }
        } catch (e) {
          // Skip elements that aren't fully initialized
        }
      }
    });
    
    // Update current size to fit content plus padding
    this.currentWidth = maxX + padding.right;
    this.currentHeight = maxY + padding.bottom;
  }

  /**
   * Override width getter to return current calculated width.
   */
  get width(): number {
    return this.currentWidth;
  }

  /**
   * Override height getter to return current calculated height.
   */
  get height(): number {
    return this.currentHeight;
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
    // Final size recalculation at render time if autoAdjust is enabled
    this.recalculateSize();
    
    const widthPx = this.width;
    const heightPx = this.height;
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
