/**
 * Geometry module exports.
 *
 * This module contains geometric shape primitives including:
 * - {@link Side}: Generic side/edge with inward and outward normals
 * - {@link Line}: Line connecting two points
 * - {@link Triangle}: Triangular shapes with various configurations
 * - {@link Circle}: Circular shapes with radius or diameter
 * - {@link Rectangle}: Rectangular shapes with rounded corners and squircle support
 * - {@link Square}: Square shapes (specialized rectangles)
 * - {@link RegularPolygon}: Regular polygons (pentagon, hexagon, octagon, etc.)
 * - {@link Text}: Text elements with word wrapping and typography support
 * - {@link LatexText}: LaTeX/mathematical notation rendering with measurement support
 * - {@link MixedText}: Text with embedded LaTeX formulas
 * - {@link Image}: Raster image elements (PNG, JPG, etc.)
 * - {@link BezierCurve}: Quadratic and cubic bezier curves for smooth paths
 *
 * @module geometry
 */

export { Side } from "./Side.js";
export type { SideConfig } from "./Side.js";

export { Line } from "./Line.js";
export type { LineConfig } from "./Line.js";

export { Triangle } from "./Triangle.js";
export type { TriangleConfig, TriangleSide } from "./Triangle.js";

export { Circle } from "./Circle.js";
export type { CircleConfig } from "./Circle.js";

export { Rectangle } from "./Rectangle.js";
export type {
  RectangleSize,
  RectangleConfig,
  RectangleSide,
  CornerStyle,
} from "./Rectangle.js";

export { Square } from "./Square.js";
export type { SquareConfig } from "./Square.js";

export { RegularPolygon } from "./RegularPolygon.js";
export type { RegularPolygonConfig, PolygonSide } from "./RegularPolygon.js";

export { Text } from "./Text.js";
export type {
  TextConfig,
  TextAlign,
  TextVerticalAlign,
  WordBoundingBox,
  TextMatch,
} from "./Text.js";

export { LatexText } from "./LatexText.js";
export type {
  LatexTextConfig,
  LatexPartBoundingBox,
  LatexMatch,
  AnnotatedLatexElement,
} from "./LatexText.js";

export { MixedText } from "./MixedText.js";
export type {
  MixedTextConfig,
  MixedTextPartBoundingBox,
  MixedTextMatch,
  AnnotatedMixedElement,
} from "./MixedText.js";

export { Image } from "./Image.js";
export type { ImageConfig } from "./Image.js";

export { BezierCurve } from "./BezierCurve.js";
export type { BezierCurveConfig } from "./BezierCurve.js";
