import app from './config/app.js';
import { PORT } from './config/constants.js';
import logger from './utils/logger.js';

/**
 * Start the Express server
 */
const startServer = () => {
  // Start the server
  const server = app.listen(PORT, () => {
    logger.info(`API server running on http://localhost:${PORT}`);
  });

  // Add error handling for server issues
  server.on('error', (error) => {
    logger.error('Server failed to start:', error);
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${PORT} is already in use. Please try a different port.`);
    }
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
};

// Start the server
startServer();
