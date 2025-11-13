import { useEffect, useRef, useState } from "react";

interface VerticalResizerProps {
  onResize?: (topPercent: number) => void;
}

export function VerticalResizer({ onResize }: VerticalResizerProps) {
  const resizerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const resizer = resizerRef.current;
    if (!resizer) return;

    let startY = 0;
    let startTopHeight = 0;

    const handleMouseDown = (e: MouseEvent) => {
      setIsResizing(true);
      startY = e.clientY;

      const editorSection = document.getElementById("editor-section");
      if (editorSection) {
        startTopHeight = editorSection.offsetHeight;
      }

      document.body.style.cursor = "ns-resize";
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const editorSection = document.getElementById("editor-section");
      const chatSection = document.getElementById("chat-section");

      if (!editorSection || !chatSection || !editorSection.parentElement) return;

      const delta = e.clientY - startY;
      const containerHeight = editorSection.parentElement.offsetHeight;
      const newTopHeight = startTopHeight + delta;
      const minHeight = 150;

      if (
        newTopHeight >= minHeight &&
        newTopHeight <= containerHeight - minHeight
      ) {
        const topPercent = (newTopHeight / containerHeight) * 100;
        const bottomPercent = 100 - topPercent;

        editorSection.style.flex = `0 0 ${topPercent}%`;
        chatSection.style.flex = `0 0 ${bottomPercent}%`;

        onResize?.(topPercent);
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

  return <div ref={resizerRef} className="vertical-resizer" />;
}

