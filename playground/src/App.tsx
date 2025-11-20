import { useRef, useEffect, useState } from "react";
import { CodeEditor, CodeEditorHandle } from "./components/CodeEditor";
import { Renderer } from "./components/Renderer";
import { EditorToolbar } from "./components/EditorToolbar";
import { RendererToolbar } from "./components/RendererToolbar";
import { Message } from "./components/Message";
import { Resizer } from "./components/Resizer";
import { VerticalResizer } from "./components/VerticalResizer";
import { Chat } from "./components/Chat";
import { ConversationSelector } from "./components/ConversationSelector";
import { useCodeExecution } from "./hooks/useCodeExecution";
import {
  saveSVG,
  saveCode,
  loadCodeFromLocalStorage,
  loadFileFromInput,
} from "./utils/fileOperations";
import { DEFAULT_CODE } from "./constants";

export function App() {
  const editorRef = useRef<CodeEditorHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Use lazy initializer to load saved code only once on mount
  const [initialCode] = useState(() => {
    const savedCode = loadCodeFromLocalStorage();
    return savedCode || DEFAULT_CODE;
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { result, executeCode } = useCodeExecution();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Create default conversation on mount
  useEffect(() => {
    const createDefaultConversation = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "New Conversation",
            code: initialCode,
          }),
        });
        const newConversation = await response.json();
        setConversationId(newConversation.id);
      } catch (error) {
        console.error("Error creating default conversation:", error);
        // If server is not available, just continue without conversation
      }
    };

    createDefaultConversation();
  }, [initialCode]); // Run once on mount with initial code

  // Show messages from execution results
  useEffect(() => {
    if (result.status !== "idle") {
      setMessage(result.message);
      setMessageType(result.status);
    }
  }, [result]);

  const handleRun = () => {
    const code = editorRef.current?.getValue() || "";
    executeCode(code);
  };

  const handleLoadFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { content, error } = await loadFileFromInput(file);

    if (error) {
      setMessage(error);
      setMessageType("error");
    } else {
      editorRef.current?.setValue(content);
      setCurrentFile(file); // Store the file for refresh
      setMessage(`Loaded file: ${file.name}`);
      setMessageType("success");
    }

    // Reset the input so the same file can be loaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRefreshFile = async () => {
    if (!currentFile) return;

    const { content, error } = await loadFileFromInput(currentFile);

    if (error) {
      setMessage(error);
      setMessageType("error");
    } else {
      editorRef.current?.setValue(content);
      setMessage(`Refreshed file: ${currentFile.name}`);
      setMessageType("success");
    }
  };

  const handleSaveCode = async () => {
    const code = editorRef.current?.getValue() || "";
    await saveCode(code);
    setMessage("Code saved successfully!");
    setMessageType("success");
  };

  const handleSaveSVG = async () => {
    if (result.svgs.length === 0) return;

    const svg = result.svgs.join("\n");
    await saveSVG(svg);
    setMessage("SVG saved successfully!");
    setMessageType("success");
  };

  const handleConversationSelect = async (id: number) => {
    setConversationId(id);
    try {
      const response = await fetch(`http://localhost:3001/api/conversations/${id}`);
      const data = await response.json();
      if (data.code) {
        editorRef.current?.setValue(data.code);
        executeCode(data.code);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      setMessage("Failed to load conversation");
      setMessageType("error");
    }
  };

  const handleNewConversation = () => {
    // Optionally reset the editor when creating a new conversation
    // editorRef.current?.setValue(DEFAULT_CODE);
  };

  const handleCodeUpdate = (code: string) => {
    editorRef.current?.setValue(code);
    executeCode(code);
  };

  return (
    <div id="app">
      <Message message={message} type={messageType} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".ts,.js,.tsx,.jsx"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="split-container">
        <div className="pane editor-pane" id="editor-pane">
          <ConversationSelector
            selectedId={conversationId}
            onSelect={handleConversationSelect}
            onNew={handleNewConversation}
          />
          <div className="editor-split-container">
            <div className="editor-section" id="editor-section" style={{ flex: "0 0 50%" }}>
        <EditorToolbar
          onLoadFile={handleLoadFile}
          onRefreshFile={handleRefreshFile}
          onRun={handleRun}
          onSaveCode={handleSaveCode}
          currentFileName={currentFile?.name || null}
        />
          <CodeEditor ref={editorRef} initialValue={initialCode} onRun={handleRun} />
            </div>

            <VerticalResizer />

            <div className="chat-section" id="chat-section" style={{ flex: "0 0 50%" }}>
              <Chat
                conversationId={conversationId}
                onCodeUpdate={handleCodeUpdate}
                currentCode={editorRef.current?.getValue() || ""}
              />
            </div>
          </div>
        </div>

        <Resizer />

        <div className="pane renderer-pane" id="renderer-pane">
          <RendererToolbar
            onSaveSVG={handleSaveSVG}
            canSaveSVG={result.svgs.length > 0}
          />
          <Renderer result={result} />
        </div>
      </div>
    </div>
  );
}

