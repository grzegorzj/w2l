/**
 * New layout system - Triangle
 * A triangle shape with various types (right, equilateral, isosceles)
 */

import { Shape } from "../core/Shape.js";
import { type Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { type Position } from "../core/Element.js";
import { Side, type SideLabelConfig } from "./Side.js";
import { Text } from "./Text.js";

export type TriangleType = "right" | "equilateral" | "isosceles";
export type TriangleOrientation =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

export interface TriangleConfig {
  type: TriangleType;
  a: number; // First side length
  b?: number; // Second side length (optional for equilateral)
  c?: number; // Third side length (for custom triangles)
  orientation?: TriangleOrientation;
  style?: Partial<Style>;
}

/**
 * Represents a side (edge) of a triangle with geometric properties.
 *
 * Provides access to side length, center, angle, endpoints, and normal vectors
 * useful for positioning adjacent elements.
 */
export interface TriangleSide {
  /** Length of the side in pixels */
  length: number;
  /** Center point of the side */
  center: Position;
  /** Starting point of the side */
  start: Position;
  /** Ending point of the side */
  end: Position;
  /** Angle of the side in degrees (0° = horizontal right, 90° = down) */
  angle: number;
  /** Outward-facing unit normal vector (perpendicular to side, pointing away from triangle) */
  outwardNormal: Position;
  /** Inward-facing unit normal vector (perpendicular to side, pointing toward triangle) */
  inwardNormal: Position;
  /** Direction unit vector (along the side from start to end) */
  direction: Position;
}

/**
 * Triangle shape with automatic vertex calculation
 */
export class Triangle extends Shape {
  private vertices: [Position, Position, Position];
  private _center: Position;
  private _boundingWidth: number;
  private _boundingHeight: number;

  constructor(config: TriangleConfig) {
    super(config.style);

    const orientation = config.orientation ?? "bottomLeft";
    this.vertices = this.calculateVertices(config, orientation);

    // Calculate bounding box and center
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    this._boundingWidth = maxX - minX;
    this._boundingHeight = maxY - minY;

    // Center is the centroid of the triangle
    this._center = {
      x: (this.vertices[0].x + this.vertices[1].x + this.vertices[2].x) / 3,
      y: (this.vertices[0].y + this.vertices[1].y + this.vertices[2].y) / 3,
    };
  }

  private calculateVertices(
    config: TriangleConfig,
    orientation: TriangleOrientation
  ): [Position, Position, Position] {
    const { type, a, b } = config;

    if (type === "right") {
      const sideA = a;
      const sideB = b ?? a; // Default to isosceles right triangle
      const sideC = Math.sqrt(sideA * sideA + sideB * sideB); // Pythagorean theorem

      // Create vertices based on orientation
      switch (orientation) {
        case "bottomLeft":
          return [
            { x: 0, y: 0 }, // Right angle at origin
            { x: sideA, y: 0 }, // Along x-axis
            { x: 0, y: -sideB }, // Along y-axis (up)
          ];
        case "bottomRight":
          return [
            { x: 0, y: 0 }, // Right angle at origin
            { x: -sideA, y: 0 }, // Along negative x-axis
            { x: 0, y: -sideB }, // Along y-axis (up)
          ];
        case "topLeft":
          return [
            { x: 0, y: 0 }, // Right angle at origin
            { x: sideA, y: 0 }, // Along x-axis
            { x: 0, y: sideB }, // Along y-axis (down)
          ];
        case "topRight":
          return [
            { x: 0, y: 0 }, // Right angle at origin
            { x: -sideA, y: 0 }, // Along negative x-axis
            { x: 0, y: sideB }, // Along y-axis (down)
          ];
      }
    } else if (type === "equilateral") {
      const side = a;
      const height = (side * Math.sqrt(3)) / 2;

      // Equilateral triangle pointing up
      return [
        { x: -side / 2, y: height / 3 }, // Bottom left
        { x: side / 2, y: height / 3 }, // Bottom right
        { x: 0, y: (-2 * height) / 3 }, // Top
      ];
    } else if (type === "isosceles") {
      const base = a;
      const height = b ?? a;

      // Isosceles triangle pointing up
      return [
        { x: -base / 2, y: height / 2 }, // Bottom left
        { x: base / 2, y: height / 2 }, // Bottom right
        { x: 0, y: -height / 2 }, // Top
      ];
    }

    // Default fallback
    return [
      { x: 0, y: 0 },
      { x: a, y: 0 },
      { x: a / 2, y: -(b ?? a) },
    ];
  }

  /**
   * Get the center (centroid) of the triangle
   */
  get center(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._center.x,
      y: absPos.y + this._center.y,
    };
  }

  /**
   * Get the bounding box center (used for alignment in containers)
   */
  get boundingBoxCenter(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + (minX + maxX) / 2,
      y: absPos.y + (minY + maxY) / 2,
    };
  }

  /**
   * Get the bounding box width
   */
  get boundingWidth(): number {
    return this._boundingWidth;
  }

  /**
   * Get the bounding box height
   */
  get boundingHeight(): number {
    return this._boundingHeight;
  }

  /**
   * Get the bounding box top-left corner
   */
  get boundingBoxTopLeft(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);

    return {
      x: absPos.x + minX,
      y: absPos.y + minY,
    };
  }

  /**
   * Get the vertices in absolute coordinates
   */
  get absoluteVertices(): [Position, Position, Position] {
    const absPos = this.getAbsolutePosition();
    return [
      { x: absPos.x + this.vertices[0].x, y: absPos.y + this.vertices[0].y },
      { x: absPos.x + this.vertices[1].x, y: absPos.y + this.vertices[1].y },
      { x: absPos.x + this.vertices[2].x, y: absPos.y + this.vertices[2].y },
    ];
  }

  /**
   * Get the three sides of the triangle with their geometric properties.
   * Each side includes length, center, angle, endpoints, normals, and direction.
   *
   * Sides are returned in counter-clockwise order (see CONVENTIONS.md).
   *
   * @returns Array of three triangle sides with full geometric properties
   *
   * @example
   * Position elements along triangle sides
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * triangle.sides.forEach((side, index) => {
   *   console.log(`Side ${index}: length=${side.length}, angle=${side.angle}°`);
   *   // Use side.outwardNormal to position elements outside the triangle
   *   // Use side.inwardNormal to position elements inside the triangle
   * });
   * ```
   */
  get sides(): [TriangleSide, TriangleSide, TriangleSide] {
    const verts = this.absoluteVertices;

    const createSide = (start: Position, end: Position): TriangleSide => {
      const side = new Side({ start, end });

      return {
        length: side.length,
        center: side.center,
        start: side.start,
        end: side.end,
        angle: side.angle,
        outwardNormal: side.outwardNormal,
        inwardNormal: side.inwardNormal,
        direction: side.direction,
      };
    };

    // Create sides in counter-clockwise order: v0→v1, v1→v2, v2→v0
    return [
      createSide(verts[0], verts[1]),
      createSide(verts[1], verts[2]),
      createSide(verts[2], verts[0]),
    ];
  }

  /**
   * Creates labels for the triangle's sides using mathematical conventions.
   * By default, labels sides with lowercase letters (a, b, c) positioned outward.
   *
   * @param labels - Array of 3 label strings (can include LaTeX), or undefined to use defaults
   * @param config - Optional configuration for label positioning
   * @returns Array of three Text elements
   *
   * @example
   * Create a triangle with labeled sides
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * const sideLabels = triangle.createSideLabels(["$a$", "$b$", "$c$"]);
   * artboard.addElement(triangle);
   * sideLabels.forEach(label => artboard.addElement(label));
   * ```
   */
  createSideLabels(
    labels?: [string, string, string],
    config?: SideLabelConfig
  ): [Text, Text, Text] {
    const defaultLabels: [string, string, string] = ["$a$", "$b$", "$c$"];
    const labelTexts = labels ?? defaultLabels;

    const sides = this.sides;
    const sideObjects = [
      new Side({ start: sides[0].start, end: sides[0].end }),
      new Side({ start: sides[1].start, end: sides[1].end }),
      new Side({ start: sides[2].start, end: sides[2].end }),
    ];

    return [
      sideObjects[0].createLabel(labelTexts[0], config),
      sideObjects[1].createLabel(labelTexts[1], config),
      sideObjects[2].createLabel(labelTexts[2], config),
    ];
  }

  /**
   * Creates labels for the triangle's vertices using mathematical conventions.
   * By default, labels vertices with uppercase letters (A, B, C) positioned outward.
   *
   * @param labels - Array of 3 label strings (can include LaTeX), or undefined to use defaults
   * @param offset - Distance from vertex (in pixels). Defaults to 25
   * @param fontSize - Font size for the labels. Defaults to 16
   * @returns Array of three Text elements
   *
   * @example
   * Create a triangle with labeled vertices
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * const vertexLabels = triangle.createVertexLabels(["$A$", "$B$", "$C$"]);
   * artboard.addElement(triangle);
   * vertexLabels.forEach(label => artboard.addElement(label));
   * ```
   */
  createVertexLabels(
    labels?: [string, string, string],
    offset: number = 25,
    fontSize: number = 16
  ): [Text, Text, Text] {
    const defaultLabels: [string, string, string] = ["$A$", "$B$", "$C$"];
    const labelTexts = labels ?? defaultLabels;

    const verts = this.absoluteVertices;
    const center = this.center;

    // For each vertex, calculate the outward direction (away from centroid)
    const createVertexLabel = (vertex: Position, labelText: string): Text => {
      const dx = vertex.x - center.x;
      const dy = vertex.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Normalize and scale
      const normalX = (dx / dist) * offset;
      const normalY = (dy / dist) * offset;

      const label = new Text({
        content: labelText,
        fontSize,
      });

      // Position the label so its center is at the offset position
      const targetX = vertex.x + normalX;
      const targetY = vertex.y + normalY;

      label.position({
        relativeTo: { x: targetX, y: targetY },
        relativeFrom: label.center,
        x: 0,
        y: 0,
        boxReference: "contentBox",
      });

      return label;
    };

    return [
      createVertexLabel(verts[0], labelTexts[0]),
      createVertexLabel(verts[1], labelTexts[1]),
      createVertexLabel(verts[2], labelTexts[2]),
    ];
  }

  render(): string {
    const verts = this.absoluteVertices;
    const points = verts.map((v) => `${v.x},${v.y}`).join(" ");
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();

    return `<polygon points="${points}" ${attrs} ${transform}/>`;
  }

  /**
   * Get the bounding box of this triangle in absolute coordinates.
   */
  getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const bbTopLeft = this.boundingBoxTopLeft;
    return {
      minX: bbTopLeft.x,
      minY: bbTopLeft.y,
      maxX: bbTopLeft.x + this._boundingWidth,
      maxY: bbTopLeft.y + this._boundingHeight,
    };
  }

  /**
   * Get the transformed corners (vertices) after rotation.
   * Returns the three vertices after applying rotation.
   */
  getCorners(): { x: number; y: number }[] {
    if (this._rotation === 0) {
      // No rotation - return regular vertices
      return this.absoluteVertices;
    }

    // Get center point for rotation
    const center = this.center;
    const cx = center.x;
    const cy = center.y;

    // Get original vertices
    const vertices = this.absoluteVertices;

    // Rotate each vertex around the center
    const rotationRad = (this._rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    return vertices.map((vertex) => {
      // Translate to origin
      const x = vertex.x - cx;
      const y = vertex.y - cy;

      // Rotate
      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;

      // Translate back
      return {
        x: rotatedX + cx,
        y: rotatedY + cy,
      };
    });
  }
}
