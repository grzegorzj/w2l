interface EditorToolbarProps {
  onLoadFile: () => void;
  onRun: () => void;
  onSaveCode: () => void;
}

export function EditorToolbar({
  onLoadFile,
  onRun,
  onSaveCode,
}: EditorToolbarProps) {
  return (
    <div className="pane-header">
      <div className="pane-header-title">
        <span>Code Editor</span>
      </div>
      <div className="button-group">
        <button onClick={onLoadFile}>Load File</button>
        <button onClick={onRun}>Run Code (Cmd/Ctrl+Enter)</button>
        <button onClick={onSaveCode}>Save Code</button>
      </div>
    </div>
  );
}

