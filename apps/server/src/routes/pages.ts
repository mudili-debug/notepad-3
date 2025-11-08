import { Router } from 'express';
import {
  getPages,
  getAllPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  searchPages,
  softDeletePage,
  restorePage,
} from '../controllers/pageController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/pages
router.get('/', getPages);

// GET /api/pages/all (includes shared pages)
router.get('/all', getAllPages);

// GET /api/pages/search?q=...
router.get('/search', searchPages);

// POST /api/pages
router.post('/', createPage);

// GET /api/pages/:id
router.get('/:id', getPage);

// PATCH /api/pages/:id
router.patch('/:id', updatePage);

// Soft-delete (move to Trash)
router.patch('/:id/soft-delete', softDeletePage);

// Restore from Trash
router.post('/:id/restore', restorePage);

// DELETE /api/pages/:id
router.delete('/:id', deletePage);

export default router;
