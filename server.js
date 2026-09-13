import "dotenv/config";

import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Management API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});