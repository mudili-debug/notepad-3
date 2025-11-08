import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './utils/database';
import authRoutes from './routes/auth';
import pageRoutes from './routes/pages';
import blockRoutes from './routes/blocks';
import eventsRoutes from './routes/events';
import notificationsRoutes from './routes/notifications';
import templatesRoutes from './routes/templates';
import aiRoutes from './routes/ai';
import workspaceRoutes from './routes/workspace';
import fileRoutes from './routes/files';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Connect to database (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/files', fileRoutes);

// Error handling
app.use(errorHandler);

export default app;
