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
  Quadrilateral,
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
  type QuadrilateralConfig,
  type QuadrilateralType,
  type QuadrilateralSide,
  type LineConfig,
  type LineLabelConfig,
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
  type ShadedRegion,
  type SideConfig,
  type SideLabelConfig,
  type ImageConfig,
  type BezierCurveConfig,
} from "./elements/index.js";

// Components
export {
  Arrow,
  Angle,
  BarChart,
  Bar,
  DonutChart,
  DonutSlice,
  LineChart,
  DataPoint,
  type ArrowConfig,
  type AngleConfig,
  type BarChartConfig,
  type BarDataPoint,
  type BarChartRemarkablePoint,
  type BarChartRemarkablePointType,
  type DonutChartConfig,
  type DonutDataPoint,
  type DonutChartRemarkablePoint,
  type DonutChartRemarkablePointType,
  type LineChartConfig,
  type LineSeries,
  type LineDataPoint,
  type LineChartRemarkablePoint,
  type LineChartRemarkablePointType,
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

