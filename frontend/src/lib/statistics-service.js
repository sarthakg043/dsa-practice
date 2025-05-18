import statisticsData from '../assets/statistics.json';
import { apiPost } from './api-utils';

// In a real application, this would use an API to update the JSON file on the server
// For this version, we'll keep it in memory and simulate persistence

let cachedStatistics = { ...statisticsData };

/**
 * Get the current statistics data
 * @returns {Object} The statistics data
 */
export const getStatistics = () => {
  return cachedStatistics;
};

/**
 * Update a problem's solved status
 * @param {string} topic - The topic category
 * @param {string} problemName - The name of the problem
 * @param {boolean} solved - Whether the problem is solved
 * @returns {Object} The updated statistics
 */
export const updateProblemStatus = (topic, problemName, solved) => {
  const stats = { ...cachedStatistics };
  
  // Find the problem in the problemDetails
  if (stats.problemDetails[topic]) {
    const problemIndex = stats.problemDetails[topic].findIndex(
      problem => problem.name === problemName
    );
    
    if (problemIndex !== -1) {
      // Update the problem's solved status
      const wasSolved = stats.problemDetails[topic][problemIndex].solved;
      stats.problemDetails[topic][problemIndex].solved = solved;
      
      // Update the topic stats
      const topicIndex = stats.topicStats.findIndex(
        topicStat => topicStat.name === topic
      );
      
      if (topicIndex !== -1) {
        if (solved && !wasSolved) {
          stats.topicStats[topicIndex].solved += 1;
          stats.solvedProblems += 1;
        } else if (!solved && wasSolved) {
          stats.topicStats[topicIndex].solved -= 1;
          stats.solvedProblems -= 1;
        }
      }
      
      // Update the last updated timestamp
      stats.lastUpdated = new Date().toISOString();
      
      // Update the cache
      cachedStatistics = stats;
      
      // Save to the server
      saveStatisticsToServer(stats);
    }
  }
  
  return stats;
};

/**
 * Add a new problem to the statistics
 * @param {string} topic - The topic category
 * @param {Object} problem - The problem details
 * @returns {Object} The updated statistics
 */
export const addProblem = (topic, problem) => {
  const stats = { ...cachedStatistics };
  
  // Ensure the topic exists
  if (!stats.problemDetails[topic]) {
    stats.problemDetails[topic] = [];
    
    // Add to topicStats if it doesn't exist
    if (!stats.topicStats.find(t => t.name === topic)) {
      stats.topicStats.push({
        name: topic,
        total: 0,
        solved: 0
      });
    }
  }
  
  // Add the problem
  stats.problemDetails[topic].push(problem);
  
  // Update counts
  const topicIndex = stats.topicStats.findIndex(t => t.name === topic);
  stats.topicStats[topicIndex].total += 1;
  stats.totalProblems += 1;
  
  if (problem.solved) {
    stats.topicStats[topicIndex].solved += 1;
    stats.solvedProblems += 1;
  }
  
  // Update difficulty stats
  const difficulty = problem.difficulty || 'Unknown';
  stats.difficultyStats[difficulty] = (stats.difficultyStats[difficulty] || 0) + 1;
  
  // Update timestamp
  stats.lastUpdated = new Date().toISOString();
  
  // Update the cache
  cachedStatistics = stats;
  
  // Save to the server
  saveStatisticsToServer(stats);
  
  return stats;
};

/**
 * Manually refresh the statistics (simulating a server fetch)
 * @returns {Promise<Object>} A promise that resolves to the statistics data
 */
export const refreshStatistics = async () => {
  // In a real app, we would fetch from the server
  // For this version, we'll simulate a delay and return the cached data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cachedStatistics);
    }, 500);
  });
};

/**
 * Save statistics to the server
 * @param {Object} stats - The statistics data to save
 * @returns {Promise<Object>} A promise that resolves to the response
 */
const saveStatisticsToServer = async (stats) => {
  try {
    return await apiPost('/api/statistics', stats);
  } catch (error) {
    console.error('Error saving statistics to server:', error);
    return { success: false, error: error.message };
  }
};
