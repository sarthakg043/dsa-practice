// API server to serve repository data
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { 
  buildRepositoryTree, 
  getFileContent,
  parseMarkdownFile
} from './src/lib/repository.js';

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// API endpoint to get repository tree
app.get('/api/tree', async (req, res) => {
  try {
    const tree = await buildRepositoryTree();
    res.json(tree);
  } catch (error) {
    console.error('Error building repository tree:', error);
    res.status(500).json({ error: 'Failed to build repository tree' });
  }
});

// API endpoint to get file content
app.get('/api/file', async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const content = getFileContent(path);
    const metadata = parseMarkdownFile(path);
    
    if (content === null) {
      return res.status(404).json({ error: 'File not found or could not be read' });
    }
    
    res.json({ content, metadata });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

// API endpoint to save statistics data
app.post('/api/statistics', (req, res) => {
  try {
    const statisticsData = req.body;
    const filePath = path.resolve('./src/assets/statistics.json');
    
    fs.writeFileSync(filePath, JSON.stringify(statisticsData, null, 2), 'utf-8');
    
    res.json({ success: true, message: 'Statistics saved successfully' });
  } catch (error) {
    console.error('Error saving statistics:', error);
    res.status(500).json({ error: 'Failed to save statistics' });
  }
});
