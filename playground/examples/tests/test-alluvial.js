/**
 * Alluvial Diagram Example
 * 
 * Demonstrates flow visualization using alluvial/Sankey diagrams.
 * Shows how categories change and flow between stages.
 */

import {
  Artboard,
  Container,
  Card,
  Text,
  Alluvial,
} from "w2l";

const artboard = new Artboard({ width: 1200, height: 1600, padding: 40 });

// Create main container
const mainContainer = new Container({
  direction: "vertical",
  width: 1120,
  spacing: 30,
});

artboard.add(mainContainer);

// Title
const title = new Text({
  content: "Alluvial Flow Diagrams",
  fontSize: 32,
  style: { fontWeight: 700, fill: "#171717" },
});
mainContainer.add(title);

// Card 1: Customer Journey
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
  content: "Customer Journey: Awareness → Conversion",
  fontSize: 18,
  style: { fontWeight: 600 },
});
card1Container.add(card1Title);

const customerJourneyStages = [
  {
    label: "Awareness",
    nodes: [
      { id: "social", label: "Social Media" },
      { id: "search", label: "Search" },
      { id: "referral", label: "Referral" },
    ],
  },
  {
    label: "Interest",
    nodes: [
      { id: "blog", label: "Blog" },
      { id: "demo", label: "Demo" },
      { id: "pricing", label: "Pricing" },
    ],
  },
  {
    label: "Conversion",
    nodes: [
      { id: "trial", label: "Free Trial" },
      { id: "purchase", label: "Purchase" },
      { id: "dropped", label: "Dropped" },
    ],
  },
];

const customerJourneyFlows = [
  // Awareness → Interest
  { from: "social", to: "blog", value: 150 },
  { from: "social", to: "demo", value: 80 },
  { from: "search", to: "blog", value: 120 },
  { from: "search", to: "pricing", value: 200 },
  { from: "referral", to: "demo", value: 90 },
  { from: "referral", to: "pricing", value: 60 },
  // Interest → Conversion
  { from: "blog", to: "trial", value: 180 },
  { from: "blog", to: "dropped", value: 90 },
  { from: "demo", to: "purchase", value: 120 },
  { from: "demo", to: "trial", value: 50 },
  { from: "pricing", to: "purchase", value: 180 },
  { from: "pricing", to: "dropped", value: 80 },
];

const alluvial1 = new Alluvial({
  stages: customerJourneyStages,
  flows: customerJourneyFlows,
  width: 1080,
  height: 350,
  nodeWidth: 25,
  nodePadding: 15,
  showStageLabels: true,
});
card1Container.add(alluvial1);

// Card 2: Education → Career Path
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
  content: "Education to Career Progression",
  fontSize: 18,
  style: { fontWeight: 600 },
});
card2Container.add(card2Title);

const careerStages = [
  {
    label: "Education",
    nodes: [
      { id: "cs", label: "CS Degree" },
      { id: "eng", label: "Engineering" },
      { id: "business", label: "Business" },
      { id: "design", label: "Design" },
    ],
  },
  {
    label: "First Job",
    nodes: [
      { id: "dev", label: "Developer" },
      { id: "analyst", label: "Analyst" },
      { id: "designer", label: "Designer" },
      { id: "pm", label: "PM" },
    ],
  },
  {
    label: "5 Years Later",
    nodes: [
      { id: "senior-dev", label: "Senior Dev" },
      { id: "lead", label: "Tech Lead" },
      { id: "manager", label: "Manager" },
      { id: "senior-pm", label: "Senior PM" },
    ],
  },
];

const careerFlows = [
  // Education → First Job
  { from: "cs", to: "dev", value: 200 },
  { from: "cs", to: "analyst", value: 50 },
  { from: "eng", to: "dev", value: 100 },
  { from: "business", to: "analyst", value: 120 },
  { from: "business", to: "pm", value: 80 },
  { from: "design", to: "designer", value: 150 },
  { from: "design", to: "dev", value: 30 },
  // First Job → 5 Years Later
  { from: "dev", to: "senior-dev", value: 200 },
  { from: "dev", to: "lead", value: 100 },
  { from: "dev", to: "manager", value: 30 },
  { from: "analyst", to: "manager", value: 80 },
  { from: "analyst", to: "senior-pm", value: 90 },
  { from: "designer", to: "lead", value: 60 },
  { from: "designer", to: "senior-pm", value: 40 },
  { from: "pm", to: "senior-pm", value: 60 },
  { from: "pm", to: "manager", value: 20 },
];

const alluvial2 = new Alluvial({
  stages: careerStages,
  flows: careerFlows,
  width: 1080,
  height: 400,
  nodeWidth: 30,
  nodePadding: 12,
  showStageLabels: true,
});
card2Container.add(alluvial2);

// Card 3: Market Share Migration
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
  content: "Market Share Changes (2020 → 2023)",
  fontSize: 18,
  style: { fontWeight: 600 },
});
card3Container.add(card3Title);

const marketStages = [
  {
    label: "2020",
    nodes: [
      { id: "vendor-a-2020", label: "Vendor A" },
      { id: "vendor-b-2020", label: "Vendor B" },
      { id: "vendor-c-2020", label: "Vendor C" },
      { id: "others-2020", label: "Others" },
    ],
  },
  {
    label: "2023",
    nodes: [
      { id: "vendor-a-2023", label: "Vendor A" },
      { id: "vendor-b-2023", label: "Vendor B" },
      { id: "vendor-c-2023", label: "Vendor C" },
      { id: "others-2023", label: "Others" },
    ],
  },
];

const marketFlows = [
  { from: "vendor-a-2020", to: "vendor-a-2023", value: 280 },
  { from: "vendor-a-2020", to: "vendor-b-2023", value: 20 },
  { from: "vendor-b-2020", to: "vendor-b-2023", value: 150 },
  { from: "vendor-b-2020", to: "vendor-a-2023", value: 50 },
  { from: "vendor-b-2020", to: "vendor-c-2023", value: 30 },
  { from: "vendor-c-2020", to: "vendor-c-2023", value: 120 },
  { from: "vendor-c-2020", to: "vendor-b-2023", value: 40 },
  { from: "others-2020", to: "others-2023", value: 80 },
  { from: "others-2020", to: "vendor-a-2023", value: 20 },
  { from: "others-2020", to: "vendor-b-2023", value: 20 },
];

const alluvial3 = new Alluvial({
  stages: marketStages,
  flows: marketFlows,
  width: 1080,
  height: 350,
  nodeWidth: 35,
  nodePadding: 20,
  showStageLabels: true,
});
card3Container.add(alluvial3);

// Render
return artboard.render();

