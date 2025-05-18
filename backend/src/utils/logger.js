/**
 * Simple logger utility
 */
export default {
  /**
   * Log info message
   * @param {string} message - Message to log
   * @param {Object} data - Optional data to log
   */
  info: (message, data) => {
    console.log(`INFO [${new Date().toISOString()}]: ${message}`, data ? data : '');
  },
  
  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Error|Object} error - Error object or additional data
   */
  error: (message, error) => {
    console.error(`ERROR [${new Date().toISOString()}]: ${message}`, error);
  },
  
  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} data - Optional data to log
   */
  warn: (message, data) => {
    console.warn(`WARN [${new Date().toISOString()}]: ${message}`, data ? data : '');
  },
  
  /**
   * Log debug message (only in development)
   * @param {string} message - Debug message
   * @param {Object} data - Optional data to log
   */
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`DEBUG [${new Date().toISOString()}]: ${message}`, data ? data : '');
    }
  }
};
