import { useRef, useImperativeHandle, forwardRef } from "react";
import { useMonaco } from "../hooks/useMonaco";

interface CodeEditorProps {
  initialValue: string;
  onRun?: () => void;
  autoImport?: boolean;
}

export interface CodeEditorHandle {
  getValue: () => string;
  setValue: (value: string) => void;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  ({ initialValue, onRun, autoImport = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { getValue, setValue } = useMonaco(containerRef, initialValue, onRun, autoImport);

    useImperativeHandle(ref, () => ({
      getValue,
      setValue,
    }));

  return (
    <div className="pane-content">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
  }
);

CodeEditor.displayName = "CodeEditor";

