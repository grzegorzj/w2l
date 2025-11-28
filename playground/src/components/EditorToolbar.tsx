interface EditorToolbarProps {
  onLoadFile: () => void;
  onRefreshFile: () => void;
  onRun: () => void;
  onSaveCode: () => void;
  currentFileName: string | null;
  autoImport: boolean;
  onAutoImportChange: (checked: boolean) => void;
}

export function EditorToolbar({
  onLoadFile,
  onRefreshFile,
  onRun,
  onSaveCode,
  currentFileName,
  autoImport,
  onAutoImportChange,
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
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          title="Automatically import all w2l elements without explicit import statements"
        >
          <input
            type="checkbox"
            checked={autoImport}
            onChange={(e) => onAutoImportChange(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Autoimport
        </label>
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

