# W2L Guide Editor

A minimal, standalone editor for W2L guide JSON files with direct file system access.

## Features

- **File System Access API** - Save directly to disk without downloads
- **Recent Files** - Quick access to recently opened guides
- **Live Preview** - See rendered markdown as you type
- **Tag Management** - Easy adding/removing of covers and topics
- **Dark Theme** - Matches the playground's visual style
- **Keyboard Shortcuts** - Cmd/Ctrl+S to save
- **Zero Dependencies** - Single HTML file, no build step

## Usage

### Opening the Editor

1. Open `index.html` in a modern browser (Chrome, Edge, or Chromium-based)
2. Click "Open Guide" to select a guide JSON file (or "Recent ▾" for recently opened files)
3. Edit the fields
4. Press Cmd/Ctrl+S or click "Save" to save changes directly to the file

### Recent Files

- The editor remembers your last 10 opened files
- Click **"Recent ▾"** to see and reopen them
- Files are stored with their file system handles for direct access
- Remove individual files with the **×** button
- Clear all recent files with **"Clear All"**

### Browser Compatibility

**Required:** Chrome, Edge, or another Chromium-based browser with File System Access API support.

**Not supported:** Firefox, Safari (as of now)

### Guide Structure

Each guide JSON file contains:

- **id**: Unique identifier (e.g., `"triangle"`)
- **title**: Display title (e.g., `"Triangle Guide"`)
- **description**: Short description shown to the agent upfront
- **covers**: Array of element names this guide covers (e.g., `["Triangle", "Angle"]`)
- **topics**: Array of topics/concepts covered (e.g., `["Marking angles", "Altitudes"]`)
- **content**: Full markdown content of the guide

### Editing Tips

1. **ID**: Use lowercase, hyphen-separated (e.g., `text-and-latex`)
2. **Description**: Keep it concise - this appears in the system prompt
3. **Covers**: Add W2L element names that this guide covers
4. **Topics**: List specific topics for better discoverability
5. **Content**: Write in markdown - preview updates in real-time

### Keyboard Shortcuts

- **Cmd/Ctrl+S**: Save file
- **Enter** (in tag inputs): Add tag

### Notes

- The editor warns you before closing if there are unsaved changes
- File is saved directly - no downloads folder clutter
- Markdown preview is simplified but covers the basics
- All changes are local until you save
- **Empty or new JSON files** are handled gracefully with default values

## Development

This is a standalone HTML file with no build process. To modify:

1. Edit `index.html`
2. Refresh in browser
3. Done!

The editor uses vanilla JavaScript and inline CSS for simplicity.

