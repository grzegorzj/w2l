import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { conversationDB } from './database.js';
import { streamChatCompletion, generateConversationTitle } from './llm.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all conversations
app.get('/api/conversations', (req, res) => {
  try {
    const conversations = conversationDB.getAll();
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get a specific conversation
app.get('/api/conversations/:id', (req, res) => {
  try {
    const conversation = conversationDB.getById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Create a new conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const { title, code } = req.body;
    const conversationId = conversationDB.create(
      title || 'New Conversation',
      code || ''
    );
    
    const conversation = conversationDB.getById(conversationId);
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Update conversation code
app.patch('/api/conversations/:id/code', (req, res) => {
  try {
    const { code } = req.body;
    conversationDB.updateCode(req.params.id, code);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating code:', error);
    res.status(500).json({ error: 'Failed to update code' });
  }
});

// Delete a conversation
app.delete('/api/conversations/:id', (req, res) => {
  try {
    conversationDB.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Chat endpoint with streaming
app.post('/api/conversations/:id/chat', async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { message, currentCode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get conversation to check if it exists
    const conversation = conversationDB.getById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message to database
    conversationDB.addMessage(conversationId, 'user', message);

    // If this is the first message, generate a title
    if (conversation.messages.length === 0) {
      generateConversationTitle(message).then(title => {
        conversationDB.updateTitle(conversationId, title);
      }).catch(err => {
        console.error('Error generating title:', err);
      });
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Build message history with current code context
    const messages = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the new user message
    messages.push({
      role: 'user',
      content: message
    });

    // Add current code context if available
    if (currentCode) {
      messages[messages.length - 1].content += `\n\nCurrent code in the editor:\n\`\`\`typescript\n${currentCode}\n\`\`\``;
    }

    let assistantMessage = '';

    await streamChatCompletion(
      messages,
      // On chunk
      (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      },
      // On complete
      (fullContent, extractedCode) => {
        assistantMessage = fullContent;
        
        // Save assistant message to database
        conversationDB.addMessage(conversationId, 'assistant', fullContent);

        // If code was extracted, update the conversation's code
        if (extractedCode) {
          conversationDB.updateCode(conversationId, extractedCode);
          res.write(`data: ${JSON.stringify({ type: 'code', content: extractedCode })}\n\n`);
        }

        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      },
      // On error
      (error) => {
        console.error('Streaming error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
        res.end();
      }
    );

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process chat message' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
      res.end();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Make sure to set OPENAI_API_KEY in your environment variables`);
});

