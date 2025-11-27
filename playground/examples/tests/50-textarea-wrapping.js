/**
 * TextArea Example: Text Wrapping with Padding
 * 
 * Tests the new TextArea component that wraps text within a specified width.
 * Demonstrates:
 * - Basic text wrapping
 * - Padding support
 * - Different widths and font sizes
 * - Background fill and stroke
 * - Proper layout using Containers
 */

import { Artboard, TextArea, Container, Text } from "w2l";

const artboard = new Artboard({
  width: "auto",
  height: "auto",
  backgroundColor: "#ffffff",
  boxModel: { padding: 40 },
});

// Sample text content
const sampleText = "This is a longer piece of text that will wrap to multiple lines when it exceeds the specified width of the TextArea component.";
const shortText = "Short text that fits on one line.";
const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

// Main container with vertical layout
const mainContainer = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 40,
  boxModel: { padding: 20 },
  style: {
    fill: "#f8f9fa",
    stroke: "#dee2e6",
    strokeWidth: 2,
  },
});

mainContainer.position({
  relativeFrom: mainContainer.topLeft,
  relativeTo: artboard.contentBox.topLeft,
  x: 0,
  y: 0,
});

artboard.addElement(mainContainer);

// ========================================
// ROW 1: Basic examples
// ========================================

const row1 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top",
});

mainContainer.addElement(row1);

// Example 1: Basic text wrapping with padding
const example1 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label1 = new Text({
  content: "Basic with Padding",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea1 = new TextArea({
  content: sampleText,
  width: 250,
  fontSize: 16,
  textColor: "#2c3e50",
  boxModel: { padding: 15 },
  style: {
    fill: "#ecf0f1",
    stroke: "#3498db",
    strokeWidth: 2,
  },
});

example1.addElement(label1);
example1.addElement(textArea1);
row1.addElement(example1);

// Example 2: Narrow width (more wrapping)
const example2 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label2 = new Text({
  content: "Narrow (180px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea2 = new TextArea({
  content: loremIpsum,
  width: 180,
  fontSize: 14,
  lineHeight: 1.4,
  textColor: "#856404",
  boxModel: { padding: 12 },
  style: {
    fill: "#fff3cd",
    stroke: "#ffc107",
    strokeWidth: 2,
  },
});

example2.addElement(label2);
example2.addElement(textArea2);
row1.addElement(example2);

// Example 3: Wide width (less wrapping)
const example3 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label3 = new Text({
  content: "Wide (350px) - Georgia",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea3 = new TextArea({
  content: loremIpsum,
  width: 350,
  fontSize: 16,
  lineHeight: 1.5,
  fontFamily: "Georgia",
  textColor: "#1b5e20",
  boxModel: { padding: 20 },
  style: {
    fill: "#e8f5e9",
    stroke: "#4caf50",
    strokeWidth: 2,
  },
});

example3.addElement(label3);
example3.addElement(textArea3);
row1.addElement(example3);

// ========================================
// ROW 2: More examples
// ========================================

const row2 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top",
});

mainContainer.addElement(row2);

// Example 4: Short text (no wrapping needed)
const example4 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label4 = new Text({
  content: "Short Text (Single Line)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea4 = new TextArea({
  content: shortText,
  width: 300,
  fontSize: 18,
  textColor: "#4a148c",
  boxModel: { padding: 15 },
  style: {
    fill: "#f3e5f5",
    stroke: "#9c27b0",
    strokeWidth: 2,
  },
});

example4.addElement(label4);
example4.addElement(textArea4);
row2.addElement(example4);

// Example 5: No padding, no background
const example5 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label5 = new Text({
  content: "No Background/Padding",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea5 = new TextArea({
  content: "This TextArea has no padding and no background. It only renders the text content with wrapping.",
  width: 300,
  fontSize: 16,
  textColor: "#34495e",
});

example5.addElement(label5);
example5.addElement(textArea5);
row2.addElement(example5);

// Example 6: Small font size
const example6 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label6 = new Text({
  content: "Small Font (12px)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea6 = new TextArea({
  content: sampleText,
  width: 200,
  fontSize: 12,
  lineHeight: 1.3,
  textColor: "#880e4f",
  boxModel: { padding: 10 },
  style: {
    fill: "#fce4ec",
    stroke: "#e91e63",
    strokeWidth: 1,
  },
});

example6.addElement(label6);
example6.addElement(textArea6);
row2.addElement(example6);

// ========================================
// ROW 3: Special cases
// ========================================

const row3 = new Container({
  width: "auto",
  height: "auto",
  direction: "horizontal",
  spacing: 30,
  verticalAlignment: "top",
});

mainContainer.addElement(row3);

// Example 7: Large font size
const example7 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label7 = new Text({
  content: "Large Font (20px, Bold)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea7 = new TextArea({
  content: "Large text that wraps with bigger font size!",
  width: 250,
  fontSize: 20,
  fontWeight: "bold",
  lineHeight: 1.4,
  textColor: "#0d47a1",
  boxModel: { padding: 18 },
  style: {
    fill: "#e3f2fd",
    stroke: "#2196f3",
    strokeWidth: 3,
  },
});

example7.addElement(label7);
example7.addElement(textArea7);
row3.addElement(example7);

// Example 8: Debug mode
const example8 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label8 = new Text({
  content: "Debug Mode (shows boxes)",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea8 = new TextArea({
  content: "Debug mode shows the border box (blue) and content box (red) for development.",
  width: 220,
  fontSize: 15,
  textColor: "#d84315",
  boxModel: { padding: 15 },
  style: {
    fill: "#ffebee",
    stroke: "#f44336",
    strokeWidth: 2,
  },
  debug: true,
});

example8.addElement(label8);
example8.addElement(textArea8);
row3.addElement(example8);

// Example 9: Custom font and styling
const example9 = new Container({
  width: "auto",
  height: "auto",
  direction: "vertical",
  spacing: 10,
});

const label9 = new Text({
  content: "Monospace Font",
  fontSize: 14,
  fontWeight: "bold",
  style: { fill: "#2c3e50" },
});

const textArea9 = new TextArea({
  content: "function wrap(text) { return text.split(' ').join('\\n'); }",
  width: 280,
  fontSize: 14,
  fontFamily: "monospace",
  textColor: "#1a1a1a",
  boxModel: { padding: 12 },
  style: {
    fill: "#f5f5f5",
    stroke: "#424242",
    strokeWidth: 1,
  },
});

example9.addElement(label9);
example9.addElement(textArea9);
row3.addElement(example9);

console.log("=== TextArea Debug Info ===");
console.log("TextArea 1 lines:", textArea1.lines);
console.log("TextArea 1 height:", textArea1.height);
console.log("TextArea 2 lines:", textArea2.lines);
console.log("TextArea 2 height:", textArea2.height);

return artboard.render();
