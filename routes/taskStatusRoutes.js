import express from 'express';
import passport from 'passport';

import { createTaskStatus, updateTaskStatus } from '../controllers/taskStatusController.js';

import authorize from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

const taskStatusAccess = [
  passport.authenticate('jwt', { session: false }),
  authorize(ROLES.ADMIN, ROLES.TEAM_LEAD),
];

router.post('/', ...taskStatusAccess, createTaskStatus);

router.put('/:projectId', ...taskStatusAccess, updateTaskStatus);

export default router;
