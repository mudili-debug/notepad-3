import { Router, Request, Response } from 'express';
import { addClient, removeClient } from '../utils/events';
import { verifyToken } from '../utils/generateToken';
import User from '../models/User';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Optional token in query string: ?token=xxx
  try {
    const token = (req.query.token as string) || '';
    if (token) {
      const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
      const user = await User.findById((decoded as any).id);
      if (user) {
        (req as any).user = user;
      }
    }
  } catch (err) {
    // ignore invalid token for SSE
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send a comment to keep connection alive
  res.write(':ok\n\n');

  addClient(res);

  // Remove client on close
  req.on('close', () => {
    removeClient(res);
  });
});

export default router;
