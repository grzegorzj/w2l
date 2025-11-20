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

  /**
   * Show visual guides for the artboard's padding and content areas.
   * Useful for debugging and understanding the box model.
   * @defaultValue false
   */
  showPaddingGuides?: boolean;
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
   * Takes the furthest bounds of all elements and applies padding on all sides.
   * @internal
   */
  private recalculateSize(): void {
    if (!this.artboardConfig.autoAdjust) return;
    
    const allElements = this.collectAllElements(this.elements);
    const padding = this.paddingBox;
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    // Find the bounding box of all elements
    allElements.forEach(element => {
      if (element && typeof element.getBoundingBox === 'function') {
        try {
          const bbox = element.getBoundingBox();
          // BoundingBox has topLeft, bottomRight, width, height
          const left = parseFloat(String(bbox.topLeft.x));
          const top = parseFloat(String(bbox.topLeft.y));
          const right = parseFloat(String(bbox.bottomRight.x));
          const bottom = parseFloat(String(bbox.bottomRight.y));
          
          if (isFinite(left) && isFinite(top) && isFinite(right) && isFinite(bottom)) {
            minX = Math.min(minX, left);
            minY = Math.min(minY, top);
            maxX = Math.max(maxX, right);
            maxY = Math.max(maxY, bottom);
    }
        } catch (e) {
          // Skip elements that aren't fully initialized
        }
      }
    });
    
    // If we found valid elements, calculate size with padding on all sides
    if (isFinite(minX) && isFinite(maxX)) {
      // Content width/height
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      
      // Add padding on all sides
      this.currentWidth = contentWidth + padding.left + padding.right;
      this.currentHeight = contentHeight + padding.top + padding.bottom;
    }
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
   * If padding is set, content is translated to respect the padding area.
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
    // Phase 1: Measure all elements
    this.measureAll();
    
    // Phase 2: Layout all containers
    this.layoutAll();
    
    // Final size recalculation at render time if autoAdjust is enabled
    this.recalculateSize();
    
    const widthPx = this.width;
    const heightPx = this.height;
    const bgColor = this.artboardConfig.backgroundColor || "transparent";
    const padding = this.paddingBox;

    // Recursively collect ALL elements (including those inside containers/layouts)
    const allElements = this.collectAllElements(this.elements);
    
    // Sort ALL elements by z-index (creation order + nesting depth)
    const sortedElements = this.sortElementsByZIndex(allElements);

    // Render all elements in z-index order
    const elementsHTML = sortedElements
      .map((element: any) => element.render())
      .join("\n    ");

    // Apply padding translation to content if padding is set
    const hasPadding = padding.left !== 0 || padding.top !== 0 || padding.right !== 0 || padding.bottom !== 0;
    const contentTransform = hasPadding ? ` transform="translate(${padding.left}, ${padding.top})"` : "";

    // Generate padding guide visuals if requested
    let paddingGuides = '';
    if (this.artboardConfig.showPaddingGuides && hasPadding) {
      paddingGuides = this.generatePaddingGuides(widthPx, heightPx, padding);
    }

    return `<svg width="${widthPx}" height="${heightPx}" xmlns="http://www.w3.org/2000/svg">
  ${bgColor !== "transparent" ? `<rect width="${widthPx}" height="${heightPx}" fill="${bgColor}"/>` : ""}
  ${paddingGuides}
  <g${contentTransform}>
    ${elementsHTML}
  </g>
</svg>`;
  }

  /**
   * Phase 1: Measure all elements (bottom-up).
   * Ensures all text, images, and other measurable elements know their size.
   * @internal
   */
  private measureAll(): void {
    const allElements = this.collectAllElements(this.elements);
    allElements.forEach(element => {
      if (typeof (element as any).measure === 'function') {
        (element as any).measure();
      }
    });
  }

  /**
   * Phase 2: Layout all containers (top-down).
   * Arranges children and calculates auto-sizes.
   * @internal
   */
  private layoutAll(): void {
    // Get all elements with depth information
    const allElements = this.collectAllElements(this.elements);
    
    // Sort by depth (deepest first) to layout children before parents
    const sorted = allElements.sort((a, b) => {
      const depthA = this.getNestingDepth(a);
      const depthB = this.getNestingDepth(b);
      return depthB - depthA;  // Deepest first
    });
    
    // Layout each container
    sorted.forEach(element => {
      if (typeof (element as any).layout === 'function') {
        (element as any).layout();
      }
    });
  }

  /**
   * Generates visual guides showing the padding and content areas.
   * @internal
   */
  private generatePaddingGuides(width: number, height: number, padding: import("./Bounded.js").ParsedSpacing): string {
    const contentX = padding.left;
    const contentY = padding.top;
    const contentWidth = width - padding.left - padding.right;
    const contentHeight = height - padding.top - padding.bottom;

    // Create a semi-transparent overlay for the padding areas
    const paddingAreas = [];
    
    // Top padding
    if (padding.top > 0) {
      paddingAreas.push(`<rect x="0" y="0" width="${width}" height="${padding.top}" fill="rgba(255, 200, 200, 0.2)" stroke="none"/>`);
    }
    
    // Bottom padding
    if (padding.bottom > 0) {
      paddingAreas.push(`<rect x="0" y="${height - padding.bottom}" width="${width}" height="${padding.bottom}" fill="rgba(255, 200, 200, 0.2)" stroke="none"/>`);
    }
    
    // Left padding
    if (padding.left > 0) {
      paddingAreas.push(`<rect x="0" y="${padding.top}" width="${padding.left}" height="${contentHeight}" fill="rgba(255, 200, 200, 0.2)" stroke="none"/>`);
    }
    
    // Right padding
    if (padding.right > 0) {
      paddingAreas.push(`<rect x="${width - padding.right}" y="${padding.top}" width="${padding.right}" height="${contentHeight}" fill="rgba(255, 200, 200, 0.2)" stroke="none"/>`);
    }

    // Content area border (dashed blue line)
    const contentBorder = `<rect x="${contentX}" y="${contentY}" width="${contentWidth}" height="${contentHeight}" fill="none" stroke="#2196F3" stroke-width="2" stroke-dasharray="8,4" opacity="0.7"/>`;

    // Border box outline (solid red line)
    const borderOutline = `<rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#F44336" stroke-width="2" opacity="0.7"/>`;

    // Labels
    const labels = [];
    
    // "Padding" label
    if (padding.top >= 20) {
      labels.push(`<text x="${width / 2}" y="${padding.top / 2 + 5}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#D32F2F" font-weight="bold">Padding</text>`);
    }
    
    // "Content Area" label
    if (contentHeight >= 30) {
      labels.push(`<text x="${contentX + contentWidth / 2}" y="${contentY + 20}" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#1976D2" font-weight="bold">Content Area</text>`);
    }

    return `
  <!-- Artboard Box Model Guides -->
  <g id="artboard-padding-guides">
    ${paddingAreas.join('\n    ')}
    ${borderOutline}
    ${contentBorder}
    ${labels.join('\n    ')}
  </g>`;
  }
}
