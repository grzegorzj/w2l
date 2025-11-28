#!/usr/bin/env node

/**
 * Generate Training Dataset for Fireworks.ai
 *
 * This script:
 * 1. Reads all example files from playground/examples/tests/
 * 2. For each example, uses OpenAI to generate 2 plausible user prompts:
 *    - One accurate (with specific values, counts, layouts)
 *    - One vague (general descriptions)
 * 3. Removes import statements from code
 * 4. Creates JSONL output for Fireworks.ai fine-tuning
 * 5. Saves progress to resume if interrupted
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(projectRoot, "server", ".env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Paths
const EXAMPLES_DIR = path.join(projectRoot, "playground", "examples", "tests");
const GUIDE_PATH = path.join(projectRoot, "dataset", "guides", "v1.md");
const OUTPUT_DIR = path.join(projectRoot, "dataset", "simple_examples");
const PROGRESS_FILE = path.join(OUTPUT_DIR, "progress.json");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "training_data.jsonl");

// Read the system guide
const SYSTEM_GUIDE = fs.readFileSync(GUIDE_PATH, "utf-8");

const SYSTEM_MESSAGE = `You are an assistant that responds with code for drawing whatever user has requested in our library.

${SYSTEM_GUIDE}`;

/**
 * Remove import statements from code
 */
function removeImports(code) {
  const lines = code.split("\n");
  const filteredLines = lines.filter((line) => {
    const trimmed = line.trim();
    // Remove import statements
    if (trimmed.startsWith("import ") && trimmed.includes("from")) {
      return false;
    }
    // Remove comments (both single and multi-line start)
    if (
      trimmed.startsWith("//") ||
      trimmed.startsWith("/*") ||
      trimmed.startsWith("*")
    ) {
      return false;
    }
    return true;
  });

  // Remove leading empty lines
  while (filteredLines.length > 0 && filteredLines[0].trim() === "") {
    filteredLines.shift();
  }

  return filteredLines.join("\n");
}

/**
 * Generate prompts for a given example using OpenAI
 */
async function generatePromptsForExample(exampleCode, exampleName) {
  console.log(`\n📝 Generating prompts for: ${exampleName}`);

  const prompt = `Given the following visualization code, generate TWO plausible user prompts that would have resulted in this code being written.

The code:
\`\`\`javascript
${exampleCode}
\`\`\`

Requirements:
1. First prompt should be ACCURATE with specific values, counts, colors, and layout details that match the code. Don't EVER include requests for logging - the user only sees the image.
2. Second prompt should be VAGUE/GENERAL without specific values, using phrases like "several", "a few", "some", etc., or general concepts
3. Both prompts must NOT mention any library-specific elements or API details
4. Prompts should describe WHAT to draw, not HOW to code it
5. Focus on the visual outcome, not implementation details

Return your response as a JSON object with this structure:
{
  "accurate": "First prompt with specific details...",
  "vague": "Second prompt with general descriptions..."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert at understanding code and generating natural user prompts that would have resulted in that code. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    console.log(`✅ Generated prompts:`);
    console.log(`   Accurate: ${parsed.accurate.substring(0, 80)}...`);
    console.log(`   Vague: ${parsed.vague.substring(0, 80)}...`);

    return parsed;
  } catch (error) {
    console.error(
      `❌ Error generating prompts for ${exampleName}:`,
      error.message
    );
    throw error;
  }
}

/**
 * Create a training example in Fireworks.ai format
 */
function createTrainingExample(userPrompt, assistantCode) {
  return {
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGE,
      },
      {
        role: "user",
        content: userPrompt,
      },
      {
        role: "assistant",
        content: assistantCode,
      },
    ],
  };
}

/**
 * Load progress from file
 */
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    const data = fs.readFileSync(PROGRESS_FILE, "utf-8");
    return JSON.parse(data);
  }
  return { processedFiles: [], lastIndex: -1 };
}

/**
 * Save progress to file
 */
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/**
 * Validate that a JSON string is valid
 */
function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Append a training example to the JSONL file
 */
function appendToOutput(example) {
  // JSONL format: one JSON object per line
  // JSON.stringify automatically handles escaping
  const line = JSON.stringify(example) + "\n";

  // Validate the JSON before writing
  const validation = validateJSON(line.trim());
  if (!validation.valid) {
    throw new Error(`Invalid JSON generated: ${validation.error}`);
  }

  fs.appendFileSync(OUTPUT_FILE, line);
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting dataset generation...\n");
  console.log(`📂 Examples directory: ${EXAMPLES_DIR}`);
  console.log(`📄 Output file: ${OUTPUT_FILE}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all example files
  const files = fs
    .readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith(".js") && !f.includes("README"))
    .sort();

  console.log(`📊 Found ${files.length} example files\n`);

  // Load progress
  const progress = loadProgress();
  console.log(
    `📋 Progress: ${progress.processedFiles.length} files already processed\n`
  );

  // If starting fresh, clear the output file
  if (progress.processedFiles.length === 0 && fs.existsSync(OUTPUT_FILE)) {
    fs.unlinkSync(OUTPUT_FILE);
    console.log("🗑️  Cleared existing output file\n");
  }

  // Process each example
  for (let i = 0; i < files.length; i++) {
    const filename = files[i];

    // Skip if already processed
    if (progress.processedFiles.includes(filename)) {
      console.log(`⏭️  Skipping ${filename} (already processed)`);
      continue;
    }

    console.log(`\n${"=".repeat(60)}`);
    console.log(`Processing [${i + 1}/${files.length}]: ${filename}`);
    console.log("=".repeat(60));

    const filepath = path.join(EXAMPLES_DIR, filename);
    const code = fs.readFileSync(filepath, "utf-8");
    const codeWithoutImports = removeImports(code);

    try {
      // Generate prompts
      const prompts = await generatePromptsForExample(
        codeWithoutImports,
        filename
      );

      // Create training examples
      const accurateExample = createTrainingExample(
        prompts.accurate,
        codeWithoutImports
      );
      const vagueExample = createTrainingExample(
        prompts.vague,
        codeWithoutImports
      );

      // Append to output file
      appendToOutput(accurateExample);
      appendToOutput(vagueExample);

      // Update progress
      progress.processedFiles.push(filename);
      progress.lastIndex = i;
      saveProgress(progress);

      console.log(`✅ Successfully processed ${filename}`);
      console.log(`   Created 2 training examples`);

      // Rate limiting - wait 1 second between API calls
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`\n❌ Failed to process ${filename}:`, error.message);
      console.log(
        `💾 Progress saved. You can resume by running the script again.\n`
      );
      process.exit(1);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎉 Dataset generation complete!");
  console.log("=".repeat(60));
  console.log(`📊 Total files processed: ${progress.processedFiles.length}`);
  console.log(
    `📊 Total training examples: ${progress.processedFiles.length * 2}`
  );
  console.log(`📄 Output saved to: ${OUTPUT_FILE}\n`);

  // Final validation
  console.log("🔍 Final validation...");
  const outputContent = fs.readFileSync(OUTPUT_FILE, "utf-8");
  const lines = outputContent.split("\n").filter((l) => l.trim());

  let validCount = 0;
  let invalidCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const validation = validateJSON(lines[i]);
    if (validation.valid) {
      validCount++;
    } else {
      invalidCount++;
      console.error(`❌ Line ${i + 1}: Invalid JSON - ${validation.error}`);
    }
  }

  console.log(`✅ Valid entries: ${validCount}/${lines.length}`);

  if (invalidCount > 0) {
    console.error(`\n❌ VALIDATION FAILED: ${invalidCount} invalid entries`);
    process.exit(1);
  }

  console.log(`\n🎉 100% Valid! Dataset ready for Fireworks.ai\n`);
}

// Run the script
main().catch((error) => {
  console.error("\n💥 Fatal error:", error);
  process.exit(1);
});
