import Project from '../models/Project.js';
import Sprint from '../models/Sprint.js';

export const createSprint = async (req, res, next) => {
  try {
    const { project, completedOn } = req.body;

    // Check whether project exists.
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    // Find the last sprint of this project.
    const lastSprint = await Sprint.findOne({ project })
      .sort({ sequenceNumber: -1 })
      .select('sequenceNumber');

    // Generate next sequence number.
    const sequenceNumber = lastSprint ? lastSprint.sequenceNumber + 1 : 1;

    const sprint = await Sprint.create({
      project,
      sequenceNumber,
      completedOn: completedOn || null,
    });

    return res.status(201).json({
      message: 'Sprint created successfully',
      sprint,
    });
  } catch (error) {
    next(error);
  }
};
