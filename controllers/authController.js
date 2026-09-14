import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import logger from "../utils/logger.js";

const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    // Validate request
    if (!username || !password) {
      logger.warn("Login attempt with missing credentials");

      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      logger.warn(`Failed login attempt for username: ${username}`);

      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for username: ${username}`);

      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    logger.info(`User logged in successfully: ${user.username}`);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Login error", {
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default login;