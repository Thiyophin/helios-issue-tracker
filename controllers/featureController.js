import Feature from '../models/Feature.js';
import logger from '../utils/logger.js';

const createFeature = async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required',
      });
    }

    const feature = await Feature.create({
      title,
      content,
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
