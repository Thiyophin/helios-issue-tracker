import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createTestCase from '../controllers/testCaseController.js';
import { ROLES } from '../utils/roles.js';

const router = express.Router();

router.post('/', authenticate, authorize(ROLES.TESTER), createTestCase);

export default router;
