/**
 * Agent Server - OpenAI-compatible API with Cerebras integration
 * Supports tool calling with automatic execution
 */

import express from "express";
import cors from "cors";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {
  executeTool,
  toolSchemas,
  getAvailableGuides,
  getAvailableElements,
} from "./tools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
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
 * Build system prompt with available context
 */
function buildSystemPrompt(guides, elements) {
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

  return `You are an expert SVG generation assistant using the W2L library.

WORKFLOW:
1. First, use get_guides to retrieve relevant documentation for the task
2. Then, use get_elements to get detailed API information for specific elements
3. Finally, generate the JavaScript code using the W2L library

AVAILABLE GUIDES:
${guidesList}

AVAILABLE ELEMENTS:
${elementsText}

When generating code:
- Import from the W2L library correctly
- Use proper configuration objects
- Follow the patterns shown in the guides
- Add comments explaining key parts
- Make sure all required properties are provided`;
}

/**
 * Execute tool calls from Cerebras response
 */
async function executeToolCalls(toolCalls) {
  const results = [];

  for (const toolCall of toolCalls) {
    try {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      console.log(`   🔧 Executing: ${toolName}(${JSON.stringify(toolArgs)})`);

      const result = executeTool(toolName, toolArgs);

      results.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });

      console.log(`      ✓ Success`);
    } catch (error) {
      console.error(`      ✗ Error: ${error.message}`);
      results.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify({ error: error.message }),
      });
    }
  }

  return results;
}

/**
 * OpenAI-compatible chat completion endpoint with Cerebras
 */
app.post("/v1/chat/completions", async (req, res) => {
  try {
    if (!cerebras) {
      return res.status(500).json({
        error:
          "CEREBRAS_API_KEY not configured. Please set it in .env file in the project root.",
      });
    }

    const {
      messages,
      model = "llama-3.3-70b",
      stream = false,
      max_completion_tokens = 65536,
      temperature = 1,
      top_p = 1,
      ...otherParams
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid request: messages array required",
      });
    }

    console.log(`\n🤖 Chat Completion Request`);
    console.log(`   Model: ${model}`);
    console.log(`   Messages: ${messages.length}`);
    console.log(`   Stream: ${stream}`);

    // Get context for system prompt
    const guides = getAvailableGuides();
    const elements = getAvailableElements();
    const systemPrompt = buildSystemPrompt(guides, elements);

    // Prepare messages with system prompt if not present
    let conversationMessages = [...messages];
    if (!conversationMessages.some((m) => m.role === "system")) {
      conversationMessages = [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ];
    }

    // Tool calling loop
    let iteration = 0;
    const maxIterations = 10;

    while (iteration < maxIterations) {
      iteration++;
      console.log(`\n🔄 Iteration ${iteration}`);

      // Call Cerebras
      const completion = await cerebras.chat.completions.create({
        messages: conversationMessages,
        model,
        tools: toolSchemas,
        tool_choice: "auto",
        max_completion_tokens,
        temperature,
        top_p,
        stream: false, // We handle streaming differently with tools
        ...otherParams,
      });

      const assistantMessage = completion.choices[0].message;
      conversationMessages.push(assistantMessage);

      // Check if there are tool calls
      if (
        assistantMessage.tool_calls &&
        assistantMessage.tool_calls.length > 0
      ) {
        console.log(
          `   Agent requested ${assistantMessage.tool_calls.length} tool call(s)`
        );

        // Execute tools
        const toolResults = await executeToolCalls(assistantMessage.tool_calls);
        conversationMessages.push(...toolResults);

        // Continue loop
        continue;
      }

      // No tool calls - agent has finished
      console.log(`   ✨ Agent completed\n`);

      // Return final response
      return res.json({
        id: completion.id,
        object: "chat.completion",
        created: completion.created,
        model: completion.model,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: assistantMessage.content,
            },
            finish_reason: completion.choices[0].finish_reason,
          },
        ],
        usage: completion.usage,
      });
    }

    // Max iterations reached
    console.log(`   ⚠️  Max iterations (${maxIterations}) reached\n`);
    return res.json({
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content:
              "Maximum iterations reached. Please try again with a simpler request.",
          },
          finish_reason: "length",
        },
      ],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    });
  } catch (error) {
    console.error("Error in chat completion:", error);
    res.status(500).json({
      error: error.message,
      type: error.constructor.name,
    });
  }
});

/**
 * Streaming endpoint
 */
app.post("/v1/chat/completions/stream", async (req, res) => {
  try {
    if (!cerebras) {
      return res.status(500).json({
        error: "CEREBRAS_API_KEY not configured",
      });
    }

    const {
      messages,
      model = "llama-3.3-70b",
      max_completion_tokens = 65536,
      temperature = 1,
      top_p = 1,
      ...otherParams
    } = req.body;

    console.log(`\n🌊 Streaming Chat Request`);
    console.log(`   Model: ${model}`);

    // Get context
    const guides = getAvailableGuides();
    const elements = getAvailableElements();
    const systemPrompt = buildSystemPrompt(guides, elements);

    let conversationMessages = [...messages];
    if (!conversationMessages.some((m) => m.role === "system")) {
      conversationMessages = [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ];
    }

    // Set up SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Create streaming completion
    const stream = await cerebras.chat.completions.create({
      messages: conversationMessages,
      model,
      stream: true,
      max_completion_tokens,
      temperature,
      top_p,
      ...otherParams,
    });

    for await (const chunk of stream) {
      const data = JSON.stringify(chunk);
      res.write(`data: ${data}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Error in streaming:", error);
    res.status(500).json({ error: error.message });
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
 * Example endpoint showing how to use the agent
 */
app.get("/example", (req, res) => {
  res.json({
    description: "W2L Agent Server - Cerebras-powered SVG generation",
    endpoints: {
      health: "GET /health - Health check",
      context: "GET /context - Get available guides and elements",
      chat: "POST /v1/chat/completions - Chat with AI agent",
      chatStream: "POST /v1/chat/completions/stream - Streaming chat",
      toolExecute: "POST /tools/execute - Direct tool execution for testing",
      toolSchemas: "GET /tools/schemas - Get tool definitions",
    },
    example: {
      description: "Generate SVG with AI",
      request: {
        method: "POST",
        url: "/v1/chat/completions",
        body: {
          messages: [
            {
              role: "user",
              content:
                "Create a simple diagram with a blue circle and a red rectangle",
            },
          ],
        },
      },
    },
    setup: {
      step1: "Set CEREBRAS_API_KEY in .env file in project root",
      step2: "Run: npm run dev",
      step3: "POST to /v1/chat/completions with your request",
    },
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 W2L Agent Server running on http://localhost:${PORT}`);
  console.log(`\n📚 Endpoints:`);
  console.log(`   GET  /health                      - Health check`);
  console.log(
    `   GET  /context                     - Available guides and elements`
  );
  console.log(`   GET  /example                     - Usage examples`);
  console.log(`   POST /v1/chat/completions         - Chat with AI agent`);
  console.log(`   POST /v1/chat/completions/stream  - Streaming chat`);
  console.log(`   POST /tools/execute               - Direct tool execution`);
  console.log(`   GET  /tools/schemas               - Tool definitions`);

  if (!process.env.CEREBRAS_API_KEY) {
    console.log(`\n⚠️  CEREBRAS_API_KEY not set!`);
    console.log(`   Create a .env file in the project root with:`);
    console.log(`   CEREBRAS_API_KEY=your-api-key-here`);
  } else {
    console.log(`\n✅ Cerebras API key configured`);
  }

  console.log(`\n💡 Try: curl http://localhost:${PORT}/example`);
  console.log("");
});
