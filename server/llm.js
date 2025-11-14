import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import {
  searchDocumentationToolResponses,
  handleSearchTool,
} from "./vectorSearch.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * Response schema for structured output
 */
const responseSchema = {
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
        "The complete, executable TypeScript/JavaScript code using the w2l library. Must include all imports and end with artboard.render(). Do not include markdown code fences.",
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
      model: "gpt-5-codex",
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
      reasoning = parsed.reasoning || fullContent;
      extractedCode = parsed.hasCode && parsed.code ? parsed.code : null;
      console.log("✅ Parsed structured output:", {
        hasReasoning: !!reasoning,
        hasCode: !!extractedCode,
        reasoningLength: reasoning.length,
        codeLength: extractedCode?.length || 0,
      });

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
