#!/usr/bin/env node

/**
 * Test Dataset Generation (First Example Only)
 * 
 * This is a test version that only processes the first example
 * to verify the script works correctly before running on all examples.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, 'server', '.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Paths
const EXAMPLES_DIR = path.join(projectRoot, 'playground', 'examples', 'tests');
const GUIDE_PATH = path.join(projectRoot, 'dataset', 'guides', 'v1.md');
const OUTPUT_DIR = path.join(projectRoot, 'dataset', 'simple_examples');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'test_output.jsonl');

// Read the system guide
const SYSTEM_GUIDE = fs.readFileSync(GUIDE_PATH, 'utf-8');

const SYSTEM_MESSAGE = `You are an assistant that responds with code for drawing whatever user has requested in our library.

${SYSTEM_GUIDE}`;

/**
 * Remove import statements from code
 */
function removeImports(code) {
  const lines = code.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    // Remove import statements
    if (trimmed.startsWith('import ') && trimmed.includes('from')) {
      return false;
    }
    // Remove comments (both single and multi-line start)
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return false;
    }
    return true;
  });
  
  // Remove leading empty lines
  while (filteredLines.length > 0 && filteredLines[0].trim() === '') {
    filteredLines.shift();
  }
  
  return filteredLines.join('\n');
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
1. First prompt should be ACCURATE with specific values, counts, colors, and layout details that match the code
2. Second prompt should be VAGUE/GENERAL without specific values, using phrases like "several", "a few", "some", etc.
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
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at understanding code and generating natural user prompts that would have resulted in that code. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    console.log(`✅ Generated prompts:`);
    console.log(`   Accurate: ${parsed.accurate}`);
    console.log(`   Vague: ${parsed.vague}`);
    
    return parsed;
  } catch (error) {
    console.error(`❌ Error generating prompts for ${exampleName}:`, error.message);
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
        role: 'system',
        content: SYSTEM_MESSAGE
      },
      {
        role: 'user',
        content: userPrompt
      },
      {
        role: 'assistant',
        content: assistantCode
      }
    ]
  };
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
 * Main function
 */
async function main() {
  console.log('🧪 Testing dataset generation on first example...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all example files
  const files = fs.readdirSync(EXAMPLES_DIR)
    .filter(f => f.endsWith('.js') && !f.includes('README'))
    .sort();

  if (files.length === 0) {
    console.error('❌ No example files found!');
    process.exit(1);
  }

  console.log(`📊 Found ${files.length} example files\n`);
  
  // Process only the first file
  const filename = files[0];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${filename}`);
  console.log('='.repeat(60));

  const filepath = path.join(EXAMPLES_DIR, filename);
  const code = fs.readFileSync(filepath, 'utf-8');
  
  console.log('\n📄 Original code (first 500 chars):');
  console.log('-'.repeat(60));
  console.log(code.substring(0, 500) + '...');
  console.log('-'.repeat(60));

  const codeWithoutImports = removeImports(code);
  
  console.log('\n📄 Code after removing imports (first 500 chars):');
  console.log('-'.repeat(60));
  console.log(codeWithoutImports.substring(0, 500) + '...');
  console.log('-'.repeat(60));

  // Generate prompts
  const prompts = await generatePromptsForExample(codeWithoutImports, filename);

  // Create training examples
  const accurateExample = createTrainingExample(prompts.accurate, codeWithoutImports);
  const vagueExample = createTrainingExample(prompts.vague, codeWithoutImports);

  // Write to output file with validation
  const lines = [accurateExample, vagueExample].map(ex => JSON.stringify(ex));
  
  // Validate each line before writing
  console.log('\n🔍 Validating JSON output...');
  let allValid = true;
  lines.forEach((line, index) => {
    const validation = validateJSON(line);
    if (validation.valid) {
      console.log(`✅ Entry ${index + 1}: Valid JSON`);
    } else {
      console.error(`❌ Entry ${index + 1}: Invalid JSON - ${validation.error}`);
      allValid = false;
    }
  });
  
  if (!allValid) {
    throw new Error('Generated invalid JSON - aborting');
  }
  
  const output = lines.join('\n') + '\n';
  fs.writeFileSync(OUTPUT_FILE, output);

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test complete!');
  console.log('='.repeat(60));
  console.log(`📄 Output saved to: ${OUTPUT_FILE}\n`);

  // Verify the output file can be read back
  console.log('🔍 Verifying saved file...');
  const savedContent = fs.readFileSync(OUTPUT_FILE, 'utf-8');
  const savedLines = savedContent.split('\n').filter(l => l.trim());
  
  let verifyValid = 0;
  let verifyInvalid = 0;
  
  savedLines.forEach((line, index) => {
    const validation = validateJSON(line);
    if (validation.valid) {
      verifyValid++;
    } else {
      verifyInvalid++;
      console.error(`❌ Saved line ${index + 1} is invalid: ${validation.error}`);
    }
  });
  
  console.log(`✅ Verified ${verifyValid} valid entries in saved file`);
  if (verifyInvalid > 0) {
    console.log(`❌ Found ${verifyInvalid} invalid entries`);
  }
  console.log();

  // Show the generated examples
  console.log('📋 Generated Training Examples:');
  console.log('='.repeat(60));
  
  console.log('\n1️⃣  ACCURATE PROMPT EXAMPLE:');
  console.log('-'.repeat(60));
  console.log('System:', accurateExample.messages[0].content.substring(0, 150) + '...');
  console.log('\nUser:', accurateExample.messages[1].content);
  console.log('\nAssistant (first 300 chars):', accurateExample.messages[2].content.substring(0, 300) + '...');
  console.log(`\nTotal assistant code length: ${accurateExample.messages[2].content.length} characters`);
  
  console.log('\n\n2️⃣  VAGUE PROMPT EXAMPLE:');
  console.log('-'.repeat(60));
  console.log('System:', vagueExample.messages[0].content.substring(0, 150) + '...');
  console.log('\nUser:', vagueExample.messages[1].content);
  console.log('\nAssistant (first 300 chars):', vagueExample.messages[2].content.substring(0, 300) + '...');
  console.log(`\nTotal assistant code length: ${vagueExample.messages[2].content.length} characters`);
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ You can now review the output and run the full script if satisfied.');
  console.log('='.repeat(60) + '\n');
}

// Run the script
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

