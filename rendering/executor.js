/**
 * W2L Code Executor
 * 
 * Safely executes w2l code in a VM context and returns the rendered SVG.
 * Uses Node.js VM module for sandboxed execution.
 */

import vm from 'vm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import w2l library from parent directory
// In production, this would be installed via npm or linked
const require = createRequire(import.meta.url);
let w2lModule;

try {
  // Try to import from parent directory (development)
  const w2lPath = join(__dirname, '..', 'dist', 'index.js');
  w2lModule = await import(w2lPath);
} catch (error) {
  console.error('Failed to load w2l from parent directory:', error.message);
  try {
    // Fallback: try to import as installed package
    w2lModule = await import('w2l');
  } catch (fallbackError) {
    console.error('Failed to load w2l package:', fallbackError.message);
    throw new Error('W2L library not found. Please ensure it is built or installed.');
  }
}

/**
 * Executes w2l code and returns the rendered SVG string
 * 
 * @param {string} code - W2L JavaScript code to execute
 * @param {object} options - Execution options
 * @param {number} options.timeout - Execution timeout in ms (default: 5000)
 * @returns {Promise<string>} Rendered SVG string
 */
export async function executeW2LCode(code, options = {}) {
  const {
    timeout = 5000
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create a safe sandbox context with w2l library
      const sandbox = {
        console: {
          log: (...args) => {
            // Capture console.log but don't output in production
            if (process.env.NODE_ENV === 'development') {
              console.log('[w2l]', ...args);
            }
          },
          error: (...args) => console.error('[w2l]', ...args),
          warn: (...args) => console.warn('[w2l]', ...args),
        },
        // Make w2l exports available
        ...w2lModule,
        // Provide common globals
        Math,
        Date,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean,
      };

      // Create VM context
      const context = vm.createContext(sandbox);

      // Transform ES6 imports to variable assignments
      // This converts: import { X, Y } from "w2l"
      // Into: const { X, Y } = this
      const transformedCode = code.replace(
        /import\s*{([^}]+)}\s*from\s*['"]w2l['"]\s*;?/g,
        'const {$1} = this;'
      ).replace(
        /import\s+(\w+)\s+from\s*['"]w2l['"]\s*;?/g,
        'const $1 = this;'
      );

      // Wrap code to ensure it returns the SVG
      const wrappedCode = `
        (async function() {
          ${transformedCode}
        })();
      `;

      // Set timeout
      const timeoutId = setTimeout(() => {
        reject(new Error(`Execution timeout after ${timeout}ms`));
      }, timeout);

      try {
        // Execute code in VM
        const script = new vm.Script(wrappedCode, {
          filename: 'w2l-user-code.js',
          timeout: timeout,
        });

        const result = script.runInContext(context, {
          timeout: timeout,
          displayErrors: true,
        });

        clearTimeout(timeoutId);

        // If result is a promise, wait for it
        if (result && typeof result.then === 'function') {
          result
            .then(svg => {
              if (typeof svg !== 'string') {
                reject(new Error('Code must return an SVG string'));
              } else {
                resolve(svg);
              }
            })
            .catch(reject);
        } else if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Code must return an SVG string'));
        }
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    } catch (error) {
      reject(new Error(`Execution error: ${error.message}`));
    }
  });
}

/**
 * Validates w2l code without executing it
 * 
 * @param {string} code - Code to validate
 * @returns {object} Validation result with { valid: boolean, error?: string }
 */
export function validateW2LCode(code) {
  try {
    // Basic syntax check using VM Script
    new vm.Script(code);
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error.message 
    };
  }
}

