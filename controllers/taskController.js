import User from '../models/User.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Feature from '../models/Feature.js';
import Sprint from '../models/Sprint.js';
import TaskStatus from '../models/TaskStatus.js';
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

export const changeTaskStatus = async (req, res, next) => {
  try {
    // Get task ID and requested status
    const { taskId } = req.params;
    const { status: targetStatus } = req.body || {};

    // 1. Validate task ID
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    // 2. Validate requested status
    if (typeof targetStatus !== 'string' || !targetStatus.trim()) {
      return res.status(400).json({
        message: 'A valid status is required',
      });
    }

    // 3. Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    // 4. Find feature associated with task
    const feature = await Feature.findById(task.feature).select('sprint');

    if (!feature) {
      return res.status(404).json({
        message: 'Feature not found',
      });
    }

    // 5. Find sprint associated with feature
    const sprint = await Sprint.findById(feature.sprint).select('project');

    if (!sprint) {
      return res.status(404).json({
        message: 'Sprint not found',
      });
    }

    // 6. Get task status configuration for the project
    const taskStatusConfig = await TaskStatus.findOne({
      project: sprint.project,
    });

    if (!taskStatusConfig) {
      return res.status(404).json({
        message: 'Task status configuration not found',
      });
    }

    // 7. Find requested status in project configuration
    const target = taskStatusConfig.statuses.find(
      (configuredStatus) => configuredStatus.name === targetStatus.trim(),
    );

    if (!target) {
      return res.status(400).json({
        message: 'Requested status is not configured for this project',
      });
    }

    // 8. Check if task already has the requested status
    if (task.status === target.name) {
      return res.status(400).json({
        message: 'Task is already in this status',
      });
    }

    // 9. Validate whether the transition is permitted
    if (!target.permittedPredecessorsStates.includes(task.status)) {
      return res.status(400).json({
        message: 'Status transition is not permitted',
      });
    }

    // 10. Update task status
    task.status = target.name;

    await task.save();

    // 11. Return response
    return res.status(200).json({
      message: 'Task status updated successfully',
      task: {
        id: task._id,
        status: task.status,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
