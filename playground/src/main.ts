import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

// Default code template
const DEFAULT_CODE = `import { Artboard, Triangle } from 'w2l';

// Create an artboard
const artboard = new Artboard({
  size: { width: 800, height: 600 },
  padding: "20px",
  backgroundColor: "white"
});

// Create a right triangle (3-4-5)
const triangle = new Triangle({
  type: "right",
  a: 300,
  b: 400,
  fill: "#3498db",
  stroke: "#2c3e50",
  strokeWidth: 2
});

// Position the triangle at the center
triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.center,
  x: 0,
  y: 0
});

// Add triangle to artboard
artboard.addElement(triangle);

// Render the artboard
artboard.render();
`;

// State
let editor: monaco.editor.IStandaloneCodeEditor;
let currentSVG: string = '';
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
  const container = document.getElementById('editor-container')!;

  // Configure TypeScript compiler options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    allowNonTsExtensions: true,
    lib: ['ES2020'],
  });

  // Add W2L type definitions
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `
declare module 'w2l' {
  export interface Point {
    x: number;
    y: number;
  }

  export interface Size {
    width: number | "auto";
    height: number | "auto";
  }

  export interface ArtboardConfig {
    size: Size | "auto";
    padding?: string;
    backgroundColor?: string;
  }

  export interface PositionReference {
    relativeFrom: Point;
    relativeTo: Point;
    x: number;
    y: number;
  }

  export interface RotateConfig {
    relativeTo: any;
    deg: number;
  }

  export interface TranslateConfig {
    along: Point;
    distance: number;
  }

  export interface TriangleConfig {
    type: "right" | "equilateral" | "isosceles" | "scalene";
    a: number;
    b?: number;
    c?: number;
    orientation?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }

  export interface TriangleSide {
    length: number;
    center: Point;
    start: Point;
    end: Point;
    outwardNormal: Point;
  }

  export class Artboard {
    constructor(config: ArtboardConfig);
    get center(): Point;
    get size(): Size;
    addElement(element: any): void;
    render(): string;
  }

  export abstract class Shape {
    abstract get center(): Point;
    position(config: PositionReference): void;
    rotate(config: RotateConfig): void;
    translate(config: TranslateConfig): void;
    abstract render(): string;
  }

  export class Triangle extends Shape {
    constructor(config: TriangleConfig);
    get center(): Point;
    get sides(): [TriangleSide, TriangleSide, TriangleSide];
    render(): string;
  }
}
    `,
    'file:///node_modules/@types/w2l/index.d.ts'
  );

  // Create the editor
  editor = monaco.editor.create(container, {
    value: DEFAULT_CODE,
    language: 'typescript',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    tabSize: 2,
    wordWrap: 'on',
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: 'on',
    snippetSuggestions: 'inline',
  });

  // Add keyboard shortcut for running code (Cmd/Ctrl+Enter)
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    runCode();
  });
}

// Setup SVG renderer
function setupRenderer() {
  const container = document.getElementById('svg-container')!;
  const wrapper = document.getElementById('svg-wrapper')!;

  // Mouse wheel zoom
  container.addEventListener('wheel', (e) => {
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
  container.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      isPanning = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      container.style.cursor = 'grabbing';
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (isPanning) {
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateTransform();
    }
  });

  container.addEventListener('mouseup', () => {
    if (isPanning) {
      isPanning = false;
      container.style.cursor = 'grab';
    }
  });

  container.addEventListener('mouseleave', () => {
    if (isPanning) {
      isPanning = false;
      container.style.cursor = 'grab';
    }
  });

  // Zoom controls
  document.getElementById('zoom-in')!.addEventListener('click', () => {
    zoom = Math.min(5, zoom + 0.25);
    updateTransform();
    updateZoomLevel();
  });

  document.getElementById('zoom-out')!.addEventListener('click', () => {
    zoom = Math.max(0.1, zoom - 0.25);
    updateTransform();
    updateZoomLevel();
  });

  document.getElementById('zoom-reset')!.addEventListener('click', () => {
    zoom = 1;
    panX = 0;
    panY = 0;
    updateTransform();
    updateZoomLevel();
  });
}

// Update SVG transform
function updateTransform() {
  const wrapper = document.getElementById('svg-wrapper')!;
  wrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

// Update zoom level display
function updateZoomLevel() {
  const zoomLevel = document.getElementById('zoom-level')!;
  zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
}

// Setup resizable panes
function setupResizer() {
  const resizer = document.getElementById('resizer')!;
  const editorPane = document.getElementById('editor-pane')!;
  const rendererPane = document.getElementById('renderer-pane')!;
  
  let isResizing = false;
  let startX = 0;
  let startEditorWidth = 0;

  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startEditorWidth = editorPane.offsetWidth;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const delta = e.clientX - startX;
    const containerWidth = editorPane.parentElement!.offsetWidth;
    const newEditorWidth = startEditorWidth + delta;
    const minWidth = 200;

    if (newEditorWidth >= minWidth && newEditorWidth <= containerWidth - minWidth) {
      const editorPercent = (newEditorWidth / containerWidth) * 100;
      const rendererPercent = 100 - editorPercent;
      
      editorPane.style.flex = `0 0 ${editorPercent}%`;
      rendererPane.style.flex = `0 0 ${rendererPercent}%`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('run-btn')!.addEventListener('click', runCode);
  document.getElementById('save-svg-btn')!.addEventListener('click', saveSVG);
  document.getElementById('save-code-btn')!.addEventListener('click', saveCode);
}

// Run the user's code
async function runCode() {
  const code = editor.getValue();
  const svgContent = document.getElementById('svg-content')!;
  const saveSvgBtn = document.getElementById('save-svg-btn') as HTMLButtonElement;
  
  // Clear previous output
  clearMessages();
  
  try {
    // Import W2L dynamically
    const w2l = await import('w2l');
    
    // Create a sandboxed environment
    const sandbox = {
      Artboard: w2l.Artboard,
      Triangle: w2l.Triangle,
      Shape: w2l.Shape,
      console: {
        log: (...args: any[]) => console.log('[User Code]', ...args),
        error: (...args: any[]) => console.error('[User Code]', ...args),
        warn: (...args: any[]) => console.warn('[User Code]', ...args),
      },
    };
    
    // Transform the code to remove imports and use sandbox
    let transformedCode = code
      .replace(/import\s+{[^}]+}\s+from\s+['"]w2l['"];?\s*/g, '')
      .trim();
    
    // If the code doesn't end with a return statement, add one
    // Check if the last statement is artboard.render()
    const lines = transformedCode.split('\n');
    const lastLine = lines[lines.length - 1].trim();
    
    if (!lastLine.startsWith('return ') && lastLine.includes('artboard.render()')) {
      transformedCode = transformedCode.replace(/artboard\.render\(\);?\s*$/, 'return artboard.render();');
    } else if (!lastLine.startsWith('return ') && !lastLine.includes('return')) {
      // Add a return statement for the last expression
      transformedCode += '\n\n// Auto-added return\nreturn artboard.render();';
    }
    
    // Wrap in function and execute
    const func = new Function(...Object.keys(sandbox), transformedCode);
    const result = func(...Object.values(sandbox));
    
    // If result is a string (SVG), display it
    if (typeof result === 'string' && result.includes('<svg')) {
      currentSVG = result;
      svgContent.innerHTML = result;
      saveSvgBtn.disabled = false;
      showSuccess('Code executed successfully!');
    } else {
      showError('Code did not return an SVG string. Make sure to return artboard.render()');
      saveSvgBtn.disabled = true;
    }
  } catch (error: any) {
    console.error('Error executing code:', error);
    showError(`Error: ${error.message}`);
    svgContent.innerHTML = '<div class="empty-state">Error executing code. Check console for details.</div>';
    saveSvgBtn.disabled = true;
  }
}

// Save SVG to file
async function saveSVG() {
  if (!currentSVG) return;
  
  try {
    const response = await fetch('/api/save-svg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ svg: currentSVG }),
    });
    
    if (response.ok) {
      const { filename } = await response.json();
      showSuccess(`SVG saved as ${filename}`);
    } else {
      // Fallback to browser download if server endpoint doesn't exist
      downloadFile(currentSVG, `w2l-output-${Date.now()}.svg`, 'image/svg+xml');
      showSuccess('SVG downloaded successfully!');
    }
  } catch (error) {
    // Fallback to browser download
    downloadFile(currentSVG, `w2l-output-${Date.now()}.svg`, 'image/svg+xml');
    showSuccess('SVG downloaded successfully!');
  }
}

// Save code to file
async function saveCode() {
  const code = editor.getValue();
  
  try {
    const response = await fetch('/api/save-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (response.ok) {
      const { filename } = await response.json();
      showSuccess(`Code saved as ${filename}`);
      localStorage.setItem('w2l-playground-code', code);
    } else {
      // Fallback to browser download
      downloadFile(code, `w2l-code-${Date.now()}.ts`, 'text/typescript');
      localStorage.setItem('w2l-playground-code', code);
      showSuccess('Code downloaded successfully!');
    }
  } catch (error) {
    // Fallback to browser download and localStorage
    downloadFile(code, `w2l-code-${Date.now()}.ts`, 'text/typescript');
    localStorage.setItem('w2l-playground-code', code);
    showSuccess('Code downloaded successfully!');
  }
}

// Download file helper
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Load saved code from localStorage
function loadSavedCode() {
  const savedCode = localStorage.getItem('w2l-playground-code');
  if (savedCode) {
    editor.setValue(savedCode);
  }
}

// Show error message
function showError(message: string) {
  clearMessages();
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Show success message
function showSuccess(message: string) {
  clearMessages();
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, 3000);
}

// Clear all messages
function clearMessages() {
  document.querySelectorAll('.error-message, .success-message').forEach(el => el.remove());
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

