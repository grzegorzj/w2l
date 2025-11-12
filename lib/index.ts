/**
 * W2L - Write to Layout
 * 
 * An imperative library for LLM-driven structured image generation.
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

// Core exports
export { Artboard, Shape } from "./core/index.js";
export type { Point, Size, ArtboardConfig, PositionReference, RotateConfig, TranslateConfig } from "./core/index.js";

// Geometry exports
export { Triangle } from "./geometry/index.js";
export type { TriangleConfig, TriangleSide } from "./geometry/index.js";

