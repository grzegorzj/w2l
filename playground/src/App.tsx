import { useRef, useEffect, useState } from "react";
import { CodeEditor, CodeEditorHandle } from "./components/CodeEditor";
import { Renderer } from "./components/Renderer";
import { EditorToolbar } from "./components/EditorToolbar";
import { RendererToolbar } from "./components/RendererToolbar";
import { Message } from "./components/Message";
import { Resizer } from "./components/Resizer";
import { VerticalResizer } from "./components/VerticalResizer";
import { Chat } from "./components/Chat";
import { useCodeExecution, ensureW2LImports } from "./hooks/useCodeExecution";
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
  const [messageType, setMessageType] = useState<"idle" | "success" | "error">(
    "idle"
  );
  // Load autoimport preference from localStorage, default to true
  const [autoImport, setAutoImport] = useState(() => {
    const saved = localStorage.getItem("w2l-autoimport");
    return saved !== null ? saved === "true" : true;
  });
  const { result, executeCode } = useCodeExecution(autoImport);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Show messages from execution results
  useEffect(() => {
    if (result.status !== "idle") {
      setMessage(result.message);
      setMessageType(result.status);
    }
  }, [result]);

  const handleRun = async () => {
    let code = editorRef.current?.getValue() || "";

    // If autoimport is ON and code has no imports, inject them into the editor
    if (autoImport) {
      const codeWithImports = await ensureW2LImports(code);
      if (codeWithImports !== code) {
        editorRef.current?.setValue(codeWithImports);
        code = codeWithImports;
      }
    }

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

  const handleCodeUpdate = (code: string) => {
    editorRef.current?.setValue(code);
    executeCode(code);
  };

  const handleAutoImportChange = async (checked: boolean) => {
    setAutoImport(checked);
    localStorage.setItem("w2l-autoimport", String(checked));

    // If turning autoimport ON, inject imports if missing
    if (checked) {
      const code = editorRef.current?.getValue() || "";
      const codeWithImports = await ensureW2LImports(code);
      if (codeWithImports !== code) {
        editorRef.current?.setValue(codeWithImports);
      }
    }
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
          <div className="editor-split-container">
            <div
              className="editor-section"
              id="editor-section"
              style={{ flex: "0 0 50%" }}
            >
              <EditorToolbar
                onLoadFile={handleLoadFile}
                onRefreshFile={handleRefreshFile}
                onRun={handleRun}
                onSaveCode={handleSaveCode}
                currentFileName={currentFile?.name || null}
                autoImport={autoImport}
                onAutoImportChange={handleAutoImportChange}
              />
              <CodeEditor
                ref={editorRef}
                initialValue={initialCode}
                onRun={handleRun}
                autoImport={autoImport}
              />
            </div>

            <VerticalResizer />

            <div
              className="chat-section"
              id="chat-section"
              style={{ flex: "0 0 50%" }}
            >
              <Chat
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
