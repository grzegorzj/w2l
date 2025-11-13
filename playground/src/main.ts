import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { W2L_TYPES } from "./w2l-types";

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

// Default code template
const DEFAULT_CODE = `import { Artboard, Triangle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: "800px", height: "600px" },
  padding: "20px",
  backgroundColor: "white"
});

// Create a right triangle (3-4-5)
const triangle = new Triangle({
  type: "right",
  a: "300px",
  b: "400px",
  fill: "#3498db",
  stroke: "#2c3e50",
  strokeWidth: "2px"
});

// Position the triangle at the center
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: "0px",
  y: "0px"
});

// Add triangle to artboard
artboard.addElement(triangle);

// Render the artboard
artboard.render();
`;

// State
let editor: monaco.editor.IStandaloneCodeEditor;
let currentSVG: string = "";
let zoom = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

// Initialize the playground
function init() {
  setupEditor();
  setupRenderer();
  setupResizer();
  setupEventListeners();
  loadSavedCode();
}

// Setup Monaco Editor
function setupEditor() {
  const container = document.getElementById("editor-container")!;

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
  editor = monaco.editor.create(container, {
    value: DEFAULT_CODE,
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
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    runCode();
  });
}

// Setup SVG renderer
function setupRenderer() {
  const container = document.getElementById("svg-container")!;
  const wrapper = document.getElementById("svg-wrapper")!;

  // Mouse wheel zoom
  container.addEventListener("wheel", (e) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));

    if (newZoom !== zoom) {
      zoom = newZoom;
      updateTransform();
      updateZoomLevel();
    }
  });

  // Pan functionality
  container.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      isPanning = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      container.style.cursor = "grabbing";
    }
  });

  container.addEventListener("mousemove", (e) => {
    if (isPanning) {
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateTransform();
    }
  });

  container.addEventListener("mouseup", () => {
    if (isPanning) {
      isPanning = false;
      container.style.cursor = "grab";
    }
  });

  container.addEventListener("mouseleave", () => {
    if (isPanning) {
      isPanning = false;
      container.style.cursor = "grab";
    }
  });

  // Zoom controls
  document.getElementById("zoom-in")!.addEventListener("click", () => {
    zoom = Math.min(5, zoom + 0.25);
    updateTransform();
    updateZoomLevel();
  });

  document.getElementById("zoom-out")!.addEventListener("click", () => {
    zoom = Math.max(0.1, zoom - 0.25);
    updateTransform();
    updateZoomLevel();
  });

  document.getElementById("zoom-reset")!.addEventListener("click", () => {
    zoom = 1;
    panX = 0;
    panY = 0;
    updateTransform();
    updateZoomLevel();
  });
}

// Update SVG transform
function updateTransform() {
  const wrapper = document.getElementById("svg-wrapper")!;
  wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

// Update zoom level display
function updateZoomLevel() {
  const zoomLevel = document.getElementById("zoom-level")!;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

// Setup resizable panes
function setupResizer() {
  const resizer = document.getElementById("resizer")!;
  const editorPane = document.getElementById("editor-pane")!;
  const rendererPane = document.getElementById("renderer-pane")!;

  let isResizing = false;
  let startX = 0;
  let startEditorWidth = 0;

  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    startX = e.clientX;
    startEditorWidth = editorPane.offsetWidth;
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;

    const delta = e.clientX - startX;
    const containerWidth = editorPane.parentElement!.offsetWidth;
    const newEditorWidth = startEditorWidth + delta;
    const minWidth = 200;

    if (
      newEditorWidth >= minWidth &&
      newEditorWidth <= containerWidth - minWidth
    ) {
      const editorPercent = (newEditorWidth / containerWidth) * 100;
      const rendererPercent = 100 - editorPercent;

      editorPane.style.flex = `0 0 ${editorPercent}%`;
      rendererPane.style.flex = `0 0 ${rendererPercent}%`;
    }
  });

  document.addEventListener("mouseup", () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = "";
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById("load-file-btn")!.addEventListener("click", () => {
    document.getElementById("file-input")!.click();
  });
  document
    .getElementById("file-input")!
    .addEventListener("change", handleFileLoad);
  document.getElementById("run-btn")!.addEventListener("click", runCode);
  document.getElementById("save-svg-btn")!.addEventListener("click", saveSVG);
  document.getElementById("save-code-btn")!.addEventListener("click", saveCode);
}

// Run the user's code
async function runCode() {
  const code = editor.getValue();
  const svgContent = document.getElementById("svg-content")!;
  const saveSvgBtn = document.getElementById(
    "save-svg-btn"
  ) as HTMLButtonElement;

  // Clear previous output
  clearMessages();

  try {
    // Import W2L dynamically
    const w2l = await import("w2l");

    // Create a sandboxed environment
    // Spread all w2l exports so any new primitives are automatically available
    const sandbox = {
      ...w2l,
      console: {
        log: (...args: any[]) => console.log("[User Code]", ...args),
        error: (...args: any[]) => console.error("[User Code]", ...args),
        warn: (...args: any[]) => console.warn("[User Code]", ...args),
      },
    };

    // Transform the code to remove imports and use sandbox
    let transformedCode = code
      .replace(/import\s+{[^}]+}\s+from\s+['"]w2l['"];?\s*/g, "")
      .trim();

    // If the code doesn't end with a return statement, add one
    // First, check if there are any explicit render() calls in the code (excluding comments)
    const lines = transformedCode.split("\n");
    const activeRenderCalls: {
      line: string;
      artboardName: string;
      lineIndex: number;
    }[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      // Skip commented lines
      if (
        trimmedLine.startsWith("//") ||
        trimmedLine.startsWith("/*") ||
        trimmedLine.startsWith("*")
      ) {
        return;
      }

      // Check for render() calls not in comments
      const renderMatch = line.match(/(\w+)\.render\(\)/);
      if (renderMatch) {
        // Make sure it's not in a comment at the end of the line
        const commentIndex = line.indexOf("//");
        const renderIndex = line.indexOf(renderMatch[0]);
        if (commentIndex === -1 || renderIndex < commentIndex) {
          activeRenderCalls.push({
            line: line.trim(),
            artboardName: renderMatch[1],
            lineIndex: index,
          });
        }
      }
    });

    const lastLine = lines[lines.length - 1].trim();

    if (!lastLine.startsWith("return ") && !lastLine.includes("return")) {
      // Check if there are explicit render() calls
      if (activeRenderCalls.length > 0) {
        console.log(
          "[Playground] Found explicit render calls:",
          activeRenderCalls.map((r) => r.artboardName)
        );

        if (activeRenderCalls.length === 1) {
          // Single render call - convert it to return
          console.log("[Playground] Converting single render() to return");
          const renderCall = activeRenderCalls[0];
          const renderPattern = new RegExp(
            `${renderCall.artboardName}\\.render\\(\\);?\\s*$`
          );
          transformedCode = transformedCode.replace(
            renderPattern,
            `return ${renderCall.artboardName}.render();`
          );
        } else {
          // Multiple render calls - remove them and return array at the end
          console.log(
            "[Playground] Converting multiple render() calls to return array"
          );

          // Remove all the render() calls from their original locations
          activeRenderCalls.forEach((renderCall) => {
            const renderPattern = new RegExp(
              `^\\s*${renderCall.artboardName}\\.render\\(\\);?\\s*$`,
              "gm"
            );
            transformedCode = transformedCode.replace(renderPattern, "");
          });

          // Add return array at the end
          const returnArray = activeRenderCalls
            .map((r) => `${r.artboardName}.render()`)
            .join(", ");
          transformedCode += `\n\n// Auto-added return for explicit renders\nreturn [${returnArray}];`;
        }
      } else {
        // No explicit render calls - detect artboards and auto-render
        const artboardMatches = transformedCode.match(
          /const\s+(\w+)\s*=\s*new\s+Artboard/g
        );
        const artboardNames = artboardMatches
          ? artboardMatches
              .map((m) => m.match(/const\s+(\w+)/)?.[1])
              .filter(Boolean)
          : [];

        console.log(
          "[Playground] No explicit renders. Detected artboards:",
          artboardNames
        );

        if (artboardNames.length > 1) {
          // Multiple artboards detected - return array
          const returnArray = artboardNames
            .map((name) => `${name}.render()`)
            .join(", ");
          console.log(
            "[Playground] Adding return for all detected artboards:",
            artboardNames
          );
          transformedCode += `\n\n// Auto-added return for multiple artboards\nreturn [${returnArray}];`;
        } else if (artboardNames.length === 1) {
          // Single artboard detected - return it
          const artboardName = artboardNames[0];
          console.log(
            "[Playground] Adding return for single artboard:",
            artboardName
          );
          transformedCode += `\n\n// Auto-added return\nreturn ${artboardName}.render();`;
        } else {
          // Last resort: assume 'artboard' exists
          console.log(
            "[Playground] Using last resort: assuming artboard exists"
          );
          transformedCode +=
            "\n\n// Auto-added return\nreturn artboard.render();";
        }
      }
    } else if (
      !lastLine.startsWith("return ") &&
      lastLine.includes(".render()")
    ) {
      // Single line with render() but no return keyword
      console.log("[Playground] Converting render() to return");
      transformedCode = transformedCode.replace(
        /([^;]+\.render\(\));?\s*$/,
        "return $1;"
      );
    }

    console.log(
      "[Playground] Transformed code (last 200 chars):",
      transformedCode.slice(-200)
    );

    // Wrap in function and execute
    const func = new Function(...Object.keys(sandbox), transformedCode);
    const result = func(...Object.values(sandbox));

    // Check if result is a single SVG string or an array of SVG strings
    let svgsToRender: string[] = [];

    if (typeof result === "string" && result.includes("<svg")) {
      // Single SVG
      svgsToRender = [result];
    } else if (Array.isArray(result)) {
      // Array of SVGs (multiple artboards)
      svgsToRender = result.filter(
        (item: any) => typeof item === "string" && item.includes("<svg")
      );
    }

    if (svgsToRender.length > 0) {
      // Render all SVGs
      currentSVG = svgsToRender.join("\n");

      if (svgsToRender.length === 1) {
        // Single artboard - render with shadow
        svgContent.innerHTML = `<div class="artboard-item">${svgsToRender[0]}</div>`;
      } else {
        // Multiple artboards - render each in separate containers
        const artboardsHTML = svgsToRender
          .map(
            (svg, index) => `
            <div class="artboard-item">
              <div class="artboard-label">Artboard ${index + 1}</div>
              ${svg}
            </div>
          `
          )
          .join("");
        svgContent.innerHTML = `<div class="artboards-container">${artboardsHTML}</div>`;
      }

      saveSvgBtn.disabled = false;
      showSuccess(
        `Code executed successfully! ${svgsToRender.length > 1 ? `Rendered ${svgsToRender.length} artboards.` : ""}`
      );
    } else {
      showError(
        "Code did not return an SVG string or array of SVGs. Make sure to return artboard.render() or an array of renders."
      );
      svgContent.innerHTML =
        '<div class="empty-state">No valid SVG output. Check console for details.</div>';
      saveSvgBtn.disabled = true;
    }
  } catch (error: any) {
    console.error("Error executing code:", error);
    console.error("Full error object:", error);
    console.error("Stack trace:", error.stack);

    // Build detailed error message
    let errorMessage = `Error: ${error.message}`;
    if (error.stack) {
      errorMessage += `\n\nStack Trace:\n${error.stack}`;
    }

    showError(errorMessage);
    svgContent.innerHTML = `
      <div class="empty-state" style="text-align: left; font-family: monospace; font-size: 12px; white-space: pre-wrap; padding: 20px;">
        <strong style="color: #ef4444;">Error executing code:</strong>\n\n${error.message}\n\n${error.stack || "No stack trace available"}
      </div>
    `;
    saveSvgBtn.disabled = true;
  }
}

// Save SVG to file
async function saveSVG() {
  if (!currentSVG) return;

  try {
    const response = await fetch("/api/save-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ svg: currentSVG }),
    });

    if (response.ok) {
      const { filename } = await response.json();
      showSuccess(`SVG saved as ${filename}`);
    } else {
      // Fallback to browser download if server endpoint doesn't exist
      downloadFile(currentSVG, `w2l-output-${Date.now()}.svg`, "image/svg+xml");
      showSuccess("SVG downloaded successfully!");
    }
  } catch (error) {
    // Fallback to browser download
    downloadFile(currentSVG, `w2l-output-${Date.now()}.svg`, "image/svg+xml");
    showSuccess("SVG downloaded successfully!");
  }
}

// Save code to file
async function saveCode() {
  const code = editor.getValue();

  try {
    const response = await fetch("/api/save-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      const { filename } = await response.json();
      showSuccess(`Code saved as ${filename}`);
      localStorage.setItem("w2l-playground-code", code);
    } else {
      // Fallback to browser download
      downloadFile(code, `w2l-code-${Date.now()}.ts`, "text/typescript");
      localStorage.setItem("w2l-playground-code", code);
      showSuccess("Code downloaded successfully!");
    }
  } catch (error) {
    // Fallback to browser download and localStorage
    downloadFile(code, `w2l-code-${Date.now()}.ts`, "text/typescript");
    localStorage.setItem("w2l-playground-code", code);
    showSuccess("Code downloaded successfully!");
  }
}

// Download file helper
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Load saved code from localStorage
function loadSavedCode() {
  const savedCode = localStorage.getItem("w2l-playground-code");
  if (savedCode) {
    editor.setValue(savedCode);
  }
}

// Handle file loading
function handleFileLoad(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = [".ts", ".js", ".tsx", ".jsx"];
  const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

  if (!isValid) {
    showError(
      "Please select a valid TypeScript or JavaScript file (.ts, .js, .tsx, .jsx)"
    );
    return;
  }

  // Read the file
  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target?.result as string;
    if (content) {
      editor.setValue(content);
      showSuccess(`Loaded file: ${file.name}`);
      // Don't save to localStorage automatically, let user run it first
    }
  };

  reader.onerror = () => {
    showError(`Failed to read file: ${file.name}`);
  };

  reader.readAsText(file);

  // Reset the input so the same file can be loaded again if needed
  input.value = "";
}

// Show error message
function showError(message: string) {
  clearMessages();
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Show success message
function showSuccess(message: string) {
  clearMessages();
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;
  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Clear all messages
function clearMessages() {
  document
    .querySelectorAll(".error-message, .success-message")
    .forEach((el) => el.remove());
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
