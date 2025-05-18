import { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Use localStorage to persist theme preference
  const [darkMode, setDarkMode] = useState(() => {
    // Check if a preference is stored
    const savedTheme = localStorage.getItem('dsa-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    } 
    // If no preference is stored, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Update the document with the current theme when it changes
  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('dsa-theme', darkMode ? 'dark' : 'light');
    
    // Update the document class list
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Provide the theme context value
  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
