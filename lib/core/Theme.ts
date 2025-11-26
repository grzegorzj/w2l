/**
 * Theme system for consistent styling across elements.
 * 
 * Provides a centralized theming system that can be applied to various
 * components in the library. Themes control colors, strokes, borders,
 * typography, and other visual properties.
 */

import { type Style } from "./Stylable.js";

/**
 * Theme configuration for styling elements consistently.
 */
export interface Theme {
  /**
   * Theme name identifier.
   */
  name: string;

  /**
   * Background colors for various contexts.
   */
  colors: {
    /** Primary background color */
    background: string;
    /** Primary foreground/text color */
    foreground: string;
    /** Accent color for highlights */
    accent: string;
    /** Muted/secondary color */
    muted: string;
    /** Border color */
    border: string;
  };

  /**
   * Typography settings.
   */
  typography: {
    /** Default font family */
    fontFamily: string;
    /** Base font size in pixels */
    fontSize: number;
    /** Font weight */
    fontWeight: string | number;
  };

  /**
   * Spacing and sizing.
   */
  spacing: {
    /** Small spacing unit */
    small: number;
    /** Medium spacing unit */
    medium: number;
    /** Large spacing unit */
    large: number;
  };

  /**
   * Border styles.
   */
  borders: {
    /** Border width */
    width: number;
    /** Border radius */
    radius: number;
    /** Border style (solid, dashed, etc.) */
    style: string;
  };

  /**
   * Shadow and depth.
   */
  shadows: {
    /** Light shadow for subtle depth */
    light: string;
    /** Medium shadow for moderate depth */
    medium: string;
    /** Heavy shadow for strong depth */
    heavy: string;
  };

  /**
   * Predefined styles for common use cases.
   */
  presets: {
    /** Style for primary boxes/containers */
    box: Partial<Style>;
    /** Style for text elements */
    text: Partial<Style>;
    /** Style for connectors/lines */
    connector: Partial<Style>;
    /** Style for accented elements */
    accent: Partial<Style>;
  };
}

/**
 * Default Swiss Design inspired theme.
 * 
 * Features:
 * - High contrast black and white base
 * - Minimal decorative elements
 * - Double borders for emphasis
 * - Clean, geometric aesthetics
 * - Single accent color for highlights
 */
export const SwissTheme: Theme = {
  name: "Swiss",
  
  colors: {
    background: "#FFFFFF",
    foreground: "#1A1A1A",
    accent: "#0066CC",
    muted: "#666666",
    border: "#2A2A2A",
  },

  typography: {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: 14,
    fontWeight: 400,
  },

  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },

  borders: {
    width: 1.5,
    radius: 0, // Sharp, geometric corners
    style: "solid",
  },

  shadows: {
    light: "0 1px 2px rgba(0,0,0,0.05)",
    medium: "0 2px 4px rgba(0,0,0,0.1)",
    heavy: "0 4px 8px rgba(0,0,0,0.15)",
  },

  presets: {
    box: {
      fill: "#FFFFFF",
      stroke: "#2A2A2A",
      strokeWidth: "1.5",
    },
    text: {
      fill: "#1A1A1A",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontSize: "14px",
      fontWeight: "400",
    },
    connector: {
      stroke: "#2A2A2A",
      strokeWidth: "1.5",
      fill: "none",
    },
    accent: {
      stroke: "#0066CC",
      strokeWidth: "2",
      fill: "#E6F2FF",
    },
  },
};

/**
 * Get a theme by name or use default.
 * 
 * @param name - Theme name (currently only 'swiss' is implemented)
 * @returns The requested theme
 */
export function getTheme(name: string = "swiss"): Theme {
  // For now, we only have one theme
  // In the future, we could add more themes here
  return SwissTheme;
}

/**
 * Create a custom theme by extending an existing theme.
 * 
 * @param baseTheme - The base theme to extend
 * @param overrides - Partial theme properties to override
 * @returns A new theme with the overrides applied
 */
export function createTheme(
  baseTheme: Theme,
  overrides: Partial<Theme>
): Theme {
  return {
    ...baseTheme,
    ...overrides,
    colors: { ...baseTheme.colors, ...overrides.colors },
    typography: { ...baseTheme.typography, ...overrides.typography },
    spacing: { ...baseTheme.spacing, ...overrides.spacing },
    borders: { ...baseTheme.borders, ...overrides.borders },
    shadows: { ...baseTheme.shadows, ...overrides.shadows },
    presets: {
      ...baseTheme.presets,
      ...overrides.presets,
      box: { ...baseTheme.presets.box, ...overrides.presets?.box },
      text: { ...baseTheme.presets.text, ...overrides.presets?.text },
      connector: { ...baseTheme.presets.connector, ...overrides.presets?.connector },
      accent: { ...baseTheme.presets.accent, ...overrides.presets?.accent },
    },
  };
}

/**
 * Default theme instance (Swiss design).
 */
export const defaultTheme = SwissTheme;

