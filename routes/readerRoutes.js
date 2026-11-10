import express from 'express';

import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

import { ROLES } from '../utils/roles.js';

import {
  getAllUsers,
  getAllProjects,
  getAllSprints,
  getAllFeatures,
  getAllTasks,
  getAllTestCases,
  getAllTaskStatuses,
} from '../controllers/readerController.js';

const router = express.Router();

// All endpoints require an authenticated Reader
router.use(authenticate, authorize(ROLES.READER));

// GET /api/reader/users
router.get('/users', getAllUsers);

// GET /api/reader/projects
router.get('/projects', getAllProjects);

// GET /api/reader/sprints
router.get('/sprints', getAllSprints);

// GET /api/reader/features
router.get('/features', getAllFeatures);

// GET /api/reader/tasks
router.get('/tasks', getAllTasks);

// GET /api/reader/test-cases
router.get('/test-cases', getAllTestCases);

// GET /api/reader/task-statuses
router.get('/task-statuses', getAllTaskStatuses);

export default router;
