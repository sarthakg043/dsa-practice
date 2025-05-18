// Repository parser utility functions for Vercel deployment
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Base path to the DSA directory
// In Vercel, we're working with the repository root
const BASE_PATH = process.cwd();

// Function to read a file
export const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
};

// Function to find all markdown files recursively
export const findMarkdownFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['frontend', 'node_modules', '.git', '.vercel', 'api'].includes(file)) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      const relativePath = path.relative(BASE_PATH, filePath);
      fileList.push({
        path: filePath,
        relativePath,
        name: path.basename(filePath),
        directory: path.dirname(relativePath),
      });
    }
  });
  
  return fileList;
};

// Function to get all markdown files in the repository
export const getMarkdownFiles = async () => {
  try {
    return findMarkdownFiles(BASE_PATH);
  } catch (error) {
    console.error('Error finding markdown files:', error);
    return [];
  }
};

// Parse a markdown file to extract structure and metadata
export const parseMarkdownFile = (filePath) => {
  const content = readFile(filePath);
  if (!content) return null;

  // Parse markdown for heading structure
  const tokens = marked.lexer(content);
  
  const metadata = {
    title: '',
    difficulty: null,
    isSolved: false,
  };
  
  // Extract title from first heading
  const firstHeading = tokens.find(token => token.type === 'heading');
  if (firstHeading) {
    metadata.title = firstHeading.text;
  } else {
    metadata.title = path.basename(filePath, '.md');
  }

  // Check if this is a solution file
  const isLeetcodeSolution = content.includes('LeetCode:') || 
                             content.includes('Problem Statement') ||
                             content.match(/## Problem/i);
                             
  if (isLeetcodeSolution) {
    // Extract difficulty if present
    const difficultyMatch = content.match(/Difficulty: (Easy|Medium|Hard)/i) || 
                           content.match(/\[(Easy|Medium|Hard)\]/i);
    if (difficultyMatch) {
      metadata.difficulty = difficultyMatch[1];
    }
    
    // Assume solved if it has a solution
    metadata.isSolved = content.includes('Solution') || content.includes('```');
  }
  
  return metadata;
};

// Function to get all directories in the repository
export const getDirectories = async () => {
  try {
    const entries = fs.readdirSync(BASE_PATH, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory() && !['frontend', 'node_modules', '.git', '.vercel', 'api'].includes(entry.name))
      .map(entry => ({
        name: entry.name,
        path: path.join(BASE_PATH, entry.name),
      }));
  } catch (error) {
    console.error('Error reading directories:', error);
    return [];
  }
};

// Function to build a tree structure of the repository
export const buildRepositoryTree = async () => {
  const markdownFiles = await getMarkdownFiles();
  
  // Create tree structure
  const tree = {
    name: 'DSA',
    type: 'directory',
    children: [],
    path: BASE_PATH,
  };
  
  // Group files by directory
  const filesByDirectory = {};
  
  markdownFiles.forEach(file => {
    const dirPath = file.directory || '';
    if (!filesByDirectory[dirPath]) {
      filesByDirectory[dirPath] = [];
    }
    filesByDirectory[dirPath].push(file);
  });
  
  // Build tree recursively
  const buildTree = (node, dirPath = '') => {
    const currentPath = path.join(BASE_PATH, dirPath);
    const currentFiles = filesByDirectory[dirPath] || [];
    
    // Add files
    currentFiles.forEach(file => {
      const metadata = parseMarkdownFile(file.path);
      node.children.push({
        name: file.name,
        type: 'file',
        path: file.path,
        relativePath: file.relativePath,
        metadata,
      });
    });
    
    // Get immediate subdirectories only
    const allPaths = Object.keys(filesByDirectory);
    const immediateSubdirs = new Set();
    
    for (const dir of allPaths) {
      // Skip if it's not a subdirectory of current path
      if (!dir.startsWith(dirPath) || dir === dirPath) continue;
      
      // Get the next level directory name
      const remainingPath = dir.slice(dirPath.length + (dirPath ? 1 : 0));
      const nextLevelDir = remainingPath.split('/')[0];
      
      if (nextLevelDir) {
        immediateSubdirs.add(nextLevelDir);
      }
    }
    
    // Add subdirectories
    for (const subdir of immediateSubdirs) {
      const subdirPath = dirPath ? `${dirPath}/${subdir}` : subdir;
      const subdirNode = {
        name: subdir,
        type: 'directory',
        children: [],
        path: path.join(currentPath, subdir),
      };
      
      buildTree(subdirNode, subdirPath);
      node.children.push(subdirNode);
    }
  };
  
  buildTree(tree);
  return tree;
};

// Function to get file content
export const getFileContent = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
};
