import 'dotenv/config';
import cors from 'cors';
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

const app = express();

app.use(express.json());

app.use(globalLimiter);

app.use(helmet());

app.use(passport.initialize());

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
