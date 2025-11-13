import { useRef, useEffect, useState } from "react";
import { CodeEditor, CodeEditorHandle } from "./components/CodeEditor";
import { Renderer } from "./components/Renderer";
import { EditorToolbar } from "./components/EditorToolbar";
import { RendererToolbar } from "./components/RendererToolbar";
import { Message } from "./components/Message";
import { Resizer } from "./components/Resizer";
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
      setMessage(`Loaded file: ${file.name}`);
      setMessageType("success");
    }

    // Reset the input so the same file can be loaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <EditorToolbar
            onLoadFile={handleLoadFile}
            onRun={handleRun}
            onSaveCode={handleSaveCode}
          />
          <CodeEditor ref={editorRef} initialValue={initialCode} onRun={handleRun} />
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

