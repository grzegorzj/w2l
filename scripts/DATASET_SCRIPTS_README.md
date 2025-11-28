# Dataset Generation Scripts

Quick reference for the dataset generation and validation scripts.

## Scripts Overview

### 1. `test-generate-dataset.js` - Test on First Example
**Purpose**: Test the generation process on a single example before running the full dataset

**Usage**:
```bash
node scripts/test-generate-dataset.js
```

**Output**: 
- Creates `/dataset/simple_examples/test_output.jsonl`
- 2 training examples (accurate & vague prompts)

**Validation**: 
- ✅ Validates JSON before writing
- ✅ Verifies saved file after writing
- Shows detailed preview of generated examples

---

### 2. `generate-dataset.js` - Generate Full Dataset
**Purpose**: Generate the complete training dataset from all examples

**Usage**:
```bash
node scripts/generate-dataset.js
```

**Output**:
- Creates `/dataset/simple_examples/training_data.jsonl`
- 86 training examples (43 files × 2 prompts each)
- Progress tracked in `/dataset/simple_examples/progress.json`

**Features**:
- ✅ Validates each entry before writing
- ✅ Saves progress after each file (resumable)
- ✅ Verifies entire output at completion
- ⏱️ Rate limiting (1 second between API calls)
- 📊 Detailed statistics at completion

**Time**: ~45-60 seconds

---

### 3. `validate-jsonl.js` - Validate JSONL Files
**Purpose**: Validate any JSONL file for correct JSON syntax and structure

**Usage**:
```bash
node scripts/validate-jsonl.js <path-to-file>

# Examples:
node scripts/validate-jsonl.js dataset/simple_examples/training_data.jsonl
node scripts/validate-jsonl.js dataset/simple_examples/test_output.jsonl
```

**Checks**:
- ✅ Valid JSON syntax on each line
- ✅ Proper character escaping
- ✅ Correct message structure (system, user, assistant)
- ✅ Required fields present
- ✅ Correct data types

**Output**:
- Detailed validation report
- Line-by-line error messages (if any)
- Success rate percentage
- Exit code 0 for valid, 1 for invalid

---

### 4. `analyze-dataset.js` - Dataset Statistics
**Purpose**: Analyze JSONL files and show comprehensive statistics

**Usage**:
```bash
node scripts/analyze-dataset.js [path-to-file]

# If no path provided, defaults to training_data.jsonl
node scripts/analyze-dataset.js

# Or specify a file:
node scripts/analyze-dataset.js dataset/simple_examples/test_output.jsonl
```

**Shows**:
- 📏 Token statistics (estimated)
  - System messages (W2L guide)
  - User messages (prompts)
  - Assistant messages (code)
  - Total per example
- 📐 Character statistics
- 📊 Prompt distribution (accurate vs vague)
- 💰 Cost estimation for fine-tuning
- 📈 Length distribution histograms
- 📋 Quick summary

**Output Example**:
```
📝 Total training examples: 86
Avg tokens per example: 5,619
Total dataset tokens: 483,193
Avg user prompt: 163 tokens
Avg assistant code: 1,567 tokens
```

---

## Typical Workflow

1. **Test First**:
   ```bash
   node scripts/test-generate-dataset.js
   ```
   Review the output in `dataset/simple_examples/test_output.jsonl`

2. **Validate Test Output**:
   ```bash
   node scripts/validate-jsonl.js dataset/simple_examples/test_output.jsonl
   ```
   Should show 100% success rate

3. **Generate Full Dataset**:
   ```bash
   node scripts/generate-dataset.js
   ```
   This will take about 1 minute

4. **Validate Final Output**:
   ```bash
   node scripts/validate-jsonl.js dataset/simple_examples/training_data.jsonl
   ```
   Should show 100% success rate with 86 valid entries

5. **Analyze Statistics** (optional):
   ```bash
   node scripts/analyze-dataset.js
   ```
   View token counts, distributions, cost estimates, etc.

---

## JSON Validation Details

### How Escaping Works

JavaScript code contains many special characters:
- Quotes: `"` and `'`
- Backslashes: `\`
- Newlines: `\n`
- Unicode characters

`JSON.stringify()` automatically escapes all of these:
- `"` becomes `\"`
- `\` becomes `\\`
- Newlines become `\n`
- etc.

### What Gets Validated

Each JSONL line must be a valid JSON object with this structure:

```json
{
  "messages": [
    {
      "role": "system",
      "content": "..."
    },
    {
      "role": "user",
      "content": "..."
    },
    {
      "role": "assistant",
      "content": "..."
    }
  ]
}
```

### Validation Timing

1. **During Generation**: Each entry validated BEFORE writing
   - Prevents writing invalid data
   - Fails immediately on error
   
2. **After Generation**: Complete file verified
   - Confirms all entries are valid
   - Provides statistics

3. **Manual Validation**: Use validation script anytime
   - Check existing files
   - Verify downloads
   - Debug issues

---

## Error Handling

### If Generation Fails

The script saves progress automatically. To resume:
```bash
node scripts/generate-dataset.js
```

It will skip already-processed files.

### If Validation Fails

1. Check the error message for the specific line
2. Use validation script to see detailed errors:
   ```bash
   node scripts/validate-jsonl.js <file>
   ```
3. Fix the issue or regenerate that entry

### To Start Fresh

Delete the progress file:
```bash
rm dataset/simple_examples/progress.json
```

Then run the generation script again.

---

## Requirements

- ✅ Node.js installed
- ✅ `openai` package installed (`npm install openai`)
- ✅ `OPENAI_API_KEY` set in `/server/.env`

---

## Output Format

The generated JSONL follows Fireworks.ai format:
- One JSON object per line
- No trailing commas
- Proper escaping of all special characters
- System message includes full W2L library guide
- User messages are library-agnostic
- Assistant messages contain code without imports

