/**
 * MathJax rendering constants
 *
 * These values are used when configuring MathJax to render LaTeX formulas.
 * They ensure consistent typography and layout across all LaTeX-enabled components.
 */

/**
 * The ratio of ex units to em units.
 *
 * In typography, an "ex" is traditionally the height of the lowercase letter 'x',
 * which is typically about half the em size (the font size).
 *
 * This is used by MathJax to calculate proper vertical metrics for formulas.
 */
export const MATHJAX_EX_TO_EM_RATIO = 0.4;

/**
 * Container width multiplier for MathJax rendering.
 *
 * MathJax needs to know the container width for proper formula layout.
 * We provide a large container (80 × fontSize) to prevent unwanted line wrapping
 * and ensure formulas render on a single line when possible.
 *
 * For example, with fontSize=16px, this creates a 1280px virtual container.
 */
export const MATHJAX_CONTAINER_WIDTH_MULTIPLIER = 80;

/**
 * MathJax uses 1000 units per em in its internal coordinate system.
 * This constant is used to convert from MathJax viewBox units to pixels.
 */
export const MATHJAX_UNITS_PER_EM = 1000;
