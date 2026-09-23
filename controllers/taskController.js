import Task from '../models/Task.js';
import User from '../models/User.js';
import Feature from '../models/Feature.js';
import logger from '../utils/logger.js';
import { ROLES, ASSIGNABLE_TASK_ROLES } from '../utils/roles.js';

const createTask = async (req, res) => {
  try {
    const { title, content, assignedTo, feature } = req.body || {};

    const creatorId = req.user._id;
    const creatorRole = req.user.role;

    // Validate required fields
    if (!title || !content || !feature) {
      return res.status(400).json({
        message: 'Title, content and feature are required',
      });
    }

    // Only these roles can create tasks
    if (![ROLES.TEAM_LEAD, ROLES.DEVELOPER].includes(creatorRole)) {
      return res.status(403).json({
        message: 'You are not allowed to create tasks',
      });
    }

    // Check whether the Feature exists
    const existingFeature = await Feature.findById(feature);

    if (!existingFeature) {
      return res.status(404).json({
        message: 'Feature not found',
      });
    }

    let finalAssignedTo;

    /*
     * TEAM LEAD
     *
     * Team Lead must provide the user
     * the task should be assigned to.
     */
    if (creatorRole === ROLES.TEAM_LEAD) {
      if (!assignedTo) {
        return res.status(400).json({
          message: 'Team lead must specify a developer or tester to assign the task',
        });
      }

      const assignedUser = await User.findById(assignedTo);

      if (!assignedUser) {
        return res.status(404).json({
          message: 'Assigned user not found',
        });
      }

      // Team Lead can only assign to developer or tester
      if (!ASSIGNABLE_TASK_ROLES.includes(assignedUser.role)) {
        return res.status(400).json({
          message: 'Tasks can only be assigned to a developer or tester',
        });
      }

      finalAssignedTo = assignedUser._id;
    }

    /*
     * DEVELOPER
     *
     * They cannot choose another user.
     * The task automatically belongs to themselves.
     */
    if (creatorRole === ROLES.DEVELOPER) {
      finalAssignedTo = creatorId;
    }

    // Create task
    const task = await Task.create({
      title,
      content,
      createdBy: creatorId,
      assignedTo: finalAssignedTo,
      feature,
      status: 'New',
    });

    logger.info(`Task created by ${creatorRole}: ${task._id}`);

    return res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task._id,
        title: task.title,
        content: task.content,
        comments: task.comments,
        createdBy: task.createdBy,
        assignedTo: task.assignedTo,
        feature: task.feature,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error creating task', {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export default createTask;
