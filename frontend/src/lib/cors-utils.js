// CORS handling utility for API requests
/**
 * Create a fetch request with CORS handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export async function fetchWithCORS(url, options = {}) {
  // Add CORS mode and credentials
  const fetchOptions = {
    ...options,
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      ...options.headers,
      'Accept': 'application/json',
    }
  };
  
  // For POST requests, ensure we have the Content-Type header
  if (options.method === 'POST' || options.method === 'PUT') {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    };
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    return response;
  } catch (error) {
    console.error(`CORS Error fetching ${url}:`, error);
    throw new Error(`CORS Error: ${error.message}`);
  }
}

/**
 * Create a fetch request with CORS handling and JSON parsing
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The parsed JSON response
 */
export async function fetchJSONWithCORS(url, options = {}) {
  try {
    const response = await fetchWithCORS(url, options);
    
    // Log response details for debugging
    console.log(`📨 Response status: ${response.status} ${response.statusText}`);
    console.log(`📨 Response headers:`, Object.fromEntries([...response.headers.entries()]));
    
    // Check content type
    const contentType = response.headers.get('content-type');
    console.log(`📨 Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      // Get the text response to show in the error
      const text = await response.text();
      const preview = text.substring(0, 100) + (text.length > 100 ? '...' : '');
      console.error(`❌ Expected JSON response but got ${contentType || 'no content type'}. Response: ${preview}`);
      
      // Try to parse the text as JSON before giving up
      try {
        // Some servers might return JSON without the proper content type
        const parsedData = JSON.parse(text);
        console.log('⚠️ Successfully parsed response as JSON despite incorrect content type');
        return parsedData;
      } catch (parseError) {
        // Not parseable as JSON, throw the original error
        throw new Error(`Expected JSON response but got ${contentType || 'no content type'}. Response: ${preview}`);
      }
    }
    
    // Parse JSON response
    try {
      const data = await response.json();
      
      // Check for error in the response
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status} ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error parsing JSON from ${url}:`, error);
      
      // Get the actual response text to help debug JSON parsing errors
      try {
        const responseText = await response.clone().text();
        
        // For JSON syntax errors, provide more detailed error information
        if (error instanceof SyntaxError) {
          // Find the position mentioned in the error message
          const positionMatch = error.message.match(/position (\d+)/);
          const errorPosition = positionMatch ? parseInt(positionMatch[1]) : -1;
          
          // Extract a snippet around the error position for better debugging
          let errorContext = '';
          if (errorPosition >= 0) {
            const start = Math.max(0, errorPosition - 20);
            const end = Math.min(responseText.length, errorPosition + 20);
            errorContext = responseText.substring(start, end);
            console.error(`JSON Syntax Error near position ${errorPosition}. Context: "${errorContext}"`);
          }
          
          console.error(`Complete response (first 600 chars):`, responseText.substring(0, 600));
          throw new Error(`JSON parsing error at position ${errorPosition}: ${error.message}`);
        }
        
        throw new Error(`Error parsing JSON: ${error.message}`);
      } catch (textError) {
        // If we can't even get the text, throw the original error
        throw error;
      }
    }
  } catch (error) {
    console.error(`Failed request to ${url}:`, error);
    throw error;
  }
}
