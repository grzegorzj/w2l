# W2L Playground Prompts

This directory contains the structured prompt system for the w2l playground's AI assistant. The prompts guide the LLM through a multi-step agentic reasoning process to generate high-quality visualization code.

## Architecture

The prompt system is designed to encourage systematic, well-reasoned code generation through multiple phases:

### Files

- **`systemPrompt.js`** - Main system prompt that orchestrates the entire process
- **`problemBreakdownPrompt.js`** - Guides the AI through conceptual problem breakdown
- **`stylingPrompt.js`** - Provides styling guidelines and defaults
- **`generalPrompt.js`** - Contains development planning guidance

## The Agentic Pipeline

The AI follows this structured approach:

### 1. **Plan Phase**
- Restate the user's request
- Identify key visual elements
- Outline major implementation steps

### 2. **Outline Phase**
- **Problem Breakdown**: Conceptual understanding of what to show (using `problemBreakdownPrompt.js`)
- **Styling Decisions**: Choose colors, typography, spacing (using `stylingPrompt.js`)
- **Development Plan**: Break down into concrete implementation steps (using `generalPrompt.js`)

### 3. **Draft Code Phase**
- Write initial implementation based on the outline
- Focus on structure and logic
- Use w2l API based on current understanding

### 4. **Review Phase**
- **Documentation Checks**: Use `search_documentation` tool to verify API usage
  - Check every w2l class instantiation
  - Verify method signatures
  - Compare actual API with draft usage
- **Static Quality Review**: Assess correctness, robustness, design, and performance

### 5. **Final Code Phase**
- Apply all fixes identified in review
- Produce final, executable code
- Include usage notes and change summary

## Response Schema

The LLM returns a structured JSON response with this format:

```json
{
  "plan": {
    "goal": "...",
    "steps": [...]
  },
  "outline": [...],
  "draft_code": {
    "language": "javascript",
    "code": "..."
  },
  "review": {
    "documentation_checks": [...],
    "static_quality_review": {...}
  },
  "final_code": {
    "language": "javascript",
    "code": "...",
    "usage_notes": "...",
    "differences_from_draft": "..."
  }
}
```

## Why This Approach?

This multi-step reasoning approach addresses common issues with one-shot code generation:

1. **Prevents overlapping elements**: Spatial planning happens before implementation
2. **Reduces API errors**: Explicit documentation checks catch mistakes
3. **Improves layout quality**: Systematic thinking about structure and hierarchy
4. **Better styling**: Consistent, deliberate design decisions
5. **Self-correction**: Review phase catches and fixes errors before final output

## Usage

The prompts are automatically loaded by the server:

```javascript
// server/systemPrompt.js
import { SYSTEM_PROMPT } from "../playground/prompts/systemPrompt.js";
```

The server's LLM module (`server/llm.js`) uses the agentic schema and parses the structured response to extract:
- Planning and reasoning information (shown to user)
- Final code (injected into the playground editor)

## Customization

To modify the AI's behavior:

1. **Change planning guidance**: Edit `problemBreakdownPrompt.js`
2. **Adjust styling defaults**: Edit `stylingPrompt.js`
3. **Refine development approach**: Edit `generalPrompt.js`
4. **Modify overall flow**: Edit `systemPrompt.js`

All prompts are imported as JavaScript modules, allowing for easy composition and reuse.

## Benefits of Modular Structure

- **Maintainability**: Each phase has its own file
- **Reusability**: Individual prompts can be reused or remixed
- **Testability**: Can test each prompt component independently
- **Clarity**: Separation of concerns makes the system easier to understand
- **Evolution**: Easy to add new phases or modify existing ones

## Integration with Playground

The playground frontend receives:
1. **Reasoning stream**: High-level summary of plan, outline, and review
2. **Final code**: Complete, executable w2l code ready to render
3. **Metadata**: Usage notes and change descriptions

This provides transparency into the AI's reasoning while delivering production-ready code.

