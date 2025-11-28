# W2L Training Dataset Generation

This directory contains the training dataset for fine-tuning AI models on the W2L library.

## Setup

Before running the dataset generation scripts, ensure you have:

1. **OpenAI API Key**: Set your OpenAI API key in `/server/.env`:
   ```bash
   cd server
   cp env.template .env
   # Edit .env and add your OPENAI_API_KEY
   ```

2. **Dependencies**: The required `openai` package is already installed in the root project.

## Usage

### ONE COMMAND - Generate Full Dataset

```bash
node scripts/generate-dataset.js
```

That's it! This single command will:
- ✅ Process all 43 example files
- ✅ Generate 86 training examples (2 per file: accurate + vague)
- ✅ Automatically escape all special characters (via `JSON.stringify()`)
- ✅ Validate each entry before writing (stops if invalid)
- ✅ Save progress after each file (resumable if interrupted)
- ✅ Final validation at completion
- ✅ Output to `/dataset/simple_examples/training_data.jsonl`

**Time**: ~45-60 seconds

**Result**: Ready-to-use JSONL file for Fireworks.ai fine-tuning

---

### Optional: Test First

If you want to test on just the first example before running the full generation:

```bash
node scripts/test-generate-dataset.js
```

This generates 2 examples and validates them, saving to `test_output.jsonl`.

### Optional: Manual Validation

Validation happens automatically during generation, but you can manually validate any JSONL file:

```bash
node scripts/validate-jsonl.js dataset/simple_examples/training_data.jsonl
```

### Analyze Dataset Statistics

View comprehensive statistics about your generated dataset:

```bash
node scripts/analyze-dataset.js
# Or specify a file:
node scripts/analyze-dataset.js dataset/simple_examples/training_data.jsonl
```

Shows:
- Token counts (estimated) for each message type
- Character statistics
- Prompt distribution (accurate vs vague)
- Cost estimation for fine-tuning
- Length distribution histograms
- Quick summary

## Output Format

The generated JSONL file follows the Fireworks.ai training format:

```jsonl
{"messages":[{"role":"system","content":"..."},{"role":"user","content":"..."},{"role":"assistant","content":"..."}]}
{"messages":[{"role":"system","content":"..."},{"role":"user","content":"..."},{"role":"assistant","content":"..."}]}
```

Each line contains:
- **System message**: W2L library guide and instructions
- **User message**: Generated prompt describing what to draw
- **Assistant message**: Example code (with imports removed)

## Prompt Types

For each example, two types of prompts are generated:

1. **Accurate**: Specific values, counts, colors, and layout details
   - Example: "Create three circles with radii 60px, positioned in a vertical column with 20px spacing..."

2. **Vague**: General descriptions without specific values
   - Example: "Create several circles arranged vertically with some spacing..."

## File Structure

```
dataset/
├── README.md                           # This file
├── guides/
│   └── v1.md                          # System guide included in training
└── simple_examples/
    ├── progress.json                   # Progress tracking (auto-generated)
    ├── test_output.jsonl              # Test output (from test script)
    └── training_data.jsonl            # Full training dataset (from main script)
```

## Resuming Interrupted Generation

The main script (`generate-dataset.js`) saves progress after each file. If interrupted:
- Simply run the script again
- It will automatically skip already-processed files
- Progress is tracked in `/dataset/simple_examples/progress.json`

## JSON Escaping & Validation

### How It Works

The scripts automatically handle JSON escaping:
- JavaScript code contains quotes, newlines, backslashes
- `JSON.stringify()` automatically escapes all special characters
- Each entry is validated **before** writing to file
- Final verification step checks the entire output

### What's Validated

1. **JSON Syntax**: Each line must be valid JSON
2. **Message Structure**: Must have system, user, assistant messages
3. **Required Fields**: Each message needs `role` and `content`
4. **Data Types**: All content must be strings

If validation fails, the script stops immediately with a detailed error message.

## Troubleshooting

### Missing API Key Error

```
OpenAIError: Missing credentials
```

**Solution**: Ensure `OPENAI_API_KEY` is set in `/server/.env`

### Rate Limiting

The script includes a 1-second delay between API calls to respect rate limits. If you encounter rate limiting errors:
- Wait a few minutes
- Resume by running the script again (progress is saved)

### Module Not Found

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'openai'
```

**Solution**: Run `npm install openai` from the project root

### Invalid JSON Output

If you see "Invalid JSON generated" errors:
1. Check the error message for details
2. The script will stop immediately (no invalid data written)
3. Check the specific file that caused the issue
4. Use the validation script to inspect the problem

### Verifying Output Quality

After generation, always validate:

```bash
node scripts/validate-jsonl.js dataset/simple_examples/training_data.jsonl
```

Should show 100% success rate with no errors.

