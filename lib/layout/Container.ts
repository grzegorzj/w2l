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
  private elements: any[] = [];

  /**
   * Creates a new Container instance.
   *
   * @param config - Configuration for the container
   */
  constructor(config: ContainerConfig) {
    super();
    this.config = config;
    this._width = parseUnit(config.size.width);
    this._height = parseUnit(config.size.height);

    if (config.padding) {
      this.padding = config.padding;
    }
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
    return {
      x: `${this.currentPosition.x + this._width / 2}px`,
      y: `${this.currentPosition.y + this._height / 2}px`,
    };
  }

  /**
   * Gets the top-left corner of the container.
   *
   * @returns The top-left point
   */
  get topLeft(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the top-right corner of the container.
   *
   * @returns The top-right point
   */
  get topRight(): Point {
    return {
      x: `${this.currentPosition.x + this._width}px`,
      y: `${this.currentPosition.y}px`,
    };
  }

  /**
   * Gets the bottom-left corner of the container.
   *
   * @returns The bottom-left point
   */
  get bottomLeft(): Point {
    return {
      x: `${this.currentPosition.x}px`,
      y: `${this.currentPosition.y + this._height}px`,
    };
  }

  /**
   * Gets the bottom-right corner of the container.
   *
   * @returns The bottom-right point
   */
  get bottomRight(): Point {
    return {
      x: `${this.currentPosition.x + this._width}px`,
      y: `${this.currentPosition.y + this._height}px`,
    };
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
    return {
      x: `${this.currentPosition.x + padding.left}px`,
      y: `${this.currentPosition.y + padding.top}px`,
    };
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
    this.elements.push(element);
  }

  /**
   * Gets all elements in the container.
   *
   * @returns Array of elements
   */
  get children(): any[] {
    return this.elements;
  }

  /**
   * Renders the container.
   *
   * @returns Empty string (containers are invisible)
   *
   * @remarks
   * Containers are invisible layout elements and do not render anything.
   * Only their child elements render.
   */
  render(): string {
    // Containers are invisible - they don't render anything
    // Only their children render
    return "";
  }
}

