import { Router } from 'express';
import * as repositoryController from '../controllers/repository.controller.js';

const router = Router();

// GET /api/tree - Get repository tree
router.get('/tree', repositoryController.getRepositoryTree);

// GET /api/file - Get file content
router.get('/file', repositoryController.getFileContent);

export default router;
