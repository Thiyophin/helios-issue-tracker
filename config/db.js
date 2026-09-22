import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

export default connectDB;
