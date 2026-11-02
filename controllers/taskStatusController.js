import Project from '../models/Project.js';
import TaskStatus from '../models/TaskStatus.js';

export const createTaskStatus = async (req, res, next) => {
  try {
    const { project, statuses } = req.body;

    // Check whether project exists.
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    // Check whether configuration already exists.
    const existingTaskStatus = await TaskStatus.findOne({ project });

    if (existingTaskStatus) {
      return res.status(409).json({
        message: 'Task status configuration already exists for this project',
      });
    }

    const taskStatus = await TaskStatus.create({
      project,
      statuses,
    });

    return res.status(201).json({
      message: 'Task status configuration created successfully',
      taskStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { statuses } = req.body;

    const taskStatus = await TaskStatus.findOneAndUpdate(
      { project: projectId },
      { statuses },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!taskStatus) {
      return res.status(404).json({
        message: 'Task status configuration not found',
      });
    }

    return res.status(200).json({
      message: 'Task status configuration updated successfully',
      taskStatus,
    });
  } catch (error) {
    next(error);
  }
};
