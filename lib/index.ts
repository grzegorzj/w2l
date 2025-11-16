/**
 * W2L - Write to Layout
 *
 * An imperative library for LLM-driven structured image generation.
 *
 *
 * ## Overview
 *
 * W2L provides a high-level, declarative API for creating structured visual compositions
 * such as infographics, diagrams, graphs, and posters. It's specifically designed to be
 * easy for Large Language Models (LLMs) to use, allowing them to express visual intent
 * without dealing with low-level SVG geometry.
 *
 * ## Core Concepts
 *
 * ### Artboard
 * The {@link Artboard} is the canvas where all visual elements are placed. It defines
 * the coordinate system and boundaries for your composition.
 *
 * ### Shapes
 * All visual elements inherit from the {@link Shape} base class, which provides
 * positioning, rotation, and translation capabilities.
 *
 * ### Positioning
 * The library uses a relative positioning system where elements can be positioned
 * relative to other elements or to reference points, making it intuitive to create
 * aligned and structured layouts.
 *
 * ## Quick Start
 *
 * ```typescript
 * import { Artboard, Triangle } from 'w2l';
 *
 * // Create an artboard
 * const artboard = new Artboard({
 *   size: { width: 800, height: 600 },
 *   padding: "20px"
 * });
 *
 * // Create a triangle
 * const triangle = new Triangle({
 *   type: "right",
 *   a: 300,
 *   b: 400
 * });
 *
 * // Position it at the center
 * triangle.position({
 *   relativeFrom: triangle.center,
 *   relativeTo: artboard.center,
 *   x: 0,
 *   y: 0
 * });
 * ```
 *
 * ## Philosophy
 *
 * This library is built on the principle that LLMs should express *what* should appear
 * on screen and *where* it should be positioned, rather than dealing with precise
 * geometric calculations. The library handles the mathematics while providing an
 * intuitive API for spatial reasoning.
 *
 * @packageDocumentation
 */

/**
 * Core classes and utilities
 * @category API Reference
 */
export {
  Artboard,
  Element,
  Bounded,
  Shape,
  styleToSVGAttributes,
} from "./core/index.js";

/**
 * Core types and interfaces
 * @category API Reference
 */
export type {
  Point,
  ArtboardConfig,
  PositionReference,
  RotateConfig,
  TranslateConfig,
  Spacing,
  ParsedSpacing,
  Style,
  Stylable,
} from "./core/index.js";

/**
 * Geometric shapes
 * @category API Reference
 */
export {
  Side,
  Line,
  Triangle,
  Circle,
  Rectangle,
  Square,
  RegularPolygon,
  Text,
  LatexText,
  MixedText,
} from "./geometry/index.js";

/**
 * Geometry types and interfaces
 * @category API Reference
 */
export type {
  RectangleSize,
  SideConfig,
  LineConfig,
  TriangleConfig,
  TriangleSide,
  CircleConfig,
  RectangleConfig,
  RectangleSide,
  CornerStyle,
  SquareConfig,
  RegularPolygonConfig,
  PolygonSide,
  TextConfig,
  TextAlign,
  TextVerticalAlign,
  WordBoundingBox,
  LatexTextConfig,
  LatexPartBoundingBox,
  MixedTextConfig,
  MixedTextPartBoundingBox,
} from "./geometry/index.js";

/**
 * Layout and container classes
 * @category API Reference
 */
export { Container, Layout, ColumnsLayout, Column } from "./layout/index.js";

/**
 * Layout types and interfaces
 * @category API Reference
 */
export type {
  ContainerConfig,
  LayoutConfig,
  ColumnsLayoutConfig,
} from "./layout/index.js";
