import { useRef } from "react";
import { useZoomPan } from "../hooks/useZoomPan";
import { ExecutionResult } from "../hooks/useCodeExecution";

interface RendererProps {
  result: ExecutionResult;
}

export function Renderer({ result }: RendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, panX, panY, zoomIn, zoomOut, resetZoom } =
    useZoomPan(containerRef);

  const renderContent = () => {
    if (result.svgs.length === 0) {
      return (
        <div className="empty-state">
          {result.status === "error" ? (
            <div
              style={{
                textAlign: "left",
                fontFamily: "monospace",
                fontSize: "12px",
                whiteSpace: "pre-wrap",
                padding: "20px",
                color: "#ef4444",
              }}
            >
              <strong>Error executing code:</strong>
              {"\n\n"}
              {result.message}
            </div>
          ) : (
            "Run your code to see the output"
          )}
        </div>
      );
    }

    if (result.svgs.length === 1) {
      return (
        <div className="artboard-item">
          <div dangerouslySetInnerHTML={{ __html: result.svgs[0] }} />
        </div>
      );
    }

    return (
      <div className="artboards-container">
        {result.svgs.map((svg, index) => (
          <div key={index} className="artboard-item">
            <div className="artboard-label">Artboard {index + 1}</div>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pane-content">
      <div className="svg-container" ref={containerRef}>
        <div className="zoom-level">{Math.round(zoom * 100)}%</div>
        <div
          className="svg-wrapper"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          }}
        >
          <div className="svg-content">{renderContent()}</div>
        </div>
        <div className="zoom-controls">
          <button onClick={zoomIn} title="Zoom In">
            +
          </button>
          <button onClick={resetZoom} title="Reset Zoom">
            ⊙
          </button>
          <button onClick={zoomOut} title="Zoom Out">
            −
          </button>
        </div>
      </div>
    </div>
  );
}

