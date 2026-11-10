import express from 'express';
import createTask, { changeTaskStatus } from '../controllers/taskController.js';
import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a task
 *     description: Create a task associated with an existing feature.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - feature
 *             properties:
 *               title:
 *                 type: string
 *                 example: Implement login endpoint
 *               content:
 *                 type: string
 *                 example: Create the authentication endpoint and generate a JWT.
 *               feature:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               assignedTo:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid request data or feature does not exist
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 */
router.post('/', authenticate, authorize(ROLES.TEAM_LEAD, ROLES.DEVELOPER), createTask);
router.patch(
  '/:taskId/status',
  authenticate,
  authorize(ROLES.TEAM_LEAD, ROLES.DEVELOPER, ROLES.TESTER),
  changeTaskStatus,
);
export default router;
