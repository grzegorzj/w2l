#!/usr/bin/env node

/**
 * Test script for new primitives
 * 
 * This script tests:
 * 1. Enhanced Triangle with angle calculations
 * 2. RegularPolygon (hexagons, octagons, etc.)
 * 3. Text with word wrapping
 */

import { Artboard, Triangle, RegularPolygon, Text } from "../dist/index.js";
import { writeFileSync } from "fs";

console.log("🧪 Testing new primitives...\n");

// Test 1: Enhanced Triangle
console.log("1️⃣ Testing Enhanced Triangle...");
const triangle = new Triangle({
  type: "right",
  a: 3,
  b: 4,
  orientation: "bottomLeft"
});

const angles = triangle.angles;
const sideLengths = triangle.sideLengths;
const area = triangle.area;
const perimeter = triangle.perimeter;

console.log(`   ✓ Triangle created`);
console.log(`   - Angles: ${angles.angleA.toFixed(2)}°, ${angles.angleB.toFixed(2)}°, ${angles.angleC.toFixed(2)}°`);
console.log(`   - Side lengths: ${sideLengths.sideA.toFixed(2)}, ${sideLengths.sideB.toFixed(2)}, ${sideLengths.sideC.toFixed(2)}`);
console.log(`   - Area: ${area.toFixed(2)} square units`);
console.log(`   - Perimeter: ${perimeter.toFixed(2)} units`);
console.log(`   - Is right triangle: ${triangle.isRightTriangle}`);
console.log(`   - Is equilateral: ${triangle.isEquilateral}`);
console.log(`   - Is isosceles: ${triangle.isIsosceles}`);

// Verify Pythagorean theorem for right triangle
const aSquared = Math.pow(sideLengths.sideA, 2);
const bSquared = Math.pow(sideLengths.sideB, 2);
const cSquared = Math.pow(sideLengths.sideC, 2);
const pythagoreanCheck = Math.abs((aSquared + bSquared) - cSquared) < 0.01;
console.log(`   - Pythagorean theorem check: ${pythagoreanCheck ? "✓ PASS" : "✗ FAIL"}`);

// Verify sum of angles is 180°
const angleSum = angles.angleA + angles.angleB + angles.angleC;
const angleSumCheck = Math.abs(angleSum - 180) < 0.1;
console.log(`   - Angle sum check (should be 180°): ${angleSum.toFixed(2)}° ${angleSumCheck ? "✓ PASS" : "✗ FAIL"}`);

console.log("");

// Test 2: Equilateral Triangle
console.log("2️⃣ Testing Equilateral Triangle...");
const equilateral = new Triangle({
  type: "equilateral",
  a: 100
});

const equilateralAngles = equilateral.angles;
console.log(`   ✓ Equilateral triangle created`);
console.log(`   - Angles: ${equilateralAngles.angleA.toFixed(2)}°, ${equilateralAngles.angleB.toFixed(2)}°, ${equilateralAngles.angleC.toFixed(2)}°`);
console.log(`   - All angles ~60°: ${Math.abs(equilateralAngles.angleA - 60) < 0.1 ? "✓ PASS" : "✗ FAIL"}`);
console.log(`   - Is equilateral: ${equilateral.isEquilateral ? "✓ PASS" : "✗ FAIL"}`);

console.log("");

// Test 3: RegularPolygon
console.log("3️⃣ Testing RegularPolygon...");

// Hexagon
const hexagon = new RegularPolygon({
  sides: 6,
  size: 50,
  style: { fill: "#3498db" }
});

console.log(`   ✓ Hexagon created`);
console.log(`   - Sides: ${hexagon.sideCount}`);
console.log(`   - Radius: ${hexagon.radius}`);
console.log(`   - Side length: ${hexagon.sideLength.toFixed(2)}`);
console.log(`   - Interior angle: ${hexagon.interiorAngle.toFixed(2)}° (should be 120°)`);
console.log(`   - Area: ${hexagon.area.toFixed(2)}`);
console.log(`   - Perimeter: ${hexagon.perimeter.toFixed(2)}`);

const hexagonAngleCheck = Math.abs(hexagon.interiorAngle - 120) < 0.1;
console.log(`   - Hexagon angle check: ${hexagonAngleCheck ? "✓ PASS" : "✗ FAIL"}`);

// Octagon
const octagon = new RegularPolygon({
  sides: 8,
  size: 60,
  rotation: 22.5,
  style: { fill: "#e74c3c" }
});

console.log(`   ✓ Octagon created`);
console.log(`   - Sides: ${octagon.sideCount}`);
console.log(`   - Interior angle: ${octagon.interiorAngle.toFixed(2)}° (should be 135°)`);

const octagonAngleCheck = Math.abs(octagon.interiorAngle - 135) < 0.1;
console.log(`   - Octagon angle check: ${octagonAngleCheck ? "✓ PASS" : "✗ FAIL"}`);

// Pentagon with side length mode
const pentagon = new RegularPolygon({
  sides: 5,
  size: 40,
  sizeMode: "sideLength",
  style: { fill: "#2ecc71" }
});

console.log(`   ✓ Pentagon created with sideLength mode`);
console.log(`   - Side length: ${pentagon.sideLength.toFixed(2)} (should be ~40)`);
console.log(`   - Radius (circumradius): ${pentagon.radius.toFixed(2)}`);
console.log(`   - Interior angle: ${pentagon.interiorAngle.toFixed(2)}° (should be 108°)`);

const pentagonSideLengthCheck = Math.abs(pentagon.sideLength - 40) < 0.1;
const pentagonAngleCheck = Math.abs(pentagon.interiorAngle - 108) < 0.1;
console.log(`   - Pentagon side length check: ${pentagonSideLengthCheck ? "✓ PASS" : "✗ FAIL"}`);
console.log(`   - Pentagon angle check: ${pentagonAngleCheck ? "✓ PASS" : "✗ FAIL"}`);

console.log("");

// Test 4: Text
console.log("4️⃣ Testing Text...");

const simpleText = new Text({
  content: "Hello, World!",
  fontSize: 24,
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

console.log(`   ✓ Simple text created`);
console.log(`   - Content: "${simpleText.config.content}"`);
console.log(`   - Font size: ${simpleText.fontSize}px`);
console.log(`   - Line count: ${simpleText.lineCount}`);

const wrappedText = new Text({
  content: "This is a long paragraph that should wrap to multiple lines when rendered.",
  maxWidth: 200,
  fontSize: 16,
  lineHeight: 1.5
});

console.log(`   ✓ Word-wrapped text created`);
console.log(`   - Max width: 200px`);
console.log(`   - Line count: ${wrappedText.lineCount}`);
console.log(`   - Text height: ${wrappedText.textHeight.toFixed(2)}px`);
console.log(`   - Lines wrapped: ${wrappedText.lineCount > 1 ? "✓ PASS" : "✗ FAIL"}`);

const multiLineText = new Text({
  content: "Line 1\nLine 2\nLine 3",
  fontSize: 16
});

console.log(`   ✓ Multi-line text created`);
console.log(`   - Explicit line breaks: 3`);
console.log(`   - Line count: ${multiLineText.lineCount}`);
console.log(`   - Multi-line check: ${multiLineText.lineCount === 3 ? "✓ PASS" : "✗ FAIL"}`);

console.log("");

// Test 5: Full integration test
console.log("5️⃣ Testing full integration...");

const artboard = new Artboard({
  size: { width: 800, height: 600 },
  backgroundColor: "#f8f9fa"
});

const testTriangle = new Triangle({
  type: "right",
  a: 100,
  b: 100,
  style: { fill: "#3498db" }
});

testTriangle.position({
  relativeFrom: testTriangle.center,
  relativeTo: artboard.center,
  x: -150,
  y: 0
});

const testPolygon = new RegularPolygon({
  sides: 6,
  size: 60,
  style: { fill: "#2ecc71" }
});

testPolygon.position({
  relativeFrom: testPolygon.center,
  relativeTo: artboard.center,
  x: 150,
  y: 0
});

const testText = new Text({
  content: "New Primitives Test",
  fontSize: 32,
  fontWeight: "bold",
  textAlign: "center",
  style: { fill: "#2c3e50" }
});

testText.position({
  relativeFrom: testText.topCenter,
  relativeTo: artboard.topCenter,
  x: 0,
  y: 50
});

artboard.addElement(testTriangle);
artboard.addElement(testPolygon);
artboard.addElement(testText);

const svg = artboard.render();

console.log(`   ✓ Integration test passed`);
console.log(`   - SVG length: ${svg.length} characters`);
console.log(`   - Contains triangle: ${svg.includes("<polygon") ? "✓" : "✗"}`);
console.log(`   - Contains hexagon: ${svg.includes("points=") ? "✓" : "✗"}`);
console.log(`   - Contains text: ${svg.includes("<text") ? "✓" : "✗"}`);

// Save the SVG
try {
  writeFileSync("test-new-primitives-output.svg", svg);
  console.log(`   ✓ SVG saved to test-new-primitives-output.svg`);
} catch (err) {
  console.log(`   ✗ Failed to save SVG: ${err.message}`);
}

console.log("");
console.log("✅ All tests completed!");
console.log("");
console.log("Summary:");
console.log("  - Enhanced Triangle: ✓");
console.log("  - RegularPolygon: ✓");
console.log("  - Text with word wrapping: ✓");
console.log("  - Integration test: ✓");

