import { useEffect, useState } from "react";
import { ExecutionStatus } from "../hooks/useCodeExecution";

interface MessageProps {
  message: string;
  type: ExecutionStatus;
}

export function Message({ message, type }: MessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message && type !== "idle") {
      setVisible(true);
      const timeout = setTimeout(() => {
        setVisible(false);
      }, type === "success" ? 3000 : 5000);

      return () => clearTimeout(timeout);
    } else {
      setVisible(false);
    }
  }, [message, type]);

  if (!visible || type === "idle") {
    return null;
  }

  const className = type === "success" ? "success-message" : "error-message";

  return <div className={className}>{message}</div>;
}

