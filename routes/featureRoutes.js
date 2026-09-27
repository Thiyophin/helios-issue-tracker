import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createFeature from '../controllers/featureController.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

/**
 * @openapi
 * /api/features:
 *   post:
 *     summary: Create a feature
 *     description: Create a new feature in the issue tracker.
 *     tags:
 *       - Features
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: User Authentication
 *               content:
 *                 type: string
 *                 example: Implement JWT-based authentication for users.
 *     responses:
 *       201:
 *         description: Feature created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Team lead access required
 */
router.post('/', authenticate, authorize(ROLES.TEAM_LEAD), createFeature);

export default router;
