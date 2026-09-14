import logger from "../utils/logger.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      logger.warn(
        `Unauthorized access attempt by user: ${req.user?.userId || "unknown"}`
      );

      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

export default authorize;