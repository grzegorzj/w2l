import {
  Alluvial,
  Angle,
  AreaLayer,
  Arrow,
  Artboard,
  Bar,
  BarChart,
  BarLayer,
  BezierCurve,
  BoxAccessor,
  Card,
  Chart,
  ChemFig,
  ChemicalFormula,
  ChemicalReactions,
  ChemicalStructures,
  Circle,
  Columns,
  Container,
  DataPoint,
  DonutChart,
  DonutSlice,
  Element,
  ElementCategory,
  FunctionGraph,
  Grid,
  Image,
  Latex,
  Legend,
  Line,
  LineChart,
  LineLayer,
  Path,
  PeriodicElement,
  PeriodicTable,
  Quadrilateral,
  RadarChart,
  Rect,
  Rectangle,
  RegularPolygon,
  ScatterLayer,
  Shape,
  Side,
  Square,
  SwissTheme,
  Text,
  TextArea,
  Timeline,
  TimelineEventMarker,
  TimelinePeriodBar,
  Treemap,
  Triangle,
  clearCurrentArtboard,
  createTheme,
  defaultTheme,
  getCurrentArtboard,
  getTheme,
  parseBoxModel,
  parseBoxValue,
  setCurrentArtboard,
  styleToSVGAttributes,
} from "w2l";

/**
 * Treemap Component Example
 *
 * Demonstrates hierarchical data visualization using treemaps.
 * Showcases automatic Swiss theme coloring and nested hierarchies.
 */

import { Artboard, Container, Card, Text, Treemap } from "w2l";

const artboard = new Artboard({ padding: 40 });

// Create main container
const mainContainer = new Container({
  direction: "vertical",
  height: "auto",
  width: "auto",
});

artboard.add(mainContainer);

// Title
const title = new Text({
  content: "Treemap Visualizations",
  fontSize: 32,
  style: { fontWeight: 700, fill: "#171717" },
});
mainContainer.add(title);

// Card 1: Company Revenue by Department
const card1 = new Card({
  width: 1120,
  height: "auto",
});
mainContainer.add(card1);

const card1Container = new Container({
  direction: "vertical",
  width: "auto",
  height: "auto",
  spacing: 15,
});
card1.add(card1Container);

const card1Title = new Text({
  content: "Company Revenue by Department (Q1 2024)",
  fontSize: 18,
  style: { fontWeight: 600 },
});
card1Container.add(card1Title);

const companyData = {
  label: "Company",
  value: 1000,
  children: [
    {
      label: "Engineering",
      value: 350,
      children: [
        { label: "Frontend", value: 120 },
        { label: "Backend", value: 140 },
        { label: "DevOps", value: 90 },
      ],
    },
    {
      label: "Sales",
      value: 300,
      children: [
        { label: "Enterprise", value: 180 },
        { label: "SMB", value: 80 },
        { label: "Partnerships", value: 40 },
      ],
    },
    {
      label: "Marketing",
      value: 200,
      children: [
        { label: "Digital", value: 100 },
        { label: "Brand", value: 60 },
        { label: "Events", value: 40 },
      ],
    },
    {
      label: "Operations",
      value: 150,
      children: [
        { label: "HR", value: 60 },
        { label: "Finance", value: 50 },
        { label: "Legal", value: 40 },
      ],
    },
  ],
};

const treemap1 = new Treemap({
  data: companyData,
  width: 1080,
  height: 400,
  padding: 3,
  showValues: true,
});
card1Container.add(treemap1);

// Card 2: Global Population by Region
const card2 = new Card({
  width: 1120,
  height: "auto",
});
mainContainer.add(card2);

const card2Container = new Container({
  direction: "vertical",
  width: "auto",
  height: "auto",
  spacing: 15,
});
card2.add(card2Container);

const card2Title = new Text({
  content: "Global Population Distribution (millions)",
  fontSize: 18,
  style: { fontWeight: 600 },
});
card2Container.add(card2Title);

const populationData = {
  label: "World",
  value: 8000,
  children: [
    {
      label: "Asia",
      value: 4600,
      children: [
        { label: "East Asia", value: 1650 },
        { label: "South Asia", value: 1900 },
        { label: "Southeast Asia", value: 680 },
        { label: "West Asia", value: 370 },
      ],
    },
    {
      label: "Africa",
      value: 1400,
      children: [
        { label: "Sub-Saharan", value: 1100 },
        { label: "North Africa", value: 300 },
      ],
    },
    {
      label: "Europe",
      value: 750,
    },
    {
      label: "Americas",
      value: 1020,
      children: [
        { label: "North America", value: 580 },
        { label: "Latin America", value: 440 },
      ],
    },
    {
      label: "Oceania",
      value: 45,
    },
  ],
};

const treemap2 = new Treemap({
  data: populationData,
  width: 1080,
  height: 450,
  padding: 2,
  showValues: false,
});
card2Container.add(treemap2);

// Card 3: File System Storage
const card3 = new Card({
  width: 1120,
  height: "auto",
});
mainContainer.add(card3);

const card3Container = new Container({
  direction: "vertical",
  width: "auto",
  height: "auto",
  spacing: 15,
});
card3.add(card3Container);

const card3Title = new Text({
  content: "Storage Usage by Directory (GB)",
  fontSize: 18,
  style: { fontWeight: 600 },
});
card3Container.add(card3Title);

const storageData = {
  label: "Root",
  value: 500,
  children: [
    {
      label: "Documents",
      value: 120,
      children: [
        { label: "Work", value: 80 },
        { label: "Personal", value: 40 },
      ],
    },
    {
      label: "Media",
      value: 250,
      children: [
        { label: "Photos", value: 100 },
        { label: "Videos", value: 130 },
        { label: "Music", value: 20 },
      ],
    },
    {
      label: "Applications",
      value: 80,
    },
    {
      label: "System",
      value: 50,
      children: [
        { label: "Cache", value: 25 },
        { label: "Logs", value: 15 },
        { label: "Temp", value: 10 },
      ],
    },
  ],
};

const treemap3 = new Treemap({
  data: storageData,
  width: 1080,
  height: 350,
  padding: 4,
  showValues: true,
  minFontSize: 11,
});
card3Container.add(treemap3);

// Render
return artboard.render();
