import { createContext, useContext, useState, useEffect } from 'react';
import { getStatistics, fetchStatistics, refreshStatistics } from '@/services/statistics-service';
import { apiGet } from '../lib/api-utils';

// Create context for the repository data
const RepositoryContext = createContext();

export function RepositoryProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repoTree, setRepoTree] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  
  // Function to fetch the repository tree with retry logic
  const fetchRepoTree = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('📂 Fetching repository tree...');
      // Use enhanced apiGet with retry options for JSON parsing errors
      const data = await apiGet('/api/tree', {}, { 
        retries: 2, 
        retryDelay: 800 
      });
      
      console.log('📂 Repository tree fetched successfully:', data);
      
      // Validate the tree structure to ensure it's usable
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid repository tree data structure');
      }
      
      setRepoTree(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching repository tree:', error);
      
      // Handle JSON parsing errors specifically
      let errorMessage = error.message || 'Failed to load repository tree';
      
      // Apply user-friendly error message for JSON parsing errors
      const isJsonSyntaxError = errorMessage.includes('JSON') || 
                               errorMessage.includes('Syntax') || 
                               errorMessage.includes("Expected ',' or ']'");
      
      if (isJsonSyntaxError) {
        errorMessage = 'The repository data is invalid. This might be due to a server issue.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };
  
  // Function to fetch repository statistics
  const fetchRepoStatistics = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('📊 Fetching repository statistics...');
      const data = await fetchStatistics();
      console.log('📊 Repository statistics fetched successfully');
      
      setStatistics(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error('❌ Error fetching repository statistics:', error);
      setError(error.message || 'Failed to load repository statistics');
      setLoading(false);
      return null;
    }
  };
  
  // Function to fetch file content
  const fetchFileContent = async (filePath) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      
      console.log('📄 Fetching file content:', filePath);
      const data = await apiGet('/api/file', { path: filePath });
      console.log('📄 File content fetched successfully');
      setFileContent(data);
      setSelectedFile(filePath);
      setLoading(false);
      return data;
    } catch (error) {
      console.error('❌ Error fetching file content:', error);
      setError(error.message || 'Failed to load file content');
      setLoading(false);
      return null;
    }
  };
  
  // Function to select a file
  const selectFile = async (filePath) => {
    if (filePath === selectedFile) return;
    await fetchFileContent(filePath);
  };
  
  // Function to refresh data
  const refreshData = async () => {
    await Promise.all([fetchRepoTree(), fetchRepoStatistics()]);
    if (selectedFile) {
      await fetchFileContent(selectedFile);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    // Fetch the repo tree and statistics
    (async () => {
      // First attempt to get statistics from the API
      await fetchRepoStatistics();
      
      // Then fetch the repo tree
      await fetchRepoTree();
      
      // Check if file should be loaded
      if (selectedFile) {
        await fetchFileContent(selectedFile);
      }
      
      setLoading(false);
    })();
  }, []);
  
  // Value for the context
  const value = {
    loading,
    error,
    repoTree,
    statistics,
    selectedFile,
    fileContent,
    selectFile,
    refreshData,
    fetchRepoStatistics
  };
  
  return (
    <RepositoryContext.Provider value={value}>
      {children}
    </RepositoryContext.Provider>
  );
}

// Custom hook to use the repository context
export function useRepository() {
  const context = useContext(RepositoryContext);
  if (context === undefined) {
    throw new Error('useRepository must be used within a RepositoryProvider');
  }
  return context;
}
