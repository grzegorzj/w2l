/**
 * New layout system - Circle class
 */

import { Shape } from "../core/Shape.js";
import { type Position } from "../core/Element.js";
import { styleToSVGAttributes, type Style } from "../core/Stylable.js";

export interface CircleConfig {
  radius: number;
  style?: Partial<Style>;
}

/**
 * A simple circle element for testing positioning.
 */
export class Circle extends Shape {
  private _radius: number;

  constructor(config: CircleConfig) {
    super(config.style);
    this._radius = config.radius;
  }

  get radius(): number {
    return this._radius;
  }

  /**
   * Gets the absolute center position of the circle.
   */
  get center(): Position {
    return this.getAbsolutePosition();
  }

  /**
   * Get the top-left corner position (bounding box).
   */
  get topLeft(): Position {
    const c = this.center;
    return {
      x: c.x - this._radius,
      y: c.y - this._radius,
    };
  }

  /**
   * Get the top-right corner position (bounding box).
   */
  get topRight(): Position {
    const c = this.center;
    return {
      x: c.x + this._radius,
      y: c.y - this._radius,
    };
  }

  /**
   * Get the bottom-left corner position (bounding box).
   */
  get bottomLeft(): Position {
    const c = this.center;
    return {
      x: c.x - this._radius,
      y: c.y + this._radius,
    };
  }

  /**
   * Get the bottom-right corner position (bounding box).
   */
  get bottomRight(): Position {
    const c = this.center;
    return {
      x: c.x + this._radius,
      y: c.y + this._radius,
    };
  }

  /**
   * Get the center-top position (bounding box).
   */
  get centerTop(): Position {
    const c = this.center;
    return {
      x: c.x,
      y: c.y - this._radius,
    };
  }

  /**
   * Get the center-bottom position (bounding box).
   */
  get centerBottom(): Position {
    const c = this.center;
    return {
      x: c.x,
      y: c.y + this._radius,
    };
  }

  /**
   * Get the center-left position (bounding box).
   */
  get centerLeft(): Position {
    const c = this.center;
    return {
      x: c.x - this._radius,
      y: c.y,
    };
  }

  /**
   * Get the center-right position (bounding box).
   */
  get centerRight(): Position {
    const c = this.center;
    return {
      x: c.x + this._radius,
      y: c.y,
    };
  }

  /**
   * Convenient alias for centerTop.
   */
  get top(): Position {
    return this.centerTop;
  }

  /**
   * Convenient alias for centerTop.
   */
  get topCenter(): Position {
    return this.centerTop;
  }

  /**
   * Convenient alias for centerBottom.
   */
  get bottom(): Position {
    return this.centerBottom;
  }

  /**
   * Convenient alias for centerBottom.
   */
  get bottomCenter(): Position {
    return this.centerBottom;
  }

  /**
   * Convenient alias for centerLeft.
   */
  get left(): Position {
    return this.centerLeft;
  }

  /**
   * Convenient alias for centerRight.
   */
  get right(): Position {
    return this.centerRight;
  }

  render(): string {
    const absolutePos = this.getAbsolutePosition();
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");

    const circleTag = `<circle cx="${absolutePos.x}" cy="${absolutePos.y}" r="${this._radius}" ${attrs} ${transform}/>`;

    if (childrenHTML) {
      return `<g>
  ${circleTag}
  ${childrenHTML}
</g>`;
    }

    return circleTag;
  }

  /**
   * Get the bounding box of this circle in absolute coordinates.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const absCenter = this.center;
    return {
      minX: absCenter.x - this._radius,
      minY: absCenter.y - this._radius,
      maxX: absCenter.x + this._radius,
      maxY: absCenter.y + this._radius,
    };
  }

  /**
   * Get the transformed corners (cardinal points) after rotation.
   * For a circle, returns 4 points: top, right, bottom, left
   */
  getCorners(): { x: number; y: number }[] {
    const c = this.center;
    const r = this._radius;

    // Cardinal points before rotation
    const points = [
      { x: c.x, y: c.y - r },      // Top
      { x: c.x + r, y: c.y },      // Right
      { x: c.x, y: c.y + r },      // Bottom
      { x: c.x - r, y: c.y },      // Left
    ];

    if (this._rotation === 0) {
      return points;
    }

    // Rotate each point around the center
    const rotationRad = (this._rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    return points.map(point => {
      // Translate to origin
      const x = point.x - c.x;
      const y = point.y - c.y;

      // Rotate
      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;

      // Translate back
      return {
        x: rotatedX + c.x,
        y: rotatedY + c.y,
      };
    });
  }
}
