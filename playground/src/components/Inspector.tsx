import { useState } from "react";

interface InspectorProps {
  data: any;
  onElementHover?: (elementId: string | null) => void;
}

export function Inspector({ data, onElementHover }: InspectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return null;
  }

  const toggleExpanded = (path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleMouseEnter = (elementId: string) => {
    onElementHover?.(elementId);
  };

  const handleMouseLeave = () => {
    onElementHover?.(null);
  };

  const renderValue = (value: any, path: string, key?: string): JSX.Element => {
    if (value === null || value === undefined) {
      return <span className="inspector-value-null">null</span>;
    }

    if (typeof value === "boolean") {
      return <span className="inspector-value-boolean">{String(value)}</span>;
    }

    if (typeof value === "number") {
      return <span className="inspector-value-number">{value}</span>;
    }

    if (typeof value === "string") {
      return <span className="inspector-value-string">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path);
      const isEmpty = value.length === 0;

      return (
        <div className="inspector-array">
          <span
            className="inspector-toggle"
            onClick={() => !isEmpty && toggleExpanded(path)}
            style={{ cursor: isEmpty ? "default" : "pointer" }}
          >
            {isEmpty ? "[]" : isExpanded ? "▼" : "▶"}{" "}
            <span className="inspector-array-label">
              Array({value.length})
            </span>
          </span>
          {isExpanded && !isEmpty && (
            <div className="inspector-array-items">
              {value.map((item, index) => (
                <div key={index} className="inspector-array-item">
                  <span className="inspector-array-index">[{index}]:</span>
                  {renderValue(item, `${path}[${index}]`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const isExpanded = expandedPaths.has(path);
      const keys = Object.keys(value);
      const isEmpty = keys.length === 0;
      const elementId = value.id;
      const typeName = value.type || "Object";

      return (
        <div
          className="inspector-object"
          onMouseEnter={() => elementId && handleMouseEnter(elementId)}
          onMouseLeave={handleMouseLeave}
        >
          <span
            className="inspector-toggle"
            onClick={() => !isEmpty && toggleExpanded(path)}
            style={{ cursor: isEmpty ? "default" : "pointer" }}
          >
            {isEmpty ? "{}" : isExpanded ? "▼" : "▶"}{" "}
            <span className="inspector-object-type">
              {typeName}
              {value.name && (
                <span className="inspector-object-name"> "{value.name}"</span>
              )}
            </span>
          </span>
          {isExpanded && !isEmpty && (
            <div className="inspector-object-properties">
              {keys.map((k) => (
                <div key={k} className="inspector-property">
                  <span className="inspector-property-key">{k}:</span>
                  {renderValue(value[k], `${path}.${k}`, k)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="inspector-value-unknown">{String(value)}</span>;
  };

  const artboards = Array.isArray(data) ? data : [data];

  return (
    <>
      <button
        className="inspector-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Inspector"
      >
        🔍
      </button>

      {isOpen && (
        <div className="inspector-panel">
          <div className="inspector-header">
            <h3>Object Inspector</h3>
            <button
              className="inspector-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="inspector-content">
            {artboards.map((artboard: any, index: number) => {
              const inspectorData = artboard?.toInspectorJSON
                ? artboard.toInspectorJSON()
                : artboard;

              return (
                <div key={index} className="inspector-artboard">
                  {artboards.length > 1 && (
                    <div className="inspector-artboard-label">
                      Artboard {index + 1}
                    </div>
                  )}
                  {renderValue(inspectorData, `artboard-${index}`)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

