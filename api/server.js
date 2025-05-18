// Serverless Express API for Vercel
import express, { json } from 'express';
import path from 'path';
import fs from 'fs';

// Initialize the Express app
const app = express();

// Set CORS headers for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Parse JSON request bodies
app.use(json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API server is running', 
    timestamp: new Date().toISOString() 
  });
});

// API endpoint to get repository tree
app.get('/api/tree', (req, res) => {
  try {
    // For safety, let's create a simplified structure
    const safeTree = {
      name: 'DSA',
      type: 'directory',
      children: [
        {
          name: 'Arrays & Hashing',
          type: 'directory',
          children: [
            {
              name: 'contains_duplicate.md',
              type: 'file',
              path: '/NeetCode Blind 75/Arrays & Hashing/contains_duplicate.md',
              metadata: {
                title: 'Contains Duplicate',
                difficulty: 'Easy',
                isSolved: true
              }
            },
            {
              name: 'README.md',
              type: 'file',
              path: '/NeetCode Blind 75/Arrays & Hashing/README.md',
              metadata: {
                title: 'Arrays & Hashing',
                totalProblems: 9,
                solvedProblems: 1
              }
            }
          ]
        },
        {
          name: 'Two Pointers',
          type: 'directory',
          children: [
            {
              name: 'valid_palindrome.md',
              type: 'file',
              path: '/NeetCode Blind 75/Two Pointers/valid_palindrome.md',
              metadata: {
                title: 'Valid Palindrome',
                difficulty: 'Easy',
                isSolved: false
              }
            },
            {
              name: 'README.md',
              type: 'file',
              path: '/NeetCode Blind 75/Two Pointers/README.md',
              metadata: {
                title: 'Two Pointers',
                totalProblems: 5,
                solvedProblems: 0
              }
            }
          ]
        }
      ]
    };
    
    console.log('Sending repository tree data');
    res.json(safeTree);
  } catch (error) {
    console.error('Error building repository tree:', error);
    res.status(500).json({ 
      error: 'Failed to build repository tree', 
      message: error.message,
      status: 500,
      timestamp: new Date().toISOString()
    });
  }
});

// API endpoint to get file content (mock data)
app.get('/api/file', (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    // Mock file content based on path
    let content = "# This is mock content\n\nThis file would contain DSA problem details.";
    let metadata = {
      title: path.split('/').pop().replace('.md', ''),
      difficulty: 'Medium',
      isSolved: false
    };
    
    // Customize the mock content based on the path for a better experience
    if (path.includes('contains_duplicate')) {
      content = "# Contains Duplicate\n\n## Problem Statement\n\nGiven an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.\n\n## Example\n\n```\nInput: nums = [1,2,3,1]\nOutput: true\n```\n\n## Solution\n\n```javascript\nfunction containsDuplicate(nums) {\n  const set = new Set();\n  \n  for (const num of nums) {\n    if (set.has(num)) {\n      return true;\n    }\n    set.add(num);\n  }\n  \n  return false;\n}\n```";
      metadata = {
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        isSolved: true
      };
    } else if (path.includes('valid_palindrome')) {
      content = "# Valid Palindrome\n\n## Problem Statement\n\nA phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n## Example\n\n```\nInput: s = \"A man, a plan, a canal: Panama\"\nOutput: true\n```\n\n## Approach\n\nUse two pointers to check from both ends of the string.";
      metadata = {
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        isSolved: false
      };
    } else if (path.includes('README.md')) {
      if (path.includes('Arrays & Hashing')) {
        content = "# Arrays & Hashing\n\nProblems that involve arrays and hashing techniques.\n\n## Problems\n\n- [Contains Duplicate](./contains_duplicate.md) - Easy\n- Valid Anagram - Easy\n- Two Sum - Easy\n- Group Anagrams - Medium\n- Top K Frequent Elements - Medium\n- Product of Array Except Self - Medium\n- Valid Sudoku - Medium\n- Encode and Decode Strings - Medium\n- Longest Consecutive Sequence - Medium";
        metadata = {
          title: 'Arrays & Hashing',
          totalProblems: 9,
          solvedProblems: 1
        };
      } else if (path.includes('Two Pointers')) {
        content = "# Two Pointers\n\nProblems that can be solved using the two pointers technique.\n\n## Problems\n\n- [Valid Palindrome](./valid_palindrome.md) - Easy\n- Two Sum II - Medium\n- 3Sum - Medium\n- Container With Most Water - Medium\n- Trapping Rain Water - Hard";
        metadata = {
          title: 'Two Pointers',
          totalProblems: 5,
          solvedProblems: 0
        };
      }
    }
    
    // Return both content and metadata
    res.json({ 
      content: content,
      metadata: metadata
    });
  } catch (error) {
    console.error('Error serving file content:', error);
    res.status(500).json({
      error: 'Failed to read file',
      message: error.message
    });
  }
});

// API endpoint to save statistics data
app.post('/api/statistics', (req, res) => {
  try {
    // In a serverless environment, we'd typically save to a database or storage service
    // For simplicity in this demo, we'll just acknowledge the request
    console.log("Received statistics update:", JSON.stringify(req.body).slice(0, 100) + "...");
    res.json({ success: true, message: 'Statistics received' });
  } catch (error) {
    console.error('Error handling statistics:', error);
    res.status(500).json({ error: 'Failed to handle statistics' });
  }
});

// Catch-all for other routes - ensure 404s return JSON
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Resource not found', 
    path: req.originalUrl,
    status: 404,
    timestamp: new Date().toISOString()
  });
});

// Final error handler - always return JSON
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Make sure content type is application/json
  res.setHeader('Content-Type', 'application/json');
  
  // Return a structured error response
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: err.message || 'Internal Server Error',
    status: statusCode,
    path: req.path,
    timestamp: new Date().toISOString()
  };
  
  res.status(statusCode).json(errorResponse);
});

// Required for Vercel serverless functions
export default app;
