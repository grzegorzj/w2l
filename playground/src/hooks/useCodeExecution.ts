import { useState, useCallback } from "react";

export type ExecutionStatus = "idle" | "success" | "error";

export interface ExecutionResult {
  svgs: string[];
  message: string;
  status: ExecutionStatus;
}

// Cache for w2l exports
let cachedW2LExports: string[] | null = null;
let w2lImportStatement: string | null = null;

// Get all w2l exports dynamically
async function getW2LExports(): Promise<string[]> {
  if (cachedW2LExports) {
    return cachedW2LExports;
  }
  
  try {
    const w2l = await import("w2l");
    cachedW2LExports = Object.keys(w2l);
    console.log("[Playground] Discovered w2l exports:", cachedW2LExports);
    return cachedW2LExports;
  } catch (error) {
    console.error("[Playground] Failed to load w2l exports:", error);
    return [];
  }
}

// Generate import statement from actual w2l exports
async function generateW2LImport(): Promise<string> {
  if (w2lImportStatement) {
    return w2lImportStatement;
  }
  
  const exports = await getW2LExports();
  if (exports.length === 0) {
    return "";
  }
  
  w2lImportStatement = `import { ${exports.join(", ")} } from "w2l";`;
  return w2lImportStatement;
}

// Check if code has w2l imports
function hasW2LImport(code: string): boolean {
  return /import\s+.*from\s+['"]w2l['"]/.test(code);
}

// Ensure code has w2l imports (add if missing)
export async function ensureW2LImports(code: string): Promise<string> {
  if (hasW2LImport(code)) {
    return code;
  }
  
  const importStatement = await generateW2LImport();
  if (!importStatement) {
    return code;
  }
  
  return `${importStatement}\n\n${code}`;
}

export function useCodeExecution(autoImport: boolean = true) {
  const [result, setResult] = useState<ExecutionResult>({
    svgs: [],
    message: "",
    status: "idle",
  });

  const executeCode = useCallback(async (code: string) => {
    try {
      // If autoimport is ON and code has no imports, add them
      let codeToExecute = code;
      if (autoImport && !hasW2LImport(code)) {
        codeToExecute = await ensureW2LImports(code);
      }

      // Import W2L dynamically
      const w2l = await import("w2l");

      // Create a sandboxed environment
      const sandbox = {
        ...w2l,
        console: {
          log: (...args: any[]) => console.log("[User Code]", ...args),
          error: (...args: any[]) => console.error("[User Code]", ...args),
          warn: (...args: any[]) => console.warn("[User Code]", ...args),
        },
      };

      // Transform the code to remove imports
      // We always strip imports because we inject w2l into the sandbox
      let transformedCode = codeToExecute
        .replace(/import\s+{[^}]+}\s+from\s+['"]w2l['"];?\s*/g, "")
        .replace(/import\s+\*\s+as\s+\w+\s+from\s+['"]w2l['"];?\s*/g, "")
        .trim();

      // Auto-detect render calls and artboards
      const lines = transformedCode.split("\n");
      const activeRenderCalls: {
        line: string;
        artboardName: string;
        lineIndex: number;
      }[] = [];

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (
          trimmedLine.startsWith("//") ||
          trimmedLine.startsWith("/*") ||
          trimmedLine.startsWith("*")
        ) {
          return;
        }

        const renderMatch = line.match(/(\w+)\.render\(\)/);
        if (renderMatch) {
          const commentIndex = line.indexOf("//");
          const renderIndex = line.indexOf(renderMatch[0]);
          if (commentIndex === -1 || renderIndex < commentIndex) {
            activeRenderCalls.push({
              line: line.trim(),
              artboardName: renderMatch[1],
              lineIndex: index,
            });
          }
        }
      });

      const lastLine = lines[lines.length - 1].trim();

      if (!lastLine.startsWith("return ") && !lastLine.includes("return")) {
        if (activeRenderCalls.length > 0) {
          console.log(
            "[Playground] Found explicit render calls:",
            activeRenderCalls.map((r) => r.artboardName)
          );

          if (activeRenderCalls.length === 1) {
            const renderCall = activeRenderCalls[0];
            const renderPattern = new RegExp(
              `${renderCall.artboardName}\\.render\\(\\);?\\s*$`
            );
            transformedCode = transformedCode.replace(
              renderPattern,
              `return ${renderCall.artboardName}.render();`
            );
          } else {
            activeRenderCalls.forEach((renderCall) => {
              const renderPattern = new RegExp(
                `^\\s*${renderCall.artboardName}\\.render\\(\\);?\\s*$`,
                "gm"
              );
              transformedCode = transformedCode.replace(renderPattern, "");
            });

            const returnArray = activeRenderCalls
              .map((r) => `${r.artboardName}.render()`)
              .join(", ");
            transformedCode += `\n\nreturn [${returnArray}];`;
          }
        } else {
          const artboardMatches = transformedCode.match(
            /const\s+(\w+)\s*=\s*new\s+Artboard/g
          );
          const artboardNames = artboardMatches
            ? artboardMatches
                .map((m) => m.match(/const\s+(\w+)/)?.[1])
                .filter(Boolean)
            : [];

          console.log(
            "[Playground] No explicit renders. Detected artboards:",
            artboardNames
          );

          if (artboardNames.length > 1) {
            const returnArray = artboardNames
              .map((name) => `${name}.render()`)
              .join(", ");
            transformedCode += `\n\nreturn [${returnArray}];`;
          } else if (artboardNames.length === 1) {
            transformedCode += `\n\nreturn ${artboardNames[0]}.render();`;
          } else {
            transformedCode += "\n\nreturn artboard.render();";
          }
        }
      } else if (
        !lastLine.startsWith("return ") &&
        lastLine.includes(".render()")
      ) {
        transformedCode = transformedCode.replace(
          /([^;]+\.render\(\));?\s*$/,
          "return $1;"
        );
      }

      console.log(
        "[Playground] Transformed code (last 200 chars):",
        transformedCode.slice(-200)
      );

      // Wrap in function and execute
      const func = new Function(...Object.keys(sandbox), transformedCode);
      const execResult = func(...Object.values(sandbox));

      // Check if result is a single SVG string or an array of SVG strings
      let svgsToRender: string[] = [];

      if (typeof execResult === "string" && execResult.includes("<svg")) {
        svgsToRender = [execResult];
      } else if (Array.isArray(execResult)) {
        svgsToRender = execResult.filter(
          (item: any) => typeof item === "string" && item.includes("<svg")
        );
      }

      if (svgsToRender.length > 0) {
        setResult({
          svgs: svgsToRender,
          message: `Code executed successfully!${svgsToRender.length > 1 ? ` Rendered ${svgsToRender.length} artboards.` : ""}`,
          status: "success",
        });
      } else {
        setResult({
          svgs: [],
          message:
            "Code did not return an SVG string or array of SVGs. Make sure to return artboard.render() or an array of renders.",
          status: "error",
        });
      }
    } catch (error: any) {
      console.error("Error executing code:", error);
      console.error("Full error object:", error);
      console.error("Stack trace:", error.stack);

      let errorMessage = `Error: ${error.message}`;
      if (error.stack) {
        errorMessage += `\n\nStack Trace:\n${error.stack}`;
      }

      setResult({
        svgs: [],
        message: errorMessage,
        status: "error",
      });
    }
  }, [autoImport]);

  return { result, executeCode };
}

