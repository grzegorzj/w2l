/**
 * Agent Server - Cerebras tool calling integration
 */

import express from "express";
import cors from "cors";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  executeTool,
  toolSchemas,
  getAvailableGuides,
  getAvailableElements,
} from "./tools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env - try local first, then project root
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3100;

// Initialize Cerebras client (only if API key is available)
let cerebras = null;
if (process.env.CEREBRAS_API_KEY) {
  cerebras = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
  });
}

app.use(cors());
app.use(express.json());

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  const hasApiKey = !!process.env.CEREBRAS_API_KEY;
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    cerebrasConfigured: hasApiKey,
  });
});

/**
 * Get available context (guides and elements)
 */
app.get("/context", (req, res) => {
  try {
    const guides = getAvailableGuides();
    const elements = getAvailableElements();

    res.json({
      guides,
      elements,
      toolSchemas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Load base instructions guide (always included)
 */
function getBaseInstructions() {
  try {
    const baseGuidePath = path.join(
      __dirname,
      "guides",
      "00-base-instructions.md"
    );
    const content = fs.readFileSync(baseGuidePath, "utf-8");
    return content;
  } catch (error) {
    console.warn("⚠️  Base instructions guide not found, skipping");
    return "";
  }
}

/**
 * Build system prompt with available context
 */
function buildSystemPrompt(guides, elements) {
  const baseInstructions = getBaseInstructions();

  const guidesList = guides
    .map((g) => `- ${g.id}: ${g.title}\n  ${g.overview}`)
    .join("\n");

  const elementsByCategory = {};
  for (const el of elements) {
    if (!elementsByCategory[el.category]) {
      elementsByCategory[el.category] = [];
    }
    elementsByCategory[el.category].push(`${el.name}: ${el.description}`);
  }

  const elementsText = Object.entries(elementsByCategory)
    .map(([cat, els]) => `${cat.toUpperCase()}:\n- ${els.join("\n- ")}`)
    .join("\n\n");

  return `You are an expert image generation assistant using the W2L library.

${baseInstructions ? `BASE INSTRUCTIONS:\n${baseInstructions}\n` : ""}
WORKFLOW:
1. First, use get_guides to retrieve relevant documentation for the task
2. Then, use get_elements to get detailed API information for specific elements
3. Finally, generate the JavaScript code using the W2L library

AVAILABLE GUIDES:
${guidesList}

AVAILABLE ELEMENTS:
${elementsText}

When generating code:
- Before each instruction, write a one liner comment about why you are choosing to do what you do - refer to the guides.
- Do not use any imports; the library is already available
- End the document with return artboard.render(); or calls to multiple artboards if needed
- Don't add other comments
`;
}

/**
 * Schema for structured code output
 */
const codeOutputSchema = {
  type: "object",
  properties: {
    explanation: {
      type: "string",
      description: "Brief explanation of what the code does",
    },
    code: {
      type: "string",
      description:
        "The generated JavaScript code using the W2L library. IMPORTANT: NEVER return anything else than JavaScript here, or the program will fail.",
    },
  },
  required: ["code"],
  additionalProperties: false,
};

/**
 * Chat completion endpoint with tool calling
 * User makes ONE request, server handles all tool calling internally
 */
app.post("/v1/chat/completions", async (req, res) => {
  try {
    if (!cerebras) {
      return res.status(500).json({
        error: "CEREBRAS_API_KEY not configured. Please set it in .env file.",
      });
    }

    const {
      messages,
      model = "gpt-oss-120b",
      max_completion_tokens = 4096,
      temperature = 0.1,
      top_p = 1,
      ...otherParams
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid request: messages array required",
      });
    }

    const requestStartTime = Date.now();
    const timings = {
      contextLoad: 0,
      promptBuild: 0,
      llmCalls: [],
      toolExecutions: [],
      total: 0,
    };

    console.log(`\n🤖 Chat Request`);
    console.log(`   Model: ${model}`);
    console.log(`   User messages: ${messages.length}`);

    // Get context for system prompt
    const contextStartTime = Date.now();
    const guides = getAvailableGuides();
    const elements = getAvailableElements();
    timings.contextLoad = Date.now() - contextStartTime;
    console.log(
      `   📚 Context loaded: ${timings.contextLoad}ms (${guides.length} guides, ${elements.length} elements)`
    );

    const promptStartTime = Date.now();
    const systemPrompt = buildSystemPrompt(guides, elements);
    timings.promptBuild = Date.now() - promptStartTime;
    console.log(`   📝 System prompt built: ${timings.promptBuild}ms`);

    // Build conversation with system prompt
    let conversationMessages = [...messages];
    if (!conversationMessages.some((m) => m.role === "system")) {
      conversationMessages = [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ];
    }

    // Tool calling loop - all happens within this ONE request
    let iteration = 0;
    const maxIterations = 10;

    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n🔄 Iteration ${iteration}`);

      // Call Cerebras with tools
      const llmStartTime = Date.now();
      console.log(`   📡 Calling Cerebras API...`);

      // On first iteration, include tools. On subsequent iterations after tool execution,
      // request structured output for the final code
      const isFirstIteration = iteration === 1;
      const shouldUseStructuredOutput =
        iteration > 1 && conversationMessages.some((m) => m.role === "tool");

      const apiParams = {
        model,
        messages: conversationMessages,
        max_completion_tokens,
        temperature,
        top_p,
        ...otherParams,
      };

      // Add tools on first call or if no tool results yet
      if (!shouldUseStructuredOutput) {
        apiParams.tools = toolSchemas;
        apiParams.tool_choice = "auto";
      } else {
        // Request structured output for final code generation
        apiParams.response_format = {
          type: "json_schema",
          json_schema: {
            name: "code_output",
            strict: true,
            schema: codeOutputSchema,
          },
        };
      }

      const response = await cerebras.chat.completions.create(apiParams);

      const llmDuration = Date.now() - llmStartTime;
      timings.llmCalls.push({
        iteration,
        duration: llmDuration,
        hadToolCalls: !!response.choices[0].message.tool_calls,
      });

      console.log(
        `   ⏱️  LLM roundtrip: ${llmDuration}ms (${(llmDuration / 1000).toFixed(2)}s)`
      );

      const choice = response.choices[0];
      const message = choice.message;

      // Check if tool call is in message content (Cerebras format)
      let isToolCallInContent = false;
      if (message.content) {
        try {
          const parsed = JSON.parse(message.content);
          if (parsed.type === "function" && parsed.name && parsed.parameters) {
            isToolCallInContent = true;
            console.log(`   🔧 Detected tool call in content: ${parsed.name}`);

            // Convert to standard tool_calls format
            message.tool_calls = [
              {
                id: `call_${Date.now()}`,
                type: "function",
                function: {
                  name: parsed.name,
                  arguments: JSON.stringify(parsed.parameters),
                },
              },
            ];
          }
        } catch (e) {
          // Not a tool call, continue normally
        }
      }

      // Check if LLM wants to call tools
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log(
          `   🔧 LLM requested ${message.tool_calls.length} tool call(s)`
        );

        // Add assistant's message (with tool_calls) to conversation
        conversationMessages.push(message);

        // Execute each tool call
        const toolsStartTime = Date.now();
        for (const toolCall of message.tool_calls) {
          const toolName = toolCall.function.name;
          let toolArgs = JSON.parse(toolCall.function.arguments);

          // Handle Cerebras format where arrays might be stringified
          // e.g., {"elements": "['Rect']"} should become {"elements": ["Rect"]}
          for (const [key, value] of Object.entries(toolArgs)) {
            if (
              typeof value === "string" &&
              value.startsWith("[") &&
              value.endsWith("]")
            ) {
              try {
                // Try to parse as JSON array
                toolArgs[key] = JSON.parse(value.replace(/'/g, '"'));
              } catch (e) {
                // If that fails, try eval (safe here since it's our own data)
                try {
                  toolArgs[key] = eval(value);
                } catch (e2) {
                  // Keep original value if both fail
                  console.log(
                    `      ⚠️  Could not parse array string: ${value}`
                  );
                }
              }
            }
          }

          console.log(
            `      📦 Executing: ${toolName}(${JSON.stringify(toolArgs)})`
          );

          const toolStartTime = Date.now();
          try {
            // Execute the tool locally
            const result = executeTool(toolName, toolArgs);

            // Add tool result to conversation
            conversationMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            });

            const toolDuration = Date.now() - toolStartTime;
            timings.toolExecutions.push({
              name: toolName,
              duration: toolDuration,
              success: true,
            });
            console.log(`      ✓ Success (${toolDuration}ms)`);
          } catch (error) {
            const toolDuration = Date.now() - toolStartTime;
            timings.toolExecutions.push({
              name: toolName,
              duration: toolDuration,
              success: false,
              error: error.message,
            });
            console.error(
              `      ✗ Error (${toolDuration}ms): ${error.message}`
            );
            conversationMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ error: error.message }),
            });
          }
        }

        const totalToolsTime = Date.now() - toolsStartTime;
        console.log(`   🔧 All tools completed: ${totalToolsTime}ms`);

        // Loop continues - call LLM again with tool results
        continue;
      }

      // No tool calls - LLM is done, return response to user
      timings.total = Date.now() - requestStartTime;

      // Print detailed timing breakdown
      console.log(`\n📊 Timing Breakdown:`);
      console.log(`   Context loading:     ${timings.contextLoad}ms`);
      console.log(`   Prompt building:     ${timings.promptBuild}ms`);
      console.log(
        `   LLM calls (${timings.llmCalls.length}):        ${timings.llmCalls.reduce((sum, c) => sum + c.duration, 0)}ms`
      );
      timings.llmCalls.forEach((call, i) => {
        console.log(
          `     • Call ${call.iteration}: ${call.duration}ms ${call.hadToolCalls ? "(requested tools)" : "(final response)"}`
        );
      });
      if (timings.toolExecutions.length > 0) {
        console.log(
          `   Tool executions (${timings.toolExecutions.length}): ${timings.toolExecutions.reduce((sum, t) => sum + t.duration, 0)}ms`
        );
        timings.toolExecutions.forEach((tool) => {
          console.log(
            `     • ${tool.name}: ${tool.duration}ms ${tool.success ? "✓" : "✗"}`
          );
        });
      }
      console.log(`   ─────────────────────────────`);
      console.log(
        `   Total:               ${timings.total}ms (${(timings.total / 1000).toFixed(2)}s)`
      );
      console.log(`   ✨ Completed\n`);

      // Parse the structured JSON response
      console.log("\n📦 RAW LLM RESPONSE:");
      console.log("─────────────────────────────────────────────────");
      console.log(message.content);
      console.log("─────────────────────────────────────────────────\n");

      let parsedContent;
      try {
        parsedContent = JSON.parse(message.content);
        console.log("✅ Successfully parsed as JSON");
      } catch (e) {
        console.log("⚠️  Failed to parse as JSON, using raw content");
        // If parsing fails, wrap plain text response
        parsedContent = {
          code: message.content,
          explanation: "Code generated",
        };
      }

      // Log what we're sending back
      console.log("\n📤 SENDING TO CLIENT:");
      console.log("─────────────────────────────────────────────────");
      if (parsedContent.code) {
        console.log(`✅ Has code field (${parsedContent.code.length} chars)`);
        console.log("\n🔍 CODE PREVIEW (first 300 chars):");
        console.log(parsedContent.code.substring(0, 300) + "...");
      } else {
        console.log("❌ NO CODE FIELD in parsed content!");
        console.log("Available fields:", Object.keys(parsedContent));
      }
      if (parsedContent.explanation) {
        console.log(
          `\n💬 Explanation: ${parsedContent.explanation.substring(0, 100)}...`
        );
      }
      console.log("─────────────────────────────────────────────────\n");

      return res.json({
        id: response.id,
        object: "chat.completion",
        created: response.created,
        model: response.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: JSON.stringify(parsedContent, null, 2),
            },
            finish_reason: choice.finish_reason,
          },
        ],
        usage: response.usage,
      });
    }

    // Max iterations reached
    timings.total = Date.now() - requestStartTime;
    console.log(`\n⚠️  Max iterations reached after ${timings.total}ms`);
    console.log(`   LLM calls made: ${timings.llmCalls.length}`);
    console.log(`   Tools executed: ${timings.toolExecutions.length}\n`);
    return res.status(500).json({
      error: "Maximum iterations reached. The task may be too complex.",
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
    });
  }
});

/**
 * Direct tool execution endpoint (for testing)
 */
app.post("/tools/execute", (req, res) => {
  try {
    const { tool, arguments: args } = req.body;

    if (!tool) {
      return res.status(400).json({ error: "Tool name required" });
    }

    const result = executeTool(tool, args || {});
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get tool schemas
 */
app.get("/tools/schemas", (req, res) => {
  res.json({ tools: toolSchemas });
});

/**
 * Example endpoint
 */
app.get("/example", (req, res) => {
  res.json({
    description: "W2L Agent Server - Cerebras-powered SVG generation",
    usage: "POST to /v1/chat/completions with your message",
    example: {
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        messages: [
          {
            role: "user",
            content: "Create a blue circle with radius 50",
          },
        ],
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 W2L Agent Server running on http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints:`);
  console.log(`   GET  /health              - Health check`);
  console.log(`   GET  /context             - Available guides/elements`);
  console.log(`   POST /v1/chat/completions - Main AI endpoint`);
  console.log(`   POST /tools/execute       - Test tool execution`);
  console.log(`   GET  /tools/schemas       - Tool definitions`);

  if (process.env.CEREBRAS_API_KEY) {
    console.log(`\n✅ Cerebras API key configured`);
  }

  console.log(`\n💡 Try: ./test-ai.sh "Create a circle"\n`);
});
