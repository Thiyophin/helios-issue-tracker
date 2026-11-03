import express from 'express';
import passport from 'passport';

import { createProject } from '../controllers/projectController.js';
import authorize from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Create a project and its task-status workflow
 *     description: Creates a project and saves its initial task statuses using the new project ID.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - statuses
 *             properties:
 *               name:
 *                 type: string
 *                 example: Helios Development
 *               code:
 *                 type: string
 *                 pattern: '^[a-zA-Z][a-zA-Z0-9]*$'
 *                 example: HEL
 *               completedOn:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: null
 *               statuses:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - permittedPredecessorsStates
 *                   properties:
 *                     name:
 *                       type: string
 *                       pattern: '^[a-zA-Z][a-zA-Z0-9]*$'
 *                       example: New
 *                     permittedPredecessorsStates:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *     responses:
 *       201:
 *         description: Project and task-status workflow created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Project code already exists
 */

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize(ROLES.ADMIN),
  createProject,
);

export default router;
