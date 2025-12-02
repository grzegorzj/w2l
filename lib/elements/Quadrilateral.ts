/**
 * Quadrilateral shape with various types (rectangle, square, parallelogram, trapezoid, rhombus, kite)
 */

import { Shape } from "../core/Shape.js";
import { type Style } from "../core/Stylable.js";
import { styleToSVGAttributes } from "../core/Stylable.js";
import { type Position } from "../core/Element.js";
import { Side, type SideLabelConfig } from "./Side.js";
import { Line } from "./Line.js";
import { Text } from "./Text.js";
import { Circle } from "./Circle.js";
import { Angle, type AngleConfig } from "../components/Angle.js";

export type QuadrilateralType =
  | "rectangle"
  | "square"
  | "parallelogram"
  | "trapezoid"
  | "rhombus"
  | "kite"
  | "custom";

export interface QuadrilateralConfig {
  type: QuadrilateralType;
  /** Primary dimension (width for rectangle/square, base for parallelogram/trapezoid) */
  a: number;
  /** Secondary dimension (height for rectangle, not used for square) */
  b?: number;
  /** Angle in degrees (for parallelogram, rhombus) */
  angle?: number;
  /** Custom vertices (for custom type) - must provide 4 vertices in counter-clockwise order */
  vertices?: [Position, Position, Position, Position];
  style?: Partial<Style>;
}

/**
 * Altitude information for a quadrilateral.
 * Represents a perpendicular line from a vertex or side to another side.
 */
export interface QuadrilateralAltitude {
  /** The foot of the altitude (where it meets the target side) */
  foot: Position;
  /** The origin point (vertex or point on opposite side) */
  origin: Position;
  /** Length of the altitude */
  height: number;
  /** Line object representing the altitude (ready to add to artboard) */
  line: Line;
}

/**
 * Diagonal information for a quadrilateral.
 * Represents a line segment connecting two opposite vertices.
 */
export interface QuadrilateralDiagonal {
  /** Starting vertex of the diagonal */
  start: Position;
  /** Ending vertex of the diagonal */
  end: Position;
  /** Length of the diagonal */
  length: number;
  /** Center point of the diagonal */
  center: Position;
  /** Angle of the diagonal in degrees */
  angle: number;
  /** Line object representing the diagonal (ready to add to artboard) */
  line: Line;
}

/**
 * Represents a side (edge) of a quadrilateral with geometric properties.
 */
export interface QuadrilateralSide {
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
  /** Outward-facing unit normal vector */
  outwardNormal: Position;
  /** Inward-facing unit normal vector */
  inwardNormal: Position;
  /** Direction unit vector */
  direction: Position;
}

/**
 * Quadrilateral shape with automatic vertex calculation for common types.
 *
 * Supports various quadrilateral types with convenient shorthand configurations.
 *
 * @example
 * Create a rectangle
 * ```typescript
 * const rect = new Quadrilateral({
 *   type: "rectangle",
 *   a: 120,  // width
 *   b: 80    // height
 * });
 * ```
 *
 * @example
 * Create a parallelogram
 * ```typescript
 * const para = new Quadrilateral({
 *   type: "parallelogram",
 *   a: 100,    // base
 *   b: 60,     // side length
 *   angle: 60  // angle in degrees
 * });
 * ```
 */
export class Quadrilateral extends Shape {
  private vertices: [Position, Position, Position, Position];
  private _center: Position;
  private _boundingWidth: number;
  private _boundingHeight: number;
  private _type: QuadrilateralType;

  constructor(config: QuadrilateralConfig) {
    super(config.style);

    this._type = config.type;
    this.vertices = this.calculateVertices(config);

    // Calculate bounding box and center
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    this._boundingWidth = maxX - minX;
    this._boundingHeight = maxY - minY;

    // Center is the centroid of the quadrilateral
    this._center = {
      x:
        (this.vertices[0].x +
          this.vertices[1].x +
          this.vertices[2].x +
          this.vertices[3].x) /
        4,
      y:
        (this.vertices[0].y +
          this.vertices[1].y +
          this.vertices[2].y +
          this.vertices[3].y) /
        4,
    };
  }

  private calculateVertices(
    config: QuadrilateralConfig
  ): [Position, Position, Position, Position] {
    const { type, a, b, angle, vertices } = config;

    if (type === "custom" && vertices) {
      return vertices;
    }

    switch (type) {
      case "rectangle": {
        const width = a;
        const height = b ?? a;
        // Counter-clockwise from bottom-left
        return [
          { x: -width / 2, y: height / 2 },
          { x: width / 2, y: height / 2 },
          { x: width / 2, y: -height / 2 },
          { x: -width / 2, y: -height / 2 },
        ];
      }

      case "square": {
        const side = a;
        // Counter-clockwise from bottom-left
        return [
          { x: -side / 2, y: side / 2 },
          { x: side / 2, y: side / 2 },
          { x: side / 2, y: -side / 2 },
          { x: -side / 2, y: -side / 2 },
        ];
      }

      case "parallelogram": {
        const base = a;
        const sideLength = b ?? a;
        const angleRad = ((angle ?? 60) * Math.PI) / 180;
        const offsetX = sideLength * Math.cos(angleRad);
        const offsetY = sideLength * Math.sin(angleRad);
        // Counter-clockwise from bottom-left
        return [
          { x: -base / 2, y: 0 },
          { x: base / 2, y: 0 },
          { x: base / 2 + offsetX, y: -offsetY },
          { x: -base / 2 + offsetX, y: -offsetY },
        ];
      }

      case "trapezoid": {
        const baseBottom = a;
        const baseTop = b ?? a * 0.6;
        const height = angle ?? 60; // Reuse angle param for height
        // Counter-clockwise from bottom-left
        return [
          { x: -baseBottom / 2, y: height / 2 },
          { x: baseBottom / 2, y: height / 2 },
          { x: baseTop / 2, y: -height / 2 },
          { x: -baseTop / 2, y: -height / 2 },
        ];
      }

      case "rhombus": {
        const side = a;
        const angleRad = ((angle ?? 60) * Math.PI) / 180;
        const halfDiag1 =
          (side * Math.sin(angleRad)) / Math.sin((Math.PI - angleRad) / 2);
        const halfDiag2 = side * Math.cos(angleRad / 2);
        // Counter-clockwise from left vertex
        return [
          { x: -halfDiag2, y: 0 },
          { x: 0, y: halfDiag1 },
          { x: halfDiag2, y: 0 },
          { x: 0, y: -halfDiag1 },
        ];
      }

      case "kite": {
        const longDiag = a;
        const shortDiag = b ?? a * 0.6;
        const splitRatio = angle ?? 0.6; // Where the diagonals intersect (0-1)
        const split = splitRatio * longDiag;
        // Counter-clockwise from left vertex
        return [
          { x: -shortDiag / 2, y: 0 },
          { x: 0, y: -split },
          { x: shortDiag / 2, y: 0 },
          { x: 0, y: longDiag - split },
        ];
      }

      default:
        // Default to square
        return [
          { x: -a / 2, y: a / 2 },
          { x: a / 2, y: a / 2 },
          { x: a / 2, y: -a / 2 },
          { x: -a / 2, y: -a / 2 },
        ];
    }
  }

  /**
   * Get the center (centroid) of the quadrilateral
   */
  get center(): Position {
    const absPos = this.getAbsolutePosition();
    return {
      x: absPos.x + this._center.x,
      y: absPos.y + this._center.y,
    };
  }

  /**
   * Get the bounding box center
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
   * Get the top-left corner position (bounding box).
   */
  get topLeft(): Position {
    return this.boundingBoxTopLeft;
  }

  /**
   * Get the top-right corner position (bounding box).
   */
  get topRight(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);

    return {
      x: absPos.x + maxX,
      y: absPos.y + minY,
    };
  }

  /**
   * Get the bottom-left corner position (bounding box).
   */
  get bottomLeft(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + minX,
      y: absPos.y + maxY,
    };
  }

  /**
   * Get the bottom-right corner position (bounding box).
   */
  get bottomRight(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + maxX,
      y: absPos.y + maxY,
    };
  }

  /**
   * Get the center-top position (bounding box).
   */
  get centerTop(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);

    return {
      x: absPos.x + (minX + maxX) / 2,
      y: absPos.y + minY,
    };
  }

  /**
   * Get the center-bottom position (bounding box).
   */
  get centerBottom(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + (minX + maxX) / 2,
      y: absPos.y + maxY,
    };
  }

  /**
   * Get the center-left position (bounding box).
   */
  get centerLeft(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + minX,
      y: absPos.y + (minY + maxY) / 2,
    };
  }

  /**
   * Get the center-right position (bounding box).
   */
  get centerRight(): Position {
    const absPos = this.getAbsolutePosition();
    const xs = this.vertices.map((v) => v.x);
    const ys = this.vertices.map((v) => v.y);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: absPos.x + maxX,
      y: absPos.y + (minY + maxY) / 2,
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

  /**
   * Get the vertices in absolute coordinates
   */
  get absoluteVertices(): [Position, Position, Position, Position] {
    const absPos = this.getAbsolutePosition();
    return [
      { x: absPos.x + this.vertices[0].x, y: absPos.y + this.vertices[0].y },
      { x: absPos.x + this.vertices[1].x, y: absPos.y + this.vertices[1].y },
      { x: absPos.x + this.vertices[2].x, y: absPos.y + this.vertices[2].y },
      { x: absPos.x + this.vertices[3].x, y: absPos.y + this.vertices[3].y },
    ];
  }

  /**
   * Get the internal angle at a specific vertex (in degrees).
   *
   * @param vertexIndex - Index of the vertex (0-3)
   * @returns Internal angle in degrees
   */
  getInternalAngleAt(vertexIndex: number): number {
    const sides = this.sides;
    const prevSide = sides[(vertexIndex + 3) % 4]; // Previous side
    const nextSide = sides[vertexIndex]; // Current side

    // Calculate angle between the two sides
    // Internal angle = difference in angles, normalized
    let angle = nextSide.angle - prevSide.angle;

    // Normalize to 0-360 range
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;

    return angle;
  }

  /**
   * Get the external angle at a specific vertex (in degrees).
   * External angle = 360° - internal angle
   *
   * @param vertexIndex - Index of the vertex (0-3)
   * @returns External angle in degrees
   */
  getExternalAngleAt(vertexIndex: number): number {
    return 360 - this.getInternalAngleAt(vertexIndex);
  }

  /**
   * Get angle information for drawing an angle marker at a vertex.
   *
   * @param vertexIndex - Index of the vertex (0-3)
   * @param external - Whether to get external angle (default: false for internal)
   * @returns Object with startAngle, endAngle, and angle value in degrees
   */
  getAngleMarkerAt(
    vertexIndex: number,
    external: boolean = false
  ): {
    vertex: Position;
    startAngle: number;
    endAngle: number;
    angleDegrees: number;
  } {
    const sides = this.sides;
    const verts = this.absoluteVertices;
    const prevSide = sides[(vertexIndex + 3) % 4];

    if (external) {
      // External angle: extends from the previous side outward
      const angleDegrees = this.getExternalAngleAt(vertexIndex);
      return {
        vertex: verts[vertexIndex],
        startAngle: prevSide.angle + 180, // Extend previous side backward
        endAngle: prevSide.angle + 180 + angleDegrees,
        angleDegrees,
      };
    } else {
      // Internal angle: from previous side to next side
      const nextSide = sides[vertexIndex];
      const angleDegrees = this.getInternalAngleAt(vertexIndex);
      return {
        vertex: verts[vertexIndex],
        startAngle: prevSide.angle,
        endAngle: nextSide.angle,
        angleDegrees,
      };
    }
  }

  /**
   * Get the four sides of the quadrilateral with their geometric properties.
   *
   * @returns Array of four quadrilateral sides with full geometric properties
   */
  get sides(): [
    QuadrilateralSide,
    QuadrilateralSide,
    QuadrilateralSide,
    QuadrilateralSide,
  ] {
    const verts = this.absoluteVertices;

    const createSide = (start: Position, end: Position): QuadrilateralSide => {
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

    // Create sides in counter-clockwise order
    return [
      createSide(verts[0], verts[1]),
      createSide(verts[1], verts[2]),
      createSide(verts[2], verts[3]),
      createSide(verts[3], verts[0]),
    ];
  }

  /**
   * Get the four sides of the quadrilateral as Line objects.
   * Useful for creating angle annotations with the Angle component's line-based API.
   *
   * @returns Array of four Line objects representing the quadrilateral's sides
   *
   * @example
   * Create angle annotations using line-based API
   * ```typescript
   * const quad = new Quadrilateral({ type: "rectangle", a: 100, b: 80 });
   * const [line0, line1, line2, line3] = quad.getSideLines();
   *
   * // Create an angle at vertex 0 (between line3 and line0)
   * const angle = new Angle({
   *   line1: line3,
   *   line2: line0,
   *   angleType: 'smaller',
   *   label: "$\\alpha$",
   * });
   * ```
   */
  getSideLines(): [Line, Line, Line, Line] {
    const sides = this.sides;
    return [
      new Line({
        start: sides[0].start,
        end: sides[0].end,
        style: { stroke: "transparent" },
      }),
      new Line({
        start: sides[1].start,
        end: sides[1].end,
        style: { stroke: "transparent" },
      }),
      new Line({
        start: sides[2].start,
        end: sides[2].end,
        style: { stroke: "transparent" },
      }),
      new Line({
        start: sides[3].start,
        end: sides[3].end,
        style: { stroke: "transparent" },
      }),
    ];
  }

  /**
   * Creates labels for the quadrilateral's sides.
   *
   * @param labels - Array of 4 label strings, or undefined to use defaults
   * @param config - Optional configuration for label positioning
   * @returns Array of four Text elements
   */
  createSideLabels(
    labels?: [string, string, string, string],
    config?: SideLabelConfig
  ): [Text, Text, Text, Text] {
    const defaultLabels: [string, string, string, string] = [
      "$a$",
      "$b$",
      "$c$",
      "$d$",
    ];
    const labelTexts = labels ?? defaultLabels;

    const sides = this.sides;
    const sideObjects = [
      new Side({ start: sides[0].start, end: sides[0].end }),
      new Side({ start: sides[1].start, end: sides[1].end }),
      new Side({ start: sides[2].start, end: sides[2].end }),
      new Side({ start: sides[3].start, end: sides[3].end }),
    ];

    return [
      sideObjects[0].createLabel(labelTexts[0], config),
      sideObjects[1].createLabel(labelTexts[1], config),
      sideObjects[2].createLabel(labelTexts[2], config),
      sideObjects[3].createLabel(labelTexts[3], config),
    ];
  }

  /**
   * Creates labels for the quadrilateral's vertices.
   *
   * @param labels - Array of 4 label strings, or undefined to use defaults
   * @param offset - Distance from vertex (in pixels). Defaults to 25
   * @param fontSize - Font size for the labels. Defaults to 16
   * @returns Array of four Text elements
   */
  createVertexLabels(
    labels?: [string, string, string, string],
    offset: number = 25,
    fontSize: number = 16
  ): [Text, Text, Text, Text] {
    const defaultLabels: [string, string, string, string] = [
      "$A$",
      "$B$",
      "$C$",
      "$D$",
    ];
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

      // Mark label to escape container layout - it's positioned based on global geometry
      (label as any).markEscapeContainerLayout();

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
      createVertexLabel(verts[3], labelTexts[3]),
    ];
  }

  /**
   * Creates an angle marker for a specific vertex of the quadrilateral.
   *
   * @param vertexIndex - Index of the vertex (0-3)
   * @param options - Configuration for the angle marker
   * @param options.mode - 'internal' for internal angle, 'external' for external angle
   * @param options.label - Optional label for the angle (e.g., "α", "90°")
   * @param options.radius - Radius of the angle arc (default: 40)
   * @param options.style - SVG style for the angle marker
   * @returns Angle element
   *
   * @example
   * ```typescript
   * const quad = new Quadrilateral({ type: "rectangle", a: 100, b: 80 });
   * const angle = quad.showAngle(0, { mode: 'internal', label: "90°" });
   * artboard.addElement(quad);
   * artboard.addElement(angle);
   * ```
   */
  showAngle(
    vertexIndex: number,
    options?: {
      mode?: "internal" | "external";
      label?: string;
      radius?: number;
      style?: Partial<Style>;
      rightAngleMarker?: "square" | "dot" | "arc";
    }
  ): Angle {
    const mode = options?.mode ?? "internal";
    const verts = this.absoluteVertices;

    // Get the two sides that meet at this vertex
    // sides[i] goes from vertex i to vertex (i+1)%4
    // So at vertex i:
    // - incoming side is from vertex (i+3)%4 to vertex i
    // - outgoing side is from vertex i to vertex (i+1)%4
    const prevVertexIdx = (vertexIndex + 3) % 4;
    const nextVertexIdx = (vertexIndex + 1) % 4;

    const incomingSide = new Side({
      start: verts[prevVertexIdx],
      end: verts[vertexIndex],
    });

    const outgoingSide = new Side({
      start: verts[vertexIndex],
      end: verts[nextVertexIdx],
    });

    return new Angle({
      from: "vertex",
      segments: [incomingSide, outgoingSide],
      mode: mode,
      label: options?.label,
      radius: options?.radius,
      style: options?.style,
      rightAngleMarker: options?.rightAngleMarker,
    });
  }

  /**
   * Creates angle markers for all four vertices of the quadrilateral.
   *
   * Supports two API styles:
   * 1. Simple: Apply same configuration to all angles
   * 2. Per-angle: Configure each angle individually using A, B, C, D properties
   *
   * @param options - Configuration for the angle markers
   * @returns Array of four Angle elements
   *
   * @example
   * Simple API - same style for all angles
   * ```typescript
   * const quad = new Quadrilateral({ type: "parallelogram", a: 100, b: 60, angle: 60 });
   * const angles = quad.showAngles({
   *   mode: 'internal',
   *   labels: ["α", "β", "γ", "δ"],
   *   style: { stroke: "#ef4444" }
   * });
   * ```
   *
   * @example
   * Per-angle API - different style for each angle
   * ```typescript
   * const angles = quad.showAngles({
   *   A: { color: "#ef4444", radius: 20, label: "60°" },
   *   B: { color: "#3b82f6", radius: 20, label: "120°" },
   *   C: { color: "#ef4444", radius: 20, label: "60°" },
   *   D: { color: "#3b82f6", radius: 20, label: "120°" },
   * });
   * ```
   */
  showAngles(options?: {
    mode?: "internal" | "external";
    labels?: [string?, string?, string?, string?];
    radius?: number;
    style?: Partial<Style>;
    rightAngleMarker?: "square" | "dot" | "arc";
    // Per-angle configuration
    A?: { color?: string; radius?: number; label?: string; type?: "right" };
    B?: { color?: string; radius?: number; label?: string; type?: "right" };
    C?: { color?: string; radius?: number; label?: string; type?: "right" };
    D?: { color?: string; radius?: number; label?: string; type?: "right" };
  }): [Angle, Angle, Angle, Angle] {
    const mode = options?.mode ?? "internal";

    // Check if using per-angle API (A, B, C, D properties)
    if (options?.A || options?.B || options?.C || options?.D) {
      const createAngle = (
        vertexIndex: number,
        config?: {
          color?: string;
          radius?: number;
          label?: string;
          type?: "right";
        }
      ) => {
        const style = config?.color ? { stroke: config.color } : options?.style;
        const rightMarker =
          config?.type === "right" ? "square" : options?.rightAngleMarker;

        return this.showAngle(vertexIndex, {
          mode,
          label: config?.label,
          radius: config?.radius ?? options?.radius,
          style,
          rightAngleMarker: rightMarker,
        });
      };

      return [
        createAngle(0, options.A),
        createAngle(1, options.B),
        createAngle(2, options.C),
        createAngle(3, options.D),
      ];
    }

    // Simple API - same configuration for all angles
    const labels = options?.labels ?? [
      undefined,
      undefined,
      undefined,
      undefined,
    ];

    return [
      this.showAngle(0, { ...options, label: labels[0] }),
      this.showAngle(1, { ...options, label: labels[1] }),
      this.showAngle(2, { ...options, label: labels[2] }),
      this.showAngle(3, { ...options, label: labels[3] }),
    ];
  }

  /**
   * Get the two diagonals of the quadrilateral.
   * Returns diagonal information including line objects ready to be drawn.
   *
   * @returns Array of two diagonals: [diagonal 0→2, diagonal 1→3]
   *
   * @example
   * Draw the diagonals of a quadrilateral
   * ```typescript
   * const quad = new Quadrilateral({ type: "rectangle", a: 100, b: 80 });
   * const diagonals = quad.getDiagonals();
   * artboard.add(quad);
   * diagonals.forEach(diag => artboard.add(diag.line));
   * ```
   */
  getDiagonals(): [QuadrilateralDiagonal, QuadrilateralDiagonal] {
    const verts = this.absoluteVertices;

    const createDiagonal = (
      start: Position,
      end: Position
    ): QuadrilateralDiagonal => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      };

      const lineStyle: Partial<Style> = {
        stroke: "#666",
        strokeWidth: "1",
        strokeDasharray: "4,4",
      };
      const line = new Line({
        start: start,
        end: end,
        style: lineStyle,
      });

      return {
        start,
        end,
        length,
        center,
        angle,
        line,
      };
    };

    return [
      createDiagonal(verts[0], verts[2]), // Diagonal from vertex 0 to vertex 2
      createDiagonal(verts[1], verts[3]), // Diagonal from vertex 1 to vertex 3
    ];
  }

  /**
   * Get altitudes for the quadrilateral.
   * Returns meaningful altitudes based on the quadrilateral type:
   * - Trapezoid: Two altitudes from top base vertices to bottom base (showing the height h)
   * - Parallelogram/Rectangle/Square/Rhombus: Two altitudes showing height between parallel sides
   * - Kite/Custom: All four altitudes from vertices to opposite sides
   *
   * @returns Array of altitude objects with positioning information
   *
   * @example
   * Draw altitudes of a parallelogram
   * ```typescript
   * const para = new Quadrilateral({ type: "parallelogram", a: 100, b: 60, angle: 60 });
   * const altitudes = para.getAltitudes();
   * artboard.add(para);
   * altitudes.forEach(alt => artboard.add(alt.line));
   * ```
   */
  getAltitudes(): QuadrilateralAltitude[] {
    const verts = this.absoluteVertices;
    const altitudes: QuadrilateralAltitude[] = [];

    // Helper to calculate perpendicular projection of a point onto a line segment
    const calculateAltitude = (
      vertex: Position,
      sideStart: Position,
      sideEnd: Position
    ): QuadrilateralAltitude => {
      const dx = sideEnd.x - sideStart.x;
      const dy = sideEnd.y - sideStart.y;
      let t =
        ((vertex.x - sideStart.x) * dx + (vertex.y - sideStart.y) * dy) /
        (dx * dx + dy * dy);

      // Clamp t to [0, 1] so the foot stays on the actual line segment, not the extended line
      t = Math.max(0, Math.min(1, t));

      const foot: Position = {
        x: sideStart.x + t * dx,
        y: sideStart.y + t * dy,
      };

      const height = Math.sqrt(
        (vertex.x - foot.x) ** 2 + (vertex.y - foot.y) ** 2
      );

      // DEBUG: Create circles at vertex and foot
      const vertexCircle = new Circle({
        radius: 5,
        style: { fill: "red", stroke: "darkred", strokeWidth: "2" },
      });
      vertexCircle.position({
        relativeTo: vertex,
        relativeFrom: vertexCircle.center,
        x: 0,
        y: 0,
      });
      this.addElement(vertexCircle);

      const footCircle = new Circle({
        radius: 5,
        style: { fill: "green", stroke: "darkgreen", strokeWidth: "2" },
      });
      footCircle.position({
        relativeTo: foot,
        relativeFrom: footCircle.center,
        x: 0,
        y: 0,
      });
      this.addElement(footCircle);

      const altStyle: Partial<Style> = {
        stroke: "#666",
        strokeWidth: "1",
        strokeDasharray: "4,4",
      };
      const altitudeLine = new Line({
        start: vertex,
        end: foot,
        style: altStyle,
      });

      return {
        foot,
        origin: vertex,
        height,
        line: altitudeLine,
      };
    };

    // Return altitudes based on quadrilateral type
    if (this._type === "trapezoid") {
      // For trapezoid: only altitudes from top base (vertices 2, 3) to bottom base (side 0-1)
      // These show the height between the two parallel bases
      altitudes.push(calculateAltitude(verts[2], verts[0], verts[1]));
      altitudes.push(calculateAltitude(verts[3], verts[0], verts[1]));
    } else if (
      this._type === "parallelogram" ||
      this._type === "rectangle" ||
      this._type === "square" ||
      this._type === "rhombus"
    ) {
      // For parallelograms and related shapes: altitudes from one pair of vertices to opposite side
      // Show the height perpendicular to the base
      altitudes.push(calculateAltitude(verts[2], verts[0], verts[1]));
      altitudes.push(calculateAltitude(verts[3], verts[0], verts[1]));
    } else {
      // For kite and custom: return all four altitudes
      altitudes.push(calculateAltitude(verts[0], verts[1], verts[2]));
      altitudes.push(calculateAltitude(verts[1], verts[2], verts[3]));
      altitudes.push(calculateAltitude(verts[2], verts[3], verts[0]));
      altitudes.push(calculateAltitude(verts[3], verts[0], verts[1]));
    }

    return altitudes;
  }

  /**
   * Draw all diagonals of the quadrilateral.
   * Returns Line elements that can be added to the artboard or container.
   *
   * @param style - Optional style for the diagonal lines
   * @returns Array of two Line elements representing the diagonals
   *
   * @example
   * ```typescript
   * const quad = new Quadrilateral({ type: "rectangle", a: 100, b: 80 });
   * const diagonalLines = quad.drawDiagonals({ stroke: "blue", strokeWidth: 2 });
   * artboard.add(quad);
   * diagonalLines.forEach(line => artboard.add(line));
   * ```
   */
  drawDiagonals(style?: Partial<Style>): [Line, Line] {
    const diagonals = this.getDiagonals();
    const defaultStyle: Partial<Style> = {
      stroke: "#666",
      strokeWidth: "1",
      strokeDasharray: "4,4",
    };

    return diagonals.map((diag) => {
      // Create line using absolute coordinates as "offsets" from origin
      // Line defaults to position (0,0), so these act as absolute coordinates
      return new Line({
        start: diag.start,
        end: diag.end,
        style: style ?? defaultStyle,
      });
    }) as [Line, Line];
  }

  /**
   * Draw all altitudes of the quadrilateral.
   * Returns Line elements that can be added to the artboard or container.
   *
   * @param style - Optional style for the altitude lines
   * @returns Array of Line elements representing the altitudes
   *
   * @example
   * ```typescript
   * const para = new Quadrilateral({ type: "parallelogram", a: 100, b: 60, angle: 60 });
   * const altitudeLines = para.drawAltitudes({ stroke: "red", strokeDasharray: "2,2" });
   * artboard.add(para);
   * altitudeLines.forEach(line => artboard.add(line));
   * ```
   */
  drawAltitudes(style?: Partial<Style>): Line[] {
    const altitudes = this.getAltitudes();
    const defaultStyle: Partial<Style> = {
      stroke: "#666",
      strokeWidth: "1",
      strokeDasharray: "4,4",
    };

    return altitudes.map((alt) => {
      // Create line using absolute coordinates as "offsets" from origin
      // Line defaults to position (0,0), so these act as absolute coordinates
      return new Line({
        start: alt.origin,
        end: alt.foot,
        style: style ?? defaultStyle,
      });
    });
  }

  render(): string {
    const verts = this.absoluteVertices;
    const points = verts.map((v) => `${v.x},${v.y}`).join(" ");
    const attrs = styleToSVGAttributes(this._style);
    const transform = this.getTransformAttribute();

    return `<polygon points="${points}" ${attrs} ${transform}/>`;
  }

  /**
   * Get the bounding box of this quadrilateral in absolute coordinates.
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
   */
  getCorners(): { x: number; y: number }[] {
    if (this._rotation === 0) {
      return this.absoluteVertices;
    }

    const center = this.center;
    const cx = center.x;
    const cy = center.y;

    const vertices = this.absoluteVertices;

    const rotationRad = (this._rotation * Math.PI) / 180;
    const cos = Math.cos(rotationRad);
    const sin = Math.sin(rotationRad);

    return vertices.map((vertex) => {
      const x = vertex.x - cx;
      const y = vertex.y - cy;

      const rotatedX = x * cos - y * sin;
      const rotatedY = x * sin + y * cos;

      return {
        x: rotatedX + cx,
        y: rotatedY + cy,
      };
    });
  }
}
