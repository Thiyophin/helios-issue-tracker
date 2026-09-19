import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createTask from '../controllers/taskController.js';

const router = express.Router();

router.post('/', authenticate, authorize('team_lead', 'developer'), createTask);

export default router;
