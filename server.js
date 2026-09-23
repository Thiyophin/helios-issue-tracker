import env from './config/env.js';
import express from 'express';
import helmet from 'helmet';
import { globalLimiter } from './middleware/rateLimitMiddleware.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import featureRoutes from './routes/featureRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import testCaseRoutes from './routes/testCaseRoutes.js';
import passport from './config/passport.js';
import logger from './utils/logger.js';

const app = express();

app.use(express.json());

app.use(globalLimiter);

app.use(helmet());

app.use(passport.initialize());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/test-cases', testCaseRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API is running',
  });
});

const PORT = env.port;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${env.port}`);
});
