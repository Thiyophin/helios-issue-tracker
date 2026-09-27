import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createTestCase from '../controllers/testCaseController.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

/**
 * @openapi
 * /api/test-cases:
 *   post:
 *     summary: Create a test case
 *     description: Create a test case associated with an existing feature.
 *     tags:
 *       - Test Cases
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - feature
 *               - title
 *               - steps
 *             properties:
 *               feature:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               title:
 *                 type: string
 *                 example: Verify successful login
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Open the login page
 *                   - Enter a valid username
 *                   - Enter a valid password
 *                   - Click Login
 *     responses:
 *       201:
 *         description: Test case created successfully
 *       400:
 *         description: Invalid request data or feature does not exist
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Tester access required
 */
router.post('/', authenticate, authorize(ROLES.TESTER), createTestCase);

export default router;
