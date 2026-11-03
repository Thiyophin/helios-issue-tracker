import Feature from '../models/Feature.js';
import Sprint from '../models/Sprint.js';
import logger from '../utils/logger.js';

const createFeature = async (req, res) => {
  try {
    const { title, content, sprint } = req.body || {};

    if (!title || !content || !sprint) {
      return res.status(400).json({
        message: 'Title, content, and sprint are required',
      });
    }

    // Verify sprint exists
    const existingSprint = await Sprint.findById(sprint);

    if (!existingSprint) {
      return res.status(404).json({
        message: 'Sprint not found',
      });
    }

    // Create feature with sprint reference
    const feature = await Feature.create({
      title,
      content,
      sprint,
      createdBy: req.user._id,
    });

    logger.info(`Feature created by team lead: ${req.user._id}`);

    return res.status(201).json({
      message: 'Feature created successfully',
      feature: {
        id: feature._id,
        title: feature.title,
        content: feature.content,
        comments: feature.comments,
        sprint: feature.sprint,
        createdBy: feature.createdBy,
        createdAt: feature.createdAt,
        updatedAt: feature.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error creating feature', {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export default createFeature;
