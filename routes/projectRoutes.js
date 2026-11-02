import express from 'express';
import passport from 'passport';

import { createProject } from '../controllers/projectController.js';
import authorize from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(ROLES.ADMIN),
  createProject,
);

export default router;
