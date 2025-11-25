#!/usr/bin/env node

/**
 * Snapshot Management Tool
 * 
 * Helper commands for managing snapshot tests:
 * - reset: Clear all snapshots and start fresh
 * - status: Show current test status
 * - mark-all-pass: Mark all tests as passed
 * - mark-all-fail: Mark all tests as failed
 */

import { readFile, writeFile, readdir, unlink, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const snapshotsDir = join(__dirname, 'snapshots');
const snapshotStatusFile = join(__dirname, 'snapshot-status.json');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function loadStatus() {
  if (!existsSync(snapshotStatusFile)) {
    return {};
  }
  const content = await readFile(snapshotStatusFile, 'utf-8');
  return JSON.parse(content);
}

async function saveStatus(status) {
  await writeFile(snapshotStatusFile, JSON.stringify(status, null, 2));
}

async function resetSnapshots() {
  log('\n🗑️  Resetting all snapshots...\n', 'yellow');
  
  if (existsSync(snapshotsDir)) {
    await rm(snapshotsDir, { recursive: true, force: true });
    log('✓ Deleted snapshots directory', 'green');
  }
  
  await saveStatus({});
  log('✓ Reset snapshot status', 'green');
  log('\n✓ All snapshots cleared. Run "npm test" to regenerate.\n', 'bright');
}

async function showStatus() {
  const status = await loadStatus();
  
  log('\n📊 Snapshot Test Status\n', 'bright');
  log('─'.repeat(60), 'bright');
  
  if (Object.keys(status).length === 0) {
    log('No tests found. Run "npm test" to create snapshots.\n', 'gray');
    return;
  }
  
  const stats = {
    passed: 0,
    failed: 0,
    pending: 0,
  };
  
  Object.entries(status).forEach(([testFile, info]) => {
    const testName = testFile.replace('.js', '');
    const statusIcon = info.status === 'passed' ? '✓' : info.status === 'failed' ? '✗' : '○';
    const statusColor = info.status === 'passed' ? 'green' : info.status === 'failed' ? 'red' : 'yellow';
    const date = new Date(info.timestamp).toLocaleString();
    
    log(`${statusIcon} ${testName}`, statusColor);
    log(`  Status: ${info.status} | Updated: ${date}`, 'gray');
    
    stats[info.status]++;
  });
  
  log('\n─'.repeat(60), 'bright');
  log(`Total: ${Object.keys(status).length} tests`, 'bright');
  log(`  Passed: ${stats.passed}`, 'green');
  log(`  Failed: ${stats.failed}`, stats.failed > 0 ? 'red' : 'reset');
  log(`  Pending: ${stats.pending}`, stats.pending > 0 ? 'yellow' : 'reset');
  log('');
}

async function markAllAs(statusValue) {
  const status = await loadStatus();
  
  if (Object.keys(status).length === 0) {
    log('\n⚠️  No tests found. Run "npm test" first.\n', 'yellow');
    return;
  }
  
  const timestamp = new Date().toISOString();
  Object.keys(status).forEach(testFile => {
    status[testFile].status = statusValue;
    status[testFile].timestamp = timestamp;
  });
  
  await saveStatus(status);
  
  const color = statusValue === 'passed' ? 'green' : 'red';
  log(`\n✓ Marked all ${Object.keys(status).length} tests as ${statusValue.toUpperCase()}\n`, color);
}

async function cleanTempFiles() {
  log('\n🧹 Cleaning temporary test files...\n', 'cyan');
  
  if (!existsSync(snapshotsDir)) {
    log('No snapshots directory found.\n', 'gray');
    return;
  }
  
  const files = await readdir(snapshotsDir);
  const tempFiles = files.filter(f => f.startsWith('_temp_'));
  
  if (tempFiles.length === 0) {
    log('No temporary files found.\n', 'gray');
    return;
  }
  
  for (const file of tempFiles) {
    await unlink(join(snapshotsDir, file));
    log(`✓ Deleted ${file}`, 'green');
  }
  
  log(`\n✓ Cleaned ${tempFiles.length} temporary file(s)\n`, 'bright');
}

// Parse command
const command = process.argv[2];

switch (command) {
  case 'reset':
    resetSnapshots();
    break;
  case 'status':
    showStatus();
    break;
  case 'mark-all-pass':
    markAllAs('passed');
    break;
  case 'mark-all-fail':
    markAllAs('failed');
    break;
  case 'clean':
    cleanTempFiles();
    break;
  default:
    log('\n📦 W2L Snapshot Management Tool\n', 'bright');
    log('Usage: node tests/manage-snapshots.js <command>\n', 'bright');
    log('Commands:', 'bright');
    log('  reset           - Clear all snapshots and status');
    log('  status          - Show current test status');
    log('  mark-all-pass   - Mark all tests as passed');
    log('  mark-all-fail   - Mark all tests as failed');
    log('  clean           - Remove temporary test files');
    log('');
}

