export async function saveSVG(svg: string): Promise<void> {
  try {
    const response = await fetch("/api/save-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ svg }),
    });

    if (response.ok) {
      const { filename } = await response.json();
      console.log(`SVG saved as ${filename}`);
    } else {
      // Fallback to browser download if server endpoint doesn't exist
      downloadFile(svg, `w2l-output-${Date.now()}.svg`, "image/svg+xml");
    }
  } catch (error) {
    // Fallback to browser download
    downloadFile(svg, `w2l-output-${Date.now()}.svg`, "image/svg+xml");
  }
}

export async function saveCode(code: string): Promise<void> {
  try {
    const response = await fetch("/api/save-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      const { filename } = await response.json();
      console.log(`Code saved as ${filename}`);
      localStorage.setItem("w2l-playground-code", code);
    } else {
      // Fallback to browser download
      downloadFile(code, `w2l-code-${Date.now()}.ts`, "text/typescript");
      localStorage.setItem("w2l-playground-code", code);
    }
  } catch (error) {
    // Fallback to browser download and localStorage
    downloadFile(code, `w2l-code-${Date.now()}.ts`, "text/typescript");
    localStorage.setItem("w2l-playground-code", code);
  }
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function loadCodeFromLocalStorage(): string | null {
  return localStorage.getItem("w2l-playground-code");
}

export async function loadFileFromInput(
  file: File
): Promise<{ content: string; error?: string }> {
  // Check file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = [".ts", ".js", ".tsx", ".jsx"];
  const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

  if (!isValid) {
    return {
      content: "",
      error:
        "Please select a valid TypeScript or JavaScript file (.ts, .js, .tsx, .jsx)",
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        resolve({ content });
      } else {
        resolve({ content: "", error: `Failed to read file: ${file.name}` });
      }
    };

    reader.onerror = () => {
      resolve({ content: "", error: `Failed to read file: ${file.name}` });
    };

    reader.readAsText(file);
  });
}

