# Deployment Checklist

Use this checklist when deploying the agentic pipeline to production.

## Pre-Deployment

### ✅ Code Verification

- [x] All prompt files pass syntax check
- [x] System prompt loads successfully (18,260 chars)
- [x] No linter errors in modified files
- [x] llm.js response schema is valid
- [x] Backward compatibility maintained

### ✅ Testing

```bash
# 1. Test prompt loading
cd server
node -e "import('./systemPrompt.js').then(m => console.log('✅', m.SYSTEM_PROMPT.length, 'chars'))"

# 2. Check syntax of all files
for f in ../playground/prompts/*.js systemPrompt.js llm.js; do 
  node --check "$f" && echo "✅ $f"; 
done

# 3. Verify no linter errors
# (already done - no errors found)
```

### ✅ Documentation

- [x] README.md explains architecture
- [x] IMPLEMENTATION-NOTES.md documents design decisions
- [x] QUICK-START.md provides usage guide
- [x] TWO-MESSAGE-APPROACH.md documents alternative
- [x] AGENTIC-PIPELINE-SUMMARY.md provides complete overview

## Deployment Steps

### 1. Commit Changes

```bash
git status
git add playground/prompts/
git add server/systemPrompt.js server/llm.js
git add AGENTIC-PIPELINE-SUMMARY.md
git commit -m "feat: Add agentic code generation pipeline

- Implement multi-step reasoning process (plan, outline, draft, review, final)
- Create modular prompt system in playground/prompts/
- Add comprehensive documentation and guides
- Maintain backward compatibility with simple response format
- Improve layout quality and API correctness"
```

### 2. Deploy to Server

```bash
# Pull latest on server
git pull origin main

# Install any new dependencies (if any)
cd server
npm install

# Restart the server
npm start
# OR with PM2:
pm2 restart w2l-server
```

### 3. Monitor Initial Requests

Watch server logs for:
```
✅ Parsed agentic output
hasPlan: true
hasReview: true
codeLength: [number]
```

If you see:
```
⚠️ Failed to parse structured output
```

This means the model isn't following the schema. Check:
1. Is the model set to use structured output?
2. Is the schema correctly configured in llm.js?
3. Are there any API changes needed?

## Post-Deployment

### Verify Functionality

**Test Case 1: Simple Diagram**
```
User request: "Create a circle"
Expected: Clean code with proper imports, single circle, renders
```

**Test Case 2: Complex Layout**
```
User request: "Create a 3-column dashboard with headers and charts"
Expected: Uses Container + ColumnsLayout, no overlaps, organized
```

**Test Case 3: Mathematical**
```
User request: "Show the quadratic formula"
Expected: Uses LaTeX, proper positioning, readable
```

### Monitor Metrics

Track for first 24 hours:
- [ ] API error rate (should be lower)
- [ ] User feedback on code quality (should improve)
- [ ] Response times (may be 2-3x longer, acceptable)
- [ ] Token usage (will be higher, expected)
- [ ] Frequency of overlapping elements (should be near zero)

### Success Indicators

✅ **Good Signs**:
- Users report better layouts
- Fewer "code doesn't work" issues
- More use of layout systems in generated code
- Clean, organized code structure
- Correct API calls

❌ **Warning Signs**:
- Frequent "Failed to parse" errors
- Response times too slow (>30s)
- Users complaining about verbosity
- Code quality unchanged or worse
- API errors still frequent

## Rollback Plan

If issues arise, you can quickly rollback:

### Option 1: Simple Mode (Keep Infrastructure)

In `server/llm.js`:
```javascript
// Change this line:
const responseSchema = simpleResponseSchema;
```

Restart server. This keeps the new prompts but uses simpler output.

### Option 2: Full Rollback

```bash
git revert HEAD
git push origin main
# Deploy
```

Then restart server.

## Troubleshooting

### Issue: "Unexpected identifier" error

**Cause**: Template literal backtick conflict
**Fix**: Check for unescaped backticks in prompt files
**Test**: `node --check playground/prompts/*.js`

### Issue: "Failed to parse structured output"

**Cause**: Model not returning expected JSON format
**Fix**: 
1. Check if GPT-5-codex supports structured output
2. Verify schema in llm.js matches expected format
3. Check if `strict: true` is causing issues

### Issue: Response too verbose

**Cause**: Full reasoning being shown to user
**Fix**: Edit `server/llm.js` response parser to show less:
```javascript
// Simplify the reasoning summary
reasoning = `**Goal**: ${parsed.plan.goal}`;
// Remove other parts
```

### Issue: Still seeing overlapping elements

**Cause**: Model not following layout guidance
**Fix**: 
1. Strengthen prompt in `generalPrompt.js`
2. Add explicit "NEVER use absolute positioning" rule
3. Add examples of correct layout usage

### Issue: Wrong API calls

**Cause**: Documentation search not working or being skipped
**Fix**:
1. Verify `search_documentation` tool is functional
2. Check vector index is populated
3. Add explicit API examples to prompts
4. Make documentation checks mandatory in schema

## Configuration Options

### Toggle Agentic Mode

In `server/llm.js`:
```javascript
// Use agentic (current)
const responseSchema = agenticResponseSchema;

// OR use simple (fallback)
const responseSchema = simpleResponseSchema;
```

### Customize Prompts

Edit files in `playground/prompts/`:
- **problemBreakdownPrompt.js** - Problem analysis approach
- **stylingPrompt.js** - Default styles and colors
- **generalPrompt.js** - Planning and layout strategy
- **systemPrompt.js** - Overall process flow

Changes take effect on server restart.

### Two-Phase Mode (Advanced)

See `TWO-MESSAGE-APPROACH.md` for implementation guide.

## Support Contacts

- **Architecture questions**: See `README.md`
- **Design decisions**: See `IMPLEMENTATION-NOTES.md`
- **Usage guide**: See `QUICK-START.md`
- **Full overview**: See `AGENTIC-PIPELINE-SUMMARY.md` (project root)

## Sign-Off

**Deployed by**: _________________
**Date**: _________________
**Version**: 1.0.0
**Status**: Production Ready ✅

**Notes**:
_________________________________
_________________________________
_________________________________

