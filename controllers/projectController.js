import Project from '../models/Project.js';

export const createProject = async (req, res, next) => {
  try {
    const { name, code, completedOn } = req.body;

    const project = await Project.create({
      name,
      code,
      completedOn: completedOn || null,
    });

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};
