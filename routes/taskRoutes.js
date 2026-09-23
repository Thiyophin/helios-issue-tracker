import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createTask from '../controllers/taskController.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/', authenticate, authorize(ROLES.TEAM_LEAD, ROLES.DEVELOPER), createTask);

export default router;
