/**
 * New layout system exports
 */

// Core base classes
export { NewElement, NewShape, NewRectangle, type Position, type PositionConfig } from "./core/index.js";

// Layout containers
export {
  NewContainer,
  type NewContainerConfig,
  type ContainerDirection,
  type HorizontalAlignment,
  type VerticalAlignment,
  type SizeMode,
  Grid,
  type GridConfig,
  type GridCell,
  Columns,
  type ColumnsConfig,
  type ColumnContainer,
} from "./layout/index.js";

// Elements
export {
  NewArtboard,
  NewCircle,
  NewRect,
  NewSquare,
  NewTriangle,
  NewLine,
  NewRegularPolygon,
  NewText,
  NewLatex,
  NewFunctionGraph,
  NewSide,
  type NewArtboardConfig,
  type NewCircleConfig,
  type NewRectConfig,
  type NewSquareConfig,
  type NewTriangleConfig,
  type TriangleType,
  type TriangleOrientation,
  type TriangleSide,
  type NewLineConfig,
  type NewRegularPolygonConfig,
  type NewTextConfig,
  type NewLatexConfig,
  type NewAnnotatedTextElement,
  type NewAnnotatedLatexElement,
  type NewFunctionGraphConfig,
  type PlottedFunction,
  type RemarkablePoint,
  type RemarkablePointType,
  type GraphAxis,
  type NewSideConfig,
} from "./elements/index.js";

// Utils
export {
  BoxAccessor,
  type BoxModel,
  type ParsedBoxModel,
  type BoxReference,
  parseBoxValue,
  parseBoxModel,
} from "./utils/index.js";

