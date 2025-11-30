import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  onCodeUpdate: (code: string) => void;
  currentCode: string;
}

const AGENT_SERVER_URL = "http://localhost:3100";

export function Chat({ onCodeUpdate, currentCode }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("w2l-chat-messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved messages:", e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("w2l-chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    // Add placeholder for assistant message
    const tempAssistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, tempAssistantMessage]);

    try {
      console.log("🤖 Calling agent server...");
      
      // Build message history for agent server
      const apiMessages = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      
      // Add current user message
      apiMessages.push({
        role: "user",
        content: userMessage + (currentCode ? `\n\nCurrent code in editor:\n\`\`\`javascript\n${currentCode}\n\`\`\`` : "")
      });

      // Call agent server
      const response = await fetch(`${AGENT_SERVER_URL}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          messages: apiMessages,
          model: "llama3.1-8b",
          max_completion_tokens: 4096,
          temperature: 0.1,
          }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Agent server request failed");
      }

      const data = await response.json();
      console.log("✅ Agent server response:", data);

      // Parse the response
      const assistantContent = data.choices[0].message.content;
      console.log("📦 Raw assistant content:", assistantContent);
      console.log("📦 Type:", typeof assistantContent);
      
      let parsedContent;
      
      try {
        parsedContent = JSON.parse(assistantContent);
        console.log("✅ Successfully parsed JSON");
        console.log("📋 Parsed content keys:", Object.keys(parsedContent));
      } catch (e) {
        console.warn("⚠️ Failed to parse as JSON, using raw content");
        parsedContent = {
          code: assistantContent,
          explanation: "Code generated",
        };
        }

      const explanation = parsedContent.explanation || "Code generated successfully.";
      const code = parsedContent.code;

      console.log("📝 Extracted values:");
      console.log("  - hasCode:", !!code);
      console.log("  - codeLength:", code?.length || 0);
      console.log("  - explanation:", explanation.substring(0, 100));
      
      if (code) {
        console.log("🔍 CODE PREVIEW (first 200 chars):");
        console.log(code.substring(0, 200));
      } else {
        console.log("❌ NO CODE found in response!");
        console.log("   Available fields:", Object.keys(parsedContent));
        console.log("   Full parsed content:", parsedContent);
      }

      // Update assistant message with explanation
                setMessages((prev) => {
                  const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = explanation;
                  return newMessages;
                });

      // Update code in editor if present
      if (code) {
        console.log("💻 Calling onCodeUpdate with code length:", code.length);
        onCodeUpdate(code);
        console.log("✅ onCodeUpdate called successfully");
      } else {
        console.log("⚠️ Skipping code update - no code in response");
      }

    } catch (error) {
      console.error("❌ Error calling agent server:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = 
          `Sorry, an error occurred: ${error instanceof Error ? error.message : "Unknown error"}. Make sure the agent server is running on port 3100.`;
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearChat = () => {
    if (confirm("Clear all chat messages?")) {
      setMessages([]);
      localStorage.removeItem("w2l-chat-messages");
  }
  };

  return (
    <div className="chat-container">
      <div className="chat-header" style={{ 
        padding: "10px", 
        borderBottom: "1px solid var(--border)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <h3 style={{ margin: 0, fontSize: "14px" }}>W2L AI Assistant</h3>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear Chat
          </button>
        )}
      </div>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <h3>Welcome to W2L Assistant</h3>
            <p>Ask me to help you create graphics with the w2l library!</p>
            <div className="chat-suggestions">
              <button
                className="suggestion-button"
                onClick={() => setInput("Create a blue rectangle with rounded corners")}
              >
                Create a blue rectangle
              </button>
              <button
                className="suggestion-button"
                onClick={() => setInput("Draw a circle with a gradient fill")}
              >
                Draw a circle
              </button>
              <button
                className="suggestion-button"
                onClick={() => setInput("Create a grid of triangles")}
              >
                Create a grid
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`chat-message chat-message-${message.role}`}>
              <div className="chat-message-role">
                {message.role === "user" ? "You" : "Assistant"}
              </div>
              <div className="chat-message-content">
                {message.content || "..."}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me to create or modify your code... (Shift+Enter for new line)"
          disabled={isLoading}
          rows={3}
        />
        <button
          type="submit"
          className="chat-submit"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? "Generating..." : "Send"}
        </button>
      </form>
    </div>
  );
}

