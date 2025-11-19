# Two-Message Agentic Approach (Optional Implementation)

## Overview

This document describes how to implement a two-message pipeline if needed. The current implementation uses a single-message approach, but splitting into two messages could provide benefits in certain scenarios.

## When to Consider Two Messages

Consider implementing this if:
- You want to show users the draft code before corrections
- You need to reduce per-request token usage
- You want explicit user control over the review process
- You're experiencing timeout issues with long responses
- You want to gather data on draft vs. final code quality

## Implementation Guide

### Step 1: Create Two Schemas

#### File: `server/llm.js`

Add two new schemas:

```javascript
// Phase 1: Planning and Draft
const agenticPhase1Schema = {
  type: "object",
  properties: {
    plan: {
      type: "object",
      description: "High-level plan",
      properties: {
        goal: { type: "string" },
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              description: { type: "string" }
            },
            required: ["id", "description"]
          }
        }
      },
      required: ["goal", "steps"]
    },
    outline: {
      type: "array",
      description: "Detailed solution outline",
      items: {
        type: "object",
        properties: {
          section_id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" }
        },
        required: ["section_id", "title", "description"]
      }
    },
    draft_code: {
      type: "object",
      properties: {
        language: { type: "string" },
        code: { type: "string" },
        entry_point_description: { type: "string" }
      },
      required: ["language", "code"]
    }
  },
  required: ["plan", "outline", "draft_code"],
  additionalProperties: false
};

// Phase 2: Review and Final
const agenticPhase2Schema = {
  type: "object",
  properties: {
    review: {
      type: "object",
      description: "Structured review of the draft code",
      properties: {
        documentation_checks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              check_id: { type: "string" },
              description: { type: "string" },
              related_code_snippet: { type: "string" },
              tool_name: { type: "string" },
              tool_request_payload: { type: "object" },
              tool_response_summary: { type: "string" },
              result: { 
                type: "string",
                enum: ["passes", "fails", "inconclusive"]
              },
              required_changes: { type: "string" }
            },
            required: [
              "check_id", "description", "related_code_snippet",
              "tool_name", "tool_request_payload", "tool_response_summary",
              "result", "required_changes"
            ]
          }
        },
        static_quality_review: {
          type: "object",
          properties: {
            correctness_assessment: { type: "string" },
            robustness_assessment: { type: "string" },
            design_assessment: { type: "string" },
            performance_considerations: { type: "string" }
          },
          required: [
            "correctness_assessment", "robustness_assessment",
            "design_assessment", "performance_considerations"
          ]
        }
      },
      required: ["documentation_checks", "static_quality_review"]
    },
    final_code: {
      type: "object",
      properties: {
        language: { type: "string" },
        code: { type: "string" },
        usage_notes: { type: "string" },
        differences_from_draft: { type: "string" }
      },
      required: ["language", "code"]
    }
  },
  required: ["review", "final_code"],
  additionalProperties: false
};
```

### Step 2: Create Two System Prompts

#### File: `playground/prompts/phase1SystemPrompt.js`

```javascript
import { buildCondensedContext } from "../../server/documentation.js";
import { PROBLEM_BREAKDOWN_PROMPT } from "./problemBreakdownPrompt.js";
import { STYLING_PROMPT } from "./stylingPrompt.js";
import { GENERAL_PROMPT } from "./generalPrompt.js";

const DOCUMENTATION_CONTEXT = buildCondensedContext();

export const PHASE1_SYSTEM_PROMPT = 
  `You are creating a DRAFT visualization using the w2l library.

${DOCUMENTATION_CONTEXT}

Your task is to:
1. PLAN the visualization
2. Create a detailed OUTLINE
3. Write DRAFT CODE

You will NOT review or fix the code in this step - just create a working draft.

` + 
  PROBLEM_BREAKDOWN_PROMPT +
  "\n\n" +
  STYLING_PROMPT +
  "\n\n" +
  GENERAL_PROMPT +
  `

## Your Response

Provide:
1. **Plan**: Restate the goal and list your steps
2. **Outline**: Detailed breakdown of sections, styling, and implementation
3. **Draft Code**: Complete, executable code based on your current understanding

Don't worry about perfection - this is a draft. The next step will review and improve it.`;
```

#### File: `playground/prompts/phase2SystemPrompt.js`

```javascript
import { buildCondensedContext } from "../../server/documentation.js";

const DOCUMENTATION_CONTEXT = buildCondensedContext();

export const PHASE2_SYSTEM_PROMPT = 
  `You are REVIEWING and CORRECTING draft w2l code.

${DOCUMENTATION_CONTEXT}

## Your Task

You have been given draft code. Now you must:

1. **Review**: Check every API usage against documentation
2. **Correct**: Fix any errors found
3. **Finalize**: Produce the corrected, production-ready code

## Critical: Use Documentation Search

For EVERY w2l class and method in the draft, you MUST:
- Use the \`search_documentation\` tool
- Verify the actual API signature
- Note any discrepancies
- Specify required corrections

## Review Process

For each major component:
1. Identify the w2l class/method used
2. Search documentation: search_documentation("ClassName API")
3. Compare draft with actual API
4. Document findings (passes/fails/changes needed)

Also perform static quality review:
- Correctness: Will it work?
- Robustness: Edge cases handled?
- Design: Clean structure?
- Performance: Any issues?

## Final Code

Apply ALL corrections from the review. The final code must:
- Use correct API signatures
- Have all necessary imports
- End with artboard.render()
- Be complete and executable

Include:
- Usage notes for the user
- Summary of what changed from the draft`;
```

### Step 3: Modify Chat Endpoint

#### File: `server/server.js`

Update the chat endpoint to handle two-phase generation:

```javascript
app.post("/api/conversations/:id/chat", async (req, res) => {
  // ... existing setup ...

  const { message, currentCode, twoPhaseMode } = req.body;

  if (twoPhaseMode) {
    // Phase 1: Draft generation
    const phase1Result = await generatePhase1(conversationId, message, currentCode);
    
    // Send draft to user
    res.write(`data: ${JSON.stringify({ 
      type: "draft", 
      plan: phase1Result.plan,
      outline: phase1Result.outline,
      code: phase1Result.draft_code.code 
    })}\n\n`);

    // Phase 2: Review and correction
    const phase2Result = await generatePhase2(conversationId, phase1Result);
    
    // Send final code
    res.write(`data: ${JSON.stringify({ 
      type: "final",
      review: phase2Result.review,
      code: phase2Result.final_code.code,
      changes: phase2Result.final_code.differences_from_draft
    })}\n\n`);

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } else {
    // Use existing single-message approach
    // ... existing code ...
  }
});
```

### Step 4: Add Helper Functions

#### File: `server/llm.js`

```javascript
export async function generatePhase1(conversationId, message, currentCode) {
  // Call LLM with phase1SystemPrompt and phase1Schema
  // Return parsed result
}

export async function generatePhase2(conversationId, phase1Result) {
  // Build prompt with draft code as context
  // Call LLM with phase2SystemPrompt and phase2Schema
  // Return parsed result
}
```

### Step 5: Update Frontend

#### File: `playground/src/components/Chat.tsx` (or similar)

Add UI to:
1. Show draft code in a preview pane
2. Display "Reviewing and correcting..." message
3. Show final code with highlighted changes
4. Optionally allow user to approve/reject draft before phase 2

```typescript
const [draftCode, setDraftCode] = useState<string | null>(null);
const [reviewInProgress, setReviewInProgress] = useState(false);

// In message handler:
if (data.type === 'draft') {
  setDraftCode(data.code);
  setReviewInProgress(true);
  // Show draft in preview
}

if (data.type === 'final') {
  setReviewInProgress(false);
  // Show final code and changes
}
```

## Configuration

Add a feature flag to switch between modes:

```javascript
// server/config.js
export const config = {
  agenticMode: 'single', // 'single' or 'two-phase'
};
```

Or allow per-request control:

```javascript
// In chat request body
{
  "message": "Create a diagram",
  "twoPhaseMode": true  // Optional flag
}
```

## Benefits of Two-Phase Approach

1. **Transparency**: Users see the draft and review process
2. **User Control**: Users can approve/modify draft before review
3. **Token Efficiency**: Can skip phase 2 if draft is acceptable
4. **Debugging**: Easier to see where errors were caught
5. **Data Collection**: Gather metrics on draft quality

## Drawbacks

1. **Complexity**: More code to maintain
2. **Latency**: Takes longer to get final result
3. **State Management**: Need to track conversation between phases
4. **Error Handling**: More points of failure

## Recommendation

Start with the current single-message approach. Consider implementing two-phase only if:
- User testing shows desire to see drafts
- Quality metrics indicate the review phase is critical
- Token costs become a concern
- Single-message timeouts are frequent

The single-message approach is simpler, faster, and likely sufficient for most use cases given GPT-5's capabilities.

