import fs from 'fs';
import { STATISTICS_PATH } from '../config/constants.js';

/**
 * Statistics model for fetching and updating statistics data
 */
export default {
  /**
   * Get statistics data
   * @returns {Object|null} The statistics data or null if not found
   */
  getStatistics: () => {
    try {
      if (!fs.existsSync(STATISTICS_PATH)) {
        return null;
      }
      
      return JSON.parse(fs.readFileSync(STATISTICS_PATH, 'utf-8'));
    } catch (error) {
      console.error('Error reading statistics:', error);
      throw new Error('Failed to read statistics');
    }
  },
  
  /**
   * Save statistics data
   * @param {Object} data - The statistics data to save
   * @returns {Object} Success response
   */
  saveStatistics: (data) => {
    try {
      fs.writeFileSync(STATISTICS_PATH, JSON.stringify(data, null, 2), 'utf-8');
      
      return {
        success: true,
        message: 'Statistics saved successfully'
      };
    } catch (error) {
      console.error('Error saving statistics:', error);
      throw new Error('Failed to save statistics');
    }
  }
};
