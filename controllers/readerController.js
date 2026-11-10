import mongoose from 'mongoose';

import User from '../models/User.js';
import Project from '../models/Project.js';
import Sprint from '../models/Sprint.js';
import Feature from '../models/Feature.js';
import Task from '../models/Task.js';
import TestCase from '../models/TestCase.js';
import TaskStatus from '../models/TaskStatus.js';

// Common pagination and response handler
const getPaginatedResults = async ({ req, res, model, filter = {}, populate = [] }) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).populate(populate).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

    model.countDocuments(filter),
  ]);

  return res.status(200).json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  });
};

// 1. Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    return await getPaginatedResults({
      req,
      res,
      model: User,
      filter: {},
    }).then((result) => result);
  } catch (error) {
    next(error);
  }
};

// 2. Get all projects
export const getAllProjects = async (req, res, next) => {
  try {
    return await getPaginatedResults({
      req,
      res,
      model: Project,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get all sprints
export const getAllSprints = async (req, res, next) => {
  try {
    const { project } = req.query;

    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      });
    }

    return await getPaginatedResults({
      req,
      res,
      model: Sprint,
      filter: project ? { project } : {},
      populate: [
        {
          path: 'project',
          select: 'name code',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// 4. Get all features
export const getAllFeatures = async (req, res, next) => {
  try {
    const { sprint } = req.query;

    if (sprint && !mongoose.isValidObjectId(sprint)) {
      return res.status(400).json({
        message: 'Invalid sprint ID',
      });
    }

    return await getPaginatedResults({
      req,
      res,
      model: Feature,
      filter: sprint ? { sprint } : {},
      populate: [
        {
          path: 'sprint',
          select: 'sequenceNumber project',
          populate: {
            path: 'project',
            select: 'name code',
          },
        },
        {
          path: 'createdBy',
          select: 'username name role',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// 5. Get all tasks
export const getAllTasks = async (req, res, next) => {
  try {
    const { status, feature, assignedTo } = req.query;

    if (feature && !mongoose.isValidObjectId(feature)) {
      return res.status(400).json({
        message: 'Invalid feature ID',
      });
    }

    if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({
        message: 'Invalid assigned user ID',
      });
    }

    const filter = {};

    if (status) filter.status = status;
    if (feature) filter.feature = feature;
    if (assignedTo) filter.assignedTo = assignedTo;

    return await getPaginatedResults({
      req,
      res,
      model: Task,
      filter,
      populate: [
        {
          path: 'createdBy',
          select: 'username name role',
        },
        {
          path: 'assignedTo',
          select: 'username name role',
        },
        {
          path: 'feature',
          select: 'title content sprint',
          populate: {
            path: 'sprint',
            select: 'sequenceNumber project',
            populate: {
              path: 'project',
              select: 'name code',
            },
          },
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// 6. Get all test cases
export const getAllTestCases = async (req, res, next) => {
  try {
    const { feature, assignedTo } = req.query;

    if (feature && !mongoose.isValidObjectId(feature)) {
      return res.status(400).json({
        message: 'Invalid feature ID',
      });
    }

    if (assignedTo && !mongoose.isValidObjectId(assignedTo)) {
      return res.status(400).json({
        message: 'Invalid assigned user ID',
      });
    }

    const filter = {};

    if (feature) filter.feature = feature;
    if (assignedTo) filter.assignedTo = assignedTo;

    return await getPaginatedResults({
      req,
      res,
      model: TestCase,
      filter,
      populate: [
        {
          path: 'feature',
          select: 'title content sprint',
          populate: {
            path: 'sprint',
            select: 'sequenceNumber project',
            populate: {
              path: 'project',
              select: 'name code',
            },
          },
        },
        {
          path: 'createdBy',
          select: 'username name role',
        },
        {
          path: 'assignedTo',
          select: 'username name role',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

// 7. Get all project task-status configurations
export const getAllTaskStatuses = async (req, res, next) => {
  try {
    const { project } = req.query;

    if (project && !mongoose.isValidObjectId(project)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      });
    }

    return await getPaginatedResults({
      req,
      res,
      model: TaskStatus,
      filter: project ? { project } : {},
      populate: [
        {
          path: 'project',
          select: 'name code',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};
