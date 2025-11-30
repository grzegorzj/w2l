#!/usr/bin/env node

/**
 * JSONL Validation Tool
 * 
 * Validates that a JSONL file contains valid JSON on each line
 * and checks the structure of training examples.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Validate that a JSON string is valid
 */
function validateJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return { valid: true, error: null, parsed };
  } catch (error) {
    return { valid: false, error: error.message, parsed: null };
  }
}

/**
 * Validate the structure of a training example
 */
function validateTrainingExample(obj, lineNumber) {
  const issues = [];

  // Check top-level structure
  if (!obj.messages || !Array.isArray(obj.messages)) {
    issues.push(`Line ${lineNumber}: Missing or invalid 'messages' array`);
    return issues;
  }

  // Check message count
  if (obj.messages.length !== 3) {
    issues.push(
      `Line ${lineNumber}: Expected 3 messages, got ${obj.messages.length}`
    );
  }

  // Check each message
  obj.messages.forEach((msg, idx) => {
    const roles = ["system", "user", "assistant"];
    const expectedRole = roles[idx];

    if (!msg.role) {
      issues.push(`Line ${lineNumber}, message ${idx}: Missing 'role' field`);
    } else if (msg.role !== expectedRole) {
      issues.push(
        `Line ${lineNumber}, message ${idx}: Expected role '${expectedRole}', got '${msg.role}'`
      );
    }

    if (!msg.content) {
      issues.push(
        `Line ${lineNumber}, message ${idx}: Missing 'content' field`
      );
    } else if (typeof msg.content !== "string") {
      issues.push(
        `Line ${lineNumber}, message ${idx}: 'content' must be a string`
      );
    }
  });

  return issues;
}

/**
 * Main validation function
 */
function validateFile(filepath) {
  console.log(`\n🔍 Validating: ${filepath}`);
  console.log("=".repeat(70) + "\n");

  if (!fs.existsSync(filepath)) {
    console.error(`❌ File not found: ${filepath}`);
    return false;
  }

  const content = fs.readFileSync(filepath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());

  console.log(`📊 Total lines: ${lines.length}\n`);

  let validCount = 0;
  let invalidCount = 0;
  const allIssues = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const validation = validateJSON(line);

    if (!validation.valid) {
      invalidCount++;
      const issue = `Line ${lineNumber}: Invalid JSON - ${validation.error}`;
      allIssues.push(issue);
      console.error(`❌ ${issue}`);

      // Show a snippet of the problematic line
      const snippet = line.substring(0, 100);
      console.error(`   Snippet: ${snippet}...`);
      console.error("");
    } else {
      // JSON is valid, now check the structure
      const structureIssues = validateTrainingExample(
        validation.parsed,
        lineNumber
      );

      if (structureIssues.length > 0) {
        invalidCount++;
        structureIssues.forEach((issue) => {
          allIssues.push(issue);
          console.error(`❌ ${issue}`);
        });
        console.error("");
      } else {
        validCount++;
        
        // Show stats for valid entries (only first few)
        if (validCount <= 3) {
          const example = validation.parsed;
          console.log(`✅ Line ${lineNumber}: Valid`);
          console.log(`   System message: ${example.messages[0].content.length} chars`);
          console.log(`   User message: ${example.messages[1].content.length} chars`);
          console.log(`   Assistant message: ${example.messages[2].content.length} chars`);
          console.log("");
        }
      }
    }
  });

  // Summary
  console.log("=".repeat(70));
  console.log("📋 VALIDATION SUMMARY");
  console.log("=".repeat(70));
  console.log(`✅ Valid entries: ${validCount}`);
  console.log(`❌ Invalid entries: ${invalidCount}`);
  console.log(`📊 Total entries: ${lines.length}`);
  
  if (validCount > 0) {
    console.log(`\n✨ Success rate: ${((validCount / lines.length) * 100).toFixed(1)}%`);
  }

  if (allIssues.length > 0) {
    console.log(`\n⚠️  Found ${allIssues.length} issue(s)`);
  } else {
    console.log(`\n🎉 All entries are valid!`);
  }

  console.log("=".repeat(70) + "\n");

  return invalidCount === 0;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: node validate-jsonl.js <path-to-jsonl-file>");
    console.log("\nExample:");
    console.log("  node validate-jsonl.js dataset/simple_examples/training_data.jsonl");
    console.log("  node validate-jsonl.js dataset/simple_examples/test_output.jsonl");
    process.exit(1);
  }

  const filepath = path.resolve(args[0]);
  const isValid = validateFile(filepath);

  process.exit(isValid ? 0 : 1);
}

main();


