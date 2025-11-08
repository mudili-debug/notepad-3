import { Router } from 'express';
import { getTemplates } from '../controllers/templatesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Templates are public-ish but we keep behind auth for workspace context
router.use(authenticateToken);

router.get('/', getTemplates);

export default router;
