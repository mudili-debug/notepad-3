import { Router } from 'express';
import { runAI } from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.post('/run', runAI);

export default router;
