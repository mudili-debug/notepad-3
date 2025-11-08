import { Router } from 'express';
import {
  inviteUsers,
  getWorkspaceMembers,
} from '../controllers/workspaceController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);
router.post('/invite', inviteUsers);
router.get('/members', getWorkspaceMembers);

export default router;
