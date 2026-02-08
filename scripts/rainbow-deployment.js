#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const importLine = 'import { RainbowText } from "/snippets/rainbow-text.jsx";\n';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if no 'deployment' found (case-insensitive check first)
  if (!/deployment/i.test(content)) {
    return false;
  }
  
  // Split into frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  let frontmatter = '';
  let body = content;
  
  if (frontmatterMatch) {
    frontmatter = frontmatterMatch[0];
    body = content.slice(frontmatter.length);
  }
  
  // Check if import already exists
  const hasImport = body.includes('import { RainbowText }');
  
  // Process line by line, tracking code block state
  const lines = body.split('\n');
  let inCodeBlock = false;
  let deploymentFound = false;
  
  const processedLines = lines.map(line => {
    // Track code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    
    // Skip if in code block
    if (inCodeBlock) {
      return line;
    }
    
    // Skip lines that are imports
    if (line.trim().startsWith('import ')) {
      return line;
    }
    
    // Skip lines that are HTML/JSX div ids
    if (/<div id=/.test(line)) {
      return line;
    }
    
    let newLine = line;
    
    // Protect URLs and paths
    const urlPlaceholders = [];
    
    // Protect markdown links with paths containing deployment
    newLine = newLine.replace(/\[[^\]]*\]\([^)]+\)/g, (match) => {
      if (/deployment/i.test(match)) {
        urlPlaceholders.push(match);
        return `__URL_PLACEHOLDER_${urlPlaceholders.length - 1}__`;
      }
      return match;
    });
    
    // Protect inline code
    const codePlaceholders = [];
    newLine = newLine.replace(/`[^`]+`/g, (match) => {
      if (/deployment/i.test(match)) {
        codePlaceholders.push(match);
        return `__CODE_PLACEHOLDER_${codePlaceholders.length - 1}__`;
      }
      return match;
    });
    
    // Protect already wrapped text
    const rainbowPlaceholders = [];
    newLine = newLine.replace(/<RainbowText>[^<]*<\/RainbowText>/g, (match) => {
      rainbowPlaceholders.push(match);
      return `__RAINBOW_PLACEHOLDER_${rainbowPlaceholders.length - 1}__`;
    });
    
    // Protect src and href attributes
    newLine = newLine.replace(/(?:src|href)="[^"]*"/g, (match) => {
      if (/deployment/i.test(match)) {
        urlPlaceholders.push(match);
        return `__URL_PLACEHOLDER_${urlPlaceholders.length - 1}__`;
      }
      return match;
    });
    
    // Now replace deployment words
    if (/\b(deployment|deployments)\b/i.test(newLine)) {
      newLine = newLine.replace(/\b(deployment|deployments)\b/gi, (match) => {
        deploymentFound = true;
        return `<RainbowText>${match}</RainbowText>`;
      });
    }
    
    // Restore placeholders in reverse order
    rainbowPlaceholders.forEach((placeholder, i) => {
      newLine = newLine.replace(`__RAINBOW_PLACEHOLDER_${i}__`, placeholder);
    });
    codePlaceholders.forEach((placeholder, i) => {
      newLine = newLine.replace(`__CODE_PLACEHOLDER_${i}__`, placeholder);
    });
    urlPlaceholders.forEach((placeholder, i) => {
      newLine = newLine.replace(`__URL_PLACEHOLDER_${i}__`, placeholder);
    });
    
    return newLine;
  });
  
  const newBody = processedLines.join('\n');
  
  if (deploymentFound) {
    // Add import if not present
    let finalBody = newBody;
    if (!hasImport) {
      // Add import after other imports or at the start
      const importMatch = newBody.match(/^(import [^\n]+\n)+/m);
      if (importMatch) {
        const existingImports = importMatch[0];
        finalBody = existingImports + importLine + newBody.slice(existingImports.length);
      } else {
        finalBody = importLine + '\n' + newBody;
      }
    }
    
    const finalContent = frontmatter + finalBody;
    fs.writeFileSync(filePath, finalContent);
    return true;
  }
  
  return false;
}

// Recursively find all MDX files
function findMdxFiles(dir, exclude = []) {
  const results = [];
  
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(dir, fullPath);
      
      // Skip excluded directories
      if (exclude.some(ex => relativePath.startsWith(ex))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        results.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return results;
}

const baseDir = '/home/daytona/workspace';
const excludeDirs = ['fr', 'es', 'zh', 'snippets/fr', 'snippets/es', 'snippets/zh', 'node_modules', 'scripts'];

const files = findMdxFiles(baseDir, excludeDirs);

let modifiedCount = 0;
files.forEach(file => {
  try {
    if (processFile(file)) {
      console.log('Modified:', path.relative(baseDir, file));
      modifiedCount++;
    }
  } catch (err) {
    console.error('Error processing', file, err.message);
  }
});

console.log(`\nTotal files modified: ${modifiedCount}`);
