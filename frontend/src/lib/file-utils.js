// Helper component for converting file paths to URLs
import { useEffect, useState } from 'react';

export function useFilePathToUrl() {
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Get the base URL of our backend API
    const apiBaseUrl = 'http://localhost:3000';
    setBaseUrl(apiBaseUrl);
    setIsLoading(false);
  }, []);

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (isLoading) return null;
    
    // Encode the file path to be used in the URL
    const encodedPath = encodeURIComponent(filePath);
    return `${baseUrl}/api/file?path=${encodedPath}`;
  };

  return { getFileUrl, isLoading };
}
