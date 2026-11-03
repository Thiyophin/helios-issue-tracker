import Project from '../models/Project.js';
import TaskStatus from '../models/TaskStatus.js';

export const createProject = async (req, res, next) => {
  let project;

  try {
    const { name, code, completedOn, statuses } = req.body || {};

    // Validate statuses
    if (!Array.isArray(statuses) || statuses.length === 0) {
      return res.status(400).json({
        message: 'A non-empty statuses array is required',
      });
    }

    // Create project
    project = await Project.create({
      name,
      code,
      completedOn: completedOn || null,
    });

    try {
      // Create task status configuration using project ID
      const taskStatus = await TaskStatus.create({
        project: project._id,
        statuses,
      });

      return res.status(201).json({
        message: 'Project created successfully',
        project,
        taskStatus,
      });
    } catch (error) {
      // Remove project if task status creation fails
      await Project.deleteOne({ _id: project._id });
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
