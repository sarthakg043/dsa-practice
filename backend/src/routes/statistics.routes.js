import { Router } from 'express';
import * as statisticsController from '../controllers/statistics.controller.js';

const router = Router();

// GET /api/statistics - Get statistics data
router.get('/statistics', statisticsController.getStatistics);

// POST /api/statistics - Update statistics data
router.post('/statistics', statisticsController.updateStatistics);

export default router;
