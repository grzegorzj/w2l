/**
 * New layout system exports
 */

// Core base classes
export { Element, Shape, Rectangle, type Position, type PositionConfig } from "./core/index.js";

// Layout containers
export {
  Container,
  type ContainerConfig,
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
  Artboard,
  Circle,
  Rect,
  Square,
  Triangle,
  Line,
  RegularPolygon,
  Text,
  Latex,
  FunctionGraph,
  Side,
  Image,
  BezierCurve,
  type ArtboardConfig,
  type CircleConfig,
  type RectConfig,
  type SquareConfig,
  type TriangleConfig,
  type TriangleType,
  type TriangleOrientation,
  type TriangleSide,
  type LineConfig,
  type RegularPolygonConfig,
  type TextConfig,
  type LatexConfig,
  type AnnotatedTextElement,
  type AnnotatedLatexElement,
  type FunctionGraphConfig,
  type PlottedFunction,
  type RemarkablePoint,
  type RemarkablePointType,
  type GraphAxis,
  type SideConfig,
  type ImageConfig,
  type BezierCurveConfig,
} from "./elements/index.js";

// Components
export {
  Arrow,
  type ArrowConfig,
} from "./components/index.js";

// Utils
export {
  BoxAccessor,
  type BoxModel,
  type ParsedBoxModel,
  type BoxReference,
  parseBoxValue,
  parseBoxModel,
} from "./utils/index.js";

