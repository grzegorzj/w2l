#!/usr/bin/env node

/**
 * Snapshot Test Runner
 * 
 * Runs example files from playground/examples/tests and compares their output
 * against saved snapshots. When output changes, prompts user to mark as pass/fail.
 */

import { fileURLToPath } from 'url';
import { dirname, join, relative } from 'path';
import { readdir, readFile, writeFile, mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import * as readline from 'readline';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const testsDir = join(projectRoot, 'playground', 'examples', 'tests');
const snapshotsDir = join(__dirname, 'snapshots');
const snapshotStatusFile = join(__dirname, 'snapshot-status.json');

// Setup import resolution for 'w2l' package
// We need to ensure w2l can be imported from test files
const require = createRequire(import.meta.url);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Load snapshot status (which tests are marked as passed/failed)
 */
async function loadSnapshotStatus() {
  if (!existsSync(snapshotStatusFile)) {
    return {};
  }
  const content = await readFile(snapshotStatusFile, 'utf-8');
  return JSON.parse(content);
}

/**
 * Save snapshot status
 */
async function saveSnapshotStatus(status) {
  await writeFile(snapshotStatusFile, JSON.stringify(status, null, 2));
}

/**
 * Ensure snapshots directory exists
 */
async function ensureSnapshotsDir() {
  if (!existsSync(snapshotsDir)) {
    await mkdir(snapshotsDir, { recursive: true });
  }
}

/**
 * Get snapshot file path for a test
 */
function getSnapshotPath(testFile) {
  return join(snapshotsDir, testFile.replace('.js', '.svg'));
}

/**
 * Load a snapshot if it exists
 */
async function loadSnapshot(testFile) {
  const snapshotPath = getSnapshotPath(testFile);
  if (!existsSync(snapshotPath)) {
    return null;
  }
  return await readFile(snapshotPath, 'utf-8');
}

/**
 * Save a snapshot
 */
async function saveSnapshot(testFile, content) {
  const snapshotPath = getSnapshotPath(testFile);
  await writeFile(snapshotPath, content, 'utf-8');
}

/**
 * Setup w2l import for test execution
 * Creates a temporary wrapper that resolves w2l imports
 */
async function setupW2LImport() {
  const distPath = join(projectRoot, 'dist', 'index.js');
  if (!existsSync(distPath)) {
    throw new Error('w2l library not built. Run "npm run build" first.');
  }
}

/**
 * Transform test code to replace w2l imports with actual path
 * and wrap in an async function to allow return statements
 */
function transformTestCode(code, testFile) {
  const distPath = join(projectRoot, 'dist', 'index.js');
  // The temp file will be in snapshotsDir, so calculate relative path from there
  const tempFileDir = snapshotsDir;
  const relativePath = relative(tempFileDir, distPath);
  
  // First, replace w2l imports with relative path in the entire code
  let transformed = code.replace(
    /from\s+['"]w2l['"]/g,
    `from './${relativePath}'`
  );
  
  // Extract import statements (including multi-line imports) and remaining code
  // Match complete import statements, including multi-line ones
  const importRegex = /import\s+(?:{[^}]*}|[\w*\s,]+)\s+from\s+['"][^'"]+['"];?/gs;
  const imports = transformed.match(importRegex) || [];
  
  // Remove imports from code
  let remainingCode = transformed.replace(importRegex, '').trim();
  
  // Wrap the non-import code in an async function to allow return statements
  // This is necessary because ES modules don't allow top-level returns
  const finalCode = `${imports.join('\n')}

async function runTest() {
${remainingCode}
}

export default await runTest();
`;
  
  return finalCode;
}

/**
 * Run a test file and capture its output
 */
async function runTest(testFile) {
  const testPath = join(testsDir, testFile);
  
  // Read and transform the test file
  const originalCode = await readFile(testPath, 'utf-8');
  const transformedCode = transformTestCode(originalCode, testFile);
  
  // Create a temporary file with transformed imports
  const tempPath = join(snapshotsDir, `_temp_${testFile}`);
  await writeFile(tempPath, transformedCode, 'utf-8');
  
  // Temporarily suppress console output from the test
  const originalLog = console.log;
  const capturedLogs = [];
  console.log = (...args) => {
    capturedLogs.push(args.join(' '));
  };
  
  try {
    // Dynamic import with cache busting
    const modulePath = `file://${tempPath}?t=${Date.now()}`;
    const module = await import(modulePath);
    
    // Restore console.log
    console.log = originalLog;
    
    // The test should export a default function or return a value
    const result = module.default;
    
    if (!result) {
      throw new Error('Test did not return a value. Make sure to use "return artboard.render()"');
    }
    
    return {
      output: result,
      logs: capturedLogs,
    };
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
}

/**
 * Compare two SVG outputs
 */
function compareSVGs(svg1, svg2) {
  // Normalize whitespace for comparison
  const normalize = (svg) => svg.trim().replace(/\s+/g, ' ');
  return normalize(svg1) === normalize(svg2);
}

/**
 * Prompt user for input (with optional diff viewing)
 */
async function prompt(question, oldContent = null, newContent = null) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    const askQuestion = () => {
      rl.question(question, async (answer) => {
        const choice = answer.trim().toLowerCase();
        
        // If user wants to see diff
        if (choice === 'd' && oldContent && newContent) {
          rl.close();
          await showPaginatedDiff(oldContent, newContent);
          
          // Ask again after showing diff
          const rl2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl2.question(question, (answer2) => {
            rl2.close();
            resolve(answer2.trim().toLowerCase());
          });
        } else {
      rl.close();
          resolve(choice);
        }
      });
    };
    
    askQuestion();
  });
}

/**
 * Show paginated diff (like git)
 */
async function showPaginatedDiff(oldContent, newContent) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const maxLines = Math.max(oldLines.length, newLines.length);
  
  // Build diff lines
  const diffLines = [];
  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] || '';
    const newLine = newLines[i] || '';
    
    if (oldLine === newLine) {
      diffLines.push({ type: 'same', line: i + 1, content: oldLine });
    } else {
      diffLines.push({ type: 'old', line: i + 1, content: oldLine });
      diffLines.push({ type: 'new', line: i + 1, content: newLine });
    }
  }
  
  // Display with pagination
  const pageSize = 20;
  let currentPage = 0;
  const totalPages = Math.ceil(diffLines.length / pageSize);
  
  const showPage = (page) => {
    console.clear();
    log('\n  Diff View (use Space/Enter to see more, q to quit)', 'bright');
    log('  ' + '─'.repeat(70), 'gray');
    
    const start = page * pageSize;
    const end = Math.min(start + pageSize, diffLines.length);
    
    for (let i = start; i < end; i++) {
      const item = diffLines[i];
      const lineNum = item.line.toString().padStart(4);
      const content = item.content.substring(0, 62);
      
      if (item.type === 'same') {
        log(`  ${lineNum} │ ${content}`, 'gray');
      } else if (item.type === 'old') {
        log(`  ${lineNum} - ${content}`, 'red');
      } else {
        log(`  ${lineNum} + ${content}`, 'green');
      }
    }
    
    log('  ' + '─'.repeat(70), 'gray');
    log(`  Page ${page + 1}/${totalPages} | Lines ${start + 1}-${end} of ${diffLines.length}`, 'bright');
    log('  [Space/Enter] next page | [q] quit', 'gray');
    log('');
  };
  
  // Interactive paging
  return new Promise((resolve) => {
    showPage(currentPage);
    
    const handleInput = (key) => {
      if (key === ' ' || key === '\r' || key === '\n') {
        currentPage++;
        if (currentPage >= totalPages) {
          process.stdin.setRawMode(false);
          process.stdin.removeListener('data', handleInput);
          console.clear();
          resolve();
        } else {
          showPage(currentPage);
        }
      } else if (key === 'q' || key === '\u0003') { // q or Ctrl+C
        process.stdin.setRawMode(false);
        process.stdin.removeListener('data', handleInput);
        console.clear();
        resolve();
      }
    };
    
    // If only one page, skip pagination
    if (totalPages === 1) {
      resolve();
      return;
    }
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', handleInput);
  });
}

/**
 * Show diff summary with side-by-side comparison
 */
async function showDiffSummary(oldContent, newContent, interactive = true) {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const maxLines = Math.max(oldLines.length, newLines.length);
  
  // Find first difference
  let firstDiff = -1;
  for (let i = 0; i < maxLines; i++) {
    if (oldLines[i] !== newLines[i]) {
      firstDiff = i;
      break;
    }
  }
  
  if (firstDiff === -1) {
    log('\n  Files are identical (whitespace difference only)', 'gray');
    return;
  }
  
  log('\n  Full diff stats:', 'bright');
  log(`    Total lines: ${oldLines.length} → ${newLines.length}`, 'gray');
  log(`    Changed from line ${firstDiff + 1}`, 'gray');
  
  if (interactive) {
    log('  Press [d] to view full diff, or [a/r/s] to accept/reject/skip', 'gray');
  }
  log('');
}

/**
 * Run all tests
 */
async function runAllTests(options = {}) {
  const { interactive = true, watch = false } = options;
  
  // Setup w2l import resolution
  await setupW2LImport();
  
  await ensureSnapshotsDir();
  const status = await loadSnapshotStatus();
  
  // Get all test files
  const files = await readdir(testsDir);
  const testFiles = files.filter(f => f.endsWith('.js')).sort();
  
  log(`\n${'='.repeat(60)}`, 'bright');
  log('  W2L Snapshot Test Runner', 'bright');
  log(`${'='.repeat(60)}\n`, 'bright');
  
  const results = {
    passed: 0,
    failed: 0,
    new: 0,
    changed: 0,
    errors: 0,
  };
  
  for (const testFile of testFiles) {
    const testName = testFile.replace('.js', '');
    log(`\n${testName}`, 'bright');
    
    try {
      // Run the test
      const { output, logs } = await runTest(testFile);
      
      // Load existing snapshot
      const existingSnapshot = await loadSnapshot(testFile);
      
      if (!existingSnapshot) {
        // New test - save snapshot
        await saveSnapshot(testFile, output);
        status[testFile] = { status: 'pending', timestamp: new Date().toISOString() };
        log('  ✓ New snapshot created', 'green');
        results.new++;
        
        if (interactive) {
          log('  Output preview (first 200 chars):', 'gray');
          log(`  ${output.substring(0, 200)}...`, 'gray');
          const answer = await prompt('  Mark as [p]ass or [f]ail? (p/f): ');
          if (answer === 'p' || answer === 'pass') {
            status[testFile].status = 'passed';
            log('  ✓ Marked as PASSED', 'green');
          } else if (answer === 'f' || answer === 'fail') {
            status[testFile].status = 'failed';
            log('  ✗ Marked as FAILED', 'red');
          }
        }
      } else if (!compareSVGs(existingSnapshot, output)) {
        // Output changed
        results.changed++;
        log('  ⚠ Output changed!', 'yellow');
        
        if (interactive) {
          await showDiffSummary(existingSnapshot, output, interactive);
          const answer = await prompt('  [a]ccept new output, [r]eject, [s]kip, or [d] view diff? (a/r/s/d): ', existingSnapshot, output);
          
          if (answer === 'a' || answer === 'accept') {
            await saveSnapshot(testFile, output);
            status[testFile] = { status: 'passed', timestamp: new Date().toISOString() };
            log('  ✓ Snapshot updated and marked as PASSED', 'green');
            results.passed++;
          } else if (answer === 'r' || answer === 'reject') {
            status[testFile] = { status: 'failed', timestamp: new Date().toISOString() };
            log('  ✗ Marked as FAILED (snapshot not updated)', 'red');
            results.failed++;
          } else {
            log('  - Skipped', 'gray');
          }
        } else {
          // In non-interactive mode, just report the change
          log('  ! Run with --interactive to accept/reject', 'yellow');
        }
      } else {
        // Output matches snapshot
        const testStatus = status[testFile]?.status || 'unknown';
        if (testStatus === 'passed') {
          log('  ✓ Passed', 'green');
          results.passed++;
        } else if (testStatus === 'failed') {
          log('  ✗ Failed (marked)', 'red');
          results.failed++;
        } else {
          log('  ✓ Output matches snapshot', 'green');
          results.passed++;
        }
      }
      
      // Show captured logs if any
      if (logs.length > 0 && process.env.SHOW_LOGS === 'true') {
        log('  Console output:', 'gray');
        logs.forEach(line => log(`    ${line}`, 'gray'));
      }
      
    } catch (error) {
      log(`  ✗ Error: ${error.message}`, 'red');
      if (error.stack) {
        log(`    ${error.stack.split('\n').slice(1, 3).join('\n')}`, 'gray');
      }
      results.errors++;
    }
  }
  
  // Save status
  await saveSnapshotStatus(status);
  
  // Print summary
  log(`\n${'='.repeat(60)}`, 'bright');
  log('  Summary', 'bright');
  log(`${'='.repeat(60)}`, 'bright');
  log(`  Total tests:     ${testFiles.length}`, 'bright');
  log(`  Passed:          ${results.passed}`, 'green');
  log(`  Failed:          ${results.failed}`, results.failed > 0 ? 'red' : 'reset');
  log(`  New:             ${results.new}`, results.new > 0 ? 'cyan' : 'reset');
  log(`  Changed:         ${results.changed}`, results.changed > 0 ? 'yellow' : 'reset');
  log(`  Errors:          ${results.errors}`, results.errors > 0 ? 'red' : 'reset');
  log(`${'='.repeat(60)}\n`, 'bright');
  
  // Exit with error code if there are failures or errors
  if (results.failed > 0 || results.errors > 0) {
    process.exit(1);
  }
}

/**
 * Watch mode - re-run tests when files change
 */
async function watchTests() {
  const { watch } = await import('fs');
  
  log('\n👀 Watching for changes...\n', 'cyan');
  
  // Initial run
  await runAllTests({ interactive: false, watch: true });
  
  // Watch the dist directory for changes
  const distDir = join(projectRoot, 'dist');
  watch(distDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
      log(`\n📝 Detected change in ${filename}`, 'cyan');
      log('🔄 Re-running tests...\n', 'cyan');
      await runAllTests({ interactive: false, watch: true });
      log('\n👀 Watching for changes...\n', 'cyan');
    }
  });
  
  // Watch the test files themselves
  watch(testsDir, { recursive: true }, async (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
      log(`\n📝 Detected change in test ${filename}`, 'cyan');
      log('🔄 Re-running tests...\n', 'cyan');
      await runAllTests({ interactive: false, watch: true });
      log('\n👀 Watching for changes...\n', 'cyan');
    }
  });
  
  // Keep process alive
  await new Promise(() => {});
}

// Parse command line arguments
const args = process.argv.slice(2);
const interactive = !args.includes('--no-interactive');
const watch = args.includes('--watch');

if (watch) {
  watchTests().catch(error => {
    console.error('Watch mode error:', error);
    process.exit(1);
  });
} else {
  runAllTests({ interactive }).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

