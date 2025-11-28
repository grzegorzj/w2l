# Dataset Generation - Quick Start

## ONE Command to Generate Everything

```bash
node scripts/generate-dataset.js
```

That's it! ✨

## What It Does

1. **Reads** all 43 example files from `playground/examples/tests/`
2. **Generates** 2 prompts per example using GPT-4o:
   - One accurate (with specific values, counts, colors)
   - One vague (general descriptions)
3. **Escapes** code automatically via `JSON.stringify()`
   - Quotes, newlines, backslashes all handled
   - No manual escaping needed
4. **Validates** each entry before writing
   - Script stops immediately if invalid JSON detected
   - No bad data ever written to file
5. **Saves** progress after each file
   - Can resume if interrupted
6. **Final validation** at completion
   - Confirms 100% valid JSONL
7. **Outputs** to `dataset/simple_examples/training_data.jsonl`
   - Ready for Fireworks.ai fine-tuning
   - No additional processing needed

## Output

- **86 training examples** (43 files × 2 prompts)
- **JSONL format** (one JSON object per line)
- **100% valid** (validated before and after writing)
- **Properly escaped** (all special characters handled)

## Example Output

Each line in the JSONL file:

```json
{"messages":[{"role":"system","content":"[14.5k char W2L guide]"},{"role":"user","content":"Draw three circles..."},{"role":"assistant","content":"const artboard = new Artboard..."}]}
```

## Time Required

~45-60 seconds (1 second rate limiting between API calls)

## Prerequisites

- ✅ `OPENAI_API_KEY` set in `/server/.env`
- ✅ `openai` package installed (already done)

## If It Gets Interrupted

Just run the same command again:

```bash
node scripts/generate-dataset.js
```

It will skip already-processed files and continue where it left off.

## Result

After completion, you'll see:

```
🎉 Dataset generation complete!
📊 Total files processed: 43
📊 Total training examples: 86
📄 Output saved to: dataset/simple_examples/training_data.jsonl

🔍 Final validation...
✅ Valid entries: 86/86

🎉 100% Valid! Dataset ready for Fireworks.ai
```

The file is immediately ready to upload to Fireworks.ai for fine-tuning. No additional steps needed!

## Analyze Dataset Statistics

After generation, you can view detailed statistics:

```bash
node scripts/analyze-dataset.js
```

This shows:
- 📊 Token counts (system, user, assistant messages)
- 📐 Character statistics
- 📈 Distribution histograms
- 💰 Cost estimation
- 📋 Quick summary

Example output:
```
📝 Total training examples: 86
📊 Avg tokens per example: 5,619
📊 Total dataset tokens: 483,193
📊 Avg user prompt: 163 tokens
📊 Avg assistant code: 1,567 tokens
```

