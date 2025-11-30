#!/usr/bin/env node

/**
 * Convert markdown guides to JSON format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GUIDES_PATH = path.join(__dirname, '../guides');

// Element keywords to detect in content
const elementKeywords = [
  'Triangle', 'Quadrilateral', 'Circle', 'Line', 'Text', 'Latex', 
  'FunctionGraph', 'RegularPolygon', 'BezierCurve', 'Rect', 'Square',
  'BarChart', 'LineChart', 'DonutChart', 'RadarChart', 'Chart',
  'Cube', 'Pyramid', 'Prism', 'Sphere', 'Container', 'Grid', 'Artboard',
  'Image', 'TextArea', 'Side', 'Angle', 'Arrow'
];

function convertMarkdownGuide(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath, '.md');
  
  // Extract title (first # heading)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : fileName;
  
  // Extract overview (text after ## Overview)
  const overviewMatch = content.match(/##\s+Overview\s*\n\n(.+?)(?=\n\n##|\n$)/s);
  const description = overviewMatch ? overviewMatch[1].trim() : 'Guide for ' + title;
  
  // Extract "When to Use" section
  const whenToUseMatch = content.match(/##\s+When to Use[^#]*\n\n([\s\S]*?)(?=\n\n##|\n$)/);
  let topics = [];
  if (whenToUseMatch) {
    const whenToUseText = whenToUseMatch[1].trim();
    // Extract bullet points
    const bullets = whenToUseText.match(/^-\s+(.+)$/gm);
    if (bullets) {
      topics = bullets.map(b => b.replace(/^-\s+/, '').trim());
    }
  }
  
  // If no topics from "When to Use", extract from section headings
  if (topics.length === 0) {
    const headingMatches = content.matchAll(/^##\s+(.+?)$/gm);
    for (const match of headingMatches) {
      const heading = match[1].trim();
      if (heading !== 'Overview' && heading !== 'When to Use This Guide' && 
          heading !== 'Best Practices' && heading !== 'Troubleshooting' && 
          heading !== 'Common Issues' && heading !== 'Common Patterns') {
        topics.push(heading);
        if (topics.length >= 7) break; // Limit to 7 topics
      }
    }
  }
  
  // Detect covered elements
  const covers = [];
  for (const keyword of elementKeywords) {
    if (content.includes(keyword)) {
      covers.push(keyword);
    }
  }
  
  // Remove duplicate covers
  const uniqueCovers = [...new Set(covers)];
  
  // Generate ID from filename
  const id = fileName;
  
  // Clean content - remove the Overview and When to Use sections, keep the rest
  let cleanContent = content;
  
  // Remove Overview section
  cleanContent = cleanContent.replace(/##\s+Overview\s*\n\n[\s\S]*?(?=\n##|\n$)/, '');
  
  // Remove When to Use section
  cleanContent = cleanContent.replace(/##\s+When to Use[^#]*\n\n[\s\S]*?(?=\n##)/, '');
  
  // Remove title (first # heading)
  cleanContent = cleanContent.replace(/^#\s+.+\n\n/, '');
  
  // Trim whitespace
  cleanContent = cleanContent.trim();
  
  return {
    id,
    title,
    description,
    covers: uniqueCovers,
    topics,
    content: cleanContent
  };
}

function main() {
  console.log('Converting markdown guides to JSON...\n');
  
  const files = fs.readdirSync(GUIDES_PATH);
  let converted = 0;
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const mdPath = path.join(GUIDES_PATH, file);
    const jsonPath = path.join(GUIDES_PATH, file.replace('.md', '.json'));
    
    console.log(`Converting ${file}...`);
    
    try {
      const guideData = convertMarkdownGuide(mdPath);
      
      // Write JSON file
      fs.writeFileSync(jsonPath, JSON.stringify(guideData, null, 2));
      
      console.log(`  ✓ Created ${path.basename(jsonPath)}`);
      console.log(`    Covers: ${guideData.covers.slice(0, 5).join(', ')}${guideData.covers.length > 5 ? ', ...' : ''}`);
      console.log(`    Topics: ${guideData.topics.length}`);
      
      converted++;
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
    
    console.log();
  }
  
  console.log(`\n✨ Converted ${converted} guides to JSON format`);
  console.log('\nRun "npm run build" to regenerate the guides index.');
}

main();

