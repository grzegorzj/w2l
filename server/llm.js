import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI assistant helping users write code for the w2l (Word to Layout) library. This is a TypeScript library for creating SVG graphics with a declarative API.

The library provides:
- Basic shapes: Rectangle, Triangle, Circle, Text
- Layout containers: Container with flexible layouts
- Transformations: rotate, translate, scale
- Styling: fill, stroke, opacity, etc.

When users ask you to create or modify code, you should:
1. Generate clean, well-formatted TypeScript/JavaScript code
2. Use the w2l library's API correctly
3. Include helpful comments
4. Make sure the code is executable

Important: When you want to update the code artifact, you MUST use a special format:
- Wrap the ENTIRE new code in a code block with the language identifier
- Use ONLY "typescript" or "javascript" as the language identifier
- The code should be complete and ready to run

Example:
\`\`\`typescript
import { Artboard, Rectangle } from "w2l";

const artboard = new Artboard();
artboard.width(400).height(300);

const rect = new Rectangle();
rect.width(100).height(100).fill("blue");

artboard.add(rect);

export default [artboard];
\`\`\`

The system will automatically extract code blocks from your response and update the artifact.`;

/**
 * Extract code blocks from LLM response
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
 * Stream chat completion from OpenAI
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
    const stream = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      temperature: 0.7,
    });

    let fullContent = "";

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      if (delta) {
        fullContent += delta;
        onChunk(delta);
      }
    }

    // Extract code from the full response
    const extractedCode = extractCodeFromResponse(fullContent);

    onComplete(fullContent, extractedCode);
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
