import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import env from '../config/env.js';
import { ROLES } from '../utils/roles.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info('MongoDB connected successfully');

    const existingAdmin = await User.findOne({
      role: ROLES.ADMIN,
    });

    if (existingAdmin) {
      logger.info('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(env.adminPassword, 12);

    await User.create({
      username: env.adminUsername,
      name: env.adminName,
      email: env.adminEmail,
      password: hashedPassword,
      role: ROLES.ADMIN,
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
