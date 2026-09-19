import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import logger from '../utils/logger.js';

const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body || {};

    // Validate required fields
    if (!username || !name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Username, name, email, password and role are required',
      });
    }

    // Only these roles can be created through this endpoint
    const allowedRoles = ['team_lead', 'developer', 'tester', 'reader'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Allowed roles: team_lead, developer, tester, reader',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(409).json({
        message: 'Username already exists',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      name,
      email,
      password: hashedPassword,
      role,
    });

    logger.info(`User created by admin: ${user.username} (${user.role})`);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error creating user', {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export default createUser;
