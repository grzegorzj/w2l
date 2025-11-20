interface EditorToolbarProps {
  onLoadFile: () => void;
  onRefreshFile: () => void;
  onRun: () => void;
  onSaveCode: () => void;
  currentFileName: string | null;
}

export function EditorToolbar({
  onLoadFile,
  onRefreshFile,
  onRun,
  onSaveCode,
  currentFileName,
}: EditorToolbarProps) {
  return (
    <div className="pane-header">
      <div className="pane-header-title">
        <span>Code Editor</span>
        {currentFileName && (
          <span style={{ marginLeft: "10px", fontSize: "12px", opacity: 0.7 }}>
            ({currentFileName})
          </span>
        )}
      </div>
      <div className="button-group">
        <button onClick={onLoadFile}>Load File</button>
        <button 
          onClick={onRefreshFile} 
          disabled={!currentFileName}
          title={currentFileName ? `Refresh ${currentFileName}` : "No file loaded"}
        >
          Refresh {currentFileName && '↻'}
        </button>
        <button onClick={onRun}>Run Code (Cmd/Ctrl+Enter)</button>
        <button onClick={onSaveCode}>Save Code</button>
      </div>
    </div>
  );
}

