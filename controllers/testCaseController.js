import TestCase from '../models/TestCase.js';
import Feature from '../models/Feature.js';
import logger from '../utils/logger.js';

const createTestCase = async (req, res) => {
  try {
    const { feature, title, steps } = req.body || {};

    const testerId = req.user._id;

    // Validate required fields
    if (!feature || !title || !steps) {
      return res.status(400).json({
        message: 'Feature, title and steps are required',
      });
    }

    // Steps must be an array
    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({
        message: 'Steps must be a non-empty array',
      });
    }

    // Check Feature exists
    const existingFeature = await Feature.findById(feature);

    if (!existingFeature) {
      return res.status(404).json({
        message: 'Feature not found',
      });
    }

    // Create Test Case
    const testCase = await TestCase.create({
      feature,
      title,
      steps,
      createdBy: testerId,
      assignedTo: testerId,
    });

    logger.info(`Test case created by tester: ${testerId}`);

    return res.status(201).json({
      message: 'Test case created successfully',
      testCase: {
        id: testCase._id,
        feature: testCase.feature,
        title: testCase.title,
        steps: testCase.steps,
        createdBy: testCase.createdBy,
        assignedTo: testCase.assignedTo,
        createdAt: testCase.createdAt,
        updatedAt: testCase.updatedAt,
      },
    });
  } catch (error) {
    logger.error('Error creating test case', {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export default createTestCase;
