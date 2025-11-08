import { Router } from 'express';
import {
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
} from '../controllers/blockController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/blocks?pageId=:pageId
router.get('/', getBlocks);

// POST /api/blocks
router.post('/', createBlock);

// PATCH /api/blocks/reorder
router.patch('/reorder', reorderBlocks);

// PATCH /api/blocks/:id
router.patch('/:id', updateBlock);

// DELETE /api/blocks/:id
router.delete('/:id', deleteBlock);

export default router;
