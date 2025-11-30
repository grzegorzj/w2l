import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import {
  searchDocumentationToolResponses,
  handleSearchTool,
} from "./vectorSearch.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Agent server configuration
const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || "http://localhost:3100";
const USE_AGENT_SERVER = process.env.USE_AGENT_SERVER === "true";

/**
 * Extract code blocks from LLM response (fallback for non-structured output)
 * @param {string} content - The LLM response content
 * @returns {string|null} - The extracted code or null
 */
export function extractCodeFromResponse(content) {
  // Match code blocks with typescript or javascript language identifier
  const codeBlockRegex = /```(?:typescript|javascript)\n([\s\S]*?)```/;
  const match = content.match(codeBlockRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

/**
 * Call the agent server for code generation
 * @param {Array} messages - Array of message objects with role and content
 * @param {Function} onChunk - Callback for each chunk (streaming reasoning)
 * @param {Function} onComplete - Callback when complete
 * @param {Function} onError - Callback on error
 */
export async function streamAgentCompletion(
  messages,
  onChunk,
  onComplete,
  onError
) {
  try {
    console.log("🤖 Calling agent server at", AGENT_SERVER_URL);
    
    // Call the agent server
    const response = await fetch(`${AGENT_SERVER_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: "gpt-oss-120b",
        max_completion_tokens: 4096,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Agent server request failed");
    }

    const data = await response.json();
    console.log("✅ Agent server response received");

    // Parse the response
    const assistantMessage = data.choices[0].message.content;
    let parsedContent;
    
    try {
      parsedContent = JSON.parse(assistantMessage);
    } catch (e) {
      console.warn("⚠️ Failed to parse agent response as JSON:", e.message);
      parsedContent = {
        code: assistantMessage,
        explanation: "Code generated",
      };
    }

    const extractedCode = parsedContent.code || null;
    const explanation = parsedContent.explanation || "Code generated successfully.";

    console.log("📝 Agent response:", {
      hasCode: !!extractedCode,
      codeLength: extractedCode?.length || 0,
      explanation: explanation.substring(0, 100),
    });

    // Stream the explanation to the frontend
    if (explanation) {
      onChunk(explanation);
    }

    // Call completion with reasoning and code
    onComplete(explanation, extractedCode);
  } catch (error) {
    console.error("❌ Agent server error:", error);
    onError(error);
  }
}

/**
 * Response schema for agentic code generation pipeline
 */
const agenticResponseSchema = {
  type: "object",
  properties: {
    plan: {
      type: "object",
      description:
        "High-level plan the model will follow before doing any work.",
      properties: {
        goal: {
          type: "string",
          description: "Restatement of the task in the model's own words.",
        },
        steps: {
          type: "array",
          description: "Ordered list of steps the model will follow.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description:
                  "Short identifier for the step, e.g. 'outline', 'generate_code'.",
              },
              description: {
                type: "string",
                description:
                  "Natural-language description of what this step will do.",
              },
            },
            required: ["id", "description"],
            additionalProperties: false,
          },
        },
      },
      required: ["goal", "steps"],
      additionalProperties: false,
    },
    outline: {
      type: "array",
      description:
        "Detailed outline of the solution before any code is written.",
      items: {
        type: "object",
        properties: {
          section_id: {
            type: "string",
            description:
              "Stable identifier for this section, used to link later steps to this outline item.",
          },
          title: {
            type: "string",
            description: "Short title for this section of the solution.",
          },
          description: {
            type: "string",
            description:
              "Explanation of what this section will contain or achieve.",
          },
        },
        required: ["section_id", "title", "description"],
        additionalProperties: false,
      },
    },
    draft_code: {
      type: "object",
      description: "First complete draft of the code artifact before review.",
      properties: {
        language: {
          type: "string",
          description: "Primary language or format, e.g. 'javascript'.",
        },
        code: {
          type: "string",
          description:
            "The full code draft. Must include all imports and end with artboard.render().",
        },
      },
      required: ["language", "code"],
      additionalProperties: false,
    },
    review: {
      type: "object",
      description:
        "Structured review stages that check the draft against documentation, APIs, and general quality.",
      properties: {
        documentation_checks: {
          type: "array",
          description:
            "Checks that explicitly compare the draft against external documentation via tools.",
          items: {
            type: "object",
            properties: {
              check_id: {
                type: "string",
                description: "Identifier for this documentation check.",
              },
              description: {
                type: "string",
                description:
                  "What is being verified against documentation (e.g. 'arguments of Rectangle constructor').",
              },
              related_code_snippet: {
                type: "string",
                description: "Relevant subset of the draft code being checked.",
              },
              tool_name: {
                type: "string",
                description:
                  "Tool used to consult documentation, e.g. 'search_documentation'.",
              },
              tool_request_payload: {
                type: "string",
                description:
                  "String describing the arguments for the documentation lookup (e.g., 'query: Rectangle constructor').",
              },
              tool_response_summary: {
                type: "string",
                description: "Summary of the documentation/tool response.",
              },
              result: {
                type: "string",
                enum: ["passes", "fails", "inconclusive"],
                description: "Outcome of this check.",
              },
              required_changes: {
                type: "string",
                description:
                  "Code changes needed (if any) to satisfy the documentation/API definition.",
              },
            },
            required: [
              "check_id",
              "description",
              "related_code_snippet",
              "tool_name",
              "tool_request_payload",
              "tool_response_summary",
              "result",
              "required_changes",
            ],
            additionalProperties: false,
          },
        },
        static_quality_review: {
          type: "object",
          description:
            "Non-tool-based review of the draft code: design, readability, robustness.",
          properties: {
            correctness_assessment: {
              type: "string",
              description: "Reasoned assessment of functional correctness.",
            },
            robustness_assessment: {
              type: "string",
              description:
                "Assessment of error handling, edge cases, and failure modes.",
            },
            design_assessment: {
              type: "string",
              description:
                "Assessment of the structure, modularity, and API design.",
            },
            performance_considerations: {
              type: "string",
              description:
                "Notes about complexity, performance characteristics, and potential bottlenecks.",
            },
          },
          required: [
            "correctness_assessment",
            "robustness_assessment",
            "design_assessment",
            "performance_considerations",
          ],
          additionalProperties: false,
        },
      },
      required: ["documentation_checks", "static_quality_review"],
      additionalProperties: false,
    },
    final_code: {
      type: "object",
      description: "Final, post-review code artifact and a concise usage note.",
      properties: {
        language: {
          type: "string",
          description:
            "Primary language or format of the final artifact, e.g. 'javascript'.",
        },
        code: {
          type: "string",
          description:
            "The final code after all fixes from the review have been applied. Must include all imports and end with artboard.render().",
        },
        usage_notes: {
          type: "string",
          description:
            "Short instructions on how to integrate or run this code.",
        },
        differences_from_draft: {
          type: "string",
          description:
            "Summary of key changes compared to draft_code.code (bug fixes, API changes, refactors).",
        },
      },
      required: ["language", "code", "usage_notes", "differences_from_draft"],
      additionalProperties: false,
    },
  },
  required: ["plan", "outline", "draft_code", "review", "final_code"],
  additionalProperties: false,
};

/**
 * Legacy response schema for simple responses
 */
const simpleResponseSchema = {
  type: "object",
  properties: {
    reasoning: {
      type: "string",
      description:
        "Your thought process and explanation of what you're creating",
    },
    code: {
      type: "string",
      description:
        "The complete, executable JavaScript code using the w2l library. Must include all imports and end with artboard.render(). Do not include markdown code fences.",
    },
    hasCode: {
      type: "boolean",
      description:
        "Whether this response includes executable code for the canvas",
    },
  },
  required: ["reasoning", "code", "hasCode"],
  additionalProperties: false,
};

// Use the agentic schema by default
const responseSchema = agenticResponseSchema;

/**
 * Stream chat completion from OpenAI with tool support
 * @param {Array} messages - Array of message objects with role and content
 * @param {Function} onChunk - Callback for each chunk
 * @param {Function} onComplete - Callback when complete
 * @param {Function} onError - Callback on error
 */
export async function streamChatCompletion(
  messages,
  onChunk,
  onComplete,
  onError
) {
  // Delegate to agent server if configured
  if (USE_AGENT_SERVER) {
    console.log("🤖 Using agent server for code generation");
    return streamAgentCompletion(messages, onChunk, onComplete, onError);
  }

  try {
    console.log("🔵 Starting stream with gpt-5-codex...");
    let fullContent = "";
    let toolCalls = [];
    let currentToolCall = null;

    // GPT-5-Codex uses the Responses API with 'input' instead of 'messages'
    const inputMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    console.log("\n========================================");
    console.log("📤 CONVERSATION HISTORY BEING SENT TO LLM:");
    console.log("========================================");
    inputMessages.forEach((msg, idx) => {
      console.log(`\n[${idx}] Role: ${msg.role || msg.type}`);
      if (msg.content) {
        console.log(
          `Content (${msg.content.length} chars): ${msg.content.substring(0, 300)}${msg.content.length > 300 ? "..." : ""}`
        );
      } else if (msg.output) {
        console.log(
          `Output (${msg.output.length} chars): ${msg.output.substring(0, 300)}${msg.output.length > 300 ? "..." : ""}`
        );
      } else if (msg.name) {
        console.log(`Function: ${msg.name}`);
      }
    });
    console.log("\n========================================\n");

    const stream = await openai.responses.create({
      model: "gpt-5-nano",
      input: inputMessages,
      tools: [searchDocumentationToolResponses],
      tool_choice: "auto",
      text: {
        format: {
          type: "json_schema",
          name: "w2l_code_response",
          schema: responseSchema,
          strict: true,
        },
      },
      stream: true,
    });

    console.log("✅ Stream created, waiting for chunks...");
    console.log("\n========================================");
    console.log("🟢 LLM STREAMING OUTPUT:");
    console.log("========================================\n");

    for await (const chunk of stream) {
      // Responses API uses event-based streaming with 'type' field
      const eventType = chunk.type;

      if (eventType === "response.output_text.delta") {
        // LOG: LLM streaming output
        const textDelta = chunk.delta || chunk.text || chunk.content;
        if (textDelta) {
          fullContent += textDelta;
          process.stdout.write(textDelta); // Write without newline to show streaming
        } else {
          console.log("\n⚠️ No text in delta chunk:", JSON.stringify(chunk));
        }
      } else if (eventType === "response.output_item.added") {
        // New output item (could be text, function call, etc.)
        if (chunk.item?.type === "function_call") {
          console.log(`🔧 Function call detected: ${chunk.item.name}`);
          currentToolCall = {
            id: chunk.item.call_id,
            type: "function",
            function: {
              name: chunk.item.name,
              arguments: "",
            },
          };
        }
      } else if (eventType === "response.function_call_arguments.delta") {
        // Function call arguments streaming
        if (currentToolCall) {
          currentToolCall.function.arguments += chunk.delta;
        }
      } else if (eventType === "response.function_call_arguments.done") {
        // Function call complete
        if (currentToolCall) {
          currentToolCall.function.arguments = chunk.arguments;
          toolCalls.push(currentToolCall);
          console.log(
            `✅ Function call complete: ${currentToolCall.function.name}`
          );
          currentToolCall = null;
        }
      } else if (eventType === "response.completed") {
        // Response complete
        console.log("✅ Response completed");
      }
    }

    // Add final tool call if exists
    if (currentToolCall) {
      toolCalls.push(currentToolCall);
    }

    // If there are tool calls, execute them and continue the conversation
    if (toolCalls.length > 0) {
      console.log(`🔧 Executing ${toolCalls.length} tool call(s)...`);

      // Execute all tool calls
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall) => {
          if (toolCall.function.name === "search_documentation") {
            const result = await handleSearchTool(toolCall);
            console.log("🔍 Search result length:", result?.length || 0);
            return {
              type: "function_call_output",
              call_id: toolCall.id,
              output: result || "No results found",
            };
          }
          return null;
        })
      );

      // Filter out null results
      const validToolResults = toolResults.filter((r) => r !== null);

      // LOG: What we're sending to LLM as tool output
      console.log("\n🔵 TOOL OUTPUT TO LLM:");
      validToolResults.forEach((result, idx) => {
        console.log(`\nResult ${idx + 1}:`);
        console.log(`- call_id: ${result.call_id}`);
        console.log(`- output length: ${result.output?.length || 0} chars`);
        console.log(`- output preview: ${result.output?.substring(0, 200)}...`);
      });
      console.log("\n");

      // For Responses API, we need to build the input array differently
      // Include the assistant's function calls as separate items
      // Note: function_call items don't have 'role' field in Responses API
      const functionCallItems = toolCalls.map((tc) => ({
        type: "function_call",
        call_id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments,
      }));

      // If there was any text content before the function call, include it
      const newInput = [...messages];
      if (fullContent && fullContent.trim()) {
        newInput.push({
          role: "assistant",
          content: fullContent,
        });
      }

      // Add function call items
      newInput.push(...functionCallItems);

      // Add function results
      newInput.push(...validToolResults);

      // Make another request with the tool results
      console.log(
        "🔄 Continuing conversation with",
        newInput.length,
        "input items"
      );
      console.log("📨 Last input item (tool result):", {
        type: validToolResults[0]?.type,
        hasOutput: !!validToolResults[0]?.output,
        outputLength: validToolResults[0]?.output?.length || 0,
      });

      return await streamChatCompletion(newInput, onChunk, onComplete, onError);
    }

    // Parse structured output
    console.log("\n\n========================================");
    console.log("📝 FULL RESPONSE RECEIVED");
    console.log("========================================");
    console.log(`Length: ${fullContent.length} chars`);
    console.log(`Content:\n${fullContent}`);
    console.log("========================================\n");

    let reasoning = fullContent;
    let extractedCode = null;

    try {
      const parsed = JSON.parse(fullContent);

      // Check if this is the new agentic format
      if (parsed.plan && parsed.final_code) {
        // Agentic format - extract code from final_code.code
        extractedCode = parsed.final_code.code || null;

        // Build a comprehensive reasoning summary
        const planSummary =
          `**Goal**: ${parsed.plan.goal}\n\n` +
          `**Steps**:\n${parsed.plan.steps.map((s) => `- ${s.description}`).join("\n")}`;

        const outlineSummary =
          parsed.outline?.length > 0
            ? `\n\n**Outline**:\n${parsed.outline.map((o) => `- ${o.title}: ${o.description}`).join("\n")}`
            : "";

        const reviewSummary = parsed.review?.static_quality_review
          ? `\n\n**Quality Review**:\n- Correctness: ${parsed.review.static_quality_review.correctness_assessment}\n- Design: ${parsed.review.static_quality_review.design_assessment}`
          : "";

        const changesSummary = parsed.final_code.differences_from_draft
          ? `\n\n**Changes from Draft**: ${parsed.final_code.differences_from_draft}`
          : "";

        const usageNotes = parsed.final_code.usage_notes
          ? `\n\n**Usage**: ${parsed.final_code.usage_notes}`
          : "";

        reasoning =
          planSummary +
          outlineSummary +
          reviewSummary +
          changesSummary +
          usageNotes;

        console.log("✅ Parsed agentic output:", {
          hasPlan: !!parsed.plan,
          hasOutline: !!parsed.outline,
          hasDraft: !!parsed.draft_code,
          hasReview: !!parsed.review,
          hasFinalCode: !!parsed.final_code,
          codeLength: extractedCode?.length || 0,
        });
      } else if (parsed.reasoning && parsed.code !== undefined) {
        // Legacy simple format
        reasoning = parsed.reasoning || fullContent;
        extractedCode = parsed.hasCode && parsed.code ? parsed.code : null;
        console.log("✅ Parsed simple output:", {
          hasReasoning: !!reasoning,
          hasCode: !!extractedCode,
          reasoningLength: reasoning.length,
          codeLength: extractedCode?.length || 0,
        });
      } else {
        throw new Error("Unknown response format");
      }

      // Now stream the reasoning to frontend since we've parsed it
      if (reasoning) {
        onChunk(reasoning);
      }
    } catch (e) {
      // Fallback to regex extraction if parsing fails
      console.log(
        "⚠️ Failed to parse structured output, falling back to regex. Error:",
        e.message
      );
      console.log("Raw content:", fullContent.substring(0, 500));
      extractedCode = extractCodeFromResponse(fullContent);
      // If fallback, stream the full content
      onChunk(fullContent);
    }

    console.log("🏁 Calling onComplete with:", {
      reasoningLength: reasoning.length,
      codeLength: extractedCode?.length || 0,
    });
    onComplete(reasoning, extractedCode);
  } catch (error) {
    console.error("OpenAI streaming error:", error);
    onError(error);
  }
}

/**
 * Generate a title for a conversation based on the first message
 * @param {string} firstMessage - The first user message
 * @returns {Promise<string>} - Generated title
 */
export async function generateConversationTitle(firstMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Generate a short title (max 50 characters) for this conversation. Reply with only the title, no quotes or extra text.",
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
      max_tokens: 20,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
}
