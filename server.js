import "dotenv/config";

import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import testCaseRoutes from "./routes/testCaseRoutes.js";

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/test-cases", testCaseRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});