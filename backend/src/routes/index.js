import { Router } from 'express';
import repositoryRoutes from './repository.routes.js';
import statisticsRoutes from './statistics.routes.js';

const router = Router();

// Register all route modules
router.use(repositoryRoutes);
router.use(statisticsRoutes);

export default router;
