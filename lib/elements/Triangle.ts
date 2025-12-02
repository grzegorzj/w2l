/**
 * New layout system - Triangle
 * A triangle shape with various types (right, equilateral, isosceles)
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
 * Altitude information for a side of a triangle.
 */
export interface TriangleAltitude {
  /** The foot of the altitude (where it meets the side) */
  foot: Position;
  /** The opposite vertex (where the altitude originates) */
  vertex: Position;
  /** Length of the altitude */
  height: number;
  /** Line object representing the altitude (ready to add to artboard) */
  line: Line;
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
  /** Altitude from the opposite vertex to this side */
  altitude: TriangleAltitude;
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
  get absoluteVertices(): [Position, Position, Position] {
    const absPos = this.getAbsolutePosition();
    return [
      { x: absPos.x + this.vertices[0].x, y: absPos.y + this.vertices[0].y },
      { x: absPos.x + this.vertices[1].x, y: absPos.y + this.vertices[1].y },
      { x: absPos.x + this.vertices[2].x, y: absPos.y + this.vertices[2].y },
    ];
  }

  /**
   * Get the internal angle at a specific vertex (in degrees).
   *
   * @param vertexIndex - Index of the vertex (0-2)
   * @returns Internal angle in degrees
   */
  getInternalAngleAt(vertexIndex: number): number {
    const sides = this.sides;
    const prevSide = sides[(vertexIndex + 2) % 3]; // Previous side
    const nextSide = sides[vertexIndex]; // Current side

    // Calculate angle between the two sides
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
   * @param vertexIndex - Index of the vertex (0-2)
   * @returns External angle in degrees
   */
  getExternalAngleAt(vertexIndex: number): number {
    return 360 - this.getInternalAngleAt(vertexIndex);
  }

  /**
   * Get angle information for drawing an angle marker at a vertex.
   *
   * @param vertexIndex - Index of the vertex (0-2)
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
    const prevSide = sides[(vertexIndex + 2) % 3];

    if (external) {
      // External angle: extends from the previous side outward
      const angleDegrees = this.getExternalAngleAt(vertexIndex);
      return {
        vertex: verts[vertexIndex],
        startAngle: prevSide.angle + 180,
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
   * Get the three sides of the triangle with their geometric properties.
   * Each side includes length, center, angle, endpoints, normals, direction, and altitude.
   *
   * Sides are returned in counter-clockwise order (see CONVENTIONS.md).
   *
   * @returns Array of three triangle sides with full geometric properties including altitudes
   *
   * @example
   * Position elements along triangle sides
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * triangle.sides.forEach((side, index) => {
   *   console.log(`Side ${index}: length=${side.length}, angle=${side.angle}°`);
   *   // Use side.outwardNormal to position elements outside the triangle
   *   // Use side.inwardNormal to position elements inside the triangle
   *   // Draw the altitude
   *   artboard.add(side.altitude.line);
   * });
   * ```
   */
  get sides(): [TriangleSide, TriangleSide, TriangleSide] {
    const verts = this.absoluteVertices;

    // Helper to calculate altitude from a vertex to a side
    const calculateAltitude = (vertex: Position, sideStart: Position, sideEnd: Position): TriangleAltitude => {
      // Calculate perpendicular projection of vertex onto the side
      const dx = sideEnd.x - sideStart.x;
      const dy = sideEnd.y - sideStart.y;
      const t = ((vertex.x - sideStart.x) * dx + (vertex.y - sideStart.y) * dy) / (dx * dx + dy * dy);
      
      const foot: Position = {
        x: sideStart.x + t * dx,
        y: sideStart.y + t * dy
      };
      
      // Calculate altitude height
      const height = Math.sqrt(
        (vertex.x - foot.x) ** 2 + (vertex.y - foot.y) ** 2
      );
      
      // Create a transparent dummy line (actual altitude lines should be created via getAltitudes())
      const altitudeLine = new Line({
        start: vertex,
        end: foot,
        style: { stroke: "transparent" }
      });
      
      return {
        foot,
        vertex,
        height,
        line: altitudeLine
      };
    };

    const createSide = (start: Position, end: Position, oppositeVertex: Position): TriangleSide => {
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
        altitude: calculateAltitude(oppositeVertex, start, end),
      };
    };

    // Create sides in counter-clockwise order: v0→v1, v1→v2, v2→v0
    // Each side's altitude comes from the opposite vertex
    return [
      createSide(verts[0], verts[1], verts[2]), // Side 0: v0→v1, altitude from v2
      createSide(verts[1], verts[2], verts[0]), // Side 1: v1→v2, altitude from v0
      createSide(verts[2], verts[0], verts[1]), // Side 2: v2→v0, altitude from v1
    ];
  }


  /**
   * Get the three sides of the triangle as Line objects.
   * Useful for creating angle annotations with the Angle component's line-based API.
   *
   * @returns Array of three Line objects representing the triangle's sides
   *
   * @example
   * Create angle annotations using line-based API
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * const [line0, line1, line2] = triangle.getSideLines();
   *
   * // Create an angle at vertex 0 (between line2 and line0)
   * const angle = new Angle({
   *   line1: line2,
   *   line2: line0,
   *   angleType: 'smaller',
   *   label: "$\\alpha$",
   * });
   * ```
   */
  getSideLines(): [Line, Line, Line] {
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
    ];
  }

  /**
   * Get the three altitudes of the triangle.
   * Returns altitude information including line objects ready to be drawn.
   * 
   * @returns Array of three altitudes with positioning information
   * 
   * @example
   * Draw the altitudes of a triangle
   * ```typescript
   * const triangle = new Triangle({ type: "equilateral", a: 100 });
   * const altitudes = triangle.getAltitudes();
   * artboard.add(triangle);
   * altitudes.forEach(alt => artboard.add(alt.line));
   * ```
   */
  getAltitudes(): [TriangleAltitude, TriangleAltitude, TriangleAltitude] {
    const verts = this.absoluteVertices;
    
    // Helper to calculate altitude from a vertex to a side
    const calculateAltitude = (vertex: Position, sideStart: Position, sideEnd: Position): TriangleAltitude => {
      // Calculate perpendicular projection of vertex onto the side
      const dx = sideEnd.x - sideStart.x;
      const dy = sideEnd.y - sideStart.y;
      const t = ((vertex.x - sideStart.x) * dx + (vertex.y - sideStart.y) * dy) / (dx * dx + dy * dy);
      
      const foot: Position = {
        x: sideStart.x + t * dx,
        y: sideStart.y + t * dy
      };
      
      // Calculate altitude height
      const height = Math.sqrt(
        (vertex.x - foot.x) ** 2 + (vertex.y - foot.y) ** 2
      );
      
      // DEBUG: Create circles at vertex and foot
      const vertexCircle = new Circle({
        radius: 5,
        style: { fill: "red", stroke: "darkred", strokeWidth: "2" }
      });
      vertexCircle.position({
        relativeTo: vertex,
        relativeFrom: vertexCircle.center,
        x: 0,
        y: 0
      });
      this.addElement(vertexCircle);
      
      const footCircle = new Circle({
        radius: 5,
        style: { fill: "green", stroke: "darkgreen", strokeWidth: "2" }
      });
      footCircle.position({
        relativeTo: foot,
        relativeFrom: footCircle.center,
        x: 0,
        y: 0
      });
      this.addElement(footCircle);
      
      const altStyle: Partial<Style> = { stroke: "#666", strokeWidth: "1", strokeDasharray: "4,4" };
      const altitudeLine = new Line({
        start: vertex,
        end: foot,
        style: altStyle
      });
      
      return {
        foot,
        vertex,
        height,
        line: altitudeLine
      };
    };
    
    // Return altitudes for each side: altitude from opposite vertex to each side
    return [
      calculateAltitude(verts[2], verts[0], verts[1]), // Altitude from vertex 2 to side 0-1
      calculateAltitude(verts[0], verts[1], verts[2]), // Altitude from vertex 0 to side 1-2
      calculateAltitude(verts[1], verts[2], verts[0]), // Altitude from vertex 1 to side 2-0
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
    ];
  }

  /**
   * Creates angle markers for a specific vertex of the triangle.
   *
   * @param vertexIndex - Index of the vertex (0-2)
   * @param options - Configuration for the angle marker
   * @param options.mode - 'internal' for internal angle, 'external' for external angle
   * @param options.label - Optional label for the angle (e.g., "α", "60°")
   * @param options.radius - Radius of the angle arc (default: 40)
   * @param options.style - SVG style for the angle marker
   * @returns Angle element
   *
   * @example
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * const angle = triangle.showAngle(0, { mode: 'internal', label: "90°" });
   * artboard.addElement(triangle);
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
    // sides[i] goes from vertex i to vertex (i+1)%3
    // So at vertex i:
    // - incoming side is sides[(i+2)%3] (from vertex (i+2)%3 to vertex i)
    // - outgoing side is sides[i] (from vertex i to vertex (i+1)%3)
    const incomingIdx = (vertexIndex + 2) % 3;
    const outgoingIdx = vertexIndex;
    
    // Create Side objects for the two segments meeting at this vertex
    const prevVertexIdx = (vertexIndex + 2) % 3;
    const nextVertexIdx = (vertexIndex + 1) % 3;
    
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
   * Creates angle markers for all three vertices of the triangle.
   *
   * Supports two API styles:
   * 1. Simple: Apply same configuration to all angles
   * 2. Per-angle: Configure each angle individually using A, B, C properties
   *
   * @param options - Configuration for the angle markers
   * @returns Array of three Angle elements
   *
   * @example
   * Simple API - same style for all angles
   * ```typescript
   * const triangle = new Triangle({ type: "right", a: 100, b: 100 });
   * const angles = triangle.showAngles({ 
   *   mode: 'internal', 
   *   labels: ["α", "β", "γ"],
   *   style: { stroke: "#ef4444" }
   * });
   * ```
   *
   * @example
   * Per-angle API - different style for each angle
   * ```typescript
   * const angles = triangle.showAngles({
   *   A: { color: "#ef4444", radius: 20, label: "60°" },
   *   B: { color: "#3b82f6", radius: 20, label: "60°" },
   *   C: { color: "#8b5cf6", radius: 20, label: "60°" },
   * });
   * ```
   */
  showAngles(options?: {
    mode?: "internal" | "external";
    labels?: [string?, string?, string?];
    radius?: number;
    style?: Partial<Style>;
    rightAngleMarker?: "square" | "dot" | "arc";
    // Per-angle configuration
    A?: { color?: string; radius?: number; label?: string; type?: "right" };
    B?: { color?: string; radius?: number; label?: string; type?: "right" };
    C?: { color?: string; radius?: number; label?: string; type?: "right" };
  }): [Angle, Angle, Angle] {
    const mode = options?.mode ?? "internal";
    
    // Check if using per-angle API (A, B, C properties)
    if (options?.A || options?.B || options?.C) {
      const createAngle = (vertexIndex: number, config?: { color?: string; radius?: number; label?: string; type?: "right" }) => {
        const style = config?.color ? { stroke: config.color } : options?.style;
        const rightMarker = config?.type === "right" ? "square" : options?.rightAngleMarker;
        
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
      ];
    }
    
    // Simple API - same configuration for all angles
    const labels = options?.labels ?? [undefined, undefined, undefined];
    
    return [
      this.showAngle(0, { ...options, label: labels[0] }),
      this.showAngle(1, { ...options, label: labels[1] }),
      this.showAngle(2, { ...options, label: labels[2] }),
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
