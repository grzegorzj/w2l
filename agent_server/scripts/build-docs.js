#!/usr/bin/env node

/**
 * Build documentation for the agent server
 * Extracts element definitions from the TypeScript library
 * and creates a programmatic list of available elements and guides
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIB_PATH = path.join(__dirname, '../../lib');
const GUIDES_PATH = path.join(__dirname, '../guides');
const OUTPUT_PATH = path.join(__dirname, '../generated');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

/**
 * Extract interface/config information from a TypeScript file
 */
function extractTypeScriptInfo(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract JSDoc comment for the class
  const classDocMatch = content.match(/\/\*\*\s*\n([^*]|\*(?!\/))*\*\/\s*export class/);
  let description = 'No description available';
  
  if (classDocMatch) {
    const docComment = classDocMatch[0];
    // Extract first meaningful line from JSDoc
    const lines = docComment.split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trim())
      .filter(line => line && !line.startsWith('/') && !line.startsWith('*'));
    if (lines.length > 0) {
      description = lines[0];
    }
  }
  
  // Extract config interface name
  const configMatch = content.match(/export interface (\w+Config)\s*{([^}]*)}/s);
  let configName = null;
  let properties = [];
  
  if (configMatch) {
    configName = configMatch[1];
    const configBody = configMatch[2];
    
    // Extract properties (basic extraction)
    const propMatches = configBody.matchAll(/^\s*(\w+)(\?)?:\s*([^;]+);/gm);
    for (const match of propMatches) {
      const [, name, optional, type] = match;
      properties.push({
        name,
        optional: !!optional,
        type: type.trim()
      });
    }
  }
  
  // Extract class name
  const classMatch = content.match(/export class (\w+)/);
  const className = classMatch ? classMatch[1] : fileName.replace('.ts', '');
  
  return {
    name: className,
    description,
    configName,
    properties,
    filePath: path.relative(LIB_PATH, filePath)
  };
}

/**
 * Scan a directory for TypeScript files and extract info
 */
function scanDirectory(dirPath, category) {
  const elements = [];
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    if (file === 'index.ts' || !file.endsWith('.ts')) continue;
    
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      try {
        const info = extractTypeScriptInfo(filePath, file);
        elements.push({
          ...info,
          category
        });
      } catch (error) {
        console.warn(`Warning: Could not parse ${file}:`, error.message);
      }
    }
  }
  
  return elements;
}

/**
 * Build elements documentation
 */
function buildElementsDocs() {
  console.log('Building elements documentation...');
  
  const elements = [
    ...scanDirectory(path.join(LIB_PATH, 'elements'), 'elements'),
    ...scanDirectory(path.join(LIB_PATH, 'components'), 'components'),
    ...scanDirectory(path.join(LIB_PATH, 'layout'), 'layout'),
    ...scanDirectory(path.join(LIB_PATH, 'themed-components'), 'themed-components')
  ];
  
  console.log(`Found ${elements.length} elements`);
  
  // Write full documentation
  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'elements.json'),
    JSON.stringify(elements, null, 2)
  );
  
  // Write summary for agent context
  const summary = elements.map(el => ({
    name: el.name,
    category: el.category,
    description: el.description
  }));
  
  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'elements-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log('✓ Elements documentation built');
  return elements;
}

/**
 * Build guides documentation
 */
function buildGuidesDocs() {
  console.log('Building guides documentation...');
  
  if (!fs.existsSync(GUIDES_PATH)) {
    console.warn('Guides directory not found, skipping...');
    return [];
  }
  
  const guides = [];
  const files = fs.readdirSync(GUIDES_PATH);
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(GUIDES_PATH, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract title (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
    
    // Extract overview (text after ## Overview)
    const overviewMatch = content.match(/##\s+Overview\s*\n(.+?)(?=\n##|\n$)/s);
    const overview = overviewMatch ? overviewMatch[1].trim() : 'No overview available';
    
    // Extract "When to Use" section
    const whenToUseMatch = content.match(/##\s+When to Use[^#]*\n([\s\S]*?)(?=\n##|\n$)/);
    const whenToUse = whenToUseMatch ? whenToUseMatch[1].trim() : '';
    
    guides.push({
      id: file.replace('.md', ''),
      title,
      overview,
      whenToUse,
      filePath: file
    });
  }
  
  console.log(`Found ${guides.length} guides`);
  
  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'guides.json'),
    JSON.stringify(guides, null, 2)
  );
  
  console.log('✓ Guides documentation built');
  return guides;
}

/**
 * Build agent context (system prompt content)
 */
function buildAgentContext(elements, guides) {
  console.log('Building agent context...');
  
  const context = {
    elements: {
      total: elements.length,
      byCategory: {},
      summary: elements.map(el => `- ${el.name} (${el.category}): ${el.description}`)
    },
    guides: {
      total: guides.length,
      available: guides.map(g => ({
        id: g.id,
        title: g.title,
        overview: g.overview.substring(0, 200) + '...',
        whenToUse: g.whenToUse
      }))
    },
    timestamp: new Date().toISOString()
  };
  
  // Group by category
  for (const el of elements) {
    if (!context.elements.byCategory[el.category]) {
      context.elements.byCategory[el.category] = [];
    }
    context.elements.byCategory[el.category].push(el.name);
  }
  
  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'agent-context.json'),
    JSON.stringify(context, null, 2)
  );
  
  console.log('✓ Agent context built');
}

// Main execution
console.log('Starting documentation build...\n');

const elements = buildElementsDocs();
const guides = buildGuidesDocs();
buildAgentContext(elements, guides);

console.log('\n✨ Documentation build complete!');
console.log(`   Output: ${OUTPUT_PATH}`);

