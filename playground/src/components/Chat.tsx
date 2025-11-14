import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  conversationId: number | null;
  onCodeUpdate: (code: string) => void;
  currentCode: string;
}

export function Chat({ conversationId, onCodeUpdate, currentCode }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversation = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/conversations/${id}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversationId || isLoading) return;

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

    try {
      // Start streaming response
      const response = await fetch(
        `http://localhost:3001/api/conversations/${conversationId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            currentCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let assistantMessage = "";
      const tempAssistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, tempAssistantMessage]);

      console.log("📡 Starting to read stream...");
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("✅ Stream complete");
          break;
        }

        const chunk = decoder.decode(value);
        console.log("📦 Received chunk:", chunk);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            console.log("📨 Processing line:", line);
            try {
              const data = JSON.parse(line.slice(6));
              console.log("📋 Parsed data:", data);

              if (data.type === "chunk") {
                assistantMessage += data.content;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = assistantMessage;
                  return newMessages;
                });
              } else if (data.type === "code") {
                console.log("💻 Received code update");
                onCodeUpdate(data.content);
              } else if (data.type === "error") {
                console.error("Stream error:", data.content);
              }
            } catch (e) {
              console.warn("⚠️ JSON parse error:", e, "Line:", line);
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
        },
      ]);
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

  if (!conversationId) {
    return (
      <div className="chat-container">
        <div className="chat-empty">
          <p>Select or create a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
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
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

