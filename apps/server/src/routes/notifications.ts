import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  createNotification,
} from '../controllers/notificationsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.post('/', createNotification);
router.post('/:id/read', markAsRead);

export default router;
