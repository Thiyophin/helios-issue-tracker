import express from "express";

import authenticate from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import createFeature from "../controllers/featureController.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("team_lead"),
  createFeature
);

export default router;