/**
 * Base Layout module for container elements with child management.
 *
 * This module provides the Layout base class that extends Rectangle to support
 * layout operations with child elements that move and transform with the parent.
 *
 * @module layout
 */

import { Rectangle, RectangleConfig } from "../elements/Rectangle.js";
import type { Element } from "../core/Element.js";
import type { Point } from "../core/Artboard.js";
import { parseUnit } from "../core/units.js";
import { ChildrenManager } from "./ChildrenManager.js";

/**
 * Configuration for creating a Layout.
 * Extends RectangleConfig to support all rectangle properties.
 */
export interface LayoutConfig extends RectangleConfig {
  /**
   * Optional padding for the layout's content area.
   * Children will be positioned within the padded area.
   */
  padding?: string | number | {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
  
  /**
   * Show visual debug guides for the layout's border box and content box.
   * Useful for debugging layout behavior and understanding positioning.
   * @defaultValue false
   */
  debug?: boolean;
}

/**
 * Base class for all layout elements.
 *
 * Layout extends Rectangle to provide a visible or invisible container that can
 * hold child elements. When the layout is moved, rotated, or transformed, all
 * layout-bound children transform with it.
 *
 * @remarks
 * Layouts support two positioning modes for children:
 * 1. Layout-bound: Children render relative to the layout and transform with it
 * 2. Absolute: If position() is called on a child, it breaks out and uses absolute positioning
 *
 * This provides a natural hierarchy where elements "live inside" layouts by default,
 * but can be explicitly positioned if needed.
 *
 * @example
 * Create a basic layout
 * ```typescript
 * const layout = new Layout({
 *   width: "400px",
 *   height: "300px",
 *   padding: "20px",
 *   style: { fill: "#f0f0f0" }
 * });
 *
 * // Add elements to the layout
 * const circle = new Circle({ radius: 30 });
 * layout.addElement(circle);
 *
 * // Move the layout - circle moves with it
 * layout.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: layout.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 */
export class Layout extends Rectangle {
  protected childrenManager: ChildrenManager;
  protected layoutConfig: LayoutConfig;

  /**
   * Creates a new Layout instance.
   *
   * @param config - Configuration for the layout
   */
  constructor(config: LayoutConfig) {
    super(config);
    
    this.layoutConfig = config;
    
    if (config.padding) {
      this.padding = config.padding;
    }

    // Initialize children manager
    this.childrenManager = new ChildrenManager(
      () => this.currentPosition,
      () => this.getTotalRotation()
    );
  }

  /**
   * Adds an element to the layout.
   *
   * The element will be layout-bound by default, meaning it will transform
   * with the layout. If position() is later called on the element, it will
   * break out of the layout and use absolute positioning.
   *
   * @param element - The element to add to this layout
   *
   * @example
   * ```typescript
   * const layout = new Layout({ width: 400, height: 300 });
   * const circle = new Circle({ radius: 30 });
   * layout.addElement(circle);
   * ```
   */
  addElement(element: Element): void {
    this.childrenManager.addChild(element, this);
  }

  /**
   * Removes an element from the layout.
   *
   * @param element - The element to remove
   */
  removeElement(element: Element): void {
    this.childrenManager.removeChild(element);
  }

  /**
   * Gets all child elements in this layout.
   *
   * @returns Array of child elements
   */
  getChildren(): Element[] {
    return this.childrenManager.getChildren();
  }

  /**
   * Gets all child elements (getter for Artboard z-index collection).
   *
   * @returns Array of child elements
   */
  get children(): Element[] {
    return this.childrenManager.getChildren();
  }

  /**
   * Gets all layout-bound child elements.
   *
   * @returns Array of elements that are still bound to the layout
   */
  getLayoutBoundChildren(): Element[] {
    return this.childrenManager.getLayoutBoundChildren();
  }

  /**
   * Marks a child element as absolute-positioned.
   * This happens automatically when position() is called on a child element.
   *
   * @param element - The element to mark as absolute
   * @internal
   */
  markChildAsAbsolute(element: Element): void {
    this.childrenManager.markChildAsAbsolute(element);
  }

  /**
   * Overrides position to update child positions.
   */
  position(config: any): void {
    super.position(config);
    this.childrenManager.updateChildPositions();
  }

  /**
   * Overrides translate to update child positions.
   */
  translate(config: any): void {
    super.translate(config);
    this.childrenManager.updateChildPositions();
  }

  /**
   * Overrides rotate to update child positions.
   */
  rotate(config: any): void {
    super.rotate(config);
    this.childrenManager.updateChildPositions();
  }

  /**
   * Gets the content area (interior space accounting for padding).
   *
   * @returns The top-left point of the content area
   */
  get contentArea(): Point {
    const padding = this.paddingBox;
    return this.toAbsolutePoint(padding.left, padding.top);
  }

  /**
   * Gets the size of the content area (accounting for padding).
   *
   * @returns The available width and height for content
   */
  get contentSize(): { width: number; height: number } {
    const padding = this.paddingBox;
    return {
      width: this.width - padding.left - padding.right,
      height: this.height - padding.top - padding.bottom,
    };
  }

  /**
   * Measure this layout and all its children.
   * Overrides Element.performMeasurement().
   * 
   * @internal
   */
  protected performMeasurement(): void {
    // Measure all children first (recursive)
    const children = this.getChildren();
    children.forEach(child => {
      if (typeof (child as any).measure === 'function') {
        (child as any).measure();
      }
    });
  }

  /**
   * Perform layout of children.
   * Override this in subclasses (VStack, HStack, etc.).
   * 
   * @internal
   */
  protected performLayout(): void {
    // Default: no special layout
    // VStack, HStack, GridLayout, etc. override this
  }

  /**
   * Renders the layout (background only).
   * 
   * Children are rendered separately by the Artboard's z-index system.
   * This ensures proper z-ordering between multiple layouts and their children.
   *
   * @returns SVG string representation of just the layout background
   */
  render(): string {
    // Render only the layout background (if it has visible style)
    // Children will be rendered separately by the Artboard with proper z-ordering
    let svg = super.render();
    
    // Add debug guides if enabled
    if (this.layoutConfig.debug) {
      svg += this.generateDebugGuides();
    }
    
    return svg;
  }
  
  /**
   * Generates visual debug guides showing the layout's border box and content box.
   * @internal
   */
  private generateDebugGuides(): string {
    const absPos = this.getAbsolutePosition();
    const padding = this.paddingBox;
    
    // Get border box dimensions
    const borderBox = this.getBorderBox();
    const borderWidth = parseFloat(String(borderBox.width));
    const borderHeight = parseFloat(String(borderBox.height));
    
    // Get content box dimensions
    const contentBox = this.getContentBox();
    const contentWidth = parseFloat(String(contentBox.width));
    const contentHeight = parseFloat(String(contentBox.height));
    
    console.log(
      `[${this.constructor.name}] Debug guides at absPos (${absPos.x}, ${absPos.y}), ` +
      `borderBox: ${borderWidth}×${borderHeight}, contentBox: ${contentWidth}×${contentHeight}`
    );
    
    const guides = [];
    
    // Border box outline (solid red line)
    guides.push(
      `<rect x="${absPos.x}" y="${absPos.y}" width="${borderWidth}" height="${borderHeight}" ` +
      `fill="none" stroke="#F44336" stroke-width="1.5" opacity="0.5"/>`
    );
    
    // Content box outline (dashed blue line)
    const contentX = absPos.x + padding.left;
    const contentY = absPos.y + padding.top;
    guides.push(
      `<rect x="${contentX}" y="${contentY}" width="${contentWidth}" height="${contentHeight}" ` +
      `fill="none" stroke="#2196F3" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.6"/>`
    );
    
    // Add a small label if there's enough space
    if (borderWidth > 60 && borderHeight > 20) {
      const labelX = absPos.x + 5;
      const labelY = absPos.y + 12;
      guides.push(
        `<text x="${labelX}" y="${labelY}" font-family="monospace" font-size="10" ` +
        `fill="#F44336" opacity="0.7">${this.constructor.name}</text>`
      );
    }
    
    return guides.join('\n');
  }
}

