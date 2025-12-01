/**
 * New layout system - Rect shape element
 */

import { Rectangle } from "../core/Rectangle.js";
import { styleToSVGAttributes, type Style } from "../core/Stylable.js";
import { type BoxModel } from "../utils/BoxModel.js";
import { Line } from "./Line.js";
import { Side } from "./Side.js";
import { type Position } from "../core/Element.js";
import { Angle } from "../components/Angle.js";
import { Text } from "./Text.js";

export interface RectConfig {
  width: number;
  height: number;
  style?: Partial<Style>;
  boxModel?: BoxModel;
}

/**
 * Diagonal information for a rectangle.
 */
export interface RectDiagonal {
  /** Starting corner of the diagonal */
  start: Position;
  /** Ending corner of the diagonal */
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
 * A rectangular shape element.
 * Basic primitive - no default styling.
 */
export class Rect extends Rectangle {
  constructor(config: RectConfig) {
    super(config.width, config.height, config.boxModel, config.style);
  }

  /**
   * Get the two diagonals of the rectangle.
   * Returns diagonal information including line objects ready to be drawn.
   * 
   * @returns Array of two diagonals: [topLeft→bottomRight, topRight→bottomLeft]
   * 
   * @example
   * Draw the diagonals of a rectangle
   * ```typescript
   * const rect = new Rect({ width: 100, height: 80 });
   * const diagonals = rect.getDiagonals();
   * artboard.add(rect);
   * diagonals.forEach(diag => artboard.add(diag.line));
   * ```
   */
  getDiagonals(): [RectDiagonal, RectDiagonal] {
    const tl = this.topLeft;
    const tr = this.topRight;
    const bl = this.bottomLeft;
    const br = this.bottomRight;
    
    const createDiagonal = (start: Position, end: Position): RectDiagonal => {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const center = {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
      };
      
      const lineStyle: Partial<Style> = { stroke: "#666", strokeWidth: "1", strokeDasharray: "4,4" };
      const line = new Line({
        start: { x: 0, y: 0 },
        end: { x: dx, y: dy },
        style: lineStyle,
      });
      
      line.position({
        relativeFrom: line.start,
        relativeTo: start,
        x: 0,
        y: 0,
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
      createDiagonal(tl, br), // Diagonal from top-left to bottom-right
      createDiagonal(tr, bl), // Diagonal from top-right to bottom-left
    ];
  }

  /**
   * Draw the diagonals of the rectangle.
   * Returns Line elements that can be added to the artboard.
   * 
   * @param style - Optional style for the diagonal lines
   * @returns Array of two Line elements representing the diagonals
   * 
   * @example
   * ```typescript
   * const rect = new Rect({ width: 100, height: 80 });
   * const diagonalLines = rect.drawDiagonals({ stroke: "blue", strokeWidth: 2 });
   * artboard.add(rect);
   * diagonalLines.forEach(line => artboard.add(line));
   * ```
   */
  drawDiagonals(style?: Partial<Style>): [Line, Line] {
    const diagonals = this.getDiagonals();
    const defaultStyle: Partial<Style> = { stroke: "#666", strokeWidth: "1", strokeDasharray: "4,4" };
    
    return diagonals.map(diag => {
      const line = new Line({
        start: { x: 0, y: 0 },
        end: { x: diag.end.x - diag.start.x, y: diag.end.y - diag.start.y },
        style: style ?? defaultStyle,
      });
      
      line.position({
        relativeFrom: line.start,
        relativeTo: diag.start,
        x: 0,
        y: 0,
      });
      
      return line;
    }) as [Line, Line];
  }

  /**
   * Creates an angle marker at a specific corner of the rectangle.
   * Since rectangles have 90° angles, this is useful for marking right angles.
   *
   * @param corner - Which corner: "topLeft", "topRight", "bottomRight", "bottomLeft"
   * @param options - Configuration for the angle marker
   * @returns Angle element
   *
   * @example
   * ```typescript
   * const rect = new Rect({ width: 100, height: 80 });
   * const angle = rect.showAngle("topLeft", { rightAngleMarker: "square" });
   * artboard.add(rect);
   * artboard.add(angle);
   * ```
   */
  showAngle(
    corner: "topLeft" | "topRight" | "bottomRight" | "bottomLeft",
    options?: {
      label?: string;
      radius?: number;
      style?: Partial<Style>;
      rightAngleMarker?: "square" | "dot" | "arc";
    }
  ): Angle {
    const tl = this.topLeft;
    const tr = this.topRight;
    const bl = this.bottomLeft;
    const br = this.bottomRight;
    
    let vertex: Position;
    let incomingEnd: Position;
    let outgoingEnd: Position;
    
    switch (corner) {
      case "topLeft":
        vertex = tl;
        incomingEnd = bl;
        outgoingEnd = tr;
        break;
      case "topRight":
        vertex = tr;
        incomingEnd = tl;
        outgoingEnd = br;
        break;
      case "bottomRight":
        vertex = br;
        incomingEnd = tr;
        outgoingEnd = bl;
        break;
      case "bottomLeft":
        vertex = bl;
        incomingEnd = br;
        outgoingEnd = tl;
        break;
    }
    
    const incomingSide = new Side({
      start: incomingEnd,
      end: vertex,
    });
    
    const outgoingSide = new Side({
      start: vertex,
      end: outgoingEnd,
    });
    
    return new Angle({
      from: "vertex",
      segments: [incomingSide, outgoingSide],
      mode: "internal",
      label: options?.label,
      radius: options?.radius,
      style: options?.style,
      rightAngleMarker: options?.rightAngleMarker ?? "square",
    });
  }

  /**
   * Creates angle markers for all four corners of the rectangle.
   * Since rectangles have 90° angles at all corners, this is useful for marking right angles.
   *
   * @param options - Configuration for the angle markers
   * @returns Array of four Angle elements
   *
   * @example
   * ```typescript
   * const rect = new Rect({ width: 100, height: 80 });
   * const angles = rect.showAngles({ rightAngleMarker: "square" });
   * artboard.add(rect);
   * angles.forEach(angle => artboard.add(angle));
   * ```
   */
  showAngles(options?: {
    labels?: [string?, string?, string?, string?];
    radius?: number;
    style?: Partial<Style>;
    rightAngleMarker?: "square" | "dot" | "arc";
  }): [Angle, Angle, Angle, Angle] {
    const labels = options?.labels ?? [undefined, undefined, undefined, undefined];
    
    return [
      this.showAngle("topLeft", { ...options, label: labels[0] }),
      this.showAngle("topRight", { ...options, label: labels[1] }),
      this.showAngle("bottomRight", { ...options, label: labels[2] }),
      this.showAngle("bottomLeft", { ...options, label: labels[3] }),
    ];
  }

  /**
   * Creates labels for the rectangle's sides.
   *
   * @param labels - Array of 4 label strings (top, right, bottom, left), or undefined to use defaults
   * @param offset - Distance from the side (in pixels). Defaults to 20
   * @param fontSize - Font size for the labels. Defaults to 16
   * @returns Array of four Text elements
   *
   * @example
   * ```typescript
   * const rect = new Rect({ width: 100, height: 80 });
   * const labels = rect.createSideLabels(["$a$", "$b$", "$a$", "$b$"]);
   * artboard.add(rect);
   * labels.forEach(label => artboard.add(label));
   * ```
   */
  createSideLabels(
    labels?: [string, string, string, string],
    offset: number = 20,
    fontSize: number = 16
  ): [Text, Text, Text, Text] {
    const defaultLabels: [string, string, string, string] = ["$a$", "$b$", "$a$", "$b$"];
    const labelTexts = labels ?? defaultLabels;

    const tl = this.topLeft;
    const tr = this.topRight;
    const bl = this.bottomLeft;
    const br = this.bottomRight;

    // Create Side objects for each edge
    const topSide = new Side({ start: tl, end: tr });
    const rightSide = new Side({ start: tr, end: br });
    const bottomSide = new Side({ start: br, end: bl });
    const leftSide = new Side({ start: bl, end: tl });

    return [
      topSide.createLabel(labelTexts[0], { offset, fontSize }),
      rightSide.createLabel(labelTexts[1], { offset, fontSize }),
      bottomSide.createLabel(labelTexts[2], { offset, fontSize }),
      leftSide.createLabel(labelTexts[3], { offset, fontSize }),
    ];
  }

  /**
   * Creates labels for the rectangle's corners.
   *
   * @param labels - Array of 4 label strings (topLeft, topRight, bottomRight, bottomLeft), or undefined to use defaults
   * @param offset - Distance from corner (in pixels). Defaults to 25
   * @param fontSize - Font size for the labels. Defaults to 16
   * @returns Array of four Text elements
   *
   * @example
   * ```typescript
   * const rect = new Rect({ width: 100, height: 80 });
   * const labels = rect.createCornerLabels(["$A$", "$B$", "$C$", "$D$"]);
   * artboard.add(rect);
   * labels.forEach(label => artboard.add(label));
   * ```
   */
  createCornerLabels(
    labels?: [string, string, string, string],
    offset: number = 25,
    fontSize: number = 16
  ): [Text, Text, Text, Text] {
    const defaultLabels: [string, string, string, string] = ["$A$", "$B$", "$C$", "$D$"];
    const labelTexts = labels ?? defaultLabels;

    const tl = this.topLeft;
    const tr = this.topRight;
    const bl = this.bottomLeft;
    const br = this.bottomRight;
    const center = this.center;

    const createCornerLabel = (corner: Position, labelText: string): Text => {
      const dx = corner.x - center.x;
      const dy = corner.y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const normalX = (dx / dist) * offset;
      const normalY = (dy / dist) * offset;

      const label = new Text({
        content: labelText,
        fontSize,
      });

      // Mark label to escape container layout - it's positioned based on global geometry
      (label as any).markEscapeContainerLayout();

      const targetX = corner.x + normalX;
      const targetY = corner.y + normalY;

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
      createCornerLabel(tl, labelTexts[0]),
      createCornerLabel(tr, labelTexts[1]),
      createCornerLabel(br, labelTexts[2]),
      createCornerLabel(bl, labelTexts[3]),
    ];
  }

  render(): string {
    const attrs = styleToSVGAttributes(this._style);
    const pos = this.getPositionForBox("border");
    const size = this.getBoxSize("border");
    const transform = this.getTransformAttribute();
    
    const childrenHTML = this.children
      .map((child) => child.render())
      .join("\n  ");
    
    const rectTag = `<rect x="${pos.x}" y="${pos.y}" width="${size.width}" height="${size.height}" ${attrs} ${transform}/>`;
    
    if (childrenHTML) {
      return `<g>
  ${rectTag}
  ${childrenHTML}
</g>`;
    }
    
    return rectTag;
  }
}

