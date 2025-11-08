import { Router } from 'express';
import {
  getFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
} from '../controllers/fileController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/files
router.get('/', getFiles);

// POST /api/files
router.post('/', createFile);

// GET /api/files/:id
router.get('/:id', getFile);

// PATCH /api/files/:id
router.patch('/:id', updateFile);

// DELETE /api/files/:id
router.delete('/:id', deleteFile);

export default router;
