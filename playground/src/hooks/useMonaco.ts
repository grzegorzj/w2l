import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { W2L_TYPES } from "../w2l-types";

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

export function useMonaco(
  containerRef: React.RefObject<HTMLDivElement>,
  initialValue: string,
  onRun?: () => void
) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowNonTsExtensions: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      lib: ["ES2020"],
      baseUrl: ".",
      paths: {
        w2l: ["w2l"],
      },
    });

    // Load W2L type definitions (generated at build time)
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      W2L_TYPES,
      "file:///node_modules/@types/w2l/index.d.ts"
    );

    console.log("[Playground] ✅ Loaded w2l type definitions");

    // Create the editor
    const editor = monaco.editor.create(containerRef.current, {
      value: initialValue,
      language: "typescript",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      tabSize: 2,
      wordWrap: "on",
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: "on",
      snippetSuggestions: "inline",
    });

    // Add keyboard shortcut for running code (Cmd/Ctrl+Enter)
    if (onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun();
      });
    }

    editorRef.current = editor;

    return () => {
      editor.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef]);

  const getValue = () => {
    return editorRef.current?.getValue() || "";
  };

  const setValue = (value: string) => {
    editorRef.current?.setValue(value);
  };

  return { editor: editorRef.current, getValue, setValue };
}

