import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', authenticateToken, getProfile);

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  // This endpoint is handled by the cookie-based refresh token
  // The actual refresh logic is in the middleware
  res.status(200).json({ message: 'Token refresh endpoint' });
});

export default router;
