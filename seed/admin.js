import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import logger from '../utils/logger.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    logger.info('MongoDB connected successfully');

    const existingAdmin = await User.findOne({
      role: 'admin',
    });

    if (existingAdmin) {
      logger.info('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    await User.create({
      username: process.env.ADMIN_USERNAME,
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });

    logger.info('Admin created successfully');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding admin', {
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

seedAdmin();
