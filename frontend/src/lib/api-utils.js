// Helper functions for API calls with error handling
import { fetchJSONWithCORS } from './cors-utils';

/**
 * Make a GET request to the API with proper error handling and retry
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} params - Query parameters
 * @param {Object} options - Additional options
 * @param {number} options.retries - Number of retries for transient errors (default: 1)
 * @param {number} options.retryDelay - Delay between retries in ms (default: 1000)
 * @returns {Promise<any>} - The response data
 * @throws {Error} If the request fails after all retries
 */
export const apiGet = async (endpoint, params = {}, options = {}) => {
  const { retries = 1, retryDelay = 1000 } = options;
  let lastError = null;
  
  // Try the request up to retries + 1 times
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Build query string
      const queryString = Object.keys(params).length > 0
        ? '?' + new URLSearchParams(params).toString()
        : '';
      
      // Use absolute URL in development
      let url = endpoint;
      if (!url.startsWith('http')) {
        // Use localhost:3001 directly instead of relying on proxy
        url = `http://localhost:3001${endpoint}${queryString}`;
      } else {
        url = `${url}${queryString}`;
      }
      
      console.log(`🚀 API GET request to: ${url}${attempt > 0 ? ` (retry ${attempt}/${retries})` : ''}`);
      
      // Use CORS utility for fetching with proper handling
      return await fetchJSONWithCORS(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
    } catch (error) {
      console.error(`API Error (${endpoint}) attempt ${attempt + 1}/${retries + 1}:`, error);
      lastError = error;
      
      // Check if this is a JSON parsing error, which might be temporary
      const isJsonError = error.message.includes('JSON') || 
                          error.message.includes('Syntax') || 
                          error.message.includes("Expected ',' or ']'");
      
      // If we have retries left and this is a potentially recoverable error, retry
      if (attempt < retries && isJsonError) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      // No more retries or non-recoverable error
      throw error;
    }
  }
  
  // Should not reach here, but just in case
  throw lastError || new Error(`Failed to fetch ${endpoint} after ${retries + 1} attempts`);
};

/**
 * Make a POST request to the API with proper error handling
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} data - The data to send
 * @returns {Promise<any>} - The response data
 * @throws {Error} If the request fails
 */
export const apiPost = async (endpoint, data) => {
  try {
    // Use absolute URL in development
    let url = endpoint;
    if (!url.startsWith('http')) {
      // Use localhost:3001 directly instead of relying on proxy
      url = `http://localhost:3001${endpoint}`;
    }
    
    console.log(`🚀 API POST request to: ${url}`);
    
    // Use CORS utility for fetching with proper handling
    return await fetchJSONWithCORS(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};
