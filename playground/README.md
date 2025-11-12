# W2L Playground

An interactive playground for experimenting with the W2L library.

## Features

- **Code Editor**: Monaco Editor with full TypeScript support and autocomplete
- **Zoomable Renderer**: Pan and zoom the SVG output with mouse controls
- **Resizable Panels**: Adjust the view split between renderer and editor
- **Execute On Demand**: Run your code with Cmd/Ctrl+Enter or the Run button
- **Save Functionality**: Save both your code and generated SVG files
- **Auto-save**: Your code is automatically saved to localStorage

## Getting Started

### Installation

From the root of the W2L project:

```bash
npm install
cd playground
npm install
```

### Running the Playground

From the root directory:

```bash
npm run playground
```

Or from the playground directory:

```bash
npm run dev
```

The playground will start at http://localhost:3000

## Using the Playground

### Writing Code

The code editor supports full TypeScript with autocomplete for the W2L library. The default template includes:

```typescript
import { Artboard, Triangle } from 'w2l';

// Your code here...

artboard.render(); // This will be the output
```

### Running Code

- Click the "Run Code" button
- Or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows/Linux)

### Renderer Controls

- **Mouse Wheel**: Zoom in/out
- **Click + Drag**: Pan around the canvas
- **Zoom Controls**: Use the +/- buttons in the bottom right
- **Reset**: Click the center button to reset zoom and pan

### Saving

- **Save SVG**: Saves the rendered SVG to `playground/saved/`
- **Save Code**: Saves your TypeScript code to `playground/saved/`

If the server API is not available, files will be downloaded to your browser's download folder instead.

## Keyboard Shortcuts

- `Cmd/Ctrl + Enter`: Run code
- `Cmd/Ctrl + S`: Save code (browser default)

## Tips

1. Your code is automatically saved to localStorage, so you won't lose it when refreshing
2. The renderer has a grey background, while the canvas/artboard has a white background
3. Use the autocomplete (trigger with `Ctrl+Space`) to explore available APIs
4. Check the browser console for any runtime errors

## Architecture

The playground consists of:

- **Frontend**: Vite + TypeScript + Monaco Editor
- **Backend**: Simple Node.js server for file saving
- **Library**: The W2L library loaded as a local dependency

## Troubleshooting

### Monaco Editor not loading

Make sure all dependencies are installed:
```bash
npm install
```

### SVG not rendering

Make sure your code:
1. Creates an Artboard
2. Calls `artboard.render()` at the end
3. Doesn't have syntax errors (check console)

### Save not working

The playground will fallback to browser downloads if the server API is not available. Files will be saved to your browser's download folder.

