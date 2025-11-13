import { useState, useEffect } from "react";

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
}

export function ConversationSelector({
  selectedId,
  onSelect,
  onNew,
}: ConversationSelectorProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/conversations");
      const data = await response.json();
      setConversations(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Conversation",
          code: "",
        }),
      });
      const newConversation = await response.json();
      setConversations((prev) => [newConversation, ...prev]);
      onNew();
      onSelect(newConversation.id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="conversation-selector">
      <select
        className="conversation-select"
        value={selectedId || ""}
        onChange={(e) => {
          const id = parseInt(e.target.value);
          if (id) onSelect(id);
        }}
        disabled={isLoading}
      >
        <option value="">
          {isLoading ? "Loading..." : "Select a conversation"}
        </option>
        {conversations.map((conv) => (
          <option key={conv.id} value={conv.id}>
            {conv.title}
          </option>
        ))}
      </select>
      <button
        className="new-conversation-btn"
        onClick={handleNewConversation}
      >
        + New
      </button>
    </div>
  );
}

