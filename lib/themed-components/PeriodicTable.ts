/**
 * PeriodicTable - A component for displaying the periodic table of elements.
 *
 * Features:
 * - Full periodic table layout (18 groups × 7 periods)
 * - Category-based coloring
 * - Selective highlighting and filtering
 * - Responsive sizing
 */

import { Container } from "../layout/Container.js";
import { Text } from "../elements/Text.js";
import {
  PeriodicElement,
  type ElementData,
  ElementCategory,
} from "./PeriodicElement.js";
import { type Position } from "../core/Element.js";
import { defaultTheme } from "../core/Theme.js";

export interface PeriodicTableConfig {
  /** Width of each element cell */
  cellWidth?: number;
  /** Height of each element cell */
  cellHeight?: number;
  /** Spacing between elements */
  spacing?: number;
  /** Elements to highlight (by atomic number) */
  highlightElements?: number[];
  /** Elements to select (by atomic number) */
  selectElements?: number[];
  /** Filter by category */
  filterCategory?: ElementCategory;
  /** Whether to show atomic mass */
  showMass?: boolean;
  /** Whether to include lanthanides and actinides */
  includeLanthanides?: boolean;
}

/**
 * Complete periodic table data (all 118 elements)
 */
const PERIODIC_DATA: ElementData[] = [
  // Period 1
  {
    number: 1,
    symbol: "H",
    name: "Hydrogen",
    mass: 1.008,
    category: ElementCategory.NONMETAL,
    group: 1,
    period: 1,
  },
  {
    number: 2,
    symbol: "He",
    name: "Helium",
    mass: 4.003,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 1,
  },

  // Period 2
  {
    number: 3,
    symbol: "Li",
    name: "Lithium",
    mass: 6.941,
    category: ElementCategory.ALKALI_METAL,
    group: 1,
    period: 2,
  },
  {
    number: 4,
    symbol: "Be",
    name: "Beryllium",
    mass: 9.012,
    category: ElementCategory.ALKALINE_EARTH,
    group: 2,
    period: 2,
  },
  {
    number: 5,
    symbol: "B",
    name: "Boron",
    mass: 10.811,
    category: ElementCategory.METALLOID,
    group: 13,
    period: 2,
  },
  {
    number: 6,
    symbol: "C",
    name: "Carbon",
    mass: 12.011,
    category: ElementCategory.NONMETAL,
    group: 14,
    period: 2,
  },
  {
    number: 7,
    symbol: "N",
    name: "Nitrogen",
    mass: 14.007,
    category: ElementCategory.NONMETAL,
    group: 15,
    period: 2,
  },
  {
    number: 8,
    symbol: "O",
    name: "Oxygen",
    mass: 15.999,
    category: ElementCategory.NONMETAL,
    group: 16,
    period: 2,
  },
  {
    number: 9,
    symbol: "F",
    name: "Fluorine",
    mass: 18.998,
    category: ElementCategory.HALOGEN,
    group: 17,
    period: 2,
  },
  {
    number: 10,
    symbol: "Ne",
    name: "Neon",
    mass: 20.18,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 2,
  },

  // Period 3
  {
    number: 11,
    symbol: "Na",
    name: "Sodium",
    mass: 22.99,
    category: ElementCategory.ALKALI_METAL,
    group: 1,
    period: 3,
  },
  {
    number: 12,
    symbol: "Mg",
    name: "Magnesium",
    mass: 24.305,
    category: ElementCategory.ALKALINE_EARTH,
    group: 2,
    period: 3,
  },
  {
    number: 13,
    symbol: "Al",
    name: "Aluminum",
    mass: 26.982,
    category: ElementCategory.POST_TRANSITION,
    group: 13,
    period: 3,
  },
  {
    number: 14,
    symbol: "Si",
    name: "Silicon",
    mass: 28.086,
    category: ElementCategory.METALLOID,
    group: 14,
    period: 3,
  },
  {
    number: 15,
    symbol: "P",
    name: "Phosphorus",
    mass: 30.974,
    category: ElementCategory.NONMETAL,
    group: 15,
    period: 3,
  },
  {
    number: 16,
    symbol: "S",
    name: "Sulfur",
    mass: 32.065,
    category: ElementCategory.NONMETAL,
    group: 16,
    period: 3,
  },
  {
    number: 17,
    symbol: "Cl",
    name: "Chlorine",
    mass: 35.453,
    category: ElementCategory.HALOGEN,
    group: 17,
    period: 3,
  },
  {
    number: 18,
    symbol: "Ar",
    name: "Argon",
    mass: 39.948,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 3,
  },

  // Period 4
  {
    number: 19,
    symbol: "K",
    name: "Potassium",
    mass: 39.098,
    category: ElementCategory.ALKALI_METAL,
    group: 1,
    period: 4,
  },
  {
    number: 20,
    symbol: "Ca",
    name: "Calcium",
    mass: 40.078,
    category: ElementCategory.ALKALINE_EARTH,
    group: 2,
    period: 4,
  },
  {
    number: 21,
    symbol: "Sc",
    name: "Scandium",
    mass: 44.956,
    category: ElementCategory.TRANSITION_METAL,
    group: 3,
    period: 4,
  },
  {
    number: 22,
    symbol: "Ti",
    name: "Titanium",
    mass: 47.867,
    category: ElementCategory.TRANSITION_METAL,
    group: 4,
    period: 4,
  },
  {
    number: 23,
    symbol: "V",
    name: "Vanadium",
    mass: 50.942,
    category: ElementCategory.TRANSITION_METAL,
    group: 5,
    period: 4,
  },
  {
    number: 24,
    symbol: "Cr",
    name: "Chromium",
    mass: 51.996,
    category: ElementCategory.TRANSITION_METAL,
    group: 6,
    period: 4,
  },
  {
    number: 25,
    symbol: "Mn",
    name: "Manganese",
    mass: 54.938,
    category: ElementCategory.TRANSITION_METAL,
    group: 7,
    period: 4,
  },
  {
    number: 26,
    symbol: "Fe",
    name: "Iron",
    mass: 55.845,
    category: ElementCategory.TRANSITION_METAL,
    group: 8,
    period: 4,
  },
  {
    number: 27,
    symbol: "Co",
    name: "Cobalt",
    mass: 58.933,
    category: ElementCategory.TRANSITION_METAL,
    group: 9,
    period: 4,
  },
  {
    number: 28,
    symbol: "Ni",
    name: "Nickel",
    mass: 58.693,
    category: ElementCategory.TRANSITION_METAL,
    group: 10,
    period: 4,
  },
  {
    number: 29,
    symbol: "Cu",
    name: "Copper",
    mass: 63.546,
    category: ElementCategory.TRANSITION_METAL,
    group: 11,
    period: 4,
  },
  {
    number: 30,
    symbol: "Zn",
    name: "Zinc",
    mass: 65.38,
    category: ElementCategory.TRANSITION_METAL,
    group: 12,
    period: 4,
  },
  {
    number: 31,
    symbol: "Ga",
    name: "Gallium",
    mass: 69.723,
    category: ElementCategory.POST_TRANSITION,
    group: 13,
    period: 4,
  },
  {
    number: 32,
    symbol: "Ge",
    name: "Germanium",
    mass: 72.63,
    category: ElementCategory.METALLOID,
    group: 14,
    period: 4,
  },
  {
    number: 33,
    symbol: "As",
    name: "Arsenic",
    mass: 74.922,
    category: ElementCategory.METALLOID,
    group: 15,
    period: 4,
  },
  {
    number: 34,
    symbol: "Se",
    name: "Selenium",
    mass: 78.971,
    category: ElementCategory.NONMETAL,
    group: 16,
    period: 4,
  },
  {
    number: 35,
    symbol: "Br",
    name: "Bromine",
    mass: 79.904,
    category: ElementCategory.HALOGEN,
    group: 17,
    period: 4,
  },
  {
    number: 36,
    symbol: "Kr",
    name: "Krypton",
    mass: 83.798,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 4,
  },

  // Period 5
  {
    number: 37,
    symbol: "Rb",
    name: "Rubidium",
    mass: 85.468,
    category: ElementCategory.ALKALI_METAL,
    group: 1,
    period: 5,
  },
  {
    number: 38,
    symbol: "Sr",
    name: "Strontium",
    mass: 87.62,
    category: ElementCategory.ALKALINE_EARTH,
    group: 2,
    period: 5,
  },
  {
    number: 39,
    symbol: "Y",
    name: "Yttrium",
    mass: 88.906,
    category: ElementCategory.TRANSITION_METAL,
    group: 3,
    period: 5,
  },
  {
    number: 40,
    symbol: "Zr",
    name: "Zirconium",
    mass: 91.224,
    category: ElementCategory.TRANSITION_METAL,
    group: 4,
    period: 5,
  },
  {
    number: 41,
    symbol: "Nb",
    name: "Niobium",
    mass: 92.906,
    category: ElementCategory.TRANSITION_METAL,
    group: 5,
    period: 5,
  },
  {
    number: 42,
    symbol: "Mo",
    name: "Molybdenum",
    mass: 95.95,
    category: ElementCategory.TRANSITION_METAL,
    group: 6,
    period: 5,
  },
  {
    number: 43,
    symbol: "Tc",
    name: "Technetium",
    mass: 98,
    category: ElementCategory.TRANSITION_METAL,
    group: 7,
    period: 5,
  },
  {
    number: 44,
    symbol: "Ru",
    name: "Ruthenium",
    mass: 101.07,
    category: ElementCategory.TRANSITION_METAL,
    group: 8,
    period: 5,
  },
  {
    number: 45,
    symbol: "Rh",
    name: "Rhodium",
    mass: 102.906,
    category: ElementCategory.TRANSITION_METAL,
    group: 9,
    period: 5,
  },
  {
    number: 46,
    symbol: "Pd",
    name: "Palladium",
    mass: 106.42,
    category: ElementCategory.TRANSITION_METAL,
    group: 10,
    period: 5,
  },
  {
    number: 47,
    symbol: "Ag",
    name: "Silver",
    mass: 107.868,
    category: ElementCategory.TRANSITION_METAL,
    group: 11,
    period: 5,
  },
  {
    number: 48,
    symbol: "Cd",
    name: "Cadmium",
    mass: 112.414,
    category: ElementCategory.TRANSITION_METAL,
    group: 12,
    period: 5,
  },
  {
    number: 49,
    symbol: "In",
    name: "Indium",
    mass: 114.818,
    category: ElementCategory.POST_TRANSITION,
    group: 13,
    period: 5,
  },
  {
    number: 50,
    symbol: "Sn",
    name: "Tin",
    mass: 118.71,
    category: ElementCategory.POST_TRANSITION,
    group: 14,
    period: 5,
  },
  {
    number: 51,
    symbol: "Sb",
    name: "Antimony",
    mass: 121.76,
    category: ElementCategory.METALLOID,
    group: 15,
    period: 5,
  },
  {
    number: 52,
    symbol: "Te",
    name: "Tellurium",
    mass: 127.6,
    category: ElementCategory.METALLOID,
    group: 16,
    period: 5,
  },
  {
    number: 53,
    symbol: "I",
    name: "Iodine",
    mass: 126.904,
    category: ElementCategory.HALOGEN,
    group: 17,
    period: 5,
  },
  {
    number: 54,
    symbol: "Xe",
    name: "Xenon",
    mass: 131.293,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 5,
  },

  // Period 6
  {
    number: 55,
    symbol: "Cs",
    name: "Cesium",
    mass: 132.905,
    category: ElementCategory.ALKALI_METAL,
    group: 1,
    period: 6,
  },
  {
    number: 56,
    symbol: "Ba",
    name: "Barium",
    mass: 137.327,
    category: ElementCategory.ALKALINE_EARTH,
    group: 2,
    period: 6,
  },
  {
    number: 57,
    symbol: "La",
    name: "Lanthanum",
    mass: 138.905,
    category: ElementCategory.LANTHANIDE,
    group: 3,
    period: 6,
  },
  {
    number: 58,
    symbol: "Ce",
    name: "Cerium",
    mass: 140.116,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 59,
    symbol: "Pr",
    name: "Praseodymium",
    mass: 140.908,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 60,
    symbol: "Nd",
    name: "Neodymium",
    mass: 144.242,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 61,
    symbol: "Pm",
    name: "Promethium",
    mass: 145,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 62,
    symbol: "Sm",
    name: "Samarium",
    mass: 150.36,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 63,
    symbol: "Eu",
    name: "Europium",
    mass: 151.964,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 64,
    symbol: "Gd",
    name: "Gadolinium",
    mass: 157.25,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 65,
    symbol: "Tb",
    name: "Terbium",
    mass: 158.925,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 66,
    symbol: "Dy",
    name: "Dysprosium",
    mass: 162.5,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 67,
    symbol: "Ho",
    name: "Holmium",
    mass: 164.93,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 68,
    symbol: "Er",
    name: "Erbium",
    mass: 167.259,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 69,
    symbol: "Tm",
    name: "Thulium",
    mass: 168.934,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 70,
    symbol: "Yb",
    name: "Ytterbium",
    mass: 173.045,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 71,
    symbol: "Lu",
    name: "Lutetium",
    mass: 174.967,
    category: ElementCategory.LANTHANIDE,
    period: 6,
  },
  {
    number: 72,
    symbol: "Hf",
    name: "Hafnium",
    mass: 178.49,
    category: ElementCategory.TRANSITION_METAL,
    group: 4,
    period: 6,
  },
  {
    number: 73,
    symbol: "Ta",
    name: "Tantalum",
    mass: 180.948,
    category: ElementCategory.TRANSITION_METAL,
    group: 5,
    period: 6,
  },
  {
    number: 74,
    symbol: "W",
    name: "Tungsten",
    mass: 183.84,
    category: ElementCategory.TRANSITION_METAL,
    group: 6,
    period: 6,
  },
  {
    number: 75,
    symbol: "Re",
    name: "Rhenium",
    mass: 186.207,
    category: ElementCategory.TRANSITION_METAL,
    group: 7,
    period: 6,
  },
  {
    number: 76,
    symbol: "Os",
    name: "Osmium",
    mass: 190.23,
    category: ElementCategory.TRANSITION_METAL,
    group: 8,
    period: 6,
  },
  {
    number: 77,
    symbol: "Ir",
    name: "Iridium",
    mass: 192.217,
    category: ElementCategory.TRANSITION_METAL,
    group: 9,
    period: 6,
  },
  {
    number: 78,
    symbol: "Pt",
    name: "Platinum",
    mass: 195.084,
    category: ElementCategory.TRANSITION_METAL,
    group: 10,
    period: 6,
  },
  {
    number: 79,
    symbol: "Au",
    name: "Gold",
    mass: 196.967,
    category: ElementCategory.TRANSITION_METAL,
    group: 11,
    period: 6,
  },
  {
    number: 80,
    symbol: "Hg",
    name: "Mercury",
    mass: 200.592,
    category: ElementCategory.TRANSITION_METAL,
    group: 12,
    period: 6,
  },
  {
    number: 81,
    symbol: "Tl",
    name: "Thallium",
    mass: 204.38,
    category: ElementCategory.POST_TRANSITION,
    group: 13,
    period: 6,
  },
  {
    number: 82,
    symbol: "Pb",
    name: "Lead",
    mass: 207.2,
    category: ElementCategory.POST_TRANSITION,
    group: 14,
    period: 6,
  },
  {
    number: 83,
    symbol: "Bi",
    name: "Bismuth",
    mass: 208.98,
    category: ElementCategory.POST_TRANSITION,
    group: 15,
    period: 6,
  },
  {
    number: 84,
    symbol: "Po",
    name: "Polonium",
    mass: 209,
    category: ElementCategory.POST_TRANSITION,
    group: 16,
    period: 6,
  },
  {
    number: 85,
    symbol: "At",
    name: "Astatine",
    mass: 210,
    category: ElementCategory.HALOGEN,
    group: 17,
    period: 6,
  },
  {
    number: 86,
    symbol: "Rn",
    name: "Radon",
    mass: 222,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 6,
  },

  // Period 7
  {
    number: 87,
    symbol: "Fr",
    name: "Francium",
    mass: 223,
    category: ElementCategory.ALKALI_METAL,
    group: 1,
    period: 7,
  },
  {
    number: 88,
    symbol: "Ra",
    name: "Radium",
    mass: 226,
    category: ElementCategory.ALKALINE_EARTH,
    group: 2,
    period: 7,
  },
  {
    number: 89,
    symbol: "Ac",
    name: "Actinium",
    mass: 227,
    category: ElementCategory.ACTINIDE,
    group: 3,
    period: 7,
  },
  {
    number: 90,
    symbol: "Th",
    name: "Thorium",
    mass: 232.038,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 91,
    symbol: "Pa",
    name: "Protactinium",
    mass: 231.036,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 92,
    symbol: "U",
    name: "Uranium",
    mass: 238.029,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 93,
    symbol: "Np",
    name: "Neptunium",
    mass: 237,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 94,
    symbol: "Pu",
    name: "Plutonium",
    mass: 244,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 95,
    symbol: "Am",
    name: "Americium",
    mass: 243,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 96,
    symbol: "Cm",
    name: "Curium",
    mass: 247,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 97,
    symbol: "Bk",
    name: "Berkelium",
    mass: 247,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 98,
    symbol: "Cf",
    name: "Californium",
    mass: 251,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 99,
    symbol: "Es",
    name: "Einsteinium",
    mass: 252,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 100,
    symbol: "Fm",
    name: "Fermium",
    mass: 257,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 101,
    symbol: "Md",
    name: "Mendelevium",
    mass: 258,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 102,
    symbol: "No",
    name: "Nobelium",
    mass: 259,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 103,
    symbol: "Lr",
    name: "Lawrencium",
    mass: 266,
    category: ElementCategory.ACTINIDE,
    period: 7,
  },
  {
    number: 104,
    symbol: "Rf",
    name: "Rutherfordium",
    mass: 267,
    category: ElementCategory.TRANSITION_METAL,
    group: 4,
    period: 7,
  },
  {
    number: 105,
    symbol: "Db",
    name: "Dubnium",
    mass: 268,
    category: ElementCategory.TRANSITION_METAL,
    group: 5,
    period: 7,
  },
  {
    number: 106,
    symbol: "Sg",
    name: "Seaborgium",
    mass: 269,
    category: ElementCategory.TRANSITION_METAL,
    group: 6,
    period: 7,
  },
  {
    number: 107,
    symbol: "Bh",
    name: "Bohrium",
    mass: 270,
    category: ElementCategory.TRANSITION_METAL,
    group: 7,
    period: 7,
  },
  {
    number: 108,
    symbol: "Hs",
    name: "Hassium",
    mass: 277,
    category: ElementCategory.TRANSITION_METAL,
    group: 8,
    period: 7,
  },
  {
    number: 109,
    symbol: "Mt",
    name: "Meitnerium",
    mass: 278,
    category: ElementCategory.TRANSITION_METAL,
    group: 9,
    period: 7,
  },
  {
    number: 110,
    symbol: "Ds",
    name: "Darmstadtium",
    mass: 281,
    category: ElementCategory.TRANSITION_METAL,
    group: 10,
    period: 7,
  },
  {
    number: 111,
    symbol: "Rg",
    name: "Roentgenium",
    mass: 282,
    category: ElementCategory.TRANSITION_METAL,
    group: 11,
    period: 7,
  },
  {
    number: 112,
    symbol: "Cn",
    name: "Copernicium",
    mass: 285,
    category: ElementCategory.TRANSITION_METAL,
    group: 12,
    period: 7,
  },
  {
    number: 113,
    symbol: "Nh",
    name: "Nihonium",
    mass: 286,
    category: ElementCategory.POST_TRANSITION,
    group: 13,
    period: 7,
  },
  {
    number: 114,
    symbol: "Fl",
    name: "Flerovium",
    mass: 289,
    category: ElementCategory.POST_TRANSITION,
    group: 14,
    period: 7,
  },
  {
    number: 115,
    symbol: "Mc",
    name: "Moscovium",
    mass: 290,
    category: ElementCategory.POST_TRANSITION,
    group: 15,
    period: 7,
  },
  {
    number: 116,
    symbol: "Lv",
    name: "Livermorium",
    mass: 293,
    category: ElementCategory.POST_TRANSITION,
    group: 16,
    period: 7,
  },
  {
    number: 117,
    symbol: "Ts",
    name: "Tennessine",
    mass: 294,
    category: ElementCategory.HALOGEN,
    group: 17,
    period: 7,
  },
  {
    number: 118,
    symbol: "Og",
    name: "Oganesson",
    mass: 294,
    category: ElementCategory.NOBLE_GAS,
    group: 18,
    period: 7,
  },
];

/**
 * PeriodicTable component for displaying the periodic table
 */
export class PeriodicTable {
  private mainContainer: Container;
  private config: Required<PeriodicTableConfig>;
  private elements: Map<number, PeriodicElement>;

  constructor(config: PeriodicTableConfig = {}) {
    this.config = {
      cellWidth: config.cellWidth ?? 60,
      cellHeight: config.cellHeight ?? 70,
      spacing: config.spacing ?? 4,
      highlightElements: config.highlightElements ?? [],
      selectElements: config.selectElements ?? [],
      filterCategory: config.filterCategory ?? ElementCategory.UNKNOWN,
      showMass: config.showMass ?? true,
      includeLanthanides: config.includeLanthanides ?? false,
    };

    this.elements = new Map();
    this.mainContainer = this.buildTable();
  }

  private buildTable(): Container {
    const { cellWidth, cellHeight, spacing } = this.config;

    // Calculate table dimensions
    const columns = 18;
    const rows = 7;
    const width = columns * (cellWidth + spacing) + spacing;
    const height = rows * (cellHeight + spacing) + spacing + 40; // +40 for title

    // Create main container
    const container = new Container({
      width,
      height,
      direction: "freeform",
      boxModel: { padding: 20 },
      style: {
        fill: defaultTheme.colors.background,
      },
    });

    // Add title
    const title = new Text({
      content: "Periodic Table of Elements",
      fontSize: 18,
      style: {
        fill: defaultTheme.colors.foreground,
        fontFamily: defaultTheme.typography.fontSans,
        fontWeight: "bold",
      },
    });
    title.position({
      relativeTo: { x: width / 2, y: 10 },
      relativeFrom: title.topCenter,
      x: 0,
      y: 0,
    });
    container.addElement(title);

    // Add elements to the table
    const titleOffset = 40;
    for (const elementData of PERIODIC_DATA) {
      if (!this.shouldShowElement(elementData)) continue;

      let x: number;
      let y: number;

      // Handle elements with explicit group assignment first (main periodic table)
      if (elementData.group) {
        const group = elementData.group;
        const period = elementData.period ?? 1;
        x = spacing + (group - 1) * (cellWidth + spacing);
        y = titleOffset + spacing + (period - 1) * (cellHeight + spacing);
      }
      // Handle lanthanides and actinides separately (displayed at bottom)
      else if (elementData.category === ElementCategory.LANTHANIDE) {
        if (!this.config.includeLanthanides) continue;
        const lanthIndex = elementData.number - 58; // Ce is 58, first lanthanide after La
        x = spacing + (lanthIndex + 3) * (cellWidth + spacing); // Offset by 3 to start after Ac column
        y = titleOffset + spacing + 7 * (cellHeight + spacing) + cellHeight; // Below period 7, with gap
      } else if (elementData.category === ElementCategory.ACTINIDE) {
        if (!this.config.includeLanthanides) continue;
        const actIndex = elementData.number - 90; // Th is 90, first actinide after Ac
        x = spacing + (actIndex + 3) * (cellWidth + spacing); // Offset by 3 to start after Ac column
        y = titleOffset + spacing + 8 * (cellHeight + spacing) + cellHeight; // Below lanthanides
      } else {
        // Skip elements without group or category
        continue;
      }

      const isHighlighted = this.config.highlightElements.includes(
        elementData.number
      );
      const isSelected = this.config.selectElements.includes(
        elementData.number
      );

      const element = new PeriodicElement({
        element: elementData,
        width: cellWidth,
        height: cellHeight,
        highlighted: isHighlighted,
        selected: isSelected,
        showMass: this.config.showMass,
      });

      element.element.position({
        relativeTo: { x, y },
        relativeFrom: element.element.topLeft,
        x: 0,
        y: 0,
      });

      container.addElement(element.element);
      this.elements.set(elementData.number, element);
    }

    return container;
  }

  private shouldShowElement(element: ElementData): boolean {
    if (this.config.filterCategory === ElementCategory.UNKNOWN) {
      return true;
    }
    return element.category === this.config.filterCategory;
  }

  // Position accessors
  get topLeft(): Position {
    return this.mainContainer.topLeft;
  }
  get topRight(): Position {
    return this.mainContainer.topRight;
  }
  get bottomLeft(): Position {
    return this.mainContainer.bottomLeft;
  }
  get bottomRight(): Position {
    return this.mainContainer.bottomRight;
  }
  get center(): Position {
    return this.mainContainer.center;
  }
  get topCenter(): Position {
    return this.mainContainer.topCenter;
  }
  get bottomCenter(): Position {
    return this.mainContainer.bottomCenter;
  }
  get centerLeft(): Position {
    return this.mainContainer.centerLeft;
  }
  get centerRight(): Position {
    return this.mainContainer.centerRight;
  }

  get width(): number {
    return this.mainContainer.width;
  }
  get height(): number {
    return this.mainContainer.height;
  }
  get container(): Container {
    return this.mainContainer;
  }

  /**
   * Get an element by its atomic number
   */
  getElement(atomicNumber: number): PeriodicElement | undefined {
    return this.elements.get(atomicNumber);
  }
}
