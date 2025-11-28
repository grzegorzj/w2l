import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { W2L_TYPES } from "../w2l-types";

// Cache for global declarations
let cachedGlobalDeclarations: string | null = null;

// Generate global declarations from actual w2l exports
async function generateGlobalDeclarations(): Promise<string> {
  if (cachedGlobalDeclarations) {
    return cachedGlobalDeclarations;
  }

  try {
    const w2l = await import("w2l");
    const exports = Object.keys(w2l);
    
    // Generate declarations for each export
    const declarations = exports.map(name => {
      // Check if it's likely a type (starts with uppercase but isn't a class we know about)
      const isType = /^[A-Z]/.test(name) && name.includes('Config') || name.includes('Type') || name.includes('Mode') || name.includes('Alignment') || name.includes('Direction') || name.includes('Model') || name.includes('Reference') || name.includes('Point');
      
      if (isType || name === 'Position' || name === 'PositionConfig') {
        return `  type ${name} = W2L.${name};`;
      } else {
        return `  const ${name}: typeof W2L.${name};`;
      }
    });

    cachedGlobalDeclarations = `
      // Global declarations for w2l (autoimport mode)
      import * as W2L from 'w2l';
      
      declare global {
${declarations.join('\n')}
      }
    `;
    
    console.log("[Playground] Generated global declarations for", exports.length, "exports");
    return cachedGlobalDeclarations;
  } catch (error) {
    console.error("[Playground] Failed to generate global declarations:", error);
    return "";
  }
}

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
  onRun?: () => void,
  autoImport: boolean = true
) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const w2lLibRef = useRef<monaco.IDisposable | null>(null);
  const globalLibRef = useRef<monaco.IDisposable | null>(null);

  // Configure TypeScript and load type definitions (only when autoImport changes)
  useEffect(() => {
    const setupTypes = async () => {
      // Dispose of previous global lib if it exists
      if (globalLibRef.current) {
        globalLibRef.current.dispose();
        globalLibRef.current = null;
      }

      // Configure TypeScript compiler options (idempotent, safe to call multiple times)
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

      // Load W2L type definitions if not already loaded
      if (!w2lLibRef.current) {
        w2lLibRef.current = monaco.languages.typescript.typescriptDefaults.addExtraLib(
          W2L_TYPES,
          "file:///node_modules/@types/w2l/index.d.ts"
        );
      }

      // If autoimport is enabled, make all w2l exports available globally
      if (autoImport) {
        const globalDeclarations = await generateGlobalDeclarations();
        
        if (globalDeclarations) {
          globalLibRef.current = monaco.languages.typescript.typescriptDefaults.addExtraLib(
            globalDeclarations,
            "file:///node_modules/@types/w2l-globals/index.d.ts"
          );
          console.log("[Playground] ✅ Loaded w2l type definitions (autoimport mode)");
        }
      } else {
        console.log("[Playground] ✅ Loaded w2l type definitions (explicit import mode)");
      }
    };

    setupTypes();
  }, [autoImport]);

  // Create the editor (only once when container is available)
  useEffect(() => {
    if (!containerRef.current) return;

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
      // Cleanup type libs
      if (w2lLibRef.current) {
        w2lLibRef.current.dispose();
        w2lLibRef.current = null;
      }
      if (globalLibRef.current) {
        globalLibRef.current.dispose();
        globalLibRef.current = null;
      }
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

