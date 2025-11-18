/**
 * Container module for invisible layout elements.
 *
 * This module provides the Container class, which is an invisible bounded
 * element that can hold and organize other elements with padding support.
 *
 * @module layout
 */

import { Bounded } from "../core/Bounded.js";
import type { Point } from "../core/Artboard.js";
import type { RectangleSize } from "../geometry/Rectangle.js";
import { parseUnit } from "../core/units.js";
import { ChildrenManager } from "./ChildrenManager.js";

/**
 * Configuration for creating a Container.
 */
export interface ContainerConfig {
  /**
   * Size of the container (supports RectangleSize).
   */
  size: RectangleSize;

  /**
   * Padding inside the container.
   * Children will be positioned within the padded area.
   * @defaultValue 0
   */
  padding?: string | number;

  /**
   * Optional name for debugging and SVG comments.
   */
  name?: string;
}

/**
 * Container is an invisible bounded element that can hold other elements.
 *
 * Containers provide a way to group and organize elements with defined
 * boundaries and padding. Unlike shapes, containers do not render anything
 * visible - they exist purely for layout and organization purposes.
 *
 * @remarks
 * Containers are useful for:
 * - Creating layout structures (columns, grids, etc.)
 * - Grouping related elements together
 * - Providing padding around content
 * - Managing spatial relationships between elements
 *
 * @example
 * Create a container with padding
 * ```typescript
 * const container = new Container({
 *   size: { width: "200px", height: "320px" },
 *   padding: "20px"
 * });
 *
 * // Center the container on the artboard
 * container.position({
 *   relativeTo: artboard.center,
 *   relativeFrom: container.center,
 *   x: 0,
 *   y: 0
 * });
 *
 * // Add elements to the container
 * container.addElement(myShape);
 * ```
 */
export class Container extends Bounded {
  private config: ContainerConfig;
  private _width: number;
  private _height: number;
  private childrenManager: ChildrenManager;

  /**
   * Creates a new Container instance.
   *
   * @param config - Configuration for the container
   */
  constructor(config: ContainerConfig) {
    super(config.name);
    this.config = config;
    this._width = parseUnit(config.size.width);
    this._height = parseUnit(config.size.height);

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
   * Gets the width of the container in pixels.
   *
   * @returns The width value
   */
  get width(): number {
    return this._width;
  }

  /**
   * Gets the height of the container in pixels.
   *
   * @returns The height value
   */
  get height(): number {
    return this._height;
  }

  /**
   * Gets the geometric center of the container.
   *
   * @returns The center point of the container
   */
  get center(): Point {
    return this.toAbsolutePoint(this._width / 2, this._height / 2);
  }

  /**
   * Gets the top-left corner of the container.
   *
   * @returns The top-left point
   */
  get topLeft(): Point {
    return this.toAbsolutePoint(0, 0);
  }

  /**
   * Gets the center of the top edge.
   *
   * @returns The top-center point
   */
  get topCenter(): Point {
    return this.toAbsolutePoint(this._width / 2, 0);
  }

  /**
   * Gets the top-right corner of the container.
   *
   * @returns The top-right point
   */
  get topRight(): Point {
    return this.toAbsolutePoint(this._width, 0);
  }

  /**
   * Gets the center of the left edge.
   *
   * @returns The left-center point
   */
  get leftCenter(): Point {
    return this.toAbsolutePoint(0, this._height / 2);
  }

  /**
   * Gets the center of the right edge.
   *
   * @returns The right-center point
   */
  get rightCenter(): Point {
    return this.toAbsolutePoint(this._width, this._height / 2);
  }

  /**
   * Gets the bottom-left corner of the container.
   *
   * @returns The bottom-left point
   */
  get bottomLeft(): Point {
    return this.toAbsolutePoint(0, this._height);
  }

  /**
   * Gets the center of the bottom edge.
   *
   * @returns The bottom-center point
   */
  get bottomCenter(): Point {
    return this.toAbsolutePoint(this._width / 2, this._height);
  }

  /**
   * Gets the bottom-right corner of the container.
   *
   * @returns The bottom-right point
   */
  get bottomRight(): Point {
    return this.toAbsolutePoint(this._width, this._height);
  }

  /**
   * Gets the content area (interior space accounting for padding).
   *
   * @returns The top-left point of the content area
   *
   * @remarks
   * This is where child elements should be positioned when added to the container.
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
      width: this._width - padding.left - padding.right,
      height: this._height - padding.top - padding.bottom,
    };
  }

  /**
   * Adds an element to the container.
   *
   * @param element - The element to add
   *
   * @example
   * ```typescript
   * const container = new Container({
   *   size: { width: 200, height: 300 },
   *   padding: 20
   * });
   *
   * const circle = new Circle({ radius: 30 });
   * container.addElement(circle);
   * ```
   */
  addElement(element: any): void {
    this.childrenManager.addChild(element, this);
  }

  /**
   * Removes an element from the container.
   *
   * @param element - The element to remove
   */
  removeElement(element: any): void {
    this.childrenManager.removeChild(element);
  }

  /**
   * Marks a child element as absolute-positioned.
   * This is called when position() is explicitly called on a child element.
   * @param element - The element to mark as absolute
   * @internal
   */
  markChildAsAbsolute(element: any): void {
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
   * Gets all elements in the container.
   *
   * @returns Array of elements
   */
  get children(): any[] {
    return this.childrenManager.getChildren();
  }

  /**
   * Renders the container (returns empty string as containers are invisible).
   *
   * @returns Empty string (containers are invisible)
   *
   * @remarks
   * Containers are invisible layout elements. Their children are rendered
   * separately by the Artboard's z-index system.
   */
  render(): string {
    // Containers are invisible - return empty string
    // Children will be rendered separately by the Artboard with proper z-ordering
    return "";
  }
}
