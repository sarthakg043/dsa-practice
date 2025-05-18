import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';
import { marked } from 'marked';
import { BASE_DSA_PATH } from '../config/constants.js';

/**
 * Read the content of a file
 * @param {string} filePath - Path to the file
 * @returns {string|null} File content or null if error
 */
export const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
};

/**
 * Get all markdown files in the repository
 * @returns {Promise<Array>} List of markdown files
 */
export const getMarkdownFiles = async () => {
  const patterns = [
    `${BASE_DSA_PATH}/**/*.md`,
    `!${BASE_DSA_PATH}/frontend/**`,
    `!${BASE_DSA_PATH}/node_modules/**`,
  ];
  
  try {
    const files = await glob(patterns);
    return files.map(file => {
      const relativePath = path.relative(BASE_DSA_PATH, file);
      return {
        path: file,
        relativePath,
        name: path.basename(file),
        directory: path.dirname(relativePath),
      };
    });
  } catch (error) {
    console.error('Error finding markdown files:', error);
    return [];
  }
};

/**
 * Parse a markdown file to extract structure and metadata
 * @param {string} filePath - Path to the markdown file
 * @returns {Object|null} Metadata extracted from the file
 */
export const parseMarkdownFile = (filePath) => {
  const content = readFile(filePath);
  if (!content) return null;

  // Extract basic metadata - this is a simplified version
  // In a real implementation, a more robust parser would be used
  const title = content.match(/^#\s+(.+)$/m)?.[1] || path.basename(filePath, '.md');
  
  // Extract difficulty if present
  const difficulty = content.match(/difficulty:\s*([A-Za-z]+)/i)?.[1] || 'Unknown';
  
  // Extract tags if present
  const tagsMatch = content.match(/tags:\s*\[(.*)\]/i);
  const tags = tagsMatch 
    ? tagsMatch[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''))
    : [];
  
  return {
    title,
    difficulty,
    tags,
    // Additional metadata could be extracted here
  };
};

/**
 * Get content of a specific file
 * @param {string} filePath - Path to the file
 * @returns {string|null} Content of the file or null
 */
export const getFileContent = (filePath) => {
  return readFile(filePath);
};

/**
 * Build a hierarchical tree of the repository
 * @returns {Promise<Object>} Repository tree structure
 */
export const buildRepositoryTree = async () => {
  try {
    const root = {
      name: path.basename(BASE_DSA_PATH),
      path: BASE_DSA_PATH,
      type: 'directory',
      children: []
    };
    
    // Helper function to process directory content
    const processDirectory = (dirPath, node) => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip hidden files and certain directories
        if (entry.name.startsWith('.') || 
            entry.name === 'node_modules' || 
            entry.name === 'frontend') {
          continue;
        }
        
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          const dirNode = {
            name: entry.name,
            path: fullPath,
            type: 'directory',
            children: []
          };
          
          processDirectory(fullPath, dirNode);
          
          // Only add directories that have content or are explicitly kept
          if (dirNode.children.length > 0) {
            node.children.push(dirNode);
          }
        } else if (entry.isFile()) {
          // Add file node
          node.children.push({
            name: entry.name,
            path: fullPath,
            type: 'file'
          });
        }
      }
      
      // Sort: directories first, then files, all alphabetically
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    };
    
    // Start processing from the root
    processDirectory(BASE_DSA_PATH, root);
    
    return root;
  } catch (error) {
    console.error('Error building repository tree:', error);
    throw new Error('Failed to build repository tree');
  }
};
