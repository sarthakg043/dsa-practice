import { Router } from 'express';

const router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint to verify server is running properly
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
