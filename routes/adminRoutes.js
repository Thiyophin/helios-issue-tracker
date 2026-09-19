import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createUser from '../controllers/userController.js';

const router = express.Router();

// Admin creates a new team member
router.post('/users', authenticate, authorize('admin'), createUser);

export default router;
