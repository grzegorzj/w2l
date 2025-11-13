interface RendererToolbarProps {
  onSaveSVG: () => void;
  canSaveSVG: boolean;
}

export function RendererToolbar({ onSaveSVG, canSaveSVG }: RendererToolbarProps) {
  return (
    <div className="pane-header">
      <div className="pane-header-title">
        <span>Renderer</span>
      </div>
      <div className="button-group">
        <button onClick={onSaveSVG} disabled={!canSaveSVG}>
          Save SVG
        </button>
      </div>
    </div>
  );
}

