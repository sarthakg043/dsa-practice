import * as repositoryModel from '../models/repository.js';

/**
 * Get the repository tree
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRepositoryTree = async (req, res) => {
  try {
    const tree = await repositoryModel.buildRepositoryTree();
    res.json(tree);
  } catch (error) {
    console.error('Error in getRepositoryTree controller:', error);
    res.status(500).json({ error: 'Failed to build repository tree' });
  }
};

/**
 * Get file content and metadata
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getFileContent = async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    const content = repositoryModel.getFileContent(path);
    const metadata = repositoryModel.parseMarkdownFile(path);
    
    if (content === null) {
      return res.status(404).json({ error: 'File not found or could not be read' });
    }
    
    res.json({ content, metadata });
  } catch (error) {
    console.error('Error in getFileContent controller:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
};
