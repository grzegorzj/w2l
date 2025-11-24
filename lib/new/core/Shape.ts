/**
 * New layout system - Shape class
 */

import { NewElement, type PositionConfig } from "./Element.js";
import { Stylable, Style } from "../../core/Stylable.js";

/**
 * Base class for all visual shapes.
 * Adds styling and transform capabilities to elements.
 */
export abstract class NewShape extends NewElement implements Stylable {
  protected _style: Style = {};
  protected _rotation: number = 0; // Rotation in degrees
  protected _translation: { x: number; y: number } = { x: 0, y: 0 }; // Translation offset

  constructor(style?: Partial<Style>) {
    super(); // Call NewElement constructor for creation index
    if (style) {
      this._style = { ...style };
    }
  }

  get style(): Style {
    return { ...this._style };
  }

  set style(value: Style) {
    this._style = { ...value };
  }

  applyStyle(style: Partial<Style>): void {
    this._style = { ...this._style, ...style };
  }

  /**
   * Set the rotation of the shape in degrees.
   * Rotation is applied around the shape's center.
   * Note: This is a geometric transformation that affects corner positions.
   */
  rotate(degrees: number): void {
    this._rotation = degrees;
  }

  /**
   * Get the current rotation in degrees.
   */
  get rotation(): number {
    return this._rotation;
  }

  /**
   * Translate (move) the shape by a distance along a direction vector.
   * This modifies the actual position, not a visual transform.
   *
   * @param along - Direction vector (will be normalized if not unit length)
   * @param distance - Distance to move in that direction
   */
  translate(along: { x: number; y: number }, distance: number): void {
    // Normalize the direction vector
    const length = Math.sqrt(along.x ** 2 + along.y ** 2);
    if (length === 0) return;

    const normalizedX = along.x / length;
    const normalizedY = along.y / length;

    // Calculate translation offset
    const dx = normalizedX * distance;
    const dy = normalizedY * distance;

    // Apply translation by modifying position
    this._translation.x += dx;
    this._translation.y += dy;

    // Update actual position
    this._position.x += dx;
    this._position.y += dy;
  }

  /**
   * Get the center point of the shape for rotation.
   * Subclasses should override this if they have a specific center point.
   */
  protected getRotationCenter(): { x: number; y: number } {
    // Default: use the shape's center if available
    if ((this as any).center) {
      const center = (this as any).center;
      return { x: center.x, y: center.y };
    }
    // Fallback: use absolute position
    return this.getAbsolutePosition();
  }

  /**
   * Generate SVG transform attribute for rotation.
   * We still use SVG transform for rotation since it's complex to recalculate all vertices.
   */
  protected getTransformAttribute(): string {
    if (this._rotation === 0) return "";

    const center = this.getRotationCenter();
    return `transform="rotate(${this._rotation} ${center.x} ${center.y})"`;
  }

  /**
   * Get the transformed corners of the shape (after rotation).
   * This allows querying actual corner positions after transforms.
   * Subclasses should override this to provide accurate corner positions.
   */
  getTransformedCorners(): { x: number; y: number }[] {
    // Default implementation - subclasses should override
    return [];
  }
}
