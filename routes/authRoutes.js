import express from 'express';
import login from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/login', loginLimiter, login);

export default router;
