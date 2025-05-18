// A serverless function handler for Vercel
import app from './server.js';

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // If PORT is already in use, we'll try another one
  const startServer = (port = 3000, maxAttempts = 5, attempt = 1) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port} (from index.js)`);
    });
    
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE' && attempt < maxAttempts) {
        console.log(`Port ${port} is busy, trying port ${port + 1}`);
        server.close();
        startServer(port + 1, maxAttempts, attempt + 1);
      } else {
        console.error('Server error:', e);
      }
    });
  };
  
  startServer(process.env.PORT || 3000);
}

// Export the Express app for Vercel serverless deployment
export default app;
