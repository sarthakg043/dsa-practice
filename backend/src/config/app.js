import express from 'express';
import cors from 'cors';
import routes from '../routes/index.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Register all routes
app.use('/api', routes);

// Error handling middleware (must be after routes)
app.use(errorHandler);

export default app;
