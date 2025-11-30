#!/usr/bin/env node

/**
 * Dataset Statistics Analyzer
 * 
 * Analyzes JSONL training data and provides detailed statistics:
 * - Token counts (estimated)
 * - Character counts
 * - Message lengths
 * - Distribution analysis
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Estimate token count (rough approximation)
 * GPT models: ~1 token per 4 characters for English text
 * More accurate for code: ~1 token per 3.5 characters
 */
function estimateTokens(text) {
  // Use 3.75 as average between text and code
  return Math.ceil(text.length / 3.75);
}

/**
 * Calculate statistics for an array of numbers
 */
function calculateStats(numbers) {
  if (numbers.length === 0) return null;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length / 2)];
  
  // Standard deviation
  const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
  const stdDev = Math.sqrt(avgSquareDiff);
  
  return { min, max, avg, median, stdDev, sum };
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return Math.round(num).toLocaleString();
}

/**
 * Analyze a JSONL file
 */
function analyzeFile(filepath) {
  console.log(`\n📊 Analyzing: ${path.basename(filepath)}`);
  console.log("=".repeat(70) + "\n");

  if (!fs.existsSync(filepath)) {
    console.error(`❌ File not found: ${filepath}`);
    return;
  }

  const content = fs.readFileSync(filepath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());

  console.log(`📝 Total training examples: ${lines.length}\n`);

  // Collect data
  const systemTokens = [];
  const userTokens = [];
  const assistantTokens = [];
  const totalTokens = [];
  
  const systemChars = [];
  const userChars = [];
  const assistantChars = [];
  
  const userPromptTypes = { accurate: 0, vague: 0 };

  lines.forEach((line, index) => {
    try {
      const example = JSON.parse(line);
      
      if (example.messages && example.messages.length === 3) {
        const [system, user, assistant] = example.messages;
        
        // Token counts (estimated)
        const sysTokens = estimateTokens(system.content);
        const usrTokens = estimateTokens(user.content);
        const astTokens = estimateTokens(assistant.content);
        
        systemTokens.push(sysTokens);
        userTokens.push(usrTokens);
        assistantTokens.push(astTokens);
        totalTokens.push(sysTokens + usrTokens + astTokens);
        
        // Character counts
        systemChars.push(system.content.length);
        userChars.push(user.content.length);
        assistantChars.push(assistant.content.length);
        
        // Classify prompt type (rough heuristic)
        if (user.content.length > 500 || /\d+\s*px|\d+\s*pixel/i.test(user.content)) {
          userPromptTypes.accurate++;
        } else {
          userPromptTypes.vague++;
        }
      }
    } catch (error) {
      console.error(`⚠️  Error parsing line ${index + 1}: ${error.message}`);
    }
  });

  // Calculate statistics
  const systemStats = calculateStats(systemTokens);
  const userStats = calculateStats(userTokens);
  const assistantStats = calculateStats(assistantTokens);
  const totalStats = calculateStats(totalTokens);
  
  const systemCharStats = calculateStats(systemChars);
  const userCharStats = calculateStats(userChars);
  const assistantCharStats = calculateStats(assistantChars);

  // Display results
  console.log("📏 TOKEN STATISTICS (estimated)");
  console.log("=".repeat(70));
  
  console.log("\n🔷 System Messages (W2L Guide):");
  console.log(`   Average: ${formatNumber(systemStats.avg)} tokens`);
  console.log(`   Range: ${formatNumber(systemStats.min)} - ${formatNumber(systemStats.max)} tokens`);
  console.log(`   Total: ${formatNumber(systemStats.sum)} tokens`);
  
  console.log("\n🔷 User Messages (Prompts):");
  console.log(`   Average: ${formatNumber(userStats.avg)} tokens`);
  console.log(`   Median: ${formatNumber(userStats.median)} tokens`);
  console.log(`   Range: ${formatNumber(userStats.min)} - ${formatNumber(userStats.max)} tokens`);
  console.log(`   Std Dev: ${formatNumber(userStats.stdDev)} tokens`);
  console.log(`   Total: ${formatNumber(userStats.sum)} tokens`);
  
  console.log("\n🔷 Assistant Messages (Code):");
  console.log(`   Average: ${formatNumber(assistantStats.avg)} tokens`);
  console.log(`   Median: ${formatNumber(assistantStats.median)} tokens`);
  console.log(`   Range: ${formatNumber(assistantStats.min)} - ${formatNumber(assistantStats.max)} tokens`);
  console.log(`   Std Dev: ${formatNumber(assistantStats.stdDev)} tokens`);
  console.log(`   Total: ${formatNumber(assistantStats.sum)} tokens`);
  
  console.log("\n🔷 Complete Examples (System + User + Assistant):");
  console.log(`   Average: ${formatNumber(totalStats.avg)} tokens per example`);
  console.log(`   Median: ${formatNumber(totalStats.median)} tokens per example`);
  console.log(`   Range: ${formatNumber(totalStats.min)} - ${formatNumber(totalStats.max)} tokens`);
  console.log(`   Grand Total: ${formatNumber(totalStats.sum)} tokens`);
  
  console.log("\n\n📐 CHARACTER STATISTICS");
  console.log("=".repeat(70));
  
  console.log("\n🔷 System Messages:");
  console.log(`   Average: ${formatNumber(systemCharStats.avg)} characters`);
  
  console.log("\n🔷 User Messages:");
  console.log(`   Average: ${formatNumber(userCharStats.avg)} characters`);
  console.log(`   Range: ${formatNumber(userCharStats.min)} - ${formatNumber(userCharStats.max)} characters`);
  
  console.log("\n🔷 Assistant Messages:");
  console.log(`   Average: ${formatNumber(assistantCharStats.avg)} characters`);
  console.log(`   Range: ${formatNumber(assistantCharStats.min)} - ${formatNumber(assistantCharStats.max)} characters`);
  
  console.log("\n\n📊 PROMPT DISTRIBUTION");
  console.log("=".repeat(70));
  console.log(`   Accurate prompts (specific): ${userPromptTypes.accurate} (${Math.round(userPromptTypes.accurate / lines.length * 100)}%)`);
  console.log(`   Vague prompts (general): ${userPromptTypes.vague} (${Math.round(userPromptTypes.vague / lines.length * 100)}%)`);
  
  // Cost estimation (approximate)
  console.log("\n\n💰 COST ESTIMATION (Fireworks.ai Fine-tuning)");
  console.log("=".repeat(70));
  
  const totalInputTokens = systemStats.sum + userStats.sum;
  const totalOutputTokens = assistantStats.sum;
  
  console.log(`   Input tokens: ${formatNumber(totalInputTokens)}`);
  console.log(`   Output tokens: ${formatNumber(totalOutputTokens)}`);
  console.log(`   Total tokens: ${formatNumber(totalInputTokens + totalOutputTokens)}`);
  console.log(`   \n   Note: Actual costs vary by provider and model.`);
  console.log(`   Check Fireworks.ai pricing for current rates.`);
  
  // Distribution histogram (simple)
  console.log("\n\n📈 USER PROMPT LENGTH DISTRIBUTION");
  console.log("=".repeat(70));
  
  const buckets = [
    { min: 0, max: 100, label: "0-100 tokens" },
    { min: 100, max: 200, label: "100-200 tokens" },
    { min: 200, max: 300, label: "200-300 tokens" },
    { min: 300, max: 500, label: "300-500 tokens" },
    { min: 500, max: 1000, label: "500-1000 tokens" },
    { min: 1000, max: Infinity, label: "1000+ tokens" },
  ];
  
  buckets.forEach(bucket => {
    const count = userTokens.filter(t => t >= bucket.min && t < bucket.max).length;
    const percentage = Math.round(count / userTokens.length * 100);
    const bar = "█".repeat(Math.round(percentage / 2));
    console.log(`   ${bucket.label.padEnd(20)} ${bar} ${count} (${percentage}%)`);
  });
  
  console.log("\n\n📈 ASSISTANT CODE LENGTH DISTRIBUTION");
  console.log("=".repeat(70));
  
  const codeBuckets = [
    { min: 0, max: 500, label: "0-500 tokens" },
    { min: 500, max: 1000, label: "500-1000 tokens" },
    { min: 1000, max: 1500, label: "1000-1500 tokens" },
    { min: 1500, max: 2000, label: "1500-2000 tokens" },
    { min: 2000, max: 3000, label: "2000-3000 tokens" },
    { min: 3000, max: Infinity, label: "3000+ tokens" },
  ];
  
  codeBuckets.forEach(bucket => {
    const count = assistantTokens.filter(t => t >= bucket.min && t < bucket.max).length;
    const percentage = Math.round(count / assistantTokens.length * 100);
    const bar = "█".repeat(Math.round(percentage / 2));
    console.log(`   ${bucket.label.padEnd(20)} ${bar} ${count} (${percentage}%)`);
  });
  
  console.log("\n" + "=".repeat(70));
  console.log("✨ Analysis complete!\n");
  
  // Summary for quick reference
  console.log("\n📋 QUICK SUMMARY");
  console.log("=".repeat(70));
  console.log(`   Total examples: ${lines.length}`);
  console.log(`   Avg tokens per example: ${formatNumber(totalStats.avg)}`);
  console.log(`   Total dataset tokens: ${formatNumber(totalStats.sum)}`);
  console.log(`   Avg user prompt: ${formatNumber(userStats.avg)} tokens`);
  console.log(`   Avg assistant code: ${formatNumber(assistantStats.avg)} tokens`);
  console.log("=".repeat(70) + "\n");
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Default to training data file
    const defaultFile = path.join(
      projectRoot,
      "dataset",
      "simple_examples",
      "training_data.jsonl"
    );
    
    if (fs.existsSync(defaultFile)) {
      analyzeFile(defaultFile);
    } else {
      console.log("Usage: node analyze-dataset.js [path-to-jsonl-file]");
      console.log("\nNo file specified and default not found.");
      console.log("\nExamples:");
      console.log("  node scripts/analyze-dataset.js");
      console.log("  node scripts/analyze-dataset.js dataset/simple_examples/training_data.jsonl");
      console.log("  node scripts/analyze-dataset.js dataset/simple_examples/test_output.jsonl");
    }
  } else {
    const filepath = path.resolve(args[0]);
    analyzeFile(filepath);
  }
}

main();


