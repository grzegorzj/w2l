/**
 * Card with Chart Example
 * 
 * Demonstrates placing themed charts inside cards for a dashboard-like layout.
 */

import { Artboard, Card, Container, BarChart, Text, TextArea } from "w2l";

const artboard = new Artboard({
  width: 1200,
  height: 800,
});

// Container for cards
const dashboard = new Container({
  width: 1100,
  height: 700,
  direction: "vertical",
  spacing: 24,
  style: {
    fill: "none",
  },
  boxModel: {
    padding: 32,
  },
});

// Row 1: Two cards with charts
const row1 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 24,
  style: {
    fill: "none",
  },
});

// Revenue card
const revenueCard = new Card({
  width: 520,
  header: "Monthly Revenue",
  footer: "Updated 5 minutes ago",
});

const revenueChart = new BarChart({
  width: 488,
  height: 250,
  data: [
    { label: "Jan", value: 45 },
    { label: "Feb", value: 62 },
    { label: "Mar", value: 38 },
    { label: "Apr", value: 78 },
    { label: "May", value: 55 },
    { label: "Jun", value: 91 },
  ],
  orientation: "vertical",
  barSpacing: 0.4,
  barColor: "#525252",
  showGrid: true,
  showAxes: true,
  chartPadding: {
    top: 12,
    right: 12,
    bottom: 32,
    left: 40,
  },
  style: {
    fill: "none",
    stroke: "none",
  },
});

revenueCard.addContent(revenueChart);
row1.addElement(revenueCard);

// Users card
const usersCard = new Card({
  width: 520,
  header: "Active Users",
  footer: "Last 6 months",
});

const usersChart = new BarChart({
  width: 488,
  height: 250,
  data: [
    { label: "Jan", value: 120 },
    { label: "Feb", value: 145 },
    { label: "Mar", value: 132 },
    { label: "Apr", value: 189 },
    { label: "May", value: 167 },
    { label: "Jun", value: 203 },
  ],
  orientation: "vertical",
  barSpacing: 0.4,
  barColor: "#737373",
  showGrid: true,
  showAxes: true,
  chartPadding: {
    top: 12,
    right: 12,
    bottom: 32,
    left: 40,
  },
  style: {
    fill: "none",
    stroke: "none",
  },
});

usersCard.addContent(usersChart);
row1.addElement(usersCard);

dashboard.addElement(row1);

// Row 2: Three smaller info cards
const row2 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 24,
  style: {
    fill: "none",
  },
});

const infoCard1 = new Card({
  width: 340,
  header: "Total Sales",
});

const salesText = new Text({
  content: "$24,589",
  fontSize: "32px",
  style: {
    fontWeight: "700",
    fill: "#000000",
  },
});

const salesSubtext = new Text({
  content: "+12% from last month",
  fontSize: "12px",
  style: {
    fill: "#737373",
  },
});

infoCard1.addContent(salesText);
infoCard1.addContent(salesSubtext);
row2.addElement(infoCard1);

const infoCard2 = new Card({
  width: 340,
  header: "New Customers",
});

const customersText = new Text({
  content: "1,429",
  fontSize: "32px",
  style: {
    fontWeight: "700",
    fill: "#000000",
  },
});

const customersSubtext = new Text({
  content: "+8% from last month",
  fontSize: "12px",
  style: {
    fill: "#737373",
  },
});

infoCard2.addContent(customersText);
infoCard2.addContent(customersSubtext);
row2.addElement(infoCard2);

const infoCard3 = new Card({
  width: 340,
  header: "Conversion Rate",
});

const conversionText = new Text({
  content: "3.2%",
  fontSize: "32px",
  style: {
    fontWeight: "700",
    fill: "#000000",
  },
});

const conversionSubtext = new Text({
  content: "+0.4% from last month",
  fontSize: "12px",
  style: {
    fill: "#737373",
  },
});

infoCard3.addContent(conversionText);
infoCard3.addContent(conversionSubtext);
row2.addElement(infoCard3);

dashboard.addElement(row2);

// Use a centering container
const centerContainer = new Container({
  width: 1200,
  height: 800,
  direction: "horizontal",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  style: {
    fill: "none",
  },
});

centerContainer.addElement(dashboard);
artboard.addElement(centerContainer);

return artboard.render();

