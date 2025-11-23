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
  type CrossAxisAlignment,
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
  type NewArtboardConfig,
  type NewCircleConfig,
  type NewRectConfig,
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

