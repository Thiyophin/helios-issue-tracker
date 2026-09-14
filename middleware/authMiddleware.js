import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    logger.warn("Invalid or expired authentication token");

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authenticate;