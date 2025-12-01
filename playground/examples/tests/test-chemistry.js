/**
 * Chemistry Components Test
 * Demonstrates periodic table, elements, and chemical formulas
 */

import {
  Artboard,
  Card,
  Container,
  Text,
  TextArea,
  PeriodicTable,
  PeriodicElement,
  ElementCategory,
  ChemicalFormula,
} from "w2l";

const artboard = new Artboard({
  width: 1200,
  height: "auto",
  boxModel: { padding: 40 },
});

// Main container for all cards
const mainContainer = new Container({
  width: 1120,
  height: "auto",
  direction: "vertical",
  spacing: 30,
});

mainContainer.position({
  relativeTo: artboard.contentBox.center,
  relativeFrom: mainContainer.center,
  x: 0,
  y: 0,
});

artboard.add(mainContainer);

// Card 1: Periodic Table
const card1 = new Card({
  width: 1120,
  height: "auto",
  boxModel: { padding: 20 },
});

const title1 = new Text({
  content: "Complete Periodic Table of Elements",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const description1 = new TextArea({
  content: "The periodic table organizes all 118 chemical elements by their atomic structure. Elements in the same group (column) have similar chemical properties. Elements are colored by category: alkali metals (red), halogens (orange), noble gases (purple), transition metals (pink), and more.",
  width: 1080,
  fontSize: 12,
  lineHeight: 1.5,
});

// Create periodic table with some elements highlighted
const periodicTable = new PeriodicTable({
  cellWidth: 55,
  cellHeight: 65,
  spacing: 3,
  highlightElements: [1, 6, 7, 8], // H, C, N, O - essential for life
  selectElements: [11], // Na - selected
  showMass: true,
  includeLanthanides: true, // Show all 118 elements including lanthanides and actinides
});

const card1Content = new Container({
  width: 1080,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card1Content.add(title1);
card1Content.add(description1);
card1Content.add(periodicTable.container);

card1.add(card1Content);
mainContainer.add(card1);

// Card 2: Individual Elements Showcase
const card2 = new Card({
  width: 1120,
  height: "auto",
  boxModel: { padding: 20 },
});

const title2 = new Text({
  content: "Element Categories & Examples",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const description2 = new TextArea({
  content: "Chemical elements are categorized based on their properties. Here are examples from different categories: alkali metals (highly reactive), noble gases (inert), halogens (reactive nonmetals), and transition metals (versatile conductors).",
  width: 1080,
  fontSize: 12,
  lineHeight: 1.5,
});

// Create a container for sample elements
const elementsContainer = new Container({
  width: 1080,
  height: "auto",
  direction: "horizontal",
  spacing: 15,
  horizontalAlignment: "center",
});

// Sample elements from different categories
const hydrogenElement = new PeriodicElement({
  element: {
    number: 1,
    symbol: "H",
    name: "Hydrogen",
    mass: 1.008,
    category: ElementCategory.NONMETAL,
  },
  width: 80,
  height: 90,
  highlighted: true,
});

const sodiumElement = new PeriodicElement({
  element: {
    number: 11,
    symbol: "Na",
    name: "Sodium",
    mass: 22.990,
    category: ElementCategory.ALKALI_METAL,
  },
  width: 80,
  height: 90,
  selected: true,
});

const carbonElement = new PeriodicElement({
  element: {
    number: 6,
    symbol: "C",
    name: "Carbon",
    mass: 12.011,
    category: ElementCategory.NONMETAL,
  },
  width: 80,
  height: 90,
  highlighted: true,
});

const goldElement = new PeriodicElement({
  element: {
    number: 79,
    symbol: "Au",
    name: "Gold",
    mass: 196.967,
    category: ElementCategory.TRANSITION_METAL,
  },
  width: 80,
  height: 90,
});

const heliumElement = new PeriodicElement({
  element: {
    number: 2,
    symbol: "He",
    name: "Helium",
    mass: 4.003,
    category: ElementCategory.NOBLE_GAS,
  },
  width: 80,
  height: 90,
});

elementsContainer.add(hydrogenElement.element);
elementsContainer.add(carbonElement.element);
elementsContainer.add(sodiumElement.element);
elementsContainer.add(goldElement.element);
elementsContainer.add(heliumElement.element);

const card2Content = new Container({
  width: 1080,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card2Content.add(title2);
card2Content.add(description2);
card2Content.add(elementsContainer);

card2.add(card2Content);
mainContainer.add(card2);

// Card 3: Chemical Formulas and Reactions
const card3 = new Card({
  width: 1120,
  height: "auto",
  boxModel: { padding: 20 },
});

const title3 = new Text({
  content: "Chemical Formulas & Reactions",
  fontSize: 18,
  style: { fontWeight: "bold" },
});

const description3 = new TextArea({
  content: "Chemical formulas represent the composition of compounds. Chemical reactions show how substances transform. The arrow indicates the direction of the reaction, with reactants on the left and products on the right.",
  width: 1080,
  fontSize: 12,
  lineHeight: 1.5,
});

// Create formulas container
const formulasContainer = new Container({
  width: 1080,
  height: "auto",
  direction: "vertical",
  spacing: 20,
});

// Water formula
const waterLabel = new Text({
  content: "Water (H₂O):",
  fontSize: 14,
  style: { fontWeight: "bold" },
});

const waterFormula = new ChemicalFormula("H2O", 16);

const waterRow = new Container({
  width: 1080,
  height: "auto",
  direction: "horizontal",
  spacing: 15,
  verticalAlignment: "center",
});
waterRow.add(waterLabel);
waterRow.add(waterFormula.element);

// Methane combustion
const combustionLabel = new Text({
  content: "Combustion of Methane:",
  fontSize: 14,
  style: { fontWeight: "bold" },
});

const combustionFormula = new ChemicalFormula("CH4 + 2O2 -> CO2 + 2H2O", 14);

const combustionRow = new Container({
  width: 1080,
  height: "auto",
  direction: "horizontal",
  spacing: 15,
  verticalAlignment: "center",
});
combustionRow.add(combustionLabel);
combustionRow.add(combustionFormula.element);

// Photosynthesis
const photoLabel = new Text({
  content: "Photosynthesis:",
  fontSize: 14,
  style: { fontWeight: "bold" },
});

const photoFormula = new ChemicalFormula("6CO2 + 6H2O -> C6H12O6 + 6O2", 14);

const photoRow = new Container({
  width: 1080,
  height: "auto",
  direction: "horizontal",
  spacing: 15,
  verticalAlignment: "center",
});
photoRow.add(photoLabel);
photoRow.add(photoFormula.element);

// Common compounds
const compoundsLabel = new Text({
  content: "Common Compounds:",
  fontSize: 14,
  style: { fontWeight: "bold" },
});

const saltFormula = new ChemicalFormula("NaCl", 14);
const sugarFormula = new ChemicalFormula("C12H22O11", 14);
const ammoniaFormula = new ChemicalFormula("NH3", 14);

const compoundsRow = new Container({
  width: 1080,
  height: "auto",
  direction: "horizontal",
  spacing: 20,
  verticalAlignment: "center",
});
compoundsRow.add(compoundsLabel);
compoundsRow.add(saltFormula.element);
compoundsRow.add(sugarFormula.element);
compoundsRow.add(ammoniaFormula.element);

formulasContainer.add(waterRow);
formulasContainer.add(combustionRow);
formulasContainer.add(photoRow);
formulasContainer.add(compoundsRow);

const card3Content = new Container({
  width: 1080,
  height: "auto",
  direction: "vertical",
  spacing: 15,
});

card3Content.add(title3);
card3Content.add(description3);
card3Content.add(formulasContainer);

card3.add(card3Content);
mainContainer.add(card3);

return artboard.render();

