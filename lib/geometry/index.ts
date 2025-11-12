/**
 * Geometry module exports.
 *
 * This module contains geometric shape primitives including:
 * - {@link Side}: Generic side/edge with inward and outward normals
 * - {@link Triangle}: Triangular shapes with various configurations
 * - {@link Circle}: Circular shapes with radius or diameter
 * - {@link Rectangle}: Rectangular shapes with rounded corners and squircle support
 * - {@link Square}: Square shapes (specialized rectangles)
 *
 * @module geometry
 */

export { Side } from "./Side.js";
export type { SideConfig } from "./Side.js";

export { Triangle } from "./Triangle.js";
export type { TriangleConfig, TriangleSide } from "./Triangle.js";

export { Circle } from "./Circle.js";
export type { CircleConfig } from "./Circle.js";

export { Rectangle } from "./Rectangle.js";
export type {
  RectangleConfig,
  RectangleSide,
  CornerStyle,
} from "./Rectangle.js";

export { Square } from "./Square.js";
export type { SquareConfig } from "./Square.js";
