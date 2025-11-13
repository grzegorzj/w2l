import { useEffect, useRef, useState } from "react";

interface ResizerProps {
  onResize?: (editorPercent: number) => void;
}

export function Resizer({ onResize }: ResizerProps) {
  const resizerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let startX = 0;
    let startEditorWidth = 0;

    const handleMouseDown = (e: MouseEvent) => {
      setIsResizing(true);
      startX = e.clientX;
      
      const editorPane = document.getElementById("editor-pane");
      if (editorPane) {
        startEditorWidth = editorPane.offsetWidth;
      }
      
      document.body.style.cursor = "ew-resize";
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const editorPane = document.getElementById("editor-pane");
      const rendererPane = document.getElementById("renderer-pane");
      
      if (!editorPane || !rendererPane || !editorPane.parentElement) return;

      const delta = e.clientX - startX;
      const containerWidth = editorPane.parentElement.offsetWidth;
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

        onResize?.(editorPercent);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.style.cursor = "";
      }
    };

    resizer.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, onResize]);

  return <div ref={resizerRef} className="resizer" />;
}

