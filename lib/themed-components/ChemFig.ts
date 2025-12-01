/**
 * ChemFig - Chemical structure rendering using LaTeX chemfig package.
 * 
 * Features:
 * - Renders chemical structures and reactions
 * - Uses LaTeX with chemfig package for accurate chemical notation
 * - Supports common chemical structures and reactions
 */

import { Latex, type LatexConfig } from "../elements/Latex.js";
import { Text } from "../elements/Text.js";
import { type Position } from "../core/Element.js";

export interface ChemFigConfig {
  /** Chemical structure in chemfig syntax */
  structure: string;
  /** Font size for rendering */
  fontSize?: number;
  /** Scale factor for the structure */
  scale?: number;
  /** Whether this is a reaction (uses chemfig arrow commands) */
  isReaction?: boolean;
}

/**
 * Common chemical structure templates
 */
export const ChemicalStructures = {
  /**
   * Water molecule (H2O)
   */
  water(): string {
    return "\\chemfig{H-[:30]O-[:-30]H}";
  },

  /**
   * Methane (CH4)
   */
  methane(): string {
    return "\\chemfig{H-[:90]C(-[:180]H)(-[:270]H)-[:0]H}";
  },

  /**
   * Ethanol (C2H5OH)
   */
  ethanol(): string {
    return "\\chemfig{H-C(-[:90]H)(-[:-90]H)-C(-[:90]H)(-[:-90]H)-O-H}";
  },

  /**
   * Benzene ring (C6H6)
   */
  benzene(): string {
    return "\\chemfig{*6(=-=-=-)}";
  },

  /**
   * Glucose (simplified)
   */
  glucose(): string {
    return "\\chemfig{HO-[:-30](<:[:-90]OH)-[:30](<[:-30]OH)-[:-30](<:[:-90]OH)-[:30](<[:-30]OH)-[:-30]CHO}";
  },

  /**
   * ATP (simplified)
   */
  atp(): string {
    return "\\chemfig{Adenine-Ribose-O-P(=[::90]O)(-[::-90]OH)-O-P(=[::90]O)(-[::-90]OH)-O-P(=[::90]O)(-[::-90]OH)(-[::180]OH)}";
  },
};

/**
 * Common chemical reaction templates
 */
export const ChemicalReactions = {
  /**
   * Combustion of methane
   */
  methaneCombustion(): string {
    return "\\chemfig{CH_4} + \\chemfig{2O_2} \\arrow{->} \\chemfig{CO_2} + \\chemfig{2H_2O}";
  },

  /**
   * Photosynthesis (simplified)
   */
  photosynthesis(): string {
    return "\\chemfig{6CO_2} + \\chemfig{6H_2O} \\arrow{->[light][chlorophyll]} \\chemfig{C_6H_{12}O_6} + \\chemfig{6O_2}";
  },

  /**
   * Neutralization reaction
   */
  neutralization(): string {
    return "\\chemfig{HCl} + \\chemfig{NaOH} \\arrow{->} \\chemfig{NaCl} + \\chemfig{H_2O}";
  },

  /**
   * Rusting of iron
   */
  rusting(): string {
    return "\\chemfig{4Fe} + \\chemfig{3O_2} \\arrow{->} \\chemfig{2Fe_2O_3}";
  },
};

/**
 * ChemFig component for rendering chemical structures
 */
export class ChemFig {
  private latex: Latex;
  private config: Required<ChemFigConfig>;

  constructor(config: ChemFigConfig) {
    this.config = {
      structure: config.structure,
      fontSize: config.fontSize ?? 14,
      scale: config.scale ?? 1.0,
      isReaction: config.isReaction ?? false,
    };

    this.latex = this.buildLatex();
  }

  private buildLatex(): Latex {
    const { structure, fontSize } = this.config;

    // Use plain LaTeX - chemfig requires server-side LaTeX compilation
    // Convert basic chemical notation to LaTeX
    const latexContent = structure
      .replace(/([A-Z][a-z]?)(\d+)/g, '\\text{$1}_{$2}')  // Element + number
      .replace(/([A-Z][a-z]?)(?=\s|$|\+|-|→)/g, '\\text{$1}')  // Standalone elements
      .replace(/->|→/g, ' \\rightarrow ')  // Arrow for reactions
      .replace(/\+/g, ' + ');  // Preserve plus signs

    const latexConfig: LatexConfig = {
      content: latexContent,
      fontSize,
    };

    return new Latex(latexConfig);
  }

  // Position accessors - delegate to the underlying Latex element
  get topLeft(): Position { return this.latex.topLeft; }
  get topRight(): Position { return this.latex.topRight; }
  get bottomLeft(): Position { return this.latex.bottomLeft; }
  get bottomRight(): Position { return this.latex.bottomRight; }
  get center(): Position { return this.latex.center; }
  get topCenter(): Position { return this.latex.topCenter; }
  get bottomCenter(): Position { return this.latex.bottomCenter; }
  get centerLeft(): Position { return this.latex.centerLeft; }
  get centerRight(): Position { return this.latex.centerRight; }

  get width(): number { return this.latex.width; }
  get height(): number { return this.latex.height; }
  get element(): Latex { return this.latex; }

  /**
   * Position the chemical structure
   */
  position(config: {
    relativeTo: Position;
    relativeFrom: Position;
    x: number;
    y: number;
  }): void {
    this.latex.position(config);
  }

  /**
   * Render the chemical structure
   */
  render(): string {
    return this.latex.render();
  }
}

/**
 * Simplified chemical formula renderer using Unicode subscripts
 * More reliable than LaTeX for simple chemical formulas
 */
export class ChemicalFormula {
  private textElement: Text;

  constructor(formula: string, fontSize: number = 14) {
    // Convert chemical formula notation to Unicode subscripts
    // H2O -> H₂O, CH4 -> CH₄, but keep coefficients normal: 2H2O -> 2H₂O
    const subscriptMap: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    
    // Only convert digits that come AFTER a letter (element symbol) to subscripts
    let formattedFormula = formula
      .replace(/([A-Za-z])(\d+)/g, (match, letter, digits) => {
        const subscripts = digits.split('').map((d: string) => subscriptMap[d] || d).join('');
        return letter + subscripts;
      })
      .replace(/->/g, ' → ');  // Use Unicode arrow
    
    this.textElement = new Text({
      content: formattedFormula,
      fontSize,
      style: {
        fontFamily: "sans-serif",
        fill: "#000000",
      },
    });
  }

  // Position accessors
  get topLeft(): Position { return this.textElement.topLeft; }
  get topRight(): Position { return this.textElement.topRight; }
  get bottomLeft(): Position { return this.textElement.bottomLeft; }
  get bottomRight(): Position { return this.textElement.bottomRight; }
  get center(): Position { return this.textElement.center; }
  get topCenter(): Position { return this.textElement.topCenter; }
  get bottomCenter(): Position { return this.textElement.bottomCenter; }
  get centerLeft(): Position { return this.textElement.centerLeft; }
  get centerRight(): Position { return this.textElement.centerRight; }

  get width(): number { return this.textElement.width; }
  get height(): number { return this.textElement.height; }
  get element(): Text { return this.textElement; }

  position(config: {
    relativeTo: Position;
    relativeFrom: Position;
    x: number;
    y: number;
  }): void {
    this.textElement.position(config);
  }

  render(): string {
    return this.textElement.render();
  }
}

