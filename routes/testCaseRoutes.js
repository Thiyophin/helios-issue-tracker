import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import createTestCase from '../controllers/testCaseController.js';

const router = express.Router();

router.post('/', authenticate, authorize('tester'), createTestCase);

export default router;
