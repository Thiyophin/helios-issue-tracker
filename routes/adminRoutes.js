import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createUser from '../controllers/userController.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

// Admin creates a new team member
/**
 * @openapi
 * /api/admin/users:
 *   post:
 *     summary: Create a user
 *     description: Create a new user and assign an application role.
 *     tags:
 *       - Administration
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_dev
 *               name:
 *                 type: string
 *                 example: John Developer
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass@123
 *               role:
 *                 type: string
 *                 enum:
 *                   - team_lead
 *                   - developer
 *                   - tester
 *                   - reader
 *                 example: developer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       409:
 *         description: User already exists
 */
router.post('/users', authenticate, authorize(ROLES.ADMIN), createUser);

export default router;
