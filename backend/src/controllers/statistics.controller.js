import statisticsModel from '../models/statistics.js';

/**
 * Get statistics data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getStatistics = (req, res) => {
  try {
    const statisticsData = statisticsModel.getStatistics();
    
    if (!statisticsData) {
      return res.status(404).json({ error: 'Statistics file not found' });
    }
    
    res.json(statisticsData);
  } catch (error) {
    console.error('Error in getStatistics controller:', error);
    res.status(500).json({ error: 'Failed to read statistics' });
  }
};

/**
 * Update statistics data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateStatistics = (req, res) => {
  try {
    const statisticsData = req.body;
    const result = statisticsModel.saveStatistics(statisticsData);
    
    res.json(result);
  } catch (error) {
    console.error('Error in updateStatistics controller:', error);
    res.status(500).json({ error: 'Failed to save statistics' });
  }
};
