import express from 'express';
import passport from 'passport';

import { createSprint } from '../controllers/sprintController.js';
import authorize from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(ROLES.ADMIN, ROLES.TEAM_LEAD),
  createSprint,
);

export default router;
